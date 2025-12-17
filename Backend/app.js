import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/mongo.connection.js';
import { redirectToOriginalUrl } from './src/controller/shortUrl.controller.js';
import cors from 'cors';
import morgan from 'morgan';
import {
    securityHeaders,
    apiLimiter,
    redirectLimiter,
    sanitizeData,
    preventParamPollution,
    requestLogger
} from './src/middleware/security.middleware.js';

dotenv.config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(sanitizeData);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(requestLogger);

const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

// Helper to evaluate if an origin is allowed
const isOriginAllowed = (origin) => {
  // If no whitelist configured, allow all
  if (allowedOrigins.length === 0) return true;
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    const originString = parsed.origin;
    const hostname = parsed.hostname;

    for (const pattern of allowedOrigins) {
      if (!pattern) continue;
      const p = pattern.trim();
      if (p === '*') return true;

      // Wildcard subdomain pattern, e.g., *.vercel.app
      if (p.startsWith('*.')) {
        const suffix = p.slice(1); // ".vercel.app"
        if (hostname && hostname.endsWith(suffix)) return true;
        continue;
      }

      // Exact origin match (with scheme)
      if (p.startsWith('http://') || p.startsWith('https://')) {
        if (originString === p) return true;
        continue;
      }

      // Bare hostname match
      if (hostname === p) return true;
    }
  } catch (_) {
    // If origin is malformed, deny by default below
  }

  return false;
};

const corsOptions = {
  origin: (origin, cb) => {
    if (isOriginAllowed(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept'],
  exposedHeaders: ['Content-Length','Content-Type'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prevent parameter pollution
app.use(preventParamPollution);

// Import routes
import UrlRoute from './src/routes/shortUrl.routes.js';
import AuthRoute from './src/routes/auth.routes.js';
import OAuthRoute from './src/routes/oauth.routes.js';

// Health check route (no rate limiting)
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "MiniLink API is running",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

// API Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Redirect route - high rate limit, optimized for speed
app.get("/r/:shortId", redirectLimiter, redirectToOriginalUrl);

// API Routes with rate limiting
app.use("/api/auth", apiLimiter, AuthRoute);
app.use("/api/oauth", OAuthRoute);
app.use("/api/urls", apiLimiter, UrlRoute);

// Backward compatibility for old endpoint
app.use("/api/create", apiLimiter, UrlRoute);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        console.log("🔌 Database connected successfully");
        console.log("🔒 Security middleware enabled");

        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API Base URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

startServer();
