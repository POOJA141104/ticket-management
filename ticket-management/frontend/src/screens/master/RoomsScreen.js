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

export default function RoomsScreen() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({ number: "", department: "", programme: "", block: "" });

  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    Promise.allSettled([
      api.get("/rooms"),
      api.get("/departments"),
      api.get("/programmes"),
      api.get("/blocks"),
    ])
      .then(([roomRes, deptRes, progRes, blockRes]) => {
        if (roomRes.status === "fulfilled") setData(roomRes.value.data?.data || []);
        if (deptRes.status === "fulfilled") setDepartments(deptRes.value.data?.data || []);
        if (progRes.status === "fulfilled") setProgrammes(progRes.value.data?.data || []);
        if (blockRes.status === "fulfilled") setBlocks(blockRes.value.data?.data || []);
      })
      .catch((e) => {
        setError(e.response?.data?.message || "Failed to load rooms");
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
            number: item.number,
            department: item.department?._id || item.department || "",
            programme: item.programme?._id || item.programme || "",
            block: item.block?._id || item.block || "",
          }
        : {
            number: "",
            department: departments[0]?._id || "",
            programme: programmes[0]?._id || "",
            block: blocks[0]?._id || "",
          }
    );
    setModal(true);
  };

  const save = async () => {
    if (!form.number.trim() || !form.department || !form.programme || !form.block) {
      Alert.alert("Missing Fields", "Please fill in all room, department, programme, and block fields.");
      return;
    }
    try {
      if (editing) {
        await api.put(`/rooms/${editing._id}`, form);
        Alert.alert("Success", "Room updated successfully");
      } else {
        await api.post("/rooms", form);
        Alert.alert("Success", "Room added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save room");
    }
  };

  const del = (id) => {
    Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/rooms/${id}`);
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

  const progOptions = programmes.map((p) => ({
    label: `${p.name} (${p.shortName})`,
    value: p._id,
  }));

  const filteredBlocks = form.department
    ? blocks.filter((b) => (b.department?._id || b.department) === form.department)
    : blocks;

  const blockOptions = filteredBlocks.map((b) => ({
    label: b.name,
    value: b._id,
  }));

  if (loading) return <Spinner message="Loading rooms…" />;

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
        title="Rooms"
        subtitle="Manage rooms, labs, and class numbers"
        icon="room"
        action={
          <Btn onPress={() => open()} size="sm">
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Add Room</Text>
          </Btn>
        }
      />

      {data.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No rooms found. Tap "Add Room" above.</Text>
        </Card>
      ) : (
        data.map((r) => (
          <Card key={r._id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.badgeRoom}>
                <Text style={styles.badgeRoomText}>Room {r.number}</Text>
              </View>
              <ActionButtons onEdit={() => open(r)} onDelete={() => del(r._id)} />
            </View>
            <Text style={styles.itemName}>📍 {r.block?.name || "Block"}</Text>
            <Text style={styles.itemSub}>
              🏛️ {r.department?.shortName || "Dept"} · {r.programme?.shortName || "Prog"}
            </Text>
          </Card>
        ))
      )}

      {modal && (
        <Modal
          title={editing ? "Edit Room" : "Add Room"}
          onClose={() => setModal(false)}
        >
          <Select
            label="Department *"
            placeholder="Select department"
            options={deptOptions}
            value={form.department}
            onValueChange={(val) => setForm({ ...form, department: val })}
          />
          <Select
            label="Programme *"
            placeholder="Select programme"
            options={progOptions}
            value={form.programme}
            onValueChange={(val) => setForm({ ...form, programme: val })}
          />
          <Select
            label="Block *"
            placeholder="Select block"
            options={blockOptions}
            value={form.block}
            onValueChange={(val) => setForm({ ...form, block: val })}
          />
          <Input
            label="Room Number *"
            placeholder="e.g. 101, Lab 3, Auditorium"
            value={form.number}
            onChangeText={(txt) => setForm({ ...form, number: txt })}
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
  badgeRoom: {
    backgroundColor: "rgba(99,210,190,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRoomText: { color: COLORS.accent, fontWeight: "800", fontSize: 13 },
  itemName: { color: COLORS.text, fontWeight: "700", fontSize: 15 },
  itemSub: { color: COLORS.text2, fontSize: 12, marginTop: 2 },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 14 },
});

