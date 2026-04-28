import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/order/details/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        console.log(res);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="w-14 h-14 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Order not found
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 lg:mt-18 md:mt-18 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-400">
              Order Details
            </h2>
            <span className="px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
              {order.paymentStatus}
            </span>
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">
              Customer Details
            </h3>
            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
              <p><strong>Name:</strong> {order.address.name}</p>
              <p><strong>Phone:</strong> {order.address.phone}</p>
              <p><strong>Email:</strong> {order.address.email}</p>
              <p>
                <strong>Address:</strong> {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">
              Order Items
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-gray-300">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id} className="border-t border-white/10">
                      <td className="p-3">{item.productTitle}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">₹{item.price}</td>
                      <td className="p-3 text-center">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
              <p className="text-gray-400">Amount</p>
              <p className="text-xl font-bold">₹{order.amount}</p>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
              <p className="text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-cyan-400">
                ₹{order.totalAmount}
              </p>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
              <p className="text-gray-400">Order Status</p>
              <p className="text-xl font-bold text-yellow-400">
                {order.orderStatus}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminOrderDetails;
