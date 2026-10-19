import { Link } from "react-router-dom";

function HeartIcon({ filled = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" /></svg>;
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
  return <article className={`group min-w-0 overflow-hidden rounded-[10px] border border-[#484848] bg-[#242424] p-1.5 text-[#f5f5f5] ${isList ? "grid grid-cols-[minmax(112px,224px)_minmax(0,1fr)] gap-3 sm:grid-cols-[224px_minmax(0,1fr)_232px] sm:gap-5 sm:p-2.5" : "flex h-[370px] flex-col max-[639px]:h-[320px]"} ${className}`}>
    <div className={`relative min-w-0 overflow-hidden rounded-[7px] bg-[#303030] ${isList ? "h-[156px] sm:h-[156px]" : "mx-0.5 mt-0.5 aspect-square w-auto shrink-0"}`}>
      <Link to={href} className="absolute inset-0 block">
        {image ? <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" onError={e => {e.currentTarget.style.display="none";e.currentTarget.nextElementSibling?.classList.remove("hidden");}}/> : null}
        <span className={image ? "hidden absolute inset-0 items-center justify-center text-4xl text-slate-400" : "absolute inset-0 flex items-center justify-center text-4xl text-slate-400"}>{type === "service" ? "✳" : "◇"}</span>
        {onSave && <button type="button" aria-label={saved ? `Unsave ${title}` : `Save ${title}`} aria-pressed={saved} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onSave(event); }} className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#242424]/90 text-white shadow-sm transition-colors hover:text-brand ${saved ? "text-brand" : ""}`}><span className="[&>svg]:h-[15px] [&>svg]:w-[15px]"><HeartIcon filled={saved}/></span></button>}
        <span className="absolute bottom-2 left-2 max-w-[80%] truncate rounded-[4px] bg-[#168653] px-2 py-1 text-[10px] font-medium text-white">{item.category || (type === "service" ? "Service" : "Product")}</span>
      </Link>
    </div>
    <div className={`flex min-w-0 flex-col ${isList ? "py-1 sm:py-2" : "flex-1 px-1 pt-2"}`}>
      <Link to={href} className="line-clamp-2 text-[13px] font-bold leading-[17px] tracking-[-0.015em] text-[#f5f5f5] hover:text-white max-[639px]:text-[11px] max-[639px]:leading-[14px]">{title}</Link>
      <p className={`truncate font-bold tracking-[-0.02em] text-[#f5f5f5] ${isList ? "mt-auto pt-2 text-[19px]" : "mt-1.5 text-[16px] max-[639px]:mt-1 max-[639px]:text-[13px]"}`}>{price}</p>
      <div className={`flex min-w-0 items-center gap-1.5 text-[10px] text-[#bcbcbc] max-[639px]:gap-1 max-[639px]:text-[9px] ${isList ? "mt-2" : "mt-auto pt-2 max-[639px]:pt-1"}`}>
        <span className="min-w-0 truncate">{location}</span>
      </div>
    </div>
    {showPrimaryAction && onPrimaryAction && <div className={`flex shrink-0 flex-col justify-end gap-2 ${isList ? "col-span-2 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:px-2 sm:py-2"  : "mt-3 max-[639px]:mt-2"}`}>
      {isList && onQuantityChange && <div className="flex items-center justify-end gap-3 text-sm font-semibold text-ink"><button type="button" aria-label="Decrease quantity" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="h-8 w-8 rounded-full bg-[#f2f4f7] text-base" disabled={quantity <= 1}>−</button><span className="min-w-4 text-center">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => onQuantityChange(quantity + 1)} className="h-11 w-11 rounded-full bg-[#f2f4f7] text-lg">+</button></div>}
      <button type="button" onClick={onPrimaryAction} disabled={primaryDisabled} className="flex h-[40px] w-full items-center justify-center gap-2 rounded-[11px] bg-[#008d50] px-3 text-[12px] font-bold text-white transition-colors hover:bg-[#007843] disabled:cursor-not-allowed disabled:opacity-60 max-[639px]:h-[34px] max-[639px]:gap-1 max-[639px]:rounded-[9px] max-[639px]:px-2 max-[639px]:text-[10px]"><span className="flex h-full w-9 items-center justify-center border-r border-white/20 max-[639px]:w-6"><span className="[&>svg]:h-[18px] [&>svg]:w-[18px] max-[639px]:[&>svg]:h-[15px] max-[639px]:[&>svg]:w-[15px]"><CartIcon/></span></span>{primaryLabel || (type === "service" ? "Book Now" : "Add to Cart")}</button>
    </div>}
  </article>;
}
