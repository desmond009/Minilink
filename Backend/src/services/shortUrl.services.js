import { ShortUrl } from "../model/shorturl.models.js";
import { ApiError } from "../utils/ApiError.js";
import { GenerateNanoId } from "../utils/helper.js";

export const GenerateShort_URL_SERVICES = async (url) => {

    const short_url = GenerateNanoId(6);

    if(!short_url){
        throw new ApiError(400, "Something went wrong")
    }
    
    const new_URL = new ShortUrl({
        long_url: url,
        short_url: short_url
    })

    await new_URL.save();

    return short_url
}

export const redirect_From_Short_Url = async (short_id) => {
    return await ShortUrl.findOneAndUpdate(
        {
            short_url: short_id
        }, 
        {
            $inc: {clicks: 1}
        }
    );
}