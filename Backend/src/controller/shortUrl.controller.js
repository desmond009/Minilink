import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as urlService from "../services/shortUrl.services.js";
import { generateQRCodeBuffer } from "../utils/qrCodeGenerator.js";

/**
 * Create a new short URL
 * POST /api/urls
 * 
 * Response returns ONLY shortId - frontend constructs full URL
 */
export const createShortUrl = asyncHandler(async (req, res) => {
    const { originalUrl, expiresAt, metadata } = req.body;
    const userId = req.user._id;

    const options = {
        expiresAt: expiresAt || null,
        title: metadata?.title || null,
        description: metadata?.description || null,
        tags: metadata?.tags || []
    };

    const shortUrl = await urlService.createShortUrl(
        originalUrl, 
        userId, 
        options
    );

    res.status(201).json({
        success: true,
        message: "Short URL created successfully",
        data: {
            id: shortUrl._id,
            shortId: shortUrl.shortId,
            originalUrl: shortUrl.originalUrl,
            // Frontend will construct: `${process.env.BASE_DOMAIN}/${shortId}`
            qrCode: shortUrl.qrCode,
            clicks: shortUrl.clicks,
            isActive: shortUrl.isActive,
            expiresAt: shortUrl.expiresAt,
            metadata: shortUrl.metadata,
            createdAt: shortUrl.createdAt,
            updatedAt: shortUrl.updatedAt
        }
    });
});

/**
 * Get all URLs for authenticated user
 * GET /api/urls
 */
export const getUserUrls = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page, limit, sortBy, sortOrder, isActive } = req.query;

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
        isActive: isActive !== undefined ? isActive === 'true' : null
    };

    const result = await urlService.getUserUrls(userId, options);

    res.status(200).json({
        success: true,
        message: "URLs fetched successfully",
        data: result.urls.map(url => ({
            id: url._id,
            shortId: url.shortId,
            originalUrl: url.originalUrl,
            customAlias: url.customAlias,
            clicks: url.clicks,
            isActive: url.isActive,
            expiresAt: url.expiresAt,
            metadata: url.metadata,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        })),
        pagination: result.pagination
    });
});

/**
 * Get a specific URL by ID
 * GET /api/urls/:id
 */
export const getUrlById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const shortUrl = await urlService.getUrlById(id, userId);

    if (!shortUrl) {
        throw new ApiError(404, "URL not found");
    }

    res.status(200).json({
        success: true,
        data: {
            id: shortUrl._id,
            shortId: shortUrl.shortId,
            originalUrl: shortUrl.originalUrl,
            qrCode: shortUrl.qrCode,
            customAlias: shortUrl.customAlias,
            clicks: shortUrl.clicks,
            isActive: shortUrl.isActive,
            expiresAt: shortUrl.expiresAt,
            metadata: shortUrl.metadata,
            createdAt: shortUrl.createdAt,
            updatedAt: shortUrl.updatedAt
        }
    });
});

/**
 * Update a short URL
 * PUT /api/urls/:id
 */
export const updateShortUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const shortUrl = await urlService.updateShortUrl(id, userId, updateData);

    res.status(200).json({
        success: true,
        message: "URL updated successfully",
        data: {
            id: shortUrl._id,
            shortId: shortUrl.shortId,
            originalUrl: shortUrl.originalUrl,
            customAlias: shortUrl.customAlias,
            clicks: shortUrl.clicks,
            isActive: shortUrl.isActive,
            expiresAt: shortUrl.expiresAt,
            metadata: shortUrl.metadata,
            createdAt: shortUrl.createdAt,
            updatedAt: shortUrl.updatedAt
        }
    });
});

/**
 * Delete a short URL
 * DELETE /api/urls/:id
 */
export const deleteShortUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    await urlService.deleteShortUrl(id, userId);

    res.status(200).json({
        success: true,
        message: "URL deleted successfully"
    });
});

/**
 * ULTRA-FAST REDIRECT ROUTE
 * GET /:shortId or GET /r/:shortId
 * 
 * Optimized for speed:
 * - Minimal database query (only shortId + isActive)
 * - HTTP 301 Moved Permanently for SEO and browser caching
 * - Async click recording (fire-and-forget)
 */
export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params;

    // Validate shortId format to prevent injection
    if (!shortId || typeof shortId !== 'string' || !/^[a-z0-9_-]{3,20}$/.test(shortId.toLowerCase())) {
        throw new ApiError(400, "Invalid short URL format");
    }

    // Fast lookup with minimal data
    const shortUrl = await urlService.getOriginalUrl(shortId);

    if (!shortUrl) {
        throw new ApiError(404, "Short URL not found or expired");
    }

    // Check if expired
    if (shortUrl.isExpired && shortUrl.isExpired()) {
        throw new ApiError(410, "Short URL has expired");
    }

    // Record click event asynchronously (fire and forget)
    const clickData = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || req.headers['referrer'],
        timestamp: new Date()
    };

    urlService.recordClick(shortUrl._id, shortUrl.user, clickData)
        .catch(err => console.error('Error recording click:', err));

    // 301 Moved Permanently for SEO and caching
    res.redirect(301, shortUrl.originalUrl);
});

/**
 * Get analytics for a specific URL
 * GET /api/urls/:id/analytics
 */
export const getUrlAnalytics = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const options = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
    };

    const analytics = await urlService.getUrlAnalytics(id, userId, options);

    res.status(200).json({
        success: true,
        message: "Analytics fetched successfully",
        data: analytics
    });
});

/**
 * Get dashboard statistics
 * GET /api/urls/stats/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const stats = await urlService.getDashboardStats(userId);

    res.status(200).json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: {
            totalUrls: stats.totalUrls,
            totalClicks: stats.totalClicks,
            activeUrls: stats.activeUrls,
            expiredUrls: stats.expiredUrls,
            topUrls: stats.topUrls.map(url => ({
                id: url._id,
                shortId: url.shortId,
                originalUrl: url.originalUrl,
                clicks: url.clicks,
                createdAt: url.createdAt
            }))
        }
    });
});

/**
 * Download QR code for a URL
 * GET /api/urls/:id/qrcode
 */
export const downloadQRCode = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const { format = 'png' } = req.query;

    // Get the URL to verify ownership
    const shortUrl = await urlService.getUrlById(id, userId);

    if (!shortUrl) {
        throw new ApiError(404, "URL not found");
    }

    // Construct short URL without hardcoding domain
    const baseDomain = process.env.BASE_DOMAIN || 'mini.lk';
    const fullShortUrl = `https://${baseDomain}/${shortUrl.shortId}`;

    if (format === 'png') {
        const qrBuffer = await generateQRCodeBuffer(fullShortUrl);
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="qrcode-${shortUrl.shortId}.png"`
        });
        res.send(qrBuffer);
    } else {
        // Return the stored data URL
        res.status(200).json({
            success: true,
            data: {
                qrCode: shortUrl.qrCode,
                shortId: shortUrl.shortId
            }
        });
    }
});
