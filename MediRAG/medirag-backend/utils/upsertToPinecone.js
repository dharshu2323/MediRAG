const { getPineconeIndex } = require("./pineconeClient");
const { v4: uuidv4 } = require("uuid");
const embedText = require("./embedText");

const MAX_METADATA_LENGTH = 1000;

const splitText = (text, maxLen) => {
  const parts = [];
  for (let i = 0; i < text.length; i += maxLen) {
    parts.push(text.slice(i, i + maxLen));
  }
  return parts;
};

const upsertToPinecone = async (fullText) => {
  const index = getPineconeIndex();
  const textChunks = splitText(fullText, MAX_METADATA_LENGTH);

  const embeddings = await embedText(textChunks);

  if (textChunks.length !== embeddings.length) {
    throw new Error("Mismatch between text chunks and embeddings count.");
  }

  const vectors = textChunks.map((chunk, i) => ({
    id: `${uuidv4()}-${i}`,
    values: embeddings[i],
    metadata: { text: chunk },
  }));

  console.log("✅ Vector ready to upload! Example:");
  console.log(vectors[0]);

  await index.upsert(vectors);
};

module.exports = upsertToPinecone;
