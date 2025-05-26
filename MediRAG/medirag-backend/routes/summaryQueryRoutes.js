const express = require("express");
const router = express.Router();
const { handleSummaryQuery } = require("../controllers/summaryQueryController");

router.post("/", handleSummaryQuery);

module.exports = router;
