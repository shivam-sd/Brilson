import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCustomers = () => {
  const token = localStorage.getItem("token");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomersFromOrders();
  }, []);

  const fetchCustomersFromOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/allorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orders = res.data.orders || [];

      /* ================= CREATE UNIQUE CUSTOMERS ================= */
      const customerMap = new Map();

      orders.forEach((order) => {
        const userId = order.userId || order.address?.email;

        if (!customerMap.has(userId)) {
          customerMap.set(userId, {
            id: userId,
            name: order.address?.name || "Unknown User",
            email: order.address?.email || "N/A",
            phone: order.address?.phone || "N/A",
            joined: new Date(order.createdAt).toLocaleDateString(),
            totalOrders: 1,
          });
        } else {
          customerMap.get(userId).totalOrders += 1;
        }
      });

      setCustomers([...customerMap.values()]);
      setLoading(false);
    } catch (err) {
      console.error("Customer Fetch Error:", err);
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Customers
      </h1>

      <div className="bg-[#151822] border border-white/10 rounded-xl overflow-hidden shadow-lg">

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#1B1F2D] text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 break-all">{c.id}</td>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4 text-cyan-400 font-semibold">
                    {c.totalOrders}
                  </td>
                  <td className="p-4 text-gray-400">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {customers.map((c, i) => (
            <div
              key={i}
              className="bg-[#1B1F2D] border border-white/5 rounded-xl p-4 flex flex-col gap-2"
            >
              <h2 className="font-semibold text-lg">{c.name}</h2>

              <p className="text-gray-400 text-xs break-all">
                ID: {c.id}
              </p>

              <p className="text-gray-300 text-sm">📧 {c.email}</p>
              <p className="text-gray-300 text-sm">📞 {c.phone}</p>

              <p className="text-cyan-400 text-sm font-semibold">
                🛒 Orders: {c.totalOrders}
              </p>

              <p className="text-gray-400 text-xs">
                📅 Joined: {c.joined}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminCustomers;
