import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import axios from "axios";
import { Printer, IdCard, Leaf, ShieldCheck, Smartphone, QrCode, RefreshCw, User, Zap } from "lucide-react";

import profileAnim from "../lottie/profile.json";
import qrAnim from "../lottie/qr.json";
import updateAnim from "../lottie/update.json";

import cardAnim from "/getCard.mp4";
import loginAnim from "/activatecard.mp4";

const isVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  const urlLower = url.toLowerCase();
  return videoExtensions.some((ext) => urlLower.includes(ext));
};

const isImageFile = (url) => {
  if (!url) return false;
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const urlLower = url.toLowerCase();
  return imageExtensions.some((ext) => urlLower.includes(ext));
};

const StepCard = ({ mediaContent, badgeLabel, transparent = false, delay = 0 }) => (
  <motion.div
    className={`w-full max-w-sm mx-auto rounded-3xl overflow-hidden ${transparent ? "" : "bg-[#0a0e1a] border border-white/5 shadow-2xl shadow-indigo-500/5"
      }`}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <div className="relative w-full aspect-[4/5]">
      {mediaContent}
      {badgeLabel && (
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] md:text-xs tracking-widest rounded-full border border-white/10">
          {badgeLabel}
        </div>
      )}
    </div>
  </motion.div>
);

const StepContent = ({ stepNumber, title, description, delay = 0 }) => (
  <motion.div
    className="w-full md:w-1/2 px-4 text-center md:text-left"
    initial={{ opacity: 0, x: stepNumber % 2 === 0 ? 40 : -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <div className="inline-flex items-center gap-3 mb-3">
      <span className="text-sm font-bold text-indigo-400 tracking-widest bg-indigo-400/10 px-4 py-1 rounded-full border border-indigo-400/20">
        STEP {stepNumber}
      </span>
    </div>
    <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight">
      {title}
    </h3>
    <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
      {description}
    </p>
  </motion.div>
);

const StepRow = ({ index, mediaContent, badgeLabel, transparent, stepNumber, title, description, delay = 0 }) => (
  <motion.div
    className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-10 md:gap-16 lg:gap-20`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    <div className="w-full md:w-1/2 flex items-center justify-center">
      <StepCard
        mediaContent={mediaContent}
        badgeLabel={badgeLabel}
        transparent={transparent}
        delay={delay}
      />
    </div>
    <StepContent
      stepNumber={stepNumber}
      title={title}
      description={description}
      delay={delay + 0.2}
    />
  </motion.div>
);

const HowToUse = () => {
  const [guide, setGuide] = useState([]);
  const [info, setInfo] = useState({
    heading: "How to Use Smart NFC Card",
    subHeading: "Simple steps to create, share and manage your digital identity.",
  });

  useEffect(() => {
    const fetchHowToUseData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/howtouse`
        );
        const data = res.data.data;

        setInfo({
          heading: data.heading || "How to Use Smart NFC Card",
          subHeading:
            data.subHeading ||
            "Simple steps to create, share and manage your digital identity.",
        });

        setGuide(data.steps || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchHowToUseData();
  }, []);

  const defaultSteps = [
    {
      title: "Get Your Smart NFC Card",
      desc: "Buy a Brilson Smart NFC Card and get a unique digital identity that's ready to use.",
      animation: cardAnim,
      isVideo: true,
    },
    {
      title: "Login & Activate NFC Card",
      desc: "Login using your account and activate your NFC card securely in just a few clicks.",
      animation: loginAnim,
      isVideo: true,
    },
    {
      title: "Create Your Digital Profile",
      desc: "Add your personal or business details to build a profile that represents you.",
      animation: profileAnim,
      isLottie: true,
    },
    {
      title: "Share via QR or Link",
      desc: "Let others scan your QR or open your profile link instantly — no app needed.",
      animation: qrAnim,
      isLottie: true,
    },
    {
      title: "Update Anytime",
      desc: "Edit your profile anytime and changes reflect instantly for everyone.",
      animation: updateAnim,
      isLottie: true,
    },
  ];

  const benefits = [
    {
      icon: Printer,
      title: "No Reprinting Needed",
      desc: "No printing or paper required.",
      color: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-400",
    },
    {
      icon: IdCard,
      title: "Professional Identity",
      desc: "Build a professional digital presence.",
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
    },
    {
      icon: Leaf,
      title: "Eco Friendly",
      desc: "Reduce paper waste & protect nature.",
      color: "from-emerald-500/20 to-emerald-600/10",
      iconColor: "text-emerald-400",
    },
    {
      icon: Zap,
      title: "Instant Updates",
      desc: "Changes reflect instantly across all devices.",
      color: "from-amber-500/20 to-amber-600/10",
      iconColor: "text-amber-400",
    },
  ];

  const videoSteps = guide.filter((_, index) => index < 2);
  const otherSteps = guide.filter((_, index) => index >= 2);
  const headingParts = info.heading.split(" ");
  const headingLastWord = headingParts.pop();
  const headingLead = headingParts.join(" ");

  const renderMedia = (step, index, isDefault = false) => {
    let mediaContent;
    let badgeLabel;
    let transparent = false;

    if (isDefault) {
      if (step.isVideo) {
        mediaContent = (
          <video
            src={step.animation}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        );
        badgeLabel = "VIDEO";
      } else if (step.isLottie) {
        mediaContent = (
          <Lottie
            animationData={step.animation}
            loop
            autoplay
            className="w-full h-full p-6"
          />
        );
        badgeLabel = "ANIMATION";
        transparent = true;
      }
      return { mediaContent, badgeLabel, transparent };
    }

    if (isVideoFile(step.guide)) {
      mediaContent = (
        <video
          src={step.guide}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      );
      badgeLabel = "VIDEO";
    } else if (isImageFile(step.guide)) {
      mediaContent = (
        <img
          src={step.guide}
          alt={step.title}
          loading="lazy"
          className="w-full h-full object-contain p-4"
        />
      );
      badgeLabel = "IMAGE";
      transparent = true;
    } else {
      const defaultStep = defaultSteps[index] || defaultSteps[0];
      if (defaultStep.isVideo) {
        mediaContent = (
          <video
            src={defaultStep.animation}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        );
        badgeLabel = "VIDEO";
      } else {
        mediaContent = (
          <Lottie
            animationData={defaultStep.animation}
            loop
            autoplay
            className="w-full h-full p-6"
          />
        );
        badgeLabel = "ANIMATION";
        transparent = true;
      }
    }

    return { mediaContent, badgeLabel, transparent };
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#060b1a] via-[#0a1628] to-[#0d1f3c] text-white py-20 px-4 md:py-28 md:px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        className="max-w-4xl mx-auto text-center mb-16 md:mb-24 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs tracking-[0.2em] text-gray-300 font-medium">
            HOW TO USE
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight">
          {headingLead}{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {headingLastWord}
          </span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {info.subHeading}
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-20 md:space-y-28 relative z-10">
        {videoSteps.map((step, index) => {
          const { mediaContent, badgeLabel, transparent } = renderMedia(step, index);
          return (
            <StepRow
              key={index}
              index={index}
              mediaContent={mediaContent}
              badgeLabel={badgeLabel}
              transparent={transparent}
              stepNumber={index + 1}
              title={step.title || `Step ${index + 1}`}
              description={step.description || "Description will appear here."}
              delay={index * 0.15}
            />
          );
        })}

        {videoSteps.length === 0 &&
          defaultSteps.slice(0, 2).map((step, index) => {
            const { mediaContent, badgeLabel, transparent } = renderMedia(step, index, true);
            return (
              <StepRow
                key={`default-${index}`}
                index={index}
                mediaContent={mediaContent}
                badgeLabel={badgeLabel}
                transparent={transparent}
                stepNumber={index + 1}
                title={step.title}
                description={step.desc}
                delay={index * 0.15}
              />
            );
          })}
      </div>

      <div className="max-w-6xl mx-auto space-y-20 md:space-y-28 mt-16 md:mt-24 relative z-10">
        {otherSteps.map((step, index) => {
          const globalIndex = index + videoSteps.length;
          const { mediaContent, badgeLabel, transparent } = renderMedia(step, index + 2);
          return (
            <StepRow
              key={globalIndex}
              index={globalIndex}
              mediaContent={mediaContent}
              badgeLabel={badgeLabel}
              transparent={transparent}
              stepNumber={globalIndex + 1}
              title={
                step.title ||
                defaultSteps[index + 2]?.title ||
                `Step ${globalIndex + 1}`
              }
              description={
                step.description ||
                defaultSteps[index + 2]?.desc ||
                "Description will appear here."
              }
              delay={globalIndex * 0.15}
            />
          );
        })}

        {otherSteps.length === 0 &&
          defaultSteps.slice(2).map((step, index) => {
            const globalIndex = index + videoSteps.length + 2;
            const { mediaContent, badgeLabel, transparent } = renderMedia(step, index + 2, true);
            return (
              <StepRow
                key={`default-${index + 2}`}
                index={globalIndex}
                mediaContent={mediaContent}
                badgeLabel={badgeLabel}
                transparent={transparent}
                stepNumber={globalIndex + 1}
                title={step.title}
                description={step.desc}
                delay={globalIndex * 0.15}
              />
            );
          })}
      </div>

      <motion.div
        className="max-w-6xl mx-auto mt-20 md:mt-32 text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs tracking-[0.2em] text-gray-300 font-medium">
            WHY SMART NFC CARD
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-10 md:mb-14 tracking-tight">
          Why Use Smart NFC Card?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 px-2">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                className={`bg-gradient-to-br ${benefit.color} backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Icon className={`w-7 h-7 ${benefit.iconColor}`} />
                  </div>
                  <h4 className="font-semibold text-base tracking-wide">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default HowToUse;