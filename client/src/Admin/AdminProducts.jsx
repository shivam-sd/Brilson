import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiTag, FiGrid, FiImage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`
            }
          }
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

  /* FILTER PRODUCTS */
  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* PAGINATION */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  /* PRICE FORMAT */
  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  /* DELETE PRODUCT */
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/admin/delete/products/${id}`,
        { 
          withCredentials: true,
          headers: {
            Authorization: `${localStorage.getItem("token")}`
          }
        }
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

  /* PAGINATION CONTROLS */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  /* LOADING STATE */
  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* HEADER SECTION */}
        <div className="mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Product Management
              </h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Manage and organize your product catalog efficiently
              </p>
            </div>

            {/* ACTION BUTTONS - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <Link 
                to="/admin/add/category" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-cyan-500/50 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <FiGrid className="text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-sm font-medium">Categories</span>
              </Link>
              
              <Link 
                to="/admin/add/badges" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-cyan-500/50 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <FiTag className="text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-sm font-medium">Badges</span>
              </Link>
              
              <Link 
                to="/admin/add/products" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 group"
              >
                <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
                <span className="text-sm font-medium">Add Product</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name, category, or badge..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-800/50 backdrop-blur-sm pl-12 pr-24 py-3.5 rounded-xl border border-gray-700 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* PRODUCTS GRID - Responsive Cards Layout */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-900 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    ) : product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Badge Overlay */}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discount?.enabled && product.discount?.value > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-lg shadow-lg">
                          {product.discount.type === 'percentage' 
                            ? `${product.discount.value}% OFF` 
                            : `₹${product.discount.value} OFF`}
                        </span>
                      </div>
                    )}
                    
                    {/* Multiple Images Indicator */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white">
                        <FiImage className="inline mr-1" size={12} />
                        {product.images.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-white text-base lg:text-lg mb-1 line-clamp-1">
                        {product.title || "Untitled Product"}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {product.description || "No description available"}
                      </p>
                    </div>
                    
                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300">
                        <FiTag size={12} />
                        {product.category || "Uncategorized"}
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-cyan-400">
                        {formatPrice(product.price)}
                      </div>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <div className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </div>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className="mb-4">
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-400">✓ In Stock ({product.stock})</span>
                      ) : (
                        <span className="text-xs text-red-400">✗ Out of Stock</span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/edit/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 transition-all duration-300 group/edit"
                      >
                        <FiEdit2 size={16} className="group-hover/edit:rotate-12 transition-transform" />
                        <span className="text-sm font-medium">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingId === product._id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === product._id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <FiTrash2 size={16} />
                            <span className="text-sm font-medium">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400 order-2 sm:order-1">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:bg-gray-800/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`w-9 h-9 rounded-lg transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                              : "bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-cyan-500/50 hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:bg-gray-800/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-16 lg:py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <FiSearch className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto px-4">
              {searchQuery 
                ? `No products matching "${searchQuery}"`
                : "Get started by adding your first product"
              }
            </p>
            {!searchQuery && (
              <Link
                to="/admin/add/products"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
              >
                <FiPlus size={18} />
                Add Your First Product
              </Link>
            )}
          </div>
        )}

        {/* BOTTOM INFO
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
            <div>
              📊 Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="flex items-center gap-4">
              <span>🔄 Real-time data</span>
              <span>•</span>
              <span>💾 Auto-synced</span>
              <span>•</span>
              <span>✨ {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminProducts;