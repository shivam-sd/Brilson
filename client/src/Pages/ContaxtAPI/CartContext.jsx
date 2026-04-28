import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const token = localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);


  const fetchCart = async () => {
    try {
      setLoading(true);

      if (token) {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const items = res.data.cartItems || [];
        setCartItems(items);
        setCartCount(items.reduce((acc, i) => acc + i.quantity, 0));
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
        setCartCount(localCart.reduce((acc, i) => acc + i.quantity, 0));
      }
    } catch (err) {
      console.log("Cart fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  
  const addToCart = async (product) => {
    try {
      if (token) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const index = cart.findIndex((i) => i.productId === product._id);

        if (index >= 0) cart[index].quantity += 1;
        else {
          cart.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0],
            quantity: 1,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
      }

    
      fetchCart();

    } catch (err) {
      console.log("Add to cart error", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        setCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};