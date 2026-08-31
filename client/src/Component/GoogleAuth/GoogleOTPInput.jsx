import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const GoogleOTPInput = ({ userId, phone, onSuccess, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google/verify-otp`,
        { userId, otp }
      );

      console.log("Verify OTP response:", response.data);

      if (response.data.success && response.data.status === "SUCCESS") {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google/resend-otp`,
        { userId }
      );

      if (response.data.success) {
        setTimer(30);
        setCanResend(false);
        toast.success('OTP resent successfully');
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
      <h3 className="text-white font-medium mb-2">Verify Your Phone</h3>
      <p className="text-gray-400 text-sm mb-3">
        Enter OTP sent to <strong className="text-cyan-400">{phone}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-green-500 text-gray-200 placeholder-gray-500 text-center text-xl tracking-widest"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition"
            disabled={loading}
          >
            ← Back
          </button>
          
          {timer > 0 ? (
            <span className="text-sm text-gray-500">
              Resend in {timer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
              disabled={loading}
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GoogleOTPInput;