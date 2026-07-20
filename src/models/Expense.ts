import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  feedPurchaseCost: number;
  medicineCost: number;
  utilityBills: number;
  date: Date;
  notes?: string;
  ownerId: mongoose.Types.ObjectId;
  targetAnimalId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    feedPurchaseCost: { type: Number, default: 0, min: 0 },
    medicineCost: { type: Number, default: 0, min: 0 },
    utilityBills: { type: Number, default: 0, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true, maxlength: 500 },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetAnimalId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
    },
  },
  { timestamps: true }
);

ExpenseSchema.index({ ownerId: 1, date: -1 });
ExpenseSchema.index({ ownerId: 1, targetAnimalId: 1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
