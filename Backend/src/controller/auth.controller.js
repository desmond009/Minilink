import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
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
        password,
        authProvider: 'local',
        isVerified: true // Auto-verify for now, can add email verification later
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        urlsCreated: user.urlsCreated,
        maxUrls: user.maxUrls,
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
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if user signed up with OAuth
    if (user.authProvider !== 'local') {
        throw new ApiError(400, `This account uses ${user.authProvider} login. Please use ${user.authProvider} to sign in.`);
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        urlsCreated: user.urlsCreated,
        maxUrls: user.maxUrls,
        isVerified: user.isVerified,
        avatar: user.avatar,
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
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        urlsCreated: user.urlsCreated,
        maxUrls: user.maxUrls,
        isVerified: user.isVerified,
        avatar: user.avatar,
        authProvider: user.authProvider,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
    };

    res.status(200).json({
        success: true,
        data: userResponse
    });
});

// Update User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, avatar } = req.body;

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
    if (avatar) user.avatar = avatar;

    await user.save();

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        urlsCreated: user.urlsCreated,
        maxUrls: user.maxUrls,
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
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user uses local auth
    if (user.authProvider !== 'local') {
        throw new ApiError(400, "Cannot change password for OAuth accounts");
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

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});
