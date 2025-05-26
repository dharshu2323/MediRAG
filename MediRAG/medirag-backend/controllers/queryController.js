const searchPinecone = require("../utils/searchPinecone");
const fetchFromPubMed = require("../utils/pubmedClient");
const generateAnswerFromContext = require("../utils/llmAnswer");
const Chat = require("../models/chat"); // Make sure the filename is chat.js

// 🔍 Ask query and get answer
exports.askQuery = async (req, res) => {
  const { question, userId } = req.body;

  if (!question || !userId) {
    return res.status(400).json({ error: "Question and User ID are required." });
  }

  try {
    // 1. Search Pinecone
    const pineconeResults = await searchPinecone(question);
    const pineconeTextChunks = pineconeResults.map((match) => match.metadata.text);

    // 2. Search PubMed
    const pubmedArticles = await fetchFromPubMed(question);
    const pubmedTextChunks = pubmedArticles.map(
      (a) => `${a.title} - ${a.source}`
    );

    // 3. Combine context
    const context = [...pineconeTextChunks, ...pubmedTextChunks].join("\n---\n");

    // 4. Generate answer
    const answer = await generateAnswerFromContext(question, context);

    // 5. Save chat
    await Chat.create({
      userId,
      question,
      answer,
    });

    // 6. Send response
    res.status(200).json({
      success: true,
      question,
      answer,
      pineconeSourceCount: pineconeResults.length,
      pubmedSourceCount: pubmedArticles.length,
    });

  } catch (err) {
    console.error("❌ RAG query error:", err.message);
    res.status(500).json({ error: "Failed to answer query." });
  }
};

// 📚 Fetch all chat history for user
exports.getChatHistory = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const chats = await Chat.find({ userId }).sort({ createdAt: 1 }); // Sorted oldest → newest
    res.json(chats);
  } catch (err) {
    console.error("❌ Failed to fetch chat history:", err);
    res.status(500).json({ error: "Error fetching chat history" });
  }
};
