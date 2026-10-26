import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { Icon } from "./UI";
import { COLORS } from "../theme/colors";

export default function Header() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out of TicketPro?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const initial = user?.name?.[0]?.toUpperCase() || "?";

  // Safe area top padding for iPhone 13 notch / dynamic island
  const headerPaddingTop = insets.top > 0 ? insets.top + 6 : 12;

  return (
    <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
      {/* Brand logo & title */}
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <Icon name="ticket" size={18} color="#071210" />
        </View>
        <View>
          <Text style={styles.brandTitle}>TicketPro</Text>
          <Text style={styles.brandSubtitle}>v1.0 · Management</Text>
        </View>
      </View>

      {/* User profile & logout */}
      <View style={styles.userSection}>
        <TouchableOpacity
          style={styles.userBadge}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.7}
          accessibilityLabel="Open user profile"
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || "User"}
            </Text>
            <Text style={styles.userRole}>{user?.role?.name || "Member"}</Text>
          </View>
          <Icon name="chevronRight" size={12} color={COLORS.text3} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          accessibilityLabel="Log out"
        >
          <Icon name="logout" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.bg2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: COLORS.text3,
    fontSize: 10,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 7,
    maxWidth: 160,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.accent2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#071210",
    fontWeight: "800",
    fontSize: 12,
  },
  userInfo: {
    flexShrink: 1,
  },
  userName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },
  userRole: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: "600",
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBg,
  },
});
