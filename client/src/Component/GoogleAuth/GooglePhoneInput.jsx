import React, { useState } from 'react';
import axios from 'axios';

const GooglePhoneInput = ({ userData, onComplete, onBack }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google/complete-profile`,
        {
          userId: userData.userId,
          phone: phone
        }
      );

    //   console.log("Complete profile response:", response.data);

      if (response.data.success && response.data.status === "OTP_REQUIRED") {
        if (onComplete) {
          onComplete({
            userId: userData.userId,
            phone: phone
          });
        }
      }
    } catch (error) {
    //   console.error("Phone submission error:", error);
      setError(error.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
      <h3 className="text-white font-medium mb-2">Complete Your Profile</h3>
      <p className="text-gray-400 text-sm mb-3">
        Enter your phone number to verify your account
        {userData?.email && (
          <span className="block text-xs text-gray-500 mt-1">
            Connected with: {userData.email}
          </span>
        )}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1">
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              className="w-full bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-cyan-500 text-gray-200 placeholder-gray-500"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          We'll send an OTP to verify your number
        </p>
      </form>

      <button
        onClick={onBack}
        className="mt-3 text-sm text-gray-400 hover:text-white transition"
        disabled={loading}
      >
        ← Back
      </button>
    </div>
  );
};

export default GooglePhoneInput;