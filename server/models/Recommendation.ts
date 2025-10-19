import mongoose, { Schema } from "mongoose";
import { Recommendation } from "../../shared/schema";

const recommendationSchema = new mongoose.Schema<Recommendation>({
  userId: { type: String, required: true, index: true },
  creditCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreditCard",
    required: true,
  },
  matchScore: { type: Number, required: true },
  reasonCode: { type: String, required: true },
});

export const RecommendationModel = mongoose.model<Recommendation>(
  "Recommendation",
  recommendationSchema
);
