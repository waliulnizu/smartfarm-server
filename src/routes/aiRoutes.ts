import { Router } from "express";
import { generateCowDescription, chatWithAI } from "../controllers/ai/aiController";

const router: Router = Router();

router.post("/describe", generateCowDescription);
router.post("/chat", chatWithAI);

export default router;
