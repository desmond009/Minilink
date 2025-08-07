import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        throw new ApiError(401, "Not authorized to access this route");
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Not authorized to access this route");
    }
});

// Optional auth middleware (doesn't throw error if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
            }
        } catch (error) {
            // Token is invalid, but we don't throw error
            console.log('Invalid token in optional auth');
        }
    }

    next();
});

// Admin middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Not authorized to access this route");
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `User role ${req.user.role} is not authorized to access this route`);
        }

        next();
    };
};
