import ClickEvent from "../model/analytics.model.js";
import ShortUrl from "../model/shorturl.models.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get click events for a specific URL within a date range
 */
export const getClickEvents = async (shortUrlId, userId, options = {}) => {
    try {
        const {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate = new Date(),
            limit = 100,
            page = 1
        } = options;

        // Verify URL ownership
        const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, user: userId });
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }

        const skip = (page - 1) * limit;

        const clicks = await ClickEvent.find({
            shortUrl: shortUrlId,
            timestamp: { $gte: startDate, $lte: endDate }
        })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await ClickEvent.countDocuments({
            shortUrl: shortUrlId,
            timestamp: { $gte: startDate, $lte: endDate }
        });

        return {
            clicks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch click events: ${error.message}`);
    }
};

/**
 * Get aggregated analytics for a user's URLs
 */
export const getUserAnalyticsSummary = async (userId, options = {}) => {
    try {
        const {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate = new Date()
        } = options;

        // Get all user's URLs
        const userUrls = await ShortUrl.find({ user: userId }).select('_id');
        const urlIds = userUrls.map(url => url._id);

        // Aggregate click data
        const clickStats = await ClickEvent.aggregate([
            {
                $match: {
                    shortUrl: { $in: urlIds },
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: 1 },
                    uniqueDevices: { $addToSet: '$device.type' },
                    uniqueBrowsers: { $addToSet: '$device.browser' },
                    uniqueCountries: { $addToSet: '$country' }
                }
            }
        ]);

        const stats = clickStats[0] || {
            totalClicks: 0,
            uniqueDevices: [],
            uniqueBrowsers: [],
            uniqueCountries: []
        };

        // Get clicks by date
        const clicksByDate = await ClickEvent.aggregate([
            {
                $match: {
                    shortUrl: { $in: urlIds },
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get top performing URLs
        const topUrls = await ClickEvent.aggregate([
            {
                $match: {
                    shortUrl: { $in: urlIds },
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$shortUrl',
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { clicks: -1 } },
            { $limit: 5 }
        ]);

        // Populate URL details
        const topUrlsWithDetails = await Promise.all(
            topUrls.map(async (item) => {
                const url = await ShortUrl.findById(item._id).select('shortId originalUrl');
                return {
                    shortId: url?.shortId,
                    originalUrl: url?.originalUrl,
                    clicks: item.clicks
                };
            })
        );

        return {
            summary: {
                totalClicks: stats.totalClicks,
                uniqueDeviceTypes: stats.uniqueDevices.filter(Boolean).length,
                uniqueBrowsers: stats.uniqueBrowsers.filter(Boolean).length,
                uniqueCountries: stats.uniqueCountries.filter(Boolean).length
            },
            clicksByDate: clicksByDate.map(item => ({
                date: item._id,
                clicks: item.count
            })),
            topUrls: topUrlsWithDetails,
            dateRange: { startDate, endDate }
        };
    } catch (error) {
        throw new ApiError(500, `Failed to fetch analytics summary: ${error.message}`);
    }
};

/**
 * Get device distribution analytics
 */
export const getDeviceDistribution = async (shortUrlId, userId) => {
    try {
        // Verify URL ownership
        const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, user: userId });
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }

        const distribution = await ClickEvent.aggregate([
            { $match: { shortUrl: shortUrlId } },
            {
                $group: {
                    _id: '$device.type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return distribution.map(item => ({
            deviceType: item._id || 'unknown',
            clicks: item.count
        }));
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch device distribution: ${error.message}`);
    }
};

/**
 * Get browser distribution analytics
 */
export const getBrowserDistribution = async (shortUrlId, userId) => {
    try {
        // Verify URL ownership
        const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, user: userId });
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }

        const distribution = await ClickEvent.aggregate([
            { $match: { shortUrl: shortUrlId } },
            {
                $group: {
                    _id: '$device.browser',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return distribution.map(item => ({
            browser: item._id || 'unknown',
            clicks: item.count
        }));
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch browser distribution: ${error.message}`);
    }
};

/**
 * Get geographic distribution analytics
 */
export const getGeographicDistribution = async (shortUrlId, userId) => {
    try {
        // Verify URL ownership
        const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, user: userId });
        if (!shortUrl) {
            throw new ApiError(404, "URL not found");
        }

        const distribution = await ClickEvent.aggregate([
            { $match: { shortUrl: shortUrlId, country: { $ne: null } } },
            {
                $group: {
                    _id: '$country',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        return distribution.map(item => ({
            country: item._id,
            clicks: item.count
        }));
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to fetch geographic distribution: ${error.message}`);
    }
};

/**
 * Clean up old analytics data (for maintenance)
 */
export const cleanupOldAnalytics = async (daysToKeep = 90) => {
    try {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
        
        const result = await ClickEvent.deleteMany({
            timestamp: { $lt: cutoffDate }
        });

        return {
            deletedCount: result.deletedCount,
            cutoffDate
        };
    } catch (error) {
        throw new ApiError(500, `Failed to cleanup analytics: ${error.message}`);
    }
};
