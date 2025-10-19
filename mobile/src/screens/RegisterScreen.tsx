import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

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
      navigation.replace(result.isNewUser ? "ProfileSetup" : "Main");
    } else {
      Alert.alert("Error", result.error || "Google sign-up failed");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        theme={theme}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={theme}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Button mode="contained" onPress={handleGoogle} style={styles.button}>
        Google Sign Up
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Login")} textColor={theme.colors.onSurface}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: "center" },
  input: { marginBottom: 16, backgroundColor: "#1A1A1A" },
  button: { marginBottom: 16, borderRadius: 8 },
});

export default RegisterScreen;