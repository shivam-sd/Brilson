import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FiCheckCircle, 
  FiDownload, 
  FiShare2, 
  FiShoppingBag, 
  FiTruck, 
  FiCreditCard,
  FiHome,
  FiCalendar,
  FiPackage,
  FiStar,
  FiRefreshCw
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);

  // Mock order data 
  const mockOrderData = {
    orderId: `ORD${Date.now().toString().slice(-8)}`,
    amount: 2499.99,
    paymentMethod: "Credit Card",
    paymentId: `PAY${Date.now().toString().slice(-8)}`,
    transactionDate: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { name: "Premium Wireless Headphones", quantity: 1, price: 1999.99 },
      { name: "Phone Case", quantity: 2, price: 250.00 },
    ],
    shippingAddress: {
      name: "Aeimesh Jainifer",
      address: "123 Business Street, Tech Park",
      city: "Mumbai",
      pincode: "400001",
      phone: "+91 98765 43210"
    },
    trackingId: `TRK${Date.now().toString().slice(-10)}`
  };

  useEffect(() => {
    // Fire confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Set order details
    if (location.state?.orderData) {
      setOrderDetails(location.state.orderData);
    } else {
      setOrderDetails(mockOrderData);
    }

    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [location.state, navigate]);

  const handleShare = (platform) => {
    const shareText = `Just completed my purchase! Order #${orderDetails.orderId} ₹${orderDetails.amount}`;
    const shareUrl = window.location.origin;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
    }
  };

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    alert('Invoice download will start shortly...');
  };

  const handleTrackOrder = () => {
    navigate(`/track-order/${orderDetails.trackingId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Success Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-emerald-500/10 mb-12"
        >
          {/* Success Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center shadow-2xl">
                <FiCheckCircle className="w-20 h-20 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Successful!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-2"
            >
              Your order has been confirmed and is being processed
            </motion.p>
            <p className="text-emerald-400 font-semibold text-lg">
              Order #{orderDetails?.orderId || 'Loading...'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: FiCreditCard, label: "Amount Paid", value: `₹${orderDetails?.amount?.toFixed(2) || '0.00'}`, color: "emerald" },
              { icon: FiPackage, label: "Items", value: `${orderDetails?.items?.length || 0} Items`, color: "blue" },
              { icon: FiTruck, label: "Delivery", value: "2-3 Business Days", color: "purple" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 text-center"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 mb-4`}>
                  <stat.icon className={`text-${stat.color}-400 w-8 h-8`} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleTrackOrder}
              className="flex-1 max-w-md flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
            >
              <FiTruck size={24} />
              Track Your Order
            </button>
            
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 max-w-md flex items-center justify-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-emerald-500/50 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
            >
              <FiDownload size={24} />
              Download Invoice
            </button>
          </motion.div>
        </motion.div>

        {/* Order Details & Shipping Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiShoppingBag className="text-emerald-400" />
              Order Details
            </h2>
            
            <div className="space-y-6">
              {orderDetails?.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-700/50 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Subtotal</span>
                  <span>₹{orderDetails?.amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-700/50">
                  <span>Total Paid</span>
                  <span className="text-emerald-400">₹{orderDetails?.amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiHome className="text-emerald-400" />
              Shipping Information
            </h2>
            
            <div className="space-y-6">
              {orderDetails?.shippingAddress && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10">
                        <FiCheckCircle className="text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{orderDetails.shippingAddress.name}</h4>
                        <p className="text-gray-400">{orderDetails.shippingAddress.address}</p>
                        <p className="text-gray-400">
                          {orderDetails.shippingAddress.city} - {orderDetails.shippingAddress.pincode}
                        </p>
                        <p className="text-gray-400 mt-2">{orderDetails.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Timeline */}
                  <div className="border-t border-gray-700/50 pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FiCalendar className="text-emerald-400" />
                      Estimated Delivery
                    </h3>
                    <div className="flex items-center gap-3 text-emerald-300">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      <span>{new Date(orderDetails.deliveryDate).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Standard Delivery (2-3 business days)</p>
                  </div>

                  {/* Tracking */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FiPackage className="text-emerald-400" />
                      Tracking ID
                    </h4>
                    <code className="font-mono text-lg bg-black/30 px-4 py-2 rounded-lg block">
                      {orderDetails.trackingId}
                    </code>
                    <p className="text-gray-400 text-sm mt-2">Use this ID to track your shipment</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Share & Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-8"
        >
          {/* Share Section */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiShare2 className="text-emerald-400" />
              Share Your Purchase
            </h2>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <FaWhatsapp size={24} />
                Share on WhatsApp
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <FaFacebook size={24} />
                Share on Facebook
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <FaTwitter size={24} />
                Tweet
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-emerald-500/50 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <FiShare2 size={24} />
                Copy Link
              </button>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiStar className="text-emerald-400" />
              What's Next?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Order Confirmed",
                  description: "We've received your payment and order details",
                  status: "completed"
                },
                {
                  step: "02",
                  title: "Processing",
                  description: "Your items are being prepared for shipment",
                  status: "current"
                },
                {
                  step: "03",
                  title: "Delivery",
                  description: "Your order will be delivered in 2-3 business days",
                  status: "pending"
                }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`p-6 rounded-2xl ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : step.status === 'current'
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'bg-gray-800/30 border border-gray-700/50'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg mb-4 ${
                      step.status === 'completed' 
                        ? 'bg-emerald-500 text-white' 
                        : step.status === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  
                  {idx < 2 && (
                    <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-700 hidden md:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center mt-12 pt-8 border-t border-gray-800/50"
        >
          <p className="text-gray-400 mb-6">
            You will be automatically redirected to your orders in <span className="text-emerald-400 font-bold">{countdown}</span> seconds
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-emerald-500/50 rounded-xl transition-colors"
            >
              Back to Home
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl transition-all"
            >
              <FiRefreshCw />
              Continue Shopping
            </button>
          </div>
          
          <p className="text-gray-500 text-sm mt-8">
            Need help? <button className="text-emerald-400 hover:text-emerald-300">Contact Support</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;