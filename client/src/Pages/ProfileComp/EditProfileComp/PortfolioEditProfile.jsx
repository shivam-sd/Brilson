import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Clock,
  User,
  Hash,
  Calendar,
  Image as ImageIcon,
  Package,
  Tag,
  Shield,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProductsEditPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch products
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
        toast.error("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);


  const handleDelete = async (portfolioId) => {
    if (!window.confirm("Are you sure you want to delete this portfolio item?")) return;
    try{
        await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/api/profile-portfolio/delete/${portfolioId}`,
            {withCredentials:true, headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Portfolio item deleted");
        setPortfolio(portfolio.filter(p => p._id !== portfolioId));
    }catch(err){
        console.error(err);
        toast.error("Failed to delete portfolio item");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Portfolio
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            to={`${"/profile/portfolio/add/"}${id}`}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 flex items-center gap-2"
          >
            <Package size={20} />
            Add New Portfolio Item
          </Link>
        </div>
      </div>

      {/* Portfolio Grid */}
      {portfolio.length > 0 ? (
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
                  <div className="w-full">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="text-sm font-medium text-white">{project.duration}
                    </div>
                  </div>
                    <button className="ml-2 text-xs text-red-500 hover:text-red-400 transition-colors cursor-pointer" onClick={() => {handleDelete(project._id)}}><MdDelete size={28} /></button>
                </div>
            
              </div>
              <Link to={`/profile/portfolio/update/${project._id}`} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/30 flex items-center gap-2 w-full justify-center">
                Update Portfolio
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
  ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
            <Package size={40} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Portfolio Items Found
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            You haven't added any portfolio items yet. Start by adding your first
            portfolio item.
          </p>
         
        </div>
      )}
    </div>
  );
};

export default ProductsEditPortfolio;
