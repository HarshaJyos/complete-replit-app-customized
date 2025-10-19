import React from "react";
import { NavigationContainer, DarkTheme as NavigationDarkTheme, type Theme as NavigationTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackParamList } from "./src/types/navigation";
import Icon from "@expo/vector-icons/MaterialIcons";
import type { MD3Theme } from "react-native-paper"; // Import MD3Theme type

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

// Define MD3 theme
const theme: MD3Theme = {
  version: 3,
  isV3: true,
  dark: true,
  roundness: 4, // Default roundness for buttons, cards, etc.
  animation: {
    scale: 1.0,
    defaultAnimationDuration: 200,
  },
  colors: {
    primary: "#CCCCCC", // Subtle gray for buttons, accents
    primaryContainer: "#333333", // Darker gray for containers
    secondary: "#CCCCCC",
    secondaryContainer: "#333333",
    tertiary: "#CCCCCC",
    tertiaryContainer: "#333333",
    surface: "#1A1A1A", // Dark gray surfaces (cards, inputs)
    surfaceVariant: "#2A2A2A", // Slightly lighter for variation
    surfaceDisabled: "#555555", // Disabled surfaces
    background: "#000000", // Black background
    error: "#FF0000", // Red for errors
    errorContainer: "#4A0000",
    onPrimary: "#000000", // Black text on primary (e.g., buttons)
    onPrimaryContainer: "#FFFFFF", // White text on primary containers
    onSecondary: "#000000",
    onSecondaryContainer: "#FFFFFF",
    onTertiary: "#000000",
    onTertiaryContainer: "#FFFFFF",
    onSurface: "#FFFFFF", // White text on surfaces
    onSurfaceVariant: "#CCCCCC", // Subtle gray for secondary text
    onSurfaceDisabled: "#777777", // Disabled text
    onError: "#FFFFFF",
    onErrorContainer: "#FFFFFF",
    onBackground: "#FFFFFF", // White text on background
    outline: "#CCCCCC", // Gray outlines
    outlineVariant: "#555555",
    inverseSurface: "#FFFFFF",
    inverseOnSurface: "#000000",
    inversePrimary: "#333333",
    shadow: "#000000",
    scrim: "#000000",
    backdrop: "#00000080",
    elevation: {
      level0: "transparent",
      level1: "#1A1A1A",
      level2: "#2A2A2A",
      level3: "#333333",
      level4: "#444444",
      level5: "#555555",
    },
  },
  fonts: {
    displayLarge: { fontFamily: "Roboto", fontWeight: "400", fontSize: 57, lineHeight: 64, letterSpacing: -0.25 },
    displayMedium: { fontFamily: "Roboto", fontWeight: "400", fontSize: 45, lineHeight: 52, letterSpacing: 0 },
    displaySmall: { fontFamily: "Roboto", fontWeight: "400", fontSize: 36, lineHeight: 44, letterSpacing: 0 },
    headlineLarge: { fontFamily: "Roboto", fontWeight: "400", fontSize: 32, lineHeight: 40, letterSpacing: 0 },
    headlineMedium: { fontFamily: "Roboto", fontWeight: "400", fontSize: 28, lineHeight: 36, letterSpacing: 0 },
    headlineSmall: { fontFamily: "Roboto", fontWeight: "400", fontSize: 24, lineHeight: 32, letterSpacing: 0 },
    titleLarge: { fontFamily: "Roboto", fontWeight: "400", fontSize: 22, lineHeight: 28, letterSpacing: 0 },
    titleMedium: { fontFamily: "Roboto", fontWeight: "500", fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
    titleSmall: { fontFamily: "Roboto", fontWeight: "500", fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    labelLarge: { fontFamily: "Roboto", fontWeight: "500", fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    labelMedium: { fontFamily: "Roboto", fontWeight: "500", fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
    labelSmall: { fontFamily: "Roboto", fontWeight: "500", fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
    bodyLarge: { fontFamily: "Roboto", fontWeight: "400", fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
    bodyMedium: { fontFamily: "Roboto", fontWeight: "400", fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
    bodySmall: { fontFamily: "Roboto", fontWeight: "400", fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
    default: { fontFamily: "Roboto", fontWeight: "400", letterSpacing: 0 },
  },
};

// Navigation theme aligned with MD3
const navigationTheme: NavigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: theme.colors.primary, // #CCCCCC
    background: theme.colors.background, // #000000
    card: theme.colors.surface, // #1A1A1A
    text: theme.colors.onSurface, // #FFFFFF
    border: theme.colors.outline, // #CCCCCC
    notification: theme.colors.error, // #FF0000
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.onBackground,
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.onBackground,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="assignment" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: theme.colors.background },
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
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
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
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={navigationTheme}>
          <AuthStack />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}