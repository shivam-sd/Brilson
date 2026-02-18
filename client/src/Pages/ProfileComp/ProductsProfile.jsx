import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";


const ProductsProfile = ({activationCode}) => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

const [products, setProducts] = useState([]);

const id = activationCode;

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
        // toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);


  return (
    <div className="mb-16" id="products">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-[#E1C48A]/30 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer"
          >
            {/* Product Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Product Content */}
            <div className="p-5">  
              {/* Title and Price */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-white group-hover:text-[#E1C48A] transition-colors duration-300 line-clamp-1">
                  {product.title}
                </h3>
                <span className="text-xl font-bold text-[#E1C48A] ml-2 whitespace-nowrap">
                 <span className="text-lg font-fold">₹</span> {product.price}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">


              {/* Description */}
              <p className="text-gray-300 text-sm line-clamp-2">
                {product.description}
              </p>

    {
      product.link && (<>
      <Link to={product.link}><FaEye /></Link>
      </>)
    }

    </div>
            </div>
          </motion.div>
        ))}
      </div>

    

      
    </div>
  );
};

export default ProductsProfile;