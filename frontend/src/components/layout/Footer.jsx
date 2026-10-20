// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/matchet_logonamedark.png";

function FooterLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-[22px] font-semibold tracking-[-0.06em] text-white">
        matchet
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt="Matchet"
      className="h-[34px] w-auto object-contain"
      onError={() => setFailed(true)}
    />
  );
}

const loggedOutColumns = [
  {
    title: "Marketplace",
    links: [
      ["Explore", "/explore"],
      ["Products", "/products"],
      ["Services", "/services"],
      ["Categories", "/categories"],
      ["How It Works", "/how-it-works"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign In", "/login"],
      ["Create Account", "/create-account"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Safety Tips", "/safety"],
      ["Report a Problem", "/report-problem"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Sell & Offer",
    links: [
      ["List a Product", "/for-providers"],
      ["Offer a Service", "/for-providers"],
      ["Sell & Offer Resources", "/provider-resources"],
    ],
  },
];

const loggedInColumns = [
  {
    title: "Marketplace",
    links: [
      ["Explore", "/explore"],
      ["Products", "/products"],
      ["Services", "/services"],
      ["Categories", "/categories"],
      ["How It Works", "/how-it-works"],
    ],
  },
  {
    title: "My Matchet",
    links: [
      ["My Orders", "/orders"],
      ["My Bookings", "/bookings"],
      ["Saved Items", "/saved-items"],
      ["My Profile", "/profile"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Safety Tips", "/safety"],
      ["Report a Problem", "/report-problem"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Sell & Offer",
    links: [
      ["My Products", "/seller/products"],
      ["My Services", "/provider/services"],
      ["Sell & Offer Dashboard", "/provider/dashboard"],
      ["Sell & Offer Resources", "/provider-resources"],
    ],
  },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-[16px] font-semibold leading-5 text-white">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {links.map(([label, path]) => (
          <li key={label}>
            <Link
              to={path}
              className="text-[14px] leading-5 text-slate-300 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLinks() {
  return (
    <p className="mt-6 max-w-[280px] text-sm leading-6 text-slate-400">
      Official social channels will be listed here when they are ready.
    </p>
  );
}

function Newsletter() {
  return (
    <div className="lg:border-l lg:border-white/20 lg:pl-10">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#75f17f]">
        Stay in the loop
      </p>
      <h2 className="mt-3 text-[20px] font-semibold leading-6 text-white">
        Updates are coming soon
      </h2>
      <p className="mt-2 max-w-[290px] text-[15px] leading-6 text-slate-300">
        Newsletter sign-up is not available yet. Check back for updates to Matchet.
      </p>
    </div>
  );
}

function CompactFooter() {
  return (
    <footer className="w-full border-t border-white/20 bg-[#061c2d] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1470px] flex-col items-center gap-4 text-center text-[12px] text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link to="/" aria-label="Matchet home" className="hidden shrink-0 items-center sm:inline-flex">
            <FooterLogo />
          </Link>
          <div className="min-w-0">
            <p className="font-semibold text-white">Buy. Book. Hire. All in one place.</p>
            <p className="mt-1 text-[12px] text-slate-300">Official social channels will be listed here when they are ready.</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-col items-center gap-3 sm:items-end">
          <div className="flex w-full min-w-0 flex-col items-center gap-2 sm:items-end">
            <p className="w-full whitespace-nowrap text-center sm:text-right">© 2026 Matchet. All rights reserved.</p>
            <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end">
              <Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
              <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
              <Link to="/cookies" className="transition-colors hover:text-white">Cookie Policy</Link>
              <Link to="/sitemap" className="transition-colors hover:text-white">Sitemap</Link>
            </nav>
          </div>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex shrink-0 items-center justify-center gap-1.5 text-[12px] font-medium text-[#75f17f] transition-colors hover:text-white">
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterBottom() {
  return (
    <div className="mt-8 flex flex-col gap-5 border-t border-white/20 pt-5 text-[13px] text-slate-300 md:flex-row md:items-center md:justify-between">
      <p>© 2026 Matchet. All rights reserved.</p>

      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <Link to="/terms" className="transition-colors hover:text-white">
          Terms of Service
        </Link>
        <Link to="/privacy" className="transition-colors hover:text-white">
          Privacy Policy
        </Link>
        <Link to="/cookies" className="transition-colors hover:text-white">
          Cookie Policy
        </Link>
        <Link to="/sitemap" className="transition-colors hover:text-white">
          Sitemap
        </Link>
      </div>
    </div>
  );
}

export default function Footer({ isAuthenticated = false, compact = false }) {
  if (compact) return <CompactFooter />;
  const columns = isAuthenticated ? loggedInColumns : loggedOutColumns;

  return (
    <footer className="w-full px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1470px] overflow-hidden rounded-[12px] bg-[#061c2d] px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div
          className={
            isAuthenticated
              ? "grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10"
              : "grid gap-8 lg:grid-cols-[280px_1fr_315px] lg:gap-10"
          }
        >
          <div className="lg:border-r lg:border-white/20 lg:pr-10">
            <Link
              to="/"
              aria-label="Matchet home"
              className="inline-flex items-center"
            >
              <FooterLogo />
            </Link>

            <div className="mt-5 lg:mt-6">
              <p className="text-[14px] font-semibold leading-5 text-white">
                Buy. Book. Hire. All in one place.
              </p>

              <p className="mt-2 max-w-[280px] text-[14px] leading-6 text-slate-300 sm:text-[15px]">
                Matchet connects you with trusted products and service
                people and businesses around you.
              </p>
            </div>

            <SocialLinks />
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-9 sm:grid-cols-4">
            {columns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>

          {!isAuthenticated && <Newsletter />}
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
