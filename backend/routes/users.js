import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

export default router;
