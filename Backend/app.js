import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/mongo.connection.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import UrlRoute from './src/routes/shortUrl.routes.js';
import AuthRoute from './src/routes/auth.routes.js';

// API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/create", UrlRoute);

// Redirect route - this should be last
app.get("/:short_id", redirectFromShortUrl);

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

