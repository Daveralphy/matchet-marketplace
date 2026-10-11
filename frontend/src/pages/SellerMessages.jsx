import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderConversations, getProviderConversation, sendProviderMessage, getSellerOrders } from "../api/provider";
import "../styles/provider-dashboard.css";

const formatTime = (value) => value ? new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "";
const formatDate = (value) => value ? new Intl.DateTimeFormat("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "";
function Avatar({ customer, large = false }) {
  const className = large ? "provider-message-avatar large" : "provider-message-avatar";
  if (customer?.avatar) return <img className={className} src={customer.avatar} alt="" />;
  return <div className={className + " provider-avatar"}>{customer?.initials || "?"}</div>;
}

export default function SellerMessages() {
  const [conversations, setConversations] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [conversation, setConversation] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function loadConversations(selectFirst = true) {
    try {
      const [messageResponse, orderResponse] = await Promise.all([getProviderConversations(), getSellerOrders({ limit: 50 })]);
      const orders = orderResponse.data?.orders || [];
      const allowedCustomerIds = new Set(orders.map((order) => String(order.customer?.id)).filter(Boolean));
      const next = (messageResponse.data?.conversations || []).filter((item) => allowedCustomerIds.has(String(item.customer?.id)));
      setSellerOrders(orders);
      setConversations(next);
      setSelectedId((current) => current && next.some((item) => item.conversationId === current) ? current : (selectFirst ? (next[0]?.conversationId || "") : ""));
    } catch (requestError) {
      setError(requestError.message || "Unable to load your messages.");
    } finally {
      setLoading(false);
    }
  }

  async function loadConversation(id) {
    if (!id) { setConversation(null); return; }
    setChatLoading(true);
    try {
      const response = await getProviderConversation(id);
      const allowedCustomerIds = new Set(sellerOrders.map((order) => String(order.customer?.id)).filter(Boolean));
      if (!allowedCustomerIds.has(String(response.data?.customer?.id))) {
        setConversation(null);
        setError("This conversation is not associated with your seller orders.");
        return;
      }
      setConversation(response.data);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to load this conversation.");
    } finally {
      setChatLoading(false);
    }
  }

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (selectedId && sellerOrders.length) loadConversation(selectedId); }, [selectedId, sellerOrders]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((item) => {
      const matchesSearch = !query || item.customer?.name?.toLowerCase().includes(query) || item.lastMessage?.toLowerCase().includes(query);
      return matchesSearch && (filter === "all" || (filter === "unread" && item.unreadCount > 0));
    });
  }, [conversations, search, filter]);
  const unreadTotal = conversations.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0);
  const customerOrders = useMemo(() => conversation?.customer?.id ? sellerOrders.filter((order) => String(order.customer?.id) === String(conversation.customer.id)) : [], [conversation, sellerOrders]);

  async function handleSend(event) {
    event.preventDefault();
    const content = message.trim();
    if (!content || !conversation?.customer?.id || sending) return;
    setSending(true);
    try {
      const response = await sendProviderMessage({ conversationId: conversation.conversationId, receiverId: conversation.customer.id, content });
      setConversation((current) => current ? { ...current, messages: [...(current.messages || []), response.data] } : current);
      setMessage("");
      await loadConversations(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to send your message.");
    } finally {
      setSending(false);
    }
  }

  return <ProviderShell mode="seller">
    <div className="provider-page provider-messages-page">
      <div className="provider-heading"><div><h1>Messages</h1><span>Chat with your customers, answer questions, and keep track of your conversations.</span></div></div>
      {error && <div className="provider-message-error" role="alert">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
      <div className="provider-message-layout">
        <section className="provider-card provider-conversations">
          <div className="provider-message-search"><Icon name="message" size={19}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..."/></div>
          <div className="provider-message-tabs">
            <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
            <button type="button" className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>Unread {unreadTotal > 0 && <b>{unreadTotal}</b>}</button>
            <button type="button" disabled>Customers</button><button type="button" disabled>Archived</button>
          </div>
          <div className="provider-conversation-list">
            {loading ? <div className="provider-message-empty">Loading messages...</div> : filteredConversations.length === 0 ? (
              <div className="provider-message-empty"><Icon name="message" size={30}/><strong>No customer conversations</strong><p>Messages from customers with your orders will appear here.</p></div>
            ) : filteredConversations.map((item) => (
              <button type="button" key={item.conversationId} className={"provider-conversation" + (selectedId === item.conversationId ? " selected" : "")} onClick={() => setSelectedId(item.conversationId)}>
                <Avatar customer={item.customer}/><div><strong>{item.customer?.name || "Customer"}</strong><p>{item.lastMessage || "No message content"}</p></div>
                <div className="provider-conversation-meta"><small>{formatTime(item.lastMessageAt)}</small>{item.unreadCount > 0 && <b>{item.unreadCount}</b>}</div>
              </button>
            ))}
          </div>
        </section>
        <section className="provider-card provider-chat">
          {!conversation ? <div className="provider-message-empty provider-chat-empty"><Icon name="message" size={34}/><strong>{chatLoading ? "Loading conversation..." : "Select a conversation"}</strong><p>Choose a customer to view your conversation.</p></div> : <>
            <div className="provider-chat-head"><Avatar customer={conversation.customer} large/><div><strong>{conversation.customer?.name || "Customer"}</strong><small>Customer · {customerOrders.length} order{customerOrders.length === 1 ? "" : "s"}</small></div></div>
            <div className="provider-chat-body">
              {chatLoading ? <div className="provider-message-empty">Loading conversation...</div> : (conversation.messages || []).map((item, index) => {
                const showDate = index === 0 || new Date(item.createdAt).toDateString() !== new Date(conversation.messages[index - 1].createdAt).toDateString();
                return <div key={item.id || item._id || index}>{showDate && <div className="provider-chat-date">{formatDate(item.createdAt)}</div>}<div className={"provider-chat-message " + (item.isMine ? "outgoing" : "incoming")}>{!item.isMine && <Avatar customer={conversation.customer}/>}<div><p>{item.content}</p><small>{formatTime(item.createdAt)} {item.isMine ? "✓✓" : ""}</small></div></div></div>;
              })}
            </div>
            <form className="provider-chat-input" onSubmit={handleSend}><button type="button" className="provider-attach-button" aria-label="Attachments unavailable" disabled>⌕</button><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a message..." disabled={sending || chatLoading}/><button type="button" className="provider-attach-button" aria-label="Emoji unavailable" disabled>☺</button><button type="submit" className="provider-send-button" disabled={sending || !message.trim()}>{sending ? "Sending..." : "Send"}</button></form>
          </>}
        </section>
      </div>
      {conversation && customerOrders.length > 0 && <p className="seller-chat-order-hint">This conversation is linked to {customerOrders.length} order{customerOrders.length === 1 ? "" : "s"} from your store.</p>}
    </div>
  </ProviderShell>;
}
