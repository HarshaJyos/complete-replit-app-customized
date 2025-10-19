import express from 'express';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import { registerRoutes } from './routes';
import { seedData } from './seedData';
import serviceAccount from "./firebase.json";

// Initialize Firebase Admin SDK
admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
      });

// Initialize Express app
const app = express();
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/credit-card-app';
mongoose.connect(mongoUri, {
  // Remove deprecated options
}).then(async () => {
  console.log('Connected to MongoDB');
  await seedData(); // Seed initial data after connection
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Register API routes
registerRoutes(app);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));