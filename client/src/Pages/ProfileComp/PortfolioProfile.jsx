import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, ExternalLink, Eye, Github, Globe, 
  Filter, Calendar, Star, TrendingUp, Users,
  Code2, Smartphone, ShoppingCart, GraduationCap,
  Award, Zap, Clock, DollarSign
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PortfolioProfile = ({activationCode}) => {

const [portfolio, setPortfolio] = useState([]);
const [loading, setLoading] = useState(true);

const token = localStorage.getItem("token");

const id = activationCode;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-portfolio/all/get/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const portfolioData = res.data.data || [];
        setPortfolio(portfolioData);
      } catch (err) {
        console.error(err);
        // toast.error("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);


  return (
    <div className="mb-16" id="portfolio">
      {/* Portfolio Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {portfolio.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl hover:border-[#E1C48A]/30 transition-all duration-500 hover:translate-y-[-4px] cursor-pointer overflow-hidden"
          >
            {/* Project Image */}
            <div className="h-56 overflow-hidden relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Project Content */}
            <div className="p-6">
              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E1C48A] transition-colors duration-300">
                {project.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
                {project.description}
              </p>
              
              {/* Project Details */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-lg flex-1">
                  <Clock size={16} className="text-[#E1C48A]" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="text-sm font-medium text-white">{project.duration}</div>
                  </div>
                </div>
            
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      
    </div>
  );
};

export default PortfolioProfile;