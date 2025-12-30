import React, { useEffect, useMemo, useState } from "react";
import { FiTrash2, FiShoppingCart, FiPlus, FiMinus, FiChevronRight } from "react-icons/fi";
import { replace, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  //  FETCH CART
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setCartItems(res.data.cartItems || []);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartItems(localCart);
        }
      } catch (err) {
        console.error("Fetch cart error", err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, token]);

  // NORMALIZE CART ITEM
  const getItemData = (item) => {
    if (item.productId && typeof item.productId === "object") {
      const variant = item.productId.variants?.[0];
      return {
        cartId: item._id,
        productId: item.productId._id,
        productTitle: item.productId.title,
        image: item.productId.image || "",
        variantId: variant?._id || null,
        variantName: variant?.name || "Default",
        price: variant?.price || 0,
        quantity: item.quantity || 1,
      };
    }

    return {
      cartId: item._id || item.productId,
      productId: item.productId,
      productTitle: item.title,
      image: item.image || "",
      variantId: item.variantId,
      variantName: item.variantName || "Default",
      price: item.price,
      quantity: item.quantity || 1,
    };
  };

  // REMOVE ITEM FUNCTION
  const handleRemoveItem = async (cartId) => {
    try {
      if (isLoggedIn) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/cart/remove/${cartId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log(cartId);
      } else {
        const updatedCart = cartItems.filter(item => {
          const p = getItemData(item);
          return p.cartId !== cartId;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      setCartItems(prev => prev.filter(item => {
        const p = getItemData(item);
        return p.cartId !== cartId;
      }));

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("Failed to remove item");
    }
  };

  //  UPDATE QUANTITY FUNCTION
  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (isLoggedIn) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/cart/update/${cartId}`,
          { quantity: 1 },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        const updatedCart = cartItems.map(item => {
          const p = getItemData(item);
          if (p.cartId === cartId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      setCartItems(prev => prev.map(item => {
        const p = getItemData(item);
        if (p.cartId === cartId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));

    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity");
    }
  };

  // CALCULATIONS
  const { subtotal, tax, total, checkoutItems } = useMemo(() => {
    let subtotal = 0;

    const items = cartItems.map((item) => {
      const p = getItemData(item);
      subtotal += p.price * p.quantity;
      return p;
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return { 
      subtotal, 
      tax, 
      total, 
      checkoutItems: items
    };
  }, [cartItems]);

  //  CHECKOUT HANDLER
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    navigate("/checkout", {
      state: {
        checkoutData: {
          items: checkoutItems,
          subtotal,
          tax,
          totalAmount: total,
        },
      },
    }, {replace:true});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#03060A] to-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-300">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#03060A] to-gray-900 text-white">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 py-12 md:py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-6xl mx-auto text-center mt-10">
          <h1 className="text-sm lg:text-xl mb-2">
  Shopping{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
    Cart
  </span>
</h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Review and manage your items before checkout
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Cart Items Section - Left Column */}
          <div className="lg:w-2/3">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 md:py-20 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-full flex items-center justify-center mx-auto">
                    <FiShoppingCart className="text-gray-500 w-12 h-12 md:w-16 md:h-16" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-200">Your cart is empty</h3>
                <p className="text-gray-400 mb-8 px-4">Looks like you haven't added any products yet</p>
                <button 
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-semibold py-3 px-6 md:py-4 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {/* Cart Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Your Items</h2>
                    <p className="text-gray-400 text-sm md:text-base">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 px-4 py-2 md:px-5 md:py-3 rounded-xl">
                    <span className="text-cyan-400 font-bold text-lg md:text-xl">₹{total.toFixed(2)}</span>
                    <span className="text-gray-400 text-sm">total</span>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3 md:space-y-4">
                  {cartItems.map((item) => {
                    const p = getItemData(item);
                    const itemTotal = p.price * p.quantity;
                    
                    return (
                      <div
                        key={p.cartId}
                        className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-full sm:w-28 h-28 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.productTitle}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-3xl">📦</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg md:text-xl mb-1 line-clamp-1">
                                  {p.productTitle}
                                </h3>
                                <p className="text-sm text-gray-400 mb-3">
                                  Variant: <span className="text-cyan-300">{p.variantName}</span>
                                </p>
                                
                                {/* Quantity Controls - Mobile Stacked, Desktop Inline */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-cyan-400">₹{p.price}</span>
                                    <span className="text-gray-500">×</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleUpdateQuantity(p.cartId, p.quantity - 1)}
                                      disabled={p.quantity <= 1}
                                      className={`p-2 rounded-lg transition-colors ${
                                        p.quantity <= 1 
                                          ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                                          : "bg-gray-700 hover:bg-gray-600"
                                      }`}
                                      aria-label="Decrease quantity"
                                    >
                                      <FiMinus size={18} />
                                    </button>
                                    
                                    <span className="px-4 py-2 bg-gray-800 rounded-lg min-w-[3rem] text-center font-medium">
                                      {p.quantity}
                                    </span>
                                    
                                    <button
                                      onClick={() => handleUpdateQuantity(p.cartId, p.quantity + 1)}
                                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <FiPlus size={18} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Price and Actions */}
                              <div className="flex flex-col items-end gap-4">
                                <div className="text-right">
                                  <p className="text-xl md:text-2xl font-bold">₹{itemTotal.toFixed(2)}</p>
                                  <p className="text-sm text-gray-400">Item total</p>
                                </div>
                                
                                <button 
                                  onClick={() => handleRemoveItem(p.cartId)}
                                  className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 md:px-4 md:py-2 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                                  aria-label="Remove item"
                                >
                                  <FiTrash2 size={18} />
                                  <span className="text-sm font-medium hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:w-1/3">
            <div className="sticky top-6 space-y-4 md:space-y-6">
              {/* Summary Card */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl md:rounded-3xl p-5 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Order Summary
                </h2>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Shipping</span>
                      <span className="text-green-400 font-medium">FREE</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50 pb-3">
                      <span className="text-gray-300">Tax (5%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-700/50">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total Amount</span>
                        <span className="text-cyan-400 font-bold text-xl md:text-2xl">₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm mt-1 text-right">
                        Inclusive of all taxes
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className={`w-full mt-6 md:mt-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      cartItems.length === 0 
                        ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black shadow-lg hover:shadow-cyan-500/25"
                    }`}
                  >
                    {cartItems.length === 0 ? (
                      "Cart is Empty"
                    ) : (
                      <>
                        Proceed to Checkout
                        <FiChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="w-full py-3 text-center text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FiShoppingCart className="w-4 h-4" />
                Continue Shopping
              </button>

              {/* Security & Benefits */}
              <div className="space-y-3 md:space-y-4">
                <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-cyan-500/10 rounded-lg">
                      <span className="text-cyan-400 text-lg">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-300 text-sm md:text-base mb-1">Secure Checkout</h4>
                      <p className="text-gray-400 text-xs md:text-sm">
                        Your payment information is encrypted and secure with bank-level security.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-green-500/10 rounded-lg">
                      <span className="text-green-400 text-lg">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-300 text-sm md:text-base mb-1">Easy Returns</h4>
                      <p className="text-gray-400 text-xs md:text-sm">
                        30-day return policy. Free return shipping on all orders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;