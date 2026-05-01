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
    <section className="relative w-full pt-28 pb-20 bg-gradient-to-b from-black via-gray-950 to-black text-white overflow-hidden py-12">

      {/*  BACKGROUND LAYERS  */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Floating Orbs */}
        <div
        
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        />

        <div
     
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
        <div
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          {/* <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="text-cyan-200 text-sm tracking-widest font-semibold">
              {homePageContent.badgeText}
            </span>
          </div> */}
        </div>
        {/* FUTURE OF NETWORKING */}

        {/* Heading */}
        <h1
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
        </h1>

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
        <div
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative group cursor-pointer lg:scale-120 md:scale-120 scale-110 hover:scale-140 duration-500 active:scale-110">
            <div className="absolute -inset-4 group-hover:opacity-100 " />
            
              <CardUI />
            
          </div>
        </div>


        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link
  to="/products"
  className="group inline-flex items-center justify-center px-8 py-4 rounded-full
  bg-red-600 border-[4px] border-red-700
  shadow-[inset_6px_6px_10px_rgba(255,255,255,0.4),inset_-6px_-6px_10px_rgba(0,0,0,0.4),2px_2px_10px_rgba(0,0,0,0.3),-2px_-2px_10px_rgba(255,255,255,0.2)]
  transition-all duration-200 active:scale-95"
>
  {/* Text split into letters */}
  <span className="flex gap-[2px] text-xl font-extrabold text-red-200">
    {"SHOP NOW".split("").map((char, i) => (
      <span
        key={i}
        className="inline-block transition-transform duration-300 group-hover:-translate-y-2"
        style={{ transitionDelay: `${i * 80}ms` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </span>

  {/* Arrow */}
  <ArrowRight className="ml-3 text-red-200 transition-transform duration-300 group-hover:translate-x-2" />
</Link>




          <Link to="/how-it-works" className="relative inline-block group">

  {/* 🌈 Gradient Base */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#8d49fd] via-[#7f56f3] to-[#5691f3] shadow-[0_4px_12px_rgba(9,12,60,0.25),0_2px_8px_rgba(9,12,60,0.2)]"></div>

  {/* ✨ Top Shine */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[6px] bg-white/60 blur-md opacity-70 rounded-full"></div>

  {/* 🧊 Button Content */}
  <div className="relative z-10 px-10 py-4 rounded-2xl text-white font-medium text-sm tracking-wide
    backdrop-blur-xl border border-white/10
    flex items-center justify-center
    overflow-hidden transition duration-300 group-hover:-translate-y-1"
    
    style={{
      boxShadow: `
        inset 0 1px 1px rgba(233,209,255,0.25),
        inset 0 -1px 3px rgba(137,222,246,0.25)
      `
    }}
  >

    {/* ✨ Inner Shine Layer */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40"></div>

    {/* Text */}
    <span className="relative z-10 text-lg text-gray-200 font-semibold">See How It Works</span>

    {/* Bottom Glow */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110px] h-[6px] bg-cyan-300/60 blur-md opacity-70 rounded-full transition group-hover:scale-125"></div>

  </div>
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
