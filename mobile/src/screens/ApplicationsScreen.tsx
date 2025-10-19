import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, ActivityIndicator, useTheme } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { Application } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type ApplicationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ApplicationsScreenProps {
  navigation: ApplicationsScreenNavigationProp;
}

const ApplicationsScreen = ({ navigation }: ApplicationsScreenProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
        color={theme.colors.primary}
        style={styles.loading}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
<Text style={[styles.title, { color: theme.colors.onSurface }]}>My Applications</Text>
      {applications.map((app) => (
        <Card key={app.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
<Text style={[styles.cardName, { color: theme.colors.onSurface }]}>{app.creditCard.name}</Text>
<Text style={[styles.status, { color: theme.colors.primary }]}>Status: {app.status}</Text>
            <Text style={[styles.date, { color: theme.colors.onSurface }]}>
  Applied: {new Date(app.appliedAt).toLocaleDateString()}
</Text>
          </Card.Content>
        </Card>
      ))}
      {applications.length === 0 && (
        <Text style={[styles.noData, { color: theme.colors.onSurface }]}>No applications yet</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 }, // Increased padding
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  card: { marginBottom: 16, borderRadius: 12, elevation: 2 },
  cardName: { fontWeight: "bold", fontSize: 18 },
  status: { fontSize: 16, marginVertical: 8 },
  date: { fontSize: 14, opacity: 0.8 },
  noData: { textAlign: "center", fontSize: 16 },
  loading: { flex: 1, justifyContent: "center" },
});

export default ApplicationsScreen;