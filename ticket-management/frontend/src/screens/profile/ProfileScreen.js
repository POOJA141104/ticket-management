import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Card, Badge, Btn, Icon } from "../../components/UI";
import { COLORS } from "../../theme/colors";
import api, { DEFAULT_API_HOST } from "../../utils/api";

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, updateUserData, logout } = useAuth();

  // State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/complaints");
      const list = res.data?.data || [];
      const total = list.length;
      const pending = list.filter((c) => c.status === "Pending").length;
      const inProgress = list.filter((c) => c.status === "In-Progress").length;
      const resolved = list.filter((c) =>
        ["Resolved", "Closed"].includes(c.status)
      ).length;
      setStats({ total, pending, inProgress, resolved });
    } catch (e) {
      // Non-critical, ignore
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const handleOpenEdit = () => {
    setEditName(user?.name || "");
    setEditPhone(user?.phone || "");
    setEditEmail(user?.email || "");
    setNewPassword("");
    setConfirmPassword("");
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setEditError("Name is required");
      return;
    }
    if (!editPhone.trim()) {
      setEditError("Phone number is required");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setEditError("Password must be at least 6 characters long");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setEditError("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      setEditError("");

      const payload = {
        name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
      };
      if (newPassword) {
        payload.password = newPassword;
      }

      const res = await api.put("/auth/profile", payload);
      if (res.data?.success) {
        await updateUserData(res.data.data);
        setIsEditModalOpen(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        setEditError(res.data?.message || "Failed to update profile");
      }
    } catch (err) {
      setEditError(
        err.response?.data?.message || err.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out of TicketPro?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const initial = user?.name ? user.name[0].toUpperCase() : "?";
  const roleName = user?.role?.name || "Member";
  const deptName = user?.department?.name || "Not Assigned";
  const progName = user?.programme?.name || "Not Assigned";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 20) + 70 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.accent}
          colors={[COLORS.accent]}
        />
      }
    >
      {/* ── USER HERO CARD ── */}
      <View style={styles.heroCard}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.userName}>{user?.name || "User Name"}</Text>
        <Text style={styles.userUsername}>@{user?.username || "username"}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.roleChip}>
            <Icon name="shield" size={13} color={COLORS.accent} />
            <Text style={styles.roleChipText}>{roleName}</Text>
          </View>

          <View style={styles.statusChip}>
            <View style={styles.statusDot} />
            <Text style={styles.statusChipText}>Active</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editHeroBtn}
          onPress={handleOpenEdit}
          activeOpacity={0.8}
        >
          <Icon name="edit" size={14} color="#071210" />
          <Text style={styles.editHeroBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* ── STATS ROW ── */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderColor: COLORS.border }]}>
          <Text style={styles.statNum}>{stats.total}</Text>
          <Text style={styles.statLabel}>Tickets</Text>
        </View>
        <View style={[styles.statBox, { borderColor: COLORS.warning + "44" }]}>
          <Text style={[styles.statNum, { color: COLORS.warning }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, { borderColor: COLORS.info + "44" }]}>
          <Text style={[styles.statNum, { color: COLORS.info }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.statLabel}>In-Progress</Text>
        </View>
        <View style={[styles.statBox, { borderColor: COLORS.success + "44" }]}>
          <Text style={[styles.statNum, { color: COLORS.success }]}>
            {stats.resolved}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      {/* ── CONTACT & ACCOUNT INFO ── */}
      <Text style={styles.sectionTitle}>Account Details</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Icon name="mail" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.email || "No email"}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Icon name="phone" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>
              {user?.phone || "No phone number"}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Icon name="building" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{deptName}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Icon name="programme" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Programme</Text>
            <Text style={styles.infoValue}>{progName}</Text>
          </View>
        </View>
      </View>

      {/* ── SYSTEM & CONNECTIVITY ── */}
      <Text style={styles.sectionTitle}>System & Network</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Icon name="settings" size={16} color={COLORS.text2} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Server Endpoint</Text>
            <Text style={styles.monoValue} numberOfLines={1}>
              {DEFAULT_API_HOST}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Icon name="info" size={16} color={COLORS.text2} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>TicketPro Mobile 1.0.0 (Expo)</Text>
          </View>
        </View>
      </View>

      {/* ── LOGOUT BUTTON ── */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Icon name="logout" size={18} color={COLORS.danger} />
        <Text style={styles.logoutBtnText}>Log Out of Account</Text>
      </TouchableOpacity>

      {/* ── EDIT PROFILE MODAL ── */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 16 },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <Text style={styles.modalSubtitle}>
                  Update personal info and credentials
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Icon name="close" size={18} color={COLORS.text2} />
              </TouchableOpacity>
            </View>

            {editError ? (
              <View style={styles.errorBox}>
                <Icon name="alert" size={16} color={COLORS.danger} />
                <Text style={styles.errorText}>{editError}</Text>
              </View>
            ) : null}

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your Name"
                  placeholderTextColor={COLORS.text3}
                />
              </View>

              {/* Phone */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor={COLORS.text3}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Email */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="user@example.com"
                  placeholderTextColor={COLORS.text3}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.divider} />
              <Text style={styles.subHeading}>Change Password (Optional)</Text>

              {/* New Password */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Leave blank to keep current"
                    placeholderTextColor={COLORS.text3}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "eyeOff" : "eye"}
                      size={18}
                      color={COLORS.text3}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              {newPassword ? (
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat new password"
                    placeholderTextColor={COLORS.text3}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
              ) : null}

              {/* Actions */}
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsEditModalOpen(false)}
                  disabled={saving}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#071210" />
                  ) : (
                    <>
                      <Icon name="check" size={16} color="#071210" />
                      <Text style={styles.saveBtnText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 16,
  },

  // ── Hero Card ──
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.accent + "18",
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.accent,
    fontSize: 32,
    fontWeight: "800",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  userUsername: {
    color: COLORS.text3,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.accent + "15",
    borderWidth: 1,
    borderColor: COLORS.accent + "40",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleChipText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.success + "15",
    borderWidth: 1,
    borderColor: COLORS.success + "40",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusChipText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "700",
  },
  editHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  editHeroBtnText: {
    color: "#071210",
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Stats ──
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  statNum: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    color: COLORS.text3,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Details Card ──
  sectionTitle: {
    color: COLORS.text2,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.text3,
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  monoValue: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border + "60",
  },

  // ── Logout Button ──
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.danger + "12",
    borderWidth: 1,
    borderColor: COLORS.danger + "40",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "700",
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bg2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: COLORS.text3,
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalScroll: {
    marginBottom: 10,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.danger + "18",
    borderWidth: 1,
    borderColor: COLORS.danger + "40",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    flex: 1,
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: COLORS.text2,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  subHeading: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: COLORS.text2,
    fontSize: 14,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#071210",
    fontSize: 14,
    fontWeight: "700",
  },
});

