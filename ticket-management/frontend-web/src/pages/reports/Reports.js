import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Card, Table, TR, TD, Badge, Btn, Select, PageHeader, StatCard, Spinner, Icon } from "../../components/UI";

const TYPES    = ["PC Hardware","PC Software","Application Issues","Network","Electronics","Plumbing","Electrician","Other"];
const STATUSES = ["Pending","Assigned","In-Progress","On-Hold","Completed"];

export default function Reports() {
  const [depts,setDepts]=useState([]); const [progs,setProgs]=useState([]); const [staff,setStaff]=useState([]);
  const [loading,setLoading]=useState(false); const [results,setResults]=useState(null);
  const [filters,setFilters]=useState({department:"",programme:"",type:"",status:"",assignee:""});

  useEffect(()=>{
    api.get("/departments").then(r=>setDepts(r.data.data)).catch(()=>{});
    api.get("/programmes").then(r=>setProgs(r.data.data)).catch(()=>{});
    api.get("/users/staff").then(r=>setStaff(r.data.data)).catch(()=>{});
  },[]);

  const generate=async()=>{
    setLoading(true);
    try{const params=new URLSearchParams();Object.entries(filters).forEach(([k,v])=>{if(v)params.append(k,v);});const{data}=await api.get(`/reports/complaints?${params}`);setResults(data);}
    catch{alert("Failed to generate report");}finally{setLoading(false);}
  };

  const reset=()=>{setFilters({department:"",programme:"",type:"",status:"",assignee:""});setResults(null);};

  const exportCSV=()=>{
    if(!results)return;
    const rows=[["Ticket ID","Department","Type","Block","Room","Status","Raised By","Assigned To","Date"],...results.data.map(c=>[c.ticketId,c.department?.shortName||"",c.type,c.block?.name||"",c.room?.number||"",c.status,c.raisedBy?.name||"",c.assignedTo?.name||"Unassigned",c.createdAt?.slice(0,10)||""])];
    const csv=rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="complaint-report.csv";a.click();
  };

  return(
    <div>
      <PageHeader title="Complaint Report" subtitle="Generate filtered reports and export data" icon="report"/>

      <Card style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <Icon name="filter" size={16}/>
          <span style={{fontWeight:700,fontSize:14,color:"var(--text)",fontFamily:"var(--font2)"}}>Report Filters</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0 24px"}}>
          <Select label="Department" value={filters.department} onChange={e=>setFilters({...filters,department:e.target.value})}><option value="">All Departments</option>{depts.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}</Select>
          <Select label="Programme" value={filters.programme} onChange={e=>setFilters({...filters,programme:e.target.value})}><option value="">All Programmes</option>{progs.filter(p=>!filters.department||p.department?._id===filters.department).map(p=><option key={p._id} value={p._id}>{p.name}</option>)}</Select>
          <Select label="Complaint Type" value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value})}><option value="">All Types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</Select>
          <Select label="Status" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">All Statuses</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</Select>
          <Select label="Assignee" value={filters.assignee} onChange={e=>setFilters({...filters,assignee:e.target.value})}><option value="">All Assignees</option>{staff.map(s=><option key={s._id} value={s._id}>{s.name} ({s.role?.name})</option>)}</Select>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:8}}>
          <Btn variant="outline" onClick={reset}><Icon name="close" size={12} color="var(--text2)"/>Reset</Btn>
          <Btn onClick={generate} disabled={loading}><Icon name="report" size={14} color="#071210"/>{loading?"Generating…":"Generate Report"}</Btn>
        </div>
      </Card>

      {results&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:24}}>
            <StatCard label="Total"       value={results.summary?.total      ??0} color="var(--accent)"  icon="complaint"/>
            <StatCard label="Pending"     value={results.summary?.pending    ??0} color="var(--warn)"    icon="alert"/>
            <StatCard label="Assigned"    value={results.summary?.assigned   ??0} color="var(--info)"    icon="assign"/>
            <StatCard label="In-Progress" value={results.summary?.inProgress ??0} color="#a78bfa"        icon="status"/>
            <StatCard label="Completed"   value={results.summary?.completed  ??0} color="var(--success)" icon="check"/>
          </div>

          <Card style={{padding:0}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Icon name="complaint" size={16}/>
                <span style={{fontWeight:700,fontSize:14,color:"var(--text)",fontFamily:"var(--font2)"}}>{results.data.length} complaint{results.data.length!==1?"s":""} found</span>
              </div>
              <Btn variant="success" size="sm" onClick={exportCSV}><Icon name="export" size={13} color="var(--success)"/>Export CSV</Btn>
            </div>
            <Table cols={["Ticket","Dept","Type","Block/Room","Status","Raised By","Assigned To","Date"]}>
              {results.data.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:48,color:"var(--text3)"}}>No complaints match selected filters</td></tr>}
              {results.data.map(c=>(
                <TR key={c._id}>
                  <TD><span style={{fontFamily:"var(--font2)",fontWeight:700,color:"var(--accent)",fontSize:12}}>{c.ticketId}</span></TD>
                  <TD><span style={{background:"rgba(99,210,190,0.08)",color:"var(--accent)",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600}}>{c.department?.shortName}</span></TD>
                  <TD><span style={{fontSize:12,color:"var(--text)"}}>{c.type}</span></TD>
                  <TD><span style={{fontSize:11,color:"var(--text3)"}}>{c.block?.name} / {c.room?.number}</span></TD>
                  <TD><Badge status={c.status}/></TD>
                  <TD><span style={{fontSize:12}}>{c.raisedBy?.name}</span></TD>
                  <TD><span style={{fontSize:12}}>{c.assignedTo?.name||"—"}</span></TD>
                  <TD><span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font2)"}}>{c.createdAt?.slice(0,10)}</span></TD>
                </TR>
              ))}
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}