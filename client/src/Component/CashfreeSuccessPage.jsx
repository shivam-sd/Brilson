import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Verify payment
        const verify = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/payment/cashfree/verify`,
          { orderId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (verify.data.success) {
          setSuccess(true);
          toast.success("Payment successful!");
          
          // 2 second baad orders page pe redirect
          setTimeout(() => {
            navigate("/orders", { replace: true });
          }, 2000);
        } else {
          toast.error("Payment verification failed");
          setTimeout(() => {
            navigate("/orders", { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Payment verification failed");
        setTimeout(() => {
          navigate("/orders", { replace: true });
        }, 2000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full text-center">
        {verifying ? (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
            <p className="text-gray-400">Please wait while we verify your payment...</p>
          </>
        ) : success ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">Thank you for your purchase</p>
            <p className="text-sm text-gray-500">Redirecting to orders page...</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-500 text-4xl">!</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-4">Please contact support</p>
            <p className="text-sm text-gray-500">Redirecting to orders page...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;