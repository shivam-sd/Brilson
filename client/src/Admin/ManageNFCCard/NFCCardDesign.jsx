import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const NFCCardDesign = forwardRef(
  (
    {
      activationCode,
      profileName,
    //   profileSlug,

      cardBgColor = "#0a0a1a",
      cardTextColor = "#ffffff",

      qrDotsColor = "#000000",
      qrBgColor = "#ffffff",
    },
    ref
  ) => {
    const profileUrl = `${import.meta.env.VITE_DOMAIN}/public/profile/${activationCode}`;

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-[26px]"
        style={{
          width: "420px",
          height: "265px",
          background: cardBgColor,
          border: "2px solid #E1C48A",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(255,255,255,0.03)",
        }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-transparent" />

        {/* Top */}
        <div className="flex justify-between items-start p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#E1C48A] flex items-center justify-center">
              <span className="text-black text-2xl font-bold">
                B
              </span>
            </div>

            <div>
              <h1 className="text-[#E1C48A] text-2xl font-bold tracking-widest">
                BRILSON
              </h1>

              <p className="text-[#E1C48A] text-xs mt-1 tracking-[2px]">
                PROFESSIONAL CARD
              </p>
            </div>
          </div>

          <div className="text-[#E1C48A] text-lg font-bold">
            NFC
          </div>
        </div>

        {/* User Name */}
        <div className="px-6 mt-4">
          <h2
            className="text-xl font-semibold truncate"
            style={{ color: cardTextColor }}
          >
            {profileName}
          </h2>
        </div>

        {/* Activation */}
        <div className="absolute bottom-5 left-6">
          <p
            className="text-[10px] tracking-[2px]"
            style={{ color: cardTextColor + "99" }}
          >
            ACTIVATION CODE
          </p>

          <p
            className="font-mono font-bold mt-1 text-sm"
            style={{ color: cardTextColor }}
          >
            {activationCode}
          </p>
        </div>

        {/* QR */}
        <div className="absolute bottom-5 right-5 bg-white p-2 rounded-2xl border-2 border-[#E1C48A]">
          <QRCodeSVG
            value={profileUrl}
            size={85}
            fgColor={qrDotsColor}
            bgColor={qrBgColor}
          />
        </div>

        {/* Bottom Branding */}
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-[#E1C48A] text-[9px] tracking-[4px]">
            BRILSON
          </span>
        </div>
      </div>
    );
  }
);

export default NFCCardDesign;