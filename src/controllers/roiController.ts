import { Request, Response } from "express";
import mongoose from "mongoose";
import Animal from "../models/Animal";
import DailyLog from "../models/DailyLog";
import Expense from "../models/Expense";
import PregnancyHistory from "../models/PregnancyHistory";

export async function getAnimalROI(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const animalId = req.params.animalId as string;

    if (!mongoose.Types.ObjectId.isValid(animalId)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const animal = await Animal.findById(animalId).lean();
    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    const milkPricePerLiter = 80;
    const latestLogs = await DailyLog.find({ animalId })
      .sort({ date: -1 })
      .lean();

    let totalMilkLiters = 0;
    let latestWeight = animal.entryWeight;
    let latestDate: Date | null = null;

    if (latestLogs.length > 0) {
      latestWeight = latestLogs[0].currentWeight;
      latestDate = latestLogs[0].date;

      const firstDate = latestLogs[latestLogs.length - 1].date;
      const totalDays = Math.max(
        1,
        Math.ceil(
          (new Date(latestDate).getTime() - new Date(firstDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      for (const log of latestLogs) {
        totalMilkLiters += log.milkCollectedLiters || 0;
      }

      if (totalMilkLiters === 0 && animal.type === "Cow") {
        const avgDailyMilk = 8;
        totalMilkLiters = avgDailyMilk * totalDays;
      }
    }

    const milkIncome = totalMilkLiters * milkPricePerLiter;
    const assetValue = latestWeight * (animal.type === "Cow" ? 200 : 150);
    const totalIncome = milkIncome + assetValue;

    const expenses = await Expense.find({
      targetAnimalId: animalId,
    }).lean();

    let totalExpenses = 0;
    const expenseBreakdown: { category: string; amount: number }[] = [];

    if (expenses.length > 0) {
      for (const exp of expenses) {
        const feed = exp.feedPurchaseCost || 0;
        const medicine = exp.medicineCost || 0;
        const utility = exp.utilityBills || 0;
        totalExpenses += feed + medicine + utility;

        if (feed > 0) expenseBreakdown.push({ category: "Feed", amount: feed });
        if (medicine > 0) expenseBreakdown.push({ category: "Medicine", amount: medicine });
        if (utility > 0) expenseBreakdown.push({ category: "Utility", amount: utility });
      }
    } else {
      const avgDailyFeedCost = animal.type === "Cow" ? 300 : 80;
      const feedDays = latestLogs.length > 0
        ? Math.ceil(
            (new Date().getTime() - new Date(animal.entryDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 30;
      totalExpenses = avgDailyFeedCost * feedDays;
      expenseBreakdown.push({ category: "Feed (estimated)", amount: totalExpenses });
    }

    const netProfit = totalIncome - totalExpenses;
    const roi = totalExpenses > 0
      ? Math.round(((netProfit / totalExpenses) * 100) * 100) / 100
      : 0;

    const pregnancyHistory = await PregnancyHistory.find({
      animalId,
    })
      .sort({ inseminationDate: -1 })
      .lean();

    const activePregnancy = pregnancyHistory.find((p) => p.status === "Active");
    const completedPregnancies = pregnancyHistory.filter((p) => p.status === "Completed");

    res.status(200).json({
      animal: {
        _id: animal._id,
        identityNumberOrBatchName: animal.identityNumberOrBatchName,
        name: animal.name,
        type: animal.type,
        breed: animal.breed,
        subType: animal.subType,
        gender: animal.gender,
        source: animal.source,
        purchasePrice: animal.purchasePrice,
        originDistrict: animal.originDistrict,
        entryWeight: animal.entryWeight,
        entryDate: animal.entryDate,
        calvingCount: animal.calvingCount,
      },
      income: {
        totalMilkLiters,
        milkPricePerLiter,
        milkIncome,
        assetValue,
        latestWeight,
        totalIncome,
      },
      expenses: {
        totalExpenses,
        breakdown: expenseBreakdown,
      },
      profit: {
        netProfit,
        roi,
        isProfit: netProfit >= 0,
      },
      pregnancy: {
        isActive: !!activePregnancy,
        activePregnancy: activePregnancy || null,
        completedCount: completedPregnancies.length,
        history: pregnancyHistory,
      },
      logCount: latestLogs.length,
      lastLogDate: latestDate,
    });
  } catch {
    res.status(500).json({ message: "Server error while calculating ROI" });
  }
}

export async function getAllAnimalsROI(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const animals = await Animal.find({})
      .select("type identityNumberOrBatchName name breed subType gender source purchasePrice originDistrict entryWeight entryDate calvingCount isPregnant")
      .lean();

    const milkPricePerLiter = 80;
    const results: any[] = [];

    for (const animal of animals) {
      const latestLogs = await DailyLog.find({ animalId: animal._id })
        .sort({ date: -1 })
        .lean();

      let totalMilkLiters = 0;
      let latestWeight = animal.entryWeight;

      if (latestLogs.length > 0) {
        latestWeight = latestLogs[0].currentWeight;
        const firstDate = latestLogs[latestLogs.length - 1].date;
        const totalDays = Math.max(
          1,
          Math.ceil(
            (new Date(latestLogs[0].date).getTime() - new Date(firstDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );

        for (const log of latestLogs) {
          totalMilkLiters += log.milkCollectedLiters || 0;
        }

        if (totalMilkLiters === 0 && animal.type === "Cow") {
          totalMilkLiters = 8 * totalDays;
        }
      }

      const milkIncome = totalMilkLiters * milkPricePerLiter;
      const assetValue = latestWeight * (animal.type === "Cow" ? 200 : 150);
      const totalIncome = milkIncome + assetValue;

      const expenses = await Expense.find({
        targetAnimalId: animal._id,
      }).lean();

      let totalExpenses = 0;
      if (expenses.length > 0) {
        for (const exp of expenses) {
          totalExpenses += (exp.feedPurchaseCost || 0) + (exp.medicineCost || 0) + (exp.utilityBills || 0);
        }
      } else {
        const avgDailyFeedCost = animal.type === "Cow" ? 300 : 80;
        const feedDays = latestLogs.length > 0
          ? Math.ceil(
              (new Date().getTime() - new Date(animal.entryDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 30;
        totalExpenses = avgDailyFeedCost * feedDays;
      }

      const netProfit = totalIncome - totalExpenses;

      results.push({
        _id: animal._id,
        identityNumber: animal.identityNumberOrBatchName,
        name: animal.name,
        type: animal.type,
        breed: animal.breed,
        subType: animal.subType,
        gender: animal.gender,
        source: animal.source,
        purchasePrice: animal.purchasePrice,
        originDistrict: animal.originDistrict,
        entryWeight: animal.entryWeight,
        latestWeight,
        calvingCount: animal.calvingCount,
        isPregnant: animal.isPregnant,
        totalMilkLiters,
        milkIncome,
        assetValue,
        totalIncome,
        totalExpenses,
        netProfit,
        isProfit: netProfit >= 0,
        logCount: latestLogs.length,
      });
    }

    res.status(200).json({ animals: results, count: results.length });
  } catch {
    res.status(500).json({ message: "Server error while calculating ROI for all animals" });
  }
}
