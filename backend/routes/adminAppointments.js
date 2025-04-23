import { Router } from "express";
import Appointment from "../models/Appointment.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// Protect all routes with auth middleware
router.use(auth);

// Get all appointments for admin
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
});

export default router;
