import React, { useEffect, useState } from "react";
import NFCCardDesign from "./NFCCardDesign";

const CardPreviewModal = ({
  isOpen,
  onClose,
  card,
  cardBgColor,
  cardTextColor,
  qrDotsColor,
  qrBgColor,
}) => {
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScale(0.18);
      } else if (width < 640) {
        setScale(0.22);
      } else if (width < 768) {
        setScale(0.28);
      } else if (width < 1024) {
        setScale(0.35);
      } else {
        setScale(0.5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen || !card) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={onClose} // Click outside to close
    >
      {/* Card Container */}
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Card Preview */}
        <div
        className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <NFCCardDesign
            activationCode={card.activationCode}
            cardBgColor={cardBgColor}
            cardTextColor={cardTextColor}
            qrDotsColor={qrDotsColor}
            qrBgColor={qrBgColor}
          />

          {/* Close Button - Top right corner */}
        <button
          onClick={onClose}
          className="absolute lg:-top-25 lg:right-0 -top-50 -right-30 z-100 flex items-center justify-center text-white hover:text-red-400 lg:w-20 lg:h-20 rounded-full transition-colors cursor-pointer lg:text-2xl border w-40 h-40 text-6xl"
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          ✕
        </button>
        </div>
      </div>
    </div>
  );
};

export default CardPreviewModal;