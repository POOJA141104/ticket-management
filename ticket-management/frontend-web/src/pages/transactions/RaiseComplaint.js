import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Card, Btn, PageHeader, Input, Select, Textarea, Spinner } from "../../components/UI";

const TYPES = ["PC Hardware","PC Software","Application Issues","Network","Electronics","Plumbing","Electrician","Other"];

export default function RaiseComplaint() {
  const { user } = useAuth();
  const [blocks, setBlocks]   = useState([]);
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile]       = useState(null);
  const [form, setForm] = useState({ block:"", room:"", type:"", remarks:"" });

  useEffect(() => { api.get("/blocks").then(r => setBlocks(r.data.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (form.block) api.get(`/rooms?block=${form.block}`).then(r => setRooms(r.data.data)).catch(() => {});
    else setRooms([]);
  }, [form.block]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.block || !form.room || !form.type || !form.remarks)
      return toast.error("Please fill all required fields");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("attachment", file);

      const { data } = await api.post("/complaints", fd, { headers: { "Content-Type":"multipart/form-data" } });
      toast.success(`Complaint raised! Ticket: ${data.data.ticketId}`);
      setForm({ block:"", room:"", type:"", remarks:"" });
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise complaint");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Raise Complaint" subtitle="Submit a new issue or complaint" />
      <div style={{ maxWidth:700 }}>
        <Card>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
              <Select label="Block Name *" value={form.block} onChange={e => setForm({...form, block:e.target.value, room:""})}>
                <option value="">Select Block</option>
                {blocks.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </Select>
              <Select label="Room Number *" value={form.room} onChange={e => setForm({...form, room:e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(r => <option key={r._id} value={r._id}>{r.number}</option>)}
              </Select>
              <div style={{ gridColumn:"1/-1" }}>
                <Select label="Complaint Type *" value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                  <option value="">Select Type</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <Textarea label="Complaint Remarks *" value={form.remarks} onChange={e => setForm({...form, remarks:e.target.value})} placeholder="Describe the issue in detail..." />
              </div>
              <div style={{ gridColumn:"1/-1", marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Attachment (optional)</label>
                <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])}
                  style={{ width:"100%", padding:"10px 14px", border:"2px dashed #e2e8f0", borderRadius:10, fontSize:13, cursor:"pointer" }} />
                {file && <p style={{ margin:"4px 0 0", fontSize:12, color:"#6366f1" }}>Selected: {file.name}</p>}
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
              <div style={{ fontSize:13, color:"#64748b" }}>
                Filed by: <strong>{user?.name}</strong> · {user?.role?.name} · {user?.department?.shortName}
              </div>
              <Btn type="submit" disabled={loading}>{loading ? "Submitting…" : "Submit Complaint"}</Btn>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
