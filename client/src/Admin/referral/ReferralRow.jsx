import React from 'react';
import { ChevronDown, Phone, Users as UsersIcon, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import ReferralDetails from './ReferralDetails';

const ReferralRow = ({ item, isExpanded, onToggle, isMobile = false, index = 0 }) => {
  // Add null checks
  if (!item || !item.user || !item.referrals) {
    return null;
  }

  const completed = item.referrals.filter(
    (referral) => referral.referralStatus === 'completed'
  ).length;

  const inProgress = item.referrals.filter(
    (referral) => referral.referralStatus === 'in_progress'
  ).length;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Dark theme gradient colors for avatars
  const avatarColors = [
    'from-blue-600 to-blue-700',
    'from-purple-600 to-purple-700',
    'from-emerald-600 to-emerald-700',
    'from-amber-600 to-amber-700',
    'from-pink-600 to-pink-700',
    'from-indigo-600 to-indigo-700',
  ];

  const avatarGradient = avatarColors[index % avatarColors.length];

  if (isMobile) {
    return (
      <div className={`p-5 transition-all duration-300 ${
        isExpanded ? 'bg-gradient-to-b from-[#1a2332]/50 to-[#1e2a3a]' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-black/30`}>
              {getInitials(item.user.name)}
            </div>
            <div>
              <div className="font-semibold text-gray-200 text-lg">{item.user.name}</div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Phone className="w-3.5 h-3.5" />
                {item.user.phone}
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2.5 hover:bg-gray-700/30 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
                isExpanded ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-3 text-center border border-blue-700/20">
            <div className="text-xs text-gray-400 font-medium">Total</div>
            <div className="text-lg font-bold text-blue-400 mt-1">{item.totalReferrals || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-xl p-3 text-center border border-emerald-700/20">
            <div className="text-xs text-gray-400 font-medium">Completed</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{completed}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-3 text-center border border-amber-700/20">
            <div className="text-xs text-gray-400 font-medium">In Progress</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{inProgress}</div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 animate-slideDown">
            <ReferralDetails referrals={item.referrals} isMobile />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <tr 
        className={`transition-all duration-300 ${
          isExpanded 
            ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 shadow-inner' 
            : 'hover:bg-[#1e2a3a]/50'
        }`}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/30`}>
              {getInitials(item.user.name)}
            </div>
            <div>
              <div className="font-semibold text-gray-200">{item.user.name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Phone className="w-3 h-3" />
                {item.user.phone}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-400">{item.user.phone}</td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm font-semibold border border-blue-700/30">
            <UsersIcon className="w-3.5 h-3.5" />
            {item.totalReferrals || 0}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-sm font-semibold border border-emerald-700/30">
            <CheckCircle className="w-3.5 h-3.5" />
            {completed}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 text-sm font-semibold border border-amber-700/30">
            <Clock className="w-3.5 h-3.5" />
            {inProgress}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={onToggle}
            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isExpanded 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40' 
                : 'bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 hover:scale-105 border border-gray-600/30'
            }`}
          >
            {isExpanded ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Details
              </>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="6" className="px-6 py-4 bg-gradient-to-b from-transparent to-[#1a2332]/30">
            <div className="animate-slideDown">
              <ReferralDetails referrals={item.referrals} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ReferralRow;