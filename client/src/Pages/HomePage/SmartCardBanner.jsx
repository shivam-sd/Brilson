import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const SmartCardBanner = () => {
  return (
    <section className="w-full bg-gray-100 px-4 py-8 sm:px-5 md:px-6 lg:py-16">
      <div className="relative mx-auto flex w-full flex-col justify-center overflow-hidden rounded-[16px] bg-[#1e1b4b] px-6 py-8 shadow-2xl sm:rounded-[18px] sm:px-8 sm:py-10 md:min-h-[320px] md:max-w-7xl md:flex-row md:items-center md:justify-start md:rounded-[20px] md:px-10 md:py-0 lg:px-16">

        <div className="relative z-10 w-full md:w-[58%] lg:w-[60%]">
          <div className="mb-0 flex flex-col gap-0">
            <h2 className="m-0 text-[26px] font-bold leading-[1.3] text-white sm:text-[28px] md:text-[32px] lg:text-[38px]">
              The Smart Business Card
            </h2>
            <h2 className="m-0 text-[26px] font-bold leading-[1.3] text-white sm:text-[28px] md:text-[32px] lg:text-[38px]">
              Designed for Professionals to
            </h2>
            <h2 className="m-0 text-[26px] font-bold leading-[1.3] text-white sm:text-[28px] md:text-[32px] lg:text-[38px]">
              Connect Instantly
            </h2>
          </div>


          <div className="mt-6 flex flex-row items-center gap-3 md:mt-5 lg:mt-6">
            <button className="h-[44px] flex-1 rounded-md border-2 border-white px-4 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#1e1b4b] active:scale-95 sm:h-[46px] sm:text-[14px] md:h-[44px] md:flex-none md:px-7 md:text-[15px] lg:h-[48px] lg:px-8 lg:text-[16px]">
              Buy Now
            </button>

            <button className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-md bg-[#2ecc71] px-4 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#27ae60] active:scale-95 sm:h-[46px] sm:text-[14px] md:h-[44px] md:flex-none md:px-6 md:text-[15px] lg:h-[48px] lg:px-7 lg:text-[16px]">
              <FaWhatsapp className="text-[18px] sm:text-[19px] md:text-[20px]" />
              Contact Us
            </button>
          </div>
        </div>

        <div className="hidden md:absolute md:right-[-10px] md:top-1/2 md:flex md:w-[43%] md:-translate-y-1/2 md:justify-end lg:right-0 lg:w-[40%]">
          <img
            src="/smartcardbanner.png"
            alt="Smart Business Card Mockup"
            className="block w-full max-w-[380px] object-contain drop-shadow-2xl lg:max-w-[410px]"
          />
        </div>
      </div>
    </section>
  );
};

export default SmartCardBanner;
