import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },
    providerId: {
        type: String,
        sparse: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    urlsCreated: {
        type: Number,
        default: 0
    },
    maxUrls: {
        type: Number,
        default: 100 // Free plan limit
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for OAuth users
userSchema.index({ authProvider: 1, providerId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Skip hashing if password is not modified or user is OAuth user
    if (!this.isModified('password') || !this.password) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            id: this._id, 
            email: this.email, 
            role: this.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Check if user can create more URLs
userSchema.methods.canCreateUrl = function() {
    return this.urlsCreated < this.maxUrls;
};

// Increment URL count
userSchema.methods.incrementUrlCount = async function() {
    this.urlsCreated += 1;
    await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
