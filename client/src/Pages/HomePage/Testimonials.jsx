import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles, TrendingUp, Users, Award, Zap } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined color gradients for cards
  const colorGradients = [
    "from-cyan-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-green-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-rose-500 to-red-500",
    "from-indigo-500 to-blue-500",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/testimonials`);
        
        // console.log("API Response:", res.data);
        
        // Check if testimonials exist in response
        if (res.data && res.data.testimonials) {
          // Map API data to component format
          const formattedTestimonials = res.data.testimonials.map((item, index) => ({
            id: item._id || index,
            name: item.name || "Anonymous",
            review: item.review || "No review available",
            img: item.image || `https://i.pravatar.cc/150?img=${index + 1}`,
            stars: item.rating || 5,
            role: "Happy Customer", 
            company: "Brilson User", 
            color: colorGradients[index % colorGradients.length], 
          }));
          
          // console.log("Formatted testimonials:", formattedTestimonials);
          setTestimonials(formattedTestimonials);
        } else {
          // console.warn("No testimonials found in response");
          setTestimonials([]);
        }
      } catch (err) {
        // console.error("Error fetching testimonials:", err);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full py-28 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-300 text-sm font-medium tracking-wider">TESTIMONIALS</span>
            </div>
            <div className="animate-pulse">
              <div className="h-12 bg-gray-800 rounded-lg mb-4 w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-28 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-cyan-300 text-sm font-medium tracking-wider">TESTIMONIALS</span>
          </div>
          
          <h2 className="text-5xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
              Loved by
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400">
              Industry Leaders
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have transformed their networking experience with our smart digital solutions.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Main Carousel - Only show if testimonials exist */}
          {testimonials.length > 0 ? (
            <>
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                speed={1000}
                loop={true}
                slidesPerView={1}
                spaceBetween={30}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-white/30",
                  bulletActiveClass: "swiper-pagination-bullet-active !bg-gradient-to-r !from-cyan-500 !to-blue-500",
                }}
                className="!pb-16"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="relative group mt-10 cursor-pointer"
                    >
                      {/* Card Glow */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.color} rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                      
                      {/* Testimonial Card */}
                      <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                        {/* Quote Icon */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl">
                          <Quote className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Review Content */}
                        <div className="mb-6">
                          <p className="text-gray-300 text-lg leading-relaxed italic">"{testimonial.review}"</p>
                        </div>
                        
                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(testimonial.stars)].map((_, idx) => (
                            <Star
                              key={idx}
                              className="w-5 h-5 text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                          <div className="relative">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.color} rounded-full blur`}></div>
                            <img
                              src={testimonial.img}
                              alt={testimonial.name}
                              loading="lazy"
                              className="relative w-14 h-14 rounded-full border-2 border-white/20 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                            <div className={`inline-block mt-2 px-3 py-1 text-xs font-medium bg-gradient-to-r ${testimonial.color}/20 rounded-full border border-transparent`}>
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover Effect Line */}
                        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-500 -translate-x-1/2 group-hover:translate-x-0"></div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Infinite Scroll Carousel (Bottom) */}
              <div className="mt-20 overflow-hidden">
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                  }}
                  speed={5000}
                  loop={true}
                  freeMode={true}
                  slidesPerView="auto"
                  spaceBetween={30}
                  className="opacity-50"
                >
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <SwiperSlide key={i} className="!w-auto">
                      <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <div className="flex">
                          {[...Array(t.stars)].map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-gray-300 text-sm">"{t.review.substring(0, 50)}..."</span>
                        <span className="text-cyan-300 text-sm font-medium">- {t.name}</span>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            // Empty State
            <div className="text-center py-20">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 mb-6">
                <Quote className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Testimonials Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Customer testimonials will appear here once they are added through the admin panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;