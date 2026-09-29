import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderConversations, getProviderConversation, sendProviderMessage, getSellerOrders } from "../api/provider";
import "../styles/seller-messages.css";

const time = (v) => v ? new Intl.DateTimeFormat("en-NG",{hour:"numeric",minute:"2-digit"}).format(new Date(v)) : "";
const day = (v) => v ? new Intl.DateTimeFormat("en-NG",{weekday:"long",month:"short",day:"numeric",year:"numeric"}).format(new Date(v)) : "";
const money = (v) => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(v||0));
function Avatar({ user, large=false }) { const cls=large?"seller-msg-avatar large":"seller-msg-avatar"; return user?.avatar ? <img className={cls} src={user.avatar} alt="" /> : <div className={cls+" initials"}>{user?.initials||"?"}</div>; }

export default function SellerMessages() {
  const [conversations,setConversations]=useState([]);
  const [sellerOrders,setSellerOrders]=useState([]);
  const [selectedId,setSelectedId]=useState("");
  const [chat,setChat]=useState(null);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [text,setText]=useState("");
  const [error,setError]=useState("");
  const [sending,setSending]=useState(false);

  async function load() {
    try {
      const [messages,orders] = await Promise.all([getProviderConversations(),getSellerOrders({limit:50})]);
      const allowed=new Set((orders.data.orders||[]).map(o=>String(o.customer.id)));
      const sellerConversations=(messages.data.conversations||[]).filter(c=>allowed.has(String(c.customer?.id)));
      setConversations(sellerConversations);
      setSellerOrders(orders.data.orders||[]);
      setSelectedId(current => current && sellerConversations.some(c=>c.conversationId===current) ? current : sellerConversations[0]?.conversationId || "");
    } catch(e) { setError(e.message||"Unable to load your messages."); }
  }
  async function loadChat(id) {
    if(!id)return;
    try { const r=await getProviderConversation(id); setChat(r.data); } catch(e){setError(e.message||"Unable to load this conversation.");}
  }
  useEffect(()=>{load()},[]);
  useEffect(()=>{if(selectedId)loadChat(selectedId)},[selectedId]);

  const visible=useMemo(()=>conversations.filter(c=>{
    const q=search.toLowerCase().trim();
    return (!q||c.customer?.name?.toLowerCase().includes(q)||c.lastMessage?.toLowerCase().includes(q)) && (filter==="all" || (filter==="unread"&&c.unreadCount>0));
  }),[conversations,search,filter]);
  const customerOrders=useMemo(()=>chat?.customer?.id ? sellerOrders.filter(o=>String(o.customer.id)===String(chat.customer.id)) : [],[chat,sellerOrders]);
  const totalUnread=conversations.reduce((n,c)=>n+Number(c.unreadCount||0),0);

  async function send(e) {
    e.preventDefault(); const content=text.trim(); if(!content||!chat?.customer?.id||sending)return;
    setSending(true);
    try { const r=await sendProviderMessage({conversationId:chat.conversationId,receiverId:chat.customer.id,content}); setChat(c=>({...c,messages:[...c.messages,r.data]})); setText(""); await load(); }
    catch(e){setError(e.message||"Unable to send your message.");} finally{setSending(false);}
  }

  return <ProviderShell mode="seller"><div className="seller-messages-page">
    <div className="seller-messages-heading"><h1>Messages</h1><p>Chat with your customers, answer questions, and keep track of your conversations.</p></div>
    {error&&<div className="seller-msg-error">{error}<button onClick={()=>setError("")}>×</button></div>}
    <div className="seller-messages-grid">
      <section className="seller-msg-list seller-msg-card">
        <div className="seller-msg-search"><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search messages..." /></div>
        <div className="seller-msg-tabs"><button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>All</button><button className={filter==="unread"?"active":""} onClick={()=>setFilter("unread")}>Unread {totalUnread>0&&<b>{totalUnread}</b>}</button><button>Customers</button><button>Archived</button></div>
        <div className="seller-conversation-scroll">{visible.length?visible.map(c=><button className={"seller-conversation "+(selectedId===c.conversationId?"selected":"")} key={c.conversationId} onClick={()=>setSelectedId(c.conversationId)}><Avatar user={c.customer}/><div><strong>{c.customer?.name||"Customer"}</strong><p>{c.lastMessage||"No message"}</p></div><aside><small>{time(c.lastMessageAt)}</small>{c.unreadCount>0&&<b>{c.unreadCount}</b>}</aside></button>):<div className="seller-msg-empty"><Icon name="message" size={28}/><strong>No customer conversations</strong><p>Messages from your product customers will appear here.</p></div>}</div>
      </section>
      <section className="seller-msg-chat seller-msg-card">
        {!chat?<div className="seller-msg-empty"><Icon name="message" size={34}/><strong>Select a conversation</strong><p>Choose a customer to view your conversation.</p></div>:<>
          <header className="seller-chat-header"><Avatar user={chat.customer} large/><div><strong>{chat.customer?.name}</strong><span>Customer · {customerOrders.length} orders</span></div><button>View customer</button><b>⋮</b></header>
          <div className="seller-chat-body">{chat.messages.map((m,i)=><div key={m.id}>{(i===0||new Date(m.createdAt).toDateString()!==new Date(chat.messages[i-1].createdAt).toDateString())&&<div className="seller-chat-date">{day(m.createdAt)}</div>}<div className={"seller-bubble-row "+(m.isMine?"mine":"")} >{!m.isMine&&<Avatar user={chat.customer}/>}<div><p>{m.content}</p><small>{time(m.createdAt)} {m.isMine&&"✓✓"}</small></div></div></div>)}</div>
          <form className="seller-chat-compose" onSubmit={send}><button type="button">⌕</button><input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." disabled={sending}/><button type="button">☺</button><button className="send" disabled={sending||!text.trim()}>Send</button></form>
        </>}
      </section>
      <aside className="seller-customer-card seller-msg-card">{chat?.customer?<><header><h2>Customer details</h2><button>View profile</button></header><div className="seller-customer-profile"><Avatar user={chat.customer} large/><div><strong>{chat.customer.name}</strong><span>Nigeria</span></div></div><dl><dt>✉ Email</dt><dd>{customerOrders[0]?.customer.email||"Not provided"}</dd><dt>⌕ Phone</dt><dd>{customerOrders[0]?.customer.phone||"Not provided"}</dd><dt>▣ Total orders</dt><dd>{customerOrders.length}</dd><dt>▣ Customer since</dt><dd>{customerOrders.length?day(customerOrders[customerOrders.length-1].createdAt):"Not available"}</dd></dl><div className="seller-recent-orders"><h2>Recent orders <Link to="/seller/orders">View all</Link></h2>{customerOrders.slice(0,3).map(o=><Link to="/seller/orders" key={o.id}><div>{o.items[0]?.image&&<img src={o.items[0].image} alt=""/>}<span><strong>{o.orderNumber}</strong><small>{day(o.createdAt)}</small><small>{o.items.reduce((n,i)=>n+i.quantity,0)} items · {money(o.amount)}</small></span><b className={"mini-status "+o.status}>{o.status}</b></div></Link>)}</div><div className="seller-notes"><h2>Notes <span>+ Add note</span></h2><textarea placeholder="Add a note about this customer..."/></div></>:<div className="seller-msg-empty"><Icon name="user" size={30}/><strong>Customer details</strong><p>Select a conversation.</p></div>}</aside>
    </div>
  </div></ProviderShell>;
}
