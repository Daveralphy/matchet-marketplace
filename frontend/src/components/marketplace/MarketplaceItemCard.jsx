import { Link } from "react-router-dom";

function HeartIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" /></svg>;
}

/**
 * Shared marketplace item card. All marketplace discovery pages use this
 * presentation so dimensions and visual hierarchy cannot drift page-to-page.
 * Data and action handlers remain owned by each page.
 */
export function MarketplaceItemCard({
  item,
  view = "grid",
  saved = false,
  onSave,
  onPrimaryAction,
  primaryLabel,
  primaryDisabled = false,
  primaryIcon = "cart",
  showPrimaryAction = true,
  showRating = true,
  sellerLabel,
  className = "",
}) {
  const isList = view === "list";
  const title = item.title || item.name || "Marketplace item";
  const image = item.image || item.gallery?.[0] || item.images?.find?.((entry) => entry?.isPrimary)?.url || item.images?.[0]?.url || "";
  const rating = Number(item.rating) || 0;
  const reviews = Number(item.reviews ?? item.reviewCount ?? 0);
  const category = item.category || (item.type === "service" ? "Service" : "Product");
  const href = item.href || (item.type === "service" ? `/services/${item.id}` : item.type === "provider" ? `/services?q=${encodeURIComponent(title)}` : `/products/${item.id}`);
  const actionName = primaryIcon === "calendar" ? "Book Now" : "Add to Cart";

  return (
    <article className={`group min-w-0 overflow-hidden rounded-[22px] bg-white p-3.5 shadow-[0_8px_26px_rgba(16,24,63,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(16,24,63,0.13)] ${isList ? "grid grid-cols-[116px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[156px_minmax(0,1fr)_190px] sm:gap-5 sm:p-4" : "flex h-[465px] flex-col"} ${className}`}>
      <Link to={href} className={`relative block shrink-0 overflow-hidden rounded-[16px] bg-[#edf1ed] ${isList ? "h-[116px] w-[116px] sm:h-[156px] sm:w-[156px]" : "h-[235px] w-full"}`}>
        {image ? <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span className="absolute inset-0 flex items-center justify-center text-3xl text-[#10183f]/30" aria-hidden="true">{item.type === "service" ? "✳" : "◇"}</span>}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#10183f]/70 via-[#10183f]/20 to-transparent" />
        <span className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#10183f] shadow-sm">{category}</span>
      </Link>

      {onSave && <button type="button" aria-label={saved ? `Unsave ${title}` : `Save ${title}`} aria-pressed={saved} onClick={onSave} className={`z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-[0_3px_10px_rgba(16,24,63,0.12)] transition-all ${isList ? "col-start-1 row-start-1 ml-auto -mt-1 mr-1 self-start" : "absolute right-6 top-6"} ${saved ? "bg-[#10183f] text-white" : "bg-white text-[#10183f] hover:text-[#07863a]"}`}><HeartIcon size={19} /></button>}

      <div className={isList ? "col-start-2 row-start-1 min-w-0 py-1" : "flex min-h-0 flex-1 flex-col pt-3"}>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-[10px] font-medium text-[#6f7899]">{sellerLabel || item.seller || item.businessName || item.providerName || category}</span>
          {showRating && <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#10183f]"><span className="text-[#f4b400]">★</span>{rating.toFixed(1)}{reviews > 0 && <span className="font-normal text-[#7b84a3]">({reviews})</span>}</span>}
        </div>
        <Link to={href} className="mt-2 line-clamp-2 min-h-[40px] text-[15px] font-bold leading-5 tracking-[-0.015em] text-[#10183f] hover:text-[#07863a]">{title}</Link>
        <p className="mt-1.5 truncate text-[19px] font-bold tracking-[-0.02em] text-[#07863a]">{item.price || item.formattedPrice || ""}</p>
        <div className="mt-auto flex min-w-0 items-center gap-2 pt-3 text-[10px] text-[#7b84a3]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#edf1ed] text-[10px] font-semibold text-[#10183f]">{item.sellerImage ? <img src={item.sellerImage} alt="" className="h-full w-full object-cover" /> : (item.sellerInitial || item.seller || item.businessName || "M").slice(0, 1)}</span>
          <span className="min-w-0 truncate text-[#10183f]">{item.seller || item.businessName || item.providerName || "Matchet seller"} <span className="text-[#7b84a3]">· {item.location || "Location not specified"}</span></span>
        </div>
        {showPrimaryAction && onPrimaryAction && <button type="button" onClick={onPrimaryAction} disabled={primaryDisabled} className={`mt-3 flex h-12 shrink-0 items-center justify-center gap-3 rounded-[13px] bg-[#078b4b] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#067940] disabled:cursor-not-allowed disabled:opacity-70 ${isList ? "col-span-2 w-full sm:col-span-1 sm:col-start-3 sm:row-span-1 sm:row-start-1 sm:mt-0" : "w-full"}`}><span className="flex h-full w-10 items-center justify-center border-r border-white/15">{primaryIcon === "calendar" ? "▣" : "🛒"}</span>{primaryLabel || actionName}</button>}
      </div>
    </article>
  );
}
