import { Types } from "mongoose";

// Shared TypeScript interfaces for the Credit Card Recommendation App
// Used by both mobile (React Native) and server (Express + MongoDB)

// User Profile Interface
export interface UserProfile {
  userId: string; // Firebase UID
  name?: string; // User's full name
  phone?: string; // User's phone number
  dob?: string; // Date of birth (e.g., "YYYY-MM-DD")
  annualIncome?: number; // Annual income in USD
  creditScore?: "poor" | "fair" | "good" | "very good" | "excellent"; // Credit score range
  monthlySpending?: number; // Monthly spending in USD
  primarySpendingCategory?:
    | "travel"
    | "dining"
    | "groceries"
    | "general"
    | "shopping"; // Primary spending category
  pushToken?: string; // Expo push notification token
}

// Credit Card Interface
export interface CreditCard {
  id?: string; // MongoDB _id (optional for creation)
  name: string; // Card name (e.g., "Chase Sapphire Preferred")
  issuer: string; // Card issuer (e.g., "Chase", "Amex")
  annualFee: number; // Annual fee in USD
  rewardRate: string; // Reward rate (e.g., "2% cashback", "3x points on travel")
  signupBonus: string; // Signup bonus description (e.g., "50,000 points after $4,000 spend")
  benefits: string[]; // List of benefits (e.g., ["No foreign transaction fees", "Travel insurance"])
  category: "travel" | "dining" | "cashback" | "general" | "shopping"; // Card category
}

// Recommendation Interface
export interface Recommendation {
  id?: string; // MongoDB _id (optional for creation)
  userId: string; // Firebase UID
  creditCardId: Types.ObjectId; // Reference to CreditCard _id
  creditCard: CreditCard; // Populated CreditCard object
  matchScore: number; // Percentage match score (0-100)
  reasonCode: string; // JSON stringified reasons for recommendation
}

// Application Interface
export interface Application {
  id?: string; // MongoDB _id (optional for creation)
  userId: string; // Firebase UID
  creditCardId: Types.ObjectId; // Reference to CreditCard _id
  creditCard: CreditCard; // Populated CreditCard object
  status: "pending" | "approved" | "rejected"; // Application status
  appliedAt: string; // ISO date string (e.g., "2025-10-01T08:34:00Z")
}

// Notification Interface
export interface Notification {
  id?: string; // MongoDB _id (optional for creation)
  userId: string; // Firebase UID
  message: string; // Notification message (e.g., "Your application was approved!")
  read: boolean; // Whether the notification has been read
  createdAt: string; // ISO date string
}

// API Response Interface (for consistent API responses)
export interface ApiResponse<T> {
  data?: T; // Generic type for response data
  error?: string; // Optional error message
  success: boolean; // Whether the request was successful
}
