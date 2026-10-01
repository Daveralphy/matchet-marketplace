import {useEffect,useState} from "react";
import {ProviderShell,Icon} from "../components/ProviderShell";
import {getSellerEarnings} from "../api/provider";
import "../styles/seller-earnings.css";
const money=v=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(v||0));
export default function SellerEarnings(){
 const [data,setData]=useState(null),[error,setError]=useState("");
 useEffect(()=>{getSellerEarnings().then(r=>setData(r.data)).catch(e=>setError(e.message||"Unable to load earnings."))},[]);
 const max=Math.max(...(data?.chart||[]).map(x=>x.amount),1), totalBreak=(data?.breakdown||[]).reduce((a,x)=>a+x.amount,0);
 return <ProviderShell mode="seller"><div className="seller-earnings-page">
  <header className="earnings-head"><div><h1>Earnings</h1><p>Track your sales, view payouts, and manage your payment details.</p></div><button className="date-range"><Icon name="calendar"/> Sep 1, 2026 – Sep 30, 2026 <span>⌄</span></button></header>
  {error&&<div className="earnings-error">{error}</div>}
  <div className="earnings-kpis">
   <Card icon="wallet" tone="green" value={money(data?.kpis?.sales)} title="Total sales" sub="This month" change={data?.kpis?.salesChange}/>
   <Card icon="bag" tone="blue" value={data?.kpis?.orders||0} title="Total orders" sub="This month"/>
   <Card icon="coins" tone="orange" value={money(data?.kpis?.paidOut)} title="Paid out" sub="All time"/>
   <Card icon="clock" tone="purple" value={money(data?.kpis?.pendingPayout)} title="Pending payout" sub={(data?.kpis?.pendingOrders||0)+" orders"}/>
  </div>
  <div className="earnings-grid">
   <section className="earnings-chart-card"><div className="card-heading"><h2>Earnings overview</h2><select><option>Last 6 months</option></select></div><div className="bar-chart">{(data?.chart||[]).map(x=><div className="bar-column" key={x.label}><span>{x.amount?money(x.amount).replace(".00",""):"₦0"}</span><div className="bar" style={{height:Math.max(8,x.amount/max*150)}}></div><small>{x.label}</small></div>)}</div></section>
   <section className="payout-card"><div className="card-heading"><h2>Payout details</h2><button>Manage payout method</button></div><div className="bank-row"><i><Icon name="wallet"/></i><div><strong>{data?.payoutDetails?.bankName||"Payout method not set"}</strong><span>{data?.payoutDetails?.accountLast4?"•••• "+data.payoutDetails.accountLast4:"No account details"}</span></div>{data?.payoutDetails?.verified&&<em>Verified</em>}</div><div className="payout-note"><Icon name="info"/><p>Payouts are processed through your configured payout method. Earnings from completed orders are included in eligible payouts.</p></div></section>
   <section className="transactions-card"><div className="card-heading"><h2>Recent transactions</h2><button>View all</button></div><div className="transactions-table"><div className="tx-row tx-head"><span>Date</span><span>Type</span><span>Description</span><span>Amount</span><span>Status</span></div>{(data?.transactions||[]).map(t=><div className="tx-row" key={t.id}><span>{new Date(t.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span><span><Icon name={t.type==="Payout"?"wallet":"calendar"}/> {t.type}</span><span>{t.description}</span><strong>{money(t.amount)}</strong><em>{t.status}</em></div>)}</div></section>
   <section className="breakdown-card"><div className="card-heading"><h2>Earnings breakdown</h2></div>{(data?.breakdown||[]).length?<div className="breakdown-list">{data.breakdown.map(x=><div key={x.name}><span>{x.name}</span><b>{x.percent}%</b></div>)}</div>:<div className="breakdown-empty">No completed product sales yet.</div>}</section>
   <section className="help-card"><h2>Need help?</h2><div><i><Icon name="headphones"/></i><p>If you have questions about your earnings or payouts, our support team is here to help.</p></div><button>Contact support →</button></section>
  </div>
 </div></ProviderShell>
}
function Card({icon,tone,value,title,sub,change}){return <div className="earnings-kpi"><i className={tone}><Icon name={icon}/></i><div><strong>{value}</strong><b>{title}</b><span>{sub}</span></div>{change!=null&&<em>↗ {change>=0?"+":""}{change}%</em>}</div>}
