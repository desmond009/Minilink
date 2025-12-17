import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShortUrl from '../model/shorturl.models.js';
import User from '../model/user.model.js';
import { generateQRCode } from '../utils/qrCodeGenerator.js';

dotenv.config();

/**
 * Migration script to update existing data to new schema
 */
const migrate = async () => {
    try {
        console.log('🔄 Starting database migration...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Migrate ShortUrl documents
        console.log('\n📝 Migrating ShortUrl documents...');
        
        const oldUrls = await mongoose.connection.db.collection('shorturls').find({}).toArray();
        
        for (const oldUrl of oldUrls) {
            const updates = {};
            
            // Rename fields
            if (oldUrl.short_id && !oldUrl.shortId) {
                updates.shortId = oldUrl.short_id;
            }
            
            if (oldUrl.long_url && !oldUrl.originalUrl) {
                updates.originalUrl = oldUrl.long_url;
            }
            
            if (oldUrl.clickCount !== undefined && oldUrl.clicks === undefined) {
                updates.clicks = oldUrl.clickCount;
            }
            
            // Add missing fields
            if (!oldUrl.isActive) {
                updates.isActive = true;
            }
            
            if (!oldUrl.qrCode) {
                try {
                    const baseUrl = process.env.APP_URL || 'https://mini.lk';
                    const shortId = oldUrl.shortId || oldUrl.short_id;
                    const fullUrl = `${baseUrl}/r/${shortId}`;
                    updates.qrCode = await generateQRCode(fullUrl);
                } catch (error) {
                    console.warn(`  ⚠️  Failed to generate QR for ${oldUrl._id}:`, error.message);
                }
            }
            
            if (!oldUrl.metadata) {
                updates.metadata = {
                    title: null,
                    description: null,
                    tags: []
                };
            }
            
            // Update document if needed
            if (Object.keys(updates).length > 0) {
                await mongoose.connection.db.collection('shorturls').updateOne(
                    { _id: oldUrl._id },
                    { 
                        $set: updates,
                        $unset: { 
                            short_id: "", 
                            long_url: "", 
                            clickCount: "" 
                        }
                    }
                );
                console.log(`  ✓ Migrated URL: ${oldUrl.short_id || oldUrl.shortId}`);
            }
        }
        
        console.log(`✅ Migrated ${oldUrls.length} URL documents`);

        // 2. Migrate User documents
        console.log('\n📝 Migrating User documents...');
        
        const users = await User.find({});
        
        for (const user of users) {
            let updated = false;
            
            // Add new fields if missing
            if (!user.authProvider) {
                user.authProvider = 'local';
                updated = true;
            }
            
            if (!user.plan) {
                user.plan = 'free';
                updated = true;
            }
            
            if (user.urlsCreated === undefined) {
                const urlCount = await ShortUrl.countDocuments({ user: user._id });
                user.urlsCreated = urlCount;
                updated = true;
            }
            
            if (!user.maxUrls) {
                user.maxUrls = 100; // Free plan default
                updated = true;
            }
            
            if (!user.lastLogin) {
                user.lastLogin = user.createdAt || new Date();
                updated = true;
            }
            
            if (updated) {
                await user.save();
                console.log(`  ✓ Migrated user: ${user.email}`);
            }
        }
        
        console.log(`✅ Migrated ${users.length} user documents`);

        // 3. Create indexes
        console.log('\n📝 Creating indexes...');
        
        await ShortUrl.collection.createIndex({ shortId: 1 }, { unique: true });
        await ShortUrl.collection.createIndex({ user: 1, createdAt: -1 });
        await ShortUrl.collection.createIndex({ user: 1, clicks: -1 });
        await ShortUrl.collection.createIndex({ customAlias: 1 }, { unique: true, sparse: true });
        await ShortUrl.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 86400 });
        
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await User.collection.createIndex({ authProvider: 1, providerId: 1 });
        
        console.log('✅ Indexes created');

        // 4. Show migration summary
        console.log('\n📊 Migration Summary:');
        console.log(`  - Total URLs: ${await ShortUrl.countDocuments()}`);
        console.log(`  - Active URLs: ${await ShortUrl.countDocuments({ isActive: true })}`);
        console.log(`  - Total Users: ${await User.countDocuments()}`);
        console.log(`  - URLs with QR codes: ${await ShortUrl.countDocuments({ qrCode: { $ne: null } })}`);

        console.log('\n✅ Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    }
};

// Run migration
migrate();
