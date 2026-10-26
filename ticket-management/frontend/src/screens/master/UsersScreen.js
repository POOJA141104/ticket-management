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
  Badge,
  Spinner,
  ActionButtons,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

export default function UsersScreen() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    department: "",
    programme: "",
    isActive: true,
  });

  const load = () => {
    Promise.allSettled([
      api.get("/users"),
      api.get("/roles"),
      api.get("/departments"),
      api.get("/programmes"),
    ])
      .then(([uRes, rRes, dRes, pRes]) => {
        if (uRes.status === "fulfilled") setData(uRes.value.data?.data || []);
        if (rRes.status === "fulfilled") setRoles(rRes.value.data?.data || []);
        if (dRes.status === "fulfilled") setDepartments(dRes.value.data?.data || []);
        if (pRes.status === "fulfilled") setProgrammes(pRes.value.data?.data || []);
      })
      .catch((e) => {
        // Handled gracefully
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
            username: item.username,
            email: item.email,
            phone: item.phone,
            password: "",
            role: item.role?._id || item.role || "",
            department: item.department?._id || item.department || "",
            programme: item.programme?._id || item.programme || "",
            isActive: item.isActive !== false,
          }
        : {
            name: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            role: roles[0]?._id || "",
            department: "",
            programme: "",
            isActive: true,
          }
    );
    setModal(true);
  };

  const save = async () => {
    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.role
    ) {
      Alert.alert("Missing Fields", "Please fill in name, username, email, phone, and role.");
      return;
    }
    if (!editing && !form.password) {
      Alert.alert("Password Required", "Please enter a password for the new user.");
      return;
    }

    const payload = { ...form };
    if (!payload.department) delete payload.department;
    if (!payload.programme) delete payload.programme;
    if (editing && !payload.password) delete payload.password;

    try {
      if (editing) {
        await api.put(`/users/${editing._id}`, payload);
        Alert.alert("Success", "User account updated successfully");
      } else {
        await api.post("/users", payload);
        Alert.alert("Success", "User account created successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to save user");
    }
  };

  const del = (id) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/users/${id}`);
            load();
          } catch (e) {
            Alert.alert("Error", e.response?.data?.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  const roleOptions = roles.map((r) => ({ label: r.name, value: r._id }));
  const deptOptions = [
    { label: "None / General", value: "" },
    ...departments.map((d) => ({
      label: `${d.name} (${d.shortName})`,
      value: d._id,
    })),
  ];
  const progOptions = [
    { label: "None", value: "" },
    ...programmes.map((p) => ({
      label: `${p.name} (${p.shortName})`,
      value: p._id,
    })),
  ];

  if (loading) return <Spinner message="Loading users…" />;

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
        title="Users"
        subtitle="Manage student, staff, and admin accounts"
        icon="users"
        action={
          <Btn onPress={() => open()} size="sm">
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Add User</Text>
          </Btn>
        }
      />

      {data.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No users found. Tap "Add User" above.</Text>
        </Card>
      ) : (
        data.map((u) => (
          <Card key={u._id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{u.name}</Text>
                <Text style={styles.userUsername}>@{u.username}</Text>
              </View>
              <ActionButtons onEdit={() => open(u)} onDelete={() => del(u._id)} />
            </View>

            <View style={styles.userMetaRow}>
              <Text style={styles.metaText}>✉️ {u.email}</Text>
              <Text style={styles.metaText}>📞 {u.phone}</Text>
            </View>

            <View style={styles.userBottomRow}>
              <Badge
                status={
                  u.role?.name === "SuperAdmin"
                    ? "Assigned"
                    : u.role?.name === "User"
                    ? "Completed"
                    : "In-Progress"
                }
              >
                {u.role?.name || "Member"}
              </Badge>
              <Text style={styles.deptText}>
                {u.department?.shortName || u.department?.name || "General"}
              </Text>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      u.isActive !== false ? COLORS.successBg : COLORS.dangerBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    {
                      color:
                        u.isActive !== false ? COLORS.success : COLORS.danger,
                    },
                  ]}
                >
                  {u.isActive !== false ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}

      {modal && (
        <Modal
          title={editing ? "Edit User" : "Add User"}
          onClose={() => setModal(false)}
        >
          <Input
            label="Full Name *"
            placeholder="e.g. Jane Doe"
            value={form.name}
            onChangeText={(txt) => setForm({ ...form, name: txt })}
          />
          <Input
            label="Username *"
            placeholder="e.g. jdoe"
            value={form.username}
            onChangeText={(txt) => setForm({ ...form, username: txt })}
            autoCapitalize="none"
          />
          <Input
            label="Email Address *"
            placeholder="e.g. jdoe@university.edu"
            value={form.email}
            onChangeText={(txt) => setForm({ ...form, email: txt })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Phone Number *"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChangeText={(txt) => setForm({ ...form, phone: txt })}
            keyboardType="phone-pad"
          />
          <Input
            label={editing ? "New Password (optional)" : "Password *"}
            placeholder={editing ? "Leave blank to keep" : "••••••••"}
            value={form.password}
            onChangeText={(txt) => setForm({ ...form, password: txt })}
            secureTextEntry
          />
          <Select
            label="User Role *"
            options={roleOptions}
            value={form.role}
            onValueChange={(val) => setForm({ ...form, role: val })}
          />
          <Select
            label="Department"
            options={deptOptions}
            value={form.department}
            onValueChange={(val) => setForm({ ...form, department: val })}
          />
          <Select
            label="Programme"
            options={progOptions}
            value={form.programme}
            onValueChange={(val) => setForm({ ...form, programme: val })}
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
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  userName: { color: COLORS.text, fontWeight: "800", fontSize: 16 },
  userUsername: { color: COLORS.accent, fontSize: 11, marginTop: 1 },
  userMetaRow: { gap: 4, marginVertical: 8 },
  metaText: { color: COLORS.text2, fontSize: 12 },
  userBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    paddingTop: 8,
    marginTop: 4,
  },
  deptText: { color: COLORS.text3, fontSize: 12 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusPillText: { fontSize: 10, fontWeight: "800" },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 14 },
});

