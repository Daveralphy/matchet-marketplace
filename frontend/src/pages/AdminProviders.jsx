import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { getAdminProviderApplications, reviewAdminProviderApplication } from "../api/admin";
import "../styles/admin-dashboard.css";

function Applications({ type }) {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[busy,setBusy]=useState("");
  const load=()=>{setLoading(true);setError("");getAdminProviderApplications().then(r=>setItems(r.data||[])).catch(e=>setError(e.message)).finally(()=>setLoading(false));};
  useEffect(load,[]);
  const review=async(id,decision)=>{setBusy(id+decision);try{await reviewAdminProviderApplication(id,decision);setItems(v=>v.filter(x=>String(x.id)!==String(id)));}catch(e){setError(e.message)}finally{setBusy("")}};
  return <AdminShell><div className="admin-page"><div className="admin-heading"><div><p>Provider management</p><h1>Provider approvals</h1><span>Review provider applications before they become active on Matchet.</span></div></div>{error&&<section className="admin-card admin-error"><p>{error}</p><button onClick={load}>Try again</button></section>}{loading?<div className="admin-card admin-loading-block large"/>:!items.length?<section className="admin-card admin-empty"><strong>No provider applications awaiting review</strong><p>New provider submissions will appear here.</p></section>:<section className="admin-card">{items.map(a=><div className="admin-application-row" key={a.id}><div className="admin-application-avatar">{a.provider?.name?.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</div><div className="admin-application-info"><strong>{a.businessName}</strong><span>{a.provider?.name} · {a.provider?.email}</span><span>{(a.categories||[]).join(", ")}</span></div><div className="admin-application-meta"><strong>{new Date(a.submittedAt).toLocaleDateString("en-NG")}</strong><span>{a.provider?.phone||"No phone"}</span></div><div style={{display:"flex",gap:6}}><button className="admin-action-button approve" disabled={busy} onClick={()=>review(a.id,"approve")}>{busy===a.id+"approve"?"...":"Approve"}</button><button className="admin-action-button reject" disabled={busy} onClick={()=>review(a.id,"reject")}>{busy===a.id+"reject"?"...":"Reject"}</button></div></div>)}</section>}</div></AdminShell>;
}
export default Applications;