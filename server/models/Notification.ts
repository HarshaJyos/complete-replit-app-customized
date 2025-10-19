import mongoose from "mongoose";
import { Notification } from "../../shared/schema";

const notificationSchema = new mongoose.Schema<Notification>({
  userId: { type: String, required: true, index: true },
  message: { type: String, required: true },
  read: { type: Boolean, required: true, default: false },
  createdAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
});

export const NotificationModel = mongoose.model<Notification>(
  "Notification",
  notificationSchema
);
