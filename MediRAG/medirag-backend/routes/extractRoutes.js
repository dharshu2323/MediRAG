const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const parsePdf = require("../utils/parsePdf");
const parseImage = require("../utils/parseImage");

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

    fs.unlink(file.path, () => {}); // Clean temp file

    res.status(200).json({ extractedText: extractedText }); // ✅ Fix field name!
  } catch (err) {
    console.error("❌ OCR summary error:", err.message || err);
    res.status(500).json({ error: "Failed to summarize report." });
  }
});

module.exports = router;
