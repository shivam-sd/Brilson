import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";



export const useActiveCategories = () => {
    return useQuery({
        queryKey: ["activeCategories"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                "/api/category/active"
            );

            return data?.categories || [];
        },
    });
};
export const useActiveBadges = () => {
    return useQuery({
        queryKey: ["badges"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                "/api/badges/active"
            );

            return data?.badges || [];
        },
    });
};
export const useAddCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name }) => {
            const { data } = await axiosInstance.post("/api/category", { name });

            return data;
        },

        onSuccess: (data, variables) => {
            toast.success(
                data?.message || `${variables.name} added successfully`
            );

            queryClient.invalidateQueries({
                queryKey: ["activeCategories"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to add category"
            );
        },
    });
};
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoryId) => {
            const { data } = await axiosInstance.delete(
                `/api/category/delete/${categoryId}`
            );

            return data;
        },

        onSuccess: (data) => {
            toast.success(
                data?.message || "Category deleted successfully"
            );

            queryClient.invalidateQueries({
                queryKey: ["activeCategories"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to delete category"
            );
        },
    });
};
export const useAddBadge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name }) => {
            const { data } = await axiosInstance.post("/api/badges", { name });

            return data;
        },

        onSuccess: (data, variables) => {
            toast.success(
                data?.message || `${variables.name} added successfully`
            );

            queryClient.invalidateQueries({
                queryKey: ["badges"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to add badge"
            );
        },
    });
};


export const useDeleteBadge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (badgeId) => {
            const { data } = await axiosInstance.delete(`/api/badges/delete/${badgeId}`);

            return data;
        },

        onSuccess: (data) => {
            toast.success(
                data?.message || "Badge deleted successfully"
            );

            queryClient.invalidateQueries({
                queryKey: ["badges"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to delete badge"
            );
        },
    });
};