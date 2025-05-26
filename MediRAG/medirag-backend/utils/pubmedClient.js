const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const PUBMED_API_KEY = process.env.PUBMED_API_KEY;

const fetchFromPubMed = async (query) => {
  try {
    const modifiedQuery = `${query} [Title/Abstract]`;   // <--- Add this

    const searchRes = await axios.get(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`,
      {
        params: {
          db: "pubmed",
          term: modifiedQuery,
          retmode: "json",
          retmax: 30,   // <--- Bring 30 articles instead of 20
          api_key: PUBMED_API_KEY,
        },
      }
    );

    const ids = searchRes.data.esearchresult.idlist.join(",");

    if (!ids) return [];

    const fetchRes = await axios.get(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`,
      {
        params: {
          db: "pubmed",
          id: ids,
          retmode: "json",
          api_key: PUBMED_API_KEY,
        },
      }
    );

    const docs = Object.values(fetchRes.data.result).filter((item) => item.uid);
    return docs;
  } catch (err) {
    console.error("❌ PubMed fetch error:", err.message);
    return [];
  }
};

module.exports = fetchFromPubMed;
