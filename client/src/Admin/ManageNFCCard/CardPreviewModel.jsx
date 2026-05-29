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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-xl"
        >
          ✕
        </button>

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
  );
};

export default CardPreviewModal;