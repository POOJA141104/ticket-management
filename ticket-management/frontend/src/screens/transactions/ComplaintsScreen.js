import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  PageHeader,
  Card,
  Badge,
  Btn,
  Icon,
  Select,
  Input,
  Modal,
  Spinner,
} from "../../components/UI";
import { COLORS } from "../../theme/colors";

const STATUSES = ["All", "Pending", "Assigned", "In-Progress", "On-Hold", "Completed"];
const TYPES = [
  "All",
  "PC Hardware",
  "PC Software",
  "Application Issues",
  "Network",
  "Electronics",
  "Plumbing",
  "Electrician",
  "Other",
];
const STAFF_STATUSES = ["In-Progress", "On-Hold", "Completed"];

export default function ComplaintsScreen({ navigation }) {
  const { user, isSuperAdmin, isStaff, canRaise } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Modals
  const [viewComplaint, setViewComplaint] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [assignTo, setAssignTo] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState("In-Progress");
  const [note, setNote] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const loadComplaints = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (typeFilter !== "All") params.append("type", typeFilter);

      const { data } = await api.get(`/complaints?${params.toString()}`);
      setComplaints(data.data || []);
    } catch (err) {
      console.error("Error loading complaints:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useEffect(() => {
    if (isSuperAdmin()) {
      api
        .get("/users/staff")
        .then((r) => setStaffList(r.data.data || []))
        .catch(() => {});
    }
  }, [isSuperAdmin]);

  const onRefresh = () => {
    setRefreshing(true);
    loadComplaints();
  };

  const handleAssign = async () => {
    if (!assignTo) {
      Alert.alert("Selection Required", "Please select a staff member to assign.");
      return;
    }
    setAssignLoading(true);
    try {
      await api.put(`/complaints/${assignModal._id}/assign`, {
        assignedTo: assignTo,
      });
      Alert.alert("Assigned", "Ticket has been successfully assigned.");
      setAssignModal(null);
      setAssignTo("");
      loadComplaints();
    } catch (err) {
      Alert.alert("Assignment Failed", err.response?.data?.message || err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setStatusLoading(true);
    try {
      await api.put(`/complaints/${statusModal._id}/status`, {
        status: newStatus,
        note,
      });
      Alert.alert("Status Updated", `Ticket marked as ${newStatus}`);
      setStatusModal(null);
      setNote("");
      loadComplaints();
    } catch (err) {
      Alert.alert("Update Failed", err.response?.data?.message || err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const staffOptions = staffList.map((s) => ({
    label: `${s.name} (${s.role?.name || "Staff"})`,
    value: s._id,
  }));

  const staffStatusOptions = STAFF_STATUSES.map((st) => ({
    label: st,
    value: st,
  }));

  if (loading) return <Spinner message="Loading tickets…" />;

  return (
    <View style={styles.container}>
      {/* Filters Bar */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusChipsContainer}
        >
          {STATUSES.map((st) => {
            const active = statusFilter === st;
            return (
              <TouchableOpacity
                key={st}
                onPress={() => setStatusFilter(st)}
                style={[styles.statusChip, active && styles.statusChipActive]}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    active && styles.statusChipTextActive,
                  ]}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
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
        <PageHeader
          title="Complaints"
          subtitle={
            isSuperAdmin()
              ? "All institutional tickets & assignments"
              : isStaff()
              ? "Your assigned tasks & updates"
              : "Your registered complaints"
          }
          icon="complaint"
          action={
            canRaise() ? (
              <Btn
                onPress={() => navigation.navigate("Raise")}
                size="sm"
              >
                <Icon name="raise" size={14} color="#071210" />
                <Text style={{ fontWeight: "700", fontSize: 12, color: "#071210" }}>
                  Raise
                </Text>
              </Btn>
            ) : null
          }
        />

        {complaints.length === 0 ? (
          <Card>
            <View style={{ alignItems: "center", paddingVertical: 32, gap: 8 }}>
              <Icon name="ticket" size={32} color={COLORS.text3} />
              <Text style={{ color: COLORS.text2, fontWeight: "600" }}>
                No tickets matching criteria
              </Text>
              <Text style={{ color: COLORS.text3, fontSize: 12 }}>
                Try changing your filters or raise a new ticket.
              </Text>
            </View>
          </Card>
        ) : (
          complaints.map((c) => (
            <Card key={c._id} style={styles.ticketCard}>
              <View style={styles.ticketTopRow}>
                <View style={styles.ticketBadgeBox}>
                  <Icon name="ticket" size={14} color={COLORS.accent} />
                  <Text style={styles.ticketId}>{c.ticketId}</Text>
                </View>
                <Badge status={c.status} />
              </View>

              <Text style={styles.ticketType}>{c.type}</Text>
              <Text style={styles.ticketRemarks}>{c.remarks}</Text>

              {/* Location & Metadata */}
              <View style={styles.ticketMetaRow}>
                <Text style={styles.metaText}>
                  📍 {c.block?.name || "Block"} · Rm {c.room?.number || "—"}
                </Text>
                <Text style={styles.metaText}>
                  🗓️ {c.createdAt ? c.createdAt.slice(0, 10) : ""}
                </Text>
              </View>

              {/* Assigned To pill */}
              <View style={styles.assigneeRow}>
                <Text style={styles.assigneeLabel}>Assigned to:</Text>
                <Text style={styles.assigneeValue}>
                  {c.assignedTo?.name
                    ? `${c.assignedTo.name} (${c.assignedTo.role?.name || "Staff"})`
                    : "⚠️ Unassigned"}
                </Text>
              </View>

              {/* Action buttons */}
              <View style={styles.ticketActionsRow}>
                <Btn
                  variant="outline"
                  size="sm"
                  onPress={() => setViewComplaint(c)}
                  style={{ flex: 1 }}
                >
                  Details
                </Btn>

                {isSuperAdmin() && (
                  <Btn
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setAssignModal(c);
                      setAssignTo(c.assignedTo?._id || "");
                    }}
                    style={{ flex: 1 }}
                  >
                    <Icon name="assign" size={13} color={COLORS.accent} />
                    <Text style={{ color: COLORS.accent, fontWeight: "700", fontSize: 12 }}>
                      Assign
                    </Text>
                  </Btn>
                )}

                {isStaff() && (
                  <Btn
                    variant="success"
                    size="sm"
                    onPress={() => {
                      setStatusModal(c);
                      setNewStatus(c.status === "Pending" || c.status === "Assigned" ? "In-Progress" : c.status);
                      setNote(c.note || "");
                    }}
                    style={{ flex: 1 }}
                  >
                    <Icon name="status" size={13} color={COLORS.success} />
                    <Text style={{ color: COLORS.success, fontWeight: "700", fontSize: 12 }}>
                      Status
                    </Text>
                  </Btn>
                )}
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* View Complaint Details Modal */}
      {viewComplaint && (
        <Modal
          title={`Ticket ${viewComplaint.ticketId}`}
          onClose={() => setViewComplaint(null)}
        >
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.modalMetaLabel}>Status:</Text>
              <Badge status={viewComplaint.status} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.modalMetaLabel}>Type:</Text>
              <Text style={styles.modalMetaValue}>{viewComplaint.type}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.modalMetaLabel}>Location:</Text>
              <Text style={styles.modalMetaValue}>
                {viewComplaint.block?.name} · Room {viewComplaint.room?.number}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.modalMetaLabel}>Raised By:</Text>
              <Text style={styles.modalMetaValue}>
                {viewComplaint.raisedBy?.name || "Student / User"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.modalMetaLabel}>Assigned Staff:</Text>
              <Text style={styles.modalMetaValue}>
                {viewComplaint.assignedTo?.name
                  ? `${viewComplaint.assignedTo.name} (${viewComplaint.assignedTo.role?.name || "Staff"})`
                  : "Not assigned yet"}
              </Text>
            </View>

            <View style={{ marginTop: 4 }}>
              <Text style={styles.modalMetaLabel}>Issue Remarks:</Text>
              <Text style={[styles.modalMetaValue, { marginTop: 4, lineHeight: 18 }]}>
                {viewComplaint.remarks}
              </Text>
            </View>

            {viewComplaint.note && (
              <View style={{ backgroundColor: COLORS.surface2, padding: 10, borderRadius: 8 }}>
                <Text style={[styles.modalMetaLabel, { color: COLORS.accent }]}>
                  Staff Resolution Note:
                </Text>
                <Text style={[styles.modalMetaValue, { marginTop: 4 }]}>
                  {viewComplaint.note}
                </Text>
              </View>
            )}

            <Btn
              onPress={() => setViewComplaint(null)}
              variant="outline"
              style={{ marginTop: 14 }}
            >
              Close
            </Btn>
          </View>
        </Modal>
      )}

      {/* Assign Ticket Modal (SuperAdmin only) */}
      {assignModal && (
        <Modal
          title={`Assign Ticket ${assignModal.ticketId}`}
          onClose={() => setAssignModal(null)}
        >
          <View style={{ gap: 14 }}>
            <Text style={{ fontSize: 13, color: COLORS.text2 }}>
              Select a specialized staff technician for this {assignModal.type} issue.
            </Text>

            <Select
              label="Staff Member *"
              placeholder="Select technician"
              options={staffOptions}
              value={assignTo}
              onValueChange={setAssignTo}
            />

            <View style={{ flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
              <Btn
                variant="ghost"
                onPress={() => setAssignModal(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </Btn>
              <Btn
                onPress={handleAssign}
                loading={assignLoading}
                style={{ flex: 1 }}
              >
                Assign
              </Btn>
            </View>
          </View>
        </Modal>
      )}

      {/* Update Status Modal (Staff only) */}
      {statusModal && (
        <Modal
          title={`Update Status — ${statusModal.ticketId}`}
          onClose={() => setStatusModal(null)}
        >
          <View style={{ gap: 14 }}>
            <Select
              label="Ticket Status *"
              options={staffStatusOptions}
              value={newStatus}
              onValueChange={setNewStatus}
            />

            <Input
              label="Resolution Note"
              placeholder="e.g. Replaced RAM stick, internet port tested working"
              value={note}
              onChangeText={setNote}
            />

            <View style={{ flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
              <Btn
                variant="ghost"
                onPress={() => setStatusModal(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </Btn>
              <Btn
                onPress={handleStatusUpdate}
                loading={statusLoading}
                style={{ flex: 1 }}
              >
                Save
              </Btn>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  filtersSection: {
    backgroundColor: COLORS.bg2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 10,
  },
  statusChipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusChipActive: {
    backgroundColor: "rgba(99,210,190,0.15)",
    borderColor: COLORS.accent,
  },
  statusChipText: {
    color: COLORS.text2,
    fontSize: 12,
    fontWeight: "600",
  },
  statusChipTextActive: {
    color: COLORS.accent,
    fontWeight: "800",
  },
  content: {
    padding: 16,
    paddingBottom: 70,
  },
  ticketCard: {
    marginBottom: 12,
    padding: 16,
  },
  ticketTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketBadgeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketId: {
    color: COLORS.accent,
    fontWeight: "800",
    fontSize: 13,
  },
  ticketType: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  ticketRemarks: {
    color: COLORS.text2,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  ticketMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    paddingTop: 8,
    marginBottom: 8,
  },
  metaText: {
    color: COLORS.text3,
    fontSize: 11,
  },
  assigneeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  assigneeLabel: {
    color: COLORS.text3,
    fontSize: 11,
  },
  assigneeValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "600",
  },
  ticketActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  modalMetaLabel: {
    color: COLORS.text3,
    fontSize: 12,
    fontWeight: "600",
  },
  modalMetaValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
});

