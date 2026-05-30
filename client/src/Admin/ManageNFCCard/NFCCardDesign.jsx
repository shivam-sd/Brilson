import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const NFCCardDesign = forwardRef(
  (
    {
      activationCode,
      profileName,

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
        className="relative overflow-hidden"
        style={{
          width: "1200px",
          height: "750px",
          background: `
            radial-gradient(circle at top left, rgba(225,196,138,0.12), transparent 30%),
            linear-gradient(90deg, #09091a 0%, #060616 50%, #040412 100%)
          `,
          border: "6px solid #E1C48A",
          borderRadius: "40px",
          boxSizing: "border-box",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Glow Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 30%, transparent 70%, rgba(255,255,255,0.03))",
          }}
        />

        {/* Top Section */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "45px 55px 0px",
          }}
        >
          {/* Left */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "25px",
            }}
          >
            {/* Logo */}
<div
  style={{
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#E1C48A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }}
>
  <span
    style={{
      fontSize: "65px",
      fontWeight: "700",
      color: "#000",
    }}
  >
    B
  </span>
</div>
            {/* Brand */}
<div>
  <h1
    style={{
      color: "#E1C48A",
      fontSize: "82px",
      lineHeight: "0.95",
      fontWeight: "700",
      letterSpacing: "2px",
      margin: 0,
    }}
  >
    BRILSON
  </h1>

  <p
    style={{
      color: "#E1C48A",
      fontSize: "22px",
      letterSpacing: "6px",
      marginTop: "10px",
      marginBottom: 0,
    }}
  >
    PROFESSIONAL CARD
  </p>
</div>
          </div>

          {/* NFC */}
      <div
  style={{
    color: "#E1C48A",
    fontSize: "38px",
    fontWeight: "700",
    letterSpacing: "1px",
  }}
>
  NFC
</div>
  </div>

        {/* User Name */}
        <div
          style={{
            marginLeft: "90px",
            marginTop: "80px",
          }}
        >
          <h2
            style={{
              color: cardTextColor,
              fontSize: "52px",
              fontWeight: "600",
              margin: 0,
              maxWidth: "650px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {profileName || "Card Holder"}
          </h2>
        </div>

        {/* Activation Section */}
        <div
          style={{
            position: "absolute",
            left: "90px",
            bottom: "60px",
          }}
        >
          <div
            style={{
              color: `${cardTextColor}99`,
              fontSize: "24px",
              letterSpacing: "10px",
              marginBottom: "18px",
            }}
          >
            ACTIVATION CODE
          </div>

          <div
            style={{
              color: cardTextColor,
              fontSize: "58px",
              fontWeight: "700",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            {activationCode}
          </div>
        </div>

        {/* QR Section */}
        <div
          style={{
            position: "absolute",
            right: "70px",
            bottom: "40px",
            background: "#fff",
            padding: "18px",
            borderRadius: "35px",
            border: "5px solid #E1C48A",
          }}
        >
          <QRCodeSVG
            value={profileUrl}
            size={250}
            fgColor={qrDotsColor}
            bgColor={qrBgColor}
          />
        </div>

        {/* Bottom Branding */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "12px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "#E1C48A",
              fontSize: "28px",
              letterSpacing: "18px",
            }}
          >
            BRILSON
          </span>
        </div>
      </div>
    );
  }
);

export default NFCCardDesign;