import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getPublicSellerStore } from "../api/provider";
import "../styles/public-store.css";

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function PublicSellerStore() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicSellerStore(slug)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.message || "Unable to load this store."));
  }, [slug]);

  if (error) {
    return (
      <ProviderShell mode="seller">
        <div className="public-store-error">
          <h2>{error}</h2>
          <button onClick={() => nav("/seller/profile")}>Back to profile</button>
        </div>
      </ProviderShell>
    );
  }

  if (!data) {
    return (
      <ProviderShell mode="seller">
        <div className="public-store-loading">Loading store...</div>
      </ProviderShell>
    );
  }

  const { s, stats, products } = data;

  return (
    <ProviderShell mode="seller">
      <div className="public-store">
        <button className="ps-back" onClick={() => nav("/seller/profile")}>
          ← Back to profile
        </button>

        <header className="ps-head">
          <div>
            <h1>Profile</h1>
            <p>This is how your store appears to customers on Matchet.</p>
          </div>
          <button onClick={() => nav("/seller/profile")}>
            <Icon name="edit" /> Edit store
          </button>
        </header>

        <div className="ps-banner">
          {s.banner?.url ? (
            <img src={s.banner.url} alt="Store banner" />
          ) : (
            <div className="ps-banner-placeholder" />
          )}
        </div>

        <section className="ps-store-head">
          <div className="ps-logo">
            {s.logo?.url ? (
              <img src={s.logo.url} alt="" />
            ) : (
              <span>{s.name?.slice(0, 1) || "S"}</span>
            )}
          </div>

          <div className="ps-info">
            <h2>
              {s.name} {s.verificationStatus === "verified" && <span>✓</span>}
            </h2>
            <b>{s.category || "Seller"}</b>
            <p>
              ⌖ {[s.location?.city, s.location?.country]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>
              {s.description || "This store has not added a description yet."}
            </p>

            <div className="ps-stats">
              <strong>
                {stats.products}
                <small>Products</small>
              </strong>
              <strong>
                {stats.rating || "—"}
                <small>Rating</small>
              </strong>
              <strong>
                {stats.followers ?? "—"}
                <small>Followers</small>
              </strong>
            </div>
          </div>

          <div className="ps-actions">
            <button>♙ Follow store</button>
            <button>⌯ Share store</button>
          </div>
        </section>

        <nav className="ps-tabs">
          <button className="active">Store</button>
          <button>Products</button>
          <button>Reviews</button>
          <button>About</button>
        </nav>

        <section className="ps-products">
          <div className="ps-section-head">
            <h2>Featured products</h2>
            <button>View all</button>
          </div>

          {products.length ? (
            <div className="ps-grid">
              {products.slice(0, 8).map((product) => (
                <article key={product.id}>
                  <div className="ps-product-image">
                    {product.image ? (
                      <img src={product.image} alt="" />
                    ) : (
                      <Icon name="grid" />
                    )}
                    <button>♡</button>
                  </div>

                  <h3>{product.name}</h3>
                  <small>{product.category}</small>
                  <b>{money(product.price)}</b>

                  <div className="ps-rating">
                    <span>
                      {"★".repeat(Math.round(product.rating || 0))}
                      {"☆".repeat(
                        Math.max(0, 5 - Math.round(product.rating || 0))
                      )}
                    </span>{" "}
                    {product.rating
                      ? String(product.rating) +
                        " (" +
                        product.reviewCount +
                        ")"
                      : "No reviews"}
                  </div>

                  <button className="ps-cart">🛒 Add to cart</button>
                </article>
              ))}
            </div>
          ) : (
            <div className="ps-empty">
              <Icon name="grid" />
              <h3>No products yet</h3>
              <p>This store has not published any products.</p>
            </div>
          )}
        </section>
      </div>
    </ProviderShell>
  );
}
