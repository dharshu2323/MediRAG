const bcrypt = require("bcrypt");
const User = require("../models/user");

const registerUser = async (req, res) => {
  const {
    name,
    age,
    gender,
    dateOfBirth,
    bloodGroup,
    medicalHistory,
    email,
    password,
  } = req.body;

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      gender,
      dateOfBirth,
      bloodGroup,
      medicalHistory,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // default role for new users
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const isAdmin = user.email === "admin@medirag.com"; // 💥 hardcoded admin check

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin, // ✅ frontend can redirect based on this
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};


module.exports = {
  registerUser,
  loginUser
};
