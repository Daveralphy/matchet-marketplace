import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getInbox, getConversation, sendMessage } from "../api/messages";
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

  const loadInbox = useCallback(async (preserveSelection = true) => {
    try {
      const response = await getInbox();
      const items = response.data?.conversations || [];
      setConversations(items);
      setSelectedId((current) => {
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
      setActiveConversation(response.data || null);
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

  useEffect(() => { loadInbox(false); }, [loadInbox]);
  useEffect(() => { if (selectedId) loadSelectedConversation(selectedId); else setActiveConversation(null); }, [selectedId, loadSelectedConversation]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((item) => {
      const name = item.participant?.name || "";
      const text = item.lastMessage || "";
      const matches = !query || name.toLowerCase().includes(query) || text.toLowerCase().includes(query);
      return matches && (filter === "all" || Number(item.unreadCount || 0) > 0);
    });
  }, [conversations, search, filter]);

  const unreadCount = conversations.reduce((total, item) => total + Number(item.unreadCount || 0), 0);

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
            </div>
            <div className="account-messages-conversations">
              {loading ? <div className="account-messages-empty">Loading conversations…</div> : filtered.length === 0 ? (
                <div className="account-messages-empty"><span className="account-messages-empty-icon">✉</span><strong>{search || filter === "unread" ? "No matching conversations" : "No messages yet"}</strong><p>{search || filter === "unread" ? "Try a different search or filter." : "When you message a seller or service provider, your conversation will appear here."}</p></div>
              ) : filtered.map((item) => (
                <button type="button" key={item.conversationId} className={"account-message-thread" + (selectedId === item.conversationId ? " selected" : "")} onClick={() => setSelectedId(item.conversationId)}>
                  <Avatar user={item.participant} />
                  <span className="account-message-thread-copy"><strong>{item.participant?.name || "Matchet user"}</strong><span>{item.lastMessage || "Attachment"}</span></span>
                  <span className="account-message-thread-meta"><time>{formatTime(item.lastMessageAt)}</time>{item.unreadCount > 0 && <b>{item.unreadCount}</b>}</span>
                </button>
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
                <div className="account-messages-chat-body">
                  {(activeConversation.messages || []).length === 0 ? <div className="account-messages-empty">No messages in this conversation yet.</div> : activeConversation.messages.map((item, index, list) => {
                    const showDate = index === 0 || new Date(item.createdAt).toDateString() !== new Date(list[index - 1].createdAt).toDateString();
                    return <div key={item.id || item._id || index}>{showDate && <div className="account-message-date">{formatDate(item.createdAt)}</div>}<div className={"account-message-bubble-row " + (item.isMine ? "mine" : "theirs")}><div className="account-message-bubble"><p>{item.content}</p>{item.attachments?.map((attachment, attachmentIndex) => <a key={attachment.publicId || attachmentIndex} href={attachment.url} target="_blank" rel="noreferrer">{attachment.name || "Open attachment"}</a>)}<time>{formatTime(item.createdAt)}{item.isMine && item.readAt ? " · Read" : ""}</time></div></div></div>;
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
