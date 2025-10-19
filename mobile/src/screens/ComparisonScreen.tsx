import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native"; // Import Text from react-native
import { CreditCard } from "../../../shared/schema";

// Define props type for route params
interface ComparisonScreenProps {
  route: {
    params: {
      cards: CreditCard[];
    };
  };
}

const ComparisonScreen = ({ route }: ComparisonScreenProps) => {
  const { cards } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Compare Cards</Text>
      <View style={styles.table}>
        <Text style={styles.header}>Feature</Text>
        {cards.map((card) => (
          <Text key={card.id} style={styles.header}>
            {card.name}
          </Text>
        ))}
      </View>
      {/* Rows for features */}
      <View style={styles.row}>
        <Text style={styles.feature}>Annual Fee</Text>
        {cards.map((card) => (
          <Text key={card.id} style={styles.value}>
            ${card.annualFee}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.feature}>Reward Rate</Text>
        {cards.map((card) => (
          <Text key={card.id} style={styles.value}>
            {card.rewardRate}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.feature}>Signup Bonus</Text>
        {cards.map((card) => (
          <Text key={card.id} style={styles.value}>
            {card.signupBonus}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.feature}>Category</Text>
        {cards.map((card) => (
          <Text key={card.id} style={styles.value}>
            {card.category}
          </Text>
        ))}
      </View>
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
  table: { flexDirection: "row", marginBottom: 8 },
  header: {
    color: "#FFFFFF",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  row: { flexDirection: "row", marginBottom: 8 },
  feature: { color: "#FFFFFF", flex: 1, fontWeight: "bold" },
  value: { color: "#FFFFFF", flex: 1, textAlign: "center" },
});

export default ComparisonScreen;
