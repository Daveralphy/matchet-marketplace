import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import {
  getProviderConversations,
  getProviderConversation,
  sendProviderMessage,
} from "../api/provider";
import "../styles/provider-dashboard.css";

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function Avatar({ customer, large = false }) {
  const className = large ? "provider-message-avatar large" : "provider-message-avatar";
  if (customer?.avatar) return <img className={className} src={customer.avatar} alt="" />;
  return <div className={className + " provider-avatar"}>{customer?.initials || "?"}</div>;
}

export default function ProviderMessages() {
  const [conversations, setConversations] = useState([]);
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
      const response = await getProviderConversations();
      const next = response.data?.conversations || [];
      setConversations(next);
      if (selectFirst && next.length) setSelectedId((current) => current || next[0].conversationId);
    } catch (requestError) {
      setError(requestError.message || "Unable to load your messages.");
    } finally {
      setLoading(false);
    }
  }

  async function loadConversation(id) {
    if (!id) return;
    setChatLoading(true);
    try {
      const response = await getProviderConversation(id);
      setConversation(response.data);
    } catch (requestError) {
      setError(requestError.message || "Unable to load this conversation.");
    } finally {
      setChatLoading(false);
    }
  }

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (selectedId) loadConversation(selectedId); }, [selectedId]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((item) => {
      const matchesSearch =
        !query ||
        item.customer?.name?.toLowerCase().includes(query) ||
        item.lastMessage?.toLowerCase().includes(query);
      const matchesFilter = filter === "all" || (filter === "unread" && item.unreadCount > 0);
      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  async function handleSend(event) {
    event.preventDefault();
    const content = message.trim();
    if (!content || !conversation?.customer?.id || sending) return;

    setSending(true);
    try {
      const response = await sendProviderMessage({
        conversationId: conversation.conversationId,
        receiverId: conversation.customer.id,
        content,
      });
      setConversation((current) =>
        current ? { ...current, messages: [...current.messages, response.data] } : current,
      );
      setMessage("");
      await loadConversations(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to send your message.");
    } finally {
      setSending(false);
    }
  }

  const unreadTotal = conversations.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0);

  return (
    <ProviderShell>
      <div className="provider-page provider-messages-page">
        <div className="provider-heading">
          <div>
            <h1>Messages</h1>
            <span>Chat with your customers, manage inquiries, and keep track of your conversations.</span>
          </div>
        </div>

        {error && (
          <div className="provider-message-error" role="alert">
            {error}<button onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="provider-message-layout">
          <section className="provider-card provider-conversations">
            <div className="provider-message-search">
              <Icon name="message" size={19} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..." />
            </div>

            <div className="provider-message-tabs">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
              <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>
                Unread {unreadTotal > 0 && <b>{unreadTotal}</b>}
              </button>
              <button>Customers</button>
              <button>Archived</button>
            </div>

            <div className="provider-conversation-list">
              {loading ? (
                <div className="provider-message-empty">Loading messages...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="provider-message-empty">
                  <Icon name="message" size={30} />
                  <strong>No conversations found</strong>
                  <p>Your customer conversations will appear here.</p>
                </div>
              ) : filteredConversations.map((item) => (
                <button
                  type="button"
                  key={item.conversationId}
                  className={"provider-conversation" + (selectedId === item.conversationId ? " selected" : "")}
                  onClick={() => setSelectedId(item.conversationId)}
                >
                  <Avatar customer={item.customer} />
                  <div>
                    <strong>{item.customer?.name || "Customer"}</strong>
                    <p>{item.lastMessage || "No message content"}</p>
                  </div>
                  <div className="provider-conversation-meta">
                    <small>{formatTime(item.lastMessageAt)}</small>
                    {item.unreadCount > 0 && <b>{item.unreadCount}</b>}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="provider-card provider-chat">
            {!conversation ? (
              <div className="provider-message-empty provider-chat-empty">
                <Icon name="message" size={34} />
                <strong>Select a conversation</strong>
                <p>Choose a customer to view your conversation.</p>
              </div>
            ) : (
              <>
                <div className="provider-chat-head">
                  <Avatar customer={conversation.customer} large />
                  <div>
                    <strong>{conversation.customer?.name || "Customer"}</strong>
                    <small>Customer</small>
                  </div>
                  <button type="button" className="provider-chat-booking-button">
                    <Icon name="calendar" size={18} /> View booking
                  </button>
                  <button type="button" className="provider-chat-more">⋮</button>
                </div>

                <div className="provider-chat-body">
                  {chatLoading ? (
                    <div className="provider-message-empty">Loading conversation...</div>
                  ) : conversation.messages.map((item, index) => {
                    const showDate =
                      index === 0 ||
                      new Date(item.createdAt).toDateString() !== new Date(conversation.messages[index - 1].createdAt).toDateString();

                    return (
                      <div key={item.id}>
                        {showDate && <div className="provider-chat-date">{formatDate(item.createdAt)}</div>}
                        <div className={"provider-chat-message " + (item.isMine ? "outgoing" : "incoming")}>
                          {!item.isMine && <Avatar customer={conversation.customer} />}
                          <div>
                            <p>{item.content}</p>
                            <small>{formatTime(item.createdAt)}</small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form className="provider-chat-input" onSubmit={handleSend}>
                  <button type="button" className="provider-attach-button" aria-label="Attach file">⌕</button>
                  <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a message..." disabled={sending} />
                  <button type="button" className="provider-emoji-button" aria-label="Emoji">☺</button>
                  <button type="submit" disabled={sending || !message.trim()}>Send</button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </ProviderShell>
  );
}
