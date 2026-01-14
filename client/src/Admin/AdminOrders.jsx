import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiCalendar } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);


  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
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
      console.log(res)

      const allOrders = res.data?.orders || [];

      // last 7 days filter
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const last7DaysOrders = allOrders.filter(
        (order) => new Date(order.createdAt) >= sevenDaysAgo
      );

      setOrders(last7DaysOrders);
      setFilteredOrders(last7DaysOrders);
    } catch (err) {
      console.error(err);
      toast.error("Orders fetch failed");
    } finally {
      setLoading(false);
    }
  };

  //  SEARCH LOGIC
  useEffect(() => {
    let data = Array.isArray(orders) ? [...orders] : [];

    // customer name filter
    if (searchName.trim()) {
      data = data.filter((order) =>
        order.address?.name
          ?.toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    // date filter
    if (searchDate) {
      data = data.filter((order) => {
        const orderDate = new Date(order.createdAt)
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD
        return orderDate === searchDate;
      });
    }

    setFilteredOrders(data);
  }, [searchName, searchDate, orders]);

  const handleInvoice = (url) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = `INV-${Date.now()}`;
      link.target = "_blank";
      link.click();
    } catch (err) {
      toast.error("Invoice download failed");
    }
  };



  // function to change the order status 
  const handleOrderStatu = async (orderId, orderStatus) => {
      console.log(orderStatus);
    try{
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/orders/update/orderStatus`, {
        orderId,
        orderStatus:orderStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      // console.log(res)
      window.location.reload();
      toast.success(res.data.message || "Order Status Changed");

      setOrders((prev) => {
        prev.map((order) => {
          order._id == orderId ? { ...order, orderStatus} : order
        })
      })

    }catch(err){
      console.log("Order Status Error", err);
      toast.error(err.response.data.error || "Order Status Change Error");
    }
  }



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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-cyan-400">
          Last 7 Days Orders
        </h2>

        {/* SEARCH CONTROLS */}
        <div className="flex gap-3 flex-wrap">
          {/* NAME SEARCH */}
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            />
          </div>

          {/* DATE SEARCH */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{order._id}</td>
                  <td className="p-4">{order.address?.name}</td>
                  <td className="p-4 text-cyan-400 font-bold">
                    ₹{order.totalAmount}
                  </td>
                  <td className="p-4">
                    <select id="order-status" value={order.orderStatus} onChange={(e) => {handleOrderStatu(order._id, e.target.value)}} className="bg-black/60 text-white font-extralight p-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 duration-300">
                      <option value="processing" className="cursor-pointer hover:scale-105 active:scale-95 duration-300">processing</option>
                      <option value="shipped" className="cursor-pointer hover:scale-105 active:scale-95 duration-300">shipped</option>
                      <option value="delivered" className="cursor-pointer hover:scale-105 active:scale-95 duration-300">delivered</option>
                    </select>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleInvoice(order.invoice?.pdfUrl)
                      }
                      className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded hover:scale-105"
                    >
                      Invoice <FaDownload />
                    </button>
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
