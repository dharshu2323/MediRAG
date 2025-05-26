require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

let indexInstance = null;

const initPinecone = async () => {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = await pinecone.index(process.env.PINECONE_INDEX_NAME);
    indexInstance = index;
    console.log("✅ Pinecone index initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize Pinecone index:", error.message);
    throw error;
  }
};

const getPineconeIndex = () => {
  if (!indexInstance) {
    throw new Error("Pinecone index not initialized. Call initPinecone() first.");
  }
  return indexInstance;
};

module.exports = { initPinecone, getPineconeIndex };
