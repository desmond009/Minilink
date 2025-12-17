import mongoose from 'mongoose';
import ShortUrl from '../model/shorturl.models.js';
import { generateShortId } from '../utils/urlHelpers.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to permanently fix the shortId index issue
 * 1. Deletes invalid documents (missing required fields)
 * 2. Fixes documents with null shortId but valid originalUrl
 * 3. Drops and recreates the index properly
 */
const fixShortIdIndex = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/minilink';
        
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Step 1: Delete completely invalid documents (missing originalUrl)
        console.log('📊 Step 1: Removing invalid documents (missing originalUrl)...');
        const deleteResult = await ShortUrl.deleteMany({
            $or: [
                { originalUrl: { $exists: false } },
                { originalUrl: null },
                { originalUrl: '' }
            ]
        });
        console.log(`   ✅ Deleted ${deleteResult.deletedCount} invalid documents\n`);

        // Step 2: Fix documents with null shortId but valid originalUrl
        console.log('📊 Step 2: Fixing documents with null/empty shortId...');
        const nullShortIds = await ShortUrl.find({
            $and: [
                { originalUrl: { $exists: true, $ne: null, $ne: '' } },
                {
                    $or: [
                        { shortId: null },
                        { shortId: { $exists: false } },
                        { shortId: '' }
                    ]
                }
            ]
        });

        console.log(`   Found ${nullShortIds.length} documents to fix\n`);

        if (nullShortIds.length > 0) {
            let updated = 0;
            let failed = 0;

            for (const doc of nullShortIds) {
                try {
                    let newShortId;
                    let attempts = 0;
                    const maxAttempts = 20;

                    // Generate unique shortId
                    while (attempts < maxAttempts) {
                        newShortId = generateShortId();
                        if (!newShortId || typeof newShortId !== 'string' || newShortId.trim() === '') {
                            attempts++;
                            continue;
                        }

                        newShortId = newShortId.trim();
                        const existing = await ShortUrl.findOne({ shortId: newShortId });
                        if (!existing) break;
                        attempts++;
                    }

                    if (!newShortId || attempts === maxAttempts) {
                        console.error(`   ❌ Failed to generate unique shortId for document ${doc._id}`);
                        failed++;
                        continue;
                    }

                    // Update directly using updateOne to bypass validation temporarily
                    await ShortUrl.collection.updateOne(
                        { _id: doc._id },
                        { $set: { shortId: newShortId } }
                    );
                    updated++;
                    console.log(`   ✅ Updated document ${doc._id} with shortId: ${newShortId}`);

                } catch (error) {
                    console.error(`   ❌ Error updating document ${doc._id}:`, error.message);
                    failed++;
                }
            }

            console.log(`\n   ✅ Updated: ${updated}`);
            console.log(`   ❌ Failed: ${failed}\n`);
        } else {
            console.log('   ✅ No documents need fixing\n');
        }

        // Step 3: Drop existing indexes on shortId
        console.log('📊 Step 3: Dropping existing shortId indexes...');
        const indexesToDrop = ['shortId_1', 'short_id_1'];
        for (const indexName of indexesToDrop) {
            try {
                await ShortUrl.collection.dropIndex(indexName);
                console.log(`   ✅ Dropped ${indexName} index`);
            } catch (error) {
                if (error.codeName === 'IndexNotFound') {
                    console.log(`   ℹ️  ${indexName} index not found`);
                } else {
                    console.log(`   ⚠️  Could not drop ${indexName}: ${error.message}`);
                }
            }
        }

        // Step 4: Delete any remaining documents with null shortId
        console.log('\n📊 Step 4: Removing any remaining invalid documents...');
        const finalDeleteResult = await ShortUrl.deleteMany({
            $or: [
                { shortId: null },
                { shortId: { $exists: false } },
                { shortId: '' }
            ]
        });
        console.log(`   ✅ Deleted ${finalDeleteResult.deletedCount} remaining invalid documents\n`);

        // Step 5: Create new unique index
        console.log('📊 Step 5: Creating new shortId unique index...');
        try {
            await ShortUrl.collection.createIndex(
                { shortId: 1 },
                { 
                    unique: true,
                    name: 'shortId_1'
                }
            );
            console.log('   ✅ Created new shortId unique index\n');
        } catch (error) {
            console.error(`   ❌ Error creating index: ${error.message}\n`);
        }

        // Step 6: Verify
        console.log('📊 Step 6: Verifying...');
        const invalidCount = await ShortUrl.countDocuments({
            $or: [
                { shortId: null },
                { shortId: { $exists: false } },
                { shortId: '' }
            ]
        });

        const totalCount = await ShortUrl.countDocuments();
        console.log(`   Total documents: ${totalCount}`);
        console.log(`   Invalid documents: ${invalidCount}`);

        if (invalidCount === 0) {
            console.log('   ✅ All documents have valid shortIds\n');
        } else {
            console.warn(`   ⚠️  Warning: ${invalidCount} documents still have invalid shortIds\n`);
        }

        console.log('✅ Index fix completed successfully!');

    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    }
};

// Run fix
fixShortIdIndex();
