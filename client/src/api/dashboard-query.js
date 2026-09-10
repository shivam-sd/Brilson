import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export const useGetAdminDashboardData = () => {
    return useQuery({
        queryKey: ["adminDashboard"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/admin/dashboard`);
            return data
        },
    });
};
export const useGetAdminDashboardDataChart = () => {
    return useQuery({
        queryKey: ["adminDashboardChart"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/admin/dashboard/chart`);
            return data
        },
    });
};
export const useGetAllOrders = () => {
    return useQuery({
        queryKey: ["allOrders"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/allorders`);
            return data
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, orderStatus }) => {
            const { data } = await axiosInstance.put("/api/orders/update/orderStatus", { orderId, orderStatus });
            return data;
        },

        onSuccess: (data) => {
            toast.success(
                data?.message || "Order Status Changed"
            );

            queryClient.invalidateQueries({
                queryKey: ["allOrders"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.error ||
                "Order Status Change Error"
            );
        },
    });
};

export const useGetOrderDetails = (orderId) => {
    return useQuery({
        queryKey: ["orderDetails", orderId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/order/details/${orderId}`);
            return data?.data;
        },

        enabled: !!orderId,
    });
};

export const useGetRecentCards = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["recentCards", page, limit],

        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/all/recent?page=${page}&limit=${limit}`);

            const responseData = data?.data || data;

            return {
                cards:
                    responseData?.cards ||
                    responseData?.allCards ||
                    [],

                totalCards:
                    responseData?.pagination?.totalCards ||
                    responseData?.totalCards ||
                    0,

                totalPages:
                    responseData?.pagination?.totalPages ||
                    responseData?.totalPages ||
                    1,

                currentPage:
                    responseData?.pagination?.page ||
                    responseData?.page ||
                    1,

                stats: {
                    total: responseData?.stats?.total || 0,
                    activated: responseData?.stats?.activated || 0,
                    inactive: responseData?.stats?.inactive || 0,
                },
            };
        },

        placeholderData: (previousData) => previousData,
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
            const { data } = await axiosInstance.post( "/api/category",{ name });

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
            const { data } = await axiosInstance.post("/api/badges",{ name });

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
            const { data } = await axiosInstance.delete(`/api/badges/delete/${badgeId}` );

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