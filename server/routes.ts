import { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import {
  UserProfile,
  CreditCard,
  Recommendation,
  Application,
  Notification,
  ApiResponse,
} from "../shared/schema";
import { Types } from "mongoose";
import { ApplicationModel } from "./models/Application";
import { CreditCardModel } from "./models/CreditCard";
import { NotificationModel } from "./models/Notification";
import { RecommendationModel } from "./models/Recommendation";
import { UserProfileModel } from "./models/UserProfile";

// Extend Express Request interface to include user from Firebase
interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

// Middleware to verify Firebase token
const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized", success: false });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized", success: false });
  }
};

// Function to calculate recommendations (typed)
function calculateCreditCardRecommendations(
  userProfile: UserProfile | null,
  creditCards: CreditCard[]
): Omit<Recommendation, "id" | "userId" | "creditCard">[] {
  if (!userProfile) {
    return [];
  }

  return creditCards
    .map((card) => {
      let matchScore = 60;

      // Adjust match score based on user profile
      if (
        userProfile.creditScore &&
        ["excellent", "very good"].includes(userProfile.creditScore)
      ) {
        matchScore += 20;
      } else if (userProfile.creditScore === "poor") {
        matchScore -= 20;
      }

      if (
        userProfile.primarySpendingCategory &&
        userProfile.primarySpendingCategory === card.category
      ) {
        matchScore += 15;
      }

      if (userProfile.annualIncome && userProfile.annualIncome > 100000) {
        matchScore += 10;
      }

      if (
        card.annualFee > 100 &&
        (!userProfile.annualIncome || userProfile.annualIncome < 50000)
      ) {
        matchScore -= 15;
      }

      return {
        creditCardId: new Types.ObjectId(card.id),
        matchScore: Math.min(100, Math.max(0, Math.round(matchScore))),
        reasonCode: JSON.stringify({
          creditScore: userProfile.creditScore,
          categoryMatch: userProfile.primarySpendingCategory === card.category,
          income: userProfile.annualIncome,
        }),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function registerRoutes(app: Express) {
  app.use(authenticate); // Apply to all routes

  // User Profile
  app.get(
    "/api/users/:userId",
    async (
      req: AuthRequest,
      res: Response<ApiResponse<UserProfile | null>>
    ) => {
      try {
        const profile = await UserProfileModel.findOne({
          userId: req.params.userId,
        }).lean();
        res.json({ data: profile, success: true });
      } catch (error) {
        res.status(500).json({
          error: "Failed to fetch profile",
          success: false,
          data: null,
        });
      }
    }
  );

  app.post(
    "/api/users",
    async (req: AuthRequest, res: Response<ApiResponse<UserProfile>>) => {
      try {
        const profile = new UserProfileModel({
          ...req.body,
          userId: req.user?.uid,
        });
        await profile.save();
        res.json({ data: profile.toObject(), success: true });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to create profile", success: false });
      }
    }
  );

  app.put(
    "/api/users/:userId",
    async (
      req: AuthRequest,
      res: Response<ApiResponse<UserProfile | null>>
    ) => {
      try {
        const profile = await UserProfileModel.findOneAndUpdate(
          { userId: req.params.userId },
          req.body,
          { new: true }
        ).lean();
        res.json({ data: profile, success: true });
      } catch (error) {
        res.status(500).json({
          error: "Failed to update profile",
          success: false,
          data: null,
        });
      }
    }
  );

  // Credit Cards
  app.get(
    "/api/cards",
    async (req: AuthRequest, res: Response<ApiResponse<CreditCard[]>>) => {
      try {
        const cards = await CreditCardModel.find().lean();
        res.json({ data: cards, success: true });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to fetch cards", success: false, data: [] });
      }
    }
  );

  // Recommendations
  app.get(
    "/api/recommendations/:userId",
    async (req: AuthRequest, res: Response<ApiResponse<Recommendation[]>>) => {
      try {
        const recs = (await RecommendationModel.find({
          userId: req.params.userId,
        })
          .populate("creditCardId")
          .lean()) as unknown as (Omit<Recommendation, "creditCard"> & {
          creditCardId: CreditCard;
        })[];
        res.json({
          data: recs.map((rec) => ({
            ...rec,
            creditCard: {
              ...rec.creditCardId,
              id: rec.creditCardId.id?.toString(),
            },
          })),
          success: true,
        });
      } catch (error) {
        res.status(500).json({
          error: "Failed to fetch recommendations",
          success: false,
          data: [],
        });
      }
    }
  );

  app.post(
    "/api/recommendations/:userId",
    async (req: AuthRequest, res: Response<ApiResponse<Recommendation[]>>) => {
      try {
        const profile = await UserProfileModel.findOne({
          userId: req.params.userId,
        }).lean();
        const cards = await CreditCardModel.find().lean();
        const recs = calculateCreditCardRecommendations(profile, cards);
        const saved = await RecommendationModel.insertMany(
          recs.map((rec) => ({
            ...rec,
            userId: req.params.userId,
          }))
        );
        res.json({ data: saved, success: true });
      } catch (error) {
        res.status(500).json({
          error: "Failed to generate recommendations",
          success: false,
          data: [],
        });
      }
    }
  );

  // Applications
  app.post(
    "/api/applications",
    async (req: AuthRequest, res: Response<ApiResponse<Application>>) => {
      try {
        const app = new ApplicationModel({
          ...req.body,
          userId: req.user?.uid,
        });
        await app.save();

        // Fetch the credit card for notification message
        const card = await CreditCardModel.findById(
          req.body.creditCardId
        ).lean();
        if (card) {
          // Save in-app notification to DB
          const notif = new NotificationModel({
            userId: req.user?.uid,
            message: `Your application for ${card.name} has been submitted and is pending.`,
            read: false,
            createdAt: new Date().toISOString(),
          });
          await notif.save();

          // Send push notification if pushToken exists
          const profile = await UserProfileModel.findOne({
            userId: req.user?.uid,
          }).lean();
          if (profile?.pushToken) {
            try {
              await admin.messaging().send({
                token: profile.pushToken,
                notification: {
                  title: "Application Submitted",
                  body: `Your application for ${card.name} is pending.`,
                },
              });
            } catch (pushError) {
              console.error("Failed to send push notification:", pushError);
              // Continue without failing the response
            }
          }
        }

        res.json({ data: app.toObject(), success: true });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to create application", success: false });
      }
    }
  );

  app.get(
    "/api/applications/:userId",
    async (req: AuthRequest, res: Response<ApiResponse<Application[]>>) => {
      try {
        const apps = (await ApplicationModel.find({ userId: req.params.userId })
          .populate("creditCardId")
          .lean()) as unknown as (Omit<Application, "creditCard"> & {
          creditCardId: CreditCard;
        })[];
        res.json({
          data: apps.map((app) => ({
            ...app,
            creditCard: {
              ...app.creditCardId,
              id: app.creditCardId.id?.toString(),
            },
          })),
          success: true,
        });
      } catch (error) {
        res.status(500).json({
          error: "Failed to fetch applications",
          success: false,
          data: [],
        });
      }
    }
  );

  // Notifications
  app.get(
    "/api/notifications/:userId",
    async (req: AuthRequest, res: Response<ApiResponse<Notification[]>>) => {
      try {
        const notifs = await NotificationModel.find({
          userId: req.params.userId,
        }).lean();
        res.json({ data: notifs, success: true });
      } catch (error) {
        res.status(500).json({
          error: "Failed to fetch notifications",
          success: false,
          data: [],
        });
      }
    }
  );

  app.put(
    "/api/notifications/:id",
    async (req: AuthRequest, res: Response<ApiResponse<null>>) => {
      try {
        await NotificationModel.findByIdAndUpdate(req.params.id, {
          read: true,
        });
        res.json({ data: null, success: true });
      } catch (error) {
        res.status(500).json({
          error: "Failed to update notification",
          success: false,
          data: null,
        });
      }
    }
  );
}
