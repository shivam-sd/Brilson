import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import {toast} from "react-toastify";

const ContactSales = () => {

const [result, setResult] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  setResult("Sending....");
  const formData = new FormData(e.target);
  
  formData.append("access_key", "997fa1ac-8b53-47a0-a76e-aea138e5f89b");

  const response = await fetch("https://api.web3forms.com/submit", {
    method:"POST",
    body: formData
  });


  const data = await response.json();

  if(data.success){
    setResult("Message sent successfully!");
    toast.success("We Contact You Soon!");
    e.target.reset();
  }else {
      setResult("Error");
    }


  setResult("");

}



  return (
    <div className="bg-[#05070a] text-white min-h-screen pt-24 pb-28">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 px-6"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Contact <span className="text-cyan-400">Sales</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base">
          Looking for bulk orders, corporate plans, or business solutions?  
          Our sales team is here to help you find the perfect smart card solution.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 px-6">

        {/*  Contact Form  */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-xl shadow-xl"
        >
          <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>

          <form className="space-y-6" onSubmit={handleSubmit}>

{/* subject */}
<input type="text" name="subject" className="hidden" value={"New Submittion Form Brilson"} />

            {/* Name */}
            <div>
              <label className="text-gray-300 text-sm">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                name="Full Name"
                className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-300 text-sm">Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone"
                name="phone"
                className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-gray-300 text-sm">Message</label>
              <textarea
                rows="5"
                placeholder="Tell us how we can help you..."
                name="message"
                className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none"
              ></textarea>
            </div>

            <p>{result}</p>
            {/* Submit Button */}
            <button
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] transition duration-300"
            >
              Submit Request
            </button>

          </form>
        </motion.div>

        {/* --- Right: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Contact Options */}
          <div className="space-y-10">
            <div className="flex items-start gap-5">
              <FiMail size={35} className="text-cyan-400" />
              <div>
                <h4 className="text-lg font-semibold">Email Us</h4>
                <p className="text-gray-400">hello@brilson.com</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <FiPhone size={35} className="text-cyan-400" />
              <div>
                <h4 className="text-lg font-semibold">Call Sales</h4>
                <p className="text-gray-400">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <FiMapPin size={35} className="text-cyan-400" />
              <div>
                <h4 className="text-lg font-semibold">Office Address</h4>
                <p className="text-gray-400">Indira Nagar, Lucknow, India</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-14">
            <h3 className="text-xl font-bold mb-4">Why Contact Our Sales Team?</h3>
            <ul className="space-y-4 text-gray-300">
              {[
                "Bulk order discounts for businesses",
                "Custom card branding (logos, themes, colors)",
                "Dedicated account manager",
                "NFC + QR hybrid card solutions",
                "Fast delivery for corporate orders",
              ].map((item, i) => (
                <li className="flex items-center gap-3" key={i}>
                  <FiCheckCircle className="text-cyan-400" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-5">Frequently Asked Questions</h3>
            <div className="space-y-5">

              <details className="bg-white/5 p-4 rounded-xl border border-white/10">
                <summary className="cursor-pointer text-lg">Do you offer bulk discounts?</summary>
                <p className="text-gray-400 mt-3">
                  Yes! For orders above 10+ cards, we provide special discount pricing.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-xl border border-white/10">
                <summary className="cursor-pointer text-lg">Can you add our company logo?</summary>
                <p className="text-gray-400 mt-3">
                  Absolutely. We offer full branding including colors, theme, and logo print.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-xl border border-white/10">
                <summary className="cursor-pointer text-lg">How long does delivery take?</summary>
                <p className="text-gray-400 mt-3">
                  Typically 3–7 business days depending on customization.
                </p>
              </details>

            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default ContactSales;
