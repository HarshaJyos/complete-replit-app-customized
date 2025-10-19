import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { UserProfile } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const user = firebaseAuthService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "Please log in");
        navigation.navigate("Login");
        return;
      }
      const result = await apiService.getUserProfile(user.uid);
      if (result.data) {
        setProfile(result.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) return;
    await apiService.updateUserProfile(user.uid, profile);
    Alert.alert("Success", "Profile updated");
  };

  const handleLogout = async () => {
    try {
      await firebaseAuthService.signOut();
      navigation.replace("Welcome");
    } catch (error) {
      Alert.alert("Error", "Logout failed");
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} color={theme.colors.primary} style={styles.loading} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Name"
        value={profile.name || ""}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        style={styles.input}
        theme={theme}
      />
      <TextInput
        label="Phone"
        value={profile.phone || ""}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        style={styles.input}
        theme={theme}
      />
      <TextInput
        label="DOB"
        value={profile.dob || ""}
        onChangeText={(text) => setProfile({ ...profile, dob: text })}
        style={styles.input}
        theme={theme}
      />
      <Button mode="contained" onPress={updateProfile} style={styles.button}>
        Update Profile
      </Button>
      <Button mode="outlined" onPress={handleLogout} style={styles.button} textColor={theme.colors.error}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  input: { marginBottom: 16, backgroundColor: "#1A1A1A" },
  button: { marginTop: 16, borderRadius: 8 },
  loading: { flex: 1, justifyContent: "center" },
});

export default ProfileScreen;