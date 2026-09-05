import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

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
          referralCode: referralCode.trim().toUpperCase()
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
    <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
      <h3 className="text-white font-medium mb-2">🎁 Referral Code (Optional)</h3>
      <p className="text-gray-400 text-sm mb-3">
        Enter a referral code to get rewards!
        <span className="block text-xs text-gray-500 mt-1">
          You can skip this step if you don't have one.
        </span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => {
                setReferralCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Enter referral code (e.g., BRILSON123)"
              className="w-full bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-cyan-500 text-gray-200 placeholder-gray-500 uppercase"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Processing...' : 'Apply'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>

      <div className="flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={handleSkip}
          disabled={loading}
          className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
        >
          ⏭️ Skip for now
        </button>
        <span className="text-xs text-gray-500">
          You can add referral code later
        </span>
      </div>
    </div>
  );
};

export default GoogleReferralInput;