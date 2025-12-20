import React from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminDashboard = () => {

    const orders = [
                  {
                    id: "#A2131",
                    customer: "Rahul Verma",
                    card: "NFC Smart Card",
                    amount: "₹999",
                  },
                  {
                    id: "#A2145",
                    customer: "Aditi Singh",
                    card: "Premium PVC Card",
                    amount: "₹599",
                  },
                  {
                    id: "#A2157",
                    customer: "Vikram Rao",
                    card: "Metal Elite Card",
                    amount: "₹1999",
                  },
                ];

                const activeDashboard = [
            { label: "Total Products", value: "48" },
            { label: "Total Orders", value: "152" },
            { label: "Total Customers", value: "1,029" },
          ];

  return (
    <div className="min-h-screen flex bg-[#0D0F17] text-white">

      
      {/*  MAIN CONTENT  */}
      <main className="flex-1 p-6 md:p-10">

        {/* TOP */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Admin<span className="text-cyan-400"> Dashboard</span>
          </h2>
        </div>

        {/*  STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          { activeDashboard.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg lg:w-full md:w-full w-72"
            >
              <p className="text-gray-300 text-sm">{card.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-cyan-400">
                {card.value}
              </h3>
            </motion.div>
          ))}
        </div>

        {/*  RECENT ORDERS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-5">Recent Orders</h3>

          <div className="overflow-x-auto lg:w-full md:h-full w-60">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Card Type</th>
                  <th className="py-3">Amount</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 text-gray-200">{row.id}</td>
                    <td className="text-gray-300">{row.customer}</td>
                    <td className="text-gray-300">{row.card}</td>
                    <td className="text-cyan-400 font-semibold">
                      {row.amount}
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
