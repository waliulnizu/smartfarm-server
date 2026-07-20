import { Request, Response } from "express";
import mongoose from "mongoose";
import Animal from "../models/Animal";
import PregnancyHistory from "../models/PregnancyHistory";

export async function recordCalving(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { motherId, inseminationDate, actualDeliveryDate, notes } = req.body;

    if (!motherId || !inseminationDate || !actualDeliveryDate) {
      res.status(400).json({ message: "motherId, inseminationDate, and actualDeliveryDate are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(motherId)) {
      res.status(400).json({ message: "Invalid mother animal ID" });
      return;
    }

    const mother = await Animal.findById(motherId);
    if (!mother) {
      res.status(404).json({ message: "Mother animal not found" });
      return;
    }

    if (mother.type !== "Cow" && mother.type !== "Goat") {
      res.status(400).json({ message: "Calving recording is only for Cow or Goat" });
      return;
    }

    const prefix = mother.type === "Cow" ? "C" : "G";
    const existingCount = await Animal.countDocuments({
      ownerId: userId,
      type: mother.type,
    });
    const nextId = `${prefix}-${existingCount + 1}`;

    const calf = await Animal.create({
      type: mother.type,
      identityNumberOrBatchName: nextId,
      identificationType: "neck-tag",
      breed: mother.breed,
      entryWeight: 0,
      entryDate: new Date(actualDeliveryDate),
      status: "healthy",
      ownerId: userId,
      subType: "Calf",
      gender: "Female",
      source: "Farm Born",
    });

    const pregnancyHistory = await PregnancyHistory.findOne({
      animalId: motherId,
      inseminationDate: new Date(inseminationDate),
    });

    if (pregnancyHistory) {
      pregnancyHistory.actualDeliveryDate = new Date(actualDeliveryDate);
      pregnancyHistory.status = "Completed";
      pregnancyHistory.calfId = calf._id;
      if (notes) pregnancyHistory.notes = notes;
      await pregnancyHistory.save();
    } else {
      await PregnancyHistory.create({
        animalId: motherId,
        inseminationDate: new Date(inseminationDate),
        expectedDeliveryDate: new Date(actualDeliveryDate),
        actualDeliveryDate: new Date(actualDeliveryDate),
        status: "Completed",
        calfId: calf._id,
        notes,
        ownerId: userId,
      });
    }

    mother.isPregnant = false;
    mother.subType = mother.type === "Cow" ? "Milch Cow" : undefined;
    mother.calvingCount = (mother.calvingCount || 0) + 1;
    mother.weightFrequencyDays = 30;
    await mother.save();

    res.status(201).json({
      message: "Calving recorded successfully",
      calf: {
        _id: calf._id,
        identityNumberOrBatchName: calf.identityNumberOrBatchName,
        type: calf.type,
        breed: calf.breed,
      },
      mother: {
        _id: mother._id,
        identityNumberOrBatchName: mother.identityNumberOrBatchName,
        calvingCount: mother.calvingCount,
        isPregnant: mother.isPregnant,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error while recording calving" });
  }
}
