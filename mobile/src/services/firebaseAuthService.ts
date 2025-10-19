import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  getAdditionalUserInfo,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiService } from "./api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

class FirebaseAuthService {
  private provider = new GoogleAuthProvider();

  async initialize() {
    try {
      GoogleSignin.configure({
        webClientId: "your-web-client-id-from-firebase-console", // Replace with real Web client ID
        offlineAccess: true,
      });
      await this.registerForPushNotifications();
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  async signUpWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

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
        return { success: false, error: "No idToken received" };
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential: UserCredential = await signInWithCredential(auth, credential);
      const additionalInfo = getAdditionalUserInfo(userCredential);
      const isNewUser = additionalInfo?.isNewUser || false;
      return { success: true, isNewUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await auth.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }

  private async registerForPushNotifications() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const projectId = "your-project-id"; // Replace with your Firebase projectId
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    const user = this.getCurrentUser();
    if (user) {
      await apiService.updateUserProfile(user.uid, { pushToken: token });
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();