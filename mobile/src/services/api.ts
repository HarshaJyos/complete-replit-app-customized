import { getIdToken } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  CreditCard,
  Recommendation,
  Application,
  UserProfile,
} from "../../../shared/schema";
import { Platform } from "react-native"; // Added for platform detection

class ApiService {
  private getBaseUrl() {
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) return envUrl;

    // For development: Android emulator uses 10.0.2.2, iOS/simulator uses localhost
    if (Platform.OS === 'android') {
      return "http://10.0.2.2:5000/api";
    } else {
      return "http://localhost:5000/api";
    }
  }

  private async getHeaders() {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    const token = await getIdToken(user);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getCreditCards(category?: string): Promise<{ data: CreditCard[] }> {
    const headers = await this.getHeaders();
    const url = category
      ? `${this.getBaseUrl()}/cards?category=${category}`
      : `${this.getBaseUrl()}/cards`;
    const response = await fetch(url, { headers });
    return response.json();
  }

  async getRecommendations(
    userId: string
  ): Promise<{ data: Recommendation[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/recommendations/${userId}`, {
      headers,
    });
    return response.json();
  }

  async generateRecommendations(
    userId: string
  ): Promise<{ data: Recommendation[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/recommendations/${userId}`, {
      method: "POST",
      headers,
    });
    return response.json();
  }

  async createApplication(
    userId: string,
    creditCardId: string
  ): Promise<{ data: Application }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/applications`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userId, creditCardId }),
    });
    return response.json();
  }

  async getUserApplications(userId: string): Promise<{ data: Application[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/applications/${userId}`, {
      headers,
    });
    return response.json();
  }

  async getUserProfile(userId: string): Promise<{ data: UserProfile }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/users/${userId}`, {
      headers,
    });
    return response.json();
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<{ data: UserProfile }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/users/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(profile),
    });
    return response.json();
  }

  async createUserProfile(
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<{ data: UserProfile }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...profile, userId }),
    });
    return response.json();
  }

  async getNotifications(userId: string): Promise<{ data: any[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.getBaseUrl()}/notifications/${userId}`, {
      headers,
    });
    return response.json();
  }

  async markNotificationRead(id: string): Promise<void> {
    const headers = await this.getHeaders();
    await fetch(`${this.getBaseUrl()}/notifications/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ read: true }),
    });
  }
}

export const apiService = new ApiService();