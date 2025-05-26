const { queryPinecone } = require("../utils/searchPinecone");
const fetchFromPubMed = require("../utils/pubmedClient");
const getLLMAnswer = require("../utils/llmAnswer");
const Chat = require("../models/chat");

// ✅ Utility to check if the answer is meaningful
const isValidAnswer = (text) => {
  if (!text || text.length < 50) return false;

  const lower = text.toLowerCase();
  const hallucinationPatterns = [
    "i am a model",
    "i don't have the ability",
    "based on the information provided",
    "consult a healthcare professional",
    "i am an ai language model",
    "not explicitly stated",
    "information provided in the context"
  ];

  return !hallucinationPatterns.some((phrase) => lower.includes(phrase));
};

exports.handleSummaryQuery = async (req, res) => {
  const { summary, question, userId } = req.body;

  if (!summary || !question || !userId) {
    return res.status(400).json({ error: "Missing summary, question, or userId." });
  }

  try {
    // Step 1: Try answering from the summary
    const summaryAnswer = await getLLMAnswer(question, summary);
    if (isValidAnswer(summaryAnswer)) {
      await Chat.create({ userId, question, answer: summaryAnswer });
      return res.json({ answer: summaryAnswer, source: "summary" });
    }

    // Step 2: Fallback to Pinecone
    const pineconeContext = await queryPinecone(question);
    const pineconeAnswer = await getLLMAnswer(question, pineconeContext);
    if (isValidAnswer(pineconeAnswer)) {
      await Chat.create({ userId, question, answer: pineconeAnswer });
      return res.json({ answer: pineconeAnswer, source: "pinecone" });
    }

    // Step 3: Fallback to PubMed
    const pubmedContext = await fetchFromPubMed(question);
    const pubmedAnswer = await getLLMAnswer(question, pubmedContext);
    await Chat.create({ userId, question, answer: pubmedAnswer });
    return res.json({ answer: pubmedAnswer, source: "pubmed" });

  } catch (err) {
    console.error("❌ Error answering summary query:", err.message || err);
    res.status(500).json({ error: "Failed to answer question." });
  }
};
