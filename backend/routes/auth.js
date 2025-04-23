import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { auth } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      studentId,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      result: { ...user._doc },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.error(error);
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.error(error);
  }
});

router.get("/me", auth(), async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
