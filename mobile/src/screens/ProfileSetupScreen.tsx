import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, SegmentedButtons, useTheme } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { UserProfile } from "../../../shared/schema";

const ProfileSetupScreen = ({ navigation }: any) => {
  const [income, setIncome] = useState("");
  const [creditScore, setCreditScore] = useState<UserProfile["creditScore"]>("good");
  const [spendingCategory, setSpendingCategory] = useState<
    UserProfile["primarySpendingCategory"]
  >("general");
  const [monthlySpending, setMonthlySpending] = useState("");
  const theme = useTheme();

  const handleSubmit = async () => {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) return;

    const profile = {
      annualIncome: parseInt(income) || 0,
      creditScore,
      primarySpendingCategory: spendingCategory,
      monthlySpending: parseInt(monthlySpending) || 0,
    };

    try {
      await apiService.createProfile({ ...profile, userId: user.uid });
      await apiService.generateRecommendations(user.uid);
      navigation.replace("Main");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Something went wrong");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Annual Income"
        value={income}
        onChangeText={setIncome}
        keyboardType="numeric"
        style={styles.input}
        theme={theme}
      />

      {/* ---- Credit Score ---- */}
      <SegmentedButtons
        value={creditScore ?? "good"}
        onValueChange={(v) =>
          setCreditScore((v ?? "good") as UserProfile["creditScore"])
        }
        buttons={[
          { value: "poor", label: "Poor" },
          { value: "fair", label: "Fair" },
          { value: "good", label: "Good" },
          { value: "very good", label: "Very Good" },
          { value: "excellent", label: "Excellent" },
        ]}
        style={styles.segmented}
      />

      {/* ---- Spending Category ---- */}
      <SegmentedButtons
        value={spendingCategory ?? "general"}
        onValueChange={(v) =>
          setSpendingCategory((v ?? "general") as UserProfile["primarySpendingCategory"])
        }
        buttons={[
          { value: "travel", label: "Travel" },
          { value: "dining", label: "Dining" },
          { value: "groceries", label: "Groceries" },
          { value: "general", label: "General" },
          { value: "shopping", label: "Shopping" },
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Monthly Spending"
        value={monthlySpending}
        onChangeText={setMonthlySpending}
        keyboardType="numeric"
        style={styles.input}
        theme={theme}
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit Survey
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  input: { marginBottom: 24, backgroundColor: "#1A1A1A" },
  segmented: { marginBottom: 24 },
  button: { borderRadius: 8 },
});

export default ProfileSetupScreen;