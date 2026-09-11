import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../store/slices/authSlice";
import { useGetInvoices } from "../api/dashboard-query";

const AdminInvoices = () => {
  const [page, setPage] = useState(1);

  const limit = 5;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetInvoices(page, limit)

  const invoices = data?.invoices || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const downloadZip = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/admin/invoices/download-zip`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070a] via-[#070b14] to-[#05070a] text-white">
        <p className="text-gray-400">Loading invoices...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070a] via-[#070b14] to-[#05070a] text-white">
        <p className="text-red-400">
          {error?.response?.data?.message ||
            error?.message ||
            "Unable to load invoices."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-2 bg-gradient-to-br from-[#05070a] via-[#070b14] to-[#05070a] text-white">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-5">
          <h4 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Invoices
          </h4>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadZip}
            className="flex items-center gap-3 px-6 py-2 rounded-xl font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg text-sm cursor-pointer"
          >
            <FiDownload />
            Download All Invoices
          </motion.button>
        </div>

        {/* INVOICE LIST */}
        <div className="grid gap-8">
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No invoices found.
            </div>
          ) : (
            invoices.map((inv, idx) => (
              <motion.div
                key={inv.invoiceNumber || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none" />

                {/* TOP */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 font-semibold text-base">
                      <FiUser className="text-cyan-400" />
                      {inv.userName}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-gray-400">
                      <FiMail />
                      {inv.email}
                    </p>

                    <p className="flex items-center gap-2 text-xs text-gray-400">
                      <FiFileText />
                      Invoice #{inv.invoiceNumber}
                    </p>
                  </div>

                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 font-semibold hover:underline"
                  >
                    <FiDownload />
                    Download PDF
                  </a>
                </div>

                {/* PRODUCTS */}
                <div className="mt-6 border-t border-white/10 pt-5 space-y-3 text-sm text-gray-300">
                  {inv.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {product.name}{" "}
                        <span className="text-gray-500">
                          (x{product.qty})
                        </span>
                      </span>

                      <span className="font-medium">
                        ₹{product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-6 flex justify-end">
                  <span className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Total: ₹{inv.totalAmount}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-14">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            <span className="text-gray-400">
              Page{" "}
              <strong className="text-white">
                {page}
              </strong>{" "}
              of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;