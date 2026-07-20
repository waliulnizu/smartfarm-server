import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { getAnimalROI, getAllAnimalsROI } from "../controllers/roiController";

const router: Router = Router();

router.get("/", authenticate, authorize("Admin"), getAllAnimalsROI);
router.get("/:animalId", authenticate, authorize("Admin"), getAnimalROI);

export default router;
