import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema({
    // Core short URL identifier - collision resistant
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => /^[a-z0-9_-]{3,20}$/.test(v),
            message: 'shortId must be 3-20 characters, alphanumeric with hyphens/underscores'
        }
    },
    
    // Original URL to redirect to
    originalUrl: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => /^https?:\/\/.+/.test(v),
            message: 'Must be a valid HTTP/HTTPS URL'
        }
    },
    
    // Optional custom alias (for user-friendly links)
    customAlias: {
        type: String,
        sparse: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    
    // URL owner
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    
    // Analytics: click count
    clicks: {
        type: Number,
        default: 0,
        index: true
    },
    
    // Status management
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    
    // Expiration date for temporary links
    expiresAt: {
        type: Date,
        default: null,
        index: true
    },
    
    // QR code data (data URL or URL)
    qrCode: {
        type: String,
        default: null
    },
    
    // Metadata for SEO and organization
    metadata: {
        title: String,
        description: String,
        tags: [String]
    }
}, { 
    timestamps: true 
});

// ==================== INDEXES FOR PERFORMANCE ====================
// Compound index for user's URLs sorted by creation date
shortUrlSchema.index({ user: 1, createdAt: -1 });

// Compound index for analytics: top URLs by clicks
shortUrlSchema.index({ user: 1, clicks: -1 });

// Index for redirect performance: shortId + active status
shortUrlSchema.index({ shortId: 1, isActive: 1 });

// Sparse index for custom aliases
shortUrlSchema.index({ customAlias: 1, isActive: 1 }, { sparse: true });

// TTL index for automatic cleanup of expired URLs (24 hours after expiration)
shortUrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400, sparse: true });

// ==================== SCHEMA VALIDATION ====================
shortUrlSchema.pre('save', function(next) {
    // Ensure shortId is trimmed and valid
    if (!this.shortId || typeof this.shortId !== 'string') {
        return next(new Error('shortId is required and must be a string'));
    }
    
    this.shortId = this.shortId.trim().toLowerCase();
    
    // Validate shortId format
    if (!/^[a-z0-9_-]{3,20}$/.test(this.shortId)) {
        return next(new Error('shortId must be 3-20 characters, alphanumeric with hyphens/underscores'));
    }
    
    // Validate expiration date if set
    if (this.expiresAt && new Date(this.expiresAt) <= new Date()) {
        return next(new Error('expiresAt must be in the future'));
    }
    
    next();
});

// ==================== QUERY HELPERS ====================
// Helper to find active URLs only
shortUrlSchema.query.active = function() {
    return this.where({ isActive: true });
};

// Helper to check if URL is expired
shortUrlSchema.methods.isExpired = function() {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
};

// ==================== STATICS ====================
// Find by shortId (optimized for redirect path)
shortUrlSchema.statics.findByShortId = async function(shortId) {
    return this.findOne({ 
        shortId: shortId.toLowerCase().trim(), 
        isActive: true 
    }).select('originalUrl expiresAt clicks user _id');
};

// Find by custom alias
shortUrlSchema.statics.findByAlias = async function(alias) {
    return this.findOne({ 
        customAlias: alias.toLowerCase().trim(), 
        isActive: true 
    }).select('originalUrl expiresAt clicks user _id');
};

export default mongoose.model('ShortUrl', shortUrlSchema);
