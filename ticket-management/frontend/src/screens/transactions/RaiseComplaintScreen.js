import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  PageHeader,
  Card,
  Select,
  Textarea,
  Btn,
  Icon,
  Spinner,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

const TYPES = [
  "PC Hardware",
  "PC Software",
  "Application Issues",
  "Network",
  "Electronics",
  "Plumbing",
  "Electrician",
  "Other",
];

const TYPE_ICONS = {
  "PC Hardware": "🖥️",
  "PC Software": "💿",
  "Application Issues": "📱",
  Network: "🌐",
  Electronics: "⚡",
  Plumbing: "🔧",
  Electrician: "💡",
  Other: "📋",
};

export default function RaiseComplaintScreen({ navigation }) {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    block: "",
    room: "",
    type: "PC Hardware",
    remarks: "",
  });

  useEffect(() => {
    api
      .get("/blocks")
      .then((r) => {
        setBlocks(r.data.data || []);
      })
      .catch((e) => console.error("Error fetching blocks:", e))
      .finally(() => setFetchingData(false));
  }, []);

  useEffect(() => {
    if (form.block) {
      api
        .get(`/rooms?block=${form.block}`)
        .then((r) => setRooms(r.data.data || []))
        .catch(() => setRooms([]));
    } else {
      setRooms([]);
    }
  }, [form.block]);

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setFile(res.assets[0]);
      }
    } catch (err) {
      console.error("Document pick error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.block || !form.room || !form.type || !form.remarks.trim()) {
      Alert.alert("Missing Fields", "Please select a block, room, type, and enter remarks.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("block", form.block);
      fd.append("room", form.room);
      fd.append("type", form.type);
      fd.append("remarks", form.remarks.trim());

      if (file) {
        if (Platform.OS === "web") {
          fd.append("attachment", file.file || file);
        } else {
          fd.append("attachment", {
            uri: file.uri,
            name: file.name || "attachment.jpg",
            type: file.mimeType || "application/octet-stream",
          });
        }
      }

      const { data } = await api.post("/complaints", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const ticketId = data.data.ticketId;
      Alert.alert(
        "Complaint Submitted! 🎫",
        `Ticket ID: ${ticketId}\n\nYour complaint has been registered. You can track its progress in Complaints screen.`,
        [
          {
            text: "View Tickets",
            onPress: () => navigation.navigate("Complaints"),
          },
          { text: "Done", style: "cancel" },
        ]
      );

      // Reset form
      setForm({ block: "", room: "", type: "PC Hardware", remarks: "" });
      setFile(null);
    } catch (err) {
      Alert.alert(
        "Submission Failed",
        err.response?.data?.message || err.message || "Failed to raise complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) return <Spinner message="Loading location data…" />;

  const blockOptions = blocks.map((b) => ({ label: b.name, value: b._id }));
  const roomOptions = rooms.map((r) => ({ label: `Room ${r.number}`, value: r._id }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader
        title="Raise Complaint"
        subtitle="Submit a new technical or infrastructure issue"
        icon="raise"
      />

      <Card>
        {/* Section 1: Location */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionStepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Location Information</Text>
          </View>

          <Select
            label="Block Name *"
            placeholder="Select campus block"
            options={blockOptions}
            value={form.block}
            onValueChange={(val) => setForm({ ...form, block: val, room: "" })}
          />

          <Select
            label="Room Number *"
            placeholder={form.block ? "Select room" : "First select a block"}
            options={roomOptions}
            value={form.room}
            onValueChange={(val) => setForm({ ...form, room: val })}
          />
        </View>

        {/* Section 2: Complaint Type */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionStepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Complaint Category</Text>
          </View>

          <View style={styles.typeGrid}>
            {TYPES.map((t) => {
              const selected = form.type === t;
              return (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.7}
                  onPress={() => setForm({ ...form, type: t })}
                  style={[styles.typeTile, selected && styles.typeTileSelected]}
                >
                  <Text style={styles.typeIcon}>{TYPE_ICONS[t]}</Text>
                  <Text
                    style={[styles.typeText, selected && styles.typeTextSelected]}
                    numberOfLines={1}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: Details & Attachment */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionStepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Issue Description</Text>
          </View>

          <Textarea
            label="Complaint Remarks *"
            placeholder="Describe the issue clearly — include what happened, since when, and any relevant error messages…"
            value={form.remarks}
            onChangeText={(txt) => setForm({ ...form, remarks: txt })}
          />

          <View style={{ marginTop: 6 }}>
            <Text style={styles.attachmentLabel}>Attachment (Optional)</Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePickDocument}
              style={[
                styles.attachmentBox,
                file && { borderColor: COLORS.accent, backgroundColor: "rgba(99,210,190,0.06)" },
              ]}
            >
              <Icon
                name="attach"
                size={18}
                color={file ? COLORS.accent : COLORS.text3}
              />
              <Text
                style={[
                  styles.attachmentText,
                  file && { color: COLORS.accent, fontWeight: "700" },
                ]}
                numberOfLines={1}
              >
                {file ? file.name : "Tap to attach image or document"}
              </Text>
              {file && (
                <TouchableOpacity
                  onPress={() => setFile(null)}
                  style={{ padding: 4 }}
                >
                  <Icon name="close" size={14} color={COLORS.danger} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info footer and submit */}
        <View style={styles.submitSection}>
          <Text style={styles.filingAsText}>
            Filing as{" "}
            <Text style={{ color: COLORS.accent, fontWeight: "700" }}>
              {user?.name}
            </Text>{" "}
            ({user?.role?.name})
          </Text>

          <Btn
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={{ width: "100%", marginTop: 10 }}
          >
            <Icon name="raise" size={16} color="#071210" />
            <Text style={styles.submitBtnText}>Submit Complaint</Text>
          </Btn>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 70,
  },
  sectionBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionStepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(99,210,190,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.accent,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeTile: {
    width: "48%",
    backgroundColor: COLORS.surface2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  typeTileSelected: {
    borderColor: COLORS.accent,
    backgroundColor: "rgba(99,210,190,0.1)",
  },
  typeIcon: {
    fontSize: 22,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text2,
  },
  typeTextSelected: {
    color: COLORS.accent,
    fontWeight: "800",
  },
  attachmentLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  attachmentBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
  },
  attachmentText: {
    flex: 1,
    color: COLORS.text3,
    fontSize: 12,
  },
  submitSection: {
    paddingTop: 8,
  },
  filingAsText: {
    fontSize: 11,
    color: COLORS.text3,
    textAlign: "center",
  },
  submitBtnText: {
    color: "#071210",
    fontWeight: "800",
    fontSize: 14,
  },
});

