import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  clearSavedItems,
  getSavedItems,
  removeSavedItem,
} from "../api/marketplace";
import "./SavedItems.css";
import "./BuyerAccount.css";

export default function SavedItems() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("product");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    getSavedItems()
      .then(setItems)
      .catch((e) => setError(e.message || "Unable to load saved items."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const visible = useMemo(
    () => items.filter((item) => item.itemType === tab),
    [items, tab],
  );

  const remove = async (id) => {
    await removeSavedItem(id);
    setItems((current) => current.filter((item) => item._id !== id));
  };

  const clear = async () => {
    await clearSavedItems(tab);
    setItems((current) => current.filter((item) => item.itemType !== tab));
  };

  return (
    <main className="saved-items-page">
      <div className="saved-items-container">
        <nav className="saved-items-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Saved Items</span>
        </nav>

        <header className="saved-items-header">
          <h1>Saved Items</h1>
          <p>Keep track of products and services you love.</p>
        </header>

        <div className="saved-items-controls">
          <div className="saved-items-tabs">
            <button
              className={tab === "product" ? "saved-items-tab active" : "saved-items-tab"}
              onClick={() => setTab("product")}
            >
              Products <span className="saved-items-count">{items.filter((item) => item.itemType === "product").length}</span>
            </button>
            <button
              className={tab === "service" ? "saved-items-tab active" : "saved-items-tab"}
              onClick={() => setTab("service")}
            >
              Services <span className="saved-items-count">{items.filter((item) => item.itemType === "service").length}</span>
            </button>
          </div>

          {visible.length > 0 && (
            <button className="clear-all-button" onClick={clear}>
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <AccountLoading />
        ) : error ? (
          <AccountError message={error} onRetry={load} />
        ) : visible.length ? (
          <section className="saved-items-grid">
            {visible.map((item) => {
              const data =
                item.itemType === "product" ? item.productId : item.serviceId;
              const title = data?.title || data?.name || "Saved item";
              const image =
                data?.images?.[0]?.url ||
                data?.image?.url ||
                data?.image ||
                "";

              return (
                <article className="saved-item-card" key={item._id}>
                  <div className="saved-item-image-wrap">
                    {image && (
                      <img src={image} alt="" className="saved-item-image" />
                    )}
                  </div>
                  <div className="saved-item-content">
                    <small>{item.itemType === "product" ? "Product" : "Service"}</small>
                    <h2>{title}</h2>
                    <p>{data?.price || data?.pricing?.amount || ""}</p>
                    <button onClick={() => remove(item._id)}>Remove</button>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <Empty
            title={`No saved ${tab === "product" ? "products" : "services"} yet`}
            text="Save items you like and they will appear here on your account."
            action={tab === "product" ? "/products" : "/services"}
            label={`Explore ${tab === "product" ? "products" : "services"}`}
          />
        )}
      </div>
    </main>
  );
}

function AccountLoading() {
  return (
    <div className="buyer-empty">
      <h2>Loading your saved items...</h2>
      <p>Fetching your saved items.</p>
    </div>
  );
}

function AccountError({ message, onRetry }) {
  return (
    <div className="buyer-empty">
      <h2>Unable to load saved items</h2>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

function Empty({ title, text, action, label }) {
  return (
    <div className="buyer-empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to={action}>{label}</Link>
    </div>
  );
}
