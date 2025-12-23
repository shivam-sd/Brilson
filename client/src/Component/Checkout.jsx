import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 
import { motion } from "framer-motion";
import { 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiHome, 
  FiGlobe, 
  FiCreditCard,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiAlertCircle,
  FiPackage
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // Step 1: Get data from Cart Page via location state
  useEffect(() => {
    if (location.state?.checkoutData) {
      setCheckoutData(location.state.checkoutData);
      setOrderItems(location.state.checkoutData.items);
      setTotalAmount(location.state.checkoutData.totalAmount);
    } else {
      // If no data from cart, fetch from API
      fetchCartFromAPI();
    }
  }, [location]);

  // Step 2: If no data from cart, fetch from API
  const fetchCartFromAPI = async () => {
    const token = localStorage.getItem("token");
    
    try {
      if (token) {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        
        const items = res.data.cartItems || [];
        setCartItems(items);
        
        // Transform cart items to order items format
        const orderItemsData = items.map(item => {
          const variant = item.productId?.variants?.[0];
          return {
            productId: item.productId?._id || item.productId,
            productTitle: item.productId?.title || "Product",
            variantId: variant?._id || item.variantId || null,
            variantName: variant?.name || item.variantName || "Default",
            price: variant?.price || item.price || 0,
            quantity: item.quantity || 1
          };
        });
        
        setOrderItems(orderItemsData);
        
        // Calculate total
        const subtotal = orderItemsData.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        const tax = subtotal * 0.05;
        setTotalAmount(subtotal + tax);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
      toast.error("Failed to load cart items");
    }
  };

  // Step 3: Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!address.name.trim()) newErrors.name = "Name is required";
    if (!address.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(address.phone)) newErrors.phone = "Invalid phone number";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = "Invalid pincode";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4: Create Order
  const handleCreateOrder = async () => {
  if (!validateForm()) {
    toast.error("Please fix the errors in the form");
    return;
  }

  if (orderItems.length === 0) {
    toast.error("No items in cart!");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login to continue");
    navigate("/login");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/orders/create`,
      {
        address: {
          name: address.name,
          phone: address.phone,
          city: address.city,
          state: address.state,
          pincode: Number(address.pincode),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    toast.success("Order created successfully 🎉");

    
    // navigate(`/payment/${res.data.order._id}`, {
    //   state: {
    //     order: res.data.order,
    //   },
    // });

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to create order"
    );
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const inputFields = [
    { key: "name", label: "Full Name", icon: FiUser, type: "text", placeholder: "John Doe", required: true },
    { key: "phone", label: "Phone Number", icon: FiPhone, type: "tel", placeholder: "9876543210", required: true },
    { key: "city", label: "City", icon: FiMapPin, type: "text", placeholder: "Mumbai", required: true },
    { key: "state", label: "State", icon: FiGlobe, type: "text", placeholder: "Maharashtra", required: true },
    { key: "pincode", label: "Pincode", icon: FiMapPin, type: "text", placeholder: "400001", required: true },
  ];

  // Calculate subtotal and tax
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#03060A] to-gray-950 text-white p-4 md:p-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Secure <span className="text-cyan-400">Checkout</span>
          </h1>
          <p className="text-gray-400">Complete your order in simple steps</p>
          
          {/* Show warning if no items */}
          {orderItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 inline-flex items-center gap-2"
            >
              <FiAlertCircle className="text-yellow-400" />
              <span>Your cart is empty. Please add items first.</span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Address Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                  <FiTruck className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Shipping Address</h2>
                  <p className="text-gray-400 text-sm">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-300">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={field.type}
                        value={address[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border ${errors[field.key] ? 'border-red-500/50' : address[field.key] ? 'border-cyan-400/50' : 'border-gray-700'} rounded-xl focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors`}
                        required={field.required}
                      />
                    </div>
                    {errors[field.key] && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FiAlertCircle size={14} /> {errors[field.key]}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                  <FiPackage className="text-purple-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Order Items</h2>
                  <p className="text-gray-400 text-sm">Review your items before placing order</p>
                </div>
              </div>

              <div className="space-y-4">
                {orderItems.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No items in cart</p>
                ) : (
                  orderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-900/30 to-blue-900/30 flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.productTitle}</p>
                          <p className="text-gray-400 text-sm">
                            {item.variantName} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                        <p className="text-gray-400 text-sm">₹{item.price} each</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <FiShield className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-blue-300 mb-2">Secure Checkout</h3>
                  <p className="text-gray-300 text-sm">
                    Your personal information is encrypted and secure. We never share your details with third parties.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Order Summary Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20">
                  <FiShoppingBag className="text-blue-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Items ({orderItems.length})</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-cyan-400">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateOrder}
              disabled={loading || orderItems.length === 0}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-4 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <FiCreditCard size={24} />
                  <span>Create Order & Pay</span>
                </>
              )}
            </motion.button>

            {/* Return to Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="w-full text-center text-gray-400 hover:text-white py-3 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
            >
              ← Return to Cart
            </button>

            {/* Payment Methods */}
            <div className="bg-gray-800/20 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-3">Accepted Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-xs">💳 Card</div>
                <div className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-xs">🏦 UPI</div>
                <div className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-xs">📱 Net Banking</div>
                <div className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-xs">💰 COD</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;