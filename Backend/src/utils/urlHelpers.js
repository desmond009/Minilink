import { customAlphabet } from 'nanoid';

// Base62 alphabet (0-9, a-z, A-Z) - URL safe
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Generate short ID with nanoid (collision-resistant)
export const generateShortId = customAlphabet(ALPHABET, 7);

// Validate URL format
export const isValidUrl = (url) => {
    try {
        const urlObj = new URL(url);
        // Only allow http and https protocols
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
        return false;
    }
};

// Validate custom alias
export const isValidCustomAlias = (alias) => {
    // 3-20 characters, alphanumeric, hyphens, underscores only
    const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    
    // Reserved keywords that cannot be used as aliases
    const reservedKeywords = [
        'api', 'admin', 'dashboard', 'login', 'signup', 'register',
        'auth', 'logout', 'profile', 'settings', 'help', 'about',
        'contact', 'terms', 'privacy', 'pricing', 'docs', 'blog',
        'home', 'static', 'public', 'assets', 'images', 'css', 'js',
        'r', 'redirect', 'qr', 'analytics', 'stats', 'url', 'link'
    ];
    
    if (!aliasRegex.test(alias)) {
        return false;
    }
    
    if (reservedKeywords.includes(alias.toLowerCase())) {
        return false;
    }
    
    return true;
};

// Normalize URL (add protocol if missing, remove trailing slash)
export const normalizeUrl = (url) => {
    let normalizedUrl = url.trim();
    
    // Add https:// if no protocol specified
    if (!normalizedUrl.match(/^[a-zA-Z]+:\/\//)) {
        normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Remove trailing slash
    normalizedUrl = normalizedUrl.replace(/\/$/, '');
    
    return normalizedUrl;
};

// Extract domain from URL
export const extractDomain = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (error) {
        return null;
    }
};

// Check if URL is safe (not malicious)
export const isSafeUrl = (url) => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        
        // Block localhost and internal IPs for security
        const blockedPatterns = [
            'localhost',
            '127.0.0.1',
            '0.0.0.0',
            '::1',
            '10.',
            '192.168.',
            '172.16.',
            '172.17.',
            '172.18.',
            '172.19.',
            '172.20.',
            '172.21.',
            '172.22.',
            '172.23.',
            '172.24.',
            '172.25.',
            '172.26.',
            '172.27.',
            '172.28.',
            '172.29.',
            '172.30.',
            '172.31.'
        ];
        
        for (const pattern of blockedPatterns) {
            if (hostname.includes(pattern)) {
                return false;
            }
        }
        
        return true;
    } catch (error) {
        return false;
    }
};

// Parse user agent to extract device info
export const parseUserAgent = (userAgent) => {
    if (!userAgent) {
        return {
            type: 'unknown',
            os: 'unknown',
            browser: 'unknown'
        };
    }
    
    const ua = userAgent.toLowerCase();
    
    // Detect device type
    let type = 'desktop';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
        type = 'tablet';
    } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)) {
        type = 'mobile';
    }
    
    // Detect OS
    let os = 'unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    
    // Detect browser
    let browser = 'unknown';
    if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opera')) browser = 'Opera';
    
    return { type, os, browser };
};

// Generate QR code friendly short URL
export const generateQRFriendlyUrl = (baseUrl, shortId) => {
    return `${baseUrl}/r/${shortId}`;
};
