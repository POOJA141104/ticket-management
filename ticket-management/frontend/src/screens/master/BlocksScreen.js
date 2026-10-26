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

export default function BlocksScreen() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", department: "", programme: "" });

  const load = () => {
    setError(null);
    Promise.allSettled([api.get("/blocks"), api.get("/departments"), api.get("/programmes")])
      .then(([blockRes, deptRes, progRes]) => {
        if (blockRes.status === "fulfilled") setData(blockRes.value.data?.data || []);
        if (deptRes.status === "fulfilled") setDepartments(deptRes.value.data?.data || []);
        if (progRes.status === "fulfilled") setProgrammes(progRes.value.data?.data || []);
      })
      .catch((e) => {
        setError(e.response?.data?.message || "Failed to load blocks");
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
            department: item.department?._id || item.department || "",
            programme: item.programme?._id || item.programme || "",
          }
        : {
            name: "",
            department: departments[0]?._id || "",
            programme: programmes[0]?._id || "",
          }
    );
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.department || !form.programme) {
      Alert.alert("Missing Fields", "Please select department, programme, and block name.");
      return;
    }
    try {
      if (editing) {
        await api.put(`/blocks/${editing._id}`, form);
        Alert.alert("Success", "Block updated successfully");
      } else {
        await api.post("/blocks", form);
        Alert.alert("Success", "Block added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save block");
    }
  };

  const del = (id) => {
    Alert.alert("Delete Block", "Are you sure you want to delete this block?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/blocks/${id}`);
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

  const filteredProgrammes = form.department
    ? programmes.filter((p) => (p.department?._id || p.department) === form.department)
    : programmes;

  const progOptions = filteredProgrammes.map((p) => ({
    label: `${p.name} (${p.shortName})`,
    value: p._id,
  }));

  if (loading) return <Spinner message="Loading blocks…" />;

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
        title="Blocks"
        subtitle="Manage academic blocks & building structures"
        icon="block"
        action={
          <Btn onPress={() => open()} size="sm">
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Add Block</Text>
          </Btn>
        }
      />

      {data.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No blocks found. Tap "Add Block" above.</Text>
        </Card>
      ) : (
        data.map((b) => (
          <Card key={b._id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{b.name}</Text>
              <ActionButtons onEdit={() => open(b)} onDelete={() => del(b._id)} />
            </View>
            <Text style={styles.itemSub}>
              🏛️ {b.department?.shortName || b.department?.name || "General Dept"} ·{" "}
              {b.programme?.shortName || b.programme?.name || "General Prog"}
            </Text>
          </Card>
        ))
      )}

      {modal && (
        <Modal
          title={editing ? "Edit Block" : "Add Block"}
          onClose={() => setModal(false)}
        >
          <Select
            label="Department *"
            placeholder="Select department"
            options={deptOptions}
            value={form.department}
            onValueChange={(val) => setForm({ ...form, department: val, programme: "" })}
          />
          <Select
            label="Programme *"
            placeholder="Select programme"
            options={progOptions}
            value={form.programme}
            onValueChange={(val) => setForm({ ...form, programme: val })}
          />
          <Input
            label="Block Name *"
            placeholder="e.g. Science Block / Block A"
            value={form.name}
            onChangeText={(txt) => setForm({ ...form, name: txt })}
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
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  itemName: { color: COLORS.text, fontWeight: "700", fontSize: 16 },
  itemSub: { color: COLORS.text2, fontSize: 12 },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 14 },
});

