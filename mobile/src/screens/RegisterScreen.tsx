import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleProp, ViewStyle } from "react-native";

// Define navigation prop type
type RegisterScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const result = await firebaseAuthService.signUpWithEmail(email, password);
    if (result.success) {
      navigation.replace("ProfileSetup");
    } else {
      Alert.alert("Error", result.error || "Registration failed");
    }
  };

  const handleGoogle = async () => {
    const result = await firebaseAuthService.signInWithGoogle();
    if (result.success) {
      navigation.replace(result.isNewUser ? "ProfileSetup" : "Recommendations");
    } else {
      Alert.alert("Error", result.error || "Google sign-up failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#FFFFFF"
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Button mode="contained" onPress={handleGoogle} style={styles.button}>
        Google Sign Up
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        style={styles.textButton as StyleProp<ViewStyle>}
        textColor="#FFFFFF"
      >
        Login
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
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#00FF00",
    marginBottom: 8,
  },
  textButton: {
    marginTop: 8,
  },
});

export default RegisterScreen;
