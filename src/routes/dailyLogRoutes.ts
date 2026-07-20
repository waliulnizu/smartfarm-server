import { Router } from "express";
import { createDailyLog, getWeightGrowth } from "../controllers/dailyLogController";
import { authenticate } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", authenticate, createDailyLog);
router.get("/:animalId/weight-growth", authenticate, getWeightGrowth);

export default router;
