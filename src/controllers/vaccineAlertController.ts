import { Request, Response } from "express";
import MedicalLog from "../models/MedicalLog";
import Animal from "../models/Animal";

export async function getVaccineAlerts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alertWindow = new Date(today);
    alertWindow.setDate(alertWindow.getDate() + 2);
    alertWindow.setHours(23, 59, 59, 999);

    const upcomingVaccines = await MedicalLog.find({
      isVaccine: true,
      nextDoseDate: { $gte: today, $lte: alertWindow },
    })
      .populate({
        path: "animalId",
        select: "identityNumberOrBatchName name type ringNumber",
      })
      .sort({ nextDoseDate: 1 })
      .lean();

    const filtered = upcomingVaccines.filter((v) => v.animalId !== null);

    const response = filtered.map((log) => {
      const nextDate = new Date(log.nextDoseDate!);
      const diffTime = nextDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const animal = log.animalId as any;

      return {
        logId: log._id,
        medicineName: log.medicineName,
        dosage: log.dosage,
        nextDoseDate: log.nextDoseDate,
        daysUntilDose: daysUntil,
        urgency: daysUntil <= 0 ? "overdue" : daysUntil === 1 ? "tomorrow" : "upcoming",
        animal: {
          id: animal._id,
          identityNumber: animal.identityNumberOrBatchName,
          name: animal.name,
          type: animal.type,
          ringNumber: animal.ringNumber,
        },
      };
    });

    res.status(200).json({ alerts: response, count: response.length });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching vaccine alerts" });
  }
}
