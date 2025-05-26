const axios = require("axios");

const summarizeText = async (text) => {
  const HF_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  const headers = {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  try {
    const res = await axios.post(HF_URL, { inputs: text }, { headers });
    const out = res.data?.[0]?.summary_text;
    if (!out) throw new Error("Empty summary.");
    return out;
  } catch (err) {
    console.error("❌ Hugging Face summarization failed:", err.response?.data || err.message);
    throw new Error("Summarization failed");
  }
};

module.exports = summarizeText;
