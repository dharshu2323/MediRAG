import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    medicalHistory: "",
    email: "",
    password: "",
    otp: "",
  });

  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage("Please enter email before sending OTP.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email: formData.email });
      setShowOtpField(true);
      setMessage("✅ OTP sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to send OTP.");
    }
  };
  
  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-3">Register to MediRAG</h3>

        <div className="row g-3">
          <div className="col-md-6">
            <label>Name</label>
            <input name="name" className="form-control" value={formData.name} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Age</label>
            <input name="age" type="number" className="form-control" value={formData.age} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Date of Birth</label>
            <input name="dateOfBirth" type="date" className="form-control" value={formData.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Gender</label>
            <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Blood Group</label>
            <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}>
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Medical History</label>
            <input name="medicalHistory" className="form-control" value={formData.medicalHistory} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Password</label>
            <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} />
          </div>
          {showOtpField && (
            <div className="col-12">
              <label>OTP</label>
              <input name="otp" className="form-control" value={formData.otp} onChange={handleChange} />
            </div>
          )}
        </div>

        <div className="mt-4 d-grid">
          {!showOtpField ? (
            <button className="btn btn-primary" onClick={handleSendOtp}>Send OTP</button>
          ) : (
            <button className="btn btn-success" onClick={handleRegister}>Register</button>
          )}
        </div>

        {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
      </div>
    </div>
  );
};

export default RegisterPage;
