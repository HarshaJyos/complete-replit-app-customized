import { CreditCard } from "../../../shared/schema";

// types/navigation.ts
export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
  Recommendations: undefined;
  CardDetails: { card: CreditCard };
  Comparison: { cards: CreditCard[] };
  Browse: undefined;
  Profile: undefined;
  Applications: undefined;
  Notifications: undefined;
};
