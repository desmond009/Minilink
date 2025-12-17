import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { OAuth2Client } from 'google-auth-library';

// Helper to issue JWT token
const issueToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Build Google OAuth client
const getGoogleClient = () => {
	const client = new OAuth2Client({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		redirectUri: process.env.GOOGLE_REDIRECT_URI,
	});
	return client;
};

/**
 * Get Google OAuth URL for frontend redirect
 * GET /api/oauth/google/url
 */
export const getGoogleAuthUrl = asyncHandler(async (req, res) => {
	const client = getGoogleClient();
	const url = client.generateAuthUrl({
		scope: ['openid', 'email', 'profile'],
		access_type: 'offline',
		prompt: 'consent',
	});
	res.json({ 
		success: true, 
		url 
	});
});

/**
 * Google OAuth callback handler
 * GET /api/oauth/google/callback
 */
export const googleCallback = asyncHandler(async (req, res) => {
	const { code, error } = req.query;
	
	if (error) {
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
		return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
	}
	
	if (!code) {
		throw new ApiError(400, 'Missing authorization code');
	}
	
	const client = getGoogleClient();
	const { tokens } = await client.getToken(code);
	const idToken = tokens.id_token;
	
	if (!idToken) {
		throw new ApiError(400, 'Failed to obtain id_token from Google');
	}
	
	const ticket = await client.verifyIdToken({ 
		idToken, 
		audience: process.env.GOOGLE_CLIENT_ID 
	});
	
	const payload = ticket.getPayload();
	
	if (!payload || !payload.email) {
		throw new ApiError(400, 'Unable to retrieve Google profile');
	}
	
	const email = payload.email.toLowerCase();
	const name = payload.name || payload.given_name || 'Google User';
	const avatar = payload.picture || '';
	const googleId = payload.sub;
	
	// Find or create user
	let user = await User.findOne({ 
		$or: [
			{ email },
			{ authProvider: 'google', providerId: googleId }
		]
	});
	
	if (!user) {
		// Create new user with Google auth
		user = await User.create({ 
			name, 
			email, 
			avatar,
			authProvider: 'google',
			providerId: googleId,
			isVerified: true,
			lastLogin: new Date()
		});
	} else {
		// Update existing user
		if (!user.providerId && user.authProvider === 'local') {
			// Link Google to existing local account
			user.authProvider = 'google';
			user.providerId = googleId;
		}
		
		if (avatar && !user.avatar) {
			user.avatar = avatar;
		}
		
		user.lastLogin = new Date();
		await user.save();
	}
	
	const token = issueToken(user._id);
	const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
	const redirectUrl = `${frontendUrl}/login/success?token=${encodeURIComponent(token)}`;
	
	return res.redirect(302, redirectUrl);
});

/**
 * GitHub OAuth handler (placeholder for future implementation)
 * GET /api/oauth/github/url
 */
export const getGithubAuthUrl = asyncHandler(async (req, res) => {
	// GitHub OAuth implementation would go here
	res.status(501).json({
		success: false,
		message: 'GitHub OAuth not yet implemented'
	});
});

/**
 * GitHub OAuth callback (placeholder for future implementation)
 * GET /api/oauth/github/callback
 */
export const githubCallback = asyncHandler(async (req, res) => {
	// GitHub OAuth callback implementation would go here
	res.status(501).json({
		success: false,
		message: 'GitHub OAuth not yet implemented'
	});
}); 