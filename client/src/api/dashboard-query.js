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

export const useUsers = (page = 1) => {
  return useQuery({
    queryKey: ["users", page],

    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/users/all-users?page=${page}`);

      return {
        users: data.Users || [],
        totalPages: data.totalPage || 1,
        totalUsers: data.totalUsers || (data.Users?.length || 0),
        currentPage: data.page || 1,
      };
    },
  });
};

export const useReferrals = () => {
  return useQuery({
    queryKey: ["referrals"],

    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/referrals");

      if (!data.success) {
        throw new Error("Unable to load referrals.");
      }

      return data;
    },

    onError: (error) => {
      console.error("Error fetching referrals:", error);
    },
  });
}