import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-[#E1C48A]/30 transition-all duration-500 hover:translate-y-[-8px] cursor-pointer"
          >
                    
            
            {/* Service Title */}
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#E1C48A] transition-colors duration-300">
              {service.title}
            </h3>
            
            {/* Service Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {service.description}
            </p>
            
            {/* Features List */}
            <div className="space-y-3 mb-8">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Pricing */}
            <div className="flex items-center justify-between mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2">
               
                    <p className="text-md text-gray-400">Price:-</p>
                  <p className="text-sm font-bold text-gray-200">{service.price}</p>

              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default ServicesProfile;