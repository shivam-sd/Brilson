import React, { useEffect, useMemo, useState } from "react";
import {
  FiTrash2,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiChevronRight,
  FiArrowLeft,
  FiPackage,
  FiShield,
  FiTruck,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  /* FETCH CART */
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCartItems(res.data.cartItems || []);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartItems(localCart);
        }
      } catch (err) {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, token]);

  /* REMOVE ITEM */
  const handleRemoveItem = async (cartId) => {
    setRemovingId(cartId);
    try {
      if (isLoggedIn) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/cart/remove/${cartId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems((prev) => prev.filter((i) => i._id !== cartId));
      } else {
        const updated = cartItems.filter((i) => i.productId !== cartId);
        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(updated);
      }

      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  /* UPDATE QUANTITY */
  const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity < 1) {
      handleRemoveItem(cartId);
      return;
    }

    try {
      if (isLoggedIn) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/cart/update/${cartId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems((prev) =>
          prev.map((i) =>
            i._id === cartId ? { ...i, quantity } : i
          )
        );
      } else {
        const updated = cartItems.map((i) =>
          i.productId === cartId ? { ...i, quantity } : i
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(updated);
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  /* TOTALS */
  const { subtotal, tax, total, totalItems } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const tax = subtotal * 0.05;
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    return { subtotal, tax, total: subtotal + tax, totalItems };
  }, [cartItems]);

  /* CHECKOUT */
  const handleCheckout = () => {
    if (!cartItems.length) return toast.error("Cart is empty");

    navigate("/checkout", {
      state: {
        checkoutData: {
          items: cartItems.map((i) => ({
            productId: i.productId?._id || i.productId,
            productTitle: i.productTitle || i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        },
      },
    });
  };

  /* CLEAR CART */
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      if (isLoggedIn) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/cart/clear`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        localStorage.removeItem("cart");
      }
      setCartItems([]);
      toast.success("Cart cleared successfully");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft /> Continue Shopping
            </Link>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Your Shopping Cart
            </h2>
            <p className="text-gray-400 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all hover:scale-105 mt-4 md:mt-0"
            >
              Clear Cart
            </button>
          )}
        </div>

        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 flex items-center justify-center">
                <FiShoppingCart className="w-16 h-16 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
              >
                <FiShoppingCart />
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ITEMS LIST */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <FiPackage className="text-cyan-400" />
                      Cart Items
                    </h2>
                    <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-medium">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item._id || item.productId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative flex gap-6 p-5 bg-gray-900/30 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                        >
                          {/* Product Image */}
                          <div className="relative">
                            <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                              <img
                                src={item.image}
                                alt={item.productTitle || item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center">
                                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                        <FiPackage class="text-cyan-400" />
                                      </div>
                                    </div>
                                  `;
                                }}
                              />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold shadow-lg">
                              {item.quantity}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {item.productTitle || item.title}
                            </h3>
                            {item.color && (
                              <div className="flex items-center gap-2 mb-3">
                                <div 
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-400">{item.color}</span>
                              </div>
                            )}
                            <p className="text-2xl font-bold text-cyan-400">
                              ₹{item.price?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              ₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
                              <button
                                onClick={() => handleUpdateQuantity(
                                  item._id || item.productId,
                                  item.quantity - 1
                                )}
                                className="px-4 py-2 bg-gray-900/50 hover:bg-gray-800/50 transition text-gray-400 hover:text-white disabled:opacity-30"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="px-4 py-2 bg-gray-900/30 text-white font-medium min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(
                                  item._id || item.productId,
                                  item.quantity + 1
                                )}
                                className="px-4 py-2 bg-gray-900/50 hover:bg-gray-800/50 transition text-gray-400 hover:text-white"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item._id || item.productId)}
                              disabled={removingId === (item._id || item.productId)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                            >
                              {removingId === (item._id || item.productId) ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <FiTrash2 size={16} />
                                  Remove
                                </>
                              )}
                            </button>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <FiShield className="text-cyan-400" size={24} />
                    </div>
                    <h4 className="font-semibold mb-2">Secure Payment</h4>
                    <p className="text-sm text-gray-400">100% safe & secure</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <FiTruck className="text-cyan-400" size={24} />
                    </div>
                    <h4 className="font-semibold mb-2">Free Shipping</h4>
                    <p className="text-sm text-gray-400">On orders over ₹999</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <FiRefreshCw className="text-cyan-400" size={24} />
                    </div>
                    <h4 className="font-semibold mb-2">Easy Returns</h4>
                    <p className="text-sm text-gray-400">30-day return policy</p>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <FiShoppingCart className="text-cyan-400" />
                    Order Summary
                  </h2>

                  {/* Summary Items */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-xl font-bold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tax (5%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 border-t border-white/10">
                    <div>
                      <span className="text-xl font-bold">Total</span>
                      <p className="text-sm text-gray-400">Including all taxes</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        ₹{total.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-400">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="group relative w-full mt-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <FiLock size={20} />
                    Proceed to Checkout
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                  {/* Security Note */}
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FiShield className="text-green-400 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm text-green-400 font-medium">Secure Checkout</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Shopping */}
                  <Link
                    to="/products"
                    className="block w-full mt-4 py-3 border border-white/20 hover:border-white/40 text-center rounded-xl hover:bg-white/5 transition-all"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;