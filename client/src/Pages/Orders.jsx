import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiShoppingBag,
  FiPackage,
  FiDownload,
  FiChevronRight,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiBox,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMyOrders } from "../api/client-query";

/* ------------------------------------------------------------------ */
/*  Static token maps (kept static so Tailwind doesn't purge them)     */
/* ------------------------------------------------------------------ */
const PAYMENT_STATUS = {
  paid: { label: "Paid", classes: "bg-emerald-500/10 text-emerald-400" },
  pending: { label: "Payment pending", classes: "bg-amber-500/10 text-amber-400" },
  failed: { label: "Payment failed", classes: "bg-rose-500/10 text-rose-400" },
  cancelled: { label: "Cancelled", classes: "bg-zinc-700 text-zinc-300" },
};

// Order of fulfilment stages used to build the tracker
const FULFILMENT_STEPS = [
  { key: "processing", label: "Confirmed", icon: FiCheckCircle },
  { key: "shipped", label: "Shipped", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiBox },
];

const stepIndex = (orderStatus) => {
  if (orderStatus === "cancelled") return -1;
  const idx = FULFILMENT_STEPS.findIndex((s) => s.key === orderStatus);
  // "pending" sits before "processing"
  return idx === -1 ? 0 : idx + 1;
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */
const PaymentBadge = ({ status }) => {
  const cfg = PAYMENT_STATUS[status] || PAYMENT_STATUS.cancelled;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
};

const FulfilmentTracker = ({ orderStatus }) => {
  if (orderStatus === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-sm text-rose-400">
        <FiXCircle size={16} />
        Order cancelled
      </div>
    );
  }

  const current = stepIndex(orderStatus); // 0..3 (0 = placed only)

  return (
    <div className="flex items-center">
      {FULFILMENT_STEPS.map((step, i) => {
        const reached = current >= i + 1;
        const isLast = i === FULFILMENT_STEPS.length - 1;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                  reached
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-600"
                }`}
              >
                <Icon size={14} />
              </div>
              <span className={`text-[11px] ${reached ? "text-zinc-300" : "text-zinc-600"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-2 mb-4 h-px flex-1 ${
                  current >= i + 2 ? "bg-indigo-500" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrderItemRow = ({ item, onClick }) => {
  const lineTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl p-2 text-left transition-colors hover:bg-zinc-800/60 ${FOCUS} cursor-pointer`}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ">
        {item.productImage ? (
          <img
            src={item.productImage}
            alt={item.productTitle}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <FiPackage size={22} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">{item.productTitle}</p>
        {item.variantName && (
          <p className="mt-0.5 text-xs text-zinc-500">Variant: {item.variantName}</p>
        )}
        <p className="mt-0.5 text-xs text-zinc-500">Qty: {item.quantity}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-zinc-100">₹{lineTotal.toFixed(2)}</p>
      </div>

      <FiChevronRight className="shrink-0 text-zinc-600" size={16} />
    </button>
  );
};

const OrderSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
    <div className="mb-5 flex justify-between">
      <div className="h-4 w-40 rounded bg-zinc-800" />
      <div className="h-6 w-24 rounded-full bg-zinc-800" />
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded bg-zinc-800" />
          <div className="h-3 w-1/3 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  </div>
);


const Orders = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    window.history.replaceState(null, "", "/orders");
  }, []);

  const [downloadingId, setDownloadingId] = useState(null);
  const { data: orders, isLoading, isError } = useGetMyOrders();

  const downloadInvoice = async (orderId) => {
    try {
      setDownloadingId(orderId);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/invoice/download/${orderId}`,
        { withCredentials: true }
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

  const goToProduct = (item) => {
    if (!item.productId
._id) return;
    console.log(item)
    navigate(`/products/${item.productId
._id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 pb-16 pt-24 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <FiShoppingBag size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Your orders</h2>
            {/* <p className="text-sm text-zinc-500">Track, manage and download invoices</p> */}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-5">
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-12 text-center">
            <p className="text-sm text-zinc-400">
              Couldn't load your orders right now. Please try again in a moment.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && (!orders || orders.length === 0) && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
              <FiShoppingBag size={28} />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">No orders yet</h2>
            <p className="mt-1 max-w-sm text-sm text-zinc-400">
              Everything you order will show up here so you can track it and download invoices.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className={`mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 ${FOCUS}`}
            >
              Browse products
            </button>
          </div>
        )}

        {/* Order list */}
        {!isLoading && !isError && orders && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                      <p className="text-xs text-zinc-500">Order ID</p>
                      <p className="font-mono text-xs text-zinc-300">
                        {order.orderId || order._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Placed on</p>
                      <p className="text-xs text-zinc-300">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Total</p>
                      <p className="text-xs font-semibold text-zinc-100">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <PaymentBadge status={order.status} />
                </div>

                {/* Tracker */}
                {order.status === "paid" && (
                  <div className="border-b border-zinc-800 px-5 pb-1 pt-4">
                    <FulfilmentTracker orderStatus={order.orderStatus} />
                  </div>
                )}

                {/* Items */}
                <div className="divide-y divide-zinc-800/70 px-3 py-2">
                  {order.items?.map((item, idx) => (
                    <OrderItemRow
                      key={idx}
                      item={item}
                      onClick={() => goToProduct(item)}
                    />
                  ))}
                </div>

                {/* Footer actions */}
                {order.status === "paid" && order.invoice?.pdfUrl && (
                  <div className="flex justify-end border-t border-zinc-800 px-5 py-3">
                    <button
                      type="button"
                      onClick={() => downloadInvoice(order._id)}
                      disabled={downloadingId === order._id}
                      className={`inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-50 ${FOCUS} cursor-pointer`}
                    >
                      <FiDownload size={15} />
                      {downloadingId === order._id ? "Preparing…" : "Download invoice"}
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
