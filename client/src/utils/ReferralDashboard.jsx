import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, UserPlus, Calendar, 
  ChevronDown, ChevronUp, Award, Clock, CheckCircle,
  XCircle, Gift, TrendingUp, Sparkles
} from 'lucide-react';

const ReferralDashboard = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('all');
  const [dateFilter, setDateFilter] = useState('');



//   const isMobile = window.innerWidth < 768;

//   if(isMobile){
//     <>
//     <motion.div 
//      className="motion-fix"
//   initial={isMobile ? false : { opacity: 0 }}
//   animate={isMobile ? false : { opacity: 1 }}
// ></motion.div>
//     </>
//   }



  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/user/referral`,{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Referral Data:", response);
      setReferralData(response.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group referrals by date
  const groupByDate = (referrals) => {
    const groups = {};
    referrals?.forEach(ref => {
      const date = new Date(ref.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(ref);
    });
    return groups;
  };

  // Get unique dates for filter
  const getUniqueDates = () => {
    if (!referralData?.referrals) return [];
    const dates = [...new Set(referralData.referrals.map(ref => 
      new Date(ref.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      })
    ))];
    return ['all', ...dates];
  };

  // Filter referrals by selected date
  const getFilteredReferrals = () => {
    if (!referralData?.referrals) return [];
    if (selectedDate === 'all') return referralData.referrals;
    
    return referralData.referrals.filter(ref => {
      const refDate = new Date(ref.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      });
      return refDate === selectedDate;
    });
  };

  const filteredReferrals = getFilteredReferrals();
  const dateGroups = groupByDate(filteredReferrals);
  const uniqueDates = getUniqueDates();

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const styles = {
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      expired: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    };

    const icons = {
      completed: <CheckCircle size={12} className="text-emerald-400" />,
      pending: <Clock size={12} className="text-amber-400" />,
      expired: <XCircle size={12} className="text-rose-400" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {icons[status] || icons.pending}
        {status || 'pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-10/12'>

    <motion.div 
    className="motion-fix"
      initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
      className="mt-14 bg-[#0f172a] rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
      {/* Header with glow effect */}
      <div className="relative px-5 py-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Gift size={18} className="text-white" />
            </div>
            <div className=''>
              <h3 className="text-center text-white font-semibold flex items-center gap-2">
                Referral Dashboard
                <Sparkles size={14} className="text-indigo-400" />
              </h3>
              <p className="text-xs text-gray-400">Track your referrals & rewards</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Stats Cards - Compact & Cute */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          <motion.div 
          className="motion-fix"
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-3 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-1">
              <Users size={16} className="text-indigo-400" />
              <span className="text-[10px] text-gray-500">total</span>
            </div>
            <p className="text-xl font-bold text-white">{referralData?.totalReferrals || 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">referrals</p>
          </motion.div>

          <motion.div 
          className="motion-fix"
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-3 border border-gray-700/50"
            >
            <div className="flex items-center justify-between mb-1">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-[10px] text-gray-500">done</span>
            </div>
            <p className="text-xl font-bold text-white">{referralData?.completed || 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">completed</p>
          </motion.div>

          <motion.div 
          className="motion-fix"
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-3 border border-gray-700/50"
            >
            <div className="flex items-center justify-between mb-1">
              <TrendingUp size={16} className="text-amber-400" />
              <span className="text-[10px] text-gray-500">left</span>
            </div>
            <p className="text-xl font-bold text-white">{referralData?.inProgress || 0}</p>
            <p className="text-[10px] text-gray-500 mt-1">in progress</p>
          </motion.div>
        </div>

        
        {/* Referrals List */}
        <AnimatePresence>
          {expanded && (
            <motion.div
className="motion-fix"
           initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-3 max-h-[300px] overflow-y-scroll pr-1 custom-scrollbar"
            >
              {Object.entries(dateGroups).length > 0 ? (
                  Object.entries(dateGroups).map(([date, refs]) => (
                      <div
                      key={date}
                      className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden"
                  >
                    <div className="px-3 py-2 bg-gray-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-indigo-400" />
                        <span className="text-xs font-medium text-gray-300">{date}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">
                        {refs.length} {refs.length === 1 ? 'referral' : 'referrals'}
                      </span>
                    </div>
                    
                    <div className="divide-y divide-gray-700/30">
                      {refs.map((ref, idx) => (
                          <div
                          key={idx}
                          transition={{ delay: idx * 0.05 }}
                          className="px-3 py-2 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                          >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                              <UserPlus size={12} className="text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-white truncate max-w-[100px]">
                              {ref.name || 'User'}
                            </span>
                          </div>
                          <StatusBadge status={ref.referralStatus} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 px-4 bg-gray-800/20 rounded-xl border border-gray-700/30">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <Users size={20} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400">No referrals yet</p>
                  <p className="text-xs text-gray-500 mt-1">Share your referral code to earn rewards</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Hint */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[10px] text-gray-500 hover:text-indigo-400 transition-colors"
          >
          {expanded ? '▲ Show less' : '▼ Show details'}
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #1f2937;
                border-radius: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6366f1;
        }
        `}</style>
    </motion.div>
        </div>
  );
};

export default ReferralDashboard;