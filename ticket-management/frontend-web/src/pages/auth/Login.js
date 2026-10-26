import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../components/UI";

export default function Login() {
  const [form, setForm] = useState({ username:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await login(form.username, form.password);
    if (result.success) navigate("/dashboard");
    else setError(result.message);
    setLoading(false);
  };

  const features = [
    { icon:"complaint", text:"Hardware & Software Complaint Tracking" },
    { icon:"assign",    text:"Role-Based Access & Assignment" },
    { icon:"status",    text:"Real-Time Status Updates" },
    { icon:"report",    text:"Detailed Analytics & Reports" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", fontFamily:"var(--font)", overflow:"hidden" }}>
      {/* Left decorative panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"64px 72px", position:"relative", overflow:"hidden" }}>
        {/* Background effects */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 50%,rgba(99,210,190,0.08) 0%,transparent 60%)" }} />
        <div style={{ position:"absolute", top:"10%", left:"5%", width:300, height:300, borderRadius:"50%", border:"1px solid rgba(99,210,190,0.06)", animation:"spin 25s linear infinite" }} />
        <div style={{ position:"absolute", top:"15%", left:"10%", width:200, height:200, borderRadius:"50%", border:"1px solid rgba(99,210,190,0.1)" }} />
        <div style={{ position:"absolute", bottom:"20%", right:"10%", width:150, height:150, borderRadius:"50%", background:"rgba(99,210,190,0.03)" }} />

        <div style={{ position:"relative", maxWidth:480 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
            <div style={{ width:52, height:52, background:"linear-gradient(135deg,var(--accent),var(--accent2))", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 32px rgba(99,210,190,0.35)" }}>
              <Icon name="ticket" size={26} color="#071210" />
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:"var(--text)", fontFamily:"var(--font2)", letterSpacing:-0.5 }}>TicketPro</div>
              <div style={{ fontSize:11, color:"var(--accent)", letterSpacing:2, fontWeight:600, textTransform:"uppercase" }}>Management System</div>
            </div>
          </div>

          <h1 style={{ fontSize:42, fontWeight:900, color:"var(--text)", lineHeight:1.1, margin:"0 0 16px", fontFamily:"var(--font2)", letterSpacing:-1 }}>
            Resolve Issues.<br />
            <span style={{ background:"linear-gradient(135deg,var(--accent),#7ae8d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Faster.
            </span>
          </h1>
          <p style={{ fontSize:15, color:"var(--text2)", lineHeight:1.7, margin:"0 0 48px", maxWidth:380 }}>
            A centralized platform for institutional complaint management with full role-based access control.
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {features.map(f => (
              <div key={f.text} style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(99,210,190,0.08)", border:"1px solid rgba(99,210,190,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={f.icon} size={16} />
                </div>
                <span style={{ fontSize:14, color:"var(--text2)", fontWeight:400 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ width:460, background:"var(--surface)", borderLeft:"1px solid var(--border)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"64px 48px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,var(--accent),transparent)", opacity:0.5 }} />

        <div style={{ marginBottom:36 }}>
          <h2 style={{ margin:"0 0 6px", fontSize:26, fontWeight:800, color:"var(--text)", fontFamily:"var(--font2)", letterSpacing:-0.5 }}>Welcome back</h2>
          <p style={{ margin:0, color:"var(--text2)", fontSize:14 }}>Sign in to your account to continue</p>
        </div>

        {error && (
          <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10, padding:"12px 16px", marginBottom:24, color:"var(--danger)", fontSize:13, display:"flex", gap:10, alignItems:"center", animation:"fadeUp 0.2s ease" }}>
            <Icon name="alert" size={15} color="var(--danger)" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8, fontFamily:"var(--font2)" }}>Username</label>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}>
                <Icon name="users" size={15} />
              </div>
              <input value={form.username} onChange={e => setForm({...form, username:e.target.value})} placeholder="Enter your username" required
                style={{ width:"100%", padding:"11px 14px 11px 40px", background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:10, fontSize:14, fontFamily:"var(--font)", color:"var(--text)", outline:"none", boxSizing:"border-box", transition:"all 0.2s" }}
                onFocus={e => { e.target.style.borderColor="var(--accent)"; e.target.style.boxShadow="0 0 0 3px rgba(99,210,190,0.08)"; }}
                onBlur={e => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:28 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8, fontFamily:"var(--font2)" }}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="••••••••••" required
                style={{ width:"100%", padding:"11px 44px 11px 14px", background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:10, fontSize:14, fontFamily:"var(--font)", color:"var(--text)", outline:"none", boxSizing:"border-box", transition:"all 0.2s" }}
                onFocus={e => { e.target.style.borderColor="var(--accent)"; e.target.style.boxShadow="0 0 0 3px rgba(99,210,190,0.08)"; }}
                onBlur={e => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", border:"none", background:"none", cursor:"pointer", color:"var(--text3)", fontSize:12, fontFamily:"var(--font)" }}>
                {showPass ? "hide" : "show"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"13px", background: loading ? "var(--accent3)" : "linear-gradient(135deg,var(--accent),var(--accent2))", color:"#071210", border:"none", borderRadius:11, fontWeight:800, fontSize:15, cursor: loading ? "not-allowed" : "pointer", fontFamily:"var(--font)", letterSpacing:0.3, transition:"all 0.2s", boxShadow: loading ? "none" : "0 0 24px rgba(99,210,190,0.3)" }}>
            {loading ? "Authenticating…" : "Sign In →"}
          </button>
        </form>

        <div style={{ marginTop:28, padding:"14px 16px", background:"var(--surface2)", borderRadius:10, border:"1px solid var(--border)", fontSize:12 }}>
          <div style={{ color:"var(--accent)", fontWeight:700, marginBottom:6, fontFamily:"var(--font2)", letterSpacing:0.5 }}>DEFAULT CREDENTIALS</div>
          <div style={{ color:"var(--text2)" }}>Username: <span style={{ color:"var(--text)", fontWeight:600 }}>superadmin</span></div>
          <div style={{ color:"var(--text2)" }}>Password: <span style={{ color:"var(--text)", fontWeight:600 }}>admin123</span></div>
        </div>
      </div>
    </div>
  );
}