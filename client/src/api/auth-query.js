import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";


export const useLogin = () => {
    return useMutation({
        mutationFn: async ({ phone, password }) => {
            const { data } = await axiosInstance.post("/api/users/login", { phone, password, });
            return data;
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async ({ name, phone, password, referralCode }) => {
            const { data } = await axiosInstance.post("/api/users/register", { name, phone, password, referralCode, });
            return data;
        },
    });
};

export const useSendOTP = () => {
    return useMutation({
        mutationFn: async ({ phone }) => {
            const { data } = await axiosInstance.post("/api/users/send-otp", { phone });
            return data;
        },
    });
};
export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: async ({ phone, otp }) => {
            const { data } = await axiosInstance.post("/api/users/verify-otp", { phone, otp });
            return data;
        },
    });
};