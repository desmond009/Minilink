import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    logoutUser
} from '../controller/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation,
    validate
} from '../utils/validators.js';
import { authLimiter } from '../middleware/security.middleware.js';

const router = express.Router();

// Public routes with rate limiting
router.post(
    '/register',
    authLimiter,
    registerValidation,
    validate,
    registerUser
);

router.post(
    '/login',
    authLimiter,
    loginValidation,
    validate,
    loginUser
);

router.post('/logout', logoutUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

router.put(
    '/profile',
    protect,
    updateProfileValidation,
    validate,
    updateUserProfile
);

router.put(
    '/change-password',
    protect,
    changePasswordValidation,
    validate,
    changePassword
);

export default router;
