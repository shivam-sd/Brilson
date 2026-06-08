import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaWifi } from "react-icons/fa";

const NFCCardDesign = forwardRef(
  (
    {
      activationCode,
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
            background: "#FFFFFF",
            borderRadius: "32px",
            border: `2px solid ${cardTextColor === "#ffffff" ? "#333" : "#000000"}`,
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
              borderRight: `2px solid ${cardTextColor === "#ffffff" ? "#333" : "#000000"}`,
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
                fontWeight:"600",
                color: "black",
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
                border: `3px solid ${cardTextColor === "#ffffff" ? "#333" : "#000000"}`,
                borderRadius: "16px",
                backgroundColor: qrBgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QRCodeSVG
                value={profileUrl}
                size={250}
                fgColor={qrDotsColor}
                bgColor={qrBgColor}
              />
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
                  color: "black",
                  fontWeight:"600",
                  margin: 0,
                }}
              >
                Activation Key
              </p>
              <font
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  fontFamily: "'Courier New', monospace",
                  borderRadius: "12px",
                  border: `2px solid ${cardTextColor === "#ffffff" ? "#333" : "#000000"}`,
                  padding: "8px 24px",
                  background: cardBgColor === "#ffffff" ? "#f5f5f5" : "transparent",
                  color: "#000000",
                  marginTop:"5px"
                }}
              >
                {displayActivationCode}
              </font>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default NFCCardDesign;