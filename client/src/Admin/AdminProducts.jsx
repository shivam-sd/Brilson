import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiTag, FiGrid } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`
        );

        setProducts(res.data?.allProducts || []);
      } catch (error) {
        console.error("Fetch products error:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FILTER ================= */
  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= PRICE FORMAT ================= */
  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  /* ================= DELETE ================= */
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/admin/delete/products/${id}`,
        { withCredentials: true }
      );

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 text-white">
      {/* HEADER WITH STATS */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Product Management
            </h2>
            <p className="text-gray-400 mt-2">
              Manage your product catalog efficiently
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link 
              to="/admin/add/category" 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all hover:scale-105 group"
            >
              <FiGrid className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Category</span>
            </Link>
            <Link 
              to="/admin/add/badges" 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all hover:scale-105 group"
            >
              <FiTag className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Badge</span>
            </Link>
            <Link 
              to="/admin/add/products" 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all hover:scale-105 group shadow-lg shadow-cyan-500/20"
            >
              <FiPlus className="group-hover:rotate-90 transition-transform" />
              <span>New Product</span>
            </Link>
          </div>
        </div>

        </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm pl-12 py-4 rounded-2xl border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors text-lg"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="text-gray-400 text-sm">
              {filteredProducts.length} products found
            </span>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-6 text-left text-gray-400 font-semibold">Product Details</th>
                <th className="p-6 text-left text-gray-400 font-semibold">Category</th>
                <th className="p-6 text-left text-gray-400 font-semibold">Price</th>
                <th className="p-6 text-left text-gray-400 font-semibold">Badge</th>
                <th className="p-6 text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {filteredProducts.map((product) => (
                <tr 
                  key={product._id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  {/* Product Details */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                  <FiPackage class="text-cyan-400" />
                                </div>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {product.title || "Untitled Product"}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-6">
                    <span className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-6">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-cyan-400">
                        {formatPrice(product.price)}
                      </div>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <div className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Badge */}
                  <td className="p-6">
                    {product.badge ? (
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full text-sm font-medium">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/edit/products/${product._id}`}
                        className="p-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 rounded-lg transition-all hover:scale-105 hover:shadow-cyan-500/20 hover:shadow-lg group/edit"
                        title="Edit Product"
                      >
                        <FiEdit2 className="text-cyan-400 group-hover/edit:rotate-12 transition-transform" size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingId === product._id}
                        className="p-2 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 rounded-lg transition-all hover:scale-105 hover:shadow-red-500/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/delete"
                        title="Delete Product"
                      >
                        {deletingId === product._id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiTrash2 className="text-red-400 group-hover/delete:scale-110 transition-transform" size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
                <FiSearch className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery 
                  ? `No products matching "${searchQuery}"`
                  : "Start by adding your first product"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE/TABLET VIEW ================= */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.map((product) => (
          <div 
            key={product._id} 
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                          <FiPackage class="text-cyan-400" />
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {product.title || "Untitled Product"}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-full text-xs">
                    {product.category || "Uncategorized"}
                  </span>
                  {product.badge && (
                    <span className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full text-xs">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-cyan-400">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {product.description ? 
                    `${product.description.substring(0, 60)}${product.description.length > 60 ? '...' : ''}` : 
                    "No description"
                  }
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/edit/products/${product._id}`}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 rounded-lg text-cyan-400 transition-all hover:scale-105"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={deletingId === product._id}
                    className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 rounded-lg text-red-400 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === product._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State for Mobile */}
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
              <FiSearch className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 text-sm px-4">
              {searchQuery 
                ? `No products matching "${searchQuery}"`
                : "Add your first product to get started"
              }
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="flex items-center gap-4">
            <span>🔄 Last updated: Just now</span>
            <span className="hidden md:inline">•</span>
            <span>📦 All data is synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;