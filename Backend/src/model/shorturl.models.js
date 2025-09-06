import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema({
    short_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    long_url: {
        type: String,
        required: true
    },
    clickCount: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
