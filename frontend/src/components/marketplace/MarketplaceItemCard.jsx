import { Link } from "react-router-dom";

function HeartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" /></svg>;
}
function PinIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
}
function CartIcon() {
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
}
export function MarketplaceItemCard({ item, view = "grid", onSave, saved = false, onPrimaryAction, primaryLabel, primaryDisabled = false, quantity = 1, onQuantityChange, description = "", showPrimaryAction = true, className = "" }) {
  const isList = view === "list";
  const title = item.title || item.name || "Marketplace item";
  const type = item.type === "service" ? "service" : "product";
  const href = type === "service" ? `/services/${item.id}` : `/products/${item.id}`;
  const image = item.image || item.gallery?.[0] || item.images?.find?.((entry) => entry?.isPrimary)?.url || item.images?.[0]?.url || "";
  const reviews = Number(item.reviews ?? item.reviewCount ?? 0);
  const rating = Number(item.rating) || 0;
  const seller = item.seller || item.businessName || item.providerName || "Matchet seller";
  const location = item.location || "Location not specified";
  const price = item.price || item.formattedPrice || "";
  return <article className={`group min-w-0 overflow-hidden rounded-[20px] bg-white p-3.5 shadow-[0_8px_28px_rgba(16,24,63,0.09)] ${isList ? "grid grid-cols-[minmax(112px,224px)_minmax(0,1fr)] gap-3 sm:grid-cols-[224px_minmax(0,1fr)_232px] sm:gap-5 sm:p-2.5" : "flex h-[450px] flex-col"} ${className}`}>
    <div className={`relative min-w-0 overflow-hidden rounded-[15px] bg-[#edf1ed] ${isList ? "h-[156px] sm:h-[156px]" : "h-[244px] w-full shrink-0"}`}>
      <Link to={href} className="absolute inset-0 block">
        {image ? <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" onError={e => {e.currentTarget.style.display="none";e.currentTarget.nextElementSibling?.classList.remove("hidden");}}/> : null}
        <span className={image ? "hidden absolute inset-0 items-center justify-center text-4xl text-slate-400" : "absolute inset-0 flex items-center justify-center text-4xl text-slate-400"}>{type === "service" ? "✳" : "◇"}</span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#10183f]/70 via-[#10183f]/20 to-transparent"/>
        <span className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-[#10183f]">{item.category || (type === "service" ? "Service" : "Product")}</span>
      </Link>
      {onSave && <button type="button" aria-label={saved ? `Unsave ${title}` : `Save ${title}`} aria-pressed={saved} onClick={onSave} className={`absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#10183f] shadow-sm transition-colors hover:text-[#07863a] ${saved ? "text-[#07863a]" : ""}`}><HeartIcon/></button>}
    </div>
    <div className={`flex min-w-0 flex-col ${isList ? "py-1 sm:py-2" : "flex-1 pt-3"}`}>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-[11px] text-[#71809f]">{item.category || (type === "service" ? "Service" : "Product")}</span>
        <span className="shrink-0 text-[12px] text-[#10183f]">{reviews > 0 ? <><span className="text-[#ffbf00]">★</span> {rating.toFixed(1)} <span className="text-[#8290ad]">({reviews})</span></> : <span className="text-[#8290ad]">New</span>}</span>
      </div>
      <Link to={href} className="mt-2 line-clamp-2 text-[17px] font-bold leading-[21px] tracking-[-0.02em] text-[#090f35] hover:text-[#07863a]">{title}</Link>
      {isList && description && <p className="mt-2 line-clamp-2 text-[14px] leading-5 text-[#71809f]">{description}</p>}
      <p className={`truncate font-bold tracking-[-0.02em] text-[#078b4b] ${isList ? "mt-auto pt-2 text-[22px]" : "mt-2 text-[20px]"}`}>{price}</p>
      <div className={`flex min-w-0 items-center gap-2 text-[12px] text-[#71809f] ${isList ? "mt-2" : "mt-auto pt-3"}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#17213e] text-[10px] text-white">{item.sellerImage ? <img src={item.sellerImage} alt="" className="h-full w-full object-cover"/> : "♙"}</span>
        <span className="min-w-0 truncate text-[#17213e]">{seller}</span>
        <span className="flex shrink-0 items-center gap-1"><PinIcon/><span className="hidden sm:inline">{location}</span></span>
      </div>
    </div>
    {showPrimaryAction && onPrimaryAction && <div className={`flex shrink-0 flex-col justify-end gap-2 ${isList ? "col-span-2 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:px-2 sm:py-2" : "mt-3"}`}>
      {isList && onQuantityChange && <div className="flex items-center justify-end gap-3 text-sm font-semibold text-[#10183f]"><button type="button" aria-label="Decrease quantity" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="h-11 w-11 rounded-full bg-[#f2f4f7] text-lg" disabled={quantity <= 1}>−</button><span className="min-w-4 text-center">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => onQuantityChange(quantity + 1)} className="h-11 w-11 rounded-full bg-[#f2f4f7] text-lg">+</button></div>}
      <button type="button" onClick={onPrimaryAction} disabled={primaryDisabled} className="flex h-[50px] w-full items-center justify-center gap-3 rounded-[14px] bg-[#008d50] px-4 text-[14px] font-bold text-white transition-colors hover:bg-[#007843] disabled:cursor-not-allowed disabled:opacity-60"><span className="flex h-full w-12 items-center justify-center border-r border-white/20"><CartIcon/></span>{primaryLabel || (type === "service" ? "Book Now" : "Add to Cart")}</button>
    </div>}
  </article>;
}
