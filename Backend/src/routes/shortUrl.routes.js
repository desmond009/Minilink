import express from "express";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    createShortUrl,
    getUserUrls,
    getUrlById,
    updateShortUrl,
    deleteShortUrl,
    getUrlAnalytics,
    getDashboardStats,
    downloadQRCode
} from "../controller/shortUrl.controller.js";
import {
    createUrlValidation,
    updateUrlValidation,
    deleteUrlValidation,
    getUrlByIdValidation,
    analyticsQueryValidation,
    validate
} from "../utils/validators.js";
import { urlCreationLimiter } from "../middleware/security.middleware.js";

const router = Router();

// All routes require authentication
router.use(protect);

// Dashboard statistics
router.get('/stats/dashboard', getDashboardStats);

// URL CRUD operations
router.post(
    '/',
    urlCreationLimiter,
    createUrlValidation,
    validate,
    createShortUrl
);

router.get('/', getUserUrls);

router.get(
    '/:id',
    getUrlByIdValidation,
    validate,
    getUrlById
);

router.put(
    '/:id',
    updateUrlValidation,
    validate,
    updateShortUrl
);

router.delete(
    '/:id',
    deleteUrlValidation,
    validate,
    deleteShortUrl
);

// Analytics
router.get(
    '/:id/analytics',
    getUrlByIdValidation,
    analyticsQueryValidation,
    validate,
    getUrlAnalytics
);

// QR Code download
router.get(
    '/:id/qrcode',
    getUrlByIdValidation,
    validate,
    downloadQRCode
);

export default router;
