import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiUser,
  FiMail,
} from "react-icons/fi";

const AdminInvoices = () => {
  const token = localStorage.getItem("adminToken");

  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const fetchInvoices = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/admin/invoices/all?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setInvoices(res.data.invoices);
    setTotalPages(res.data.pagination.totalPages);
  };

  const downloadZip = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/admin/invoices/download-zip`;
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#05070a] via-[#070b14] to-[#05070a] text-white">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Invoices
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadZip}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg"
          >
            <FiDownload />
            Download All Invoices
          </motion.button>
        </div>

        {/* INVOICE LIST */}
        <div className="grid gap-8">
          {invoices.map((inv, idx) => (
            <motion.div
              key={idx}
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
                  <p className="flex items-center gap-2 font-semibold text-lg">
                    <FiUser className="text-cyan-400" />
                    {inv.userName}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-400">
                    <FiMail />
                    {inv.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-400">
                    <FiFileText />
                    Invoice #{inv.invoiceNumber}
                  </p>
                </div>

                <a
                  href={inv.pdfUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-cyan-400 font-semibold hover:underline"
                >
                  <FiDownload />
                  Download PDF
                </a>
              </div>

              {/* PRODUCTS */}
              <div className="mt-6 border-t border-white/10 pt-5 space-y-3 text-sm text-gray-300">
                {inv.products.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {p.name} <span className="text-gray-500">(x{p.qty})</span>
                    </span>
                    <span className="font-medium">₹{p.price}</span>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-6 flex justify-end">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Total: ₹{inv.totalAmount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-8 mt-14">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-40"
          >
            <FiChevronLeft />
          </button>

          <span className="text-gray-400">
            Page <strong className="text-white">{page}</strong> of{" "}
            {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-40"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;
