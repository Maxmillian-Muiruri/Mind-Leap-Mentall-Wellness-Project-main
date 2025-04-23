import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  appointmentDateTime: {
    type: Date,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  counselor: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'booked'],
    default: 'booked'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Appointment", AppointmentSchema);
