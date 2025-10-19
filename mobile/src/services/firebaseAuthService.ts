import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  User,
  signInWithCredential,
} from "firebase/auth";
import { UserCredential, AdditionalUserInfo } from "firebase/auth";
import { auth } from "../config/firebase";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiService } from "./api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

class FirebaseAuthService {
  private provider = new GoogleAuthProvider();

  // Initialize Firebase and notifications
  async initialize() {
    console.log("Initializing Firebase Auth Service...");
    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: "your-web-client-id-from-firebase-console", // Replace with Web client ID from Firebase Console > Auth > Google
        offlineAccess: true, // Required for idToken
      });

      await this.registerForPushNotifications();
      console.log("Firebase Auth Service initialized successfully");
    } catch (error) {
      console.error("Firebase Auth initialization failed:", error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Email/Password Sign Up
  async signUpWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Email/Password Sign In
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Google Sign In
  async signInWithGoogle(): Promise<{
    success: boolean;
    isNewUser?: boolean;
    error?: string;
  }> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        return {
          success: false,
          error: "No idToken received from Google Sign-In",
        };
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential: UserCredential = await signInWithCredential(
        auth,
        credential
      );
      const additionalInfo: AdditionalUserInfo | null =
        (userCredential as any).additionalUserInfo ?? null;

      const isNewUser = additionalInfo?.isNewUser || false;
      return { success: true, isNewUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await auth.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }

  // Register for push notifications with error handling
  private async registerForPushNotifications() {
    console.log("Registering for push notifications...");
    if (!Notifications || !Notifications.getExpoPushTokenAsync) {
      console.warn("Notifications API not available");
      return;
    }

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }

      const projectId = "syamapp-955e0"; // From your firebaseConfig
      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      console.log("Push token acquired:", token);
      const user = this.getCurrentUser();
      if (user) {
        await apiService.updateUserProfile(user.uid, { pushToken: token });
      }
    } catch (error) {
      console.error("Error registering for push notifications:", error);
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
