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

export const useGetProfileLogo = (slug) => {
    return useQuery({
        queryKey: ["profileLogo", slug],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                `/api/profile-logo/get/${slug}`
            );

            return data?.profileLogo?.image || null;
        },
        enabled: !!slug,
    });
};

export const useGetProfile = (slug) => {
    return useQuery({
        queryKey: ["profile", slug],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/card/${slug}`);

            return data;
        },
        enabled: !!slug,
    });
};

export const useGetProfileCover = (activationCode) => {
    return useQuery({
        queryKey: ["profileCover", activationCode],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                `/api/profile-cover/get/${activationCode}`
            );

            return data?.profileLogo?.image || null;
        },
        enabled: !!activationCode,
    });
};

export const useGetProfileProducts = (activationCode) => {
    return useQuery({
        queryKey: ["profileProducts", activationCode],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/profile-products/all/get/${activationCode}`);

            return data?.data || [];
        },
        enabled: !!activationCode
    });
};
export const useGetResume = (activationCode) => {
    return useQuery({
        queryKey: ["resume", activationCode],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/profile/resume/get/${activationCode}`);

            return data?.resume || null;
        },
        enabled: !!activationCode,
    });
};
export const useGetGallery = (id) => {
    return useQuery({
        queryKey: ["gallery", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/profile-gallery/all/get/${id}`);
            return data?.data || [];
        },
        enabled: !!id
    });
};
export const useGetPaymentDetails = (activationCode) => {
    return useQuery({
        queryKey: ["paymentDetails", activationCode],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/profile/payment-details/get/${activationCode}`);
            return data?.data || null;
        },
        enabled: !!activationCode
    });
};
export const useGetMyOrders = () => {
    return useQuery({
        queryKey: ["myOrders"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/orders`);
            return data.orders || [];
        },
    });
};