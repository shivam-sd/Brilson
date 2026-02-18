import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

import { 
  Server, Code, Brush, Smartphone, 
  Cloud, Database, MessageSquare, 
  Headphones, Settings, Zap, 
  CheckCircle, ArrowRight, Shield,
  BarChart, Globe, Lock, Cpu,
  Filter, Clock, DollarSign, Star
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";


const ServicesProfile = ({ activationCode}) => {

  const id = activationCode;
  const token = localStorage.getItem("token");
  
  const [services, setServices] = useState([]);


  useEffect(() => {
    const fetchServices = async () => {
      try{
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-services/all/get/${id}`,
          {
            withCredentials: true,
            headers: {Authorization: `Bearer ${token}`},
          }
        );
        setServices(res.data.data);
      }catch(err){
        // toast.error("Failed to load services");
      }
    }
    fetchServices();
  },[id]);


  return (
    <div className="mb-16">
      
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
  key={service._id}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-[#E1C48A]/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
>

  {/* IMAGE */}
  <div className="relative h-48 w-full overflow-hidden">
    <img
      src={service.image}
      alt={service.title}
      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

    {/* Price Badge */}
    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-emerald-400 border border-emerald-500/30">
      ₹ {service.price}
    </div>
  </div>

  {/* CONTENT */}
  <div className="p-6">

    <div className="flex items-center justify-between">
    {/* Title */}
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E1C48A] transition">
      {service.title}
    </h3>

{
  service.link && (<>
 <Link to={service.link}><FaEye size={20} /></Link> 
  </>)
}

    </div>

    {/* Description */}
    <p className="text-gray-400 text-sm mb-5 line-clamp-3">
      {service.description}
    </p>

    {/* Features */}
    <div className="space-y-2 mb-6">
      {service.features?.slice(0,3).map((feature, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
          <CheckCircle size={14} className="text-emerald-400" />
          {feature}
        </div>
      ))}
    </div>
  </div>
</motion.div>

        ))}
      </div>

    </div>
  );
};

export default ServicesProfile;