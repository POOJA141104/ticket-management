import { useState } from "react";

// ─── SVG ICONS (all same accent color) ───────────────────────────────────────
export const Icon = ({ name, size = 18, color = "var(--accent)", style: s }) => {
  const paths = {
    dashboard:   <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    complaint:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    raise:       <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
    dept:        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    programme:   <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    block:       <><rect x="2" y="3" width="8" height="8" rx="1.5"/><rect x="14" y="3" width="8" height="8" rx="1.5"/><rect x="2" y="15" width="8" height="8" rx="1.5"/><rect x="14" y="15" width="8" height="8" rx="1.5"/></>,
    room:        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="14" width="6" height="8"/></>,
    role:        <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    report:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    logout:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    edit:        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    check:       <><polyline points="20 6 9 17 4 12"/></>,
    close:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    alert:       <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    ticket:      <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="9" y1="12" x2="15" y2="12"/></>,
    search:      <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter:      <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    assign:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></>,
    status:      <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    attach:      <><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></>,
    export:      <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, ...s }}>
      {paths[name]}
    </svg>
  );
};

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant="primary", size="md", disabled, type="button", style:extra }) => {
  const [hov, setHov] = useState(false);
  const sizes = {
    sm: { padding:"5px 14px", fontSize:12, gap:5 },
    md: { padding:"9px 20px", fontSize:13, gap:7 },
    lg: { padding:"13px 28px", fontSize:15, gap:8 },
  };
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    borderRadius:"var(--radius-sm)", fontWeight:600, fontFamily:"var(--font)",
    cursor: disabled?"not-allowed":"pointer", border:"none",
    transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
    opacity: disabled ? 0.45 : 1, letterSpacing:0.3,
    ...sizes[size],
  };
  const variants = {
    primary: {
      background: hov ? "linear-gradient(135deg,#7ae8d4,#3db8a2)" : "linear-gradient(135deg,#63d2be,#2da090)",
      color:"#071210",
      boxShadow: hov ? "0 0 20px rgba(99,210,190,0.4)" : "0 0 0 rgba(99,210,190,0)",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
    danger: {
      background: hov ? "rgba(248,113,113,0.25)" : "rgba(248,113,113,0.12)",
      color:"#f87171", border:"1px solid rgba(248,113,113,0.3)",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
    ghost: {
      background: hov ? "rgba(99,210,190,0.1)" : "transparent",
      color:"var(--accent)", border:"1px solid rgba(99,210,190,0.25)",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
    outline: {
      background: hov ? "rgba(255,255,255,0.05)" : "transparent",
      color:"var(--text2)", border:"1px solid var(--border)",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
    success: {
      background: hov ? "rgba(52,211,153,0.25)" : "rgba(52,211,153,0.12)",
      color:"#34d399", border:"1px solid rgba(52,211,153,0.3)",
      transform: hov ? "translateY(-1px)" : "translateY(0)",
    },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, ...variants[variant], ...extra }}>
      {children}
    </button>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, icon, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:7, fontFamily:"var(--font2)" }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}><Icon name={icon} size={15} /></div>}
        <input {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width:"100%", padding: icon ? "10px 14px 10px 38px" : "10px 14px",
            background: focused ? "rgba(99,210,190,0.05)" : "var(--surface2)",
            border: `1.5px solid ${error ? "var(--danger)" : focused ? "var(--accent)" : "var(--border)"}`,
            borderRadius:"var(--radius-sm)", fontSize:14, fontFamily:"var(--font)",
            color:"var(--text)", outline:"none", boxSizing:"border-box",
            transition:"all 0.2s", boxShadow: focused ? "0 0 0 3px rgba(99,210,190,0.08)" : "none",
          }} />
      </div>
      {error && <p style={{ color:"var(--danger)", fontSize:12, marginTop:4 }}>{error}</p>}
    </div>
  );
};

// ─── SELECT ───────────────────────────────────────────────────────────────────
export const Select = ({ label, error, children, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:7, fontFamily:"var(--font2)" }}>{label}</label>}
      <select {...props}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:"100%", padding:"10px 14px",
          background: focused ? "rgba(99,210,190,0.05)" : "var(--surface2)",
          border: `1.5px solid ${error ? "var(--danger)" : focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius:"var(--radius-sm)", fontSize:14, fontFamily:"var(--font)",
          color:"var(--text)", outline:"none", cursor:"pointer", boxSizing:"border-box",
          transition:"all 0.2s", boxShadow: focused ? "0 0 0 3px rgba(99,210,190,0.08)" : "none",
        }}>
        {children}
      </select>
      {error && <p style={{ color:"var(--danger)", fontSize:12, marginTop:4 }}>{error}</p>}
    </div>
  );
};

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────
export const Textarea = ({ label, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:7, fontFamily:"var(--font2)" }}>{label}</label>}
      <textarea {...props}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:"100%", padding:"10px 14px",
          background: focused ? "rgba(99,210,190,0.05)" : "var(--surface2)",
          border: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius:"var(--radius-sm)", fontSize:14, fontFamily:"var(--font)",
          color:"var(--text)", outline:"none", resize:"vertical", minHeight:90, boxSizing:"border-box",
          transition:"all 0.2s", boxShadow: focused ? "0 0 0 3px rgba(99,210,190,0.08)" : "none",
        }} />
      {error && <p style={{ color:"var(--danger)", fontSize:12, marginTop:4 }}>{error}</p>}
    </div>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Pending:       { bg:"rgba(251,191,36,0.12)",  color:"#fbbf24", dot:"#fbbf24" },
  Assigned:      { bg:"rgba(96,165,250,0.12)",  color:"#60a5fa", dot:"#60a5fa" },
  "In-Progress": { bg:"rgba(167,139,250,0.12)", color:"#a78bfa", dot:"#a78bfa" },
  "On-Hold":     { bg:"rgba(248,113,113,0.12)", color:"#f87171", dot:"#f87171" },
  Completed:     { bg:"rgba(52,211,153,0.12)",  color:"#34d399", dot:"#34d399" },
};
export const Badge = ({ status, children }) => {
  const s = STATUS_STYLES[status] || { bg:"rgba(139,168,162,0.12)", color:"var(--text2)", dot:"var(--text2)" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:s.bg, color:s.color, padding:"4px 10px", borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:0.5, fontFamily:"var(--font2)" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {children || status}
    </span>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style, hover=false }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background:"var(--surface)", borderRadius:"var(--radius)",
        padding:24, border:`1px solid ${hov ? "rgba(99,210,190,0.25)" : "var(--border)"}`,
        boxShadow: hov ? "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,210,190,0.1)" : "0 2px 12px rgba(0,0,0,0.2)",
        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        animation:"fadeUp 0.4s ease both",
        ...style
      }}>
      {children}
    </div>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children, width=520 }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(4,8,16,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(8px)", padding:20, animation:"fadeIn 0.2s ease" }}>
    <div style={{ background:"var(--surface)", borderRadius:20, padding:32, width:"100%", maxWidth:width, border:"1px solid var(--border)", boxShadow:"0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,210,190,0.05)", maxHeight:"90vh", overflowY:"auto", animation:"fadeUp 0.25s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>{title}</h2>
        <button onClick={onClose} style={{ border:"1px solid var(--border)", background:"var(--surface2)", borderRadius:8, width:32, height:32, cursor:"pointer", color:"var(--text2)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
          onMouseEnter={e => { e.target.style.borderColor="var(--accent)"; e.target.style.color="var(--accent)"; }}
          onMouseLeave={e => { e.target.style.borderColor="var(--border)"; e.target.style.color="var(--text2)"; }}>
          <Icon name="close" size={15} color="currentColor" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── TABLE ────────────────────────────────────────────────────────────────────
export const Table = ({ cols, children }) => (
  <div style={{ overflowX:"auto" }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
      <thead>
        <tr>
          {cols.map(c => (
            <th key={c} style={{ padding:"10px 16px", textAlign:"left", color:"var(--accent)", fontWeight:700, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", borderBottom:"1px solid var(--border)", fontFamily:"var(--font2)", whiteSpace:"nowrap" }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const TR = ({ children }) => {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom:"1px solid var(--border)", background: hov ? "rgba(99,210,190,0.03)" : "transparent", transition:"background 0.15s" }}>
      {children}
    </tr>
  );
};

export const TD = ({ children, style }) => (
  <td style={{ padding:"13px 16px", color:"var(--text2)", verticalAlign:"middle", ...style }}>{children}</td>
);

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action, icon }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32, animation:"fadeUp 0.35s ease" }}>
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      {icon && (
        <div style={{ width:48, height:48, borderRadius:14, background:"rgba(99,210,190,0.1)", border:"1px solid rgba(99,210,190,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name={icon} size={22} />
        </div>
      )}
      <div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:"var(--text)", fontFamily:"var(--font2)", letterSpacing:-0.3 }}>{title}</h1>
        {subtitle && <p style={{ margin:"4px 0 0", color:"var(--text2)", fontSize:13 }}>{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

// ─── SPINNER ──────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:80, gap:16 }}>
    <div style={{ width:40, height:40, border:"3px solid var(--border)", borderTop:"3px solid var(--accent)", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
    <span style={{ color:"var(--text3)", fontSize:13, fontFamily:"var(--font2)" }}>Loading…</span>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, color, icon, trend }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"var(--surface)", borderRadius:"var(--radius)", padding:"22px 24px", border:`1px solid ${hov ? color+"44" : "var(--border)"}`, display:"flex", alignItems:"center", gap:18, cursor:"default", transition:"all 0.25s", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}22` : "0 2px 8px rgba(0,0,0,0.2)", animation:"fadeUp 0.4s ease both" }}>
      <div style={{ width:52, height:52, borderRadius:14, background:color+"18", border:`1px solid ${color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.25s", transform: hov ? "scale(1.08)" : "scale(1)" }}>
        <Icon name={icon} size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize:30, fontWeight:900, color:"var(--text)", lineHeight:1, fontFamily:"var(--font2)" }}>{value}</div>
        <div style={{ fontSize:12, color:"var(--text2)", marginTop:4, fontWeight:500 }}>{label}</div>
      </div>
    </div>
  );
};

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0 4px", padding:"0 4px" }}>
    <div style={{ flex:1, height:1, background:"var(--border)" }} />
    {label && <span style={{ fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"var(--text3)", fontFamily:"var(--font2)", whiteSpace:"nowrap" }}>{label}</span>}
    <div style={{ flex:1, height:1, background:"var(--border)" }} />
  </div>
);