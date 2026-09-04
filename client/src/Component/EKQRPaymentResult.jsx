import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FiLoader, FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  
  const orderId = searchParams.get('order_id');
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        console.log("🔍 Checking payment status for order:", orderId);
        
        // Your existing EKQR status API call
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/payment/ekqr/status/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("📊 Payment Status Response:", res.data);

        if (res.data.status === 'paid') {
          setPaymentStatus('success');
        } else if (res.data.status === 'failed') {
          setPaymentStatus('failed');
        } else {
          // Pending - retry after 3 seconds
          setTimeout(() => {
            checkPaymentStatus();
          }, 3000);
          return;
        }
      } catch (err) {
        console.error("❌ Status check error:", err);
        setError(err.response?.data?.error || "Failed to check payment status");
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId, token]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <FiLoader className="animate-spin text-cyan-400 text-6xl mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold">Verifying Payment...</h2>
          <p className="text-gray-400 mt-2">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-red-500/20">
          <FiXCircle className="text-red-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white text-center mb-2">Something Went Wrong</h2>
          <p className="text-gray-400 text-center">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-6 w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition flex items-center justify-center gap-2"
          >
            Go to Orders <FiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // Success State
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-green-500/20">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-400 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
            <p className="text-gray-400">Your order has been confirmed and will be processed soon.</p>
            <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-300">Order ID: <span className="text-cyan-400 font-mono">{orderId?.slice(-8)}</span></p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2"
            >
              View My Orders <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-red-500/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="text-red-400 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Failed ❌</h2>
          <p className="text-gray-400">Your payment could not be processed. Please try again.</p>
          <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-300">Order ID: <span className="text-cyan-400 font-mono">{orderId?.slice(-8)}</span></p>
          </div>
          <div className="space-y-3 mt-6">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
            >
              Try Again <FiArrowRight />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;