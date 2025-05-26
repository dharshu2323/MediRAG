import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 for navigation
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const navigate = useNavigate(); // 👈 use this for redirect
  const [file, setFile] = useState(null);
  const [previewText, setPreviewText] = useState("");
  const [message, setMessage] = useState("");
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewText("⏳ Extracting text...");
    setMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoadingExtract(true);
    try {
      const res = await axios.post("http://localhost:5000/api/extract", formData);
      const extracted = res.data.extractedText?.trim();

      if (extracted) {
        setPreviewText(extracted);
        setMessage("✅ Text extracted. Ready to upload!");
      } else {
        setPreviewText("");
        setMessage("❌ No text was extracted.");
      }
    } catch (err) {
      console.error("❌ Extraction error:", err);
      setPreviewText("");
      setMessage("❌ Failed to extract text.");
    } finally {
      setLoadingExtract(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !previewText) return;
    setMessage("⏳ Uploading to Pinecone...");
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Upload response:", res.data);
      setMessage("✅ Uploaded successfully to Pinecone!");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed.");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: "30px",
      }}
    >
      <div className="card shadow-lg p-5 bg-white rounded" style={{ maxWidth: "700px", width: "100%", opacity: 0.97 }}>
        {/* Top bar with Home button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Admin Dashboard</h2>
          <button className="btn btn-outline-primary" onClick={() => navigate("/")}>🏠 Home</button>
        </div>

        <p className="text-muted text-center mb-4">Upload to Knowledge Base</p>

        <div className="mb-3">
          <label className="form-label fw-semibold">Select File (PDF / JPG / PNG):</label>
          <input
            className="form-control"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={loadingExtract || loadingUpload}
          />
        </div>

        {message && <div className="alert alert-info mt-3">{message}</div>}

        {previewText && (
          <div className="card p-3 mt-4 bg-light" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <h5>📄 Extracted Text Preview:</h5>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>{previewText}</pre>
          </div>
        )}

        <button
          className="btn btn-success w-100 mt-4"
          onClick={handleUpload}
          disabled={!previewText || loadingExtract || loadingUpload}
        >
          {loadingUpload ? "Uploading..." : "Upload to Pinecone"}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
