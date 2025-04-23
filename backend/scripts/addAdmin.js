import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const addAdmin = async () => {
  try {
    const adminEmail = process.env.INIT_ADMIN_EMAIL;
    const adminPassword = process.env.INIT_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("Admin email or password is not defined in the .env file");
    }

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const adminUser = new User({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        studentId: "ADMIN001",
      });
      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => addAdmin())
  .catch((error) => console.error("MongoDB connection error:", error.message));