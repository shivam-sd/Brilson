import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminProducts = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`
        );
        
        if (response.data?.allProducts) {
          setProducts(response.data.allProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get lowest price from variants
  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return "N/A";
    
    const prices = variants.map(v => parseFloat(v.price || 0));
    const minPrice = Math.min(...prices.filter(p => p > 0));
    
    return minPrice > 0 ? minPrice : "N/A";
  };

  // Get stock status 
  const getStockStatus = (product) => {
    // This is a placeholder 
    return {
      count: product.variants?.length || 0,
      status: product.variants?.length > 0 ? "Active" : "Out of Stock"
    };
  };



  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Add your delete API call here
        console.log("Deleting product:", productId);
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/admin/delete/products/${productId}`, {
          withCredentials:true
        });
        
        // Remove from local state
        setProducts(prev => prev.filter(p => p._id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };



  // Loading state
  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-400">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} total
          </p>
        </div>
<div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5">

        <Link
          to="/admin/add/category"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
          >
          <FiPlus size={20} />
          Add New Categories
        </Link>

        <Link
          to="/admin/add/badges"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
          >
          <FiPlus size={20} />
          Add New Badges
        </Link>

        <Link
          to="/admin/add/products"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
        >
          <FiPlus size={20} />
          Add New Product
        </Link>
          </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="relative">
          <FiSearch
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12141c] border border-white/10 pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Products Table (Desktop) */}
      <div className="hidden md:block bg-[#151822] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="py-4 px-6 text-left text-gray-300 font-medium">Product</th>
                <th className="py-4 px-6 text-left text-gray-300 font-medium">Category</th>
                <th className="py-4 px-6 text-left text-gray-300 font-medium">Price</th>
                <th className="py-4 px-6 text-left text-gray-300 font-medium">Variants</th>
                <th className="py-4 px-6 text-left text-gray-300 font-medium">Status</th>
                <th className="py-4 px-6 text-left text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockInfo = getStockStatus(product);
                  const lowestPrice = getLowestPrice(product.variants);
                  
                  return (
                    <tr
                      key={product._id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-white">{product.title}</div>
                          <div className="text-gray-400 text-sm mt-1">{product.description}</div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {lowestPrice === "N/A" ? (
                          <span className="text-gray-400">N/A</span>
                        ) : (
                          <div className="font-medium">₹{lowestPrice}</div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-gray-300">
                          {product.variants?.length || 0} variant{product.variants?.length !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            stockInfo.status === "Active"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {stockInfo.status}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/edit/products/${product._id}`}
                            className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 p-2 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 size={18} />
                          </Link>

                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-[#151822] rounded-xl">
            No products found
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stockInfo = getStockStatus(product);
            const lowestPrice = getLowestPrice(product.variants);
            
            return (
              <div
                key={product._id}
                className="bg-[#151822] border border-white/10 p-5 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {product.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="font-medium">
                      {lowestPrice === "N/A" ? "N/A" : `₹${lowestPrice}`}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Variants</p>
                    <p className="font-medium">
                      {product.variants?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      stockInfo.status === "Active"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {stockInfo.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <Link
                    to={`/admin/edit/products/${product._id}`}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiEdit2 /> Edit
                  </Link>

                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer "
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default AdminProducts;