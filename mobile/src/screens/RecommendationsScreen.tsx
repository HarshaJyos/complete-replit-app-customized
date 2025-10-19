import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, ActivityIndicator } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { Recommendation } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type RecommendationsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface RecommendationsScreenProps {
  navigation: RecommendationsScreenNavigationProp;
}

const RecommendationsScreen = ({ navigation }: RecommendationsScreenProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const user = firebaseAuthService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "Please log in");
        navigation.navigate("Login");
        return;
      }
      const result = await apiService.getRecommendations(user.uid);
      if (result.data) {
        setRecommendations(result.data);
      } else {
        // Generate if not exist
        await apiService.generateRecommendations(user.uid);
        const newResult = await apiService.getRecommendations(user.uid);
        setRecommendations(newResult.data || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        animating={true}
        color="#00FF00"
        style={styles.loading}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      {recommendations.map((rec) => (
        <Card
          key={rec.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("CardDetails", { card: rec.creditCard })
          }
        >
          <Card.Content>
            <Text style={styles.cardName}>{rec.creditCard.name}</Text>
            <Text style={styles.score}>Match Score: {rec.matchScore}%</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 16 },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: { backgroundColor: "#1A1A1A", marginBottom: 16 },
  cardName: { color: "#FFFFFF", fontWeight: "bold" },
  score: { color: "#00FF00" },
  loading: { flex: 1, justifyContent: "center" },
});

export default RecommendationsScreen;
