import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Shield, 
  Clock, 
  Zap,
  Star
} from 'lucide-react';

const ProfileFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden rounded-t-3xl border-t border-gray-800/50 shadow-2xl">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Product by Brilson - Premium Badge */}
          <div className="relative group">
           
            <div className="relative flex items-center gap-3 px-6 py-3 rounded-2xl  shadow-xl">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Zap size={22} className="text-yellow-400 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-medium uppercase tracking-wider text-gray-300">
                  Product by
                </span>
              </div>
              <div className="h-6 w-px bg-gradient-to-b from-blue-500 to-purple-500"></div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  BRILSON
                </span>
              </div>
            </div>
          </div>

        

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart size={14} className="text-red-400 animate-pulse" />
            <span>© {currentYear} Brilson</span>
            <span className="text-gray-600 mx-1">•</span>
            <span className="text-xs text-gray-500">All rights reserved</span>
          </div>
        </div>
      </div>

      {/* Animated Gradient Line */}
      <div className="relative h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/30 to-transparent animate-slide"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-600/30 to-transparent animate-slide delay-300"></div>
      </div>
    </footer>
  );
};

export default ProfileFooter;