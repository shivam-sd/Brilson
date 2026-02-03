import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ExternalLink } from "lucide-react";

const ProductsProfile = () => {
  // All products data inside component
  const products = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Complete online store solution with payment gateway integration",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      price: "$299",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Mobile App UI Kit",
      description: "Modern UI components for React Native applications",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      price: "$149",
      category: "Mobile Design"
    },
    {
      id: 3,
      title: "AI Chatbot Solution",
      description: "Custom AI chatbot for customer support automation",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      price: "$499",
      category: "AI Services"
    },
  ];

  return (
    <div className="mb-16" id="products">
      {/* Products Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-[#E1C48A]/30 transition-all duration-300 hover:translate-y-[-4px]"
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
                  {product.price}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    

      
    </div>
  );
};

export default ProductsProfile;