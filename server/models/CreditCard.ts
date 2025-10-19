import mongoose from 'mongoose';
import { CreditCard } from '../../shared/schema';

const creditCardSchema = new mongoose.Schema<CreditCard>({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  annualFee: { type: Number, required: true },
  rewardRate: { type: String, required: true },
  signupBonus: { type: String, required: true },
  benefits: { type: [String], required: true, default: [] },
  category: { type: String, enum: ['travel', 'dining', 'cashback', 'general', 'shopping'], required: true },
});

export const CreditCardModel = mongoose.model<CreditCard>('CreditCard', creditCardSchema);