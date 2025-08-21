import express from "express";
import {
    handleUserSignup,
    handleUserLogin,
    getCurrentUser
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", handleUserSignup);  // POST /user/signup
router.post("/login", handleUserLogin);    // POST /user/login

// Protected routes (authentication required)
router.get("/profile", authenticateToken, getCurrentUser); // GET /user/profile

export default router;