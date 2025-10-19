import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, ActivityIndicator, useTheme } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { Recommendation } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type RecommendationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecommendationsScreenProps {
  navigation: RecommendationsScreenNavigationProp;
}

const RecommendationsScreen = ({ navigation }: RecommendationsScreenProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
      let result = await apiService.getRecommendations(user.uid);
      if (!result.data || result.data.length === 0) {
        result = await apiService.generateRecommendations(user.uid);
      }
      setRecommendations(result.data || []);
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
        color={theme.colors.primary}
        style={styles.loading}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Recommendations</Text>
      {recommendations.map((rec) => (
        <Card
          key={rec.id}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          onPress={() =>
            navigation.navigate("CardDetails", { card: rec.creditCard })
          }
        >
          <Card.Content>
            <Text style={[styles.cardName, { color: theme.colors.onSurface }]}>{rec.creditCard.name}</Text>
            <Text style={[styles.score, { color: theme.colors.onSurfaceVariant }]}>Match Score: {rec.matchScore}%</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  card: { marginBottom: 16, borderRadius: 12, elevation: 2 },
  cardName: { fontWeight: "bold", fontSize: 18 },
  score: { fontSize: 16, marginTop: 8 },
  loading: { flex: 1, justifyContent: "center" },
});

export default RecommendationsScreen;