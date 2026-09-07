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
export const useGetTestimonials = () => {
    return useQuery({
        queryKey: ["testimonials"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/admin/testimonials`);
            return data;
        },
    });
};
export const useGetFeatures = () => {
    return useQuery({
        queryKey: ["features"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/admin/powerfull/features`);
            return data;
        },
    });
};
export const useGetTransform = () => {
    return useQuery({
        queryKey: ["transform"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`api/admin/transform`);
            return data;
        },
    });
};