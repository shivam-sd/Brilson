import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0c111b] text-gray-300 px-6 md:px-12 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 ">

        {/* Brand Section */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-black font-extrabold w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              B
            </div>
            <h2 className="text-xl font-semibold text-white">Brilson</h2>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Transform your networking with smart digital business cards.
            NFC & QR technology for the modern professional.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2">
            {[FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-[#1a2234] hover:bg-blue-500/20 hover:scale-110 duration-300 cursor-pointer"
              >
                <Icon className="text-gray-300 text-xl hover:text-white duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 md:mt-2 lg:mt-2">Products</h3>
          <ul className="space-y-2 text-sm">
            {["Basic QR Card", "Premium PVC Card", "NFC Smart Card", "Metal Elite Card"].map(
              (item, i) => (
                <li
                  key={i}
                  className="hover:text-blue-400 cursor-pointer duration-200"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {["About Us", "Contact", "Careers", "Blog"].map((item, i) => (
              <li
                key={i}
                className="hover:text-blue-400 cursor-pointer duration-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {["Help Center", "FAQs", "Shipping", "Returns"].map((item, i) => (
              <li
                key={i}
                className="hover:text-blue-400 cursor-pointer duration-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-1">
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <MdEmail className="text-lg" /> hello@brilson.com
            </li>
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <MdPhone className="text-lg" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <MdLocationOn className="text-lg" /> Mumbai, India
            </li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-6 text-xs sm:text-sm text-gray-500 gap-3">

        <p>© 2025 Brilson. All rights reserved.</p>

        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
            (item, i) => (
              <span
                key={i}
                className="hover:text-blue-400 cursor-pointer duration-200"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
