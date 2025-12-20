import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

const AdminCustomers = () => {
  const customers = [
    {
      _id: "CUS12345",
      name: "Rahul Verma",
      email: "rahulv@example.com",
      phone: "+91 9876543210",
      status: "Active",
      joined: "2024-12-22",
    },
    {
      _id: "CUS67890",
      name: "Priya Sharma",
      email: "priya.s@example.com",
      phone: "+91 9988776655",
      status: "Active",
      joined: "2025-01-05",
    },
    {
      _id: "CUS43210",
      name: "Amit Singh",
      email: "amit.singh@example.com",
      phone: "+91 9123456780",
      status: "Blocked",
      joined: "2025-01-08",
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Customers</h1>

      <div className="bg-[#151822] border border-white/10 rounded-xl overflow-hidden shadow-lg">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1B1F2D] text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4">{c._id}</td>

                  <td className="p-4 flex items-center gap-3">
                    {/* <div className="w-10 h-10 rounded-full bg-cyan-400"></div> */}
                    <span>{c.name}</span>
                  </td>

                  <td className="p-4">
                    <p>{c.email}</p>
                    <p className="text-gray-400 text-sm">{c.phone}</p>
                  </td>

                  <td className="p-4">{c.joined}</td>

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

        {/* MOBILE CARDS */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {customers.map((c, i) => (
            <div
              key={i}
              className="bg-[#1B1F2D] border border-white/5 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-400"></div>
                <div>
                  <h2 className="font-semibold">{c.name}</h2>
                  <p className="text-gray-400 text-xs">{c._id}</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm">📧 {c.email}</p>
              <p className="text-gray-300 text-sm">📞 {c.phone}</p>

              <span
                className={`
                  w-fit px-3 py-1 rounded-full text-xs mt-1
                  ${
                    c.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                `}
              >
                {c.status}
              </span>

              <p className="text-gray-400 text-xs">📅 Joined: {c.joined}</p>

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

export default AdminCustomers;
