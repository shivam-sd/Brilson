import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import {
  FiTruck,
  FiShoppingBag,
  FiLoader,
  FiCheckCircle,
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

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email:"",
    city: "",
    state: "",
    pincode: "",
  });

  /*  LOAD CART  */
  useEffect(() => {
    if (!token) return navigate("/login");

    if (location.state?.checkoutData?.items) {
      setOrderItems(location.state.checkoutData.items);
    } else {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = res.data.cartItems || [];

      const mapped = items.map((item) => ({
        productId: item.productId._id,
        variantId: item.variantId || null,
        productTitle: item.productId.title,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      setOrderItems(mapped);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  /*  AMOUNT CALC  */
  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [orderItems]);

  const tax = Number((subtotal * 0.05).toFixed(2));
  const payableAmount = subtotal + tax;

  /*  VALIDATION  */
  const isAddressValid =
    address.name &&
    /^\d{10}$/.test(address.phone) &&
    address.city &&
    address.state &&
    /^\d{6}$/.test(address.pincode);

  /*  CREATE ORDER  */
  const handleCreateOrder = async () => {
    if (!isAddressValid) {
      toast.error("Please enter valid address");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/create`,
        {
          items: orderItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
          address,
          totalAmount:payableAmount, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCreatedOrder(res.data.order);
      toast.success("Order created successfully");
    } catch (err) {
      toast.error(err.response.data.error);
        console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /*  PAYMENT  */
  const handlePayment = async () => {
    if (!createdOrder) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/create`,
        {
          orderId: createdOrder._id,
          amount: Math.round(payableAmount * 100), 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("res", res)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.amount,
        currency: "INR",
        order_id: res.data.id,
        name: "Brilson",
        image:"./Brilson.png",
        description: "Order Payment",
        handler: async (response) => {
  try {
    console.log("response", response);
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
      toast.success("Payment successful 🎉");
      navigate("/orders");
    } else {
      toast.error("Payment verification failed");
    }

  } catch (err) {
    console.error(err);
    toast.error("Payment verification error");
  }
},
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: { color: "#22d3ee" },
      };

      new Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  /*  UI  */
  return (
    <div className="min-h-screen bg-[#03060A] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 mt-20">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiTruck className="text-cyan-400" /> Shipping Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.keys(address).map((key) => (
                <input
                  key={key}
                  value={address[key]}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                  placeholder={key.toUpperCase()}
                  className="w-full px-4 py-3 bg-[#0B1220] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={loading || !isAddressValid || createdOrder}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Creating Order...
              </>
            ) : createdOrder ? (
              <>
                <FiCheckCircle /> Order Created
              </>
            ) : (
              "Create Order"
            )}
          </button>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h2 className="font-bold mb-4 flex gap-2 items-center">
              <FiShoppingBag /> Order Summary
            </h2>

            {orderItems.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-2">
                <span>{i.productTitle} × {i.quantity}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}

            <hr className="my-4 border-white/10" />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total Payable</span>
              <span>₹{payableAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!createdOrder}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded-xl font-bold disabled:opacity-40"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
