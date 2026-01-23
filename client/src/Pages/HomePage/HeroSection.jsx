import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import CardUI from "./CardUI";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";


const HeroSection = () => {

  const [homePageContent, setHomePageContentData] = useState('');
  const [heroSectionFeatures, setHeroSectionFeatures] = useState([]);


useEffect(() => {
  const fetchHomePageContent = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/home/content`);

      const data = res.data.data;
      // console.log(data)
      setHomePageContentData(data.heroSection);
      setHeroSectionFeatures(data.features.items);

    }catch(err){
      toast.error(err.response?.data?.error || "Home Page Data fetching Error");
    }
  }

  fetchHomePageContent();

},[]);


  return (
    <section className="relative w-full min-h-screen pt-28 pb-20 bg-gradient-to-b from-black via-gray-950 to-black text-white overflow-hidden">

      {/*  BACKGROUND LAYERS  */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Floating Orbs */}
        <motion.div
          animate={{ x: [0, 120, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -120, 0], y: [0, -60, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Grain */}
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220%200%20200%20200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')]"
        />
      </div>

      {/*  CONTENT  */}
      <div className="relative max-w-6xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          {/* <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="text-cyan-200 text-sm tracking-widest font-semibold">
              {homePageContent.badgeText}
            </span>
          </div> */}
        </motion.div>
        {/* FUTURE OF NETWORKING */}

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            {homePageContent.headingAccent}
            {/* Your Identity */}
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            {homePageContent.headingPrimary}
            {/* Digitally Elevated */}
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 max-w-3xl mx-auto text-lg sm:text-xl mb-12"
        >
          {homePageContent.subHeading
}
          {/* Smart NFC & QR cards for modern professionals.   */}
          <span className="text-cyan-300 font-semibold"> 
            {homePageContent.Highlight
}
            {/* Tap once. Connect forever. */}
            </span>
        </motion.p>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative group cursor-pointer hover:scale-110 duration-500 active:scale-110">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 " />
            
              <CardUI />
            
          </div>
        </motion.div>


        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link
            to="/products"
            className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold shadow-xl hover:scale-105 transition flex items-center justify-center gap-3"
          >
            Shop Now <ArrowRight />
          </Link>

          <Link
            to="/how-it-works"
            className="px-10 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition"
          >
            See How It Works
          </Link>
        </div>
        

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {
            heroSectionFeatures.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/40 transition cursor-pointer hover:scale-105 duration-500"
            >
              <img src={f.image} alt="" className="w-10"loading="lazy" />
              <div className="text-left">
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-gray-400">{f.description}</div>
              </div>
            </div>
          ))
          }
        </div>

        

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-white/10 pt-8">
          {[
            ["50K+", "Cards Sold"],
            ["1M+", "Connections"],
            ["4.9★", "Rating"]
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-4xl font-bold text-cyan-400">{v}</div>
              <div className="text-gray-400 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
