import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { recordCalving } from "../controllers/calvingController";

const router: Router = Router();

router.post("/", authenticate, recordCalving);

export default router;
