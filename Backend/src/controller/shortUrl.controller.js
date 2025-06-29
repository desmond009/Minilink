import { GenerateShort_URL_SERVICES } from "../services/shortUrl.services.js";
import { redirect_From_Short_Url } from "../services/shortUrl.services.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const GenerateShortUrl = asyncHandler(async (req, res) => {

    const {url} = req.body

    const new_URL = await GenerateShort_URL_SERVICES(url);

    if(!new_URL){
        throw new ApiError(400, "New URL not found")
    }

    res.status(200).json({
        success: true,
        URL: process.env.APP_URL + new_URL
    })
})


const redirectFromShortUrl = asyncHandler(async (req, res) => {
    const short_id = req.params.short_id;
    const url = await redirect_From_Short_Url(short_id)

    if(!url){
        throw new ApiError(400, "URL not found")
    }
    res.redirect(url.long_url)
})

export {GenerateShortUrl, redirectFromShortUrl}