import mongoose from "mongoose";

// Note schema with user association
const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        // Associate each note with a user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to User model
            required: [true, "User is required"],
        }
    },
    { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;