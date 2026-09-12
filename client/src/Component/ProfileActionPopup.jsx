import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, UserPlus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const ProfileActionPopup = ({
  isOpen,
  onClose,
  profile,
  logo,
  onCall,
  onWhatsApp,
  onSaveContact,
}) => {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="
<<<<<<< HEAD
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-gradient-to-br
              from-slate-900/25
              via-[#0b1224]/25
              to-[#080d1b]/25
              shadow-[0_25px_80px_rgba(0,0,0,0.7)]
            "
=======
             relative
             w-full
             max-w-md
             overflow-hidden
             rounded-3xl
             border border-white/10
             bg-white/[0.02]
             backdrop-blur-xl
             shadow-[0_25px_80px_rgba(0,0,0,0.5)]
           "
>>>>>>> 3218d72c5261b9dc5e2abec8593a8a74c8d6b834
          >
            {/* Gold glow */}
            <div className="
              absolute
              -top-24
              left-1/2
              h-48
              w-48
              -translate-x-1/2
              rounded-full
              bg-[#E1C48A]/10
              blur-3xl
              pointer-events-none
            " />

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="
                absolute
                right-4
                top-4
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/5
                text-gray-400
                transition-all
                hover:border-[#E1C48A]/40
                hover:bg-[#E1C48A]/10
                hover:text-[#E1C48A]
              "
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="relative px-6 pt-8 pb-5 text-center">

              {/* Profile image */}
              <div className="
                mx-auto
                mb-4
                h-20
                w-20
                overflow-hidden
                rounded-full
                border-2
                border-[#E1C48A]
                p-1
                shadow-[0_0_30px_rgba(225,196,138,0.15)]
              ">
                <img
                  src={logo}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <h2 className="
                text-2xl
                font-bold
                tracking-wider
                text-white
                font-Roboto
              ">
                {profile.name}
              </h2>

              {profile.title && (
                <p className="
                  mt-1
                  text-sm
                  tracking-wider
                  text-[#E1C48A]
                  font-Roboto
                ">
                  {profile.title}
                </p>
              )}

              <p className="
                mt-4
                text-sm
                leading-relaxed
                text-gray-400
                font-Roboto
              ">
                Connect with {profile.name}
              </p>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Actions */}
            <div className="relative grid grid-cols-3 gap-3 p-6">

              {/* Call */}
              <ActionButton
                icon={<Phone size={22} />}
                label="Call"
                onClick={onCall}
                iconClass="text-[#FF9D42]"
              />

              {/* WhatsApp */}
              <ActionButton
                icon={<FaWhatsapp size={23} />}
                label="WhatsApp"
                onClick={onWhatsApp}
                iconClass="text-[#25D366]"
              />

              {/* Save Contact */}
              <ActionButton
                icon={<UserPlus size={22} />}
                label="Save"
                onClick={onSaveContact}
                iconClass="text-[#E1C48A]"
              />
            </div>

            {/* Bottom hint */}
            <div className="
              border-t
              border-white/5
              bg-black/10
              px-6
              py-3
              text-center
            ">
              <span className="text-[11px] tracking-wider text-gray-500">
                Choose an action to connect
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ActionButton = ({
  icon,
  label,
  onClick,
  iconClass,
}) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="
        group
        flex
        flex-col
        items-center
        justify-center
        gap-2
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        px-3
        py-4
        transition-all
        duration-300
        hover:border-[#E1C48A]/30
        hover:bg-white/[0.06]
        cursor-pointer
      "
    >
      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-white/5
          transition-all
          duration-300
          group-hover:bg-[#E1C48A]/10
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <span className="
        text-xs
        font-medium
        tracking-wide
        text-gray-300
        group-hover:text-white
      ">
        {label}
      </span>
    </motion.button>
  );
};

export default ProfileActionPopup;