import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Authentication middleware
 * Verifies JWT token and adds user information to request object
 * Use this middleware on routes that require user authentication
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        // Expected format: "Bearer <token>"
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Extract token part

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with this token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid token. User not found."
            });
        }

        // Add user information to request object for use in route handlers
        req.userId = user._id;
        req.user = user;

        // Continue to next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        res.status(500).json({ message: "Server error during authentication" });
    }
};
