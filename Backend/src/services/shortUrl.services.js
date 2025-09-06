import ShortUrl from "../model/shorturl.models.js";
import { ApiError } from "../utils/ApiError.js";
import { GenerateNanoId } from "../utils/helper.js";

export const GenerateShort_URL_SERVICES = async (url, userId, customAlias = null) => {
    let short_id;

    if (customAlias) {
        // Check if custom alias already exists
        const existingUrl = await ShortUrl.findOne({ short_id: customAlias });
        if (existingUrl) {
            throw new ApiError(400, "Custom alias already exists");
        }
        short_id = customAlias;
    } else {
        short_id = GenerateNanoId(6);
        
        // Ensure the generated short_id is unique
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
            const existingUrl = await ShortUrl.findOne({ short_id });
            if (!existingUrl) {
                isUnique = true;
            } else {
                short_id = GenerateNanoId(6);
                attempts++;
            }
        }
        
        if (!isUnique) {
            throw new ApiError(400, "Failed to generate unique short URL");
        }
    }

    const new_URL = new ShortUrl({
        long_url: url,
        short_id: short_id,
        user: userId,
        clickCount: 0
    });

    await new_URL.save();

    return new_URL;
};

export const redirect_From_Short_Url = async (short_id) => {
    return await ShortUrl.findOne({ short_id });
};
