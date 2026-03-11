import React, { useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CashfreePayment = ({ createdOrder, total }) => {

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  console.log(createdOrder);

  const navigate = useNavigate();

  const handleCashfreePayment = async () => {

    try {

      if (!createdOrder) {
        toast.error("Create order first");
        return;
      }

      setLoading(true);

      // STEP 1: CREATE PAYMENT SESSION WITH RETURN URL
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/cashfree/create`,
        {
          orderId: createdOrder._id,
          returnUrl: `${window.location.origin}/orders`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { paymentSessionId } = res.data;

      // STEP 2: LOAD CASFREE SDK
      const cashfree = await load({
        mode: "sandbox" // Change to "production" in live
      });

      // STEP 3: INITIATE CHECKOUT
      await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "" 
      });

      if(res.data.success){
        toast.success("Payment successful!");
        navigate(`/orders`, {replace:true});
      }

    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.response?.data?.message || "Cashfree payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Business Name Display */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Paying to</p>
              <p className="text-white font-semibold">Brilosn </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Amount</p>
            <p className="text-white font-bold text-xl">₹{total}</p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handleCashfreePayment}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Pay ₹{total}
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <span>Secure payment by Cashfree</span>
      </div>
    </div>
  );
};

export default CashfreePayment;