import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

export async function registerStaff(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: "Staff" });

    res.status(201).json({
      message: "Staff created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch {
    res.status(500).json({ message: "Server error while creating staff" });
  }
}

export async function listUsers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await User.find()
      .select("name email role isActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ users, count: users.length });
  } catch {
    res.status(500).json({ message: "Server error while fetching users" });
  }
}

export async function toggleUserStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (id === currentUser.userId) {
      res.status(400).json({ message: "Cannot deactivate yourself" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch {
    res.status(500).json({ message: "Server error while toggling user" });
  }
}

export async function deleteUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (id === currentUser.userId) {
      res.status(400).json({ message: "Cannot delete yourself" });
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error while deleting user" });
  }
}
