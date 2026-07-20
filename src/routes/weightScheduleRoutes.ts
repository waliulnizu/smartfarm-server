import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getWeightScheduleAlerts } from "../controllers/weightScheduleController";

const router: Router = Router();

router.get("/alerts", authenticate, getWeightScheduleAlerts);

export default router;
