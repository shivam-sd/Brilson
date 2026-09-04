import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../store/slices/authSlice";

const AdminCustomers = () => {
  const token = useSelector(selectToken);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchCustomersFromOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/allorders`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res)
        const orders = res.data.lastSevenDaysOrder || [];

        setCustomers(orders);
        setLoading(false);
      } catch (err) {
        console.error("Customer Fetch Error:", err);
        setLoading(false);
      }
    };

    console.log(customers)
    fetchCustomersFromOrders();
  }, []);


  /*  UI  */
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="w-full mt-15 lg:mt-0 md:mt-0">
      <h4 className="text-xl font-bold mb-4 text-center md:text-left lg:text-left">
        Customers
      </h4>

      <div className="bg-[#151822] border border-white/10 rounded-xl overflow-hidden shadow-lg">

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#1B1F2D] text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 break-all">{c?.userId}</td>
                  <td className="p-4 font-medium">{c?.address?.name}</td>
                  <td className="p-4">{c?.address?.email}</td>
                  <td className="p-4">{c?.address?.phone}</td>
                  <td className="p-4 text-cyan-400 font-semibold">
                    {c.totalAmount}
                  </td>
                  <td className="p-4 text-gray-400">{new Date(c?.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {customers.map((c, i) => (
            <div
              key={i}
              className="bg-[#1B1F2D] border border-white/5 rounded-xl p-4 flex flex-col gap-2"
            >
              <h2 className="font-semibold text-lg">{c?.address?.name}</h2>

              <p className="text-gray-400 text-xs break-all">
                ID: {c?.userId}
              </p>

              <p className="text-gray-300 text-sm">📧 {c?.address?.email}</p>
              <p className="text-gray-300 text-sm">📞 {c?.address?.phone}</p>

              <p className="text-cyan-400 text-sm font-semibold">
                ®️ Amount: {c?.totalAmount}
              </p>

              <p className="text-gray-400 text-xs">
                📅 Joined: {new Date(c?.c?.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminCustomers;
