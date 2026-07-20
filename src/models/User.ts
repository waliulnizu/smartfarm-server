import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "Admin" | "Staff";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Staff"],
      default: "Admin",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);



export default mongoose.model<IUser>("User", UserSchema);
