import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../data/marketplaceApi";
import { useCart, parsePrice, formatNaira } from "../context/CartContext";

function Icon({ name, size = 22 }) {
  const paths = {
    cart:<><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20.5 7H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></>,
    truck:<><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.7"/><circle cx="18" cy="19" r="1.7"/></>,
    pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.3"/></>,
    card:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>,
    bank:<><path d="m3 9 9-5 9 5"/><path d="M5 10v7M9 10v7M15 10v7M19 10v7M3 19h18"/></>,
    phone:<><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></>,
    shield:<path d="M12 3 20 6v5c0 5-3.3 8.7-8 10-4.7-1.3-8-5-8-10V6l8-3Z"/>,
    package:<><path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z"/><path d="m4 8 8 4 8-4M12 12v9"/></>,
    help:<><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-.9.8-1.6 1.2-1.6 2.8M12 17h.01"/></>,
    arrow:<path d="M5 12h14M13 6l6 6-6 6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function ProductThumb({ product }) {
  const image = Array.isArray(product.images) ? product.images[0] : Array.isArray(product.gallery) ? product.gallery[0] : null;
  return <div className={"flex h-[106px] w-[106px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] " + (product.imageTone || "bg-[#f1f1ef]")}>
    {image ? <img src={image} alt={product.title} className="h-full w-full object-cover"/> : <span className="text-[36px] font-bold text-[#27335f]/30">M</span>}
  </div>;
}

function Option({ selected, onClick, icon, title, description }) {
  return <button type="button" onClick={onClick} className={"flex w-full items-center gap-4 rounded-[9px] border p-4 text-left " + (selected ? "border-[#07863a] bg-[#f0fbf3]" : "border-[#e0e6ed] bg-white")}>
    <span className={"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 " + (selected ? "border-[#07863a]" : "border-[#b8c1d0]")}>{selected && <span className="h-2.5 w-2.5 rounded-full bg-[#07863a]"/>}</span>
    <Icon name={icon} size={27}/><span><strong className="block text-[14px] text-[#10183f]">{title}</strong><span className="text-[12px] text-[#69739a]">{description}</span></span>
  </button>;
}

export default function CheckoutPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState("delivery");
  const [payment, setPayment] = useState("card");
  const [address, setAddress] = useState("Lekki Phase 1, Lagos");

  useEffect(() => { getProductById(id).then(setProduct); }, [id]);

  if (!product) return <main className="flex min-h-[60vh] items-center justify-center text-sm text-[#69739a]">Loading checkout...</main>;

  const productTotal = parsePrice(product.price) * quantity;
  const deliveryFee = delivery === "delivery" ? 2000 : 0;
  const total = productTotal + deliveryFee;

  return <main className="w-full bg-[#fbfcfd] px-4 pb-14 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1400px] pt-5">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-[#69739a]"><Link to="/">Home</Link><span>›</span><Link to="/products">Products</Link><span>›</span><span>{product.category}</span><span>›</span><span>{product.title}</span><span>›</span><span>Buy now</span></nav>
      <h1 className="text-[32px] font-bold tracking-[-0.045em] text-[#10183f]">Buy this product</h1>
      <p className="text-[16px] text-[#69739a]">Review your item, delivery details, and payment information to complete your purchase.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
        <div className="space-y-5">
          <section className="rounded-[10px] border border-[#e1e6ec] bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="text-[20px] font-bold text-[#10183f]">Product</h2><Link to={"/products/" + product.id} className="text-[14px] text-[#0759e8]">← Back to product</Link></div>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <ProductThumb product={product}/>
              <div className="min-w-[220px] flex-1"><h3 className="text-[18px] font-semibold text-[#10183f]">{product.title}</h3><p className="mt-1 text-[25px] font-bold text-[#10183f]">{product.price}</p><p className="mt-1 text-[13px] text-[#69739a]">Sold by <strong>{product.seller}</strong></p><p className="mt-2 flex items-center gap-2 text-[13px] text-[#69739a]"><Icon name="pin" size={18}/>{product.location}</p><p className="mt-2 text-[12px] text-[#f4ad00]">★ <span className="text-[#10183f]">{product.rating ?? "New"}</span> <span className="text-[#69739a]">({product.reviews ?? 0} reviews)</span></p></div>
              <div><span className="text-[13px] font-semibold text-[#10183f]">Quantity</span><div className="mt-2 flex h-11 overflow-hidden rounded-[8px] border border-[#dce2e9]"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 text-lg">−</button><span className="flex w-12 items-center justify-center border-x">{quantity}</span><button onClick={() => setQuantity(Math.min(quantity + 1, product.stockCount || 99))} className="w-12 text-lg">+</button></div></div>
            </div>
          </section>

          <section className="rounded-[10px] border border-[#e1e6ec] bg-white p-5"><h2 className="text-[20px] font-bold text-[#10183f]">Delivery information</h2><p className="text-[14px] text-[#69739a]">Choose how you want to receive your order.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><Option selected={delivery==="delivery"} onClick={() => setDelivery("delivery")} icon="truck" title="Deliver to my address" description="Get it delivered to your location"/><Option selected={delivery==="pickup"} onClick={() => setDelivery("pickup")} icon="package" title="Pick up from seller" description={"Pick up at seller's location in " + product.location}/></div>
            {delivery === "delivery" && <><div className="mt-4 flex items-center justify-between"><div className="flex gap-3"><Icon name="pin" size={26}/><div><strong className="block text-[14px] text-[#10183f]">{address}</strong><span className="text-[12px] text-[#69739a]">Block A, Freedom Way, Lekki Phase 1, Lagos</span></div></div><button onClick={() => setAddress(address === "Lekki Phase 1, Lagos" ? "Ikeja, Lagos" : "Lekki Phase 1, Lagos")} className="rounded-[8px] border px-5 py-3 text-[13px]">Change</button></div><div className="mt-4 rounded-[9px] bg-[#eaf9ee] p-4"><div className="flex gap-3 text-[#087d35]"><Icon name="truck" size={24}/><div><strong className="block text-[13px]">Estimated delivery: {product.deliveryEstimate}</strong><span className="text-[11px] text-[#69739a]">Delivery fee will be calculated at checkout based on your location.</span></div></div></div></>}
          </section>

          <section className="rounded-[10px] border border-[#e1e6ec] bg-white p-5"><h2 className="text-[20px] font-bold text-[#10183f]">Payment method</h2><p className="text-[14px] text-[#69739a]">Choose how you want to pay.</p><div className="mt-4 space-y-2"><Option selected={payment==="card"} onClick={() => setPayment("card")} icon="card" title="Card payment" description="Pay with your debit or credit card"/><Option selected={payment==="bank"} onClick={() => setPayment("bank")} icon="bank" title="Bank transfer" description="Pay directly from your bank account"/><Option selected={payment==="ussd"} onClick={() => setPayment("ussd")} icon="phone" title="USSD / Mobile money" description="Pay with USSD or mobile money"/></div></section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[10px] border border-[#e1e6ec] bg-white p-5"><h2 className="text-[22px] font-bold text-[#10183f]">Order summary</h2><div className="mt-4 flex gap-4"><ProductThumb product={product}/><div><h3 className="text-[15px] font-semibold">{product.title}</h3><p className="mt-2 text-[22px] font-bold">{product.price}</p><p className="text-[12px] text-[#69739a]">Qty: {quantity}</p></div></div><div className="mt-4 border-t pt-4 text-[14px]"><div className="flex justify-between"><span>Product total</span><strong>{formatNaira(productTotal)}</strong></div><div className="mt-3 flex justify-between"><span>Delivery fee</span><strong>{formatNaira(deliveryFee)}</strong></div><div className="mt-4 flex justify-between rounded-[8px] bg-[#eaf9ee] p-4 text-[18px] font-bold text-[#087d35]"><span>Total</span><span>{formatNaira(total)}</span></div><button onClick={() => alert("Order flow ready for " + product.title)} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#087d35] font-semibold text-white">Place order <Icon name="arrow" size={18}/></button><button onClick={() => addItem(product, quantity)} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-[#07863a] text-[#07863a]"><Icon name="cart" size={19}/> Add to cart instead</button></div></section>
          <section className="rounded-[10px] border border-[#e1e6ec] bg-white p-5 space-y-4"><div className="flex gap-4"><Icon name="shield" size={28}/><div><strong>Secure checkout</strong><p className="text-[12px] text-[#69739a]">Your information is protected</p></div></div><div className="flex gap-4"><Icon name="package" size={28}/><div><strong>Easy returns</strong><p className="text-[12px] text-[#69739a]">{product.buyerProtection}</p></div></div></section>
          <section className="rounded-[10px] border border-[#e1e6ec] bg-white p-5"><div className="flex gap-4"><Icon name="help" size={28}/><div><strong>Need help?</strong><p className="text-[12px] text-[#69739a]">Our support team is here to help.</p></div></div><button className="mt-4 h-11 w-full rounded-[8px] border text-[#0759e8]">Contact support →</button></section>
        </aside>
      </div>
    </div>
  </main>;
}
