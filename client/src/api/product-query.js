import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/admin/all/products");
            return data;
        }
    }); F
};

export const useGetProductById = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/admin/find/products/${id}`);
            return data;
        },

        enabled: !!id,
    });
};