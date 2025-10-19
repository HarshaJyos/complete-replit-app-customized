import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  setPersistence,
} from "firebase/auth"; // Import getReactNativePersistence and setPersistence
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBvVyEfKX7m3iecxYoTZT-11G8UFp0LT0",
  authDomain: "syamapp-955e0.firebaseapp.com",
  projectId: "syamapp-955e0",
  storageBucket: "syamapp-955e0.firebasestorage.app",
  messagingSenderId: "599757311255",
  appId: "1:599757311255:web:611944a900e2351bdf7b52",
  measurementId: "G-8V6WTSQGMT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, getReactNativePersistence(AsyncStorage)); // Configure persistence

export { app, auth, firebaseConfig };
