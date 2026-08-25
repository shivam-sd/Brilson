import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import axios from 'axios';
import ReferralSummaryCards from './referral/ReferralSummaryCards';
import ReferralTable from './referral/ReferralTable';
import ReferralSkeleton from './referral/ReferralSkeleton';

const ReferralManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchReferrals = async () => {
    try {
 
      setError(null);

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/referrals`, {
        withCredentials:true
      });
      
      if (response.data.success) {
        setData(response.data);
      } else {
        setError('Unable to load referrals.');
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Unable to load referrals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);


  if (loading) {
    return <ReferralSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <div className="text-gray-500 text-sm mb-6">Please try again or contact support if the issue persists.</div>
        </div>
      </div>
    );
  }

  if (!data || !data.referrals || data.referrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-4">
            <span className="text-5xl">📋</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">No referrals found</div>
          <div className="text-gray-500 text-sm">There are no referrals to display at this time.</div>
     
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      
      {/* Summary Cards */}
      <ReferralSummaryCards data={data} />

      {/* Table */}
      <ReferralTable data={data} />
    </div>
  );
};

export default ReferralManagement;