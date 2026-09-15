import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiGift, FiArrowRight, FiSkipForward, FiAlertCircle, FiTag } from 'react-icons/fi';

const GoogleReferralInput = ({ userId, onSkip, onSuccess }) => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!referralCode || referralCode.trim() === '') {
      setError('Please enter a referral code or click Skip');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google/complete-referral`,
        {
          userId: userId,
          referralCode: referralCode
        }
      );

      console.log("Referral response:", response.data);

      if (response.data.success && response.data.status === "SUCCESS") {
        
        dispatch(setCredentials({ 
          token: response.data.data.token, 
          user: response.data.data.user 
        }));
        
        toast.success(response.data.message || "Login successful!");
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error("Referral submission error:", error);
      setError(error.response?.data?.message || "Invalid referral code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Skip 
  const handleSkip = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google/complete-referral`,
        {
          userId: userId,
          referralCode: null
        }
      );

      console.log("Skip referral response:", response.data);

      if (response.data.success && response.data.status === "SUCCESS") {
        //  Save to Redux
        dispatch(setCredentials({ 
          token: response.data.data.token, 
          user: response.data.data.user 
        }));
        
        // toast.success("Login successful!");
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error("Skip referral error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-5 bg-gray-900/50 rounded-xl border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <FiGift className="text-cyan-400" size={20} />
        <h3 className="text-white font-medium">Got a Referral Code?</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Enter it below to unlock rewards. Don't have one? No problem — just tap{' '}
        <span className="text-cyan-400 font-medium">Skip for now</span> to continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={referralCode}
            onChange={(e) => {
              setReferralCode(e.target.value);
              setError('');
            }}
            placeholder="Enter referral code (e.g., BRILSON123)"
            className="w-full bg-[#1a1f27] rounded-xl pl-11 pr-4 py-3.5 border border-white/10 focus:outline-none focus:border-cyan-500 text-gray-200 placeholder-gray-500"
            disabled={loading}
            autoFocus
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm flex items-center gap-1.5">
            <FiAlertCircle size={14} />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : (
            <>
              Apply Code <FiArrowRight size={18} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={loading}
          className="w-full py-3.5 bg-transparent border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-cyan-500 hover:text-cyan-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiSkipForward size={18} />
          Skip for now
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-3">
        You can add a referral code later too
      </p>
    </div>
  );
};

export default GoogleReferralInput;