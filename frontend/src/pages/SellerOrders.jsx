import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getSellerOrders, updateSellerOrderStatus } from "../api/provider";
import "../styles/seller-orders.css";

const money = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(v || 0));
const fmtDate = (v) => new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(v));
const statusName = (v) => ({ processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", pending: "Pending", confirmed: "Confirmed" }[v] || v);

export default function SellerOrders() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const res = await getSellerOrders({ status: tab, search, product, sort, limit: 50 });
    setData(res.data);
    if (selected) setSelected(res.data.orders.find((o) => o.id === selected.id) || null);
    setLoading(false);
  };
  useEffect(() => { load().catch(console.error); }, [tab, search, product, sort]);
  const changeStatus = async (status) => {
    if (!selected) return;
    setBusy(true);
    try { await updateSellerOrderStatus(selected.id, status); await load(); }
    finally { setBusy(false); }
  };
  const stats = data?.stats || { all: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  const orders = data?.orders || [];

  return <ProviderShell mode="seller">
    <div className="seller-orders-page">
      <div className="orders-head">
        <div><h1>Orders</h1><p>Manage your orders, process shipments, and keep your customers updated.</p></div>
        <div className="orders-head-actions"><button className="export-btn" onClick={() => {
          const rows = orders.map(o => [o.orderNumber, o.items.map(i => i.name).join(" | "), o.customer.name, new Date(o.createdAt).toLocaleString(), o.amount, o.status]);
          const csv = [["Order","Products","Customer","Date","Amount","Status"], ...rows].map(r => r.map(v => '"' + String(v).replaceAll('"','""') + '"').join(",")).join("\n");
          const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "matchet-orders.csv"; a.click(); URL.revokeObjectURL(a.href);
        }}><Icon name="plus" size={17}/> Export orders</button><button className="date-filter"><Icon name="calendar" size={17}/> Sep 1, 2026 – Sep 30, 2026 <span>⌄</span></button></div>
      </div>

      <div className="order-stats">
        {[["all","Total orders","calendar","blue"],["shipped","Shipped","truck","green"],["processing","Processing","grid","orange"],["delivered","Delivered","shield","green"]].map(([key,label,icon,color]) =>
          <div className="order-stat" key={key}><div className={"order-stat-icon " + color}><Icon name={icon}/></div><div><strong>{stats[key]}</strong><b>{label}</b><span>This month</span></div></div>
        )}
      </div>

      <div className="orders-content">{loading ? <section className="orders-table-card seller-orders-skeleton"><div/><div/><div/><div/><div/><div/></section> : <>
        <section className="orders-table-card">
          <div className="order-tabs">{[["all","All orders"],["processing","Processing"],["shipped","Shipped"],["delivered","Delivered"],["cancelled","Cancelled"]].map(([key,label]) => <button className={tab===key ? "active":""} onClick={() => setTab(key)} key={key}>{label}{key!=="all" && <em>({stats[key] || 0})</em>}</button>)}</div>
          <div className="order-filters">
            <label><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders by customer, product, or order number..." /></label>
            <select value={tab === "all" ? "all" : tab} onChange={e=>setTab(e.target.value)}><option value="all">All statuses</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select>
            <select value={product} onChange={e=>setProduct(e.target.value)}><option value="all">All products</option>{(data?.products||[]).map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select>
            <select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="amountHigh">Highest amount</option><option value="amountLow">Lowest amount</option></select>
          </div>
          <div className="order-table-wrap"><table><thead><tr><th><input type="checkbox" /></th><th>Order</th><th>Product(s)</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{orders.map(order => <tr key={order.id} className={selected?.id===order.id ? "selected":""} onClick={()=>setSelected(order)} onDoubleClick={()=>window.location.href="/seller/orders/"+order.id}>
            <td onClick={e=>e.stopPropagation()}><input type="checkbox"/></td><td><strong>{order.orderNumber}</strong><small>{order.items.reduce((n,i)=>n+i.quantity,0)} item{order.items.reduce((n,i)=>n+i.quantity,0)===1?"":"s"}</small></td>
            <td><div className="table-products">{order.items.slice(0,2).map((item,i)=><span key={item.productId || i}><img src={item.image||""} alt="" /><b>{item.name}</b></span>)}</div></td>
            <td>{order.customer.name}</td><td>{fmtDate(order.createdAt)}</td><td><strong>{money(order.amount)}</strong></td><td><span className={"order-pill " + order.status}>{statusName(order.status)}</span></td><td><button className="dots" onClick={e=>{e.stopPropagation();window.location.href="/seller/orders/"+order.id}}>⋮</button></td>
          </tr>)}</tbody></table></div>
          <div className="order-footer"><span>Showing {orders.length} of {data?.pagination?.total || 0} orders</span><div><button>‹</button><button className="page-active">1</button><button>2</button><button>›</button></div></div>
        </section>

        <aside className="order-detail">
          <h2>Order details {selected && <span className={"order-pill " + selected.status}>{statusName(selected.status)}</span>}</h2>
          {!selected ? <div className="detail-empty"><Icon name="calendar" size={30}/><strong>Select an order</strong><p>Choose an order to view its details.</p></div> :
          <div className="detail-body">
            <div className="detail-product">{selected.items[0]?.image ? <img src={selected.items[0].image} alt="" /> : <div><Icon name="grid"/></div>}<section><strong>{selected.items[0]?.name}</strong><span>{selected.items.reduce((n,i)=>n+i.quantity,0)} item{selected.items.reduce((n,i)=>n+i.quantity,0)===1?"":"s"}</span><b>{money(selected.amount)}</b></section></div>
            <dl><dt><Icon name="calendar"/> Order number</dt><dd>{selected.orderNumber}</dd><dt><Icon name="user"/> Customer</dt><dd>{selected.customer.name}</dd><dt><Icon name="calendar"/> Date & time</dt><dd>{fmtDate(selected.createdAt)}</dd><dt><Icon name="eye"/> Shipping address</dt><dd>{[selected.shippingAddress.addressLine1,selected.shippingAddress.addressLine2,selected.shippingAddress.city,selected.shippingAddress.state,selected.shippingAddress.country].filter(Boolean).join(", ") || "Not provided"}</dd><dt><Icon name="wallet"/> Payment method</dt><dd>{selected.paymentReference || "Payment confirmed"}<span className="paid">{selected.paymentStatus === "paid" ? "Paid" : selected.paymentStatus}</span></dd></dl>
            <div className="detail-actions">{selected.canShip && <button className="ship" disabled={busy} onClick={()=>changeStatus("shipped")}><Icon name="calendar" size={17}/> Mark as shipped</button>}{selected.status !== "delivered" && selected.status !== "cancelled" && <button className="update" disabled={busy} onClick={()=>changeStatus(selected.status==="processing"?"shipped":"processing")}><Icon name="settings" size={17}/> Update status <span>⌄</span></button>}{selected.canCancel && <button className="cancel" disabled={busy} onClick={()=>changeStatus("cancelled")}>⊗ &nbsp;Cancel order</button>}</div>
          </div>}
        </aside></>}
      </div>
    </div>
  </ProviderShell>;
}
