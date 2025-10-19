import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, ActivityIndicator } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { Application } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

// Define navigation prop type
type ApplicationsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface ApplicationsScreenProps {
  navigation: ApplicationsScreenNavigationProp;
}

const ApplicationsScreen = ({ navigation }: ApplicationsScreenProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const user = firebaseAuthService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "Please log in");
        navigation.navigate("Login");
        return;
      }
      const result = await apiService.getUserApplications(user.uid);
      if (result.data) {
        setApplications(result.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch applications");
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
      <Text style={styles.title}>My Applications</Text>
      {applications.map((app) => (
        <Card key={app.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.cardName}>{app.creditCard.name}</Text>
            <Text style={styles.status}>Status: {app.status}</Text>
            <Text style={styles.date}>
              Applied: {new Date(app.appliedAt).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      ))}
      {applications.length === 0 && (
        <Text style={styles.noData}>No applications yet</Text>
      )}
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
  status: { color: "#00FF00" },
  date: { color: "#FFFFFF" },
  noData: { color: "#FFFFFF", textAlign: "center" },
  loading: { flex: 1, justifyContent: "center" },
});

export default ApplicationsScreen;
