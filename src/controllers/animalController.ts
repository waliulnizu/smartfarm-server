import { Request, Response } from "express";
import Animal from "../models/Animal";
import mongoose from "mongoose";

const TYPE_PREFIX: Record<string, string> = {
  Cow: "C",
  Goat: "G",
  Hen: "H",
  Duck: "D",
};

const SEED_DATA = {
  cows: [
    { identityNumberOrBatchName: "C-1", name: "Lalghoda", breed: "Holstein Friesian", entryWeight: 320, averageFeedKg: 18, status: "healthy", gender: "Male", subType: "Ox", isPregnant: false, source: "Outside Purchased", purchasePrice: 180000, originDistrict: "Rangpur" },
    { identityNumberOrBatchName: "C-2", name: "Shonali", breed: "Sahiwal", entryWeight: 285, averageFeedKg: 15, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: true, source: "Outside Purchased", purchasePrice: 150000, originDistrict: "Sylhet" },
    { identityNumberOrBatchName: "C-3", name: "Kali", breed: "Local Deshi", entryWeight: 250, averageFeedKg: 13, status: "sick", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-4", name: "Dola", breed: "Friesian Cross", entryWeight: 310, averageFeedKg: 17, status: "healthy", gender: "Female", subType: "Heifer", isPregnant: false, source: "Outside Purchased", purchasePrice: 140000, originDistrict: "Dinajpur" },
    { identityNumberOrBatchName: "C-5", name: "Moti", breed: "Jersey Cross", entryWeight: 290, averageFeedKg: 16, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: true, source: "Outside Purchased", purchasePrice: 160000, originDistrict: "Comilla" },
    { identityNumberOrBatchName: "C-6", name: "Rangila", breed: "Holstein Friesian", entryWeight: 340, averageFeedKg: 19, status: "healthy", gender: "Male", subType: "Ox", isPregnant: false, source: "Outside Purchased", purchasePrice: 200000, originDistrict: "Rajshahi" },
    { identityNumberOrBatchName: "C-7", name: "Boshonti", breed: "Sahiwal", entryWeight: 275, averageFeedKg: 14, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-8", name: "Purnima", breed: "Local Deshi", entryWeight: 230, averageFeedKg: 12, status: "healthy", gender: "Female", subType: "Calf", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-9", name: "Shikha", breed: "Friesian Cross", entryWeight: 305, averageFeedKg: 16, status: "sick", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: 145000, originDistrict: "Bogura" },
    { identityNumberOrBatchName: "C-10", name: "Padma", breed: "Jersey Cross", entryWeight: 295, averageFeedKg: 15, status: "healthy", gender: "Female", subType: "Heifer", isPregnant: false, source: "Outside Purchased", purchasePrice: 130000, originDistrict: "Barishal" },
    { identityNumberOrBatchName: "C-11", name: "Meghla", breed: "Holstein Friesian", entryWeight: 330, averageFeedKg: 18, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: true, source: "Outside Purchased", purchasePrice: 170000, originDistrict: "Mymensingh" },
    { identityNumberOrBatchName: "C-12", name: "Jhorna", breed: "Sahiwal", entryWeight: 265, averageFeedKg: 14, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-13", name: "Tara", breed: "Local Deshi", entryWeight: 240, averageFeedKg: 13, status: "sick", gender: "Male", subType: "Ox", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-14", name: "Rupa", breed: "Friesian Cross", entryWeight: 315, averageFeedKg: 17, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: 155000, originDistrict: "Tangail" },
    { identityNumberOrBatchName: "C-15", name: "Neela", breed: "Jersey Cross", entryWeight: 280, averageFeedKg: 15, status: "healthy", gender: "Female", subType: "Heifer", isPregnant: false, source: "Outside Purchased", purchasePrice: 125000, originDistrict: "Jessore" },
    { identityNumberOrBatchName: "C-16", name: "Shyamoli", breed: "Holstein Friesian", entryWeight: 345, averageFeedKg: 19, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: true, source: "Outside Purchased", purchasePrice: 175000, originDistrict: "Rangpur" },
    { identityNumberOrBatchName: "C-17", name: "Kajol", breed: "Sahiwal", entryWeight: 260, averageFeedKg: 14, status: "healthy", gender: "Female", subType: "Calf", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-18", name: "Hashna", breed: "Local Deshi", entryWeight: 225, averageFeedKg: 12, status: "healthy", gender: "Female", subType: "Calf", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-19", name: "Chapa", breed: "Friesian Cross", entryWeight: 300, averageFeedKg: 16, status: "sick", gender: "Male", subType: "Ox", isPregnant: false, source: "Outside Purchased", purchasePrice: 190000, originDistrict: "Dhaka" },
    { identityNumberOrBatchName: "C-20", name: "Bina", breed: "Jersey Cross", entryWeight: 288, averageFeedKg: 15, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: 148000, originDistrict: "Chattogram" },
    { identityNumberOrBatchName: "C-21", name: "Shathi", breed: "Holstein Friesian", entryWeight: 335, averageFeedKg: 18, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: true, source: "Outside Purchased", purchasePrice: 165000, originDistrict: "Kurigram" },
    { identityNumberOrBatchName: "C-22", name: "Rani", breed: "Sahiwal", entryWeight: 270, averageFeedKg: 14, status: "healthy", gender: "Female", subType: "Heifer", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-23", name: "Moni", breed: "Local Deshi", entryWeight: 245, averageFeedKg: 13, status: "healthy", gender: "Male", subType: "Ox", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "C-24", name: "Shima", breed: "Friesian Cross", entryWeight: 308, averageFeedKg: 17, status: "healthy", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: 152000, originDistrict: "Gazipur" },
    { identityNumberOrBatchName: "C-25", name: "Kona", breed: "Jersey Cross", entryWeight: 292, averageFeedKg: 15, status: "sick", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: 142000, originDistrict: "Faridpur" },
  ],
  goats: [
    { identityNumberOrBatchName: "G-1", name: "Chhagol", breed: "Black Bengal", entryWeight: 22, averageFeedKg: 2.5, status: "healthy", gender: "Male", subType: "Buck", isPregnant: false, source: "Outside Purchased", purchasePrice: 8000, originDistrict: "Sylhet" },
    { identityNumberOrBatchName: "G-2", name: "Bokna", breed: "Jamnapari", entryWeight: 28, averageFeedKg: 3.0, status: "healthy", gender: "Female", subType: "Doe", isPregnant: false, source: "Outside Purchased", purchasePrice: 12000, originDistrict: "Mymensingh" },
    { identityNumberOrBatchName: "G-3", name: "Shada", breed: "Cross Breed", entryWeight: 18, averageFeedKg: 2.0, status: "healthy", gender: "Female", subType: "Kid", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-4", name: "Kalo", breed: "Black Bengal", entryWeight: 20, averageFeedKg: 2.3, status: "sick", gender: "Male", subType: "Buck", isPregnant: false, source: "Outside Purchased", purchasePrice: 7500, originDistrict: "Rangpur" },
    { identityNumberOrBatchName: "G-5", name: "Rongila", breed: "Jamnapari", entryWeight: 30, averageFeedKg: 3.2, status: "healthy", gender: "Female", subType: "Doe", isPregnant: true, source: "Outside Purchased", purchasePrice: 14000, originDistrict: "Comilla" },
    { identityNumberOrBatchName: "G-6", name: "Sona", breed: "Black Bengal", entryWeight: 21, averageFeedKg: 2.4, status: "healthy", gender: "Female", subType: "Doe", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-7", name: "Pori", breed: "Cross Breed", entryWeight: 19, averageFeedKg: 2.2, status: "healthy", gender: "Female", subType: "Kid", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-8", name: "Maya", breed: "Black Bengal", entryWeight: 24, averageFeedKg: 2.6, status: "healthy", gender: "Female", subType: "Doe", isPregnant: true, source: "Outside Purchased", purchasePrice: 10000, originDistrict: "Rajshahi" },
    { identityNumberOrBatchName: "G-9", name: "Bela", breed: "Jamnapari", entryWeight: 32, averageFeedKg: 3.5, status: "sick", gender: "Female", subType: "Doe", isPregnant: false, source: "Outside Purchased", purchasePrice: 15000, originDistrict: "Dinajpur" },
    { identityNumberOrBatchName: "G-10", name: "Tuli", breed: "Cross Breed", entryWeight: 17, averageFeedKg: 2.0, status: "healthy", gender: "Male", subType: "Buck", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-11", name: "Guri", breed: "Black Bengal", entryWeight: 23, averageFeedKg: 2.5, status: "healthy", gender: "Male", subType: "Buck", isPregnant: false, source: "Outside Purchased", purchasePrice: 8500, originDistrict: "Jessore" },
    { identityNumberOrBatchName: "G-12", name: "Mina", breed: "Jamnapari", entryWeight: 27, averageFeedKg: 3.0, status: "healthy", gender: "Female", subType: "Doe", isPregnant: false, source: "Outside Purchased", purchasePrice: 11000, originDistrict: "Barishal" },
    { identityNumberOrBatchName: "G-13", name: "Lota", breed: "Cross Breed", entryWeight: 16, averageFeedKg: 1.9, status: "sick", gender: "Female", subType: "Kid", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-14", name: "Neel", breed: "Black Bengal", entryWeight: 25, averageFeedKg: 2.7, status: "healthy", gender: "Male", subType: "Buck", isPregnant: false, source: "Outside Purchased", purchasePrice: 9000, originDistrict: "Tangail" },
    { identityNumberOrBatchName: "G-15", name: "Piu", breed: "Jamnapari", entryWeight: 29, averageFeedKg: 3.1, status: "healthy", gender: "Female", subType: "Doe", isPregnant: true, source: "Outside Purchased", purchasePrice: 13000, originDistrict: "Sylhet" },
    { identityNumberOrBatchName: "G-16", name: "Rani", breed: "Black Bengal", entryWeight: 22, averageFeedKg: 2.4, status: "healthy", gender: "Female", subType: "Doe", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-17", name: "Chumki", breed: "Cross Breed", entryWeight: 20, averageFeedKg: 2.2, status: "healthy", gender: "Female", subType: "Kid", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-18", name: "Dulal", breed: "Jamnapari", entryWeight: 33, averageFeedKg: 3.6, status: "healthy", gender: "Male", subType: "Buck", isPregnant: false, source: "Outside Purchased", purchasePrice: 16000, originDistrict: "Chattogram" },
    { identityNumberOrBatchName: "G-19", name: "Lucky", breed: "Black Bengal", entryWeight: 26, averageFeedKg: 2.8, status: "sick", gender: "Female", subType: "Doe", isPregnant: false, source: "Outside Purchased", purchasePrice: 10500, originDistrict: "Bogura" },
    { identityNumberOrBatchName: "G-20", name: "Sathi", breed: "Cross Breed", entryWeight: 19, averageFeedKg: 2.1, status: "healthy", gender: "Female", subType: "Kid", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-21", name: "Bandhu", breed: "Black Bengal", entryWeight: 24, averageFeedKg: 2.6, status: "healthy", gender: "Male", subType: "Buck", isPregnant: false, source: "Outside Purchased", purchasePrice: 8800, originDistrict: "Faridpur" },
    { identityNumberOrBatchName: "G-22", name: "Golap", breed: "Jamnapari", entryWeight: 31, averageFeedKg: 3.3, status: "healthy", gender: "Female", subType: "Doe", isPregnant: true, source: "Outside Purchased", purchasePrice: 13500, originDistrict: "Rangpur" },
    { identityNumberOrBatchName: "G-23", name: "Jharna", breed: "Cross Breed", entryWeight: 18, averageFeedKg: 2.0, status: "sick", gender: "Female", subType: "Kid", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-24", name: "Koli", breed: "Black Bengal", entryWeight: 23, averageFeedKg: 2.5, status: "healthy", gender: "Female", subType: "Doe", isPregnant: false, source: "Farm Born", purchasePrice: 0, originDistrict: "" },
    { identityNumberOrBatchName: "G-25", name: "Lily", breed: "Jamnapari", entryWeight: 28, averageFeedKg: 3.0, status: "healthy", gender: "Female", subType: "Doe", isPregnant: false, source: "Outside Purchased", purchasePrice: 11500, originDistrict: "Gazipur" },
  ],
  hens: [
    { identityNumberOrBatchName: "Broiler-01", ringNumber: "R-H101", breed: "Broiler", entryWeight: 1.8, averageFeedKg: 0.12, status: "healthy" },
    { identityNumberOrBatchName: "Broiler-02", ringNumber: "R-H102", breed: "Broiler", entryWeight: 1.9, averageFeedKg: 0.13, status: "healthy" },
    { identityNumberOrBatchName: "Broiler-03", ringNumber: "R-H103", breed: "Broiler", entryWeight: 1.7, averageFeedKg: 0.11, status: "sick" },
    { identityNumberOrBatchName: "Broiler-04", ringNumber: "R-H104", breed: "Broiler", entryWeight: 2.0, averageFeedKg: 0.14, status: "healthy" },
    { identityNumberOrBatchName: "Broiler-05", ringNumber: "R-H105", breed: "Broiler", entryWeight: 1.8, averageFeedKg: 0.12, status: "healthy" },
    { identityNumberOrBatchName: "Layer-01", ringNumber: "R-H106", breed: "ISA Brown", entryWeight: 1.6, averageFeedKg: 0.10, status: "healthy" },
    { identityNumberOrBatchName: "Layer-02", ringNumber: "R-H107", breed: "ISA Brown", entryWeight: 1.7, averageFeedKg: 0.11, status: "healthy" },
    { identityNumberOrBatchName: "Layer-03", ringNumber: "R-H108", breed: "ISA Brown", entryWeight: 1.5, averageFeedKg: 0.10, status: "sick" },
    { identityNumberOrBatchName: "Layer-04", ringNumber: "R-H109", breed: "ISA Brown", entryWeight: 1.6, averageFeedKg: 0.10, status: "healthy" },
    { identityNumberOrBatchName: "Layer-05", ringNumber: "R-H110", breed: "ISA Brown", entryWeight: 1.7, averageFeedKg: 0.11, status: "healthy" },
    { identityNumberOrBatchName: "Sonali-01", ringNumber: "R-H111", breed: "Sonali", entryWeight: 1.4, averageFeedKg: 0.09, status: "healthy" },
    { identityNumberOrBatchName: "Sonali-02", ringNumber: "R-H112", breed: "Sonali", entryWeight: 1.5, averageFeedKg: 0.09, status: "healthy" },
    { identityNumberOrBatchName: "Sonali-03", ringNumber: "R-H113", breed: "Sonali", entryWeight: 1.3, averageFeedKg: 0.08, status: "sick" },
    { identityNumberOrBatchName: "Sonali-04", ringNumber: "R-H114", breed: "Sonali", entryWeight: 1.4, averageFeedKg: 0.09, status: "healthy" },
    { identityNumberOrBatchName: "Sonali-05", ringNumber: "R-H115", breed: "Sonali", entryWeight: 1.5, averageFeedKg: 0.10, status: "healthy" },
    { identityNumberOrBatchName: "Cock-01", ringNumber: "R-H116", breed: "Game Fowl", entryWeight: 2.2, averageFeedKg: 0.15, status: "healthy" },
    { identityNumberOrBatchName: "Cock-02", ringNumber: "R-H117", breed: "Game Fowl", entryWeight: 2.3, averageFeedKg: 0.16, status: "healthy" },
    { identityNumberOrBatchName: "Cock-03", ringNumber: "R-H118", breed: "Game Fowl", entryWeight: 2.1, averageFeedKg: 0.14, status: "healthy" },
    { identityNumberOrBatchName: "Cock-04", ringNumber: "R-H119", breed: "Game Fowl", entryWeight: 2.4, averageFeedKg: 0.16, status: "sick" },
    { identityNumberOrBatchName: "Cock-05", ringNumber: "R-H120", breed: "Game Fowl", entryWeight: 2.2, averageFeedKg: 0.15, status: "healthy" },
    { identityNumberOrBatchName: "Deshi-01", ringNumber: "R-H121", breed: "Deshi", entryWeight: 1.2, averageFeedKg: 0.08, status: "healthy" },
    { identityNumberOrBatchName: "Deshi-02", ringNumber: "R-H122", breed: "Deshi", entryWeight: 1.3, averageFeedKg: 0.08, status: "healthy" },
    { identityNumberOrBatchName: "Deshi-03", ringNumber: "R-H123", breed: "Deshi", entryWeight: 1.1, averageFeedKg: 0.07, status: "sick" },
    { identityNumberOrBatchName: "Deshi-04", ringNumber: "R-H124", breed: "Deshi", entryWeight: 1.2, averageFeedKg: 0.08, status: "healthy" },
    { identityNumberOrBatchName: "Deshi-05", ringNumber: "R-H125", breed: "Deshi", entryWeight: 1.3, averageFeedKg: 0.09, status: "healthy" },
  ],
  ducks: [
    { identityNumberOrBatchName: "Khaki-01", ringNumber: "R-D101", breed: "Khaki Campbell", entryWeight: 1.8, averageFeedKg: 0.15, status: "healthy" },
    { identityNumberOrBatchName: "Khaki-02", ringNumber: "R-D102", breed: "Khaki Campbell", entryWeight: 1.9, averageFeedKg: 0.16, status: "healthy" },
    { identityNumberOrBatchName: "Khaki-03", ringNumber: "R-D103", breed: "Khaki Campbell", entryWeight: 1.7, averageFeedKg: 0.14, status: "sick" },
    { identityNumberOrBatchName: "Khaki-04", ringNumber: "R-D104", breed: "Khaki Campbell", entryWeight: 2.0, averageFeedKg: 0.17, status: "healthy" },
    { identityNumberOrBatchName: "Khaki-05", ringNumber: "R-D105", breed: "Khaki Campbell", entryWeight: 1.8, averageFeedKg: 0.15, status: "healthy" },
    { identityNumberOrBatchName: "Pekin-01", ringNumber: "R-D106", breed: "Pekin", entryWeight: 2.5, averageFeedKg: 0.20, status: "healthy" },
    { identityNumberOrBatchName: "Pekin-02", ringNumber: "R-D107", breed: "Pekin", entryWeight: 2.6, averageFeedKg: 0.21, status: "healthy" },
    { identityNumberOrBatchName: "Pekin-03", ringNumber: "R-D108", breed: "Pekin", entryWeight: 2.4, averageFeedKg: 0.19, status: "sick" },
    { identityNumberOrBatchName: "Pekin-04", ringNumber: "R-D109", breed: "Pekin", entryWeight: 2.7, averageFeedKg: 0.22, status: "healthy" },
    { identityNumberOrBatchName: "Pekin-05", ringNumber: "R-D110", breed: "Pekin", entryWeight: 2.5, averageFeedKg: 0.20, status: "healthy" },
    { identityNumberOrBatchName: "Indian-01", ringNumber: "R-D111", breed: "Indian Runner", entryWeight: 1.5, averageFeedKg: 0.12, status: "healthy" },
    { identityNumberOrBatchName: "Indian-02", ringNumber: "R-D112", breed: "Indian Runner", entryWeight: 1.6, averageFeedKg: 0.13, status: "healthy" },
    { identityNumberOrBatchName: "Indian-03", ringNumber: "R-D113", breed: "Indian Runner", entryWeight: 1.4, averageFeedKg: 0.11, status: "sick" },
    { identityNumberOrBatchName: "Indian-04", ringNumber: "R-D114", breed: "Indian Runner", entryWeight: 1.5, averageFeedKg: 0.12, status: "healthy" },
    { identityNumberOrBatchName: "Indian-05", ringNumber: "R-D115", breed: "Indian Runner", entryWeight: 1.6, averageFeedKg: 0.13, status: "healthy" },
    { identityNumberOrBatchName: "Muscovy-01", ringNumber: "R-D116", breed: "Muscovy", entryWeight: 3.0, averageFeedKg: 0.22, status: "healthy" },
    { identityNumberOrBatchName: "Muscovy-02", ringNumber: "R-D117", breed: "Muscovy", entryWeight: 3.2, averageFeedKg: 0.23, status: "healthy" },
    { identityNumberOrBatchName: "Muscovy-03", ringNumber: "R-D118", breed: "Muscovy", entryWeight: 2.8, averageFeedKg: 0.21, status: "sick" },
    { identityNumberOrBatchName: "Muscovy-04", ringNumber: "R-D119", breed: "Muscovy", entryWeight: 3.1, averageFeedKg: 0.22, status: "healthy" },
    { identityNumberOrBatchName: "Muscovy-05", ringNumber: "R-D120", breed: "Muscovy", entryWeight: 3.3, averageFeedKg: 0.24, status: "healthy" },
    { identityNumberOrBatchName: "Runner-01", ringNumber: "R-D121", breed: "Indian Runner", entryWeight: 1.4, averageFeedKg: 0.11, status: "healthy" },
    { identityNumberOrBatchName: "Runner-02", ringNumber: "R-D122", breed: "Indian Runner", entryWeight: 1.5, averageFeedKg: 0.12, status: "healthy" },
    { identityNumberOrBatchName: "Runner-03", ringNumber: "R-D123", breed: "Indian Runner", entryWeight: 1.3, averageFeedKg: 0.10, status: "sick" },
    { identityNumberOrBatchName: "Runner-04", ringNumber: "R-D124", breed: "Indian Runner", entryWeight: 1.4, averageFeedKg: 0.11, status: "healthy" },
    { identityNumberOrBatchName: "Runner-05", ringNumber: "R-D125", breed: "Indian Runner", entryWeight: 1.6, averageFeedKg: 0.13, status: "healthy" },
  ],
};

export async function bulkSeed(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const allAnimals: any[] = [];
    const ownerObjId = new mongoose.Types.ObjectId(userId);
    const today = new Date();

    for (const typeKey of ["cows", "goats", "hens", "ducks"] as const) {
      const items = (SEED_DATA as any)[typeKey];
      const animalType = typeKey === "cows" ? "Cow" : typeKey === "goats" ? "Goat" : typeKey === "hens" ? "Hen" : "Duck";
      const idType = animalType === "Hen" || animalType === "Duck" ? "leg-ring" : "neck-tag";

      for (const item of items) {
        allAnimals.push({
          type: animalType,
          identityNumberOrBatchName: item.identityNumberOrBatchName,
          name: item.name || undefined,
          ringNumber: item.ringNumber || undefined,
          identificationType: idType,
          breed: item.breed,
          averageFeedKg: item.averageFeedKg,
          entryWeight: item.entryWeight,
          entryDate: new Date(today.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          status: item.status || "healthy",
          gender: item.gender || undefined,
          subType: item.subType || undefined,
          isPregnant: item.isPregnant || false,
          source: item.source || "Outside Purchased",
          purchasePrice: item.purchasePrice || 0,
          originDistrict: item.originDistrict || undefined,
          ownerId: ownerObjId,
        });
      }
    }

    await Animal.deleteMany({ ownerId: userId });
    const inserted = await Animal.insertMany(allAnimals);

    res.status(201).json({
      message: "Seed data loaded successfully",
      total: inserted.length,
      counts: {
        Cow: SEED_DATA.cows.length,
        Goat: SEED_DATA.goats.length,
        Hen: SEED_DATA.hens.length,
        Duck: SEED_DATA.ducks.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: "Server error while seeding data" });
  }
}

export async function getNextAnimalId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    const { type } = req.query;

    if (!type || !TYPE_PREFIX[type as string]) {
      res.status(400).json({ message: "Valid type query param is required" });
      return;
    }

    const count = await Animal.countDocuments({ ownerId: userId, type });
    const prefix = TYPE_PREFIX[type as string];
    const nextId = `${prefix}-${count + 1}`;

    res.status(200).json({ nextId });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMyAnimals(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const animals = await Animal.find({})
      .select("type identityNumberOrBatchName name ringNumber identificationType breed status averageFeedKg entryWeight subType gender isPregnant calvingCount source purchasePrice originDistrict weightFrequencyDays lastWeightTakenDate")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ animals, count: animals.length });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching animals" });
  }
}

export async function updateAnimal(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, breed, averageFeedKg, entryWeight, status } = req.body;

    const animal = await Animal.findById(id);
    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    if (name !== undefined) animal.name = name;
    if (breed !== undefined) animal.breed = breed;
    if (averageFeedKg !== undefined) animal.averageFeedKg = averageFeedKg;
    if (entryWeight !== undefined) animal.entryWeight = entryWeight;
    if (status !== undefined) animal.status = status;

    await animal.save();

    res.status(200).json({ message: "Animal updated", animal });
  } catch {
    res.status(500).json({ message: "Server error while updating animal" });
  }
}

export async function deleteAnimal(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const animal = await Animal.findByIdAndDelete(id);
    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    res.status(200).json({ message: "Animal deleted" });
  } catch {
    res.status(500).json({ message: "Server error while deleting animal" });
  }
}

export async function createAnimal(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    const {
      type,
      identityNumberOrBatchName,
      name,
      ringNumber,
      identificationType,
      breed,
      averageFeedKg,
      entryWeight,
      gender,
      subType,
      isPregnant,
      source,
      purchasePrice,
      originDistrict,
    } = req.body;

    if (!type || !identityNumberOrBatchName || !breed || entryWeight === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const animal = await Animal.create({
      type,
      identityNumberOrBatchName,
      name,
      ringNumber,
      identificationType,
      breed,
      averageFeedKg: averageFeedKg || 0,
      entryWeight,
      ownerId: userId,
      gender: gender || undefined,
      subType: subType || undefined,
      isPregnant: isPregnant || false,
      source: source || "Outside Purchased",
      purchasePrice: purchasePrice || 0,
      originDistrict: originDistrict || undefined,
    });

    res.status(201).json({
      message: `${type} registered successfully`,
      animal,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message: "An animal with this identity number already exists",
      });
      return;
    }
    res.status(500).json({ message: "Server error while creating animal" });
  }
}

export async function bulkInsertAnimals(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    const { animals } = req.body;

    if (!Array.isArray(animals) || animals.length === 0) {
      res.status(400).json({ message: "Provide animals array in body" });
      return;
    }

    const docs = animals.map((a: any) => ({
      type: a.type,
      identityNumberOrBatchName: a.identityNumberOrBatchName,
      name: a.name || undefined,
      ringNumber: a.ringNumber || undefined,
      identificationType: a.identificationType,
      breed: a.breed,
      averageFeedKg: a.averageFeedKg || 0,
      entryWeight: a.entryWeight,
      entryDate: a.entryDate || new Date(),
      status: a.status || "healthy",
      gender: a.gender || undefined,
      subType: a.subType || undefined,
      isPregnant: a.isPregnant || false,
      source: a.source || "Outside Purchased",
      purchasePrice: a.purchasePrice || 0,
      originDistrict: a.originDistrict || undefined,
      ownerId: new mongoose.Types.ObjectId(userId),
    }));

    const inserted = await Animal.insertMany(docs);

    res.status(201).json({
      message: `${inserted.length} animals inserted`,
      count: inserted.length,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Duplicate identity number found" });
      return;
    }
    res.status(500).json({ message: "Server error while bulk inserting" });
  }
}
