import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import {
  FiTruck,
  FiShoppingBag,
  FiLoader,
  FiCheckCircle,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { Razorpay } = useRazorpay();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Address state
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Checkout data from cart
  const checkoutData = location.state?.checkoutData || {};

  /* 🔐 LOAD CART DATA */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // If checkout data is passed from cart
    if (checkoutData.items) {
      setOrderItems(checkoutData.items);
    } else {
      // Otherwise fetch from API
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const items = res.data.cartItems || [];

      // Map cart items with GST and discount calculations
      const mapped = items.map((item) => {
        const product = item.productId || {};
        const basePrice = item.price || 0;
        const quantity = item.quantity || 1;
        const itemTotal = basePrice * quantity;
        
        // Get GST settings
        const gstEnabled = product.gst?.enabled || false;
        const gstRate = product.gst?.rate || 0;
        
        // Get discount settings
        const discountEnabled = product.discount?.enabled || false;
        const discountType = product.discount?.type || 'percentage';
        const discountValue = product.discount?.value || 0;
        
        // Calculate discount amount
        let discountAmount = 0;
        if (discountEnabled) {
          if (discountType === 'percentage') {
            discountAmount = (itemTotal * discountValue) / 100;
          } else {
            discountAmount = discountValue * quantity;
          }
        }
        
        // Calculate GST amount
        let gstAmount = 0;
        if (gstEnabled) {
          const taxableAmount = itemTotal - discountAmount;
          gstAmount = (taxableAmount * gstRate) / 100;
        }
        
        const finalPrice = itemTotal - discountAmount + gstAmount;
        
        return {
          productId: product._id || item.productId,
          productTitle: item.productTitle || item.title || product.title,
          basePrice,
          quantity,
          
          // Product settings
          gst: {
            enabled: gstEnabled,
            rate: gstRate
          },
          discount: {
            enabled: discountEnabled,
            type: discountType,
            value: discountValue
          },
          
          // Calculated amounts
          discountAmount,
          gstAmount,
          finalPrice,
          itemTotal
        };
      });

      setOrderItems(mapped);
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Failed to load cart");
    }
  };

  /* 💰 AMOUNT CALCULATION using data from cart or local calculation */
  const { subtotal, totalDiscount, totalGst, total } = useMemo(() => {
    // If we have totals from cart, use them
    if (checkoutData.subtotal !== undefined) {
      return {
        subtotal: checkoutData.subtotal || 0,
        totalDiscount: checkoutData.totalDiscount || 0,
        totalGst: checkoutData.totalGst || 0,
        total: checkoutData.total || 0
      };
    }
    
    // Otherwise calculate from orderItems
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;
    
    orderItems.forEach(item => {
      subtotal += item.itemTotal || 0;
      totalDiscount += item.discountAmount || 0;
      totalGst += item.gstAmount || 0;
    });
    
    const total = subtotal - totalDiscount + totalGst;
    
    return { subtotal, totalDiscount, totalGst, total };
  }, [orderItems, checkoutData]);

  /*  ADDRESS VALIDATION */
  const isAddressValid =
    address.name &&
    /^\d{10}$/.test(address.phone) &&
    address.city &&
    address.state &&
    /^\d{6}$/.test(address.pincode);

  /*  CREATE ORDER */
  const handleCreateOrder = async () => {
    if (!isAddressValid) {
      toast.error("Please enter a valid address");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("No items in cart");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        items: orderItems.map(item => ({
          productId: item.productId,
          productTitle: item.productTitle,
          price: item.basePrice, // Original price
          quantity: item.quantity,
          
          // Pass GST and discount settings
          gst: item.gst,
          discount: item.discount,
          
          // Pass calculated amounts for verification
          discountAmount: item.discountAmount,
          gstAmount: item.gstAmount,
          finalPrice: item.finalPrice
        })),
        address,
        totalAmount: total, // Final amount after GST and discount
        subtotal,
        discount: totalDiscount,
        tax: totalGst // GST is considered as tax
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/create`,
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCreatedOrder(res.data.order);
      toast.success("Order created successfully");
      
      // Clear cart after successful order creation
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/cart/clear`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (cartErr) {
        console.warn("Failed to clear cart:", cartErr);
      }
    } catch (err) {
      console.error("Order creation error:", err);
      toast.error(err?.response?.data?.error || "Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  /*  PAYMENT */
  const handlePayment = async () => {
    if (!createdOrder) {
      toast.error("Please create order first");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/create`,
        {
          orderId: createdOrder._id,
          amount: Math.round(total * 100), // Convert to paise
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.amount,
        currency: "INR",
        order_id: res.data.id,
        name: "Brilson",
        description: `Order #${createdOrder._id.slice(-8)}`,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              navigate("/orders", { replace: true });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification error");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
          email: address.email || "customer@example.com",
        },
        theme: {
          color: "#06b6d4", // Cyan color
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            toast.info("Payment cancelled");
          }
        }
      };

      new Razorpay(options).open();
    } catch (err) {
      console.error("Payment initialization error:", err);
      toast.error("Payment initialization failed");
      setIsProcessingPayment(false);
    }
  };

  /*  UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white px-4 sm:px-6 py-8 sm:py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Back to Cart
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-gray-400 mt-2">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <FiTruck className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                  <input
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone *</label>
                  <input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">City *</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">State *</label>
                  <input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Pincode *</label>
                  <input
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-cyan-400">
                  <FiShield className="inline mr-2" />
                  Your address is secure and will only be used for delivery purposes.
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order Items</h2>
              <div className="space-y-3 sm:space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-900/30 rounded-xl border border-white/10">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm sm:text-base">{item.productTitle}</h3>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">
                        <span>Base: ₹{item.basePrice} × {item.quantity}</span>
                        {item.discountAmount > 0 && (
                          <span className="ml-2 text-green-400">
                            Discount: -₹{item.discountAmount.toFixed(2)}
                          </span>
                        )}
                        {item.gstAmount > 0 && (
                          <span className="ml-2 text-blue-400">
                            GST: +₹{item.gstAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-bold text-cyan-400">
                        ₹{item.finalPrice?.toFixed(2) || (item.basePrice * item.quantity).toFixed(2)}
                      </div>
                      {item.discountAmount > 0 && (
                        <div className="text-xs text-gray-400 line-through">
                          ₹{(item.basePrice * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Order Button */}
            <button
              onClick={handleCreateOrder}
              disabled={loading || !isAddressValid || createdOrder || orderItems.length === 0}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  Creating Order...
                </>
              ) : createdOrder ? (
                <>
                  <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Order Created Successfully
                </>
              ) : (
                "Create Order"
              )}
            </button>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <div className="space-y-6 sm:space-y-8">
            <div className="sticky top-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <FiShoppingBag className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">Subtotal</span>
                  <span className="font-medium text-sm sm:text-base">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Discount</span>
                    <span className="text-green-400 font-medium text-sm sm:text-base">
                      -₹{totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* GST */}
                {totalGst > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">GST</span>
                    <span className="text-blue-400 font-medium text-sm sm:text-base">
                      +₹{totalGst.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">Shipping</span>
                  <span className="text-green-400 text-sm sm:text-base">FREE</span>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-2 sm:my-4"></div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-base sm:text-lg">Total Amount</span>
                    <p className="text-xs sm:text-sm text-gray-400">Including GST and discount</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      ₹{total.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-400">
                      {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={!createdOrder || isProcessingPayment}
                  className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                >
                  {isProcessingPayment ? (
                    <>
                      <FiLoader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Pay ₹{total.toFixed(2)}
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-start gap-2">
                    <FiShield className="text-green-400 mt-0.5 flex-shrink-0 w-4 h-4" />
                    <div>
                      <p className="text-green-400 font-medium text-xs">100% Secure Payment</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Your payment is secured with Razorpay
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                  <p className="text-xs text-cyan-400">
                    Note: The amount shown includes all applicable taxes (GST) and discounts as per product settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;