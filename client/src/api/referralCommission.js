import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";



export const useGetReferralCommissions = () => {
    return useQuery({
        queryKey: ["referralCommissions"],

        queryFn: async () => {
            const { data } = await axiosInstance.get(
                "/api/admin/referral-commissions"
            );

            return data;
        },
    });
};




export const useUpdateReferralCommission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ level, amount }) => {
            const { data } = await axiosInstance.put(
                `/api/admin/referral-commissions/${level}`,
                {
                    amount: Number(amount),
                }
            );

            return data;
        },

        onSuccess: (data) => {
            toast.success(
                data?.message ||
                    "Referral commission updated successfully"
            );

            queryClient.invalidateQueries({
                queryKey: ["referralCommissions"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Referral commission update failed"
            );
        },
    });
};