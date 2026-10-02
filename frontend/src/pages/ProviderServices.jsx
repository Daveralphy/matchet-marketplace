import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { createProviderService, getProviderServices, updateProviderService, deleteProviderService } from "../api/provider";
import "../styles/provider-dashboard.css";

function formatPrice(amount, currency) {
  if (amount === null || amount === undefined) return "Custom quote";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

function formatDuration(minutes) {
  if (!minutes) return "Not set";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return minutes + " min";
  if (!remainder) return hours + (hours === 1 ? " hour" : " hours");
  return hours + "h " + remainder + "m";
}

function statusLabel(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function ServiceImage({ service }) {
  if (service.image) {
    return <img src={service.image} alt="" />;
  }

  return <Icon name="grid" size={24} />;
}

export default function ProviderServices() {
  const [services, setServices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [menuService, setMenuService] = useState(null);

  const pageSize = 6;

  const emptyForm = { title: "", description: "", category: "", pricingType: "fixed", price: "", durationMinutes: "", images: [] };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getProviderServices();
        if (!active) return;
        setServices(response.data?.services || []);
        setSummary(response.data?.summary || null);
      } catch (requestError) {
        if (active) setError(requestError.message || "Unable to load your services.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    const next = services.filter((service) => {
      const matchesSearch =
        !query ||
        service.title?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category?.toLowerCase().includes(query);

      const matchesStatus = status === "all" || service.status === status;

      return matchesSearch && matchesStatus;
    });

    return next.sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      if (sort === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sort === "bookings") return Number(b.bookingsLast30Days || 0) - Number(a.bookingsLast30Days || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [services, search, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  return (
    <ProviderShell>
      <div className="provider-page provider-services-page">
        <div className="provider-heading">
          <div>
            <h1>Services</h1>
            <span>Manage your services, set prices, and showcase what you offer.</span>
          </div>
          <button className="provider-blue-button" type="button" onClick={() => { setEditingService(null); setForm(emptyForm); setShowForm(true); }}>
            <Icon name="plus" size={18} /> Add a new service
          </button>
        </div>

        {error && (
          <div className="provider-message-error" role="alert">
            {error}
            <button type="button" onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="provider-stat-grid">
          <div className="provider-stat">
            <div className="provider-stat-icon calendar"><Icon name="grid" /></div>
            <strong>{summary?.activeServices ?? 0}</strong>
            <b>Active services</b>
            <span>Currently published</span>
          </div>
          <div className="provider-stat">
            <div className="provider-stat-icon calendar"><Icon name="settings" /></div>
            <strong>{summary?.pausedServices ?? 0}</strong>
            <b>Paused services</b>
            <span>Currently paused</span>
          </div>
          <div className="provider-stat">
            <div className="provider-stat-icon user"><Icon name="eye" /></div>
            <strong>{Number(summary?.totalViews || 0).toLocaleString()}</strong>
            <b>Total views</b>
            <span>Recorded service views</span>
          </div>
          <div className="provider-stat">
            <div className="provider-stat-icon star"><Icon name="calendar" /></div>
            <strong>{summary?.totalBookings ?? 0}</strong>
            <b>Total bookings</b>
            <span>Last 30 days</span>
          </div>
        </div>

        <div className="provider-table-card provider-services-table-card">
          <div className="provider-services-toolbar">
            <div className="provider-services-search">
              <Icon name="search" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
              />
            </div>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="bookings">Sort by: Bookings</option>
              <option value="price-high">Sort by: Highest price</option>
              <option value="price-low">Sort by: Lowest price</option>
            </select>
          </div>

          <div className="provider-services-header">
            <span>Service</span>
            <span>Category</span>
            <span>Price</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Bookings</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="provider-services-loading">Loading your services...</div>
          ) : visibleServices.length === 0 ? (
            <div className="provider-message-empty provider-services-empty">
              <Icon name="grid" size={32} />
              <strong>No services found</strong>
              <p>
                {services.length
                  ? "Try changing your search or status filter."
                  : "Your services will appear here after you create them."}
              </p>
            </div>
          ) : (
            <div className="provider-services-rows">
              {visibleServices.map((service) => (
                <div className="provider-service-row-new" key={service.id}>
                  <div className="provider-service-info">
                    <div className="provider-service-image">
                      <ServiceImage service={service} />
                    </div>
                    <div>
                      <strong>{service.title}</strong>
                      <small>{service.description}</small>
                    </div>
                  </div>
                  <span className="provider-service-category">{service.category || "Uncategorized"}</span>
                  <b>{formatPrice(service.price, service.currency)}</b>
                  <span>{formatDuration(service.durationMinutes)}</span>
                  <span className={"status " + service.status}>{statusLabel(service.status)}</span>
                  <span>{service.bookingsLast30Days ?? 0}</span>
                  <div className="provider-service-actions">
                    <div className="provider-service-actions-menu-wrap">
                      <button type="button" aria-label={"More actions for " + service.title} onClick={() => setMenuService(menuService === service.id ? null : service.id)}>⋮</button>
                      {menuService === service.id && (
                        <div className="provider-service-actions-menu">
                          <button type="button" onClick={() => { setEditingService(service); setForm({ title: service.title || "", description: service.description || "", category: service.category || "", pricingType: service.pricingType || "fixed", price: service.price ?? "", durationMinutes: service.durationMinutes || "", images: service.images || [] }); setShowForm(true); setMenuService(null); }}>Edit service</button>
                          <button type="button" onClick={async () => { setMenuService(null); const next = service.status === "active" ? "paused" : service.status === "paused" ? "active" : "draft"; try { const response = await updateProviderService(service.id, { status: next }); const saved = response.service; setServices(current => current.map(item => item.id === service.id ? { ...item, status: saved.status } : item)); } catch (e) { setError(e.message || "Unable to change service status."); } }}>Change status: {service.status === "active" ? "Paused" : service.status === "paused" ? "Active" : "Draft"}</button>
                          <button type="button" className="danger" onClick={async () => { setMenuService(null); if (!window.confirm("Delete \"" + service.title + "\"? This cannot be undone.")) return; try { await deleteProviderService(service.id); setServices(current => current.filter(item => item.id !== service.id)); } catch (e) { setError(e.message || "Unable to delete service."); } }}>Delete service</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredServices.length > 0 && (
            <div className="provider-services-footer">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredServices.length)} of {filteredServices.length} services
              </span>
              <div>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={value === currentPage ? "active" : ""}
                    onClick={() => setPage(value)}
                  >
                    {value}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
        {showForm && (
          <div className="provider-service-modal-backdrop" role="presentation">
            <form className="provider-service-modal" onSubmit={async (event) => {
              event.preventDefault();
              setSaving(true);
              setError("");
              try {
                const payload = { ...form, price: form.pricingType === "customQuote" ? undefined : form.price };
                const response = editingService
                  ? await updateProviderService(editingService.id, payload)
                  : await createProviderService(payload);
                const saved = response.service;
                setServices((current) => editingService
                  ? current.map((item) => item.id === editingService.id ? { ...item, title: saved.title, description: saved.description, category: saved.category, price: saved.pricing?.amount ?? null, pricingType: saved.pricing?.type, durationMinutes: saved.durationMinutes, status: saved.status, image: saved.images?.find((image) => image.isPrimary)?.url || saved.images?.[0]?.url || null } : item)
                  : [{ id: saved._id, title: saved.title, description: saved.description, category: saved.category, price: saved.pricing?.amount ?? null, currency: saved.pricing?.currency, pricingType: saved.pricing?.type, durationMinutes: saved.durationMinutes, status: saved.status, bookingsLast30Days: 0, views: 0, image: saved.images?.find((image) => image.isPrimary)?.url || saved.images?.[0]?.url || null, createdAt: saved.createdAt }, ...current]);
                setShowForm(false);
              } catch (requestError) {
                setError(requestError.message || "Unable to save your service.");
              } finally {
                setSaving(false);
              }
            }}>
              <div className="provider-service-modal-head"><div><h2>{editingService ? "Edit service" : "Add a new service"}</h2><p>Publish the service you want customers to find on Matchet.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Close">×</button></div>
              <label>Service name<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <label>Description<textarea required rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <div className="provider-service-modal-grid"><label>Category<input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label><label>Pricing<select value={form.pricingType} onChange={(e) => setForm({ ...form, pricingType: e.target.value })}><option value="fixed">Fixed price</option><option value="startingFrom">Starting from</option><option value="customQuote">Custom quote</option></select></label></div>
              {form.pricingType !== "customQuote" && <label>Price<input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>}
              <label>Duration in minutes<input type="number" min="1" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} /></label>
              <label>
                Service images
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const selected = Array.from(e.target.files || []);
                    setForm((current) => ({
                      ...current,
                      images: [...(current.images || []), ...selected].slice(0, 6),
                    }));
                    e.target.value = "";
                  }}
                />
                <small className="provider-service-image-help">Add up to 6 images. Images are securely uploaded to Cloudinary when you publish.</small>
              </label>
              {form.images?.length > 0 && (
                <div className="provider-service-image-grid">
                  {form.images.map((image, index) => {
                    const preview = image instanceof File ? URL.createObjectURL(image) : image?.url;
                    return (
                      <div className="provider-service-image-preview" key={(image?.publicId || image?.url || image?.name || "image") + index}>
                        {preview ? <img src={preview} alt={form.title || "Service preview"} /> : <Icon name="grid" size={22} />}
                        {index === 0 && <span>Primary</span>}
                        <button
                          type="button"
                          onClick={() => setForm((current) => ({
                            ...current,
                            images: current.images.filter((_, imageIndex) => imageIndex !== index),
                          }))}
                          aria-label={"Remove image " + (index + 1)}
                        >×</button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="provider-service-modal-actions"><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button className="provider-blue-button" disabled={saving}>{saving ? "Saving..." : editingService ? "Save changes" : "Publish service"}</button></div>
            </form>
          </div>
        )}
      </div>
    </ProviderShell>
  );
}
