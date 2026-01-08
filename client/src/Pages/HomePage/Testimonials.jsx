import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles, TrendingUp, Users, Award, Zap } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Marketing Director at TechCorp India",
    review: "The NFC card has transformed how I network at conferences. One tap and my new contacts have everything they need. Absolutely brilliant!",
    img: "https://i.pravatar.cc/150?img=47",
    stars: 5,
    company: "TechCorp",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    name: "Rahul Patel",
    role: "Startup Founder at InnovateTech",
    review: "As a founder, first impressions matter. The metal card from Brilson makes a statement. My investors were impressed before I even started pitching.",
    img: "https://i.pravatar.cc/150?img=15",
    stars: 5,
    company: "InnovateTech",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Ananya Krishnan",
    role: "Real Estate Agent at Prime Properties",
    review: "I have closed more deals since switching to Brilson. Clients love the modern approach, and I can update my listings instantly on my profile.",
    img: "https://i.pravatar.cc/150?img=32",
    stars: 5,
    company: "Prime Properties",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Freelance Designer",
    review: "The analytics feature is game-changing. I can see who viewed my profile and when. It helps me follow up at the right time.",
    img: "https://i.pravatar.cc/150?img=58",
    stars: 5,
    company: "Freelance Pro",
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 5,
    name: "Meera Kapoor",
    role: "Corporate Lawyer",
    review: "Elegant, professional, and incredibly effective. This card speaks volumes about our firm's commitment to innovation.",
    img: "https://i.pravatar.cc/150?img=65",
    stars: 5,
    company: "Kapoor & Associates",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 6,
    name: "Arjun Mehta",
    role: "Tech Consultant",
    review: "The best investment I've made in my professional toolkit. ROI has been phenomenal through new connections.",
    img: "https://i.pravatar.cc/150?img=12",
    stars: 5,
    company: "Digital Solutions",
    color: "from-blue-500 to-cyan-500",
  },
];



const Testimonials = () => {
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
          {/* Main Carousel */}
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
                          className="relative w-14 h-14 rounded-full border-2 border-white/20 object-cover"
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
        </div>
      </div>
    </section>
  );
};


const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default Testimonials;