import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, ActivityIndicator, useTheme } from "react-native-paper";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type LoadingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoadingScreenProps {
  navigation: LoadingScreenNavigationProp;
}

const LoadingScreen = ({ navigation }: LoadingScreenProps) => {
  const theme = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate load
      try {
        await firebaseAuthService.initialize();
      } catch (error) {
        console.error("Initialization error:", error);
      }
      if (firebaseAuthService.getCurrentUser()) {
        navigation.replace("Main"); // Go to main tabs
      } else {
        navigation.replace("Welcome");
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>Loading...</Text>
      <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 24 },
});

export default LoadingScreen;