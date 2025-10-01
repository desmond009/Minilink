import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';

// Helper to issue our JWT
const issueToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// Build Google OAuth client
const getGoogleClient = () => {
	const client = new OAuth2Client({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		redirectUri: process.env.GOOGLE_REDIRECT_URI,
	});
	return client;
};

// GET /api/auth/google/url
export const getGoogleAuthUrl = asyncHandler(async (req, res) => {
	const client = getGoogleClient();
	const url = client.generateAuthUrl({
		scope: ['openid', 'email', 'profile'],
		access_type: 'offline',
		prompt: 'consent',
	});
	res.json({ success: true, url });
});

// GET /api/auth/google/callback
export const googleCallback = asyncHandler(async (req, res) => {
	const { code, error } = req.query;
	if (error) {
		return res.status(400).send('Google authentication failed');
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
	const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
	const payload = ticket.getPayload();
	if (!payload || !payload.email) {
		throw new ApiError(400, 'Unable to retrieve Google profile');
	}
	const email = payload.email.toLowerCase();
	const name = payload.name || payload.given_name || 'Google User';

	let user = await User.findOne({ email });
	if (!user) {
		user = await User.create({ name, email, password: Math.random().toString(36).slice(2) + 'A1!' });
	}
	const token = issueToken(user._id);
	const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
	const redirectUrl = `${frontendUrl}/login/success?token=${encodeURIComponent(token)}`;
	return res.redirect(302, redirectUrl);
});

// GET /api/auth/apple/url (optional helper to start web flow)
export const getAppleAuthUrl = asyncHandler(async (req, res) => {
	const url = appleSignin.getAuthorizationUrl({
		clientID: process.env.APPLE_CLIENT_ID,
		redirectUri: process.env.APPLE_REDIRECT_URI,
		scope: 'name email',
		response_mode: 'form_post',
		response_type: 'code',
		state: 'init',
	});
	res.json({ success: true, url });
});

// POST /api/auth/apple/callback (Apple posts form; also allow GET for flexibility)
export const appleCallback = asyncHandler(async (req, res) => {
	const code = req.body.code || req.query.code;
	if (!code) {
		throw new ApiError(400, 'Missing authorization code');
	}
	// Create Apple client secret on the fly
	const clientSecret = appleSignin.getClientSecret({
		clientID: process.env.APPLE_CLIENT_ID,
		teamID: process.env.APPLE_TEAM_ID,
		privateKey: process.env.APPLE_PRIVATE_KEY?.split('\\n').join('\n'),
		keyIdentifier: process.env.APPLE_KEY_ID,
		expirationTime: 15777000,
	});
	const tokenResponse = await appleSignin.getAuthorizationToken(code, {
		clientID: process.env.APPLE_CLIENT_ID,
		clientSecret,
		redirectUri: process.env.APPLE_REDIRECT_URI,
	});
	const idToken = tokenResponse.id_token;
	const claims = appleSignin.verifyIdToken(idToken, {
		audience: process.env.APPLE_CLIENT_ID,
		ignoreExpiration: false,
	});
	const email = (claims && claims.email) ? String(claims.email).toLowerCase() : undefined;
	const name = 'Apple User';
	if (!email) {
		throw new ApiError(400, 'Apple did not return an email');
	}
	let user = await User.findOne({ email });
	if (!user) {
		user = await User.create({ name, email, password: Math.random().toString(36).slice(2) + 'A1!' });
	}
	const token = issueToken(user._id);
	const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
	const redirectUrl = `${frontendUrl}/login/success?token=${encodeURIComponent(token)}`;
	return res.redirect(302, redirectUrl);
}); 