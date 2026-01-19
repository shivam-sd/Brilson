import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  MessageSquare,
  DollarSign,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { FaUserCog } from "react-icons/fa";
import { GiTransform } from "react-icons/gi";
import { LuPanelsRightBottom } from "react-icons/lu";

import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Hero Section",
    description: "Main heading, subheading & CTA",
    icon: Sparkles,
    route: "/admin/landing/hero",
    gradient: "from-purple-500/20 to-cyan-500/20"
  },
  {
    title: "Powerfull Features Section",
    description: "Feature cards & icons",
    icon: LayoutDashboard,
    route: "/admin/landing/features",
    gradient: "from-blue-500/20 to-emerald-500/20"
  },
  {
    title: "How to Use Section",
    description: "Numbers & achievements",
    icon: FaUserCog,
    route: "/admin/landing/stats",
    gradient: "from-green-500/20 to-teal-500/20"
  },
  {
    title: "Testimonials",
    description: "Customer reviews",
    icon: MessageSquare,
    route: "/admin/landing/testimonials",
    gradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    title: "Ready To Transform Your Network Section",
    description: "Plans & pricing details",
    icon: GiTransform,
    route: "/admin/landing/pricing",
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    title: "Footer",
    description: "Frequently asked questions",
    icon: LuPanelsRightBottom,
    route: "/admin/landing/faq",
    gradient: "from-rose-500/20 to-pink-500/20"
  }
];

const LandingPageContent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
              <Sparkles className="text-white" size={18} />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">
              Landing Page 
            </h2>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Customize every section of your landing page with our intuitive editor
          </p>
        </div>

        
          
          
         
        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <div
                key={index}
                className="group relative bg-gray-900/40 backdrop-blur-sm 
                           border border-gray-700/50 rounded-2xl p-6 
                           hover:border-cyan-500/50 transition-all duration-300
                           hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 
                              group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.gradient.replace('/20', '/20')}`}>
                      <Icon size={24} className="text-white" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-100 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <span className="text-xs text-gray-500 font-medium px-3 py-1 
                                   rounded-full bg-gray-800/50">
                      Section {index + 1}
                    </span>
                    
                    <button
                      onClick={() => navigate(section.route)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
                               bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                               hover:from-cyan-600 hover:to-blue-700 
                               transition-all duration-300 hover:gap-3
                               shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
                    >
                      Edit
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            All changes are saved automatically. Preview your landing page in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;