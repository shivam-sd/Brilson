import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setInvoices(res.data.invoices);
    setTotalPages(res.data.pagination.totalPages);
  };

  const downloadZip = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/admin/invoices/download-zip`;
  };

  return (
    <div className="p-10 bg-[#03060A] text-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="lg:text-4xl text-3xl font-bold">Invoices</h2>
        <button
          onClick={downloadZip}
          className="bg-cyan-500 lg:px-5 lg:py-2 lg:text-xl text-sm p-2 cursor-pointer active:scale-105 transform translate-0.5 duration-300 rounded-xl text-black font-semibold flex items-center gap-2"
        >
          <FiDownload />
          Download All (ZIP)
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {invoices.map((inv, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{inv.userName}</p>
                <p className="text-sm text-gray-400">{inv.email}</p>
                <p className="text-sm text-gray-400">
                  Invoice: {inv.invoiceNumber}
                </p>
              </div>

              <a
                href={inv.pdfUrl}
                target="_blank"
                className="text-cyan-400 flex items-center gap-2"
              >
                <FiDownload />
                Download
              </a>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-300">
              {inv.products.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>{p.name} (x{p.qty})</span>
                  <span>₹{p.price}</span>
                </div>
              ))}
            </div>

            <div className="text-right mt-3 font-semibold text-cyan-400">
              Total: ₹{inv.totalAmount}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-40"
        >
          <FiChevronLeft />
        </button>

        <span className="text-gray-300">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-40"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AdminInvoices;
