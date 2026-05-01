import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { toast } from "react-toastify";

const Networking = () => {

  const [data, setData] = useState('');
  const [feature, setFeatures] = useState([]);
  

useEffect(() => {
  const fetchData = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/transform`);

      const data = res.data.data;
      // console.log(res.data.data);
      setData(data);
      const features = res.data.data.features;
      setFeatures(features);

    }catch(err){
      toast.error("Internal Server Error");
    }
  }

  fetchData();
},[]);


  return (
    <div className="scroll-box w-full bg-black flex justify-center px-5 py-16">
      <div className="max-w-4xl flex flex-col items-center text-center gap-6">

        {/* Offer SIGN */}
        <span className="text-blue-400 border border-blue-500 px-4 py-1 text-xs md:text-sm rounded-full shadow-[0_0_10px_rgba(0,170,255,0.7)]">
          {
            data.badgeText
          }
          {/* Limited Time Offer – 40% OFF */}
        </span>

        {/* Heading */}
        <h2 className="text-white lg:text-5xl text-3xl md:text-5xl font-extrabold leading-tight">
          {
            data.heading
          }
          {/* Ready to <span className="text-blue-400">Transform</span> Your <br />
          <span className="inline-block mt-1">Networking?</span> */}
        </h2>

        {/* Sub Text */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
          {
            data.subHeading
          }
          {/* Join <span className="font-semibold text-white">50,000+ professionals</span> who’ve already upgraded.
          Get your smart card today and never run out of business cards again. */}
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-5 mt-3">
         <Link
  to="/products"
  className="group relative inline-flex items-center gap-2
  px-10 md:px-15 md:py-3 rounded-full
  text-white lg:font-semibold md:font-semibold text-sm overflow-hidden
  bg-gradient-to-r from-cyan-500 to-blue-600
  border border-white/20 hover:bg-black
  shadow-[0_10px_20px_rgba(0,0,0,0.25)]
  transition-all duration-300 hover:scale-105 hover:border-white/20"
>

  {/* ✨ Shine Sweep */}
  <span className="pointer-events-none absolute inset-0">
    <span className="absolute top-0 left-[-120px] h-full w-[100px]
      bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.8),transparent)]
      opacity-60
      group-hover:animate-[shine_1.2s_ease-out]"
    />
  </span>

  {/* Text */}
  <span className="relative z-10">Start Now</span>

</Link>

          <Link
  to="/contact-sale"
  className="group inline-flex items-center justify-center
  w-[160px] h-[55px] 
  rounded-full border-2 border-blue-500
  text-white font-medium text-base
  transition-all duration-300
  bg-transparent
  hover:bg-blue-500 hover:text-white
  hover:scale-105"
>
  <span className="transition-all duration-300 group-hover:text-white group-hover:scale-110">
    Contact Sales
  </span>
</Link>
          
        </div>

        {/* Bottom Info */}
        <div className="flex lg:gap-5 md:gap-2">

        {
          feature.map((it, i) => {
            return(<>
        <p key={i} className="text-gray-400 text-xs md:text-sm mt-2">
          {
            it
          }
           {/* ✓ Free Worldwide Shipping • ✓ 30-Day Money-Back Guarantee • ✓ 24/7 Support */}
        </p>    
            </>)
          })
        }
        </div>
        

      </div>
    </div>
  );
};

export default Networking;
