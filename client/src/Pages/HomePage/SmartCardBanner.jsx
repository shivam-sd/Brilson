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
    <section className="relative w-full overflow-hidden bg-[#050B2E] px-4 pb-10 pt-16 sm:px-6 sm:pt-20 md:px-10 md:pb-12 md:pt-24 lg:px-16 lg:pb-16 lg:pt-28">
      {/* Base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#050B2E_0%,#0A1550_45%,#0F2478_100%)]" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-[280px] w-[280px] rounded-full bg-[#0B5FFF]/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-[6%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#2F80FF]/20 blur-[120px] md:block" />

      {/*
        Mobile order (1 col):   heading -> image -> features -> buttons
        Desktop order (2 col):  heading/features/buttons on left, image on right (spanning all rows)
      */}
      <div
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-10 gap-y-7
                   [grid-template-areas:'heading'_'image'_'features'_'buttons']
                   md:grid-cols-[56%_44%] md:items-center md:gap-x-8 lg:grid-cols-[54%_46%] lg:gap-x-12
                   md:[grid-template-areas:'heading_image'_'features_image'_'buttons_image']"
      >
        {/* Heading + subtitle */}
        <div className="relative z-10 [grid-area:heading]">
          <h2 className="m-0 text-[28px] font-extrabold leading-[1.25] text-white sm:text-[32px] md:text-[36px] lg:text-[44px]">
            The <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">Smart Business Card</span>{' '}
            Designed for Professionals to{' '}
            <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">Connect Instantly</span>
          </h2>

          <p className="mt-4 text-[14px] font-medium text-[#B8C4E0] sm:text-[15px] md:text-[16px]">
            Share Your Profile <span className="mx-1.5 text-[#5B9EFF]">•</span> Grow Your Network{' '}
            <span className="mx-1.5 text-[#5B9EFF]">•</span> Make Every Connection Count
          </p>
        </div>

        {/* Image */}
        <div className="relative z-10 flex w-full items-center justify-center [grid-area:image] md:h-full md:justify-end">
          <div className="pointer-events-none absolute bottom-2 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-full bg-[#2F80FF]/40 blur-2xl" />
          <img
            src="banner.png"
            alt="Brilson smart business card and mobile app mockup"
            className="relative block w-full max-w-[300px] object-contain drop-shadow-2xl sm:max-w-[340px] md:max-w-[420px] lg:max-w-[520px]"
          />
        </div>

        {/* Feature strip */}
        <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-4 [grid-area:features] sm:grid-cols-4 sm:gap-x-3">
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
        <div className="relative z-10 flex w-full flex-col gap-3 [grid-area:buttons] sm:flex-row">
          <button className="group flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2F80FF] to-[#0B5FFF] px-5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,128,255,0.6)] transition-transform duration-200 hover:brightness-110 active:scale-95 sm:w-auto sm:flex-none sm:px-7 sm:text-[15px] lg:h-[48px] lg:px-8 lg:text-[16px]">
            Buy Now
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          <button className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 active:scale-95 sm:w-auto sm:flex-none sm:px-6 sm:text-[15px] lg:h-[48px] lg:px-7 lg:text-[16px]">
            <FaWhatsapp className="text-[18px] text-[#25D366] sm:text-[19px]" />
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default SmartCardBanner;