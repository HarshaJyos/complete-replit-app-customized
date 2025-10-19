import React, { useState } from "react";
import { View, StyleSheet, Alert, ViewStyle } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import { StyleProp, TextStyle } from "react-native";

// Define the navigation param list
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await firebaseAuthService.signInWithEmail(email, password);
    if (result.success) {
      navigation.replace("Recommendations");
    } else {
      Alert.alert("Error", result.error || "Login failed");
    }
  };

  const handleGoogle = async () => {
    const result = await firebaseAuthService.signInWithGoogle();
    if (result.success) {
      navigation.replace(result.isNewUser ? "ProfileSetup" : "Recommendations");
    } else {
      Alert.alert("Error", result.error || "Google login failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input as StyleProp<TextStyle>}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        style={styles.input as StyleProp<TextStyle>}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#FFFFFF"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button mode="contained" onPress={handleGoogle} style={styles.button}>
        Google Login
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Register")}
        style={styles.textButton as StyleProp<ViewStyle>}
        textColor="#FFFFFF"
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
    padding: 16,
    justifyContent: "center",
  },
  input: {
    color: "#FFFFFF",
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    marginBottom: 16,
    backgroundColor: "transparent", // Required for react-native-paper TextInput
  },
  button: { backgroundColor: "#00FF00", marginBottom: 8 },
  textButton: { color: "#FFFFFF" },
});

export default LoginScreen;
