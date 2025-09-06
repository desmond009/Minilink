import express from "express";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

import { GenerateShortUrl, GetUserLinks } from "../controller/shortUrl.controller.js";

const router = Router();

router.route("/").post(protect, GenerateShortUrl)
router.route("/links").get(protect, GetUserLinks)

export default router
