import mongoose, { Schema } from "mongoose";
import { Application } from "../../shared/schema";

const applicationSchema = new mongoose.Schema<Application>({
  userId: { type: String, required: true, index: true },
  creditCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreditCard",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    required: true,
    default: "pending",
  },
  appliedAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
});

export const ApplicationModel = mongoose.model<Application>(
  "Application",
  applicationSchema
);
