import express from "express";
import { generateCoverLetters } from "../controller/motivationcontroller.js";

const router = express.Router();

router.post("/generate", generateCoverLetters);

export default router;
