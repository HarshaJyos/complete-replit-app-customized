import { CreditCard } from "../../../shared/schema";

// Define the Tab Navigator's param list
export type MainTabParamList = {
  Recommendations: undefined;
  Browse: undefined;
  Applications: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// Define the Root Stack Navigator's param list
export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
  Main: undefined; // Main contains the tab navigator
  CardDetails: { card: CreditCard };
  Comparison: { cards: CreditCard[] };
};