import { Router } from "express";
import { register, login, refresh, googleLogin, logout, me, updateProfile } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

// 💡 এখানেও : Router টাইপটি বলে দিন
const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/google", googleLogin);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.put("/profile", authenticate, updateProfile);

export default router;