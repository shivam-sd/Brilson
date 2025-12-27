import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const StyledQR = ({ url }) => {
  const qrRef = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    if (!url) return;

    qrCode.current = new QRCodeStyling({
      width: 260,
      height: 260,
      data: url,
      type: "png",
      dotsOptions: {
        type: "rounded",
        color: "#000000",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
      cornersDotOptions: {
        type: "dot",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, [url]);

  // If no URL provided, show fallback
  if (!url) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-xs text-gray-500 rounded">
          No QR
        </div>
        <button
          disabled
          className="text-xs px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
        >
          Download
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={qrRef} className="w-24 h-24 bg-white p-2 rounded shadow" />
      
      <button
        onClick={() => qrCode.current?.download({ name: "qr-code" })}
        className="text-xs px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
      >
        Download QR
      </button>
    </div>
  );
};

export default StyledQR;