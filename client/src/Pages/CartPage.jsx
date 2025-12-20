import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useRazorpay } from "react-razorpay";

const CartPage = () => {
  const { Razorpay } = useRazorpay();

  const orderId = "693cea63ff618994dbec1100";

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQwMTEwOGJmNjQ3ZTM4ZWQwNGU4M2MiLCJpYXQiOjE3NjU5NTc3ODUsImV4cCI6MTc2NjU2MjU4NX0.D_wymBiKEDO3R12IudT-FYNjSb6Y14tUl4zRI7VyuYc";

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/payment/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      const options = {
        key: "rzp_test_RsYl9zcNNV1nOh",
        amount: data.amount,
        currency: data.currency,
        name: "Brilson",
        description: "Order Payment",
        order_id: data.razorpayOrderId,

        handler: async (response) => {
          await fetch("http://localhost:3000/api/payment/verify", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            }),
          });

          alert("Payment Successful 🎉");
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#22d3ee" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Update cart in localStorage
  const updateLocal = (items) => {
    setCart(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const updateQty = (id, qty) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    updateLocal(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateLocal(updated);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 40 : 0;
  const tax = Math.floor(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#03060A] text-white px-6 md:px-20 py-20">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center">
        Your <span className="text-cyan-400">Shopping Cart</span>
      </h1>
      <p className="text-gray-400 text-center mt-2">
        Review the card you selected and proceed to checkout.
      </p>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        {/* LEFT SIDE — CART ITEMS */}
        <div className="lg:col-span-2 space-y-6 px-2 py-2 border-2 border-cyan-700/50 rounded-2xl lg:h-200 md:h-200 h-auto overflow-y-auto">
          {cart.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-300"
            >
              <p className="text-xl">Your cart is empty.</p>
              <Link
                to="/products"
                className="text-cyan-400 underline mt-2 inline-block"
              >
                Browse Products
              </Link>
            </motion.div>
          )}

          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl"
            >
              {/* Image Box */}
              <div className="w-28 h-28 rounded-xl bg-[#0e1722] border border-cyan-400/20 flex items-center justify-center">
                {/* AGAR IMAGE HO TAB ADD:
                <img src={item.image} className="w-16 h-16 object-contain" />
                */}
              </div>

              {/* Item Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.variant}</p>

                {/* Price & Quantity */}
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-cyan-300 font-bold text-lg">
                    ₹{item.price}
                  </span>

                  {/* Quantity Box */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQty(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white/10 rounded-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-500"
              >
                <FiTrash2 size={24} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl h-fit"
        >
          <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>

            <hr className="border-white/10 my-3" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-cyan-400">₹{total}</span>
            </div>
          </div>

          <button className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-xl mt-8 shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] duration-300 cursor-pointer">
            Proceed to Checkout
          </button>
          <button className="w-full bg-cyan-500" onClick={handlePayment}>
            Pay Now
          </button>

          <Link
            to="/products"
            className="block text-center text-gray-400 hover:text-white mt-4"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
