import express from "express";
import dotenv from "dotenv";
import coverLetterRoutes from "./routes/motivationRoutes.js";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
const __dirname = path.resolve();
app.use(express.static(__dirname));

// Routes
app.use("/api/cover-letters", coverLetterRoutes);

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});