// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { Link } from "react-router-dom";
import heroImage from "../assets/inspirations/for provider/hero.png";

export default function ForProviders() {
  return (
    <main className="w-full px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
      <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-white shadow-[0_10px_35px_rgba(16,24,63,0.05)]">
        <div className="relative min-h-0 lg:min-h-[535px]">
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-10 pt-10 sm:px-10 sm:pt-12 lg:min-h-[535px] lg:w-[51%] lg:px-12 lg:pb-12 lg:pt-12 xl:px-[50px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
              FOR PROVIDERS
            </p>

            <h1 className="mt-4 max-w-[560px] text-[42px] font-bold leading-[0.99] tracking-[-0.045em] text-[#10183f] sm:text-[52px] lg:text-[48px] xl:text-[56px]">
              Grow your
              <br />
              business with
              <br />
              <span className="text-[#07863a]">Matchet.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-[15px] leading-[22px] text-[#747ca1] sm:text-[17px] sm:leading-7">
              List your products, reach more customers,
              <br className="hidden sm:block" />
              and manage your orders all in one place.
            </p>

            <div className="mt-7 flex w-full max-w-[625px] flex-col gap-3 sm:flex-row sm:gap-5">
              <Link
                to="/register"
                className="flex h-[58px] flex-1 items-center justify-center gap-4 rounded-[11px] bg-[#07983f] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#068936] sm:text-[16px]"
              >
                <span>Sell products</span>
                <span aria-hidden="true" className="text-[26px] font-normal leading-none">
                  →
                </span>
              </Link>

              <Link
                to="/provider/onboarding"
                className="flex h-[58px] flex-1 items-center justify-center gap-4 rounded-[11px] border-2 border-[#b7b9df] bg-white px-6 text-[15px] font-semibold text-[#10183f] transition-colors hover:bg-[#f8f8fc] sm:text-[16px]"
              >
                <span>Offer services</span>
                <span aria-hidden="true" className="text-[26px] font-normal leading-none">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="relative mt-8 hidden h-[430px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:block lg:h-full lg:w-[58%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_48%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_42%,rgba(255,255,255,0)_76%)]" />

            <img
              src={heroImage}
              alt="Matchet provider managing products and orders"
              className="absolute left-[55%] top-[48%] h-[99%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain xl:h-[90%]"
            />

            <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-white via-white/75 to-transparent" />

            <div className="pointer-events-none absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-white/70 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
