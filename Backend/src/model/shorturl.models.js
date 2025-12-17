import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    originalUrl: {
        type: String,
        required: true,
        trim: true
    },
    customAlias: {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    clicks: {
        type: Number,
        default: 0,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: null
    },
    qrCode: {
        type: String,
        default: null
    },
    metadata: {
        title: String,
        description: String,
        tags: [String]
    }
}, { 
    timestamps: true 
});

// Compound indexes for efficient queries
shortUrlSchema.index({ user: 1, createdAt: -1 });
shortUrlSchema.index({ user: 1, clicks: -1 });
shortUrlSchema.index({ shortId: 1, isActive: 1 });

// TTL index for expired URLs (auto-delete 24 hours after expiration)
shortUrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

// Virtual for full short URL
shortUrlSchema.virtual('shortUrl').get(function() {
    const baseUrl = process.env.APP_URL || 'https://mini.lk';
    return `${baseUrl}/r/${this.shortId}`;
});

// Ensure virtuals are included in JSON
shortUrlSchema.set('toJSON', { virtuals: true });
shortUrlSchema.set('toObject', { virtuals: true });

// Pre-save hook to validate expiration date
shortUrlSchema.pre('save', function(next) {
    if (this.expiresAt && this.expiresAt < new Date()) {
        this.isActive = false;
    }
    next();
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
