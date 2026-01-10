import { useState, useEffect } from "react";
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
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setIsLoggedIn(!!storedToken);
  }, []);

  useEffect(() => {
    // Load QR scanner only when showScanner is true
    if (showScanner) {
      const loadScanner = async () => {
        try {
          const { Html5QrcodeScanner } = await import("html5-qrcode");
          
          const qrScanner = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              supportedScanTypes: []
            },
            false
          );

          setScanner(qrScanner);

          qrScanner.render(
            (decodedText) => {
              console.log("QR decoded text:", decodedText);
              
              // Parse card ID and activation code from QR
              try {
                // Assuming QR contains JSON like {"cardId":"123","activationCode":"456"}
                const qrData = JSON.parse(decodedText);
                if (qrData.cardId && qrData.activationCode) {
                  setForm({
                    cardId: qrData.cardId,
                    activationCode: qrData.activationCode
                  });
                  toast.success("QR scanned successfully!");
                } else {
                  // Or if it's in format "cardId:activationCode"
                  const parts = decodedText.split(':');
                  if (parts.length === 2) {
                    setForm({
                      cardId: parts[0].trim(),
                      activationCode: parts[1].trim()
                    });
                    toast.success("QR scanned successfully!");
                  }
                }
              } catch (error) {
                // If not JSON, treat as raw data
                toast.info("QR scanned. Please check if data is correct.");
              }
              
              setShowScanner(false);
              if (scanner) {
                scanner.clear();
              }
            },
            (error) => {
              console.log("QR Scan Error:", error);
            }
          );
        } catch (error) {
          console.error("Failed to load QR scanner:", error);
          toast.error("Failed to load QR scanner");
        }
      };

      loadScanner();
    }

    // Cleanup scanner when component unmounts or scanner closes
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [showScanner]);

  const [form, setForm] = useState({
    cardId: "",
    activationCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleActivate = async () => {
    if (!form.cardId || !form.activationCode) {
      toast.error("Card ID and Activation Code are required");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login first to activate card");
      navigate("/login");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/card/activate`,
        {
          cardId: form.cardId,
          activationCode: form.activationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("ACTIVATE RESPONSE ", res);

      const slug =
        res?.data?.slug ||
        res?.data?.card?.slug ||
        res?.data?.data?.slug;

      if (!slug) {
        toast.error("Profile slug not found. Please try again.");
        return;
      }

      toast.success("Card activated successfully");

      setTimeout(() => {
        navigate(`/profile/${slug}`);
      }, 300);
    } catch (err) {
      console.error("Activate Card Error:", err);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast.error(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Unable to activate card. Please check details."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleScanner = () => {
    if (!showScanner) {
      setShowScanner(true);
    } else {
      setShowScanner(false);
      if (scanner) {
        scanner.clear();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <FiCreditCard size={26} />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            Activate Your Card
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Unlock your Brilson digital profile
          </p>
        </div>

        {/* Card ID */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 mb-2 block">
            Card ID
          </label>
          <input
            type="text"
            name="cardId"
            placeholder="Enter Card ID"
            value={form.cardId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Activation Code */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">
            Activation Code
          </label>
          <input
            type="text"
            name="activationCode"
            placeholder="Enter Activation Code"
            value={form.activationCode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Activate Button */}
        <button
          onClick={handleActivate}
          disabled={loading || !isLoggedIn}
          className={`w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-90 duration-300 ${isLoggedIn
            ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600'
            : 'bg-gray-700 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Activating...
            </>
          ) : !isLoggedIn ? (
            "Login Required"
          ) : (
            <>
              Activate Card
              <FiArrowRight />
            </>
          )}
        </button>

        {/* QR Scanner Section */}
        <div className="mt-6 lg:hidden flex">
          <button
            onClick={toggleScanner}
            className="text-lg flex items-center justify-center w-full px-4 py-3 gap-3 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-white/40 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-800 active:scale-95 duration-300 transition-all"
          >
            <MdQrCodeScanner />
            {showScanner ? "Close Scanner" : "Scan Your Card QR"}
          </button>

          {showScanner && (
            <div className="mt-4 flex justify-center">
              <div id="reader" className="w-full max-w-xs bg-white p-2 rounded-lg" />
            </div>
          )}
        </div>

        {/* Login Prompt */}
        {isLoggedIn ? <>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400 mb-2">
              You need to login to activate your card
            </p>
        </div>
            </>:
            <>
            <div className="text-center mt-2">

            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 underline text-sm font-medium"
              >
              Click here to login
            </Link>
                </div>
                </>
        }
      </motion.div>
    </div>
  );
};

export default ActivateCard;