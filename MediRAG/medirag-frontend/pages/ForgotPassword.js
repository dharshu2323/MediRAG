import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setOtpSent(true);
      setMessage("OTP sent to your email");
      setError("");
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email :email.trim().toLowerCase(),
        otp,
        newPassword,
      });
      setMessage("Password reset successful. You can now login.");
      setTimeout(() => navigate("/login"), 2000);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError("Invalid OTP or error resetting password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Forgot Password</h3>

      <div className="mb-3">
        <label>Email</label>
        <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {otpSent && (
        <>
          <div className="mb-3">
            <label>OTP</label>
            <input className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </>
      )}

      {message && <div className="alert alert-success text-center">{message}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <button className="btn btn-primary w-100" onClick={otpSent ? resetPassword : sendOtp}>
        {otpSent ? "Reset Password" : "Send OTP"}
      </button>
    </div>
  );
};

export default ForgotPassword;
