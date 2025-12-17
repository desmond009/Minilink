import ShortUrl from "../model/shorturl.models.js";
import ClickEvent from "../model/analytics.model.js";
import User from "../model/user.model.js";
import { 
    generateShortId, 
    normalizeUrl, 
    isValidUrl, 
    isSafeUrl,
    parseUserAgent 
} from "../utils/urlHelpers.js";
import { generateQRCode } from "../utils/qrCodeGenerator.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Generate a unique short ID with collision handling
 */
const generateUniqueShortId = async (maxAttempts = 20) => {
    let attempts = 0;
    while (attempts < maxAttempts) {
        let shortId = generateShortId();
        
        // Validate generated shortId
        if (!shortId || typeof shortId !== 'string' || shortId.trim() === '') {
            attempts++;
            continue;
        }
        
        shortId = shortId.trim();
        
        // Check if it already exists
        const existing = await ShortUrl.findOne({ shortId });
        if (!existing) {
            return shortId;
        }
        
        attempts++;
    }
    
    throw new ApiError(500, "Failed to generate unique short ID after multiple attempts.");
};

/**
 * Create a shortened URL with collision-resistant short ID
 */
export const createShortUrl = async (originalUrl, userId, customAlias = null, options = {}) => {
    try {
        // Normalize and validate URL
        const normalizedUrl = normalizeUrl(originalUrl);
        
        if (!isValidUrl(normalizedUrl)) {
            throw new ApiError(400, "Invalid URL format");
        }
        
        if (!isSafeUrl(normalizedUrl)) {
            throw new ApiError(400, "URL is not allowed for security reasons");
        }
        
        // Check user exists and can create URLs
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        if (!user.canCreateUrl()) {
            throw new ApiError(403, `You have reached your plan limit of ${user.maxUrls} URLs`);
        }
        
        let shortId;
        
        // If custom alias provided, validate and use it
        if (customAlias) {
            customAlias = customAlias.trim();
            
            // Check if alias already exists
            const existingAlias = await ShortUrl.findOne({ 
                $or: [
                    { customAlias: customAlias },
                    { shortId: customAlias }
                ]
            });
            
            if (existingAlias) {
                throw new ApiError(409, "Custom alias already in use");
            }
            
            shortId = customAlias;
        } else {
            // Generate unique short ID
            shortId = await generateUniqueShortId(20);
        }
        
        // Final validation to ensure shortId is valid
        if (!shortId || typeof shortId !== 'string' || shortId.trim() === '') {
            throw new ApiError(500, "Invalid short ID. Please try again.");
        }
        
        shortId = shortId.trim();
        
        // Prepare document data
        const shortUrlData = {
            shortId: shortId,
            originalUrl: normalizedUrl,
            customAlias: customAlias || null,
            user: userId,
            expiresAt: options.expiresAt || null,
            metadata: {
                title: options.title || null,
                description: options.description || null,
                tags: options.tags || []
            }
        };
        
        // Try to create the document with retry logic for duplicate key errors
        let shortUrl;
        let createAttempts = 0;
        const maxCreateAttempts = 3;
        
        while (createAttempts < maxCreateAttempts) {
            try {
                shortUrl = await ShortUrl.create(shortUrlData);
                break; // Success, exit retry loop
            } catch (dbError) {
                createAttempts++;
                
                // Handle duplicate key error
                if (dbError.code === 11000 || dbError.code === 11001) {
                    const errorMessage = dbError.message || '';
                    
                    // Check if it's a null shortId duplicate error
                    if (errorMessage.includes('short_id') && errorMessage.includes('null')) {
                        // Database has corrupted entries with null shortId
                        // Try to generate a new shortId and retry (only if not using custom alias)
                        if (!customAlias && createAttempts < maxCreateAttempts) {
                            console.warn(`Duplicate key error for null shortId detected (attempt ${createAttempts}). Generating new ID...`);
                            shortId = await generateUniqueShortId(20);
                            shortUrlData.shortId = shortId;
                            continue; // Retry with new ID
                        } else {
                            throw new ApiError(500, "Database contains invalid entries. Please contact support or run cleanup script.");
                        }
                    } else if (errorMessage.includes('shortId') || errorMessage.includes('short_id')) {
                        // Regular duplicate shortId error - should not happen, but handle it
                        if (!customAlias && createAttempts < maxCreateAttempts) {
                            console.warn(`Duplicate shortId detected (attempt ${createAttempts}). Generating new ID...`);
                            shortId = await generateUniqueShortId(20);
                            shortUrlData.shortId = shortId;
                            continue; // Retry with new ID
                        } else {
                            throw new ApiError(409, customAlias ? "Custom alias already in use." : "Short ID already exists. Please try again.");
                        }
                    } else if (errorMessage.includes('customAlias')) {
                        // Duplicate customAlias error
                        throw new ApiError(409, "Custom alias already in use.");
                    } else {
                        // Unknown duplicate key error
                        throw new ApiError(409, "Duplicate entry detected. Please try again.");
                    }
                } else {
                    // Non-duplicate-key error, don't retry
                    throw dbError;
                }
            }
        }
        
        // If we exhausted all retry attempts
        if (!shortUrl) {
            throw new ApiError(500, "Failed to create short URL after multiple attempts. Please try again.");
        }
        
        // Generate QR code
        const baseUrl = process.env.APP_URL || 'https://mini.lk';
        const fullShortUrl = `${baseUrl}/r/${shortId}`;
        const qrCodeDataUrl = await generateQRCode(fullShortUrl);
        
        // Update with QR code
        shortUrl.qrCode = qrCodeDataUrl;
        await shortUrl.save();
        
        // Increment user's URL count
        await user.incrementUrlCount();
        
        return shortUrl;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to create short URL: ${error.message}`);
    }
};

/**
 * Get original URL by short ID
 */
export const getOriginalUrl = async (shortId) => {
    try {
        const shortUrl = await ShortUrl.findOne({ 
            shortId, 
            isActive: true 
        });
        
        if (!shortUrl) {
            return null;
        }
        
        // Check if URL has expired
        if (shortUrl.expiresAt && shortUrl.expiresAt < new Date()) {
            shortUrl.isActive = false;
            await shortUrl.save();
            return null;
        }
        
        return shortUrl;
    } catch (error) {
        throw new ApiError(500, `Failed to retrieve URL: ${error.message}`);
    }
};

/**
 * Record a click event and update analytics
 */
export const recordClick = async (shortUrlId, userId, requestData = {}) => {
    try {
        // Increment click count atomically
        await ShortUrl.findByIdAndUpdate(
            shortUrlId,
            { $inc: { clicks: 1 } }
        );
        
        // Extract device info from user agent
        const deviceInfo = parseUserAgent(requestData.userAgent);
        
        // Create click event for analytics
        const clickEvent = await ClickEvent.create({
            shortUrl: shortUrlId,
            user: userId,
            timestamp: new Date(),
            ipAddress: requestData.ipAddress || null,
            userAgent: requestData.userAgent || null,
            referrer: requestData.referrer || null,
            country: requestData.country || null,
            device: deviceInfo
        });
        
        return clickEvent;
    } catch (error) {
        // Log error but don't fail the redirect
        console.error('Failed to record click:', error.message);
    }
};

/**
 * Get user's URLs with pagination and filtering
 */
export const getUserUrls = async (userId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            isActive = null
        } = options;
        
        const skip = (page - 1) * limit;
        
        const query = { user: userId };
        if (isActive !== null) {
            query.isActive = isActive;
        }
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        const urls = await ShortUrl.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .select('-__v');
        
        const total = await ShortUrl.countDocuments(query);
        
        return {
            urls,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    } catch (error) {
        throw new ApiError(500, `Failed to fetch URLs: ${error.message}`);
    }
};

/**
 * Update a short URL
 */
export const updateShortUrl = async (urlId, userId, updateData) => {
    try {
        const shortUrl = await ShortUrl.findOne({ _id: urlId, user: userId });
        
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }
        
        // Update allowed fields
        if (updateData.originalUrl) {
            const normalizedUrl = normalizeUrl(updateData.originalUrl);
            if (!isValidUrl(normalizedUrl) || !isSafeUrl(normalizedUrl)) {
                throw new ApiError(400, "Invalid URL");
            }
            shortUrl.originalUrl = normalizedUrl;
        }
        
        if (updateData.isActive !== undefined) {
            shortUrl.isActive = updateData.isActive;
        }
        
        if (updateData.metadata) {
            shortUrl.metadata = {
                ...shortUrl.metadata,
                ...updateData.metadata
            };
        }
        
        await shortUrl.save();
        
        return shortUrl;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to update URL: ${error.message}`);
    }
};

/**
 * Delete a short URL
 */
export const deleteShortUrl = async (urlId, userId) => {
    try {
        const shortUrl = await ShortUrl.findOneAndDelete({ 
            _id: urlId, 
            user: userId 
        });
        
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }
        
        // Delete associated analytics
        await ClickEvent.deleteMany({ shortUrl: urlId });
        
        // Decrement user's URL count
        await User.findByIdAndUpdate(userId, { 
            $inc: { urlsCreated: -1 } 
        });
        
        return shortUrl;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to delete URL: ${error.message}`);
    }
};

/**
 * Get analytics for a specific URL
 */
export const getUrlAnalytics = async (urlId, userId, options = {}) => {
    try {
        const shortUrl = await ShortUrl.findOne({ _id: urlId, user: userId });
        
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }
        
        const {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            endDate = new Date()
        } = options;
        
        // Get click events for date range
        const clickEvents = await ClickEvent.find({
            shortUrl: urlId,
            timestamp: { $gte: startDate, $lte: endDate }
        }).sort({ timestamp: -1 });
        
        // Aggregate analytics
        const analytics = {
            totalClicks: shortUrl.clicks,
            clicksInRange: clickEvents.length,
            clicksByDate: {},
            clicksByDevice: {},
            clicksByBrowser: {},
            clicksByOS: {},
            clicksByCountry: {},
            topReferrers: {}
        };
        
        // Process click events
        clickEvents.forEach(click => {
            // By date
            const date = click.timestamp.toISOString().split('T')[0];
            analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;
            
            // By device
            const deviceType = click.device.type;
            analytics.clicksByDevice[deviceType] = (analytics.clicksByDevice[deviceType] || 0) + 1;
            
            // By browser
            const browser = click.device.browser;
            if (browser && browser !== 'unknown') {
                analytics.clicksByBrowser[browser] = (analytics.clicksByBrowser[browser] || 0) + 1;
            }
            
            // By OS
            const os = click.device.os;
            if (os && os !== 'unknown') {
                analytics.clicksByOS[os] = (analytics.clicksByOS[os] || 0) + 1;
            }
            
            // By country
            if (click.country) {
                analytics.clicksByCountry[click.country] = (analytics.clicksByCountry[click.country] || 0) + 1;
            }
            
            // By referrer
            if (click.referrer) {
                analytics.topReferrers[click.referrer] = (analytics.topReferrers[click.referrer] || 0) + 1;
            }
        });
        
        return {
            url: shortUrl,
            analytics,
            dateRange: { startDate, endDate }
        };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to get analytics: ${error.message}`);
    }
};

/**
 * Get dashboard statistics for a user
 */
export const getDashboardStats = async (userId) => {
    try {
        const totalUrls = await ShortUrl.countDocuments({ user: userId });
        const activeUrls = await ShortUrl.countDocuments({ user: userId, isActive: true });
        
        const urlsWithClicks = await ShortUrl.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: '$clicks' }
                }
            }
        ]);
        
        const totalClicks = urlsWithClicks[0]?.totalClicks || 0;
        
        // Get recent clicks (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentClicks = await ClickEvent.countDocuments({
            user: userId,
            timestamp: { $gte: sevenDaysAgo }
        });
        
        // Get top performing URLs
        const topUrls = await ShortUrl.find({ user: userId })
            .sort({ clicks: -1 })
            .limit(5)
            .select('shortId originalUrl clicks createdAt');
        
        return {
            totalUrls,
            activeUrls,
            totalClicks,
            recentClicks,
            topUrls
        };
    } catch (error) {
        throw new ApiError(500, `Failed to get dashboard stats: ${error.message}`);
    }
};
