import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getServiceById, getRelatedServices } from "../data/marketplaceApi";

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    chevronLeft:<path d="m14 5-7 7 7 7"/>, chevronRight:<path d="m10 5 7 7-7 7"/>,
    heart:<path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/>,
    share:<><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 14v5h14v-5"/></>, flag:<><path d="M5 21V4"/><path d="M5 5c5-3 7 3 14 0v9c-7 3-9-3-14 0"/></>,
    shield:<path d="M12 3 20 6v5c0 5-3.3 8.7-8 10-4.7-1.3-8-5-8-10V6l8-3Z"/>,
    calendar:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    pin:<><path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></>,
    users:<><path d="M16 20v-1.5a4.5 4.5 0 0 0-9 0V20"/><circle cx="11.5" cy="8" r="3"/><path d="M17 11a3 3 0 0 0 0-6M20 20v-1.5a4.5 4.5 0 0 0-3-4.2"/></>,
    star:<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Stars({rating}) {
  const n=Math.max(0,Math.min(5,Math.round(Number(rating)||0)));
  return <span className="tracking-[-0.12em] text-[#f5a900]">{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}

function ServiceVisual({service,large=false,image=null}) {
  const icon=service.icon==="tools"?"tools":service.icon==="home"?"home":"users";
  return <div className={`flex items-center justify-center overflow-hidden rounded-[10px] ${large?"h-[410px] sm:h-[480px]":"h-[86px]"} ${service.imageTone||"bg-[#f1f1ef]"}`}>
    {image?<img src={image} alt={service.title} className="h-full w-full object-cover"/>:<span className="flex items-center justify-center rounded-full bg-white/45 text-[#10183f]/60 ${large?"h-[190px] w-[190px]":"h-[52px] w-[52px]"}"><Icon name={icon} size={large?92:28} strokeWidth={1.35}/></span>}
  </div>;
}

function Gallery({service}) {
  const images=Array.isArray(service.gallery)?service.gallery.filter(Boolean):[];
  const [active,setActive]=useState(0);
  const current=images[active]||null;
  return <><div className="relative">
    {images.length>1&&<><button onClick={()=>setActive(v=>(v-1+images.length)%images.length)} className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md"><Icon name="chevronLeft"/></button><button onClick={()=>setActive(v=>(v+1)%images.length)} className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md"><Icon name="chevronRight"/></button></>}
    <ServiceVisual service={service} large image={current}/>
    {images.length>0&&<span className="absolute bottom-3 right-3 rounded-full bg-[#10183f] px-3 py-1 text-[11px] text-white">{active+1} / {images.length}</span>}
  </div>
  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
    {images.length?images.map((img,i)=><button key={img+i} onClick={()=>setActive(i)} className={`h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[9px] border-2 ${active===i?"border-[#07863a]":"border-transparent"}`}><img src={img} alt="" className="h-full w-full object-cover"/></button>):<div className="h-[86px] w-[86px] shrink-0"><ServiceVisual service={service}/></div>}
  </div></>;
}

function ServiceDetails({service,related}) {
 const [saved,setSaved]=useState(false);
 return <main className="w-full bg-[#fbfcfd] px-4 pb-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1470px] pt-5">
  <nav className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-[#69739a]"><Link to="/">Home</Link><span>›</span><Link to="/services">Services</Link><span>›</span><span>{service.category}</span><span>›</span><span>{service.title}</span></nav>
  <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
   <section><Gallery service={service}/><div className="mt-16 flex gap-8 text-[12px] text-[#10183f]"><button className="flex items-center gap-2"><Icon name="share"/> Share this service</button><button className="flex items-center gap-2"><Icon name="flag"/> Report service</button></div></section>
   <section className="space-y-5">
    <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-[0_8px_28px_rgba(16,24,63,0.035)] sm:p-6">
     <p className="text-[12px] font-medium text-[#69739a]">{service.category}</p><h1 className="mt-1 text-[31px] font-bold leading-[1.05] tracking-[-0.045em] text-[#10183f] sm:text-[38px]">{service.title}</h1>
     <div className="mt-3 flex items-center gap-3 text-[13px]"><Stars rating={service.rating}/><strong>{Number(service.rating).toFixed(1)}</strong><span className="text-[#69739a]">({service.reviews||0} reviews)</span></div>
     <p className="mt-3 text-[14px] leading-6 text-[#69739a]">{service.description}</p>
     <div className="mt-5 flex items-center justify-between gap-4"><p className="text-[30px] font-bold tracking-[-0.04em] text-[#10183f]">{service.price}</p><span className="rounded-[8px] bg-[#e7f8ec] px-3 py-2 text-[11px] font-medium text-[#07863a]">● {service.availability}</span></div>
     <div className="mt-6 flex gap-3"><button onClick={()=>setSaved(v=>!v)} className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[8px] border border-[#dfe5ec] font-medium text-[#10183f]"><Icon name="heart"/>{saved?"Saved":"Save service"}</button><button className="h-[52px] flex-1 rounded-[8px] bg-[#087d35] font-medium text-white">Request booking</button></div>
     <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#edf0f3] pt-5">{[{icon:"shield",title:"Verified provider",text:service.providerVerified?"Provider verified":"Provider status available"},{icon:"clock",title:"Response time",text:service.responseTime},{icon:"calendar",title:"Availability",text:service.bookingNotice}].map(x=><div key={x.title} className="text-[10px] text-[#69739a]"><Icon name={x.icon} size={23}/><p className="mt-1 font-semibold text-[#10183f]">{x.title}</p><p className="mt-0.5 leading-4">{x.text}</p></div>)}</div>
    </div>
    <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-[0_8px_28px_rgba(16,24,63,0.035)] sm:p-6">
      <div className="flex items-center gap-3"><span className={`flex h-12 w-12 items-center justify-center rounded-full ${service.avatarTone||"bg-[#eef1f3] text-[#10183f]"} font-semibold`}>{service.sellerInitial}</span><div><p className="text-[14px] font-semibold text-[#10183f]">{service.seller}{service.providerVerified&&<span className="ml-1 text-[#18a34a]">✓</span>}</p><p className="mt-1 text-[11px] text-[#69739a]">{service.experience}</p></div></div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] text-[#69739a]"><span className="rounded-[8px] bg-[#f7f9fb] p-3"><b className="block text-[#10183f]">Service duration</b>{service.serviceDuration}</span><span className="rounded-[8px] bg-[#f7f9fb] p-3"><b className="block text-[#10183f]">Cancellation</b>{service.cancellationPolicy}</span></div>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-[#69739a]"><Icon name="pin" size={16}/>{service.location}</p>
    </div>
   </section>
  </div>
  <section className="mt-7 border-t border-[#e1e6ec] pt-7"><h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#10183f] sm:text-[28px]">You might also like</h2><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{related.map(item=><Link key={item.id} to={`/services/${item.id}`} className="rounded-[10px] border border-[#e4e8ee] bg-white p-2.5"><ServiceVisual service={item}/><h3 className="mt-2 truncate text-[12px] font-medium text-[#10183f]">{item.title}</h3><div className="mt-1 text-[10px]"><Stars rating={item.rating}/> <span>{Number(item.rating).toFixed(1)} ({item.reviews||0})</span></div><p className="mt-2 text-[15px] font-bold text-[#10183f]">{item.price}</p><p className="mt-1 truncate text-[10px] text-[#69739a]">{item.seller} · {item.location}</p></Link>)}</div></section>
 </div></main>;
}
export default function ServiceDetailsPage(){const {id}=useParams();const [service,setService]=useState(null);const [related,setRelated]=useState([]);useEffect(()=>{let active=true;Promise.all([getServiceById(id),getRelatedServices(id)]).then(([s,r])=>{if(active){setService(s);setRelated(r)}});return()=>{active=false}},[id]);if(!service)return <main className="flex min-h-[60vh] items-center justify-center text-sm text-[#69739a]">Loading service...</main>;return <ServiceDetails service={service} related={related}/>;}