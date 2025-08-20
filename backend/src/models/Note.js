import mongoose, { mongo } from "mongoose";

// TODO create scheme
// model from scheme

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;