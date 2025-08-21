import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the structure of a User document in MongoDB
const userSchema = new mongoose.Schema(
    {
        // User's full name
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true, // Remove whitespace from beginning and end
        },
        // User's email address (must be unique)
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // No two users can have the same email
            lowercase: true, // Convert to lowercase for consistency
            trim: true,
        },
        // User's password (will be hashed before storing)
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Pre-save middleware: This runs before saving a user to the database
// It hashes the password if it has been modified
userSchema.pre("save", async function (next) {
    // If password hasn't been modified, skip hashing
    if (!this.isModified("password")) return next();

    try {
        // Hash the password with a salt rounds of 12 (higher = more secure but slower)
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method: Compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;