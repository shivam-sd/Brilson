import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Image as ImgIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePaymentDetails = () => {
  const { id } = useParams();
  const paymentId = id;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [Paymentid, setPaymentId] = useState(null);

  const [form, setForm] = useState({
    activationCode: "",
    upi: "",
    bankName: "",
    bankHolderName: "",
    accountNumber: "",
    ifscCode: "",
    image: null,
  });

  // FETCH EXISTING DATA
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/payment-details/get/${paymentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const data = res.data.data;
        setPaymentId(data._id)

        setForm({
          activationCode: data.activationCode,
          upi: data.upi || "",
          bankName: data.paymentDetails?.bankName || "",
          bankHolderName: data.paymentDetails?.bankHolderName || "",
          accountNumber: data.paymentDetails?.accountNumber || "",
          ifscCode: data.paymentDetails?.ifscCode || "",
          image: null,
        });

        setPreview(data.image);
      } catch (err) {
        toast.error("Failed to load payment details");
      } finally {
        setFetching(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("activationCode", form.activationCode);
      fd.append("upi", form.upi);

      fd.append(
        "paymentDetails",
        JSON.stringify({
          bankName: form.bankName,
          bankHolderName: form.bankHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
        })
      );

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile/payment-details/update/${Paymentid}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Payment details updated successfully");
      navigate(-1);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-950 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Update Payment Details
        </h2>

        {/* QR IMAGE */}
        <label className="flex flex-col items-center gap-3 cursor-pointer">
          {preview ? (
            <img
              src={preview}
              className="w-40 h-40 object-cover rounded-xl border border-gray-700 hover:opacity-80 transition"
            />
          ) : (
            <div className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl text-gray-400">
              <ImgIcon size={30} />
              Upload QR Image
            </div>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImage}
          />
        </label>

        <input
          name="upi"
          value={form.upi}
          onChange={handleChange}
          placeholder="UPI ID"
          className="input"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
            className="input"
          />

          <input
            name="bankHolderName"
            value={form.bankHolderName}
            onChange={handleChange}
            placeholder="Account Holder Name"
            className="input"
          />

          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="Account Number"
            className="input"
          />

          <input
            name="ifscCode"
            value={form.ifscCode}
            onChange={handleChange}
            placeholder="IFSC Code"
            className="input"
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex justify-center gap-2 hover:scale-105 transition cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Updating...
            </>
          ) : (
            "Update Payment Details"
          )}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: #111827;
          border: 1px solid #374151;
          color: white;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default UpdatePaymentDetails;
