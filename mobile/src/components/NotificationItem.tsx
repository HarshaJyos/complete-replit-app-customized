import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Notification } from "../../../shared/schema";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkRead,
}: NotificationItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.date}>
        {new Date(notification.createdAt).toLocaleString()}
      </Text>
      {!notification.read && (
        <Button onPress={() => onMarkRead(notification.id!)}>
          Mark as Read
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  message: { color: "#FFFFFF" },
  date: { color: "#FFFFFF", fontSize: 12 },
});

export default NotificationItem;
