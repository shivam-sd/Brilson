import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import axios from "axios";

// Import Lottie animations
import profileAnim from "../lottie/profile.json";
import qrAnim from "../lottie/qr.json";
import updateAnim from "../lottie/update.json";

// Default videos (fallback)
import cardAnim from "/getCard.mp4";
import loginAnim from "/activatecard.mp4";

// Helper function to check if file is a video
const isVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const urlLower = url.toLowerCase();
  return videoExtensions.some(ext => urlLower.includes(ext));
};

// Helper function to check if file is an image
const isImageFile = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlLower = url.toLowerCase();
  return imageExtensions.some(ext => urlLower.includes(ext));
};

const HowToUse = () => {
  const [guide, setGuide] = useState([]);
  const [info, setInfo] = useState({
    heading: "How to Use Smart Card",
    subHeading: "Simple steps to create, share and manage your digital identity."
  });
  
  useEffect(() => {
    const fetchHowToUseData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/howtouse`);
        const data = res.data.data;
        // console.log("How To Use Data:", data);
        
        setInfo({
          heading: data.heading || "How to Use Smart Card",
          subHeading: data.subHeading || "Simple steps to create, share and manage your digital identity."
        });
        
        setGuide(data.steps || []);
        
      } catch(err) {
        console.error("Error fetching data:", err);
        toast.error(err.response?.data?.err || "Internal Server Error");
      }
    };
    
    fetchHowToUseData();
  }, []);

  // Default steps for the Lottie animations section
  const defaultLottieSteps = [
    {
      title: "Create Your Digital Profile",
      desc: "Add your personal or business details to your digital profile.",
      animation: profileAnim,
    },
    {
      title: "Share via QR or Link",
      desc: "Let others scan your QR or open your profile link instantly.",
      animation: qrAnim,
    },
    {
      title: "Update Anytime",
      desc: "Edit your profile anytime and changes reflect instantly.",
      animation: updateAnim,
    },
  ];

  // Split guide steps into video steps and other steps
  const videoSteps = guide.filter((_, index) => index < 2);
  const otherSteps = guide.filter((_, index) => index >= 2);

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-24 px-4 md:px-6 overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mb-16 md:mb-24"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {info.heading}
        </h2>
        <p className="text-gray-400 text-base md:text-lg">
          {info.subHeading}
        </p>
      </motion.div>

      {/* VIDEO STEPS SECTION */}
      <div className="max-w-6xl mx-auto space-y-20 md:space-y-24">
        {videoSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-10 md:gap-14`}
          >
            {/* Media Container - Fixed size like original */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="rounded-2xl shadow-xl w-72 overflow-hidden">
                {isVideoFile(step.guide) ? (
                  <div className="relative">
                    <video
                      src={step.guide}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      VIDEO
                    </div>
                  </div>
                ) : isImageFile(step.guide) ? (
                  <div className="relative">
                    <img
                      src={step.guide}
                      alt={step.title}
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      IMAGE
                    </div>
                  </div>
                ) : (
                  // Fallback video based on index - Same size
                  <div className="relative">
                    <video
                      src={index === 0 ? cardAnim : loginAnim}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      SAMPLE
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 px-4">
              <span className="text-sm text-indigo-400 font-semibold">
                STEP {index + 1}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                {step.title || `Step ${index + 1}`}
              </h3>
              <p className="text-gray-400 text-base md:text-lg">
                {step.description || "Description will appear here."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LOTTIE STEPS SECTION */}
      <div className="max-w-6xl mx-auto space-y-20 md:space-y-24 mt-20 md:mt-24">
        {otherSteps.map((step, index) => (
          <motion.div
            key={index + videoSteps.length}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col ${
              (index + videoSteps.length) % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-10 md:gap-14`}
          >
            {/* Media Container - Fixed size like original */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              {step.guide ? (
                <div className="rounded-2xl shadow-xl w-72 overflow-hidden">
                  {isVideoFile(step.guide) ? (
                    <div className="relative">
                      <video
                        src={step.guide}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        VIDEO
                      </div>
                    </div>
                  ) : isImageFile(step.guide) ? (
                    <div className="relative">
                      <img
                        src={step.guide}
                        alt={step.title}
                        className="w-full h-auto"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        IMAGE
                      </div>
                    </div>
                  ) : (
                    // If not video or image, use default Lottie
                    <div className="w-full h-64 flex items-center justify-center">
                      <Lottie 
                        animationData={defaultLottieSteps[index]?.animation} 
                        loop 
                        className="w-full h-full"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        ANIMATION
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Fallback to default Lottie animation - Same size
                <div className="rounded-2xl shadow-xl w-72 overflow-hidden h-64">
                  <div className="w-full h-full flex items-center justify-center">
                    <Lottie 
                      animationData={defaultLottieSteps[index]?.animation || profileAnim} 
                      loop 
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      ANIMATION
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 px-4">
              <span className="text-sm text-indigo-400 font-semibold">
                STEP {videoSteps.length + index + 1}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                {step.title || defaultLottieSteps[index]?.title || `Step ${videoSteps.length + index + 1}`}
              </h3>
              <p className="text-gray-400 text-base md:text-lg">
                {step.description || defaultLottieSteps[index]?.desc || "Description will appear here."}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Show default Lottie steps if no otherSteps - Same size */}
        {otherSteps.length === 0 && defaultLottieSteps.map((step, index) => (
          <motion.div
            key={`default-${index}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col ${
              (index + videoSteps.length) % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-10 md:gap-14`}
          >
            {/* Lottie Animation - Fixed size */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="rounded-2xl shadow-xl w-72 overflow-hidden h-64">
                <Lottie 
                  animationData={step.animation} 
                  loop 
                  className="w-full h-full"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  ANIMATION
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 px-4">
              <span className="text-sm text-indigo-400 font-semibold">
                STEP {videoSteps.length + index + 1}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-400 text-base md:text-lg">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BENEFITS SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto mt-20 md:mt-32 text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">
          Why Use Smart Card?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-4">
          {[
            "No Reprinting Needed",
            "Professional Identity",
            "Eco Friendly",
            "Secure & Editable",
          ].map((benefit, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-[#111] p-6 md:p-8 rounded-2xl shadow-lg"
            >
              <h4 className="font-semibold text-base md:text-lg">{benefit}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowToUse;