import { useState } from "react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "support@matchet.com";
const LAST_UPDATED = "October 10, 2026";

const pageLinks = [
  ["/", "Home"],
  ["/explore", "Explore the marketplace"],
  ["/products", "Products"],
  ["/services", "Services"],
  ["/for-providers", "For providers"],
  ["/how-it-works", "How Matchet works"],
  ["/categories", "Categories"],
  ["/provider-resources", "Provider resources"],
  ["/safety", "Safety tips"],
  ["/report-problem", "Report a problem"],
  ["/contact", "Contact Matchet"],
  ["/terms", "Terms of Service"],
  ["/privacy", "Privacy Policy"],
  ["/cookies", "Cookie Policy"],
  ["/sitemap", "Sitemap"],
];

function PageShell({ eyebrow = "MAT CHET SUPPORT", title, intro, children }) {
  return (
    <main className="min-h-[60vh] bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-500">
          <Link className="hover:text-emerald-700" to="/">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <header className="mb-9 border-b border-slate-200 pb-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {intro && <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{intro}</p>}
        </header>
        <div className="space-y-8 text-[15px] leading-7 text-slate-700">{children}</div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return <section><h2 className="mb-2 text-xl font-semibold text-slate-900">{title}</h2><div className="space-y-3">{children}</div></section>;
}

function Updated() {
  return <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}. These pages describe the current service at a general level and should be reviewed before launch by the business and its legal adviser.</p>;
}

export function PrivacyPolicy() {
  return <PageShell title="Privacy Policy" intro="This policy explains what information Matchet may handle when you browse the marketplace, create an account, buy products, book services, or contact support.">
    <Updated />
    <Section title="Information you provide"><p>Depending on how you use Matchet, this may include your name, email address, phone number, account credentials, profile photo, location or service area, preferences, messages, product listings, service details, delivery information, orders, bookings, reviews, and support requests.</p></Section>
    <Section title="Information created through use"><p>Matchet may process account and marketplace activity such as saved items, orders, bookings, messages, listing interactions, and technical information needed to operate, secure, and troubleshoot the service. Your browser may also retain application state such as cart or navigation preferences.</p></Section>
    <Section title="How information is used"><p>Information is used to create and maintain accounts, connect buyers with sellers and service providers, process marketplace requests, support orders and bookings, display listings, communicate service updates, respond to support requests, prevent abuse, protect platform security, and maintain or improve Matchet.</p></Section>
    <Section title="Sharing"><p>Information may be shared with other users when necessary for a marketplace interaction, such as displaying a public seller or provider profile or passing delivery and booking details to the relevant party. Information may also be processed by service providers that help operate the platform, or disclosed where required by law or necessary to protect users and the service. Matchet should identify its active processors and contractual safeguards before this policy is treated as final.</p></Section>
    <Section title="Location and public profiles"><p>Location or service-area information can help users discover relevant providers and listings. Information placed on a public profile or listing may be visible to other visitors. Do not publish private information that is not needed to complete a marketplace transaction.</p></Section>
    <Section title="Security and retention"><p>Matchet uses account controls and technical measures intended to protect information, but no online service can guarantee absolute security. Information may be retained while an account is active and for as long as reasonably needed for transactions, dispute resolution, security, legal obligations, and legitimate operational needs. Specific retention periods should be confirmed and published by Matchet.</p></Section>
    <Section title="Your choices and requests"><p>You can review or update some account details through your account pages. You may also contact support to ask about access, correction, deletion, or other privacy requests. Account deletion may be limited while orders, bookings, or other unresolved obligations remain open.</p><p>For privacy questions, email <a className="font-semibold text-emerald-700 underline" href={`mailto:${SUPPORT_EMAIL}?subject=Privacy%20request`}>{SUPPORT_EMAIL}</a>.</p></Section>
    <Section title="Children"><p>Matchet is not intended for children who cannot legally enter into the transactions offered through the marketplace. Do not create an account or provide personal information if you are not legally able to use the service.</p></Section>
    <Section title="Changes to this policy"><p>We may update this policy as the service changes. The updated date above indicates when this page was last revised. Material changes should be communicated through an appropriate channel.</p></Section>
    <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">Before launch, Matchet should verify this policy against its actual analytics, hosting, email, payment, authentication, and file-upload providers, and add any legally required company details and retention periods.</p>
  </PageShell>;
}

export function TermsOfService() {
  return <PageShell title="Terms of Service" intro="These terms set out basic expectations for using Matchet to discover products, book services, and interact with sellers and service providers.">
    <Updated />
    <Section title="Using Matchet"><p>You must provide accurate account information, keep your login credentials secure, and use the service lawfully. You are responsible for activity carried out through your account and should contact support promptly if you suspect unauthorized access.</p></Section>
    <Section title="Marketplace role"><p>Matchet provides tools for users to discover products and services and communicate about transactions. Unless a specific transaction flow expressly states otherwise, sellers and service providers are responsible for the accuracy of their listings, their ability to deliver what they offer, and the quality and safety of their products or services. Users should review listing details and transaction terms before proceeding.</p></Section>
    <Section title="Orders, bookings, fees, and refunds"><p>Review the displayed price, delivery or service charges, timing, cancellation conditions, and payment instructions before confirming an order or booking. Any applicable payment, refund, cancellation, or dispute rules shown during a transaction form part of that transaction. Matchet should publish a dedicated, definitive policy for these matters before accepting live payments.</p></Section>
    <Section title="Acceptable use"><p>You must not post deceptive, unlawful, infringing, discriminatory, abusive, unsafe, or misleading content; impersonate another person; manipulate reviews; misuse another user's personal information; attempt to bypass platform security; or use Matchet to facilitate fraud or prohibited transactions.</p></Section>
    <Section title="Listings, messages, and reviews"><p>You are responsible for content you submit and must have the rights and permissions needed to publish it. Do not include passwords, payment credentials, government identity numbers, or other sensitive details in public listings, reviews, or ordinary messages. Matchet may investigate reports and restrict content or accounts where reasonably necessary to protect users or comply with law.</p></Section>
    <Section title="Suspension and account closure"><p>Matchet may restrict access when necessary to investigate suspected abuse, protect users, enforce these terms, or comply with legal requirements. You may request account closure through the account controls, subject to any unresolved orders, bookings, payouts, disputes, or legal retention obligations.</p></Section>
    <Section title="Availability and changes"><p>We aim to keep Matchet available and reliable, but features may change and temporary interruptions can occur. We do not promise uninterrupted or error-free service. Nothing in these terms removes rights that cannot legally be excluded.</p></Section>
    <Section title="Contact"><p>Questions about these terms can be sent to <a className="font-semibold text-emerald-700 underline" href={`mailto:${SUPPORT_EMAIL}?subject=Terms%20question`}>{SUPPORT_EMAIL}</a>.</p></Section>
    <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">These terms are a starting point, not a substitute for legal review. Matchet must confirm its legal entity, governing law, dispute process, consumer obligations, and final transaction policies before launch.</p>
  </PageShell>;
}

export function CookiePolicy() {
  return <PageShell title="Cookie Policy" intro="This page explains how browser storage and similar technologies may be used when you access Matchet.">
    <Updated />
    <Section title="What cookies and browser storage do"><p>Cookies and related browser storage can remember a session, keep application features working, preserve preferences, and help protect account access. Matchet's web application also uses browser session storage for navigation and scroll restoration, and may use other storage for features such as cart or authentication state.</p></Section>
    <Section title="Essential storage"><p>Some storage is needed for core functions such as signing in, maintaining application state, and moving between pages. Blocking it may cause parts of the service to stop working or require you to sign in again.</p></Section>
    <Section title="Analytics and advertising"><p>This policy does not claim that Matchet uses analytics or advertising cookies. The business should confirm whether any analytics, advertising, embedded media, or third-party tracking tools are enabled in each deployed environment and update this page accordingly.</p></Section>
    <Section title="Managing storage"><p>You can manage or clear cookies and site data through your browser settings. Clearing storage may sign you out or remove locally saved application state. Browser controls do not necessarily provide a complete opt-out from every technology used by a website.</p></Section>
    <Section title="Questions"><p>For questions about browser storage or privacy, contact <a className="font-semibold text-emerald-700 underline" href={`mailto:${SUPPORT_EMAIL}?subject=Cookie%20policy`}>{SUPPORT_EMAIL}</a>.</p></Section>
    <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">Before launch, audit the production build and third-party scripts to produce a verified cookie and storage inventory, including purposes, providers, and lifetimes.</p>
  </PageShell>;
}

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General enquiry");
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    const body = `Name: ${name}\nReply email: ${email}\n\n${message}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return <PageShell title="Contact Matchet" intro="Have a question about your account, an order, a booking, or using the marketplace? Send our support team the details.">
    <section className="rounded-2xl border border-slate-200 p-5 sm:p-7">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-800">Your name<input required value={name} onChange={e => setName(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal" autoComplete="name" /></label>
          <label className="block text-sm font-medium text-slate-800">Your email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal" autoComplete="email" /></label>
        </div>
        <label className="block text-sm font-medium text-slate-800">What is this about?<select value={subject} onChange={e => setSubject(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal"><option>General enquiry</option><option>Account access</option><option>Order or delivery</option><option>Service booking</option><option>Seller or provider account</option><option>Privacy request</option></select></label>
        <label className="block text-sm font-medium text-slate-800">How can we help?<textarea required rows={6} value={message} onChange={e => setMessage(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal" /></label>
        <p className="text-sm text-slate-500">Submitting opens your email application with the details filled in. Do not include passwords or full payment card details.</p>
        <button className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800" type="submit">Prepare email</button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Or email <a className="font-semibold text-emerald-700 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </section>
  </PageShell>;
}

export function SafetyPage() {
  return <PageShell title="Safety Tips" intro="A few simple steps can help you make safer decisions when buying products or booking services through Matchet.">
    <Section title="Before you buy or book"><ul className="list-disc space-y-2 pl-5"><li>Read the listing carefully, including condition, price, location, delivery, and service details.</li><li>Review seller or provider profile information and feedback where available.</li><li>Ask questions through the platform before confirming if something is unclear.</li><li>Keep transaction details and communications so you can refer to them if an issue arises.</li></ul></Section>
    <Section title="Protect your information"><ul className="list-disc space-y-2 pl-5"><li>Never share your password, one-time passcodes, or full payment credentials with another user.</li><li>Only provide delivery or booking information needed to complete the transaction.</li><li>Use a strong, unique password and sign out on shared devices.</li><li>Be cautious of requests to pay outside the stated transaction flow or to send unexpected extra fees.</li></ul></Section>
    <Section title="When meeting or receiving a service"><ul className="list-disc space-y-2 pl-5"><li>Choose a safe, appropriate meeting arrangement and tell someone you trust where you are going when relevant.</li><li>For in-home services, confirm the provider's identity and the agreed scope before work begins.</li><li>Do not proceed if you feel pressured, threatened, or believe the listing is fraudulent.</li></ul></Section>
    <Section title="Report suspicious activity"><p>If a listing, message, seller, or provider seems unsafe or misleading, stop the interaction and use the <Link className="font-semibold text-emerald-700 underline" to="/report-problem">Report a Problem</Link> page. For immediate danger, contact the appropriate local emergency service.</p></Section>
  </PageShell>;
}

export function ReportProblemPage() {
  const [kind, setKind] = useState("Suspicious listing or user");
  const [reference, setReference] = useState("");
  const [details, setDetails] = useState("");
  const [replyEmail, setReplyEmail] = useState("");

  function submit(event) {
    event.preventDefault();
    const body = `Report type: ${kind}\nListing, order, booking, or profile reference: ${reference || "Not provided"}\nReply email: ${replyEmail || "Not provided"}\n\nDetails:\n${details}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Matchet safety or problem report")}&body=${encodeURIComponent(body)}`;
  }

  return <PageShell title="Report a Problem" intro="Tell us about a suspicious listing, a safety concern, misleading information, or a problem with your Matchet experience.">
    <section className="rounded-2xl border border-slate-200 p-5 sm:p-7">
      <form onSubmit={submit} className="space-y-5">
        <label className="block text-sm font-medium text-slate-800">What are you reporting?<select value={kind} onChange={e => setKind(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal"><option>Suspicious listing or user</option><option>Safety concern</option><option>Order or delivery problem</option><option>Service booking problem</option><option>Abusive or inappropriate content</option><option>Technical issue</option><option>Privacy concern</option><option>Other</option></select></label>
        <label className="block text-sm font-medium text-slate-800">Reference (optional)<input value={reference} onChange={e => setReference(e.target.value)} placeholder="Listing, order, booking, or profile URL/ID" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal" /></label>
        <label className="block text-sm font-medium text-slate-800">Details<textarea required minLength={10} rows={6} value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe what happened and when." className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal" /></label>
        <label className="block text-sm font-medium text-slate-800">Email for follow-up (optional)<input type="email" value={replyEmail} onChange={e => setReplyEmail(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal" autoComplete="email" /></label>
        <p className="text-sm text-slate-500">This prepares a report in your email application. Do not include passwords, one-time codes, or full payment credentials. If you are in immediate danger, contact local emergency services first.</p>
        <button className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800" type="submit">Prepare report</button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Email: <a className="font-semibold text-emerald-700 underline" href={`mailto:${SUPPORT_EMAIL}?subject=Matchet%20problem%20report`}>{SUPPORT_EMAIL}</a></p>
    </section>
  </PageShell>;
}

export function SitemapPage() {
  return <PageShell title="Sitemap" intro="Use these links to find the main areas of Matchet. Account and workspace pages may require you to sign in and have the appropriate role.">
    <ul className="grid gap-3 sm:grid-cols-2">
      {pageLinks.map(([path, label]) => <li key={path}><Link className="block rounded-lg border border-slate-200 px-4 py-3 font-medium text-emerald-800 hover:border-emerald-500 hover:bg-emerald-50" to={path}>{label}<span className="ml-2 text-slate-400" aria-hidden="true">→</span></Link></li>)}
    </ul>
  </PageShell>;
}
