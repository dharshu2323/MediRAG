const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const parsePdf = require("../utils/parsePdf");
const parseImage = require("../utils/parseImage");
const summarizeText = require("../utils/summarizeText");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const ext = path.extname(file.originalname).toLowerCase();
    let extractedText = "";

    if (ext === ".pdf") {
      extractedText = await parsePdf(file.path);
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      extractedText = await parseImage(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    fs.unlink(file.path, () => {}); // clean temp file

    if (!extractedText || !extractedText.trim()) {
      return res.status(200).json({ summary: "❌ No readable content found in the file." });
    }

    const summary = await summarizeText(extractedText);

    res.status(200).json({
      summary: summary || "❌ Summarization failed or returned empty.",
    });
  } catch (err) {
    console.error("❌ OCR/Summary error:", err.message || err);
    res.status(500).json({ error: "Failed to extract or summarize the document." });
  }
});

module.exports = router;
