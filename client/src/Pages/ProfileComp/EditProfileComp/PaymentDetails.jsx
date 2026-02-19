import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Edit, Plus, CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const PaymentDetails = () => {
  const { id } = useParams();
  const activationCode = id;
  const token = localStorage.getItem("token");

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH PAYMENT DETAILS
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/payment-details/get/${activationCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setPaymentData(res.data.data);
      } catch (err) {
        // If 404 means no payment added yet
        if (err?.response?.status !== 404) {
          toast.error("Failed to fetch payment details");
        }
        setPaymentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [activationCode]);

  const hasPayment = !!paymentData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6">

      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">

        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full"></div>

        <h2 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
          <CreditCard className="text-emerald-400" />
          Payment Details
        </h2>

        {!hasPayment ? (
          // NO PAYMENT STATE
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-gray-400 text-lg">
              No payment details added yet.
            </p>

            <Link
              to={`/profile/payment-details/add/${id}`}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition shadow-lg"
            >
              <Plus size={18} />
              Add Payment Details
            </Link>
          </div>
        ) : (
          // PAYMENT DETAILS SHOW
          <div className="space-y-8">

            {/* QR IMAGE */}
            {paymentData.image && (
              <div className="flex justify-center">
                <img
                  src={paymentData.image}
                  alt="QR"
                  className="w-48 h-48 object-cover rounded-2xl border border-white/20 shadow-xl hover:scale-105 transition duration-300"
                />
              </div>
            )}

            {/* UPI */}
            {paymentData.upi && (
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <p className="text-gray-400 text-sm mb-1">UPI ID</p>
                <p className="text-xl font-semibold text-emerald-400 break-all">
                  {paymentData.upi}
                </p>
              </div>
            )}

            {/* BANK DETAILS */}
            {paymentData.paymentDetails && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl grid md:grid-cols-2 gap-6">

                <div>
                  <p className="text-gray-400 text-sm">Bank Name</p>
                  <p className="text-white font-medium">
                    {paymentData.paymentDetails.bankName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Account Holder</p>
                  <p className="text-white font-medium">
                    {paymentData.paymentDetails.bankHolderName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Account Number</p>
                  <p className="text-white font-medium">
                    {paymentData.paymentDetails.accountNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">IFSC Code</p>
                  <p className="text-white font-medium">
                    {paymentData.paymentDetails.ifscCode || "-"}
                  </p>
                </div>
              </div>
            )}

            {/* UPDATE BUTTON */}
            <div className="flex justify-center pt-4">
              <Link
                to={`/profile/payment-details/update/${activationCode}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition shadow-lg"
              >
                <Edit size={18} />
                Update Details
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
