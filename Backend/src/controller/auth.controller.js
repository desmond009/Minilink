import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
    };

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: userResponse,
        token
    });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
    };

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: userResponse,
        token
    });
});

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is already populated by the protect middleware
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt
    };

    res.status(200).json({
        success: true,
        data: userResponse
    });
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
        if (existingUser) {
            throw new ApiError(400, "Email is already taken");
        }
        user.email = email;
    }

    await user.save();

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt
    };

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: userResponse
    });
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Please provide current and new password");
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});

// Logout User (Client-side token removal)
const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    logoutUser
};
