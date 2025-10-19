import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, ActivityIndicator } from "react-native-paper";
import { apiService } from "../services/api";
import { CreditCard } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the navigation param list
type RootStackParamList = {
  CardDetails: { card: CreditCard };
};

// Define navigation prop type
type BrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BrowseScreenProps {
  navigation: BrowseScreenNavigationProp;
}

const BrowseScreen = ({ navigation }: BrowseScreenProps) => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const result = await apiService.getCreditCards();
      if (result.data) {
        setCards(result.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        animating={true}
        color="#00FF00"
        style={styles.loading}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Browse Credit Cards</Text>
      {cards.map((card) => (
        <Card
          key={card.id}
          style={styles.card}
          onPress={() => navigation.navigate("CardDetails", { card })}
        >
          <Card.Content>
            <Text style={styles.cardName}>{card.name}</Text>
            <Text style={styles.issuer}>Issuer: {card.issuer}</Text>
            <Text style={styles.fee}>Annual Fee: ${card.annualFee}</Text>
          </Card.Content>
        </Card>
      ))}
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
  cardName: { color: "#FFFFFF", fontWeight: "bold" },
  issuer: { color: "#FFFFFF" },
  fee: { color: "#FFFFFF" },
  loading: { flex: 1, justifyContent: "center" },
});

export default BrowseScreen;
