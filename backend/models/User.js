import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    required: true,
    match: [/^EDS[0-9]\/[0-9]{5}\/[0-9]{2}$/, "Invalid student ID format"]
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", UserSchema);
