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
  Select,
  Spinner,
  ActionButtons,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

export default function ProgrammesScreen() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", shortName: "" });

  const load = () => {
    setError(null);
    Promise.allSettled([api.get("/programmes"), api.get("/departments")])
      .then(([progRes, deptRes]) => {
        if (progRes.status === "fulfilled") setData(progRes.value.data?.data || []);
        if (deptRes.status === "fulfilled") setDepartments(deptRes.value.data?.data || []);
      })
      .catch((e) => {
        setError(e.response?.data?.message || "Failed to load programmes");
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
    setForm(
      item
        ? {
            name: item.name,
            shortName: item.shortName,
            department: item.department?._id || item.department || "",
          }
        : { name: "", shortName: "", department: departments[0]?._id || "" }
    );
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.shortName.trim() || !form.department) {
      Alert.alert("Missing Fields", "Please select a department and enter programme details.");
      return;
    }
    try {
      if (editing) {
        await api.put(`/programmes/${editing._id}`, form);
        Alert.alert("Success", "Programme updated successfully");
      } else {
        await api.post("/programmes", form);
        Alert.alert("Success", "Programme added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save programme");
    }
  };

  const del = (id) => {
    Alert.alert("Delete Programme", "Are you sure you want to delete this programme?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/programmes/${id}`);
            load();
          } catch (e) {
            Alert.alert("Error", e.response?.data?.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  const deptOptions = departments.map((d) => ({
    label: `${d.name} (${d.shortName})`,
    value: d._id,
  }));

  if (loading) return <Spinner message="Loading programmes…" />;

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
        title="Programmes"
        subtitle="Manage degree offerings & academic streams"
        icon="programme"
        action={
          <Btn onPress={() => open()} size="sm">
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Add Prog</Text>
          </Btn>
        }
      />

      {data.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No programmes found. Tap "Add Prog" above.</Text>
        </Card>
      ) : (
        data.map((p) => (
          <Card key={p._id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.badgeCode}>
                <Text style={styles.badgeCodeText}>{p.shortName}</Text>
              </View>
              <ActionButtons onEdit={() => open(p)} onDelete={() => del(p._id)} />
            </View>
            <Text style={styles.itemName}>{p.name}</Text>
            <Text style={styles.itemSub}>
              🏛️ {p.department?.name ? `${p.department.name} (${p.department.shortName})` : "General"}
            </Text>
          </Card>
        ))
      )}

      {modal && (
        <Modal
          title={editing ? "Edit Programme" : "Add Programme"}
          onClose={() => setModal(false)}
        >
          <Select
            label="Department *"
            placeholder="Select department"
            options={deptOptions}
            value={form.department}
            onValueChange={(val) => setForm({ ...form, department: val })}
          />
          <Input
            label="Programme Name *"
            placeholder="e.g. Bachelor of Technology"
            value={form.name}
            onChangeText={(txt) => setForm({ ...form, name: txt })}
          />
          <Input
            label="Short Name / Code *"
            placeholder="e.g. B.Tech"
            value={form.shortName}
            onChangeText={(txt) => setForm({ ...form, shortName: txt })}
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
  itemSub: { color: COLORS.text2, fontSize: 12, marginTop: 4 },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 14 },
});

