import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Doctor" };
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("No summary available yet.");
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/query/chat-history", {
          params: { userId: user._id },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error loading chat history", err);
      }
    };

    fetchChatHistory();
  }, [user._id]);

  const handleAsk = async () => {
  if (!query.trim()) return;
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/summary-query", {
      question: query, 
      summary:summary,
      userId: user._id,
    });

    setChats((prev) => [...prev, { question: query, answer: res.data.answer }]);
    setQuery("");
  } catch (err) {
    console.error("Error fetching answer", err);
  } finally {
    setLoading(false);
  }
};


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setSummary("⏳ Summarizing the uploaded file...");
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await axios.post("http://localhost:5000/api/summary", formData); // 👈 Use new route
      setSummary(res.data.summary || "⚠️ No summary found.");
    } catch (err) {
      console.error("Error summarizing file", err);
      setSummary("❌ Summary error occurred.");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div className="border-end p-3 bg-white" style={{ width: "300px", flexShrink: 0 }}>
        <h5 className="fw-bold mb-3 text-primary">MediRAG</h5>
        <label className="form-label">Upload Prescription/Report</label>
        <input type="file" className="form-control mb-2" onChange={handleFileUpload} />
        <h6 className="fw-semibold">Summary</h6>
        <div className="border p-2" style={{ minHeight: "200px", overflowY: "auto", fontSize: "0.9rem" }}>
          {summary}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center border-bottom p-3 bg-white">
          <div>{getGreeting()}, <strong>{user.name}</strong> 👋</div>
          <div className="d-flex align-items-center gap-3">
            <a
              href="https://www.medicalnewstoday.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              📰 Medical News
            </a>
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="/profile">Update Profile</a></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow-1 p-3 overflow-auto" style={{ background: "#f9f9f9" }}>
          {chats.length === 0 ? (
            <div className="text-center text-muted mt-5">
              Your chat will appear here after you ask a question 📑💬
            </div>
          ) : (
            chats.map((chat, idx) => (
              <div key={idx} className="mb-4">
                <div className="fw-bold">You:</div>
                <div className="mb-2">{chat.question}</div>
                <div className="fw-bold">MediRAG:</div>
                <div className="bg-light p-3 rounded">{chat.answer}</div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="border-top p-3 d-flex bg-white">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            disabled={loading}
          />
          <button className="btn btn-danger" onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
