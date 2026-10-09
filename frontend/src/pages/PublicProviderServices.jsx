import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProviderById } from "../data/marketplaceApi";

function Stars({ rating }) {
  const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return <span className="tracking-[-0.12em] text-[#f5a900]">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service.id}`} className="group block min-w-0 rounded-[11px] border border-[#e5e9ef] bg-white p-2.5 shadow-[0_3px_12px_rgba(16,24,63,0.025)] transition-shadow hover:shadow-[0_8px_20px_rgba(16,24,63,0.07)]">
      <div className="relative">
        <div className={`relative h-[152px] overflow-hidden rounded-[8px] ${service.imageTone || "bg-[#eef2ef]"}`}>
          {service.image ? (
            <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[#69739a]">
              <span className="rounded-full bg-white/60 px-4 py-3 text-[10px] font-semibold">Service</span>
            </div>
          )}
        </div>
        <span className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-[#10183f] shadow-sm">
          <span className="mr-1 text-[#f4a900]">★</span>{Number(service.rating) > 0 ? Number(service.rating).toFixed(1) : "New"}
        </span>
      </div>

      <div className="px-0.5 pb-1 pt-2">
        <p className="truncate text-[9px] text-[#69739a]">{service.category}</p>
        <h2 className="mt-1 truncate text-[11px] font-medium leading-4 text-[#10183f] sm:text-[12px]">{service.title}</h2>
        <p className="mt-1 text-[13px] font-bold tracking-[-0.02em] text-[#10183f] sm:text-[14px]">{service.price}</p>
        <div className="mt-1.5 flex h-9 items-center gap-1.5">
          <span className="text-[13px] text-[#f4a900]">★</span>
          <span className="text-[10px] font-medium text-[#10183f]">{service.reviews > 0 ? Number(service.rating).toFixed(1) : "New"}</span>
          {service.reviews > 0 && <span className="text-[10px] text-[#7b84a3]">({service.reviews})</span>}
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[9px] text-[#7b84a3]">
          <span className="truncate">{service.location || "Location available on request"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function PublicProviderServices() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProviderById(id).then((data) => {
      if (active) {
        setProvider(data);
        setLoading(false);
      }
    }).catch(() => {
      if (active) {
        setProvider(null);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <main className="w-full px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1470px] pt-6">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-28 animate-pulse rounded-[14px] bg-slate-100" />
          <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-5">
            {[1,2,3,4].map((item) => <div key={item} className="h-[330px] animate-pulse rounded-[14px] bg-slate-100" />)}
          </div>
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="w-full px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1470px] pt-6">
          <nav className="text-[11px] text-[#69739a]"><Link to="/">Home</Link> <span className="mx-2">›</span> <Link to="/explore">Explore</Link> <span className="mx-2">›</span> Provider</nav>
          <div className="mt-8 rounded-[14px] border border-dashed border-[#d9dfe7] bg-white px-5 py-16 text-center">
            <h1 className="text-[16px] font-semibold text-[#10183f]">Provider not available</h1>
            <p className="mt-2 text-[11px] text-[#69739a]">This provider could not be found or is no longer available.</p>
            <Link to="/explore" className="mt-5 inline-flex rounded-[8px] bg-[#07863a] px-5 py-3 text-[11px] font-semibold text-white">Back to Explore</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1470px] pt-6">
        <nav className="text-[11px] text-[#69739a]">
          <Link to="/">Home</Link><span className="mx-2">›</span><Link to="/explore">Explore</Link><span className="mx-2">›</span><span>{provider.name}</span>
        </nav>

        <section className="mt-5 rounded-[14px] border border-[#e3e8ee] bg-white p-5 shadow-[0_8px_28px_rgba(16,24,63,0.035)] sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#eef1ef]">
              {provider.image ? <img src={provider.image} alt={provider.name} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-[#69739a]">{provider.initials}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[24px] font-bold tracking-[-0.035em] text-[#10183f]">{provider.name}</h1>
                {provider.verified && <span className="rounded-full bg-[#e7f8ec] px-2.5 py-1 text-[9px] font-semibold text-[#07863a]">Verified</span>}
              </div>
              <p className="mt-1 text-[11px] text-[#69739a]">{provider.businessName || provider.category}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#69739a]">
                <span>⌖ {provider.location || "Location available on request"}</span>
                <span>★ {provider.rating > 0 ? Number(provider.rating).toFixed(1) : "New"}{provider.reviews ? ` · ${provider.reviews} reviews` : ""}</span>
                <span>{provider.services.length} active service{provider.services.length === 1 ? "" : "s"}</span>
              </div>
              {provider.bio && <p className="mt-3 max-w-[850px] text-[12px] leading-5 text-[#69739a]">{provider.bio}</p>}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <h2 className="text-[25px] font-bold tracking-[-0.04em] text-[#10183f]">Services by {provider.name}</h2>
          <p className="mt-1 text-[12px] text-[#69739a]">Browse the active services currently offered by this provider.</p>
        </div>

        {provider.services.length ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {provider.services.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        ) : (
          <div className="mt-5 rounded-[14px] border border-dashed border-[#d9dfe7] bg-white px-5 py-16 text-center">
            <h3 className="text-[14px] font-semibold text-[#10183f]">No active services yet</h3>
            <p className="mx-auto mt-1 max-w-[440px] text-[11px] leading-5 text-[#69739a]">This provider does not currently have any active services available. Check back later or explore other providers.</p>
            <Link to="/explore" className="mt-5 inline-flex rounded-[8px] bg-[#07863a] px-5 py-3 text-[11px] font-semibold text-white">Explore other providers</Link>
          </div>
        )}
      </div>
    </main>
  );
}
