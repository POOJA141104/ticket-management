import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import api from "../../utils/api";
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

export default function DepartmentsScreen() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", shortName: "" });

  const load = () => {
    setError(null);
    api
      .get("/departments")
      .then((r) => {
        setData(r.data.data || []);
        setError(null);
      })
      .catch((e) => {
        setError(e.response?.data?.message || "Failed to load departments");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item ? { name: item.name, shortName: item.shortName } : { name: "", shortName: "" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.shortName.trim()) {
      Alert.alert("Missing Fields", "Please enter both department name and code.");
      return;
    }
    try {
      if (editing) {
        await api.put(`/departments/${editing._id}`, form);
        Alert.alert("Success", "Department updated successfully");
      } else {
        await api.post("/departments", form);
        Alert.alert("Success", "Department added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save department");
    }
  };

  const del = (id) => {
    Alert.alert("Delete Department", "Are you sure you want to delete this department?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/departments/${id}`);
            load();
          } catch (e) {
            Alert.alert("Error", e.response?.data?.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  if (loading) return <Spinner message="Loading departments…" />;

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
        title="Departments"
        subtitle="Manage academic & administrative departments"
        icon="dept"
        action={
          <Btn onPress={() => open()} size="sm">
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Add Dept</Text>
          </Btn>
        }
      />

      {data.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No departments found. Tap "Add Dept" above.</Text>
        </Card>
      ) : (
        data.map((d) => (
          <Card key={d._id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.badgeCode}>
                <Text style={styles.badgeCodeText}>{d.shortName}</Text>
              </View>
              <ActionButtons onEdit={() => open(d)} onDelete={() => del(d._id)} />
            </View>
            <Text style={styles.itemName}>{d.name}</Text>
          </Card>
        ))
      )}

      {modal && (
        <Modal
          title={editing ? "Edit Department" : "Add Department"}
          onClose={() => setModal(false)}
        >
          <Input
            label="Department Name *"
            placeholder="e.g. Computer Science & Engineering"
            value={form.name}
            onChangeText={(txt) => setForm({ ...form, name: txt })}
          />
          <Input
            label="Short Code *"
            placeholder="e.g. CSE"
            value={form.shortName}
            onChangeText={(txt) => setForm({ ...form, shortName: txt.toUpperCase() })}
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
  content: { padding: 16, paddingBottom: 40 },
  actionBtnText: { color: "#071210", fontWeight: "700", fontSize: 12 },
  emptyText: { color: COLORS.text3, textAlign: "center", paddingVertical: 20 },
  itemCard: { marginBottom: 10, padding: 16 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badgeCode: {
    backgroundColor: "rgba(99,210,190,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCodeText: { color: COLORS.accent, fontWeight: "800", fontSize: 12 },
  itemName: { color: COLORS.text, fontWeight: "700", fontSize: 15 },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 14 },
});

