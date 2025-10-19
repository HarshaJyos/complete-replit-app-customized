import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button, Chip, useTheme } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";

type CardDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CardDetailsScreenRouteProp = RouteProp<RootStackParamList, "CardDetails">;

interface CardDetailsScreenProps {
  navigation: CardDetailsScreenNavigationProp;
  route: CardDetailsScreenRouteProp;
}

const CardDetailsScreen = ({ navigation, route }: CardDetailsScreenProps) => {
  const { card } = route.params;
  const theme = useTheme();

  const handleApply = async () => {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    await apiService.createApplication(user.uid, card.id!);
    // Navigate to the Applications tab within Main
    navigation.navigate("Main" as any, { screen: "Applications" });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{card.name}</Text>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.detail, { color: theme.colors.onSurface }]}>Issuer: {card.issuer}</Text>
          <Text style={[styles.detail, { color: theme.colors.onSurface }]}>Annual Fee: ${card.annualFee}</Text>
          <Text style={[styles.detail, { color: theme.colors.onSurface }]}>Reward Rate: {card.rewardRate}</Text>
          <Text style={[styles.detail, { color: theme.colors.onSurface }]}>Signup Bonus: {card.signupBonus}</Text>
          <View style={styles.benefits}>
            {card.benefits.map((benefit: string, index: number) => (
              <Chip key={index} style={[styles.chip, { backgroundColor: "#333333" }]}>
                {benefit}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={handleApply} style={styles.button}>
        Apply Now
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  card: { marginBottom: 24, borderRadius: 12, elevation: 2 },
  detail: { fontSize: 16, marginBottom: 12 },
  benefits: { flexDirection: "row", flexWrap: "wrap", marginTop: 16 },
  chip: { margin: 6 },
  button: { borderRadius: 8 },
});

export default CardDetailsScreen;