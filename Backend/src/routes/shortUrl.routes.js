import express from "express";
import { Router } from "express";

import { GenerateShortUrl } from "../controller/shortUrl.controller.js";

const router = Router();

router.route("/").post(GenerateShortUrl)


export default router