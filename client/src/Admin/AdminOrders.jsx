
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiCalendar } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useGetAllOrders, useUpdateOrderStatus } from "../api/dashboard-query";


const AdminOrders = () => {
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllOrders();
  const {
    mutate: updateOrderStatus,
    isPending: isUpdatingStatus,
  } = useUpdateOrderStatus();

  const orders = data?.lastSevenDaysOrder || [];

  const filteredOrders = useMemo(() => {
    let filteredData = Array.isArray(orders)
      ? [...orders]
      : [];

    if (searchName.trim()) {
      filteredData = filteredData.filter((order) =>
        order.address?.name
          ?.toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    if (searchDate) {
      filteredData = filteredData.filter((order) => {
        const orderDate = new Date(order.createdAt)
          .toISOString()
          .split("T")[0];

        return orderDate === searchDate;
      });
    }

    return filteredData;
  }, [orders, searchName, searchDate]);

  React.useEffect(() => {
    if (isError) {
      console.error("Orders fetch failed", error);
      toast.error("Orders fetch failed");
    }
  }, [isError, error]);

  const handleInvoice = (url) => {
    try {
      if (!url) {
        toast.error("Invoice not available");
        return;
      }

      const link = document.createElement("a");

      link.href = url;
      link.download = `INV-${Date.now()}`;
      link.target = "_blank";

      link.click();
    } catch (err) {
      console.error("Invoice Error", err);
      toast.error("Invoice download failed");
    }
  };

  const handleOrderStatus = async (orderId, orderStatus) => {
    updateOrderStatus({orderId, orderStatus});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-14 h-14 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 mt-15 md:mt-0">
        <h4 className="text-xl font-bold text-cyan-400 text-center">
          Last 7 Days Orders
        </h4>

        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search customer"
              value={searchName}
              onChange={(e) =>
                setSearchName(e.target.value)
              }
              className="pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            />
          </div>

          <div className="relative">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />

            <input
              type="date"
              value={searchDate}
              onChange={(e) =>
                setSearchDate(e.target.value)
              }
              className="pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Order Status</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Invoice</th>
              <th className="p-4">View Order</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-8 text-center text-gray-400"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    {order._id}
                  </td>

                  <td className="p-4">
                    {order.address?.name}
                  </td>

                  <td className="p-4 text-cyan-400 font-bold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4">
                    <select
                      id="order-status"
                      value={order.orderStatus}
                      disabled={isUpdatingStatus}
                      onChange={(e) =>
                        handleOrderStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="bg-black/60 text-white font-extralight p-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 duration-300"
                    >
                      <option value="processing">
                        processing
                      </option>

                      <option value="shipped">
                        shipped
                      </option>

                      <option value="delivered">
                        delivered
                      </option>
                    </select>
                  </td>

                  <td
                    className={`p-4 text-center ${order?.status === "paid"
                      ? "text-green-500 font-bold tracking-widest"
                      : "text-red-300 font-bold tracking-wider"
                      }`}
                  >
                    {order?.status}
                  </td>

                  <td className="p-4 text-gray-400">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleInvoice(
                          order.invoice?.pdfUrl
                        )
                      }
                      className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Invoice <FaDownload />
                    </button>
                  </td>

                  <td className="p-4">
                    <Link
                      to={`/admin/orders/detils/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 min-w-[130px] h-10 px-4 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 font-Playfair font-semibold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-green-500/20"
                    >
                      <Eye
                        size={17}
                        strokeWidth={2}
                      />

                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminOrders;
