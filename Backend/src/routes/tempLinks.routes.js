import express from "express";
import { Router } from "express";

const router = Router();

// Handle temporary link redirects
router.get("/:shortId", (req, res) => {
  const { shortId } = req.params;
  
  // For now, just return a message that this is a temporary link
  // In a real implementation, you'd check localStorage or a temp database
  res.status(404).json({
    success: false,
    message: "Temporary link not found. This link may have expired or been cleared from browser storage.",
    shortId: shortId
  });
});

export default router;
