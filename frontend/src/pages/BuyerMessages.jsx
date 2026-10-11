import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getInbox, startConversation, getConversation, sendMessage, updateConversationState } from "../api/messages";
import "./BuyerMessages.css";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  return date.toDateString() === today.toDateString()
    ? new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(date)
    : new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric" }).format(date);
};
const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(date);
};

function Avatar({ user, large = false }) {
  const className = "account-message-avatar" + (large ? " large" : "");
  if (user?.avatar) return <img className={className} src={user.avatar} alt="" />;
  return <span className={className}>{user?.initials || user?.name?.slice(0, 1)?.toUpperCase() || "M"}</span>;
}

function OrderMessageCard({ orderCard, isBuyerView }) {
  const orderId = String(orderCard.orderId || "");
  const money = (amount) => (orderCard.currency || "NGN") + " " + Number(amount || 0).toLocaleString("en-NG");
  return (
    <section className="account-order-message-card" aria-label="Order summary">
      <div className="account-order-message-kicker"><span className="account-order-message-icon">✓</span><div><strong>Placed order</strong><span>Order #{orderId.slice(-8).toUpperCase()}</span></div></div>
      <div className="account-order-message-items">
        {(orderCard.items || []).map((item, index) => (
          <div className="account-order-message-item" key={orderId + "-" + index}>
            {item.image ? <img src={item.image} alt="" /> : <span className="account-order-message-placeholder">▧</span>}
            <div><strong>{item.name || "Product"}</strong><span>Qty: {item.quantity || 1}</span></div>
            <b>{money(Number(item.unitPrice || 0) * Number(item.quantity || 1))}</b>
          </div>
        ))}
      </div>
      <div className="account-order-message-total"><span>Order total</span><strong>{money(orderCard.total)}</strong></div>
      <div className="account-order-message-footer"><span className={"account-order-status " + String(orderCard.status || "pending").toLowerCase()}>{orderCard.status || "pending"}</span><Link to={(isBuyerView ? "/orders/" : "/seller/orders/") + encodeURIComponent(orderId)} className="account-order-details-link">Go to order <span aria-hidden="true">→</span></Link></div>
    </section>
  );
}

export default function BuyerMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const conversationRequestId = useRef(0);
  const requestedConversationId = useRef("");
  const chatBodyRef = useRef(null);
  const shouldAutoScroll = useRef(true);
  const [openMenuId, setOpenMenuId] = useState("");
  const menuRef = useRef(null);

  const loadInbox = useCallback(async (preserveSelection = true, syncTransactions = false, archived = false) => {
    try {
      const response = await getInbox({ syncTransactions, archived });
      const items = response.data?.conversations || [];
      setConversations(items);
      setSelectedId((current) => {
        if (requestedConversationId.current) return requestedConversationId.current;
        if (preserveSelection && current && items.some((item) => item.conversationId === current)) return current;
        return items[0]?.conversationId || "";
      });
      setError("");
    } catch (requestError) {
      setError(requestError.message || "We could not load your messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSelectedConversation = useCallback(async (id) => {
    const requestId = ++conversationRequestId.current;
    if (!id) { setActiveConversation(null); setConversationLoading(false); return; }
    setConversationLoading(true);
    try {
      const response = await getConversation(id);
      if (requestId !== conversationRequestId.current) return;
      setActiveConversation({
        ...response.data,
        pagination: response.data?.pagination || { hasMore: false, nextBefore: null, nextBeforeId: null },
      });
      setConversations((current) => current.map((item) => item.conversationId === id ? { ...item, unreadCount: 0 } : item));
      setError("");
    } catch (requestError) {
      if (requestId !== conversationRequestId.current) return;
      setActiveConversation(null);
      setError(requestError.message || "We could not open this conversation.");
    } finally {
      if (requestId === conversationRequestId.current) setConversationLoading(false);
    }
  }, []);

  useEffect(() => { loadInbox(false, true, filter === "archived"); }, [loadInbox, filter]);

  useEffect(() => {
    const recipientId = new URLSearchParams(window.location.search).get("recipient");
    if (!recipientId) return;
    let active = true;
    startConversation(recipientId)
      .then((response) => {
        if (!active) return;
        const conversation = response.data;
        requestedConversationId.current = conversation.conversationId;
        setSelectedId(conversation.conversationId);
        setActiveConversation(conversation);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "You cannot start a conversation with this account.");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedId) loadSelectedConversation(selectedId);
    else setActiveConversation(null);
  }, [selectedId, loadSelectedConversation]);

  // Poll the inbox and selected thread so new messages appear without a manual refresh.
  // Merge fetched messages with any older pages already loaded in this view.
  useEffect(() => {
    if (!selectedId) return undefined;
    let active = true;
    const refresh = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const [inboxResponse, conversationResponse] = await Promise.all([
          getInbox({ archived: filter === "archived" }),
          getConversation(selectedId),
        ]);
        if (!active) return;
        const inboxItems = inboxResponse.data?.conversations || [];
        setConversations(inboxItems);
        const incoming = conversationResponse.data?.messages || [];
        const chatBody = chatBodyRef.current;
        shouldAutoScroll.current = !chatBody || chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 100;
        setActiveConversation((current) => {
          if (!current || current.conversationId !== selectedId) return current;
          const merged = new Map();
          for (const message of [...(current.messages || []), ...incoming]) {
            merged.set(String(message.id || message._id), message);
          }
          const messages = [...merged.values()].sort((a, b) => {
            const timeDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return timeDifference || String(a.id || a._id).localeCompare(String(b.id || b._id));
          });
          return {
            ...current,
            ...conversationResponse.data,
            messages,
            // Polling refreshes the newest messages, not the older-history cursor.
            // Keep pagination state managed by the explicit "Load older messages" action.
            pagination: current.pagination || conversationResponse.data?.pagination || { hasMore: false, nextBefore: null, nextBeforeId: null },
          };
        });
      } catch {
        // Temporary polling failures should not interrupt composing or replace the visible thread.
      }
    };
    const timer = window.setInterval(refresh, 3000);
    const onVisibilityChange = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [selectedId, filter]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((item) => {
      const name = item.participant?.name || "";
      const text = item.lastMessage || "";
      const matches = !query || name.toLowerCase().includes(query) || text.toLowerCase().includes(query);
      return matches && (filter !== "unread" || Number(item.unreadCount || 0) > 0);
    });
  }, [conversations, search, filter]);

  const unreadCount = conversations.reduce((total, item) => total + Number(item.unreadCount || 0), 0);

  useEffect(() => {
    if (!openMenuId) return undefined;
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId("");
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenMenuId("");
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenuId]);

  async function handleConversationAction(conversation, action) {
    setOpenMenuId("");
    try {
      await updateConversationState(conversation.conversationId, action);
      if (action === "delete" || action === "archive" || action === "unarchive") {
        setConversations((current) => current.filter((item) => item.conversationId !== conversation.conversationId));
        if (selectedId === conversation.conversationId) {
          setSelectedId("");
          setActiveConversation(null);
        }
      } else if (action === "read") {
        setConversations((current) => current.map((item) => item.conversationId === conversation.conversationId ? { ...item, unreadCount: 0 } : item));
      } else if (action === "unread") {
        setConversations((current) => current.map((item) => item.conversationId === conversation.conversationId ? { ...item, unreadCount: Math.max(1, Number(item.unreadCount || 0)) } : item));
      }
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to update this conversation.");
    }
  }

  useEffect(() => {
    if (!shouldAutoScroll.current || !chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    shouldAutoScroll.current = false;
  }, [activeConversation?.messages?.length]);

  async function loadOlderMessages() {
    shouldAutoScroll.current = false;
    const cursor = activeConversation?.pagination?.nextBefore;
    const cursorId = activeConversation?.pagination?.nextBeforeId;
    const id = activeConversation?.conversationId;
    if (!cursor || !cursorId || !id || conversationLoading) return;
    setConversationLoading(true);
    try {
      const response = await getConversation(id, { before: cursor, beforeId: cursorId, limit: 50 });
      const older = response.data?.messages || [];
      setActiveConversation((current) => {
        if (!current || current.conversationId !== id) return current;
        const known = new Set((current.messages || []).map((item) => String(item.id || item._id)));
        return {
          ...current,
          messages: [...older.filter((item) => !known.has(String(item.id || item._id))), ...(current.messages || [])],
          pagination: response.data?.pagination || { hasMore: false, nextBefore: null, nextBeforeId: null },
        };
      });
    } catch (requestError) {
      setError(requestError.message || "Could not load older messages.");
    } finally {
      setConversationLoading(false);
    }
  }

  async function handleSend(event) {
    event.preventDefault();
    const content = draft.trim();
    const participantId = activeConversation?.participant?.id;
    if (!content || !participantId || sending) return;
    setSending(true);
    try {
      await sendMessage({
        conversationId: activeConversation.conversationId,
        receiverId: participantId,
        content,
      });
      setDraft("");
      await loadSelectedConversation(activeConversation.conversationId);
      await loadInbox(true);
    } catch (requestError) {
      setError(requestError.message || "Your message could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="account-messages-page">
      <div className="account-messages-shell">
        <nav className="account-messages-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Messages</span>
        </nav>
        <header className="account-messages-heading">
          <div><p>Stay connected</p><h1>Messages</h1><span>Conversations with buyers, sellers, and service providers.</span></div>
          {unreadCount > 0 && <span className="account-messages-unread">{unreadCount} unread</span>}
        </header>

        {error && <div className="account-messages-error" role="alert"><span>{error}</span><button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}

        <section className="account-messages-layout">
          <aside className="account-messages-list-panel">
            <div className="account-messages-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" /></div>
            <div className="account-messages-filters">
              <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
              <button type="button" className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}</button>
              <button type="button" className={filter === "archived" ? "active" : ""} onClick={() => setFilter("archived")}>Archived</button>
            </div>
            <div className="account-messages-conversations">
              {loading ? <div className="account-messages-empty">Loading conversations…</div> : filtered.length === 0 ? (
                <div className="account-messages-empty"><span className="account-messages-empty-icon">✉</span><strong>{search || filter === "unread" ? "No matching conversations" : "No messages yet"}</strong><p>{search || filter === "unread" ? "Try a different search or filter." : "Open a seller or provider from your orders or bookings to start an eligible conversation."}</p></div>
              ) : filtered.map((item) => (
                <div key={item.conversationId} className={"account-message-thread-wrap" + (selectedId === item.conversationId ? " selected" : "")}>
                  <button type="button" className={"account-message-thread" + (selectedId === item.conversationId ? " selected" : "")} onClick={() => { setSelectedId(item.conversationId); setOpenMenuId(""); }}>
                    <Avatar user={item.participant} />
                    <span className="account-message-thread-copy"><strong>{item.participant?.name || "Matchet user"}</strong><span>{item.lastMessage || "Attachment"}</span></span>
                    <span className="account-message-thread-meta"><time>{formatTime(item.lastMessageAt)}</time>{item.unreadCount > 0 && <b>{item.unreadCount}</b>}</span>
                  </button>
                  <div className="account-message-thread-actions" ref={openMenuId === item.conversationId ? menuRef : null}>
                    <button type="button" className="account-message-menu-trigger" aria-label={"Conversation options for " + (item.participant?.name || "Matchet user")} aria-haspopup="menu" aria-expanded={openMenuId === item.conversationId} onClick={(event) => { event.stopPropagation(); setOpenMenuId((current) => current === item.conversationId ? "" : item.conversationId); }}>⋮</button>
                    {openMenuId === item.conversationId && <div className="account-message-menu" role="menu">
                      <button type="button" role="menuitem" onClick={() => handleConversationAction(item, Number(item.unreadCount || 0) > 0 ? "read" : "unread")}>{Number(item.unreadCount || 0) > 0 ? "Mark as read" : "Mark as unread"}</button>
                      <button type="button" role="menuitem" onClick={() => handleConversationAction(item, filter === "archived" ? "unarchive" : "archive")}>{filter === "archived" ? "Unarchive conversation" : "Archive conversation"}</button>
                      <button type="button" role="menuitem" className="danger" onClick={() => handleConversationAction(item, "delete")}>Delete conversation</button>
                    </div>}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="account-messages-chat">
            {!selectedId ? (
              <div className="account-messages-empty account-messages-chat-empty"><span className="account-messages-empty-icon">✉</span><strong>Select a conversation</strong><p>Choose a conversation to read messages and reply.</p></div>
            ) : !activeConversation || conversationLoading ? (
              <div className="account-messages-empty account-messages-chat-empty">Loading conversation…</div>
            ) : (
              <>
                <header className="account-messages-chat-header"><Avatar user={activeConversation.participant} large /><div><strong>{activeConversation.participant?.name || "Matchet user"}</strong><span>Matchet conversation</span></div></header>
                <div className="account-messages-chat-body" ref={chatBodyRef}>
                  {activeConversation.pagination?.hasMore && <button type="button" className="account-messages-load-older" onClick={loadOlderMessages} disabled={conversationLoading}>{conversationLoading ? "Loading…" : "Load older messages"}</button>}
                  {(activeConversation.messages || []).length === 0 ? <div className="account-messages-empty">No messages in this conversation yet.</div> : activeConversation.messages.map((item, index, list) => {
                    const showDate = index === 0 || new Date(item.createdAt).toDateString() !== new Date(list[index - 1].createdAt).toDateString();
                    return <div key={item.id || item._id || index}>{showDate && <div className="account-message-date">{formatDate(item.createdAt)}</div>}<div className={"account-message-bubble-row " + (item.isMine ? "mine" : "theirs")}><div className={"account-message-bubble" + (item.orderCard ? " has-order-card" : "")}>{item.orderCard ? <OrderMessageCard orderCard={item.orderCard} isBuyerView={item.isMine} /> : <p>{item.content}</p>}{item.attachments?.map((attachment, attachmentIndex) => <a key={attachment.publicId || attachmentIndex} href={attachment.url} target="_blank" rel="noreferrer">{attachment.name || "Open attachment"}</a>)}<time>{formatTime(item.createdAt)}{item.isMine && item.readAt ? " · Read" : ""}</time></div></div></div>;
                  })}
                </div>
                <form className="account-messages-composer" onSubmit={handleSend}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" maxLength={5000} aria-label="Write a message" disabled={sending || conversationLoading}/><button type="submit" disabled={sending || !draft.trim() || conversationLoading}>{sending ? "Sending…" : "Send"}</button></form>
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
