import { body, param, query, validationResult } from 'express-validator';
import { isValidUrl, isValidCustomAlias } from './urlHelpers.js';

// Validation middleware to check for errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// User registration validation
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// User login validation
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// URL creation validation
export const createUrlValidation = [
    body('originalUrl')
        .trim()
        .notEmpty().withMessage('Original URL is required')
        .custom((value) => {
            if (!isValidUrl(value)) {
                throw new Error('Please provide a valid URL');
            }
            return true;
        }),
    body('customAlias')
        .optional()
        .trim()
        .custom((value) => {
            if (value && !isValidCustomAlias(value)) {
                throw new Error('Custom alias must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores');
            }
            return true;
        }),
    body('expiresAt')
        .optional()
        .isISO8601().withMessage('Expiration date must be a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
    body('metadata.title')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('metadata.description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('metadata.tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags.length > 10) {
                throw new Error('Maximum 10 tags allowed');
            }
            return true;
        })
];

// URL update validation
export const updateUrlValidation = [
    param('id')
        .notEmpty().withMessage('URL ID is required')
        .isMongoId().withMessage('Invalid URL ID'),
    body('originalUrl')
        .optional()
        .trim()
        .custom((value) => {
            if (value && !isValidUrl(value)) {
                throw new Error('Please provide a valid URL');
            }
            return true;
        }),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    body('metadata.title')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('metadata.description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// URL deletion validation
export const deleteUrlValidation = [
    param('id')
        .notEmpty().withMessage('URL ID is required')
        .isMongoId().withMessage('Invalid URL ID')
];

// Get URL by ID validation
export const getUrlByIdValidation = [
    param('id')
        .notEmpty().withMessage('URL ID is required')
        .isMongoId().withMessage('Invalid URL ID')
];

// Short ID validation
export const shortIdValidation = [
    param('shortId')
        .notEmpty().withMessage('Short ID is required')
        .isLength({ min: 3, max: 20 }).withMessage('Invalid short ID')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid short ID format')
];

// Analytics query validation
export const analyticsQueryValidation = [
    query('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date'),
    query('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
];

// Profile update validation
export const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
];

// Password change validation
export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];
