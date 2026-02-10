import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { Package, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

const GalleryEditProfile = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-gallery/all/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setGallery(res.data.data || []);
      } catch {
        toast.error("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  const handleDelete = async (galleryId) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/profile-gallery/delete/${galleryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setGallery((prev) => prev.filter((g) => g._id !== galleryId));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
          Gallery
        </h2>

        <Link
          to={`/profile/gallery/add/${id}`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Item
        </Link>
      </div>

      {/* GRID */}
      {gallery.length > 0 ? (
        <motion.div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {gallery.map((item, i) => (
            <div className="group relative rounded-xl overflow-hidden bg-gray-900 shadow-lg cursor-pointer">

  {/* IMAGE */}
  <img
    src={item.image}
    alt=""
    className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
  />

  {/* CATEGORY BADGE */}
  <span className="absolute top-2 left-2 text-xs bg-black/60 px-2 py-1 rounded text-white">
    {item.category}
  </span>

  {/* DELETE ICON */}
  <MdDelete
    onClick={() => handleDelete(item._id)}
    className="absolute top-2 right-2 text-red-500 cursor-pointer bg-black/60 p-1 rounded-full"
    size={28}
  />

  {/* INFO SECTION */}
  <div className="p-3">
    <h4 className="text-white font-semibold truncate">
      {item.title}
    </h4>

    <p className="text-xs text-gray-400 line-clamp-2">
      {item.description}
    </p>

    <p className="text-[11px] text-gray-500 mt-1">
      {new Date(item.date).toLocaleDateString()}
    </p>
  </div>

  {/* ACTION BAR */}
  <div className="flex">

    {/* UPDATE BUTTON */}
    <Link
      to={`/profile/gallery/update/${item._id}`}
      className="
        w-full text-center py-3 text-sm font-medium
        bg-gradient-to-r from-blue-600 to-indigo-600
        hover:from-blue-700 hover:to-indigo-700
        transition
      "
    >
      Update
    </Link>

  </div>

</div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-2xl flex items-center justify-center">
            <Package size={40} className="text-gray-500" />
          </div>

          <h3 className="text-xl text-gray-300">No Gallery Yet</h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first gallery item.
          </p>

          <Link
            to={`/profile/gallery/add/${id}`}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Add Gallery
          </Link>
        </div>
      )}
    </div>
  );
};

export default GalleryEditProfile;
