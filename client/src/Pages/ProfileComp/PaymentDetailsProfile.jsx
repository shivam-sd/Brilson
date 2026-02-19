import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, Copy, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const PaymentDetailsProfile = ({ activationCode }) => {
  const token = localStorage.getItem("token");

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/payment-details/get/${activationCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setPaymentData(res.data.data);
      } catch (err) {
        setPaymentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [activationCode]);

  const hasPayment = !!paymentData;

  const copyUPI = () => {
    navigator.clipboard.writeText(paymentData.upi);
    toast.success("UPI ID Copied");
  };

  const maskAccount = (acc) => {
    if (!acc) return "-";
    return "XXXXXX" + acc.slice(-4);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center sm:px-6 lg:px-8 lg:py-10 md:py-10">

      <div className="
        w-full 
        max-w-5xl 
        bg-white/5 
        backdrop-blur-2xl 
        border border-white/10 
        rounded-2xl sm:rounded-3xl
        shadow-2xl 
        p-5 sm:p-8 lg:p-10
        relative 
        overflow-hidden
      ">

        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-60 sm:w-72 h-60 sm:h-72 bg-emerald-500/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-60 sm:w-72 h-60 sm:h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

        <h2 className="
          text-xl sm:text-2xl lg:text-3xl 
          font-bold 
          text-white 
          text-center 
          mb-8 sm:mb-10
          flex justify-center items-center gap-2 sm:gap-3
        ">
          <CreditCard className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
          Payment Details
        </h2>

        {!hasPayment ? (
          <div className="flex flex-col items-center text-center py-10">
            <p className="text-gray-400 text-sm sm:text-base">
              Add Payment Details From Edit Profile
            </p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10">

            {/* QR + UPI Section */}
            <div className="
              grid 
              grid-cols-1 
              md:grid-cols-2 
              gap-6 sm:gap-8 lg:gap-10 
              items-center
            ">

              {/* QR */}
              {paymentData.image && (
                <div className="flex justify-center">
                  <img
                    src={paymentData.image}
                    alt="QR"
                    className="
                      w-40 h-40
                      sm:w-48 sm:h-48
                      lg:w-56 lg:h-56
                      object-cover 
                      rounded-xl sm:rounded-2xl 
                      border border-white/20 
                      shadow-xl 
                      hover:scale-105 
                      transition duration-300
                    "
                  />
                </div>
              )}

              {/* UPI */}
              {paymentData.upi && (
                <div className="
                  bg-white/5 
                  border border-white/10 
                  p-4 sm:p-6 
                  rounded-xl sm:rounded-2xl 
                  flex flex-col gap-3
                ">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    UPI ID
                  </p>

                  <div className="
                    flex items-center justify-between 
                    bg-black/40 
                    px-3 sm:px-4 
                    py-2 sm:py-3 
                    rounded-lg sm:rounded-xl
                  ">
                    <span className="
                      text-emerald-400 
                      font-semibold 
                      text-sm sm:text-base 
                      break-all
                    ">
                      {paymentData.upi}
                    </span>

                    <button onClick={copyUPI}>
                      <Copy className="
                        w-4 h-4 sm:w-5 sm:h-5
                        text-gray-400 
                        hover:text-white 
                        transition 
                        cursor-pointer
                      " />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BANK DETAILS */}
            {paymentData.paymentDetails && (
              <div className="
                bg-white/5 
                border border-white/10 
                p-5 sm:p-8 
                rounded-xl sm:rounded-2xl 
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                gap-6 sm:gap-8
              ">

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Bank Name</p>
                  <p className="text-white font-medium text-sm sm:text-base break-words">
                    {paymentData.paymentDetails.bankName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Account Holder</p>
                  <p className="text-white font-medium text-sm sm:text-base break-words">
                    {paymentData.paymentDetails.bankHolderName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Account Number</p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    {maskAccount(paymentData.paymentDetails.accountNumber)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">IFSC Code</p>
                  <p className="text-white font-medium text-sm sm:text-base break-words">
                    {paymentData.paymentDetails.ifscCode || "-"}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailsProfile;
