import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
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

const ProductsEditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-products/all/get/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const productsData = res.data.data || [];
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);


  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try{
        await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/api/profile-products/delete/${productId}`,
            {withCredentials:true, headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product deleted");
        setProducts(products.filter(p => p._id !== productId));
    }catch(err){
        console.error(err);
        toast.error("Failed to delete product");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
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
            Products
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            to={`${"/profile/products/add/"}${id}`}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 flex items-center gap-2"
          >
            <Package size={20} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:translate-y-[-4px] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-blue-900/10 cursor-pointer"
            >
              {/* Product Image */}
              <div className="h-48 overflow-hidden relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-600" />
                  </div>
                )}
              </div>

              {/* Product Content */}
              <div className="p-5">
                {/* Title and Duration */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1 flex-1">
                    {product.title}
                  </h3>
                  {product.duration && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-700/30 ml-2 whitespace-nowrap">
                      <Clock size={14} className="text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">
                        {product.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="flex items-center justify-between mb-5 mt-4">
                  <p className="text-gray-300 text-sm line-clamp-2 truncate">
                    {product.description}
                  </p>
                  {/* delete product */}
                  <button>
                    <MdDelete
                      size={20}
                      className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      onClick={() => handleDelete(product._id)}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <Link
                    to={`/profile/products/update/${product._id}`}
                    className="bg-blue-600 text-white font-bold p-2 px-6 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Update Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
            <Package size={40} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            You haven't added any products yet. Start by adding your first
            product.
          </p>
         
        </div>
      )}
    </div>
  );
};

export default ProductsEditProfile;
