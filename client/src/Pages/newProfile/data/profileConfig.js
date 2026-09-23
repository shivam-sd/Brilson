import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiPinterest,
  SiReddit,
  SiSnapchat,
  SiTelegram,
  SiX,
  SiYoutube,
  SiWhatsapp,
  SiMojeek,
} from "react-icons/si";
import { FaCreditCard, FaEnvelope, FaGlobe, FaGoogle, FaPhone, FaUser, FaUserPlus, FaWhatsapp } from "react-icons/fa";
import { LuBox, LuImage } from "react-icons/lu";
import { FaFileLines, FaGear, FaLocationDot } from "react-icons/fa6";
import { TbBrandSnapchat } from "react-icons/tb";
import { FcPhone } from "react-icons/fc";

export const BOTTOM_QUOTE = "Turning Ideas Into Impact";
export const HANDWRITTEN_LINES = ["Let's", "Connect", "Create", "Together..."];


export const CONTACT_ICONS = {
  call: { Icon: FaPhone, className: "text-[#25d366]" },
  whatsapp: { Icon: FaWhatsapp, className: "text-[#25d366]" },
  email: { Icon: FaEnvelope, className: "text-amber-400" },
  save: { Icon: FaUserPlus, className: "text-orange-400" },
};

export const SECTION_THEMES = {
  blue: {
    iconBox: "bg-[#0b3b91] shadow-[0_0_32px_-8px_rgba(37,99,235,0.8)]",
    icon: "text-[#3d8bff]",
    openBorder: "border-blue-400/30",
    accent: "text-blue-300 hover:text-blue-200",
    focus: "focus-visible:ring-blue-400/70",
  },
  orange: {
    iconBox: "bg-[#7c3a06] shadow-[0_0_32px_-8px_rgba(249,115,22,0.75)]",
    icon: "text-orange-400",
    openBorder: "border-orange-400/30",
    accent: "text-orange-300 hover:text-orange-200",
    focus: "focus-visible:ring-orange-400/70",
  },
  purple: {
    iconBox: "bg-[#4c1573] shadow-[0_0_32px_-8px_rgba(168,85,247,0.75)]",
    icon: "text-fuchsia-400",
    openBorder: "border-fuchsia-400/30",
    accent: "text-fuchsia-300 hover:text-fuchsia-200",
    focus: "focus-visible:ring-fuchsia-400/70",
  },
  green: {
    iconBox: "bg-[#075a3c] shadow-[0_0_32px_-8px_rgba(16,185,129,0.75)]",
    icon: "text-emerald-400",
    openBorder: "border-emerald-400/30",
    accent: "text-emerald-300 hover:text-emerald-200",
    focus: "focus-visible:ring-emerald-400/70",
  },
  amber: {
    iconBox: "bg-[#6e4b07] shadow-[0_0_32px_-8px_rgba(245,158,11,0.75)]",
    icon: "text-amber-400",
    openBorder: "border-amber-400/30",
    accent: "text-amber-300 hover:text-amber-200",
    focus: "focus-visible:ring-amber-400/70",
  },
  indigo: {
    iconBox: "bg-[#2a2a8c] shadow-[0_0_32px_-8px_rgba(99,102,241,0.8)]",
    icon: "text-indigo-300",
    openBorder: "border-indigo-400/30",
    accent: "text-indigo-300 hover:text-indigo-200",
    focus: "focus-visible:ring-indigo-400/70",
  },
  teal: {
    iconBox: "bg-[#06574f] shadow-[0_0_32px_-8px_rgba(20,184,166,0.75)]",
    icon: "text-teal-300",
    openBorder: "border-teal-400/30",
    accent: "text-teal-300 hover:text-teal-200",
    focus: "focus-visible:ring-teal-400/70",
  },
  rose: {
    iconBox: "bg-[#8c0f2e] shadow-[0_0_32px_-8px_rgba(244,63,94,0.75)]",
    icon: "text-rose-400",
    openBorder: "border-rose-400/30",
    accent: "text-rose-300 hover:text-rose-200",
    focus: "focus-visible:ring-rose-400/70",
  },
};

export const ACCORDION_SECTIONS = [
  // { id: "about", title: "About", subtitle: "Know more about me and my journey", icon: FaUser, color: "blue" },
  { id: "services", title: "Services", subtitle: "What I offer", icon: FaGear, color: "orange" },
  { id: "products", title: "Products", subtitle: "View my Products", icon: LuBox, color: "purple" },
  { id: "gallery", title: "Gallery", subtitle: "Photos & moments", icon: LuImage, color: "green" },
  { id: "location", title: "Location", subtitle: "Get in touch", icon: FaLocationDot, color: "amber" },
  { id: "google-review", title: "Google Review", subtitle: "Directions & customer reviews", icon: FaGoogle, color: "indigo" },
  { id: "payment", title: "Payment Details", subtitle: "Bank & UPI details", icon: FaCreditCard, color: "teal" },
  { id: "resume", title: "Resume / CV", subtitle: "Download my resume", icon: FaFileLines, color: "rose" },
];


export const SOCIAL_PLATFORMS = {
  website: {
    label: "Website",
    Icon: FaGlobe,
    className: "bg-[#111827]",
  },
  whatsapp: {
    label: "WhatsApp",
    Icon: SiWhatsapp,
    className: "bg-[#25D366]",
  },
  facebook: {
    label: "Facebook",
    Icon: SiFacebook,
    className: "bg-[#1877F2]",
  },
  instagram: {
    label: "Instagram",
    Icon: SiInstagram,
    className:
      "bg-[linear-gradient(45deg,#f9ce34,#ee2a7b_50%,#6228d7)]",
  },
  linkedin: {
    label: "LinkedIn",
    Icon: SiLinkedin,
    className: "bg-[#0A66C2]",
  },
  snapchat: {
    label: "Snapchat",
    Icon: SiSnapchat,
    className: "bg-black text-black",
  },

  telegram: {
    label: "Telegram",
    Icon: SiTelegram,
    className: "bg-[#229ED9]",
  },

  twitter: {
    label: "X (Twitter)",
    Icon: SiX,
    className: "bg-black ring-1 ring-white/30",
  },
  youtube: {
    label: "YouTube",
    Icon: SiYoutube,
    className: "bg-[#FF0000]",
  },

  pinterest: {
    label: "Pinterest",
    Icon: SiPinterest,
    className: "bg-[#E60023]",
  },



  reddit: {
    label: "Reddit",
    Icon: SiReddit,
    className: "bg-[#FF4500]",
  },
  josh: {
    label: "Josh",
    Icon: SiSnapchat,
    className: "bg-black",
  },
  sharechat: {
    label: "ShareChat",
    Icon: SiSnapchat,
    className: "bg-[#FF4B55]",
  },
  moj: {
    label: "Moj",
    Icon: SiMojeek,
    className: "bg-black",
  },
};