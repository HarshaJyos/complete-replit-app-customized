import { getIdToken } from "firebase/auth";
import { auth } from "../config/firebase";
import { Platform } from "react-native";

class ApiService {
  private getBaseUrl() {
    // Use Expo env var in production, otherwise dev URL
    const env = process.env.EXPO_PUBLIC_API_URL;
    if (env) return env;

    return Platform.OS === "android"
      ? "http://10.0.2.2:5001/syamapp-955e0/us-central1/api"
      : "http://localhost:5001/syamapp-955e0/us-central1/api";
  }

  private async headers() {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthenticated");
    const token = await getIdToken(user);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // ---------- USER ----------
  async createProfile(profile: any) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/users`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(profile),
    });
    return res.json();
  }

  async getProfile(uid: string) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/users/${uid}`, { headers: h });
    return res.json();
  }

  async updateProfile(uid: string, data: any) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/users/${uid}`, {
      method: "PUT",
      headers: h,
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // ---------- CARDS ----------
  async getCards() {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/cards`, { headers: h });
    return res.json();
  }

  // ---------- RECOMMENDATIONS ----------
  async getRecommendations(uid: string) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/recommendations/${uid}`, {
      headers: h,
    });
    return res.json();
  }

  async generateRecommendations(uid: string) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/recommendations/${uid}`, {
      method: "POST",
      headers: h,
    });
    return res.json();
  }

  // ---------- APPLICATIONS ----------
  async apply(uid: string, cardId: string) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/applications`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ userId: uid, creditCardId: cardId }),
    });
    return res.json();
  }

  async getApplications(uid: string) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/applications/${uid}`, {
      headers: h,
    });
    return res.json();
  }

  // ---------- NOTIFICATIONS ----------
  async getNotifications(uid: string) {
    const h = await this.headers();
    const res = await fetch(`${this.getBaseUrl()}/notifications/${uid}`, {
      headers: h,
    });
    return res.json();
  }

  async markRead(notifId: string) {
    const h = await this.headers();
    await fetch(`${this.getBaseUrl()}/notifications/${notifId}`, {
      method: "PUT",
      headers: h,
      body: JSON.stringify({ read: true }),
    });
  }
}

export const apiService = new ApiService();