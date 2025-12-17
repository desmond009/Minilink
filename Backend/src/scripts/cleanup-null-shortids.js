import mongoose from 'mongoose';
import ShortUrl from '../model/shorturl.models.js';
import { generateShortId } from '../utils/urlHelpers.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to clean up documents with null shortId values
 * This fixes the duplicate key error: E11000 duplicate key error collection: test.shorturls index: short_id_1 dup key: { short_id: null }
 */
const cleanupNullShortIds = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/minilink';
        
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find all documents with null or empty shortId
        const nullShortIds = await ShortUrl.find({
            $or: [
                { shortId: null },
                { shortId: { $exists: false } },
                { shortId: '' }
            ]
        });

        console.log(`\n📊 Found ${nullShortIds.length} documents with null/empty shortId`);

        if (nullShortIds.length === 0) {
            console.log('✅ No cleanup needed. All documents have valid shortIds.');
            await mongoose.connection.close();
            process.exit(0);
        }

        // Generate new shortIds for each document
        let updated = 0;
        let failed = 0;

        for (const doc of nullShortIds) {
            try {
                let newShortId;
                let attempts = 0;
                const maxAttempts = 10;

                // Generate unique shortId
                while (attempts < maxAttempts) {
                    newShortId = generateShortId();
                    if (!newShortId || typeof newShortId !== 'string' || newShortId.trim() === '') {
                        attempts++;
                        continue;
                    }

                    const existing = await ShortUrl.findOne({ shortId: newShortId.trim() });
                    if (!existing) break;
                    attempts++;
                }

                if (!newShortId || attempts === maxAttempts) {
                    console.error(`❌ Failed to generate unique shortId for document ${doc._id}`);
                    failed++;
                    continue;
                }

                doc.shortId = newShortId.trim();
                await doc.save();
                updated++;
                console.log(`✅ Updated document ${doc._id} with shortId: ${newShortId.trim()}`);

            } catch (error) {
                console.error(`❌ Error updating document ${doc._id}:`, error.message);
                failed++;
            }
        }

        console.log(`\n📊 Cleanup Summary:`);
        console.log(`  ✅ Updated: ${updated}`);
        console.log(`  ❌ Failed: ${failed}`);
        console.log('\n✅ Cleanup completed!');

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    }
};

// Run cleanup
cleanupNullShortIds();

