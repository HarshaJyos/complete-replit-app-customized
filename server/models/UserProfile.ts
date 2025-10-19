import mongoose from "mongoose";
import { UserProfile } from "../../shared/schema";

const userProfileSchema = new mongoose.Schema<UserProfile>({
  userId: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  dob: { type: String },
  annualIncome: { type: Number },
  creditScore: {
    type: String,
    enum: ["poor", "fair", "good", "very good", "excellent"],
  },
  monthlySpending: { type: Number },
  primarySpendingCategory: {
    type: String,
    enum: ["travel", "dining", "groceries", "general", "shopping"],
  },
  pushToken: { type: String },
});

export const UserProfileModel = mongoose.model<UserProfile>(
  "UserProfile",
  userProfileSchema
);
