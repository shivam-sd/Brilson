import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const CheckStatusPage = () => {
  const { activationCode } = useParams();
  const navigate = useNavigate();
          // console.log("activation code" , activationCode)

  useEffect(() => {
    const CheckStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/check/card/${activationCode}`
        );
// console.log(res);
        if (res.data?.isActivated) {
          navigate(`/profile/${activationCode}`, { replace: true });
        } else {
          navigate(`/card/activate`, { replace: true });
        }
      } catch (err) {
        navigate("/404");
      }
    };

    CheckStatus();
  }, [activationCode, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070D] via-[#070B16] to-[#05070D] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl"
      >
        {/* LOGO */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-bold text-xl shadow-lg"
        >
          B
        </motion.div>

        {/* TEXT */}
        <h1 className="text-2xl font-bold text-white mt-8">
          Verifying your card
        </h1>
        <p className="text-gray-400 mt-2">
          Please wait while we securely fetch your profile
        </p>

        {/* LOADER */}
        <div className="flex justify-center mt-8">
          <div className="w-14 h-14 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>

        {/* FOOTER */}
        <p className="mt-8 text-xs text-gray-500">
          Powered by{" "}
          <span className="text-cyan-400 font-semibold">Brilson</span>
        </p>
      </motion.div>
    </div>
  );
};

export default CheckStatusPage;
