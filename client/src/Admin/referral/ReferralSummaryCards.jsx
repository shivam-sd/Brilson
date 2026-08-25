import React from 'react';
import { Users, TrendingUp, Award, Zap } from 'lucide-react';

const ReferralSummaryCards = ({ data }) => {
  // Add null checks
  if (!data || !data.referrals) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl shadow-black/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-700 rounded w-12 mt-2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { referrals } = data;

  const totalReferrers = data.totalUsersWhoReferred || 0;
  
  const totalReferrals = referrals.reduce(
    (total, item) => total + (item.totalReferrals || 0),
    0
  );

  const totalCompleted = referrals.reduce(
    (total, item) =>
      total +
      (item.referrals || []).filter(
        (referral) => referral.referralStatus === 'completed'
      ).length,
    0
  );

  const totalInProgress = referrals.reduce(
    (total, item) =>
      total +
      (item.referrals || []).filter(
        (referral) => referral.referralStatus === 'in_progress'
      ).length,
    0
  );

  const cards = [
    {
      title: 'Total Referrers',
      value: totalReferrers,
      icon: Users,
      gradient: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-900/30 to-blue-800/20',
      textColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      borderColor: 'border-blue-700/30',
    },
    {
      title: 'Total Referrals',
      value: totalReferrals,
      icon: TrendingUp,
      gradient: 'from-purple-600 to-purple-700',
      bgGradient: 'from-purple-900/30 to-purple-800/20',
      textColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      borderColor: 'border-purple-700/30',
    },
    {
      title: 'Completed Referrals',
      value: totalCompleted,
      icon: Award,
      gradient: 'from-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-900/30 to-emerald-800/20',
      textColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      borderColor: 'border-emerald-700/30',
    },
    {
      title: 'In Progress',
      value: totalInProgress,
      icon: Zap,
      gradient: 'from-amber-600 to-amber-700',
      bgGradient: 'from-amber-900/30 to-amber-800/20',
      textColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      borderColor: 'border-amber-700/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-2xl border ${card.borderColor} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 group bg-[#1a2332]/80`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg} backdrop-blur-sm border border-white/10`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
              
              <div className="mt-4 h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min((card.value / (totalReferrals || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReferralSummaryCards;