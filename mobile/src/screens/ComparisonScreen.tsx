import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CreditCard } from "../../../shared/schema";

interface ComparisonScreenProps {
  route: {
    params: {
      cards: CreditCard[];
    };
  };
}

const ComparisonScreen = ({ route }: ComparisonScreenProps) => {
  const { cards } = route.params;
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Compare Cards</Text>
      <View style={styles.table}>
        <Text style={[styles.header, { color: theme.colors.onSurface }]}>Feature</Text>
        {cards.map((card) => (
          <Text key={card.id} style={[styles.header, { color: theme.colors.onSurface }]}>
            {card.name}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={[styles.feature, { color: theme.colors.onSurface }]}>Annual Fee</Text>
        {cards.map((card) => (
          <Text key={card.id} style={[styles.value, { color: theme.colors.onSurface }]}>
            ${card.annualFee}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={[styles.feature, { color: theme.colors.onSurface }]}>Reward Rate</Text>
        {cards.map((card) => (
          <Text key={card.id} style={[styles.value, { color: theme.colors.onSurface }]}>
            {card.rewardRate}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={[styles.feature, { color: theme.colors.onSurface }]}>Signup Bonus</Text>
        {cards.map((card) => (
          <Text key={card.id} style={[styles.value, { color: theme.colors.onSurface }]}>
            {card.signupBonus}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={[styles.feature, { color: theme.colors.onSurface }]}>Category</Text>
        {cards.map((card) => (
          <Text key={card.id} style={[styles.value, { color: theme.colors.onSurface }]}>
            {card.category}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  table: { flexDirection: "row", marginBottom: 16 },
  header: { fontWeight: "bold", flex: 1, textAlign: "center", fontSize: 16 },
  row: { flexDirection: "row", marginBottom: 16, paddingVertical: 8 },
  feature: { flex: 1, fontWeight: "bold", fontSize: 16 },
  value: { flex: 1, textAlign: "center", fontSize: 16 },
});

export default ComparisonScreen;