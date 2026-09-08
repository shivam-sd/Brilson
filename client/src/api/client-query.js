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

export const useGetBalance = () => {
    return useQuery({
        queryKey: ["balance"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/users/balance");
            return data;
        }
    });
};

export const useGetUserCards = (userId) => {
    return useQuery({
        queryKey: ["userCards", userId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                `/api/cards/user/${userId}`
            );

            return data?.data?.flatMap((user) => user.cards || []) || [];
        },
        enabled: !!userId,
    });
};

export const useGetUserParkingTags = (userId) => {
    return useQuery({
        queryKey: ["userParkingTags", userId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                `/api/tags/user/${userId}`
            );

            return data?.data?.flatMap((user) => user.tags || []) || [];
        },
        enabled: !!userId,
    });
};

export const useGetUserGoogleReviews = (userId) => {
    return useQuery({
        queryKey: ["userGoogleReviews", userId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                `/api/google-reviews/user/${userId}`
            );

            return (
                data?.data?.flatMap((user) => user.reviews || []) || []
            );
        },
        enabled: !!userId,
    });
};
export const useGetReferrals = () => {
    return useQuery({
        queryKey: ["referrals"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/user/referral");
            return data;
        }
    });
};