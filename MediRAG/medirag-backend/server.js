const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const queryRoutes = require("./routes/queryRoutes");
const authRoutes = require("./routes/authRoutes");
const { initPinecone } = require("./utils/pineconeClient");
const connectDB = require("./utils/dbConnect");
const extractRoutes = require("./routes/extractRoutes");
const userExtractRoutes = require("./routes/userExtractRoutes");
const summaryQueryRoutes = require("./routes/summaryQueryRoutes");
const userRoutes = require('./routes/users');
const summaryRoutes = require("./routes/summaryRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/extract", extractRoutes);
app.use("/api/user-summary", userExtractRoutes);
app.use("/api/summary-query", summaryQueryRoutes);
app.use('/api/users', userRoutes);
app.use("/api/summary", summaryRoutes);

const PORT = process.env.PORT || 5000;

// Initialize Pinecone and MongoDB before starting server
async function startServer() {
  try {
    await initPinecone();  // Pinecone init ✅
    await connectDB();     // MongoDB connect ✅

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error during server startup:", err);
  }
}

startServer();
