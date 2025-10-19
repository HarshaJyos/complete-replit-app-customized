import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const handleLogin = async () => {
    const result = await firebaseAuthService.signInWithEmail(email, password);
    if (result.success) {
      navigation.replace("Main");
    } else {
      Alert.alert("Error", result.error || "Login failed");
    }
  };

  const handleGoogle = async () => {
    const result = await firebaseAuthService.signInWithGoogle();
    if (result.success) {
      navigation.replace(result.isNewUser ? "ProfileSetup" : "Main");
    } else {
      Alert.alert("Error", result.error || "Google login failed");
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
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button mode="contained" onPress={handleGoogle} style={styles.button}>
        Google Login
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Register")} textColor={theme.colors.onSurface}>
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: "center" },
  input: { marginBottom: 16, backgroundColor: "#1A1A1A" },
  button: { marginBottom: 16, borderRadius: 8 },
});

export default LoginScreen;