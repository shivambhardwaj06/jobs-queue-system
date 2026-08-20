import express from "express";
import { createJob } from "../controllers/job.controller.js";
import { getJobById } from "../controllers/job.controller.js";
const router = express.Router();

router.post("/", createJob);
router.get("/:id", getJobById);

export default router;