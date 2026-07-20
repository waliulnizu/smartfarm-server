import { Router } from "express";
import { getVaccineAlerts } from "../controllers/vaccineAlertController";
import { authenticate } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/alerts", authenticate, getVaccineAlerts);

export default router;
