import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

const AdminOrders = () => {
  const orders = [
    {
      _id: "ORD12345",
      customer: "Rahul Verma",
      total: "₹1,299",
      // status: "Pending",
      date: "2025-01-02",
    },
    {
      _id: "ORD67890",
      customer: "Priya Sharma",
      total: "₹2,499",
      // status: "Shipped",
      date: "2025-01-05",
    },
    {
      _id: "ORD43210",
      customer: "Amit Singh",
      total: "₹3,799",
      // status: "Delivered",
      date: "2025-01-07",
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Orders</h1>

      {/* Table Wrapper */}
      <div className="bg-[#151822] border border-white/10 rounded-xl overflow-hidden shadow-lg">

        {/*  for Large Screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1B1F2D] text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                {/* <th className="p-4">Status</th> */}
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4">{order._id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.total}</td>
                  {/* <td className="p-4">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${
                          order.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "Delivered"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }
                      `}
                    >
                      {order.status}
                    </span>
                  </td> */}
                  <td className="p-4">{order.date}</td>

                  <td className="p-4 flex items-center justify-center gap-4">
                    <button className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                      <FiEye size={20} />
                    </button>
                    <button className="text-red-400 hover:text-red-300 cursor-pointer">
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Only MOBILE CARDS View Is Visible in Only Mobile */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {orders.map((order, i) => (
            <div
              key={i}
              className="bg-[#1B1F2D] border border-white/5 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{order._id}</h2>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs
                    ${
                      order.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "Delivered"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                    }
                  `}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-gray-300 text-sm">👤 {order.customer}</p>
              <p className="text-gray-300 text-sm">💰 {order.total}</p>
              <p className="text-gray-400 text-xs">📅 {order.date}</p>

              <div className="flex justify-end gap-4 mt-2">
                <button className="text-cyan-400">
                  <FiEye size={18} />
                </button>
                <button className="text-red-400">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminOrders;
