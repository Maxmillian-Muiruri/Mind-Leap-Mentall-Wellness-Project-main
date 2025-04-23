import { Router } from "express";
import Appointment from "../models/Appointment.js";

const router = Router();

// Book appointment
router.post("/", async (req, res) => {
  try {
    const { fullName, studentId, email, phone, date, time, service, notes } =
      req.body;

    // Validate required fields
    if (
      !fullName ||
      !studentId ||
      !email ||
      !phone ||
      !date ||
      !time ||
      !service
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Combine date and time into appointmentDateTime
    const appointmentDateTime = new Date(`${date}T${time}`);
    if (isNaN(appointmentDateTime.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid appointment date and time" });
    }

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      studentId,
      appointmentDateTime,
      service,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "You already have an appointment at this time",
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      fullName,
      studentId,
      email,
      phone,
      appointmentDateTime,
      service,
      notes: notes || "",
      status: "booked", // valid enum value
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      message: "Failed to book appointment",
      error: error.message,
    });
  }
});

// Get all appointments
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
