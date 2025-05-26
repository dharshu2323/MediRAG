const embedText = require("./embedText");
const { getPineconeIndex } = require("./pineconeClient");

const searchPinecone = async (query) => {
  try {
    const index = getPineconeIndex(); 

    const queryEmbedding = await embedText(query);

    const queryResponse = await index.query({
      topK: 5,
      vector: queryEmbedding,
      includeMetadata: true,
    });

    return queryResponse.matches || [];
  } catch (err) {
    console.error("Pinecone query error:", err.message);
    return [];
  }
};

module.exports = searchPinecone;
