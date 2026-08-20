import { Router } from "express";
import { ServerHealth } from "../controllers/health.controller.js";

const router = express.Router();

router.route("/health").get(
    ServerHealth
)

export default router()