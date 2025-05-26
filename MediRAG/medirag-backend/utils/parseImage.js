const Tesseract = require('tesseract.js');
const path = require('path');

async function extractTextFromImage(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: m => console.log(m) }
    );
    return text.trim() || null;
  } catch (err) {
    console.error('OCR failed:', err);
    return null;
  }
}

module.exports = extractTextFromImage;
