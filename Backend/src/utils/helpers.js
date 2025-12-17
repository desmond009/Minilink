/**
 * API Response Formatter
 */
export class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static created(res, data, message = 'Created successfully') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    static noContent(res) {
        return res.status(204).send();
    }
}

/**
 * Pagination Helper
 */
export const paginate = (page = 1, limit = 10) => {
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    return {
        page: parsedPage,
        limit: parsedLimit,
        skip
    };
};

/**
 * Build pagination response
 */
export const buildPaginationResponse = (data, total, page, limit) => {
    return {
        data,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
};

/**
 * Sleep utility for rate limiting or delays
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate random string
 */
export const generateRandomString = (length = 10) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Format date for consistent API responses
 */
export const formatDate = (date) => {
    return new Date(date).toISOString();
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (part, total) => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
};

/**
 * Truncate string
 */
export const truncateString = (str, maxLength = 50) => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
    return /^[a-f\d]{24}$/i.test(id);
};

/**
 * Remove undefined/null values from object
 */
export const removeEmpty = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null && v !== '')
    );
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Get client IP address
 */
export const getClientIp = (req) => {
    return req.ip || 
           req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           'unknown';
};

/**
 * Get base URL from request
 */
export const getBaseUrl = (req) => {
    return process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
};

/**
 * Sort object keys alphabetically
 */
export const sortObjectKeys = (obj) => {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
};

/**
 * Retry async function with exponential backoff
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(delay * Math.pow(2, i));
        }
    }
};

/**
 * Convert bytes to human readable format
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Check if string is JSON
 */
export const isJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Generate slug from string
 */
export const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
