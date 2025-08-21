import Note from "../models/Note.js";

/**
 * Get all notes for the authenticated user
 * Only returns notes that belong to the current user
 */
export async function getAllNotes(req, res) {
    try {
        // Find notes that belong to the authenticated user (req.userId from auth middleware)
        const notes = await Note.find({ user: req.userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate("user", "name email"); // Include user info

        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Create a new note for the authenticated user
 */
export async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        // Create note with user association
        const note = new Note({
            title,
            content,
            user: req.userId // Associate note with authenticated user
        });

        const savedNote = await note.save();

        // Populate user info in response
        await savedNote.populate("user", "name email");

        res.status(201).json({ savedNote });
    } catch (error) {
        console.error("Error in createNote controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Update a note (only if it belongs to the authenticated user)
 */
export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;

        // Find note and check if it belongs to the authenticated user
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.userId // Ensure user owns this note
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found or you don't have permission to edit it"
            });
        }

        // Update the note
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        ).populate("user", "name email");

        res.status(200).json({ updatedNote });
    } catch (error) {
        console.error("Error in updateNote controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Delete a note (only if it belongs to the authenticated user)
 */
export async function deleteNote(req, res) {
    try {
        // Find and delete note only if it belongs to the authenticated user
        const deletedNote = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.userId // Ensure user owns this note
        });

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found or you don't have permission to delete it"
            });
        }

        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteNote controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Get a specific note by ID (only if it belongs to the authenticated user)
 */
export async function getNoteByID(req, res) {
    try {
        // Find note that belongs to the authenticated user
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.userId // Ensure user owns this note
        }).populate("user", "name email");

        if (!note) {
            return res.status(404).json({
                message: "Note not found or you don't have permission to view it"
            });
        }

        res.json(note);
    } catch (error) {
        console.error("Error in getNoteByID controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}