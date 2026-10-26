import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Icon, Input, Btn, Card } from "../../components/UI";
import { COLORS } from "../../theme/colors";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password");
      return;
    }
    setLoading(true);
    setError("");
    const res = await login(username.trim(), password);
    if (!res.success) {
      setError(res.message);
    }
    setLoading(false);
  };

  const features = [
    { icon: "complaint", text: "Hardware & Software Complaint Tracking" },
    { icon: "assign", text: "Role-Based Access & Assignment" },
    { icon: "status", text: "Real-Time Status Updates" },
    { icon: "report", text: "Detailed Analytics & Reports" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 16, 40),
            paddingBottom: Math.max(insets.bottom + 20, 36),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Icon name="ticket" size={28} color="#071210" />
          </View>
          <Text style={styles.brandTitle}>TicketPro</Text>
          <Text style={styles.brandSubtitle}>MANAGEMENT SYSTEM</Text>
        </View>

        {/* Hero title */}
        <View style={styles.heroSection}>
          <Text style={styles.heroMain}>
            Resolve Issues.{"\n"}
            <Text style={styles.heroHighlight}>Faster.</Text>
          </Text>
          <Text style={styles.heroDescription}>
            Centralized platform for institutional complaint management with full
            role-based access control.
          </Text>
        </View>

        {/* Login Form Card */}
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>Access your dashboard and tickets</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Icon name="alert" size={16} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Username"
            placeholder="e.g. superadmin"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            rightElement={
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={styles.showPassText}>{showPass ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            }
          />

          <Btn
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={{ marginTop: 8 }}
          >
            Sign In to TicketPro
          </Btn>

          {/* Quick Demo Credentials */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>DEFAULT LOGIN CREDENTIALS</Text>
            <TouchableOpacity
              onPress={() => {
                setUsername("superadmin");
                setPassword("admin123");
              }}
              style={styles.demoRow}
            >
              <Text style={styles.demoRole}>SuperAdmin:</Text>
              <Text style={styles.demoValue}>superadmin / admin123 (Tap to fill)</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Key Features List */}
        <View style={styles.featureList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Icon name={f.icon} size={15} color={COLORS.accent} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 2,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  heroMain: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroHighlight: {
    color: COLORS.accent,
  },
  heroDescription: {
    fontSize: 13,
    color: COLORS.text2,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 320,
  },
  formCard: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: COLORS.text2,
    marginBottom: 18,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.3)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    flex: 1,
  },
  showPassText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  demoBox: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.text3,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  demoRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  demoRole: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accent,
  },
  demoValue: {
    fontSize: 11,
    color: COLORS.text2,
  },
  featureList: {
    width: "100%",
    maxWidth: 420,
    marginTop: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(99,210,190,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    color: COLORS.text2,
    fontSize: 12,
  },
});

