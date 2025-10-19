import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, ActivityIndicator, useTheme } from "react-native-paper";
import NotificationItem from "../components/NotificationItem";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { Notification } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type NotificationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
        color={theme.colors.primary}
        style={styles.loading}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Notifications</Text>
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          notification={notif}
          onMarkRead={markAsRead}
        />
      ))}
      {notifications.length === 0 && (
        <Text style={[styles.noData, { color: theme.colors.onSurface }]}>No notifications</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  noData: { textAlign: "center", fontSize: 16 },
  loading: { flex: 1, justifyContent: "center" },
});

export default NotificationsScreen;