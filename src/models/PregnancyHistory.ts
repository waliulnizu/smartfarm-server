import mongoose, { Schema, Document } from "mongoose";

export type PregnancyStatus = "Active" | "Completed" | "Miscarried";

export interface IPregnancyHistory extends Document {
  animalId: mongoose.Types.ObjectId;
  inseminationDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: PregnancyStatus;
  calfId?: mongoose.Types.ObjectId;
  notes?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PregnancyHistorySchema = new Schema<IPregnancyHistory>(
  {
    animalId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    inseminationDate: {
      type: Date,
      required: [true, "Insemination date is required"],
    },
    expectedDeliveryDate: {
      type: Date,
      required: [true, "Expected delivery date is required"],
    },
    actualDeliveryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Miscarried"],
      default: "Active",
    },
    calfId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
    },
    notes: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

PregnancyHistorySchema.index({ animalId: 1, status: 1 });
PregnancyHistorySchema.index({ ownerId: 1, animalId: 1 });

export default mongoose.model<IPregnancyHistory>("PregnancyHistory", PregnancyHistorySchema);
