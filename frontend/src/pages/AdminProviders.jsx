import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { getAdminProviderApplications, reviewAdminProviderApplication } from "../api/admin";
import "../styles/admin-dashboard.css";

function Applications({ type }) {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[busy,setBusy]=useState(""),[selected,setSelected]=useState(null);
  const load=()=>{setLoading(true);setError("");getAdminProviderApplications().then(r=>setItems(r.data||[])).catch(e=>setError(e.message)).finally(()=>setLoading(false));};
  useEffect(load,[]);
  const review=async(id,decision)=>{setBusy(id+decision);try{await reviewAdminProviderApplication(id,decision);setItems(v=>v.filter(x=>String(x.id)!==String(id)));}catch(e){setError(e.message)}finally{setBusy("")}};
  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") return "Not provided";
    if (typeof value === "object" && value.url) return <a href={value.url} target="_blank" rel="noreferrer"><img src={value.url} alt="Submitted" style={{width:90,height:70,objectFit:"cover",borderRadius:8}} /></a>;
    if (Array.isArray(value)) {
      if (value.some((item) => item && typeof item === "object" && item.url)) {
        return <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{value.map((item,index) => item?.url ? <a href={item.url} target="_blank" rel="noreferrer" key={index}><img src={item.url} alt={`Submitted ${index+1}`} style={{width:90,height:70,objectFit:"cover",borderRadius:8}} /></a> : <span key={index}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</span>)}</div>;
      }
      return value.map((item) => typeof item === "object" ? JSON.stringify(item) : String(item)).join(", ");
    }
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };
  return <AdminShell><div className="admin-page"><div className="admin-heading"><div><p>Provider management</p><h1>Provider approvals</h1><span>Review provider applications before they become active on Matchet.</span></div></div>{error&&<section className="admin-card admin-error"><p>{error}</p><button onClick={load}>Try again</button></section>}{loading?<div className="admin-card admin-loading-block large"/>:!items.length?<section className="admin-card admin-empty"><strong>No provider applications awaiting review</strong><p>New provider submissions will appear here.</p></section>:<section className="admin-card">{items.map(a=><div key={a.id}><div className="admin-application-row" style={{cursor:"pointer"}} onClick={()=>setSelected(selected===String(a.id)?null:String(a.id))}><div className="admin-application-avatar">{a.provider?.name?.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</div><div className="admin-application-info"><strong>{a.businessName}</strong><span>{a.provider?.name} · {a.provider?.email}</span><span>{(a.categories||[]).join(", ")}</span></div><div className="admin-application-meta"><strong>{new Date(a.submittedAt).toLocaleDateString("en-NG")}</strong><span>{a.provider?.phone||"No phone"}</span></div><div style={{display:"flex",gap:6}}><button className="admin-action-button approve" disabled={busy} onClick={(e)=>{e.stopPropagation();review(a.id,"approve")}}>{busy===a.id+"approve"?"...":"Approve"}</button><button className="admin-action-button reject" disabled={busy} onClick={(e)=>{e.stopPropagation();review(a.id,"reject")}}>{busy===a.id+"reject"?"...":"Reject"}</button></div></div>{selected===String(a.id)&&<div className="admin-card" style={{margin:"0 0 12px",background:"#fafbfe"}}><h3>Complete submitted application</h3><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>{Object.entries(a.onboardingData||{}).map(([key,value])=><div key={key} style={{padding:10,border:"1px solid #e2e6f0",borderRadius:8,background:"#fff"}}><small style={{display:"block",color:"#687099",marginBottom:5}}>{key}</small><div style={{wordBreak:"break-word"}}>{renderValue(value)}</div></div>)}</div></div>}</div>)}</section>}</div></AdminShell>;
}
export default Applications;