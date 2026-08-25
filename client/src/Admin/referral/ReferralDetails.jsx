import React from 'react';
import { Calendar, User, Phone, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ReferralDetails = ({ referrals, isMobile = false }) => {
  // Add null check
  if (!referrals || referrals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No referral details available
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate().toString().padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return 'Invalid date';
    }
  };

  const completedCount = referrals.filter(r => r.referralStatus === 'completed').length;
  const inProgressCount = referrals.filter(r => r.referralStatus === 'in_progress').length;

  if (isMobile) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl px-4 py-2 border border-blue-700/20">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="font-medium text-gray-300">Total: {referrals.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-emerald-900/30 rounded-xl px-4 py-2 border border-emerald-700/20">
            <span className="font-medium text-emerald-400">✓ {completedCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-amber-900/30 rounded-xl px-4 py-2 border border-amber-700/20">
            <span className="font-medium text-amber-400">⟳ {inProgressCount}</span>
          </div>
        </div>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div
              key={referral._id}
              className="bg-[#1a2332] rounded-xl border border-gray-700/50 p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-gray-200 font-bold text-xs">
                      {referral.name ? referral.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">{referral.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone className="w-3 h-3" />
                        {referral.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <StatusBadge status={referral.referralStatus} />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Calendar className="w-3 h-3" />
                {formatDate(referral.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl px-5 py-2.5 border border-blue-700/20">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">
            Total: <span className="font-bold text-gray-100">{referrals.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-900/30 rounded-2xl px-5 py-2.5 border border-emerald-700/20">
          <span className="text-sm text-emerald-400">
            Completed: <span className="font-bold">{completedCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-amber-900/30 rounded-2xl px-5 py-2.5 border border-amber-700/20">
          <span className="text-sm text-amber-400">
            In Progress: <span className="font-bold">{inProgressCount}</span>
          </span>
        </div>
      </div>

      <div className="bg-[#1a2332] rounded-xl border border-gray-700/50 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#1e2a3a] to-[#243447] border-b border-gray-700/50">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Referred User
                </span>
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  Phone
                </span>
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Date
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {referrals.map((referral, idx) => (
              <tr 
                key={referral._id} 
                className={`hover:bg-[#1e2a3a]/50 transition-all duration-200 ${
                  idx % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#1e2a3a]/30'
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-gray-200 font-bold text-xs">
                      {referral.name ? referral.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{referral.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{referral.phone}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={referral.referralStatus} />
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400">
                  {formatDate(referral.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralDetails;