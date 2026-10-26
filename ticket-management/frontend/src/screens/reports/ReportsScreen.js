import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../../utils/api";
import {
  PageHeader,
  Card,
  Btn,
  Icon,
  Select,
  StatCard,
  Badge,
  Spinner,
  Modal,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

const TYPES = [
  "All Types",
  "PC Hardware",
  "PC Software",
  "Application Issues",
  "Network",
  "Electronics",
  "Plumbing",
  "Electrician",
  "Other",
];
const STATUSES = ["All Statuses", "Pending", "Assigned", "In-Progress", "On-Hold", "Completed"];

export default function ReportsScreen() {
  const [depts, setDepts] = useState([]);
  const [progs, setProgs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    programme: "",
    type: "",
    status: "",
    assignee: "",
  });
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/departments"),
      api.get("/programmes"),
      api.get("/users/staff"),
    ])
      .then(([d, p, s]) => {
        setDepts(d.data.data || []);
        setProgs(p.data.data || []);
        setStaff(s.data.data || []);
      })
      .catch((e) => console.error("Error loading filter data:", e));
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.programme) params.append("programme", filters.programme);
      if (filters.type && filters.type !== "All Types") params.append("type", filters.type);
      if (filters.status && filters.status !== "All Statuses") params.append("status", filters.status);
      if (filters.assignee) params.append("assignee", filters.assignee);

      const { data } = await api.get(`/reports/complaints?${params.toString()}`);
      setResults(data);
    } catch (err) {
      Alert.alert("Report Failed", "Unable to generate report data.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFilters({ department: "", programme: "", type: "", status: "", assignee: "" });
    setResults(null);
  };

  const deptOptions = [
    { label: "All Departments", value: "" },
    ...depts.map((d) => ({ label: d.name, value: d._id })),
  ];
  const progOptions = [
    { label: "All Programmes", value: "" },
    ...progs
      .filter((p) => !filters.department || p.department?._id === filters.department)
      .map((p) => ({ label: p.name, value: p._id })),
  ];
  const typeOptions = TYPES.map((t) => ({ label: t, value: t === "All Types" ? "" : t }));
  const statusOptions = STATUSES.map((s) => ({ label: s, value: s === "All Statuses" ? "" : s }));
  const staffOptions = [
    { label: "All Assignees", value: "" },
    ...staff.map((s) => ({ label: `${s.name} (${s.role?.name})`, value: s._id })),
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader
        title="Complaint Analytics"
        subtitle="Generate custom audit reports and track resolution metrics"
        icon="report"
      />

      {/* Filter Panel */}
      <Card style={styles.filterCard}>
        <View style={styles.filterTitleRow}>
          <Icon name="filter" size={16} color={COLORS.accent} />
          <Text style={styles.filterTitle}>Report Parameters</Text>
        </View>

        <Select
          label="Department"
          options={deptOptions}
          value={filters.department}
          onValueChange={(val) => setFilters({ ...filters, department: val, programme: "" })}
        />

        <Select
          label="Programme"
          options={progOptions}
          value={filters.programme}
          onValueChange={(val) => setFilters({ ...filters, programme: val })}
        />

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Select
              label="Type"
              options={typeOptions}
              value={filters.type}
              onValueChange={(val) => setFilters({ ...filters, type: val })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            />
          </View>
        </View>

        <Select
          label="Assigned Staff"
          options={staffOptions}
          value={filters.assignee}
          onValueChange={(val) => setFilters({ ...filters, assignee: val })}
        />

        <View style={styles.btnRow}>
          <Btn variant="outline" onPress={reset} style={{ flex: 1 }}>
            <Icon name="close" size={12} color={COLORS.text2} />
            <Text style={{ color: COLORS.text2, fontWeight: "700", fontSize: 12 }}>Reset</Text>
          </Btn>
          <Btn onPress={generate} loading={loading} style={{ flex: 1 }}>
            <Icon name="report" size={14} color="#071210" />
            <Text style={{ color: "#071210", fontWeight: "700", fontSize: 12 }}>
              Generate
            </Text>
          </Btn>
        </View>
      </Card>

      {/* Results View */}
      {results && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionHeader}>REPORT SUMMARY</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <StatCard
                label="Total Found"
                value={results.summary?.total ?? results.data?.length ?? 0}
                color={COLORS.accent}
                icon="complaint"
              />
            </View>
            <View style={styles.statCol}>
              <StatCard
                label="Pending"
                value={results.summary?.pending ?? 0}
                color={COLORS.warn}
                icon="alert"
              />
            </View>
            <View style={styles.statCol}>
              <StatCard
                label="Assigned"
                value={results.summary?.assigned ?? 0}
                color={COLORS.info}
                icon="assign"
              />
            </View>
            <View style={styles.statCol}>
              <StatCard
                label="Completed"
                value={results.summary?.completed ?? 0}
                color={COLORS.success}
                icon="check"
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>
            MATCHED TICKETS ({results.data?.length || 0})
          </Text>

          {results.data?.length === 0 ? (
            <Card>
              <Text style={{ color: COLORS.text3, textAlign: "center", padding: 20 }}>
                No complaints matched these criteria.
              </Text>
            </Card>
          ) : (
            results.data.map((c) => (
              <Card key={c._id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.ticketId}>{c.ticketId}</Text>
                    <View style={styles.deptBadge}>
                      <Text style={styles.deptBadgeText}>{c.department?.shortName || "Dept"}</Text>
                    </View>
                  </View>
                  <Badge status={c.status} />
                </View>

                <Text style={styles.resultType}>{c.type}</Text>
                <Text style={styles.resultLoc}>
                  📍 {c.block?.name || "Block"} · Room {c.room?.number || "—"}
                </Text>

                <View style={styles.resultFooter}>
                  <Text style={styles.resultUser}>By: {c.raisedBy?.name}</Text>
                  <Text style={styles.resultUser}>To: {c.assignedTo?.name || "Unassigned"}</Text>
                </View>
              </Card>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 70 },
  filterCard: { padding: 18, marginBottom: 16 },
  filterTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  filterTitle: { color: COLORS.text, fontWeight: "800", fontSize: 14 },
  twoCol: { flexDirection: "row", gap: 10 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 10,
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  statCol: { width: "48%" },
  resultCard: { padding: 14, marginBottom: 10 },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  ticketId: { color: COLORS.accent, fontWeight: "800", fontSize: 13 },
  deptBadge: { backgroundColor: "rgba(99,210,190,0.1)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  deptBadgeText: { color: COLORS.accent, fontSize: 10, fontWeight: "700" },
  resultType: { color: COLORS.text, fontWeight: "700", fontSize: 14, marginBottom: 2 },
  resultLoc: { color: COLORS.text2, fontSize: 12, marginBottom: 8 },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    paddingTop: 8,
  },
  resultUser: { color: COLORS.text3, fontSize: 11 },
});

