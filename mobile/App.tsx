import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackParamList } from "./src/types/navigation";

// Screens
import LoadingScreen from "./src/screens/LoadingScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen";
import RecommendationsScreen from "./src/screens/RecommendationsScreen";
import CardDetailsScreen from "./src/screens/CardDetailsScreen";
import ComparisonScreen from "./src/screens/ComparisonScreen";
import BrowseScreen from "./src/screens/BrowseScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ApplicationsScreen from "./src/screens/ApplicationsScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00FF00",
    accent: "#FFFF00",
    error: "#FF0000",
    background: "#000000",
    surface: "#000000",
    text: "#FFFFFF",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
              headerStyle: { backgroundColor: "#000000" },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: { fontWeight: "bold" },
              contentStyle: { backgroundColor: "#000000" },
            }}
          >
            <Stack.Screen
              name="Loading"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileSetup"
              component={ProfileSetupScreen}
              options={{ title: "Setup Profile" }}
            />
            <Stack.Screen
              name="Recommendations"
              component={RecommendationsScreen}
              options={{ title: "Recommendations" }}
            />
            <Stack.Screen
              name="CardDetails"
              component={CardDetailsScreen}
              options={{ title: "Card Details" }}
            />
            <Stack.Screen
              name="Comparison"
              component={ComparisonScreen}
              options={{ title: "Compare Cards" }}
            />
            <Stack.Screen
              name="Browse"
              component={BrowseScreen}
              options={{ title: "Browse Cards" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Profile" }}
            />
            <Stack.Screen
              name="Applications"
              component={ApplicationsScreen}
              options={{ title: "My Applications" }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ title: "Notifications" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
