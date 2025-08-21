import express from "express";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";

import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.10.5:5173"],
  }));
}

app.use(express.json());
app.use(rateLimiter);



// app.use((req, res, next) => {
//   console.log("We just got a new request: ", req.method);
//   next();
// });

app.use("/api/notes", notesRoutes);
app.use("/user", userRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (res, req) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on Port:", PORT);
  });
});


