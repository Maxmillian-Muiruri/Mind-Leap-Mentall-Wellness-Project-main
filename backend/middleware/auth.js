import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const auth = () => {
  return async (req, res, next) => {
    console.time("Auth Middleware Execution Time"); // Start timing
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.timeEnd("Auth Middleware Execution Time"); // End timing
        return res.status(401).json({ message: "Unauthorized" });
      }

      jwt.verify(token, dotenv.config().parsed.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.timeEnd("Auth Middleware Execution Time"); // End timing
          return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        console.timeEnd("Auth Middleware Execution Time"); // End timing
        next();
      });
    } catch (error) {
      console.timeEnd("Auth Middleware Execution Time"); // End timing
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

export const verifyAdmin = (req, res, next) => {
  console.time("Verify Admin Execution Time"); // Start timing
  if (!req.user || !req.user.isAdmin) {
    console.timeEnd("Verify Admin Execution Time");
    return res.status(403).json({
      status: "fail",
      message: "Admin privileges required",
    });
  }
  console.timeEnd("Verify Admin Execution Time");
  next();
};
