import express from 'express';
import { getGoogleAuthUrl, googleCallback, getAppleAuthUrl, appleCallback } from '../controller/oauth.controller.js';

const router = express.Router();

// Google OAuth
router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', googleCallback);

// Apple OAuth
router.get('/apple/url', getAppleAuthUrl);
router.post('/apple/callback', appleCallback);
router.get('/apple/callback', appleCallback);

export default router; 