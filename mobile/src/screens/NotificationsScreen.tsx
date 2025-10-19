import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import NotificationItem from "../components/NotificationItem";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { Notification } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the navigation param list
type RootStackParamList = {
  Login: undefined;
};

// Define navigation prop type
type NotificationsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const user = firebaseAuthService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "Please log in");
        navigation.navigate("Login");
        return;
      }
      const result = await apiService.getNotifications(user.uid);
      if (result.data) {
        setNotifications(result.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await apiService.markNotificationRead(id);
    fetchNotifications();
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
      <Text style={styles.title}>Notifications</Text>
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          notification={notif}
          onMarkRead={markAsRead}
        />
      ))}
      {notifications.length === 0 && (
        <Text style={styles.noData}>No notifications</Text>
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
  noData: { color: "#FFFFFF", textAlign: "center" },
  loading: { flex: 1, justifyContent: "center" },
});

export default NotificationsScreen;
