import mongoose, { Schema, Document } from "mongoose";

export interface IDailyLog extends Document {
  animalId: mongoose.Types.ObjectId;
  date: Date;
  feedConsumedKg: number;
  milkCollectedLiters: number;
  eggsCollectedCount: number;
  currentWeight: number;
  healthNotes?: string;
  extraMedicine?: string;
  isFeedDeficit: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    animalId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: [true, "Animal reference is required"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    feedConsumedKg: {
      type: Number,
      required: [true, "Feed consumed is required"],
      min: [0, "Feed consumed cannot be negative"],
    },
    milkCollectedLiters: {
      type: Number,
      default: 0,
      min: [0, "Milk collected cannot be negative"],
    },
    eggsCollectedCount: {
      type: Number,
      default: 0,
      min: [0, "Egg count cannot be negative"],
    },
    currentWeight: {
      type: Number,
      required: [true, "Current weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    healthNotes: { type: String, trim: true, maxlength: 500 },
    extraMedicine: { type: String, trim: true, maxlength: 200 },
    isFeedDeficit: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DailyLogSchema.index({ animalId: 1, date: -1 });

export default mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);
