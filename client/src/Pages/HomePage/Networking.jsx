import React from "react";
import {Link} from "react-router-dom"

const Networking = () => {
  return (
    <div className="w-full bg-black flex justify-center px-5 py-16">
      <div className="max-w-4xl flex flex-col items-center text-center gap-6">

        {/* Offer SIGN */}
        <span className="text-blue-400 border border-blue-500 px-4 py-1 text-xs md:text-sm rounded-full shadow-[0_0_10px_rgba(0,170,255,0.7)]">
          Limited Time Offer – 40% OFF
        </span>

        {/* Heading */}
        <h1 className="text-white lg:text-5xl text-2xl md:text-5xl font-extrabold leading-tight">
          Ready to <span className="text-blue-400">Transform</span> Your <br />
          <span className="inline-block mt-1">Networking?</span>
        </h1>

        {/* Sub Text */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
          Join <span className="font-semibold text-white">50,000+ professionals</span> who’ve already upgraded.
          Get your smart card today and never run out of business cards again.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-5 mt-3">
          <Link to={'/products'} className="px-5 py-2 md:px-7 md:py-3 bg-blue-400 text-black font-bold rounded-lg shadow-lg hover:scale-105 duration-300 hover:shadow-cyan-500/40 cursor-pointer">
            Start Now
          </Link>

          <Link to={'/contact-sale'} className="px-5 py-2 md:px-7 md:py-3 border border-blue-400 text-white rounded-lg hover:bg-blue-500/20 duration-300 hover:scale-105 cursor-pointer">
            Contact Sales
          </Link>
        </div>

        {/* Bottom Info */}
        <p className="text-gray-400 text-xs md:text-sm mt-2">
          ✓ Free Worldwide Shipping • ✓ 30-Day Money-Back Guarantee • ✓ 24/7 Support
        </p>

      </div>
    </div>
  );
};

export default Networking;
