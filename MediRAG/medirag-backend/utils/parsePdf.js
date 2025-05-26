const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const extractedText = data.text?.trim();
  return extractedText || null;
}

module.exports = extractTextFromPDF;
