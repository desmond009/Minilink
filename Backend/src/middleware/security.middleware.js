import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

/**
 * Security headers middleware using helmet
 */
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        }
    },
    crossOriginEmbedderPolicy: false
});

/**
 * Rate limiter for general API requests
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: false,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for URL creation
 * 20 URLs per hour
 */
export const urlCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: {
        success: false,
        message: 'URL creation limit reached. Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for redirect endpoint
 * 1000 requests per 15 minutes per IP
 */
export const redirectLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: {
        success: false,
        message: 'Too many redirect requests'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Sanitize MongoDB queries to prevent NoSQL injection
 */
export const sanitizeData = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized ${key} in request from ${req.ip}`);
    }
});

/**
 * Prevent HTTP Parameter Pollution
 */
export const preventParamPollution = hpp({
    whitelist: ['sortBy', 'sortOrder', 'page', 'limit', 'tags']
});

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        };
        
        // Log to console (in production, use proper logging service)
        if (res.statusCode >= 400) {
            console.error('Request error:', logData);
        } else {
            console.log('Request:', logData);
        }
    });
    
    next();
};

/**
 * Custom error response for rate limit
 */
export const rateLimitErrorHandler = (req, res) => {
    res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: res.getHeader('Retry-After')
    });
};
