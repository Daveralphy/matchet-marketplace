function Icon({ name, size = 52, strokeWidth = 1.45 }) {
  const paths = {
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    sofa: <><path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" /><path d="M4 11a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2H4Z" /><path d="M4 17v3M20 17v3M7 11h10" /></>,
    monitor: <><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M9 21h6M12 17v4" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function MarketplaceProductVisual({ product, className = "", size = "standard" }) {
  const icon = product?.icon === "bag" ? "bag" : product?.icon === "home" ? "sofa" : "monitor";
  const dimensions = size === "large" ? "h-[152px]" : size === "checkout" ? "h-[106px] w-[106px]" : "h-[116px] w-[116px]";

  return (
    <div className={"flex " + dimensions + " shrink-0 items-center justify-center overflow-hidden rounded-[9px] " + (product?.imageTone || "bg-[#f1f1ef]") + " " + className}>
      {product?.images?.[0] || product?.gallery?.[0] ? (
        <img
          src={product.images?.[0] || product.gallery?.[0]}
          alt={product.title || ""}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className={"flex items-center justify-center rounded-[24px] bg-white/65 text-[#27335f] shadow-[0_8px_20px_rgba(16,24,63,0.08)] " + (size === "large" ? "h-[86px] w-[86px]" : "h-[64px] w-[64px]")}>
          <Icon name={icon} size={size === "large" ? 52 : 38} />
        </div>
      )}
    </div>
  );
}
