import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Card, Btn, Select, Textarea, PageHeader, Icon } from "../../components/UI";

const TYPES = ["PC Hardware","PC Software","Application Issues","Network","Electronics","Plumbing","Electrician","Other"];

const TYPE_ICONS = { "PC Hardware":"🖥️","PC Software":"💿","Application Issues":"📱","Network":"🌐","Electronics":"⚡","Plumbing":"🔧","Electrician":"💡","Other":"📋" };

export default function RaiseComplaint() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [file, setFile]     = useState(null);
  const [form, setForm]     = useState({ block:"", room:"", type:"", remarks:"" });
  const [step, setStep]     = useState(1);

  useEffect(() => { api.get("/blocks").then(r => setBlocks(r.data.data)).catch(() => {}); }, []);
  useEffect(() => {
    if (form.block) api.get(`/rooms?block=${form.block}`).then(r => setRooms(r.data.data)).catch(() => {});
    else setRooms([]);
  }, [form.block]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.block || !form.room || !form.type || !form.remarks) return alert("Please fill all required fields");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("attachment", file);
      const { data } = await api.post("/complaints", fd, { headers:{"Content-Type":"multipart/form-data"} });
      setSuccess(data.data.ticketId);
      setForm({ block:"", room:"", type:"", remarks:"" });
      setFile(null); setStep(1);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Raise Complaint" subtitle="Submit a new issue for resolution" icon="raise" />

      {success && (
        <div style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:12, padding:"16px 20px", marginBottom:24, display:"flex", alignItems:"center", gap:14, animation:"fadeUp 0.3s ease" }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"rgba(52,211,153,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="check" size={20} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontWeight:700, color:"var(--success)", fontFamily:"var(--font2)" }}>Complaint Submitted!</div>
            <div style={{ fontSize:13, color:"var(--text2)", marginTop:2 }}>Ticket ID: <strong style={{ color:"var(--accent)" }}>{success}</strong> — Track it in the Complaints screen</div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:24, alignItems:"start" }}>
        <Card>
          <form onSubmit={handleSubmit}>
            {/* Location */}
            <div style={{ marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:"rgba(99,210,190,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--accent)", fontFamily:"var(--font2)" }}>1</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>Location</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
                <Select label="Block Name *" value={form.block} onChange={e => setForm({...form, block:e.target.value, room:""})}>
                  <option value="">Select block</option>
                  {blocks.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </Select>
                <Select label="Room Number *" value={form.room} onChange={e => setForm({...form, room:e.target.value})}>
                  <option value="">Select room</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>{r.number}</option>)}
                </Select>
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:"rgba(99,210,190,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--accent)", fontFamily:"var(--font2)" }}>2</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>Complaint Type</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {TYPES.map(t => (
                  <button type="button" key={t} onClick={() => setForm({...form, type:t})}
                    style={{ padding:"12px 8px", borderRadius:10, border:`1.5px solid ${form.type===t ? "var(--accent)" : "var(--border)"}`, background: form.type===t ? "rgba(99,210,190,0.1)" : "var(--surface2)", cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.18s", textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:5 }}>{TYPE_ICONS[t]}</div>
                    <div style={{ fontSize:10, fontWeight:600, color: form.type===t ? "var(--accent)" : "var(--text2)", lineHeight:1.3 }}>{t}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:"rgba(99,210,190,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--accent)", fontFamily:"var(--font2)" }}>3</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>Details</span>
              </div>
              <Textarea label="Complaint Remarks *" value={form.remarks} onChange={e => setForm({...form, remarks:e.target.value})} placeholder="Describe the issue clearly — include what happened, since when, and any error messages…" />

              <div style={{ marginBottom:0 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8, fontFamily:"var(--font2)" }}>Attachment (optional)</label>
                <label style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", border:`1.5px dashed ${file ? "var(--accent)" : "var(--border)"}`, borderRadius:10, cursor:"pointer", background: file ? "rgba(99,210,190,0.04)" : "transparent", transition:"all 0.2s" }}>
                  <Icon name="attach" size={18} color={file ? "var(--accent)" : "var(--text3)"} />
                  <span style={{ fontSize:13, color: file ? "var(--accent)" : "var(--text3)" }}>
                    {file ? file.name : "Click to upload image or document"}
                  </span>
                  <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} style={{ display:"none" }} />
                </label>
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, borderTop:"1px solid var(--border)" }}>
              <div style={{ fontSize:12, color:"var(--text3)" }}>
                Filing as <span style={{ color:"var(--accent)", fontWeight:600 }}>{user?.name}</span> · {user?.department?.shortName}
              </div>
              <Btn type="submit" disabled={loading} size="lg">
                <Icon name="raise" size={16} color="#071210" />
                {loading ? "Submitting…" : "Submit Complaint"}
              </Btn>
            </div>
          </form>
        </Card>

        {/* Info sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14, fontFamily:"var(--font2)" }}>How it works</div>
            {[["Submit","You raise a complaint with location and details"],["Assign","Super Admin assigns it to the right staff"],["Resolve","Staff updates status until Completed"]].map(([t,d], i) => (
              <div key={t} style={{ display:"flex", gap:12, marginBottom:14 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:"rgba(99,210,190,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--accent)" }}>{i+1}</span>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>{t}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginTop:2, lineHeight:1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ padding:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14, fontFamily:"var(--font2)" }}>Complaint Types</div>
            {TYPES.map(t => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontSize:14 }}>{TYPE_ICONS[t]}</span>
                <span style={{ fontSize:12, color:"var(--text2)" }}>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}