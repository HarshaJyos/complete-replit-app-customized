import mongoose from "mongoose";
import { UserProfile } from "../../shared/schema";

// Minimal user schema, as most user data is in UserProfile
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
});

export const UserModel = mongoose.model("User", userSchema);
