import { Request, Response } from "express";
import mongoose from "mongoose";
import DailyLog from "../models/DailyLog";
import Animal from "../models/Animal";

export async function createDailyLog(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      animalId,
      date,
      feedConsumedKg,
      milkCollectedLiters,
      eggsCollectedCount,
      currentWeight,
      healthNotes,
      extraMedicine,
      isFeedDeficit,
    } = req.body;

    if (!animalId || feedConsumedKg === undefined || currentWeight === undefined) {
      res.status(400).json({ message: "Missing required fields: animalId, feedConsumedKg, currentWeight" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(animalId)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const dailyLog = await DailyLog.create({
      animalId,
      date: date || new Date(),
      feedConsumedKg,
      milkCollectedLiters: milkCollectedLiters || 0,
      eggsCollectedCount: eggsCollectedCount || 0,
      currentWeight,
      healthNotes,
      extraMedicine,
      isFeedDeficit: isFeedDeficit || false,
    });

    if (currentWeight > 0) {
      await Animal.findByIdAndUpdate(animalId, {
        lastWeightTakenDate: date || new Date(),
      });
    }

    res.status(201).json({
      message: "Daily log saved successfully",
      dailyLog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while saving daily log" });
  }
}

interface WeightGrowthResponse {
  animalId: string;
  latestRecord: {
    weight: number;
    date: Date;
  };
  previousRecord: {
    weight: number;
    date: Date;
  };
  dayRange: number;
  netWeightChange: number;
  percentageChange: number;
}

export async function getWeightGrowth(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const animalId = req.params.animalId as string;
    const days = parseInt(req.query.days as string, 10) || 15;

    if (!mongoose.Types.ObjectId.isValid(animalId)) {
      res.status(400).json({ message: "Invalid animal ID format" });
      return;
    }

    const latestRecord = await DailyLog.findOne({ animalId })
      .sort({ date: -1 })
      .lean();

    if (!latestRecord) {
      res.status(404).json({
        message: "No daily log records found for this animal",
      });
      return;
    }

    const targetDate = new Date(latestRecord.date);
    targetDate.setDate(targetDate.getDate() - days);

    const previousRecord = await DailyLog.findOne({
      animalId,
      date: { $lte: targetDate },
    })
      .sort({ date: -1 })
      .lean();

    if (!previousRecord) {
      res.status(404).json({
        message: `No weight record found from around ${days} days ago. Not enough historical data for comparison.`,
      });
      return;
    }

    const netWeightChange =
      Math.round((latestRecord.currentWeight - previousRecord.currentWeight) * 100) / 100;

    const percentageChange =
      Math.round(
        ((latestRecord.currentWeight - previousRecord.currentWeight) /
          previousRecord.currentWeight) *
          100 *
          100
      ) / 100;

    const response: WeightGrowthResponse = {
      animalId,
      latestRecord: {
        weight: latestRecord.currentWeight,
        date: latestRecord.date,
      },
      previousRecord: {
        weight: previousRecord.currentWeight,
        date: previousRecord.date,
      },
      dayRange: days,
      netWeightChange,
      percentageChange,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error while calculating weight growth" });
  }
}
