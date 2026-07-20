import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { registerStaff, listUsers, toggleUserStatus, deleteUser } from "../controllers/adminController";

const router: Router = Router();

router.use(authenticate);
router.use(authorize("Admin"));

router.post("/users", registerStaff);
router.get("/users", listUsers);
router.patch("/users/:id/toggle", toggleUserStatus);
router.delete("/users/:id", deleteUser);

export default router;
