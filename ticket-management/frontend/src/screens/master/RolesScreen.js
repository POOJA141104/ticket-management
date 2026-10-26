import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import api, { DEFAULT_API_HOST } from "../../utils/api";
import {
  PageHeader,
  Card,
  Btn,
  Icon,
  Modal,
  Input,
  Spinner,
  ActionButtons,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

export default function RolesScreen() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const load = async () => {
    setError(null);
    try {
      const r = await api.get("/roles");
      setData(r.data.data || []);
      setError(null);
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        (e.message === "Network Error"
          ? `Network Error: Cannot reach server at ${api.defaults.baseURL || DEFAULT_API_HOST}. Please verify your phone is on the same Wi-Fi.`
          : e.message || "Failed to load roles");
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item ? { name: item.name } : { name: "" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      Alert.alert("Missing Field", "Please enter role name.");
      return;
    }
    try {
      if (editing) {
        await api.put(`/roles/${editing._id}`, form);
        Alert.alert("Success", "Role updated successfully");
      } else {
        await api.post("/roles", form);
        Alert.alert("Success", "Role added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save role");
    }
  };

  const del = (id) => {
    Alert.alert("Delete Role", "Are you sure you want to delete this role?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/roles/${id}`);
            load();
          } catch (e) {
            Alert.alert("Error", e.response?.data?.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  if (loading) return <Spinner message="Loading roles…" />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor={COLORS.accent}
        />
      }
    >
      <PageHeader
        title="Roles"
        subtitle="Manage user access levels & staff designations"
        icon="role"
        action={
          <Btn onPress={() => open()} size="sm">
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Add Role</Text>
          </Btn>
        }
      />

      {error ? (
        <Card style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Icon name="alert" size={20} color={COLORS.danger} />
            <Text style={styles.errorTitle}>Error Loading Roles</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setLoading(true);
              load();
            }}
          >
            <Icon name="refresh" size={14} color="#071210" />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </Card>
      ) : null}

      {!error && data.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Icon name="role" size={32} color={COLORS.text3} />
          <Text style={styles.emptyTitle}>No Roles Found</Text>
          <Text style={styles.emptySubtitle}>
            Tap "Add Role" above to create a new role.
          </Text>
        </Card>
      ) : (
        <View style={styles.grid}>
          {data.map((r) => (
            <View key={r._id} style={styles.col}>
              <Card style={styles.roleCard}>
                <View style={styles.roleHeader}>
                  <View style={styles.roleIconBox}>
                    <Icon name="role" size={18} color={COLORS.accent} />
                  </View>
                  <ActionButtons
                    onEdit={() => open(r)}
                    onDelete={() => del(r._id)}
                  />
                </View>
                <Text style={styles.roleName}>{r.name}</Text>
              </Card>
            </View>
          ))}
        </View>
      )}

      {modal && (
        <Modal
          title={editing ? "Edit Role" : "Add Role"}
          onClose={() => setModal(false)}
        >
          <Input
            label="Role Name *"
            placeholder="e.g. Electrician, Networking Staff"
            value={form.name}
            onChangeText={(txt) => setForm({ name: txt })}
          />
          <View style={styles.modalBtns}>
            <Btn variant="ghost" onPress={() => setModal(false)} style={{ flex: 1 }}>
              Cancel
            </Btn>
            <Btn onPress={save} style={{ flex: 1 }}>
              Save
            </Btn>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 70 },
  actionBtnText: { color: "#071210", fontWeight: "700", fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  col: { width: "48%" },
  roleCard: { padding: 14, marginBottom: 0 },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(99,210,190,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  roleName: { color: COLORS.text, fontWeight: "700", fontSize: 14 },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 14 },

  // Error Card
  errorCard: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.danger + "50",
    borderWidth: 1,
    marginBottom: 16,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  errorTitle: {
    color: COLORS.danger,
    fontWeight: "700",
    fontSize: 14,
  },
  errorText: {
    color: COLORS.text2,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  retryBtnText: {
    color: "#071210",
    fontWeight: "700",
    fontSize: 12,
  },

  // Empty Card
  emptyCard: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: COLORS.text3,
    fontSize: 12,
    textAlign: "center",
  },
});
