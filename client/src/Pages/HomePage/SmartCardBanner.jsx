import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const SmartCardBanner = () => {
  return (
    <section className="p-4 md:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="relative w-full max-w-7xl bg-[#1e1b4b] rounded-[40px] overflow-hidden px-8 py-12 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between shadow-2xl">

        <div className="z-10 w-full md:w-3/5 text-left space-y-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
            The Smart Business Card <br />
            Designed for Professionals to <br />
            Connect Instantly
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-10 py-3 border-2 border-white text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#1e1b4b] transition-all duration-300">
              Buy Now
            </button>

            <button className="px-8 py-3 bg-[#2ecc71] text-white font-semibold text-lg rounded-md flex items-center justify-center gap-3 hover:bg-[#27ae60] transition-all duration-300">
              <FaWhatsapp className="text-2xl" />
              Contact Us
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-2/5 mt-12 md:mt-0 flex justify-center md:justify-end">
          <img
            src="/smartcardbanner.png"
            alt="Smart Business Card Mockup"
            className="w-full max-w-[450px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default SmartCardBanner;