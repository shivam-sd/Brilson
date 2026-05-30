import React from "react";
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
  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-red-400 transition"
        >
          ✕
        </button>

        {/* Card Preview */}
       <div
  style={{
    transform:
      window.innerWidth < 640
        ? "scale(0.22)"
        : window.innerWidth < 1024
        ? "scale(0.35)"
        : "scale(0.5)",
    transformOrigin: "center",
  }}
>
          <NFCCardDesign
            activationCode={card.activationCode}
            profileName={card.owner?.name || "John Doe"}
            profileSlug={card.slug}
            cardBgColor={cardBgColor}
            cardTextColor={cardTextColor}
            qrDotsColor={qrDotsColor}
            qrBgColor={qrBgColor}
          />
        </div>

      </div>
    </div>
  );
};

export default CardPreviewModal;