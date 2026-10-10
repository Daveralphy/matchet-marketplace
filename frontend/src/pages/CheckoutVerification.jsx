import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPaystackPayment } from "../api/marketplace";

export default function CheckoutVerification() {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const [state, setState] = useState("verifying");
  const [message, setMessage] = useState("We are confirming your payment securely with Paystack. Please keep this page open.");

  useEffect(() => {
    let active = true;
    if (!reference) {
      setState("error");
      setMessage("The payment reference is missing. If you completed payment, check your orders before trying again.");
      return undefined;
    }
    verifyPaystackPayment(reference)
      .then((result) => {
        if (!active) return;
        if (result.paid && result.orderId) {
          setState("success");
          setMessage("Your payment has been verified and your order is confirmed.");
        } else {
          setState("pending");
          setMessage("Paystack has not confirmed this payment yet. You can retry verification or check your orders shortly.");
        }
      })
      .catch((error) => {
        if (!active) return;
        setState("error");
        setMessage(error.message || "We could not verify your payment right now. Please retry in a moment.");
      });
    return () => { active = false; };
  }, [reference]);

  async function retryVerification() {
    setState("verifying");
    setMessage("Checking your payment with Paystack...");
    try {
      const result = await verifyPaystackPayment(reference);
      if (result.paid) {
        setState("success");
        setMessage("Your payment has been verified and your order is confirmed.");
      } else {
        setState("pending");
        setMessage("Paystack has not confirmed this payment yet. Please check your orders shortly.");
      }
    } catch (error) {
      setState("error");
      setMessage(error.message || "We could not verify your payment right now.");
    }
  }

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#fbfcfd] px-4 py-12">
      <section className="w-full max-w-xl rounded-2xl border border-[#e1e6ec] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf9ee] text-2xl text-[#087d35]">
          {state === "success" ? "✓" : state === "error" ? "!" : "…"}
        </div>
        <h1 className="text-2xl font-bold text-[#10183f]">
          {state === "success" ? "Payment confirmed" : state === "verifying" ? "Verifying payment" : state === "pending" ? "Payment not confirmed yet" : "Unable to verify payment"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#69739a]" role="status">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state === "success" && <Link to="/orders" className="rounded-lg bg-[#07863a] px-5 py-3 font-semibold text-white">View my orders</Link>}
          {(state === "error" || state === "pending") && <button onClick={retryVerification} className="rounded-lg bg-[#07863a] px-5 py-3 font-semibold text-white">Retry verification</button>}
          {state !== "success" && <Link to="/orders" className="rounded-lg border border-[#e1e6ec] px-5 py-3 font-semibold text-[#10183f]">Check my orders</Link>}
          <Link to="/" className="rounded-lg border border-[#e1e6ec] px-5 py-3 font-semibold text-[#10183f]">Back to marketplace</Link>
        </div>
      </section>
    </main>
  );
}
