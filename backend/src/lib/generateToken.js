import jwt from "jsonwebtoken";

/**
 * Generate a JSON Web Token (JWT) for user authentication
 * @param {string} userId - The user's unique ID from MongoDB
 * @returns {string} - JWT token that expires in 30 days
 */
export const generateToken = (userId) => {
    // Create a JWT token with the user's ID as payload
    // The token will be signed with a secret key and expire in 30 days
    return jwt.sign(
        { userId }, // Payload: what data we want to store in the token
        process.env.JWT_SECRET, // Secret key to sign the token (must be in .env file)
        { expiresIn: "30d" } // Token expires in 30 days
    );
};
