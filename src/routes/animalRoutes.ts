import { Router } from "express";
import { getMyAnimals, createAnimal, getNextAnimalId, updateAnimal, deleteAnimal, bulkSeed, bulkInsertAnimals } from "../controllers/animalController";
import { authenticate } from "../middleware/authMiddleware";

// 💡 এখানে স্পষ্ট করে : Router টাইপটি বলে দিন
const router: Router = Router();

router.get("/", authenticate, getMyAnimals);
router.get("/next-id", authenticate, getNextAnimalId);
router.post("/", authenticate, createAnimal);
router.post("/bulk", authenticate, bulkInsertAnimals);
router.put("/:id", authenticate, updateAnimal);
router.delete("/:id", authenticate, deleteAnimal);
router.post("/seed", authenticate, bulkSeed);

export default router;