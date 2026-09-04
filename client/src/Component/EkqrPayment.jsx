import React, { useState } from 'react';
import axios from 'axios';
import { FiLoader, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EkqrPayment = ({ createdOrder, total, token }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handleEkqrPayment = async () => {
    if (!createdOrder) {
      toast.error("Please create order first");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/ekqr/create`,
        {
          orderId: createdOrder._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setPaymentData(res.data);
        
        // Option 1: Redirect to EKQR Payment Page
        if (res.data.payment_url) {
          window.location.href = res.data.payment_url;
        }
        
        // Option 2: Show UPI Intent Options (Mobile)
        // toast.info("Choose your UPI app to pay");
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (err) {
      console.error("EKQR Payment error:", err);
      toast.error(err.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // Payment Status Check (Polling)
  const checkPaymentStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/payment/ekqr/status/${createdOrder._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.status === 'paid') {
        toast.success("Payment successful!");
        navigate('/orders', { replace: true });
        return true;
      } else if (res.data.status === 'failed') {
        toast.error("Payment failed. Please try again.");
        return false;
      }
      return null;
    } catch (err) {
      console.error("Status check error:", err);
      return null;
    }
  };

  // Start polling for status
  React.useEffect(() => {
    if (paymentData) {
      const interval = setInterval(async () => {
        const result = await checkPaymentStatus();
        if (result !== null) {
          clearInterval(interval);
        }
      }, 3000); // Check every 3 seconds

      // Cleanup interval after 2 minutes
      setTimeout(() => {
        clearInterval(interval);
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [paymentData]);

  return (
    <div className="w-full">
      <button
        onClick={handleEkqrPayment}
        disabled={loading}
        className={`w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
            Processing...
          </>
        ) : (
          <>
            Pay ₹{total.toFixed(2)} with UPI
            <FiExternalLink className="w-4 h-4" />
          </>
        )}
      </button>

      {/* UPI Intent Links (Mobile) */}
      {paymentData?.upi_intent && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-2">Pay with UPI App:</p>
          <div className="grid grid-cols-2 gap-2">
            {paymentData.upi_intent.gpay_link && (
              <a
                href={paymentData.upi_intent.gpay_link}
                className="text-center py-2 px-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 text-sm transition"
              >
                GPay
              </a>
            )}
            {paymentData.upi_intent.phonepe_link && (
              <a
                href={paymentData.upi_intent.phonepe_link}
                className="text-center py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 text-sm transition"
              >
                PhonePe
              </a>
            )}
            {paymentData.upi_intent.paytm_link && (
              <a
                href={paymentData.upi_intent.paytm_link}
                className="text-center py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 text-sm transition"
              >
                PayTM
              </a>
            )}
          </div>
        </div>
      )}

      {/* Payment Status Info */}
      {paymentData && (
        <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400 text-center">
            ⏳ Please complete the payment. You will be redirected automatically.
          </p>
        </div>
      )}
    </div>
  );
};

export default EkqrPayment;