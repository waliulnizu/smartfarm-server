import { Request, Response } from "express";
import mongoose from "mongoose";
import Animal from "../models/Animal";
import DailyLog from "../models/DailyLog";

export async function getWeightScheduleAlerts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const animals = await Animal.find({
      type: { $in: ["Cow", "Goat"] },
    })
      .select("type identityNumberOrBatchName name breed weightFrequencyDays lastWeightTakenDate entryDate")
      .lean();

    const now = new Date();
    const alerts: any[] = [];

    for (const animal of animals) {
      const frequencyDays = animal.weightFrequencyDays || 30;
      const lastWeight = animal.lastWeightTakenDate;

      let overdueDays = 0;
      let nextDueDate: Date;

      if (!lastWeight) {
        nextDueDate = new Date(animal.entryDate);
        nextDueDate.setDate(nextDueDate.getDate() + frequencyDays);
        overdueDays = Math.floor(
          (now.getTime() - nextDueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      } else {
        nextDueDate = new Date(lastWeight);
        nextDueDate.setDate(nextDueDate.getDate() + frequencyDays);
        overdueDays = Math.floor(
          (now.getTime() - nextDueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      if (overdueDays >= 0) {
        alerts.push({
          animalId: animal._id,
          identityNumber: animal.identityNumberOrBatchName,
          name: animal.name,
          type: animal.type,
          breed: animal.breed,
          frequencyDays,
          lastWeightTakenDate: animal.lastWeightTakenDate || null,
          nextDueDate,
          overdueDays,
          urgency: overdueDays === 0 ? "due-today" : overdueDays <= 3 ? "overdue-soon" : "overdue",
        });
      }
    }

    alerts.sort((a: any, b: any) => b.overdueDays - a.overdueDays);

    res.status(200).json({ alerts, count: alerts.length });
  } catch {
    res.status(500).json({ message: "Server error while fetching weight schedule alerts" });
  }
}

export async function updateLastWeightDate(
  animalId: string
): Promise<void> {
  try {
    const latestLog = await DailyLog.findOne({ animalId })
      .sort({ date: -1 })
      .lean();

    if (latestLog) {
      await Animal.findByIdAndUpdate(animalId, {
        lastWeightTakenDate: latestLog.date,
      });
    }
  } catch {
    // silent - best effort
  }
}
