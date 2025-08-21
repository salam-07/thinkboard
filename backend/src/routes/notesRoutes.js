import express from "express";
import {
    createNote,
    deleteNote,
    getAllNotes,
    getNoteByID,
    updateNote
} from "../controllers/notesController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All note routes require authentication
// Apply auth middleware to all routes in this router
router.use(authenticateToken);

// Note routes (all protected by authentication)
router.get("/", getAllNotes);           // GET /api/notes
router.get("/:id", getNoteByID);        // GET /api/notes/:id
router.post("/", createNote);           // POST /api/notes
router.put("/:id", updateNote);         // PUT /api/notes/:id
router.delete("/:id", deleteNote);      // DELETE /api/notes/:id

export default router;