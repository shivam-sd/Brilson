import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/admin/all/products");
            return data;
        }
    });
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


export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productId) => {
            const { data } = await axiosInstance.put(`/api/admin/delete/products/${productId}`);
            return data;
        },
        onSuccess: (data) => {
            toast.success(
                data?.message || "Product deleted successfully"
            );

            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.error ||
                "Product Deletion Error"
            );
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }) => {
            const { data } = await axiosInstance.put(
                `/api/admin/update/products/${id}`,
                formData
            );

            return data;
        },

        onSuccess: (data) => {
            toast.success(
                data?.message || "Product updated successfully"
            );
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Product Update Error"
            );
        },
    });
};