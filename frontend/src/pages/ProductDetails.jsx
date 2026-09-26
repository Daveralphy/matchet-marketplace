import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MarketplaceLayout from "../components/layout/MarketplaceLayout";
import { getProductById, getRelatedProducts } from "../data/marketplaceApi";

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    chevronLeft: <path d="m14 5-7 7 7 7" />,
    chevronRight: <path d="m10 5 7 7-7 7" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    heart: <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />,
    cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L20 8H6" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></>,
    shield: <path d="M12 3 20 6v5c0 5-3.3 8.7-8 10-4.7-1.3-8-5-8-10V6l8-3Z" />,
    package: <><path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z" /><path d="m4 8 8 4 8-4M12 12v9" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="1.7" /><circle cx="18" cy="19" r="1.7" /></>,
    store: <path d="M4 10h16M6 10v9h12v-9M5 10l2-5h10l2 5M9 14h6" />,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    share: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v5h14v-5" /></>,
    flag: <><path d="M5 21V4" /><path d="M5 5c5-3 7 3 14 0v9c-7 3-9-3-14 0" /></>,
    pin: <><path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.3" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ProductVisual({ product, large = false, index = 0 }) {
  const icon = product?.icon === "bag" ? "store" : product?.icon === "home" ? "package" : "package";

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-[10px] ${large ? "h-[410px] sm:h-[480px]" : "h-[86px]"} ${product?.imageTone || "bg-[#f1f1ef]"}`}>
      <div className={`relative flex items-center justify-center rounded-[28px] bg-white/65 shadow-[0_12px_30px_rgba(16,24,63,0.1)] ${large ? "h-[190px] w-[190px]" : "h-[52px] w-[52px]"}`}>
        <Icon name={icon} size={large ? 112 : 30} strokeWidth={1.35} />
        {large && (
          <span className="absolute bottom-3 right-3 rounded-full bg-[#10183f] px-3 py-1 text-[11px] text-white">
            {index + 1} / {product.galleryCount || 6}
          </span>
        )}
      </div>
    </div>
  );
}

function Stars({ rating }) {
  const count = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return <span className="tracking-[-0.12em] text-[#f5a900]">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

function ProductDetail({ product, related }) {
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);

  return (
    <main className="w-full bg-[#fbfcfd] px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1470px] pt-5">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-[#69739a]">
          <Link to="/" className="hover:text-[#07863a]">Home</Link>
          <span>›</span>
          <Link to="/products" className="hover:text-[#07863a]">Products</Link>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span className="truncate">{product.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <section>
            <div className="relative">
              <button type="button" className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md">
                <Icon name="chevronLeft" />
              </button>
              <ProductVisual product={product} large />
              <button type="button" className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md">
                <Icon name="chevronRight" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-6 gap-2">
              {Array.from({ length: Math.min(product.galleryCount || 6, 6) }).map((_, index) => (
                <ProductVisual key={index} product={product} index={index} />
              ))}
              <button type="button" className="flex h-[86px] flex-col items-center justify-center rounded-[9px] border border-[#dce2e9] bg-white text-[#10183f]">
                <span className="text-xl">＋</span>
                <span className="text-[10px]">View all</span>
              </button>
            </div>

            <div className="mt-16 flex gap-8 text-[12px] text-[#10183f]">
              <button type="button" className="flex items-center gap-2"><Icon name="share" /> Share this product</button>
              <button type="button" className="flex items-center gap-2"><Icon name="flag" /> Report product</button>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-[0_8px_28px_rgba(16,24,63,0.035)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium text-[#69739a]">{product.category}</p>
                  <h1 className="mt-1 text-[31px] font-bold leading-[1.05] tracking-[-0.045em] text-[#10183f] sm:text-[38px]">{product.title}</h1>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-[13px]">
                <Stars rating={product.rating} />
                <strong className="text-[#10183f]">{Number(product.rating).toFixed(1)}</strong>
                <span className="text-[#69739a]">({product.reviews ?? 0} reviews)</span>
              </div>

              <p className="mt-3 text-[14px] leading-6 text-[#69739a]">{product.description}</p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-[30px] font-bold tracking-[-0.04em] text-[#10183f]">{product.price}</p>
                <span className="rounded-[8px] bg-[#e7f8ec] px-3 py-2 text-[11px] font-medium text-[#07863a]">
                  ● {product.stockCount > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-[13px] font-semibold text-[#10183f]">Quantity</span>
                <div className="flex h-11 overflow-hidden rounded-[8px] border border-[#dfe5ec]">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="w-11 text-lg">−</button>
                  <span className="flex w-14 items-center justify-center border-x border-[#dfe5ec] text-[13px]">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} className="w-11 text-lg">+</button>
                </div>
                <button type="button" onClick={() => setSaved((value) => !value)} className="ml-auto flex h-11 items-center gap-2 rounded-[8px] border border-[#dfe5ec] px-4 text-[12px] font-medium text-[#10183f]">
                  <Icon name="heart" /> {saved ? "Saved" : "Save"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" className="flex h-13 items-center justify-center gap-2 rounded-[8px] border border-[#07863a] bg-white font-medium text-[#07863a]">
                  <Icon name="cart" /> Add to cart
                </button>
                <button type="button" className="h-13 rounded-[8px] bg-[#087d35] font-medium text-white">Buy now</button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#edf0f3] pt-5">
                {[
                  { icon: "shield", title: "Secure checkout", text: "Your information is protected" },
                  { icon: "package", title: "Easy returns", text: product.buyerProtection },
                  { icon: "star", title: "Buyer protection", text: "Shop with confidence" },
                ].map((item) => (
                  <div key={item.title} className="text-[10px] text-[#69739a]">
                    <Icon name={item.icon} size={23} strokeWidth={1.8} />
                    <p className="mt-1 font-semibold text-[#10183f]">{item.title}</p>
                    <p className="mt-0.5 leading-4">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-[0_8px_28px_rgba(16,24,63,0.035)] sm:p-6">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#10183f]"><Icon name="truck" /> Delivery & availability</div>
              <div className="mt-4 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-2"><Icon name="pin" /> {product.location}</span>
                <button type="button" className="text-[#0759e8]">Change location</button>
              </div>
              <div className="mt-4 rounded-[9px] bg-[#eaf9ee] p-4">
                <div className="flex gap-3"><Icon name="truck" size={24} />
                  <div><p className="text-[13px] font-medium text-[#087d35]">Available for delivery</p><p className="mt-1 text-[11px] text-[#69739a]">Estimated delivery: {product.deliveryEstimate}</p><p className="mt-1 text-[10px] text-[#7b84a3]">Delivery fee {product.deliveryFee.toLowerCase()}</p></div>
                </div>
              </div>
              {product.pickupAvailable && (
                <div className="mt-3 flex items-center justify-between rounded-[9px] border border-[#e4e8ee] p-4">
                  <div className="flex gap-3"><Icon name="store" size={23} /><div><p className="text-[13px] font-medium text-[#10183f]">Pickup available</p><p className="mt-1 text-[11px] text-[#69739a]">Pick up from seller's location in {product.location}</p></div></div>
                  <Icon name="chevronRight" />
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-7 border-t border-[#e1e6ec] pt-7">
          <div className="flex items-end justify-between gap-4">
            <div><h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#10183f] sm:text-[28px]">You might also like</h2><p className="mt-1 text-[13px] text-[#69739a]">More products similar to this one.</p></div>
            <Link to="/products" className="hidden text-[12px] font-medium text-[#0759e8] sm:block">View more products in {product.category} →</Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} to={`/products/${item.id}`} className="rounded-[10px] border border-[#e4e8ee] bg-white p-2.5">
                <ProductVisual product={item} />
                <h3 className="mt-2 truncate text-[12px] font-medium text-[#10183f]">{item.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-[10px]"><Stars rating={item.rating} /><span>{Number(item.rating).toFixed(1)}</span><span className="text-[#7b84a3]">({item.reviews ?? 0})</span></div>
                <p className="mt-2 text-[15px] font-bold text-[#10183f]">{item.price}</p>
                <p className="mt-1 truncate text-[10px] text-[#69739a]">{item.seller} · {item.location}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([getProductById(id), getRelatedProducts(id)]).then(([nextProduct, nextRelated]) => {
      if (!active) return;
      setProduct(nextProduct);
      setRelated(nextRelated);
    });
    return () => { active = false; };
  }, [id]);

  if (!product) {
    return <main className="flex min-h-[60vh] items-center justify-center text-sm text-[#69739a]">Loading product...</main>;
  }

  return <ProductDetail product={product} related={related} />;
}
