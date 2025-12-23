import React, { useEffect, useMemo, useState } from "react";
import { FiTrash2, FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // 🔹 FETCH CART
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

  // 🔹 NORMALIZE CART ITEM
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

  // 🔹 REMOVE ITEM FUNCTION
  const handleRemoveItem = async (cartId) => {
    try {
      if (isLoggedIn) {
        // API call for logged in users
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/cart/remove/${cartId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        // Local storage for guest users
        const updatedCart = cartItems.filter(item => {
          const p = getItemData(item);
          return p.cartId !== cartId;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      // Update state
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

  // 🔹 UPDATE QUANTITY FUNCTION
  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (isLoggedIn) {
        // API call for logged in users
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/cart/update/${cartId}`,
          { quantity: newQuantity },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        // Local storage for guest users
        const updatedCart = cartItems.map(item => {
          const p = getItemData(item);
          if (p.cartId === cartId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      // Update state
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

  // 🔹 CALCULATIONS (AUTO UPDATE)
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

  // 🔹 CHECKOUT HANDLER
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
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03060A] text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060A] text-white px-4 md:px-10 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your <span className="text-cyan-400">Shopping Cart</span>
        </h1>
        <p className="text-gray-400">Review and manage your items</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* CART ITEMS */}
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <FiShoppingCart className="text-4xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Add some products to get started</p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Cart Items ({cartItems.length})</h2>
                <span className="text-cyan-400 font-medium">
                  ₹{total.toFixed(2)} total
                </span>
              </div>
              
              {cartItems.map((item) => {
                const p = getItemData(item);
                const itemTotal = p.price * p.quantity;
                
                return (
                  <div
                    key={p.cartId}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  >
                    {/* Item Info */}
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      {p.image ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10">
                          <img
                            src={p.image}
                            alt={p.productTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                      
                      {/* Details */}
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{p.productTitle}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          Variant: <span className="text-cyan-300">{p.variantName}</span>
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleUpdateQuantity(p.cartId, p.quantity - 1)}
                            disabled={p.quantity <= 1}
                            className={`p-2 rounded-lg ${
                              p.quantity <= 1 
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                                : "bg-white/10 hover:bg-white/20"
                            }`}
                          >
                            <FiMinus size={16} />
                          </button>
                          
                          <span className="px-4 py-2 bg-white/10 rounded-lg min-w-[40px] text-center">
                            {p.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleUpdateQuantity(p.cartId, p.quantity + 1)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                          >
                            <FiPlus size={16} />
                          </button>
                          
                          <span className="text-cyan-400 font-bold ml-4">
                            ₹{p.price} × {p.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions & Total */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{itemTotal.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">Item total</p>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(p.cartId)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 p-3 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <FiTrash2 size={20} />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-white/10 pt-4 mt-2">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-cyan-400 font-bold text-xl">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  cartItems.length === 0 
                    ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black"
                }`}
              >
                {cartItems.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
              </button>
            </div>
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => navigate('/products')}
            className="w-full py-3 text-center text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl transition-colors"
          >
            Continue Shopping
          </button>

          {/* Security Note */}
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-300">
              <span className="text-cyan-400 font-semibold">🔒 Secure Checkout:</span> Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;