import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Card, Table, TR, TD, Badge, Btn, Modal, Select, PageHeader, Spinner } from "../../components/UI";

const STATUSES = ["Pending","Assigned","In-Progress","On-Hold","Completed"];
const TYPES    = ["PC Hardware","PC Software","Application Issues","Network","Electronics","Plumbing","Electrician","Other"];
const STAFF_STATUSES = ["In-Progress","On-Hold","Completed"];

export default function Complaints() {
  const { user, isSuperAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState({ status:"", type:"" });
  const [viewModal, setViewModal]   = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [assignTo, setAssignTo]     = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus]   = useState("");
  const [note, setNote]             = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.type)   params.append("type",   filter.type);
      const { data } = await api.get(`/complaints?${params}`);
      setComplaints(data.data);
    } catch (e) { toast.error("Failed to load complaints"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    if (isSuperAdmin()) api.get("/users/staff").then(r => setStaffList(r.data.data)).catch(() => {});
  }, []);

  const handleAssign = async () => {
    if (!assignTo) return toast.error("Please select a staff member");
    try {
      await api.put(`/complaints/${assignModal._id}/assign`, { assignedTo: assignTo });
      toast.success("Complaint assigned successfully");
      setAssignModal(null); setAssignTo(""); load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to assign"); }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return toast.error("Please select a status");
    try {
      await api.put(`/complaints/${statusModal._id}/status`, { status: newStatus, note });
      toast.success("Status updated");
      setStatusModal(null); setNewStatus(""); setNote(""); load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to update status"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Complaints" subtitle={`${complaints.length} complaints found`} />

      {/* Filters */}
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:20, alignItems:"flex-end", flexWrap:"wrap" }}>
          <div style={{ minWidth:160 }}>
            <Select label="Filter by Status" value={filter.status} onChange={e => setFilter({...filter, status:e.target.value})}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div style={{ minWidth:180 }}>
            <Select label="Filter by Type" value={filter.type} onChange={e => setFilter({...filter, type:e.target.value})}>
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </div>
          <Btn variant="outline" onClick={() => setFilter({ status:"", type:"" })} style={{ marginBottom:16 }}>Clear</Btn>
        </div>
      </Card>

      <Card>
        <Table cols={["Ticket #","Type","Location","Status","Raised By","Assigned To","Date","Actions"]}>
          {complaints.length === 0 && (
            <tr><td colSpan={8} style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>No complaints found</td></tr>
          )}
          {complaints.map(c => (
            <TR key={c._id}>
              <TD><strong style={{ color:"#6366f1" }}>{c.ticketId}</strong></TD>
              <TD>{c.type}</TD>
              <TD><span style={{ fontSize:12 }}>{c.block?.name} / {c.room?.number}</span></TD>
              <TD><Badge status={c.status} /></TD>
              <TD style={{ fontSize:13 }}>{c.raisedBy?.name}</TD>
              <TD style={{ fontSize:13 }}>{c.assignedTo?.name || <span style={{ color:"#94a3b8" }}>Unassigned</span>}</TD>
              <TD style={{ fontSize:12 }}>{c.createdAt?.slice(0,10)}</TD>
              <TD>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn size="sm" variant="outline" onClick={() => setViewModal(c)}>View</Btn>
                  {isSuperAdmin() && c.status !== "Completed" && (
                    <Btn size="sm" onClick={() => { setAssignModal(c); setAssignTo(c.assignedTo?._id || ""); }}>Assign</Btn>
                  )}
                  {isStaff() && c.assignedTo?._id === user._id && c.status !== "Completed" && (
                    <Btn size="sm" variant="success" onClick={() => { setStatusModal(c); setNewStatus(""); }}>Update</Btn>
                  )}
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>

      {/* View Modal */}
      {viewModal && (
        <Modal title={`Complaint — ${viewModal.ticketId}`} onClose={() => setViewModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[["Type",viewModal.type],["Block",viewModal.block?.name],["Room",viewModal.room?.number],["Department",viewModal.department?.shortName],["Raised By",viewModal.raisedBy?.name],["Date",viewModal.createdAt?.slice(0,10)]].map(([k,v]) => (
              <div key={k} style={{ background:"#f8fafc", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:"#64748b", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase" }}>{k}</div>
                <div style={{ marginTop:4, fontWeight:700, color:"#0f172a", fontSize:14 }}>{v}</div>
              </div>
            ))}
            <div style={{ gridColumn:"1/-1", background:"#f8fafc", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Remarks</div>
              <p style={{ margin:0, color:"#334155", lineHeight:1.6 }}>{viewModal.remarks}</p>
            </div>
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Status</div>
              <Badge status={viewModal.status} />
            </div>
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Assigned To</div>
              <div style={{ fontWeight:700, color:"#0f172a" }}>{viewModal.assignedTo?.name || "Unassigned"}</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}><Btn onClick={() => setViewModal(null)}>Close</Btn></div>
        </Modal>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <Modal title={`Assign — ${assignModal.ticketId}`} onClose={() => setAssignModal(null)}>
          <Select label="Assign To Staff" value={assignTo} onChange={e => setAssignTo(e.target.value)}>
            <option value="">Select staff member</option>
            {staffList.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role?.name})</option>)}
          </Select>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setAssignModal(null)}>Cancel</Btn>
            <Btn onClick={handleAssign}>Assign</Btn>
          </div>
        </Modal>
      )}

      {/* Status Modal */}
      {statusModal && (
        <Modal title={`Update Status — ${statusModal.ticketId}`} onClose={() => setStatusModal(null)}>
          <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            <option value="">Select status</option>
            {STAFF_STATUSES.map(s => <option key={s}>{s}</option>)}
          </Select>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:14, fontFamily:"inherit", resize:"vertical", minHeight:70, boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setStatusModal(null)}>Cancel</Btn>
            <Btn variant="success" onClick={handleStatusUpdate}>Update Status</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
