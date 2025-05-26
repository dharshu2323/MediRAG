const { pipeline } = require("@xenova/transformers");

let embedder;

async function initEmbedder() {
  if (!embedder) {
    console.log("⏳ Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model ready!");
  }
}

const embedText = async (chunks) => {
  await initEmbedder();
  const embeddings = [];

  for (const chunk of chunks) {
    try {
      const result = await embedder(chunk, { pooling: "mean", normalize: true });

      // ✅ Ensure we get raw data as a normal array
      const vector = Array.from(result.data);

      if (vector.length !== 384) {
        console.warn("⚠️ Unexpected vector length:", vector.length);
      }

      embeddings.push(vector);
    } catch (err) {
      console.error("❌ Error embedding chunk:", err);
    }
  }

  if (embeddings.length !== chunks.length) {
    throw new Error("Some chunks failed to embed.");
  }

  return embeddings;
};

module.exports = embedText;
