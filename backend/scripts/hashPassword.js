// filepath: c:\coding\Mind-Leap-Mentall-Wellness-Project-main2\backend\scripts\hashPassword.js
import bcrypt from "bcryptjs";

const hashPassword = async () => {
  const hashedPassword = await bcrypt.hash("admin", 12);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword();