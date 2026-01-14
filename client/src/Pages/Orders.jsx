import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingBag, FiPackage, FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  /* AUTH CHECK + FETCH */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(res)

      const sorted = [...(res.data.orders || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
    } catch (err) {
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD INVOICE */
  const downloadInvoice = async (orderId) => {
    try {
      setDownloadingId(orderId);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/invoice/download/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const link = document.createElement("a");
      link.href = res.data.downloadUrl;
      link.target = "_blank";
      link.download = `invoice_${orderId}.pdf`;
      link.click();
    } catch {
      toast.error("Invoice download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  /* STATUS BADGE */
  const statusStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060A] text-white px-5 py-24">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-center mb-10">
          <h2 className="text-5xl font-bold flex items-center gap-3">
            <FiShoppingBag className="text-cyan-400" />
            My Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono text-sm">{order._id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                        order.status
                      )}`}
                    >
                      {order.status?.toUpperCase()}
                    </span>

                    <span className="text-xs text-gray-400">
                      {order.orderStatus}
                    </span>

                    <span className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-white/10 pb-4"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.productTitle}
                        </p>

                        {item.variantName && (
                          <p className="text-sm text-gray-400">
                            Variant: {item.variantName}
                          </p>
                        )}

                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold text-cyan-400">
                        ₹{(item.price || 0) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/10">
                  <span className="flex items-center gap-2 text-gray-400">
                    <FiPackage />
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-cyan-400">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* INVOICE */}
                {order.status === "paid" && order.invoice?.pdfUrl && (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => downloadInvoice(order._id)}
                      disabled={downloadingId === order._id}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition disabled:opacity-50"
                    >
                      <FiDownload />
                      {downloadingId === order._id
                        ? "Preparing..."
                        : "Download Invoice"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
