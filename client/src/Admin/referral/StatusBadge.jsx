// src/components/ui/StatusBadge.jsx
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {

    console.log(status)

  const statusMap = {
    completed: {
      label: 'Completed',
      gradient: 'from-emerald-400 to-emerald-500',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      textColor: 'text-emerald-700',
      icon: CheckCircle,
      borderColor: 'border-emerald-200/50',
    },
    in_progress: {
      label: 'In Progress',
      gradient: 'from-amber-400 to-amber-500',
      bgGradient: 'from-amber-50 to-amber-100/50',
      textColor: 'text-amber-700',
      icon: Clock,
      borderColor: 'border-amber-200/50',
    },
  };

  const { label, bgGradient, textColor, icon: Icon, borderColor } = statusMap[status] || {
    label: status || 'Unknown',
    bgGradient: 'from-gray-50 to-gray-100/50',
    textColor: 'text-gray-700',
    icon: null,
    borderColor: 'border-gray-200/50',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${bgGradient} border ${borderColor} shadow-sm`}>
      {Icon && <Icon className={`w-3.5 h-3.5 ${textColor}`} />}
      <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
    </span>
  );
};

export default StatusBadge;