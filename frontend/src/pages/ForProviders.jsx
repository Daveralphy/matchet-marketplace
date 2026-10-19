// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProviderCapabilities } from "../api/provider";
import heroImage from "../assets/inspirations/for provider/hero.png";

export default function ForProviders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState("");

  const handleProviderChoice = useCallback(async (capability) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("matchet_provider_intent", capability);
      sessionStorage.setItem("matchet_onboarding_flow", capability === "product" ? "seller" : "service");
      navigate("/login?returnTo=" + encodeURIComponent("/for-providers"));
      return;
    }
    sessionStorage.setItem("matchet_onboarding_flow", capability === "product" ? "seller" : "service");

    if (capability === "service" && (user?.role === "provider" || user?.capabilities?.provider)) {
      navigate("/provider/dashboard");
      return;
    }

    if (capability === "product" && user?.capabilities?.seller) {
      navigate("/seller/dashboard");
      return;
    }

    setLoading(capability);
    try {
      const response = await getProviderCapabilities();
      const state = response?.data?.[capability];
      if (!state?.exists) {
        navigate(capability === "product" ? "/register" : "/provider/onboarding");
        return;
      }
      if (capability === "service") {
        if (state.status === "active" && state.verificationStatus === "verified" && state.applicationSubmittedAt) {
          navigate("/provider/dashboard");
        } else if (state.verificationStatus === "rejected") {
          navigate("/provider/application-status");
        } else if (state.applicationSubmittedAt) {
          navigate("/provider/application-status");
        } else {
          navigate("/provider/onboarding");
        }
      } else {
        if (state.onboardingStatus === "submitted" && state.status === "active" && state.verificationStatus === "verified") {
          navigate("/seller/dashboard");
        } else {
          navigate("/register");
        }
      }
    } catch {
      if (capability === "service" && (user?.role === "provider" || user?.capabilities?.provider)) {
        navigate("/provider/dashboard");
      } else if (capability === "product" && user?.capabilities?.seller) {
        navigate("/seller/dashboard");
      } else {
        navigate(capability === "product" ? "/register" : "/provider/onboarding");
      }
    } finally {
      setLoading("");
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const intent = sessionStorage.getItem("matchet_provider_intent");
    if (!intent) return;
    sessionStorage.removeItem("matchet_provider_intent");
    handleProviderChoice(intent);
  }, [isAuthenticated, handleProviderChoice]);

  return (
    <main className="mk-page">
      <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-white shadow-[0_10px_35px_rgba(16,24,63,0.05)]">
        <div className="mk-hero-inner">
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-10 pt-10 sm:px-10 sm:pt-12 lg:min-h-[535px] lg:w-[51%] lg:px-12 lg:pb-12 lg:pt-12 xl:px-[50px]">
            <p className="mk-eyebrow">
              SELL & OFFER
            </p>

            <h1 className="mt-4 max-w-[560px] text-[42px] font-bold leading-[0.99] tracking-[-0.045em] text-ink sm:text-[52px] lg:text-[48px] xl:text-[56px]">
              Grow your
              <br />
              business with
              <br />
              <span className="text-brand">Matchet.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-[15px] leading-[22px] text-subtle sm:text-[17px] sm:leading-7">
              Sell your products or offer services, reach more customers,
              <br className="hidden sm:block" />
              and manage your orders all in one place.
            </p>

            <div className="mt-7 flex w-full max-w-[625px] flex-col gap-3 sm:flex-row sm:gap-5">
              <button type="button" onClick={() => handleProviderChoice("product")} disabled={Boolean(loading)} className="flex h-[58px] items-center sm:flex-1 justify-center gap-4 rounded-[11px] bg-brand-bright px-6 text-[15px] font-semibold text-white transition-colors hover:bg-brand-mid disabled:cursor-wait disabled:opacity-70 sm:text-[16px]">
                <span>{loading === "product" ? "Checking..." : "Sell products"}</span>
                <span aria-hidden="true" className="text-[26px] font-normal leading-none">→</span>
              </button>

              <button type="button" onClick={() => handleProviderChoice("service")} disabled={Boolean(loading)} className="flex h-[58px] items-center sm:flex-1 justify-center gap-4 rounded-[11px] border-2 border-[#b7b9df] bg-white px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-[#f8f8fc] disabled:cursor-wait disabled:opacity-70 sm:text-[16px]">
                <span>{loading === "service" ? "Checking..." : "Offer services"}</span>
                <span aria-hidden="true" className="text-[26px] font-normal leading-none">→</span>
              </button>
            </div>
          </div>

          <div className="relative mt-8 hidden h-[430px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:block lg:h-full lg:w-[58%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_48%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_42%,rgba(255,255,255,0)_76%)]" />

            <img
              src={heroImage}
              alt="Matchet seller managing products and orders"
              className="mk-hero-art-img"
            />

            <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-white via-white/75 to-transparent" />

            <div className="pointer-events-none absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-white/70 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
