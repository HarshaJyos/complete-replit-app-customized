import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper"; // Use theme
import { Notification } from "../../../shared/schema";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkRead,
}: NotificationItemProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.message, { color: theme.colors.onSurface }]}>
        {notification.message}
      </Text>
      <Text style={[styles.date, { color: theme.colors.onSurface }]}>
        {new Date(notification.createdAt).toLocaleString()}
      </Text>
      {!notification.read && (
        <Button onPress={() => onMarkRead(notification.id!)} mode="contained">
          Mark as Read
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16, // Increased margin
    borderRadius: 12, // Softer corners
    elevation: 2, // Subtle shadow
  },
  message: { fontSize: 16, marginBottom: 8 },
  date: { fontSize: 12, opacity: 0.8 },
});

export default NotificationItem;
