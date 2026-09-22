// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/matchet_logonamedark.png";

function SocialIcon({ type }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    linkedin: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10v6M8 7.5v.01M12 16v-3.2a2.8 2.8 0 0 1 5.6 0V16M12 10v6" />
      </>
    ),
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    x: (
      <>
        <path d="M5 4 19 20" />
        <path d="M19 4 5 20" />
      </>
    ),
    youtube: (
      <>
        <path d="M21 8.2a2.5 2.5 0 0 0-1.8-1.8C17.6 6 12 6 12 6s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 8.2 26 26 0 0 0 2.7 12 26 26 0 0 0 3 15.8a2.5 2.5 0 0 0 1.8 1.8C6.4 18 12 18 12 18s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8 26 26 0 0 0 .3-3.8 26 26 0 0 0-.3-3.8Z" />
        <path d="m10 9 5 3-5 3Z" />
      </>
    ),
  };

  return <svg {...common}>{paths[type]}</svg>;
}

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
    title: "For Providers",
    links: [
      ["List a Product", "/for-providers"],
      ["Offer a Service", "/for-providers"],
      ["Provider Resources", "/provider-resources"],
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
      ["Messages", "/messages"],
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
    title: "For Providers",
    links: [
      ["My Listings", "/provider/listings"],
      ["My Services", "/provider/services"],
      ["Provider Dashboard", "/provider/dashboard"],
      ["Provider Resources", "/provider-resources"],
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
  const socials = [
    ["linkedin", "LinkedIn"],
    ["instagram", "Instagram"],
    ["x", "X"],
    ["youtube", "YouTube"],
  ];

  return (
    <div className="mt-6 flex items-center gap-4">
      {socials.map(([type, label]) => (
        <a
          key={type}
          href="#"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <SocialIcon type={type} />
        </a>
      ))}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <div className="lg:border-l lg:border-white/20 lg:pl-10">
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#75f17f]">
        Stay in the loop
      </p>

      <h2 className="mt-3 text-[20px] font-semibold leading-6 text-white">
        Get the latest updates
      </h2>

      <p className="mt-2 max-w-[290px] text-[15px] leading-6 text-slate-300">
        New features, popular services, and more, straight to your inbox.
      </p>

      <form
        className="mt-5 flex h-14 w-full overflow-hidden rounded-lg border border-white/70"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-white outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          aria-label="Subscribe"
          className="m-1 flex w-10 shrink-0 items-center justify-center rounded-lg bg-[#75f17f] text-[#061c2d] transition-transform hover:scale-[0.98]"
        >
          <span className="text-[25px] leading-none">→</span>
        </button>
      </form>
    </div>
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

export default function Footer({ isAuthenticated = false }) {
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
                providers around you.
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
