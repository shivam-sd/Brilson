import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiCalendar,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";

const AdminOrders = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLast7DaysOrders();
  }, []);

  const fetchLast7DaysOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/allorders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allOrders = res.data?.orders || [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      setOrders(
        allOrders.filter(
          (order) => new Date(order.createdAt) >= sevenDaysAgo
        )
      );
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-14 h-14 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Last 7 Days Orders
      </h2>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-white/5 text-gray-300 text-sm uppercase">
              <tr>
                <th className="p-5">Order ID</th>
                <th className="p-5">Customer</th>
                <th className="p-5">Products</th>
                <th className="p-5">Total</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">
                    No orders in the last 7 days
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-5 max-w-[260px]">
                      <div className="overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-cyan-500">
                        {order._id}
                      </div>
                    </td>

                    <td className="p-5 flex items-center gap-2">
                      <FiUser className="text-cyan-400" />
                      {order.address?.name || "Customer"}
                    </td>

                    <td className="p-5">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-sm text-gray-300">
                          • {item.productTitle} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="p-5 font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      ₹{order.totalAmount}
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "Paid"}
                      </span>
                    </td>

                    <td className="p-5 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden p-4 flex flex-col gap-5">
          {orders.length === 0 ? (
            <p className="text-center text-gray-400">
              No orders in last 7 days
            </p>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg"
              >
                <div className="text-xs text-gray-400 overflow-x-auto whitespace-nowrap">
                  {order._id}
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm">
                  <FiUser className="text-cyan-400" />
                  {order.address?.name || "Customer"}
                </p>

                <div className="mt-3 text-sm text-gray-300">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      • {item.productTitle} × {item.quantity}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-cyan-400">
                    ₹{order.totalAmount}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus || "Paid"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                  <FiCalendar />
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrders;
