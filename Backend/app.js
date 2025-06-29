import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/mongo.connection.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import cors from 'cors';

dotenv.config("./.env");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB()
.then(() => {
        const PORT = process.env.PORT || 3000;
        console.log("🔌 DB connected successfully");

        app.listen(PORT, () => {
            console.log(`✅ Server is running at http://127.0.0.1:${PORT}`);
        });
    })
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Initialize route
import UrlRoute from './src/routes/shortUrl.routes.js';
app.use("/api/create", UrlRoute);


// THis endpoint is for redirecting to long url
app.get("/:short_id", redirectFromShortUrl);


// app.get("/:short_id", async (req, res) => {
//     const short_id = req.params.short_id;
//     const url = await ShortUrl.findOne({short_url: short_id});
//     if(url) {
//         url.clicks++;
//         url.save();
//         res.redirect(url.long_url);
//     }
//     else{
//         res.status(404).json({message: "URL not found"})
//     }
// })

