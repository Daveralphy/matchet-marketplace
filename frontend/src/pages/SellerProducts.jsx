import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getSellerProducts, createSellerProduct, updateSellerProduct, deleteSellerProduct } from "../api/provider";
import LocationSearch from "../components/LocationSearch";
import "../styles/seller-products.css";

const money=(v,currency="NGN")=>new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:0}).format(Number(v||0));
const statusText=s=>({active:"Active",outOfStock:"Out of stock",draft:"Draft",archived:"Archived"}[s]||s);
const stockText=(p)=>p.inventory===0?"Out of stock":p.inventory<=5?"Low stock":"Active";

export default function SellerProducts(){
 const [menu,setMenu]=useState(null),[menuPosition,setMenuPosition]=useState(null),[data,setData]=useState(null),[tab,setTab]=useState("all"),[search,setSearch]=useState(""),[category,setCategory]=useState("all"),[sort,setSort]=useState("newest"),[selected,setSelected]=useState([]),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState({name:"",description:"",category:"",price:"",inventory:"",status:"draft",condition:"New",fastDelivery:false,images:[],location:"",locationData:null,currency:"NGN",shipping:{homeDelivery:true,pickup:true,deliveryFee:0}}),[saving,setSaving]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=()=>{setLoading(true);return getSellerProducts({status:tab,category,search,sort}).then(r=>setData(r.data)).catch(e=>setError(e.message||"Unable to load products.")).finally(()=>setLoading(false));};
 const openProductMenu=(productId,event)=>{
  if(menu===productId){setMenu(null);setMenuPosition(null);return;}
  const rect=event.currentTarget.getBoundingClientRect();
  const menuWidth=190,menuHeight=114,gap=6;
  const left=Math.max(12,Math.min(rect.right-menuWidth,window.innerWidth-menuWidth-12));
  const top=rect.bottom+gap<=window.innerHeight-12?rect.bottom+gap:Math.max(12,rect.top-menuHeight-gap);
  setMenu(productId);setMenuPosition({top,left});
 };
 useEffect(()=>{if(!menu)return;const close=()=>{setMenu(null);setMenuPosition(null)};document.addEventListener("mousedown",close);window.addEventListener("scroll",close,true);window.addEventListener("resize",close);return()=>{document.removeEventListener("mousedown",close);window.removeEventListener("scroll",close,true);window.removeEventListener("resize",close)}},[menu]);
 useEffect(()=>{load()},[tab,category,search,sort]);
 const open=(p=null)=>{setEditing(p);setForm(p?{name:p.name,description:p.description,category:p.category,price:p.price,inventory:p.inventory,status:p.status,condition:p.details?.condition||"New",fastDelivery:Boolean(p.details?.fastDelivery),images:p.images||[],location:typeof p.location==="string"?p.location:[p.location?.city,p.location?.state,p.location?.country].filter(Boolean).join(", "),currency:p.currency||"NGN",shipping:p.shipping||{homeDelivery:true,pickup:true,deliveryFee:0}}:{name:"",description:"",category:"",price:"",inventory:"",status:"draft",condition:"New",fastDelivery:false,images:[],location:"",locationData:null,currency:"NGN",shipping:{homeDelivery:true,pickup:true,deliveryFee:0}});setModal(true)};
 const handleImages=e=>{const files=Array.from(e.target.files||[]).filter(file=>["image/jpeg","image/png","image/webp"].includes(file.type)&&file.size<=5*1024*1024);if(files.length!==(e.target.files||[]).length)alert("Only JPG, PNG, or WebP images up to 5MB each are allowed.");setForm(v=>({...v,images:[...(v.images||[]),...files].slice(0,6)}));e.target.value="";};
 const removeImage=index=>setForm(v=>({...v,images:(v.images||[]).filter((_,i)=>i!==index)}));
 const save=async e=>{e.preventDefault();setSaving(true);setError("");try{const payload={...form,price:Number(form.price),inventory:Number(form.inventory),images:form.images||[],location:form.locationData||form.location,currency:form.currency,shipping:form.shipping,details:{...(form.details||{}),condition:form.condition,fastDelivery:Boolean(form.fastDelivery)}};editing?await updateSellerProduct(editing.id,payload):await createSellerProduct(payload);setModal(false);await load()}catch(e){setError(e.message||"Unable to save product.")}finally{setSaving(false)}};
 const products=data?.products||[],stats=data?.stats||{active:0,outOfStock:0,views:0,totalOrders:0,drafts:0,total:0};
 return <ProviderShell mode="seller"><div className="seller-products-page">
  <div className="seller-products-head"><div><h1>Products</h1><p>Manage your products, inventory, pricing, and listings.</p></div><button onClick={()=>open()}><Icon name="plus" size={17}/> Add a new product</button></div>
  <div className="product-stats">
   <div><i className="blue"><Icon name="grid"/></i><section><strong>{stats.active}</strong><b>Active products</b><span>Total listed</span></section></div>
   <div><i className="orange"><Icon name="grid"/></i><section><strong>{stats.outOfStock}</strong><b>Out of stock</b><span>Needs restocking</span></section></div>
   <div><i className="green"><Icon name="eye"/></i><section><strong>{stats.views.toLocaleString()}</strong><b>Total views</b><span>Last 30 days</span></section></div>
   <div><i className="purple"><Icon name="bag"/></i><section><strong>{stats.totalOrders}</strong><b>Total orders</b><span>All time</span></section></div>
  </div>
  {loading ? <section className="products-table-card seller-products-skeleton"><div/><div/><div/><div/><div/></section> : <section className="products-table-card">
   <div className="product-tabs">{[["all","All products"],["active","Active"],["outOfStock","Out of stock"],["draft","Drafts"]].map(([k,l])=><button className={tab===k?"active":""} onClick={()=>setTab(k)} key={k}>{l}{k!=="all"&&<em>({k==="active"?stats.active:k==="outOfStock"?stats.outOfStock:stats.drafts})</em>}</button>)}</div>
   <div className="product-filters"><label><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." /></label><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{(data?.categories||[]).map(c=><option key={c}>{c}</option>)}</select><select value={tab} onChange={e=>setTab(e.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="outOfStock">Out of stock</option><option value="draft">Drafts</option></select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Sort by: Newest</option><option value="oldest">Oldest</option><option value="priceHigh">Highest price</option><option value="priceLow">Lowest price</option></select></div>
   <div className="product-table-wrap"><table><thead><tr><th><input type="checkbox" onChange={e=>setSelected(e.target.checked?products.map(p=>p.id):[])}/></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Orders</th><th>Actions</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><input type="checkbox" checked={selected.includes(p.id)} onChange={e=>setSelected(v=>e.target.checked?[...v,p.id]:v.filter(x=>x!==p.id))}/></td><td><div className="product-cell">{p.image?<img src={p.image} alt=""/>:<span className="product-placeholder"><Icon name="grid"/></span>}<div><strong>{p.name}</strong><small>{p.description}</small></div></div></td><td>{p.category}</td><td><strong>{money(p.price,p.currency)}</strong></td><td className={p.inventory===0?"zero":p.inventory<=5?"low":""}>{p.inventory}</td><td><span className={"product-pill "+p.status}>{statusText(p.status)}</span></td><td>{p.orders}</td><td><div className="product-actions-menu-wrap"><button type="button" className="product-dots" onClick={(event)=>openProductMenu(p.id,event)} aria-label={"More actions for "+p.name}>⋮</button></div></td></tr>)}</tbody></table></div>
        {menu && menuPosition && createPortal(
          (() => {
            const product = products.find((item) => item.id === menu);
            if (!product) return null;
            const nextStatus = product.status === "active" ? "draft" : "active";
            const nextStatusLabel = product.status === "active" ? "Draft" : "Active";
            return (
              <div
                className="provider-service-actions-menu provider-service-actions-menu-portal"
                style={{ top: menuPosition.top, left: menuPosition.left }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <button type="button" onClick={() => {
                  open(product);
                  setMenu(null);
                  setMenuPosition(null);
                }}>
                  Edit product
                </button>
                <button type="button" onClick={async () => {
                  setMenu(null);
                  setMenuPosition(null);
                  try {
                    await updateSellerProduct(product.id, { status: nextStatus });
                    await load();
                  } catch (e) {
                    setError(e.message || "Unable to change product status.");
                  }
                }}>
                  Change status: {nextStatusLabel}
                </button>
                <button type="button" className="danger" onClick={async () => {
                  setMenu(null);
                  setMenuPosition(null);
                  if (!window.confirm("Delete \"" + product.name + "\"? This cannot be undone.")) return;
                  try {
                    await deleteSellerProduct(product.id);
                    await load();
                  } catch (e) {
                    setError(e.message || "Unable to delete product.");
                  }
                }}>
                  Delete product
                </button>
              </div>
            );
          })(),
          document.body,
        )}
   {!products.length&&<div className="products-empty"><Icon name="grid" size={30}/><strong>No products found</strong><p>Add your first product or change the filters.</p><button onClick={()=>open()}>Add a new product</button></div>}
   <div className="products-footer"><span>Showing {products.length} of {stats.total} products</span><div><button>‹</button><button className="active-page">1</button><button>›</button></div></div>
  </section>}
  {modal&&<div className="product-modal-backdrop"><form className="product-modal" onSubmit={save}><header><div><h2>{editing?"Edit product":"Add a new product"}</h2><p>{editing?"Update your product details and inventory.":"Create a product listing for your store."}</p></div><button type="button" onClick={()=>setModal(false)}>×</button></header>{error&&<div className="product-form-error">{error}</div>}<label>Product name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Description<textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="form-two"><label>Category<input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Price<input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label></div><div className="form-two"><label>Inventory<input required type="number" min="0" value={form.inventory} onChange={e=>setForm({...form,inventory:e.target.value})}/></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="draft">Draft</option><option value="active">Active</option><option value="outOfStock">Out of stock</option></select></label></div><div className="form-two"><label>Condition<select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}><option>New</option><option>Used</option><option>Refurbished</option></select></label><label><span>Fast delivery</span><input type="checkbox" checked={Boolean(form.fastDelivery)} onChange={e=>setForm({...form,fastDelivery:e.target.checked})}/></label></div><div className="form-two"><label>Currency<select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}><option>NGN</option><option>USD</option><option>GBP</option><option>EUR</option><option>CAD</option><option>AUD</option><option>GHS</option><option>KES</option></select></label><label>Home delivery fee ({form.currency})<input type="number" min="0" step="0.01" value={form.shipping?.deliveryFee||0} onChange={e=>setForm({...form,shipping:{...form.shipping,deliveryFee:e.target.value}})}/></label></div><label>Product location<LocationSearch value={form.location} onChange={v=>setForm({...form,location:v})} onSelect={v=>setForm({...form,location:v.label,locationData:v})} placeholder="Search the product's location..." /></label><div className="form-two"><label><input type="checkbox" checked={Boolean(form.shipping?.homeDelivery)} onChange={e=>setForm({...form,shipping:{...form.shipping,homeDelivery:e.target.checked}})}/> Home delivery</label><label><input type="checkbox" checked={Boolean(form.shipping?.pickup)} onChange={e=>setForm({...form,shipping:{...form.shipping,pickup:e.target.checked}})}/> Pickup from nearby delivery station</label></div><label>Product images<div className="seller-product-modal-images">{(form.images||[]).map((img,i)=><div key={i} className="seller-product-modal-image"><img src={img.url||URL.createObjectURL(img)} alt="" /><button type="button" onClick={()=>removeImage(i)}>×</button></div>)}{(form.images||[]).length<6&&<label className="seller-product-modal-add">＋ Add images<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImages}/></label>}</div><small>Up to 6 JPG, PNG, or WebP images. The first image is used as the main image.</small></label><footer><button type="button" onClick={()=>setModal(false)}>Cancel</button><button disabled={saving}>{saving?"Saving...":editing?"Save changes":"Create product"}</button></footer></form></div>}
 </div></ProviderShell>
}
