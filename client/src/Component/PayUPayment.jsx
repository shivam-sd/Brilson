import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PayUPayment = ({ createdOrder, total }) => {

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handlePayUPayment = async () => {

    try {

      if (!createdOrder) {
        toast.error("Create order first");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/payu/create`,
        {
          orderId: createdOrder._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { paymentUrl, data } = res.data;

      // CREATE FORM
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.keys(data).forEach((key) => {

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];

        form.appendChild(input);

      });

      document.body.appendChild(form);

      form.submit();

    } catch (err) {

      console.error("PayU error", err);
      toast.error("PayU payment failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="w-full">

      <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-sm text-gray-400">Paying with</p>
            <p className="text-white font-semibold">PayU Gateway</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Amount</p>
            <p className="text-white font-bold text-xl">₹{total}</p>
          </div>

        </div>

      </div>

      <button
        onClick={handlePayUPayment}
        disabled={loading}
        className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white shadow-lg transition-all"
      >
        {loading ? "Processing..." : `Pay ₹${total}`}
      </button>

    </div>

  );
};

export default PayUPayment;