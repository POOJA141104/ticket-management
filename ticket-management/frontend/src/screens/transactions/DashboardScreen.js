import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import {
  StatCard,
  Card,
  Badge,
  Btn,
  Icon,
  Spinner,
  Modal,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

export default function DashboardScreen({ navigation }) {
  const { user, isSuperAdmin, canRaise } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      const [dashRes, compRes] = await Promise.all([
        api.get("/complaints/dashboard"),
        api.get("/complaints?limit=5"),
      ]);
      setStats(dashRes.data.data);
      setRecent(compRes.data.data || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) return <Spinner message="Loading dashboard…" />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.accent}
          colors={[COLORS.accent]}
        />
      }
    >
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeGreeting}>Welcome back,</Text>
          <Text style={styles.welcomeName}>{user?.name || "User"}</Text>
          <Text style={styles.welcomeDept}>
            {user?.department?.name || user?.department?.shortName || "University Portal"} ·{" "}
            <Text style={{ color: COLORS.accent, fontWeight: "700" }}>
              {user?.role?.name}
            </Text>
          </Text>
        </View>
        <View style={styles.welcomeIconBox}>
          <Icon name="dashboard" size={24} color={COLORS.accent} />
        </View>
      </View>

      {/* Quick Action Shortcuts */}
      <View style={styles.actionsRow}>
        {canRaise() && (
          <Btn
            onPress={() => navigation.navigate("Raise")}
            size="sm"
            style={styles.actionBtn}
          >
            <Icon name="raise" size={14} color="#071210" />
            <Text style={styles.actionBtnText}>Raise Ticket</Text>
          </Btn>
        )}
        <Btn
          onPress={() => navigation.navigate("Complaints")}
          variant="outline"
          size="sm"
          style={styles.actionBtn}
        >
          <Icon name="complaint" size={14} color={COLORS.text2} />
          <Text style={[styles.actionBtnText, { color: COLORS.text2 }]}>
            All Tickets
          </Text>
        </Btn>
        {isSuperAdmin() && (
          <Btn
            onPress={() => navigation.navigate("Reports")}
            variant="ghost"
            size="sm"
            style={styles.actionBtn}
          >
            <Icon name="report" size={14} color={COLORS.accent} />
            <Text style={[styles.actionBtnText, { color: COLORS.accent }]}>
              Reports
            </Text>
          </Btn>
        )}
      </View>

      {/* Stat Cards Grid */}
      <Text style={styles.sectionHeader}>COMPLAINTS OVERVIEW</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCol}>
          <StatCard
            label="Total Filed"
            value={stats?.total ?? 0}
            color={COLORS.accent}
            icon="complaint"
          />
        </View>
        <View style={styles.statCol}>
          <StatCard
            label="Pending"
            value={stats?.pending ?? 0}
            color={COLORS.warn}
            icon="alert"
          />
        </View>
        <View style={styles.statCol}>
          <StatCard
            label="Assigned"
            value={stats?.assigned ?? 0}
            color={COLORS.info}
            icon="assign"
          />
        </View>
        <View style={styles.statCol}>
          <StatCard
            label="In Progress"
            value={stats?.inProgress ?? 0}
            color={COLORS.purple}
            icon="status"
          />
        </View>
        <View style={styles.statCol}>
          <StatCard
            label="On Hold"
            value={stats?.onHold ?? 0}
            color={COLORS.danger}
            icon="close"
          />
        </View>
        <View style={styles.statCol}>
          <StatCard
            label="Completed"
            value={stats?.completed ?? 0}
            color={COLORS.success}
            icon="check"
          />
        </View>
      </View>

      {/* Recent Complaints */}
      <View style={styles.recentHeaderRow}>
        <Text style={styles.sectionHeader}>RECENT TICKETS</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Complaints")}>
          <Text style={styles.seeAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {recent.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No recent complaints found</Text>
        </Card>
      ) : (
        recent.slice(0, 5).map((c) => (
          <TouchableOpacity
            key={c._id}
            activeOpacity={0.75}
            onPress={() => setSelectedComplaint(c)}
          >
            <Card style={styles.complaintCard}>
              <View style={styles.complaintTopRow}>
                <View style={styles.ticketIdRow}>
                  <Icon name="ticket" size={14} color={COLORS.accent} />
                  <Text style={styles.ticketIdText}>{c.ticketId}</Text>
                </View>
                <Badge status={c.status} />
              </View>

              <Text style={styles.complaintType}>{c.type}</Text>
              <Text style={styles.complaintRemarks} numberOfLines={2}>
                {c.remarks}
              </Text>

              <View style={styles.complaintFooter}>
                <Text style={styles.complaintLocation}>
                  📍 {c.block?.name || "Block"} · Room {c.room?.number || "—"}
                </Text>
                <Text style={styles.complaintDate}>
                  {c.createdAt ? c.createdAt.slice(0, 10) : ""}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}

      {/* Details Modal */}
      {selectedComplaint && (
        <Modal
          title={`Ticket Details — ${selectedComplaint.ticketId}`}
          onClose={() => setSelectedComplaint(null)}
        >
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: COLORS.text2 }}>Current Status:</Text>
              <Badge status={selectedComplaint.status} />
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Complaint Type:</Text>
              <Text style={styles.detailVal}>{selectedComplaint.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailVal}>
                {selectedComplaint.block?.name} / Room {selectedComplaint.room?.number}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Department:</Text>
              <Text style={styles.detailVal}>
                {selectedComplaint.department?.name || selectedComplaint.department?.shortName || "—"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Raised By:</Text>
              <Text style={styles.detailVal}>
                {selectedComplaint.raisedBy?.name} ({selectedComplaint.raisedBy?.email})
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned To:</Text>
              <Text style={styles.detailVal}>
                {selectedComplaint.assignedTo?.name ? `${selectedComplaint.assignedTo.name} (${selectedComplaint.assignedTo.role?.name || "Staff"})` : "Unassigned"}
              </Text>
            </View>

            <View style={{ marginTop: 6 }}>
              <Text style={styles.detailLabel}>Remarks:</Text>
              <Text style={[styles.detailVal, { marginTop: 4, lineHeight: 20 }]}>
                {selectedComplaint.remarks}
              </Text>
            </View>

            {selectedComplaint.note && (
              <View style={{ marginTop: 6, backgroundColor: COLORS.surface2, padding: 10, borderRadius: 8 }}>
                <Text style={[styles.detailLabel, { color: COLORS.accent }]}>Staff Resolution Note:</Text>
                <Text style={[styles.detailVal, { marginTop: 4 }]}>
                  {selectedComplaint.note}
                </Text>
              </View>
            )}

            <Btn
              onPress={() => setSelectedComplaint(null)}
              variant="outline"
              style={{ marginTop: 16 }}
            >
              Close
            </Btn>
          </View>
        </Modal>
      )}
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
  welcomeBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeGreeting: {
    fontSize: 12,
    color: COLORS.text2,
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  welcomeDept: {
    fontSize: 11,
    color: COLORS.text3,
    marginTop: 2,
  },
  welcomeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(99,210,190,0.1)",
    borderWidth: 1,
    borderColor: "rgba(99,210,190,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  actionBtn: {
    flex: 1,
    minWidth: 100,
  },
  actionBtnText: {
    fontWeight: "700",
    fontSize: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  statCol: {
    width: "48%",
  },
  recentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeAllText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  complaintCard: {
    marginBottom: 10,
    padding: 14,
  },
  complaintTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  ticketIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketIdText: {
    color: COLORS.accent,
    fontWeight: "800",
    fontSize: 13,
  },
  complaintType: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  complaintRemarks: {
    color: COLORS.text2,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  complaintFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    paddingTop: 8,
  },
  complaintLocation: {
    color: COLORS.text3,
    fontSize: 11,
  },
  complaintDate: {
    color: COLORS.text3,
    fontSize: 11,
  },
  emptyText: {
    color: COLORS.text3,
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 13,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailLabel: {
    color: COLORS.text3,
    fontSize: 12,
    fontWeight: "600",
  },
  detailVal: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
});

