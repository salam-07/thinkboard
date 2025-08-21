import User from "../models/User.js";
import { generateToken } from "../lib/generateToken.js";

/**
 * Handle user signup/registration
 * Creates a new user account with hashed password
 */
export async function handleUserSignup(req, res) {
    try {
        // Extract user data from request body
        const { name, email, password } = req.body;

        // Validate that all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password"
            });
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            });
        }

        // Create new user (password will be automatically hashed by pre-save middleware)
        const user = new User({ name, email, password });
        const createdUser = await user.save();

        // Generate JWT token for automatic login after signup
        const token = generateToken(createdUser._id);

        // Send success response (don't include password in response)
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
            },
            token // Send token so user is automatically logged in
        });
    } catch (error) {
        console.error("Error in handleUserSignup controller:", error);

        // Handle validation errors from MongoDB
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Handle user login
 * Authenticates user and returns JWT token
 */
export async function handleUserLogin(req, res) {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body;

        // Validate that both email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        // Find user by email in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password in database
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token for authenticated user
        const token = generateToken(user._id);

        // Send success response with user data and token
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });
    } catch (error) {
        console.error("Error in handleUserLogin controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Get current user profile
 * Returns user data for authenticated requests
 */
export async function getCurrentUser(req, res) {
    try {
        // The user ID comes from the auth middleware (req.userId)
        const user = await User.findById(req.userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error("Error in getCurrentUser controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}