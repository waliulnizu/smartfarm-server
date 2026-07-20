import { Router } from "express";
import Animal from "../models/Animal";

const router: Router = Router();

router.get("/", async (_req, res) => {
  try {
    const { type, breed, gender, subType, search, sort, page = "1", limit = "12" } = _req.query;
    const filter: any = { type: "Cow" };
    if (type) filter.type = type;
    if (breed) filter.breed = breed;
    if (gender) filter.gender = gender;
    if (subType) filter.subType = subType;
    if (search) {
      filter.$or = [
        { identityNumberOrBatchName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
      ];
    }

    let sortObj: any = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { purchasePrice: 1 };
    else if (sort === "price_desc") sortObj = { purchasePrice: -1 };
    else if (sort === "weight_asc") sortObj = { entryWeight: 1 };
    else if (sort === "weight_desc") sortObj = { entryWeight: -1 };
    else if (sort === "name") sortObj = { name: 1 };

    const pageNum = Math.max(1, parseInt(page as string));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * pageSize;

    const [animals, total] = await Promise.all([
      Animal.find(filter)
        .select("type identityNumberOrBatchName name breed subType gender source purchasePrice originDistrict entryWeight isPregnant")
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Animal.countDocuments(filter),
    ]);

    res.json({
      animals,
      count: animals.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/breeds", async (_req, res) => {
  try {
    const breeds = await Animal.distinct("breed", { type: "Cow" });
    res.json({ breeds });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .select("type identityNumberOrBatchName name breed subType gender source purchasePrice originDistrict entryWeight entryDate isPregnant calvingCount")
      .lean();
    if (!animal) { res.status(404).json({ message: "Not found" }); return; }
    res.json({ animal });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
