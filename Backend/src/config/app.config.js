import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized application configuration
 */
export const config = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    // Database
    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d'
    },

    // OAuth - Google
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI
    },

    // OAuth - GitHub (for future implementation)
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        redirectUri: process.env.GITHUB_REDIRECT_URI
    },

    // CORS
    cors: {
        origins: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        authMaxRequests: 5,
        urlCreationMax: 20
    },

    // URL Shortening
    url: {
        shortIdLength: 7,
        maxCustomAliasLength: 20,
        minCustomAliasLength: 3
    },

    // Plans
    plans: {
        free: {
            maxUrls: 100,
            maxClicksPerUrl: 10000
        },
        pro: {
            maxUrls: 1000,
            maxClicksPerUrl: 100000
        },
        enterprise: {
            maxUrls: -1, // unlimited
            maxClicksPerUrl: -1 // unlimited
        }
    },

    // Analytics
    analytics: {
        retentionDays: 90,
        maxEventsPerUrl: 100000
    }
};

/**
 * Validate required environment variables
 */
export const validateConfig = () => {
    const required = [
        'MONGODB_URI',
        'JWT_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate JWT secret strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters long for security');
    }

    console.log('✅ Configuration validated successfully');
};

export default config;
