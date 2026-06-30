import React, { forwardRef, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaWifi } from "react-icons/fa";
import QRCodeStyling from "qr-code-styling";

const NFCCardDesign = forwardRef(
  (
    {
      activationCode = "#000000",
      cardBgColor = "#FFFFFF",
      cardTextColor = "#000000",
      qrDotsColor = "#000000",
      qrBgColor = "#ffffff",
    },
    ref
  ) => {
    const profileUrl = `${import.meta.env.VITE_DOMAIN}/public/profile/${activationCode}`;

    // Format activation code for display (if needed)
    const displayActivationCode = activationCode || "52V28-91S28-6B799";

    // Determine border color based on card text color
    const borderColor = cardTextColor === "#ffffff" ? "#333" : cardTextColor;

const containerRef = useRef(null);

useEffect(() => {
  const QrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: profileUrl,
    image: "/B.png",
    dotsOptions: {
      color: qrDotsColor,
      margin:10,
      type: "dots"
    },
    backgroundOptions: {
      color: qrBgColor,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      imageSize: 0.45
    },
    cornersDotOptions: { type: "rounded" },
    cornersSquareOptions: { type: "extra-rounded" },
  });

  if (containerRef.current) {
    containerRef.current.innerHTML = ""; 
    QrCode.append(containerRef.current);
  }
}, [profileUrl, qrDotsColor, qrBgColor]);


    return (
      <div
        ref={ref}
        style={{
          width: "1200px",
          height: "750px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* Main Card Container */}
        <div
          style={{
            background: cardBgColor,
            borderRadius: "32px",
            border: `2px solid ${borderColor}`,
            width: "100%",
            height: "100%",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* LEFT SECTION - WiFi + BRILSON + URL */}
          <div
            style={{
              width: "50%",
              borderRight: `2px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
            }}
          >
            {/* WiFi Icon + NFC Text */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <FaWifi
                size={180}
                color={cardTextColor === "#ffffff" ? "#333" : cardTextColor}
              />
              <h4
                style={{
                  textTransform: "uppercase",
                  fontSize: "35px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  color: cardTextColor === "#ffffff" ? "#333" : cardTextColor,
                  margin: 0,
                }}
              >
                NFC
              </h4>
            </div>

            {/* BRILSON Title */}
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "800",
                color: cardTextColor === "#ffffff" ? "#1a1a2e" : cardTextColor,
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              Brilson
            </h1>

            {/* Website URL */}
            <p
              style={{
                fontSize: "28px",
                letterSpacing: "6px",
                fontWeight: "600",
                color: cardTextColor === "#ffffff" ? "#666" : cardTextColor,
                marginTop: "6px",
              }}
            >
              www.brilson.in
            </p>
          </div>

          {/* RIGHT SECTION - QR Code + Activation Key */}
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {/* QR Code Box */}
            <div
              style={{
                padding: "22px",
                border: `3px solid ${borderColor}`,
                borderRadius: "16px",
                backgroundColor: qrBgColor === "transparent" ? "transparent" : qrBgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <QRCodeSVG
                value={profileUrl}
                size={250}
                fgColor={qrDotsColor}
                bgColor={qrBgColor === "transparent" ? "#ffffff" : qrBgColor}
              /> */}
              
              <div ref={containerRef} id="canvas"></div>
            

            </div>

            {/* Activation Key Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "25px",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  color: cardTextColor === "#ffffff" ? "#666" : cardTextColor,
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Activation Key
              </p>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  fontFamily: "'Courier New', monospace",
                  borderRadius: "12px",
                  border: `2px solid ${borderColor}`,
                  padding: "8px 24px",
                  background: cardBgColor === "#ffffff" ? "#f5f5f5" : "rgba(255,255,255,0.05)",
                  color: cardTextColor,
                  marginTop: "5px",
                }}
              >
                {displayActivationCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default NFCCardDesign;