import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiPlus, 
  FiTrash2, 
  FiGrid,
  FiTag
} from "react-icons/fi";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/category/active`);
      setCategories(res.data.categories || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
     const res =  await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/category`,
        { name },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log(res)
      toast.success(`"${name}" added successfully`);
      setName("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/category/delete/${id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          'Content-Type': 'application/json'
        },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Category Management
                </span>
              </h1>
              <p className="text-gray-400">Manage your product categories</p>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 px-4 py-2 rounded-full">
              <FiGrid className="text-cyan-400" />
              <span className="font-medium">{categories.length}</span>
              <span className="text-gray-400">Categories</span>
            </div>
          </div>
        </div>

        {/* Add Category Card */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiPlus className="text-cyan-400" />
            Add New Category
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
            <button
              onClick={addCategory}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 min-w-[140px] cursor-pointer"
              disabled={!name.trim()}
            >
              <FiPlus />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiTag className="text-cyan-400" />
              All Categories ({categories.length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FiTag className="text-4xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
              <p className="text-gray-400">Start by adding your first category above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-400">
                        Created {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <FiTrash2 />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminCategories;