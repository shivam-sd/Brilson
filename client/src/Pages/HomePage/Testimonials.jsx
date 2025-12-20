import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Marketing Director at TechCorp India",
    review:
      "The NFC card has transformed how I network at conferences. One tap and my new contacts have everything they need. Absolutely brilliant!",
    img: "https://i.pravatar.cc/150?img=47",
    stars: 5,
  },
  {
    name: "Rahul Patel",
    role: "Startup Founder at InnovateTech",
    review:
      "As a founder, first impressions matter. The metal card from Brilson makes a statement. My investors were impressed before I even started pitching.",
    img: "https://i.pravatar.cc/150?img=15",
    stars: 5,
  },
  {
    name: "Ananya Krishnan",
    role: "Real Estate Agent at Prime Properties",
    review:
      "I have closed more deals since switching to Brilson. Clients love the modern approach, and I can update my listings instantly on my profile.",
    img: "https://i.pravatar.cc/150?img=32",
    stars: 5,
  },
  {
    name: "Vikram Singh",
    role: "Freelance Designer",
    review:
      "The analytics feature is game-changing. I can see who viewed my profile and when. It helps me follow up at the right time.",
    img: "https://i.pravatar.cc/150?img=58",
    stars: 5,
  },
];

const Testimonials = () => {
  return (
    <div className="bg-[#05070a]">

<h1 className="text-white text-center text-5xl font-bold">Loved by <span className="text-blue-400 font-bold">Professionals</span></h1>
<p className="text-center text-gray-300 mt-3">Join thousands of happy customers who have transformed their networking.</p>

    <div className="max-w-7xl mx-auto py-20 bg-[#05070a] text-white">
      {/* Carousel */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={4500}
        loop={true}
        freeMode={true}
        slidesPerView={"auto"}
        spaceBetween={30}
        className="max-w-full px-10"
        >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i} className="!w-[360px] p-2 cursor-pointer">
            <div
              className="
              bg-white/5 border border-white/10 backdrop-blur-xl 
              p-7 rounded-3xl shadow-xl 
              hover:border-cyan-500/40 hover:shadow-cyan-500/30 
              hover:-translate-y-1 transition-all duration-300
              text-gray-300 min-h-[300px] flex flex-col
              "
              >
              <Quote className="w-9 h-9 text-cyan-400 mb-3 opacity-80" />

              <p className="leading-relaxed mb-6 text-[15px] italic">
                “{t.review}”
              </p>

              <div className="flex mb-4">
                {[...Array(t.stars)].map((_, idx) => (
                  <Star
                  key={idx}
                    className="text-yellow-400 w-4 h-4 fill-yellow-400"
                    />
                ))}
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border border-white/20"
                  />
                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
        </div>
  );
};

export default Testimonials;