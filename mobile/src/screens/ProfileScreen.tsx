import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { apiService } from "../services/api";
import { firebaseAuthService } from "../services/firebaseAuthService";
import { UserProfile } from "../../../shared/schema";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        label="Name"
        value={profile.name || ""}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
      />
      <TextInput
        style={styles.input}
        label="Phone"
        value={profile.phone || ""}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
      />
      <TextInput
        style={styles.input}
        label="DOB"
        value={profile.dob || ""}
        onChangeText={(text) => setProfile({ ...profile, dob: text })}
      />
      <Button mode="contained" onPress={updateProfile} style={styles.button}>
        Update Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 16 },
  input: { backgroundColor: "#1A1A1A", color: "#FFFFFF", marginBottom: 16 },
  button: { backgroundColor: "#00FF00" },
  loading: { flex: 1, justifyContent: "center" },
});

export default ProfileScreen;
