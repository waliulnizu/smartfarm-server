import mongoose, { Schema, Document } from "mongoose";

export type MedicalLogType = "routine" | "treatment" | "vaccine";

export interface IMedicalLog extends Document {
  animalId: mongoose.Types.ObjectId;
  date: Date;
  medicineName: string;
  dosage: string;
  type: MedicalLogType;
  nextDoseDate?: Date;
  isVaccine: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalLogSchema = new Schema<IMedicalLog>(
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
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["routine", "treatment", "vaccine"],
        message: "{VALUE} is not a valid medical log type",
      },
      required: [true, "Medical log type is required"],
    },
    nextDoseDate: { type: Date },
    isVaccine: { type: Boolean, default: false },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

MedicalLogSchema.index({ animalId: 1, date: -1 });
MedicalLogSchema.index({ nextDoseDate: 1, isVaccine: 1 });
MedicalLogSchema.index({ nextDoseDate: 1 });

export default mongoose.model<IMedicalLog>("MedicalLog", MedicalLogSchema);
