import express from 'express';
import { 
    getGoogleAuthUrl, 
    googleCallback,
    getGithubAuthUrl,
    githubCallback
} from '../controller/oauth.controller.js';

const router = express.Router();

// Google OAuth
router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', googleCallback);

// GitHub OAuth (placeholder for future implementation)
router.get('/github/url', getGithubAuthUrl);
router.get('/github/callback', githubCallback);

export default router; 