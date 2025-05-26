const express = require("express");
const multer = require("multer");
const path = require("path");
const parsePdf = require("../utils/parsePdf");
const parseImage = require("../utils/parseImage");
const cleanText = require("../utils/cleanText");
const summarizeText = require("../utils/summarizeText");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const ext = path.extname(file.originalname).toLowerCase();
    let extracted = "";

    if (ext === ".pdf") {
      extracted = await parsePdf(file.path);
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      extracted = await parseImage(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    if (!extracted || extracted.length < 20) {
      return res.status(400).json({ summary: "❌ Text too short for summarization." });
    }

    const cleaned = cleanText(extracted);
    const summary = await summarizeText(cleaned);

    return res.status(200).json({ summary });
  } catch (err) {
    console.error("❌ Summary error:", err.message);
    res.status(500).json({ error: "Summarization failed." });
  }
});

module.exports = router;
