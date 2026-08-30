import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Wifi, Leaf, UserCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: Wifi, title: 'NFC / QR', subtitle: 'Enabled' },
  { icon: Leaf, title: 'Eco - Friendly', subtitle: '& Paperless' },
  { icon: UserCheck, title: 'Save Contact', subtitle: 'in One Tap' },
  { icon: TrendingUp, title: 'Digital Profile', subtitle: 'for a Smarter You' },
];

const SmartCardBanner = () => {
  return (
    <section className="relative w-full overflow-hidden lg:h-screen sm:h-screen-auto bg-[#050B2E] px-4 pb-10 pt-24 sm:px-6 sm:pt-24 md:px-10 md:pb-12 md:pt-24 lg:px-16 lg:pb-16 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#050B2E_0%,#0A1550_45%,#0F2478_100%)]" />

      <div className="pointer-events-none absolute -left-24 top-1/3 h-[280px] w-[280px] rounded-full bg-[#0B5FFF]/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-[6%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#2F80FF]/20 blur-[120px] md:block" />


      <div
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-10 gap-y-7
                   [grid-template-areas:'heading'_'image'_'features'_'buttons']
                   md:grid-cols-[56%_44%] md:items-center md:gap-x-8 lg:grid-cols-[54%_46%] lg:gap-x-12
                   md:[grid-template-areas:'heading_image'_'features_image'_'buttons_image']"
      >
        <div className="relative z-10 flex flex-col items-center text-center [grid-area:heading] md:items-start md:text-left">
          <h2 className="m-0 text-[28px] font-extrabold leading-[1.25] text-white sm:text-[32px] md:text-[36px] lg:text-[44px]">
            The <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">Smart Business Card</span>{' '}
            Designed for Professionals to{' '}
            <span className="bg-gradient-to-r from-[#3B9EFF] to-[#5FB4FF] bg-clip-text text-transparent">Connect Instantly</span>
          </h2>

          <p className="mt-4 text-[20px]  text-[#cfd7ec] sm:text-[20px] md:text-[20px]">
            Share Your Profile <span className=" text-[#5B9EFF]">•</span> Grow Your Network{' '}
            <span className=" text-[#5B9EFF]">•</span> Make Every Connection Count
          </p>
        </div>

        <div className="relative z-10 flex w-full items-center justify-center [grid-area:image] md:h-full md:justify-end">
          <div className="pointer-events-none absolute bottom-2 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-full bg-[#2F80FF]/40 blur-2xl" />
          <img
            src="banner.png"
            alt="Brilson smart business card and mobile app mockup"
            className="relative block w-full max-w-[500px] object-contain drop-shadow-2xl sm:max-w-[340px] md:max-w-[420px] lg:max-w-[620px]"
          />
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-5 [grid-area:features] justify-items-center lg:grid-cols-4 lg:gap-x-3 lg:gap-y-4 lg:justify-items-stretch">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex w-full max-w-[150px] flex-row items-center gap-2.5 lg:max-w-none"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/15 shadow-[0_0_12px_rgba(59,130,246,0.35)]">
                <Icon
                  className="h-5 w-5 text-[#8EC5FF] drop-shadow-[0_0_6px_rgba(91,158,255,0.9)]"
                  strokeWidth={2}
                />
              </div>

              <div className="leading-tight">
                <p className="m-0 text-[13px] text-white lg:text-[13px]">
                  {title}
                </p>
                <p className="m-0 text-[13px] text-white lg:text-[13px]">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-3 [grid-area:buttons] sm:flex-row sm:justify-center md:justify-start">
          <Link to="/products" className="group flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-white/32 bg-gradient-to-b from-[#337ef6] to-[#0447c2] px-5 text-[20px] text-white shadow-[0_8px_24px_-8px_rgba(47,128,255,0.6)] transition-transform duration-200 hover:brightness-110 active:scale-95 sm:w-auto sm:flex-none sm:px-7 sm:text-[20px] lg:h-[48px] lg:px-8 lg:text-[20px]">
            Buy Now
            <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link to="/contact-sale" className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-white/110 px-5 text-[20px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 active:scale-95 sm:w-auto sm:flex-none sm:px-6 sm:text-[20px] lg:h-[48px] lg:px-7 lg:text-[20px]">
            <FaWhatsapp className="text-[18px] text-[#25D366] sm:text-[19px]" />
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SmartCardBanner;