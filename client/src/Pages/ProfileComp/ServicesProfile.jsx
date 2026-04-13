import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';

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


const ServicesProfile = ({ activationCode }) => {

  const id = activationCode;
  const token = localStorage.getItem("token");
  
  const [services, setServices] = useState([]);
  const [layoutType, setLayoutType] = useState('flex');
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch user's layout preference
  useEffect(() => {
    const fetchLayoutPreference = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/service-layout`,
          {
            params: { activationCode: id },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setLayoutType(res.data.layoutType || 'flex');
      } catch (err) {
        console.error("Error fetching layout:", err);
        // Default to flex if error
        setLayoutType('flex');
      }
    };

    if (id && token) {
      fetchLayoutPreference();
    }
  }, [id, token]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-services/all/get/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServices(res.data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        // toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [id, token]);

  // Service Card Component (Reusable)
  const ServiceCard = ({ service, index }) => (
    <motion.div
      key={service._id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-[#E1C48A]/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
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
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-[#E1C48A] transition">
            {service.title}
          </h3>
          {service.link && (
            <Link to={service.link} target="_blank" rel="noopener noreferrer">
              <FaEye size={20} className="text-gray-400 hover:text-white transition" />
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-5 line-clamp-3">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mt-auto">
          {service.features?.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop View (Always Grid/Flex)
  if (!isMobile) {
    return (
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>
      </div>
    );
  }

  // Mobile View with Dynamic Layout
  return (
    <div className="mb-16">
      {/* Carousel Layout for Mobile */}
      {layoutType === 'carousel' ? (
        <>
          <div className="relative">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={false}
              pagination={{ 
                clickable: true,
                dynamicBullets: true 
              }}
              navigation={services.length > 2}
              breakpoints={{
                480: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
              }}
              className="service-carousel "
            >
              {services.map((service, index) => (
                <SwiperSlide key={service._id}>
                  <ServiceCard service={service} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      ) : (
        // Flex/Grid Layout for Mobile
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesProfile;