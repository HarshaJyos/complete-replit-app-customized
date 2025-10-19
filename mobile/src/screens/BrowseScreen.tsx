import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, ActivityIndicator, useTheme } from "react-native-paper";
import { apiService } from "../services/api";
import { CreditCard } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type BrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BrowseScreenProps {
  navigation: BrowseScreenNavigationProp;
}

const BrowseScreen = ({ navigation }: BrowseScreenProps) => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
        color={theme.colors.primary}
        style={styles.loading}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Browse Credit Cards</Text>
      {cards.map((card) => (
        <Card
          key={card.id}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate("CardDetails", { card })}
        >
          <Card.Content>
            <Text style={[styles.cardName, { color: theme.colors.onSurface }]}>{card.name}</Text>
            <Text style={[styles.issuer, { color: theme.colors.onSurface }]}>Issuer: {card.issuer}</Text>
            <Text style={[styles.fee, { color: theme.colors.onSurface }]}>Annual Fee: ${card.annualFee}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  card: { marginBottom: 16, borderRadius: 12, elevation: 2 },
  cardName: { fontWeight: "bold", fontSize: 18 },
  issuer: { fontSize: 16, marginVertical: 8 },
  fee: { fontSize: 16 },
  loading: { flex: 1, justifyContent: "center" },
});

export default BrowseScreen;