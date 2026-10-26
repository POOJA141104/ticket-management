import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "./UI";

const MENU = [
  { to:"/dashboard",   label:"Dashboard",       icon:"dashboard", roles:"*" },
  { to:"/raise",       label:"Raise Complaint", icon:"raise",     roles:["SuperAdmin","User"] },
  { to:"/complaints",  label:"All Complaints",  icon:"complaint", roles:"*" },
  { sep:true, label:"MASTER DATA",              roles:["SuperAdmin"] },
  { to:"/departments", label:"Departments",     icon:"dept",      roles:["SuperAdmin"] },
  { to:"/programmes",  label:"Programmes",      icon:"programme", roles:["SuperAdmin"] },
  { to:"/blocks",      label:"Blocks",          icon:"block",     roles:["SuperAdmin"] },
  { to:"/rooms",       label:"Rooms",           icon:"room",      roles:["SuperAdmin"] },
  { to:"/roles",       label:"Roles",           icon:"role",      roles:["SuperAdmin"] },
  { to:"/users",       label:"Users",           icon:"users",     roles:["SuperAdmin"] },
  { sep:true, label:"ANALYTICS",                roles:["SuperAdmin"] },
  { to:"/reports",     label:"Reports",         icon:"report",    roles:["SuperAdmin"] },
];

function NavItem({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <NavLink to={item.to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={({ isActive }) => ({
        display:"flex", alignItems:"center", gap:11, padding:"9px 12px",
        borderRadius:10, textDecoration:"none", fontSize:13, fontWeight:isActive?600:400,
        fontFamily:"var(--font)",
        color: isActive ? "var(--accent)" : hov ? "var(--text)" : "var(--text2)",
        background: isActive ? "rgba(99,210,190,0.1)" : hov ? "rgba(255,255,255,0.04)" : "transparent",
        borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
        transition:"all 0.18s cubic-bezier(0.4,0,0.2,1)",
        marginBottom:2,
        transform: hov && !true ? "translateX(2px)" : "none",
      })}>
      {({ isActive }) => (
        <>
          <Icon name={item.icon} size={16} color={isActive ? "var(--accent)" : hov ? "var(--text)" : "var(--text3)"} />
          <span>{item.label}</span>
          {isActive && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:"var(--accent)" }} />}
        </>
      )}
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [logoutHov, setLogoutHov] = useState(false);

  const visible = MENU.filter(m =>
    m.roles === "*" || (Array.isArray(m.roles) && m.roles.includes(user?.role?.name))
  );

  const initial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width:240, background:"var(--bg2)", display:"flex", flexDirection:"column", flexShrink:0, borderRight:"1px solid var(--border)", position:"relative" }}>
        {/* Subtle top glow */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,var(--accent),transparent)", opacity:0.4 }} />

        {/* Logo */}
        <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, background:"linear-gradient(135deg,var(--accent),var(--accent2))", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(99,210,190,0.3)" }}>
              <Icon name="ticket" size={18} color="#071210" />
            </div>
            <div>
              <div style={{ color:"var(--text)", fontWeight:800, fontSize:15, letterSpacing:-0.3, fontFamily:"var(--font2)" }}>TicketPro</div>
              <div style={{ color:"var(--text3)", fontSize:10, letterSpacing:0.5 }}>v1.0 · Management</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex:1, overflowY:"auto", padding:"12px 10px" }}>
          {visible.map((item, i) => {
            if (item.sep) return (
              <div key={i} style={{ padding:"14px 12px 6px" }}>
                <span style={{ fontSize:9, fontWeight:800, letterSpacing:2, color:"var(--text3)", fontFamily:"var(--font2)" }}>{item.label}</span>
              </div>
            );
            return <NavItem key={item.to} item={item} />;
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding:"14px 10px 16px", borderTop:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:"var(--surface)", border:"1px solid var(--border)", marginBottom:8 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,var(--accent3),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", color:"#071210", fontWeight:800, fontSize:14, fontFamily:"var(--font2)", flexShrink:0 }}>
              {initial}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"var(--text)", fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</div>
              <div style={{ fontSize:10, color:"var(--accent)", fontWeight:500 }}>{user?.role?.name}</div>
            </div>
          </div>
          <button
            onClick={logout}
            onMouseEnter={() => setLogoutHov(true)}
            onMouseLeave={() => setLogoutHov(false)}
            style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"8px 12px", borderRadius:9, background: logoutHov ? "rgba(248,113,113,0.1)" : "transparent", color: logoutHov ? "var(--danger)" : "var(--text3)", border: `1px solid ${logoutHov ? "rgba(248,113,113,0.2)" : "transparent"}`, cursor:"pointer", fontSize:12, fontWeight:500, fontFamily:"var(--font)", transition:"all 0.18s" }}>
            <Icon name="logout" size={14} color={logoutHov ? "var(--danger)" : "var(--text3)"} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflowY:"auto", padding:"32px 40px", background:"var(--bg)" }}>
        {/* Top mesh background */}
        <div style={{ position:"fixed", top:0, right:0, width:600, height:400, background:"radial-gradient(ellipse at 80% 0%,rgba(99,210,190,0.04) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}