import mongoose from "mongoose";
import { CreditCardModel } from "./models/CreditCard";

// Sample credit card data for seeding the database
const seedCreditCards = async () => {
  try {
    // Check if data already exists to avoid duplicates
    const count = await CreditCardModel.countDocuments();
    if (count > 0) {
      console.log("Credit cards already seeded");
      return;
    }

    const creditCards = [
      {
        name: "Chase Sapphire Preferred",
        issuer: "Chase",
        annualFee: 95,
        rewardRate: "2x points on travel and dining",
        signupBonus: "60,000 points after $4,000 spend in 3 months",
        benefits: [
          "No foreign transaction fees",
          "Travel insurance",
          "Points transferable to partners",
        ],
        category: "travel",
      },
      {
        name: "Amex Gold Card",
        issuer: "American Express",
        annualFee: 250,
        rewardRate: "4x points on dining and groceries",
        signupBonus: "60,000 points after $4,000 spend in 6 months",
        benefits: [
          "Dining credits",
          "No foreign transaction fees",
          "Travel perks",
        ],
        category: "dining",
      },
      {
        name: "Citi Double Cash",
        issuer: "Citi",
        annualFee: 0,
        rewardRate: "2% cashback on all purchases",
        signupBonus: "$200 cashback after $1,500 spend in 6 months",
        benefits: ["No annual fee", "Cashback rewards"],
        category: "cashback",
      },
      {
        name: "Discover it Cash Back",
        issuer: "Discover",
        annualFee: 0,
        rewardRate: "5% cashback on rotating categories",
        signupBonus: "Cashback match after first year",
        benefits: ["No annual fee", "Free FICO score"],
        category: "cashback",
      },
      {
        name: "Capital One Venture",
        issuer: "Capital One",
        annualFee: 95,
        rewardRate: "2x miles on all purchases",
        signupBonus: "75,000 miles after $4,000 spend in 3 months",
        benefits: [
          "Global Entry/TSA PreCheck credit",
          "No foreign transaction fees",
        ],
        category: "travel",
      },
    ];

    await CreditCardModel.insertMany(creditCards);
    console.log("Credit cards seeded successfully");
  } catch (error) {
    console.error("Error seeding credit cards:", error);
  }
};

// Function to run all seed operations
export const seedData = async () => {
  await seedCreditCards();
};
