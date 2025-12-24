import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /*  FETCH LAST 7 DAYS ORDERS  */
  useEffect(() => {
    fetchLast7DaysOrders();
  }, []);

  const fetchLast7DaysOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/allorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      const allOrders = res.data?.orders || [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const last7DaysOrders = allOrders.filter((order) => {
        return new Date(order.createdAt) >= sevenDaysAgo;
      });

      setOrders(last7DaysOrders);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /*  LOADER  */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Last 7 Days Orders
      </h1>

      <div className="bg-[#151822] border border-white/10 rounded-xl overflow-hidden shadow-lg">

        {/*  DESKTOP TABLE  */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#1B1F2D] text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Products</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No orders in last 7 days
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    {/* FULL ORDER ID WITH SCROLL */}
                    <td className="p-4 max-w-[260px]">
                      <div className="overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-cyan-500">
                        {order._id}
                      </div>
                    </td>

                    <td className="p-4">
                      {order.address?.name || "Customer"}
                    </td>

                    <td className="p-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-sm text-gray-300">
                          • {item.productTitle} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="p-4 text-cyan-400 font-semibold">
                      ₹{order.totalAmount}
                    </td>

                    <td className="p-4 text-gray-400">
                      {order?.orderStatus}
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/*  MOBILE CARDS  */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-400">
              No orders in last 7 days
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1B1F2D] border border-white/5 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="overflow-x-auto whitespace-nowrap text-sm font-semibold">
                  {order._id}
                </div>

                <p className="text-gray-300 text-sm">
                  👤 {order.address?.name || "Customer"}
                </p>

                <div className="text-gray-300 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      • {item.productTitle} × {item.quantity}
                    </div>
                  ))}
                </div>

                <p className="text-cyan-400 font-semibold">
                  💰 ₹{order.totalAmount}
                </p>

                <p className="text-gray-400 text-xs">
                  📅 {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
