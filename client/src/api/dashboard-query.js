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