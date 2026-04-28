import { useContext } from "react";
import { CartContext } from "../ContaxtAPI/CartContext";

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;