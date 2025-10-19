import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
// Define navigation prop type
type ApplicationsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface ApplicationsScreenProps {
  navigation: ApplicationsScreenNavigationProp;
}
const WelcomeScreen = ({ navigation }: ApplicationsScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to Credit Card Recommendation App
      </Text>
      <Text style={styles.subtitle}>Find the best credit cards for you</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Register")}
        style={styles.button}
      >
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: { color: "#FFFFFF", marginBottom: 32 },
  button: { backgroundColor: "#00FF00", width: 200, marginBottom: 16 },
});

export default WelcomeScreen;
