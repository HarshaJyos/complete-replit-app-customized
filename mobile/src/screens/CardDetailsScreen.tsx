import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button, Chip } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";

type CardDetailsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
type CardDetailsScreenRouteProp = RouteProp<RootStackParamList, "CardDetails">;

interface CardDetailsScreenProps {
  navigation: CardDetailsScreenNavigationProp;
  route: CardDetailsScreenRouteProp;
}

const CardDetailsScreen = ({ navigation, route }: CardDetailsScreenProps) => {
  const { card } = route.params;

  const handleApply = async () => {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    await apiService.createApplication(user.uid, card.id!);
    navigation.navigate("Applications");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{card.name}</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.detail}>Issuer: {card.issuer}</Text>
          <Text style={styles.detail}>Annual Fee: ${card.annualFee}</Text>
          <Text style={styles.detail}>Reward Rate: {card.rewardRate}</Text>
          <Text style={styles.detail}>Signup Bonus: {card.signupBonus}</Text>
          <View style={styles.benefits}>
            {card.benefits.map((benefit: string, index: number) => (
              <Chip key={index} style={styles.chip}>
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
  container: { flex: 1, backgroundColor: "#000000", padding: 16 },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: { backgroundColor: "#1A1A1A", marginBottom: 16 },
  detail: { color: "#FFFFFF", marginBottom: 8 },
  benefits: { flexDirection: "row", flexWrap: "wrap" },
  chip: { backgroundColor: "#333333", margin: 4 },
  button: { backgroundColor: "#00FF00" },
});

export default CardDetailsScreen;
