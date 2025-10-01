import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/mongo.connection.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import cors from 'cors';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // If no whitelist configured, allow all
    if (allowedOrigins.length === 0) return cb(null, true);
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import UrlRoute from './src/routes/shortUrl.routes.js';
import AuthRoute from './src/routes/auth.routes.js';
import OAuthRoute from './src/routes/oauth.routes.js';

// API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/oauth", OAuthRoute);
app.use("/api/create", UrlRoute);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "MiniLink API is running",
    version: "1.0.0"
  });
});

// Redirect route - now namespaced to avoid SPA route collisions
app.get("/r/:short_id", redirectFromShortUrl);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        console.log("🔌 DB connected successfully");

        app.listen(PORT, () => {
            console.log(`✅ Server is running at http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
