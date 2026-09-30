import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderEarnings } from "../api/provider";
import "../styles/provider-dashboard.css";

function money(value, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value || 0));
}
function shortMoney(value, currency = "NGN") {
  const amount = Number(value || 0);
  const symbol = currency === "NGN" ? "₦" : currency + " ";
  if (amount >= 1000000) return symbol + (amount / 1000000).toFixed(1) + "M";
  if (amount >= 1000) return symbol + Math.round(amount / 1000) + "K";
  return money(amount, currency);
}
function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default function ProviderEarnings() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("6");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProviderEarnings()
      .then((response) => { if (active) setData(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load your earnings."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const summary = data?.summary;
  const monthly = useMemo(() => {
    const values = data?.monthly || [];
    return range === "6" ? values : values.slice(-3);
  }, [data, range]);
  const maxMonthly = Math.max(...monthly.map((item) => Number(item.amount || 0)), 1);
  const breakdown = data?.breakdown || [];
  const breakdownTotal = breakdown.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const transactions = data?.transactions || [];

  return (
    <ProviderShell>
      <div className="provider-page provider-earnings-page">
        <div className="provider-heading">
          <div><h1>Earnings</h1><span>Track your income, view payouts, and manage your payment details.</span></div>
          <button className="provider-blue-button" type="button"><Icon name="wallet" size={18} /> Manage payout method</button>
        </div>

        {error && <div className="provider-message-error" role="alert">{error}</div>}

        <div className="provider-stat-grid">
          <div className="provider-stat"><div className="provider-stat-icon wallet"><Icon name="wallet" /></div><strong>{money(summary?.totalEarnings, summary?.currency)}</strong><b>Total earnings</b><span>All time</span></div>
          <div className="provider-stat"><div className="provider-stat-icon calendar"><Icon name="calendar" /></div><strong>{money(summary?.thisMonth, summary?.currency)}</strong><b>This month</b><span>{summary?.monthChange === null ? "No previous-month data" : "vs. last month"}</span>{summary?.monthChange !== null && summary?.monthChange !== undefined && <em className={"provider-growth " + (summary.monthChange >= 0 ? "positive" : "negative")}>{summary.monthChange >= 0 ? "↗" : "↘"} {summary.monthChange >= 0 ? "+" : ""}{summary.monthChange}%</em>}</div>
          <div className="provider-stat"><div className="provider-stat-icon clock"><Icon name="clock" /></div><strong>{money(summary?.pendingPayout, summary?.currency)}</strong><b>Pending payout</b><span>{summary?.pendingPayoutBookings || 0} booking{summary?.pendingPayoutBookings === 1 ? "" : "s"}</span></div>
          <div className="provider-stat"><div className="provider-stat-icon wallet"><Icon name="wallet" /></div><strong>{money(summary?.totalPaidOut, summary?.currency)}</strong><b>Total paid out</b><span>{summary?.payoutCount || 0} payout{summary?.payoutCount === 1 ? "" : "s"}</span></div>
        </div>

        <div className="provider-earnings-grid">
          <section className="provider-card provider-earnings-overview">
            <div className="provider-section-heading"><div><h2>Earnings overview</h2><p>Your earnings for the selected period.</p></div><select value={range} onChange={(event) => setRange(event.target.value)}><option value="6">Last 6 months</option><option value="3">Last 3 months</option></select></div>
            {loading ? <div className="provider-services-loading">Loading earnings...</div> : monthly.length === 0 ? <div className="provider-message-empty">No completed earnings recorded yet.</div> : (
              <div className="provider-earnings-chart">
                <div className="provider-chart-y-axis">{[1, .75, .5, .25, 0].map((ratio) => <span key={ratio}>{shortMoney(maxMonthly * ratio, summary?.currency)}</span>)}</div>
                <div className="provider-chart-bars">{monthly.map((item) => <div className="provider-chart-bar-column" key={item.month}><div className="provider-chart-bar-value">{shortMoney(item.amount, summary?.currency)}</div><div className="provider-chart-bar-track"><div className="provider-chart-bar" style={{height: Math.max(3, (Number(item.amount || 0) / maxMonthly) * 100) + "%"}} /></div><span>{item.month}</span></div>)}</div>
              </div>
            )}
          </section>

          <section className="provider-card provider-earnings-breakdown">
            <h2>Earnings breakdown</h2><p>By service category</p>
            {breakdown.length === 0 ? <div className="provider-message-empty">No completed service earnings yet.</div> : <>
              <div className="provider-donut"><div className="provider-donut-hole"><strong>{shortMoney(breakdownTotal, summary?.currency)}</strong><span>Total</span></div></div>
              <div className="provider-breakdown-list">{breakdown.map((item) => <div key={item.category}><span className="provider-breakdown-dot" /><span>{item.category}</span><b>{item.percentage}%</b></div>)}</div>
            </>}
          </section>
        </div>

        <div className="provider-earnings-bottom">
          <section className="provider-card provider-transactions">
            <div className="provider-section-heading"><h2>Recent transactions</h2><button type="button">View all</button></div>
            {loading ? <div className="provider-services-loading">Loading transactions...</div> : transactions.length === 0 ? <div className="provider-message-empty">No transactions yet.</div> : <div className="provider-transactions-table">
              <div className="provider-transactions-header"><span>Date</span><span>Type</span><span>Description</span><span>Amount</span><span>Status</span></div>
              {transactions.map((transaction) => <div className="provider-transaction-row" key={transaction.id + transaction.type}><span>{formatDate(transaction.date)}</span><span><Icon name={transaction.type === "payout" ? "wallet" : "calendar"} size={18} /> {transaction.type === "payout" ? "Payout" : "Booking"}</span><span>{transaction.description}</span><b>{money(transaction.amount, transaction.currency)}</b><span className={"status " + transaction.status}>{transaction.status}</span></div>)}
            </div>}
          </section>

          <aside>
            <section className="provider-card provider-payout-card">
              <div className="provider-section-heading"><h2>Payout method</h2><button type="button">Edit</button></div>
              {data?.payoutMethod ? <><div className="provider-payout-method"><div><Icon name="wallet" size={25} /></div><strong>{data.payoutMethod.bankName || "Bank account"}</strong><span>•••• {data.payoutMethod.accountLast4 || "----"}</span></div><div className="provider-payout-note">Payout information is stored with your provider account.</div></> : <div className="provider-message-empty provider-payout-empty"><strong>No payout method added</strong><span>Add your payout details when you are ready to receive payouts.</span><button type="button" className="provider-outline-button">Add payout method</button></div>}
            </section>
            <section className="provider-card provider-help-card"><h2>Need help?</h2><p>If you have questions about your earnings or payouts, our support team is here to help.</p><button type="button" className="provider-outline-button">Contact support →</button></section>
          </aside>
        </div>
      </div>
    </ProviderShell>
  );
}
