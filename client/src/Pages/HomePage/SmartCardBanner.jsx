import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Wifi, Leaf, UserCheck, TrendingUp, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Wifi, title: 'NFC / QR', subtitle: 'Enabled' },
  { icon: Leaf, title: 'Eco-Friendly', subtitle: '& Paperless' },
  { icon: UserCheck, title: 'Save Contact', subtitle: 'in One Tap' },
  { icon: TrendingUp, title: 'Digital Profile', subtitle: 'for a Smarter You' },
];

const SmartCardBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#050B2E] px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-14">
      {/* Base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#050B2E_0%,#0A1550_45%,#0F2478_100%)]" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-[280px] w-[280px] rounded-full bg-[#0B5FFF]/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-[6%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#2F80FF]/20 blur-[120px] md:block" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
        {/* Left: content */}
        <div className="relative z-10 w-full md:w-[56%] lg:w-[54%]">
          <h2 className="m-0 text-[28px] font-extrabold leading-[1.25] text-white sm:text-[32px] md:text-[36px] lg:text-[44px]">
            The <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">Smart Business Card</span>{' '}
            Designed for Professionals to{' '}
            <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">Connect Instantly</span>
          </h2>

          <p className="mt-4 text-[14px] font-medium text-[#B8C4E0] sm:text-[15px] md:text-[16px]">
            Share Your Profile <span className="mx-1.5 text-[#5B9EFF]">•</span> Grow Your Network{' '}
            <span className="mx-1.5 text-[#5B9EFF]">•</span> Make Every Connection Count
          </p>

          {/* Feature strip */}
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-x-3">
            {FEATURES.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/15">
                  <Icon className="h-5 w-5 text-[#5B9EFF]" strokeWidth={2} />
                </div>
                <div className="leading-tight">
                  <p className="m-0 text-[12.5px] font-semibold text-white sm:text-[13px]">{title}</p>
                  <p className="m-0 text-[12.5px] font-semibold text-white sm:text-[13px]">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-row items-center gap-3">
            <button className="group flex h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2F80FF] to-[#0B5FFF] px-5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,128,255,0.6)] transition-transform duration-200 hover:brightness-110 active:scale-95 sm:flex-none sm:px-7 sm:text-[15px] lg:h-[48px] lg:px-8 lg:text-[16px]">
              Buy Now
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <button className="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 active:scale-95 sm:flex-none sm:px-6 sm:text-[15px] lg:h-[48px] lg:px-7 lg:text-[16px]">
              <FaWhatsapp className="text-[18px] text-[#25D366] sm:text-[19px]" />
              Contact Us
            </button>
          </div>
        </div>

        {/* Right: image (desktop only) */}
        <div className="relative hidden w-full md:flex md:w-[44%] md:items-center md:justify-end lg:w-[46%]">
          <div className="pointer-events-none absolute bottom-2 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-full bg-[#2F80FF]/40 blur-2xl" />
          <img
            src="smartcardbanner.png"
            alt="Brilson smart business card and mobile app mockup"
            className="relative block w-full max-w-[520px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default SmartCardBanner;