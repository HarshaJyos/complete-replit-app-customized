import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        Welcome to Credit Card Recommendation App
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>Find the best credit cards for you</Text>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  subtitle: { fontSize: 18, marginBottom: 48, textAlign: "center", opacity: 0.8 },
  button: { width: "80%", marginBottom: 16, borderRadius: 8 },
});

export default WelcomeScreen;