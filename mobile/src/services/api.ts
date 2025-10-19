import { getIdToken } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  CreditCard,
  Recommendation,
  Application,
  UserProfile,
} from "../../../shared/schema";

class ApiService {
  private baseUrl = "http://localhost:5000/api"; // or production URL

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
      ? `${this.baseUrl}/cards?category=${category}`
      : `${this.baseUrl}/cards`;
    const response = await fetch(url, { headers });
    return response.json();
  }

  async getRecommendations(
    userId: string
  ): Promise<{ data: Recommendation[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/recommendations/${userId}`, {
      headers,
    });
    return response.json();
  }

  async generateRecommendations(
    userId: string
  ): Promise<{ data: Recommendation[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/recommendations/${userId}`, {
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
    const response = await fetch(`${this.baseUrl}/applications`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userId, creditCardId }),
    });
    return response.json();
  }

  async getUserApplications(userId: string): Promise<{ data: Application[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/applications/${userId}`, {
      headers,
    });
    return response.json();
  }

  async getUserProfile(userId: string): Promise<{ data: UserProfile }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      headers,
    });
    return response.json();
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<{ data: UserProfile }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
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
    const response = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...profile, userId }),
    });
    return response.json();
  }

  async getNotifications(userId: string): Promise<{ data: any[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/notifications/${userId}`, {
      headers,
    });
    return response.json();
  }

  async markNotificationRead(id: string): Promise<void> {
    const headers = await this.getHeaders();
    await fetch(`${this.baseUrl}/notifications/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ read: true }),
    });
  }
}

export const apiService = new ApiService();
