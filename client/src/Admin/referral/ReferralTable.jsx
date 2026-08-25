import React, { useState } from 'react';
import ReferralRow from './ReferralRow';
import { Users } from "lucide-react";

const ReferralTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (userId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Add null check
  if (!data || !data.referrals || data.referrals.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl shadow-black/20 overflow-hidden transition-all duration-300">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#1e2a3a] to-[#243447] border-b border-gray-700/50">
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Referrer
                </span>
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Completed
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                In Progress
              </th>
              <th className="px-6 py-5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.referrals.map((item, index) => (
              <ReferralRow
                key={item.user?._id || index}
                item={item}
                index={index}
                isExpanded={!!expandedRows[item.user?._id]}
                onToggle={() => toggleRow(item.user?._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-700/50">
        {data.referrals.map((item, index) => (
          <ReferralRow
            key={item.user?._id || index}
            item={item}
            index={index}
            isExpanded={!!expandedRows[item.user?._id]}
            onToggle={() => toggleRow(item.user?._id)}
            isMobile
          />
        ))}
      </div>
    </div>
  );
};

export default ReferralTable;