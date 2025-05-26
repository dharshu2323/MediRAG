const express = require("express");
const { askQuery, getChatHistory } = require("../controllers/queryController"); // ✨ updated
const router = express.Router();

// POST /api/query
router.post("/", askQuery);

// GET /api/chat-history
router.get("/chat-history", getChatHistory);  // ✨ added this

router.post("/summarized-qa", async (req, res) => {
    const { question, context } = req.body;
    try {
      const answer = await generateAnswerFromContext(question, context);
      res.json({ answer });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate answer." });
    }
  });
  

module.exports = router;
