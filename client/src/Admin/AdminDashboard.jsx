import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  /*  FETCH DATA  */
  useEffect(() => {
    fetchOrders();
    fetchProductsCount();
  }, []);

  /*  FETCH ORDERS  */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/allorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = res.data.orders || [];

      setOrders(ordersData.slice(0, 6));

      setStats((prev) => ({
        ...prev,
        totalOrders: ordersData.length,
        totalCustomers: new Set(
          ordersData.map((o) => o.userId)
        ).size,
      }));
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  /*  FETCH PRODUCTS COUNT  */
  const fetchProductsCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log(res)
      const products = res.data.allProducts || [];

      setStats((prev) => ({
        ...prev,
        totalProducts: products.length,
      }));
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  };

  /*  UI  */
  return (
    <div className="min-h-screen flex bg-[#0D0F17] text-white">
      <main className="flex-1 p-6 md:p-10">

        {/* HEADER */}
        <h2 className="text-3xl font-bold mb-10">
          Admin <span className="text-cyan-400">Dashboard</span>
        </h2>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Orders", value: stats.totalOrders },
            { label: "Total Customers", value: stats.totalCustomers },
            { label: "Total Products", value: stats.totalProducts },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 p-6 rounded-2xl border border-white/10"
            >
              <p className="text-gray-300 text-sm">{card.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-cyan-400">
                {card.value}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* RECENT ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/10 p-6 rounded-2xl"
        >
          <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
            <FiShoppingBag /> Recent Orders
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Products</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/25">
                    <td className="py-3 text-gray-200">
                      #{order._id.slice(-6)}...
                    </td>

                    <td className="text-gray-300">
                      {order.address?.name || "Customer"}
                    </td>

                    <td className="text-gray-300 ">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 mb-5 py-2">
                          {/* IMAGE PLACEHOLDER */}
                          <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                            <FiPackage size={14} />
                          </div>
                          <span>{item.productTitle}</span>
                        </div>
                      ))}
                    </td>

                    <td className="text-cyan-400 font-semibold">
                      ₹{order.totalAmount}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
