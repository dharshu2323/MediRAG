import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate(); // 💡 Initialize navigation

  return (
    <div className="welcome-container d-flex align-items-center justify-content-center text-center">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side */}
          <div className="col-md-6 text-md-start text-center mb-4 mb-md-0">
            <h1 className="display-4 fw-bold text-primary">Welcome to MediRAG</h1>
            <p className="lead text-dark">
              Your personalized AI-powered medical assistant. Get instant summaries,
              explanations, and answers from your reports and prescriptions.
            </p>
            <div className="mt-4">
              <button
                className="btn btn-outline-primary me-3 px-4"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-md-6">
            <img
              src="/ai-landing.jpg"
              alt="AI Assistant Illustration"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "450px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
