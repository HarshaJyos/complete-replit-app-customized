import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

// Define navigation prop type
type ApplicationsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface ApplicationsScreenProps {
  navigation: ApplicationsScreenNavigationProp;
}

const LoadingScreen = ({ navigation }: ApplicationsScreenProps) => {
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate load
      console.log("App starting initialization...");
      try {
        await firebaseAuthService.initialize();
        console.log("App initialization completed");
      } catch (error) {
        console.error("Critical error during app initialization:", error);
      }
      if (firebaseAuthService.getCurrentUser()) {
        navigation.replace("Recommendations");
      } else {
        navigation.replace("Welcome");
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
      <ActivityIndicator animating={true} color="#00FF00" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#FFFFFF", marginBottom: 16 },
});

export default LoadingScreen;
