// ParkingTagDesign.jsx (Updated - No color props)
import React, { forwardRef, useLayoutEffect, useRef } from "react";
import { GiSwirlString } from "react-icons/gi";
import { FaPhoneSquareAlt, FaShieldAlt, FaQrcode } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { IoCarSportSharp } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi";
import QRCodeStyling from "qr-code-styling";
import { FaUserTie } from "react-icons/fa";
import { MdWifiCalling3 } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

const ParkingTagDesign = forwardRef(({ activationCode = "#000000" }, ref) => {
  const profileUrl = `${import.meta.env.VITE_DOMAIN}/c/parking-tag/${activationCode}`;
  const displayActivationCode = activationCode || "52V28-91S28-6B799";

  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let mounted = true;

    const createQR = async () => {
      const qr = new QRCodeStyling({
        width: 280,
        height: 280,
        type: "svg",
        data: profileUrl,
        image: "/B.png",
        dotsOptions: {
          margin: 10,
          type: "dots",
          color: "#1a1a1a",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.4,
          margin: 8,
        },
        cornersDotOptions: {
          type: "rounded",
          color: "#d4a843",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#1a1a1a",
        },
      });

      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (mounted) {
        containerRef.current.dataset.ready = "true";
      }
    };

    createQR();
    return () => {
      mounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [profileUrl]);

  return (
    <div
      ref={ref}
      style={{
        width: "1000px",
        height: "650px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        padding: "20px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: "40px",
      }}
    >
      {/* Main Card Container with Premium Shadow */}
      <div
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: "36px",
          border: "1px solid rgba(255,255,255,0.3)",
          width: "100%",
          height: "100%",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,215,0,0.1) inset",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Premium Gold Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #d4a843, #f5d77b, #d4a843)",
            zIndex: 10,
          }}
        />

        {/* LEFT SECTION - Brand + Tagline + Info */}
        <div
          style={{
            width: "50%",
            background:
              "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            padding: "40px 20px",
            position: "relative",
          }}
        >
          {/* Subtle Pattern Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(212,168,67,0.05) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {/* Brand Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  // width: "60px",
                  // height: "60px",
                  // background: "linear-gradient(135deg, #d4a843, #f5d77b)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  fontWeight: "900",
                  color: "yellow",
                  // boxShadow: "0 10px 20px -5px rgba(212,168,67,0.3)",
                }}
              >
                <IoCarSportSharp size={45} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "38px",
                    fontWeight: "800",
                    letterSpacing: "8px",
                    color: "#f5d77b",
                    fontFamily: "'Playfair Display', serif",
                    margin: 0,
                    lineHeight: 1,
                    textShadow: "0 2px 10px rgba(212,168,67,0.2)",
                  }}
                >
                  PARKING TAG
                </h3>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginTop: "4px",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #d4a843)",
                  borderRadius: "2px",
                }}
              />
              <GiSwirlString style={{ color: "#d4a843", fontSize: "26px" }} />
              <div
                style={{
                  width: "80px",
                  height: "2px",
                  background: "linear-gradient(90deg, #d4a843, transparent)",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>

          {/* Main Tagline with Premium Badge */}
          <div
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 2,
              background: "rgba(212,168,67,0.08)",
              padding: "16px 32px",
              borderRadius: "20px",
              border: "1px solid rgba(212,168,67,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(212,168,67,0.5))",
                }}
              />
              <HiOutlineSparkles
                style={{ color: "#d4a843", fontSize: "22px" }}
              />
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(212,168,67,0.5), transparent)",
                }}
              />
            </div>
            <h1
              style={{
                fontSize: "27px",
                fontWeight: "700",
                letterSpacing: "12px",
                color: "#ffffff",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Scan This Tag
            </h1>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "500",
                letterSpacing: "4px",
                color: "#d4a843",
                margin: "6px 0 0 0",
                opacity: 0.9,
              }}
            >
              To Contact Vehicle Owner
            </p>
          </div>

          {/* Hindi Text with Premium Styling */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))",
              borderRadius: "16px",
              border: "1px solid rgba(212,168,67,0.2)",
              padding: "14px 24px",
              maxWidth: "90%",
              position: "relative",
              zIndex: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #d4a843, #f5d77b)",
                  padding: "8px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a0a0a",
                  fontSize: "24px",
                  flexShrink: 0,
                }}
              >
                <FaPhoneSquareAlt size={30} />
              </div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#e0e0e0",
                  letterSpacing: "1px",
                  margin: 0,
                  lineHeight: 1.4,
                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                }}
              >
                वाहन स्वामी से संपर्क करने के लिए इस टैग को स्कैन करें।
              </p>
            </div>
          </div>

          {/* Website with Premium Style */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              position: "relative",
              zIndex: 2,
              padding: "8px 24px",
              borderRadius: "30px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <TfiWorld style={{ color: "#d4a843", fontSize: "20px" }} />
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#ffffff",
                letterSpacing: "4px",
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                opacity: 0.9,
              }}
            >
              www.brilson.in
            </p>
          </div>

          {/* qucik action */}

          <div className="quick-action flex items-center justify-center gap-8">
            <div className="owner flex items-center justify-center flex-col gap-1">
              
                <p className="w-15 h-15 border border-gray-300/30 rounded-full p-2 flex items-center justify-center">
                  <FaUserTie size={25} />
                </p>
                <span className="text-md font-medium text-gray-300 mt-2 w-full text-center">
                  OWNER INFO
                </span>
              
            </div>
            <div className="call flex items-center justify-center flex-col gap-1 ">
              <p className="w-15 h-15 border border-gray-300/30 rounded-full p-2 flex items-center justify-center">
                <MdWifiCalling3 size={25} />
              </p>
              <span className="text-md font-medium text-gray-300 mt-2 w-full text-center">
                INSTANT CALL
              </span>
            </div>
            <div className="location flex items-center justify-center flex-col gap-1">
              <p className="w-15 h-15 border border-gray-300/30 rounded-full p-2 flex items-center justify-center">
                <IoLocationOutline size={25} />
              </p>
              <span className="text-md font-medium text-gray-300 mt-2 w-full text-center">
                LOCATION
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - QR Code + Activation Key */}
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            background: "linear-gradient(160deg, #fafafa 0%, #f0f0f0 100%)",
            padding: "30px 20px",
            position: "relative",
          }}
        >
          {/* Premium QR Code Container */}
          <div
            style={{
              padding: "24px",
              background: "linear-gradient(135deg, #ffffff, #fafafa)",
              borderRadius: "24px",
              boxShadow:
                "0 15px 35px -8px rgba(0,0,0,0.15), 0 0 0 1px rgba(212,168,67,0.2) inset",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Gold Corner Accents */}
            <div
              style={{
                position: "absolute",
                top: -3,
                left: -3,
                width: "20px",
                height: "20px",
                borderTop: "3px solid #d4a843",
                borderLeft: "3px solid #d4a843",
                borderRadius: "4px 0 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: "20px",
                height: "20px",
                borderTop: "3px solid #d4a843",
                borderRight: "3px solid #d4a843",
                borderRadius: "0 4px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -3,
                left: -3,
                width: "20px",
                height: "20px",
                borderBottom: "3px solid #d4a843",
                borderLeft: "3px solid #d4a843",
                borderRadius: "0 0 0 4px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -3,
                right: -3,
                width: "20px",
                height: "20px",
                borderBottom: "3px solid #d4a843",
                borderRight: "3px solid #d4a843",
                borderRadius: "0 0 4px 0",
              }}
            />

            <div
              ref={containerRef}
              style={{ position: "relative", zIndex: 2 }}
            />

            {/* Scan Badge Below QR */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
                padding: "6px 16px",
                background: "linear-gradient(135deg, #d4a843, #f5d77b)",
                borderRadius: "20px",
                color: "#0a0a0a",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              <FaQrcode size={14} />
              <span>Scan to Connect</span>
            </div>
          </div>

          {/* Activation Code with Premium Style */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: 0.6,
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "3px",
                color: "#666",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{ width: "30px", height: "1px", background: "#ccc" }}
              />
              <span>Activation Code</span>
              <div
                style={{ width: "30px", height: "1px", background: "#ccc" }}
              />
            </div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#1a1a1a",
                letterSpacing: "3px",
                margin: 0,
                fontFamily: "'Inter', monospace",
                background: "linear-gradient(135deg, #1a1a1a, #333)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {displayActivationCode}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              <FaShieldAlt style={{ color: "#d4a843", fontSize: "14px" }} />
              <span
                style={{
                  fontSize: "10px",
                  color: "#999",
                  letterSpacing: "1px",
                  fontWeight: "500",
                }}
              >
                SECURE • VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ParkingTagDesign;
