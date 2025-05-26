const path = require("path");
const parsePdf = require("../utils/parsePdf");
const parseImage = require("../utils/parseImage");
const upsertToPinecone = require("../utils/upsertToPinecone");

exports.processFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const fileExt = path.extname(file.filename).toLowerCase();
    let extractedText = "";

    if (fileExt === ".pdf") {
      extractedText = await parsePdf(file.path); // 🧠 PDF to text
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExt)) {
      extractedText = await parseImage(file.path); // 🧠 Image to text via OCR
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    // 🧠 Upsert to Pinecone (raw extracted text only)
    await upsertToPinecone(extractedText);

    return res.status(200).json({
      message: "File processed & uploaded to Pinecone!",
      textPreview: extractedText.slice(0, 200) + "...",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing file." });
  }
};
