import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Extract IP dynamically from Expo's host URI, or fallback to current LAN IP
const getBaseUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:5000/api";
  }

  // In Expo Go, hostUri holds the development computer's IP ("<ip>:<port>")
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(":")[0];
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
      return `http://${ip}:5000/api`;
    }
  }

  // Fallback to current network IP
  return "http://172.20.10.4:5000/api";
};

export const DEFAULT_API_HOST = getBaseUrl();

const api = axios.create({
  baseURL: DEFAULT_API_HOST,
  timeout: 15000,
});

// Update baseURL dynamically
export const setApiBaseUrl = (url) => {
  api.defaults.baseURL = url;
};

// Request interceptor to attach JWT token from AsyncStorage
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error retrieving token:", err);
  }
  return config;
});

// Response interceptor to handle errors and 401s
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(["token", "user"]);
      } catch (e) {
        console.error("Error removing auth tokens:", e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
