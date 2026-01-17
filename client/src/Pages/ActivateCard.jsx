import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiArrowRight } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { MdQrCodeScanner } from "react-icons/md";

const ActivateCard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  const [form, setForm] = useState({
    activationCode: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  /* QR SCANNER - Fixed with useRef */
  useEffect(() => {
    if (!showScanner) return;

    const loadScanner = async () => {
      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode");

        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: 250,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true
          },
          false
        );

        scannerRef.current.render(
          (decodedText) => {
            setForm({ activationCode: decodedText.trim() });
            toast.success("Activation code scanned!");
            setShowScanner(false);
            scannerRef.current?.clear();
            scannerRef.current = null;
          },
          (error) => {
            // Optional: Handle scanning errors quietly
            console.log("QR scanning error:", error);
          }
        );
      } catch (err) {
        console.error("Failed to load QR scanner:", err);
        toast.error("QR scanner failed to load");
        setShowScanner(false);
      }
    };

    loadScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          console.log("Error clearing scanner:", e);
        }
        scannerRef.current = null;
      }
    };
  }, [showScanner]);

  /* Form Input Handler - Now trims only on submit */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ACTIVATE */
  const handleActivate = async () => {
    const trimmedCode = form.activationCode.trim();
    
    if (!trimmedCode) {
      toast.error("Activation Code is required");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/card/activate`,
        { activationCode: trimmedCode },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const slug =
        res?.data?.slug ||
        res?.data?.card?.slug ||
        res?.data?.data?.slug;

      if (!slug) {
        toast.error("Profile not found");
        return;
      }

      toast.success("Card activated successfully");
      navigate(`/profile/${slug}`);
    } catch (err) {
      console.error("Activation error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(
        err?.response?.data?.message ||
        "Invalid activation code"
      );
    } finally {
      setLoading(false);
    }
  };

  /* Enter key support */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && isLoggedIn && form.activationCode.trim()) {
      handleActivate();
    }
  };

  /* Check if activation button should be enabled */
  const isActivateButtonEnabled =  form.activationCode.trim().length > 0 && !loading;

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-3xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <FiCreditCard size={26} />
          </div>
          <h2 className="text-2xl text-white font-semibold">
            Activate Your Card
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter your activation code
          </p>
        </div>

        {/* Activation Code Input */}
        <input
          type="text"
          name="activationCode"
          value={form.activationCode}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter activation code"
          className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          autoComplete="off"
          autoFocus
        />

        {/* Activate Button - Now properly enabled/disabled */}
        <button
          onClick={handleActivate}
          disabled={!isActivateButtonEnabled}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
            isActivateButtonEnabled
              ? "bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 transform hover:-translate-y-0.5 active:translate-y-0"
              : "bg-gray-700 cursor-not-allowed opacity-60"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Activating...
            </>
          ) : (
            <>
              Activate Card
              <FiArrowRight />
            </>
          )}
        </button>

        {/* QR SCAN Section - Improved */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#111827] text-gray-400">Or scan QR code</span>
            </div>
          </div>

          <button
            onClick={() => setShowScanner(!showScanner)}
            className="w-full mt-4 py-3 border border-gray-700 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-gray-800/50 transition-all"
          >
            <MdQrCodeScanner className="text-lg" />
            {showScanner ? "Hide QR Scanner" : "Scan QR Code"}
          </button>

          {showScanner && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="text-center text-sm text-gray-400 mb-2">
                Point your camera at the QR code
              </div>
              <div 
                id="reader" 
                className="bg-white rounded-xl overflow-hidden p-2 border-2 border-indigo-500/30"
                style={{ minHeight: "250px" }}
              ></div>
              
              <button
                onClick={() => {
                  setShowScanner(false);
                  if (scannerRef.current) {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                  }
                }}
                className="w-full mt-3 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Cancel Scanning
              </button>
            </motion.div>
          )}
        </div>

        {/* Login Prompt */}
        {!isLoggedIn && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400 mb-2">
              You need to login first to activate a card
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 underline text-sm transition-colors"
            >
              Click here to login
            </Link>
          </div>
        )}

        {/* Debug info (optional - remove in production) */}
        {/* <div className="mt-4 text-xs text-gray-500">
          <div>Activation Code Length: {form.activationCode.trim().length}</div>
          <div>Button Enabled: {isActivateButtonEnabled ? "Yes" : "No"}</div>
        </div> */}
      </motion.div>
    </div>
  );
};

export default ActivateCard;