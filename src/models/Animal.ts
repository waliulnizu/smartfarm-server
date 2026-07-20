import mongoose, { Schema, Document } from "mongoose";

export type AnimalType = "Cow" | "Goat" | "Hen" | "Duck";
export type AnimalStatus = "healthy" | "sick";
export type IdentificationType = "neck-tag" | "leg-ring";
export type SubType = "Milch Cow" | "Ox" | "Calf" | "Heifer";
export type Gender = "Male" | "Female";
export type AnimalSource = "Farm Born" | "Outside Purchased";

export interface IAnimal extends Document {
  type: AnimalType;
  identityNumberOrBatchName: string;
  name?: string;
  ringNumber?: string;
  identificationType: IdentificationType;
  averageFeedKg: number;
  entryWeight: number;
  entryDate: Date;
  breed: string;
  status: AnimalStatus;
  ownerId: mongoose.Types.ObjectId;
  subType?: SubType;
  gender?: Gender;
  source: AnimalSource;
  purchasePrice: number;
  originDistrict?: string;
  isPregnant: boolean;
  calvingCount: number;
  weightFrequencyDays: number;
  lastWeightTakenDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema = new Schema<IAnimal>(
  {
    type: {
      type: String,
      enum: {
        values: ["Cow", "Goat", "Hen", "Duck"],
        message: "{VALUE} is not a valid animal type",
      },
      required: [true, "Animal type is required"],
    },
    identityNumberOrBatchName: {
      type: String,
      required: [true, "Identity number or batch name is required"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    ringNumber: {
      type: String,
      trim: true,
    },
    identificationType: {
      type: String,
      enum: ["neck-tag", "leg-ring"],
      required: [true, "Identification type is required"],
    },
    averageFeedKg: {
      type: Number,
      default: 0,
      min: 0,
    },
    entryWeight: {
      type: Number,
      required: [true, "Entry weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["healthy", "sick"],
      default: "healthy",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subType: {
      type: String,
      enum: ["Milch Cow", "Ox", "Calf", "Heifer"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    source: {
      type: String,
      enum: ["Farm Born", "Outside Purchased"],
      default: "Outside Purchased",
    },
    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    originDistrict: {
      type: String,
      trim: true,
    },
    isPregnant: {
      type: Boolean,
      default: false,
    },
    calvingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    weightFrequencyDays: {
      type: Number,
      default: 30,
      min: 1,
    },
    lastWeightTakenDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

AnimalSchema.index({ ownerId: 1, type: 1 });
AnimalSchema.index({ identityNumberOrBatchName: 1, ownerId: 1 }, { unique: true });
AnimalSchema.index({ ownerId: 1, type: 1, isPregnant: 1 });
AnimalSchema.index({ ownerId: 1, weightFrequencyDays: 1, lastWeightTakenDate: 1 });

export default mongoose.model<IAnimal>("Animal", AnimalSchema);
