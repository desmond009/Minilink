import mongoose, { Schema } from "mongoose";

const clickEventSchema = new Schema({
    shortUrl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortUrl",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    referrer: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    device: {
        type: {
            type: String,
            enum: ['desktop', 'mobile', 'tablet', 'unknown'],
            default: 'unknown'
        },
        os: String,
        browser: String
    }
}, { 
    timestamps: false 
});

// Compound indexes for efficient analytics queries
clickEventSchema.index({ shortUrl: 1, timestamp: -1 });
clickEventSchema.index({ user: 1, timestamp: -1 });
clickEventSchema.index({ timestamp: -1 });

// TTL index to auto-delete old analytics data after 90 days
clickEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const ClickEvent = mongoose.model("ClickEvent", clickEventSchema);

export default ClickEvent;
