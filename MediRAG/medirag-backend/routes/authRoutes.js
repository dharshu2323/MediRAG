const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");

let otpStore = {}; // In-memory OTP store

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email.toLowerCase()] = otp;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `MediRAG <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for MediRAG",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otp} sent to ${email}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Failed to send OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ Register
router.post("/register", async (req, res) => {
  const { email, otp } = req.body;
  const cleanEmail = email?.toLowerCase();

  if (!otpStore[cleanEmail] || String(otpStore[cleanEmail]) !== String(otp)) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  try {
    await registerUser(req, res);
    delete otpStore[cleanEmail];
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Login
router.post("/login", loginUser);

// ✅ Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const cleanEmail = email?.toLowerCase();

  if (!otpStore[cleanEmail] || String(otpStore[cleanEmail]) !== String(otp)) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email: cleanEmail }, { password: hashedPassword });
    delete otpStore[cleanEmail];
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Password reset failed" });
  }
});

module.exports = router;
