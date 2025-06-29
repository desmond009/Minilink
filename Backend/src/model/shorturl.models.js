import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema({
    short_url: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    long_url: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true})


export const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);