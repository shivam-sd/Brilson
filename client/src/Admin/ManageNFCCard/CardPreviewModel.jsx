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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="">
        {/* Close Button - Better for mobile */}
        <button
          onClick={onClose}
          className="absolute lg:top-30 md:top-30 top-30 lg:right-100 md:right-100 right-10 text-white hover:text-red-400 transition z-10 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.6)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            fontSize: "20px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          ✕
        </button>

        {/* Card Preview */}
        <div
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
        </div>

        {/* Optional: Tap outside to close (mobile friendly) */}
        <div
          className="fixed inset-0 -z-10"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default CardPreviewModal;