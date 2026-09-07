import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

export const useGetFooter = () => {
    return useQuery({
        queryKey: ["footer"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/admin/footer`);
            return data;
        },
    });
};