import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";

export const useGetProfileLogo = (code) =>
  useQuery({
    queryKey: ["profile-logo", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/profile-logo/get/${code}`);
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetCard = (code) =>
  useQuery({
    queryKey: ["card", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/card/${code}`);
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetServices = (code) =>
  useQuery({
    queryKey: ["profile-services", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/profile-services/all/get/${code}`
      );
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetProducts = (code) =>
  useQuery({
    queryKey: ["profile-products", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/profile-products/all/get/${code}`
      );
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetGallery = (code) =>
  useQuery({
    queryKey: ["profile-gallery", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/profile-gallery/all/get/${code}`
      );
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetLocation = (code) =>
  useQuery({
    queryKey: ["profile-location", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/profile/location/get/${code}`
      );
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetResume = (code) =>
  useQuery({
    queryKey: ["profile-resume", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/profile/resume/get/${code}`
      );
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetPaymentDetails = (code) =>
  useQuery({
    queryKey: ["profile-payment-details", code],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/profile/payment-details/get/${code}`
      );
      return data;
    },
    enabled: Boolean(code),
  });

export const useGetSectionAvailability = (activationCode) => {
  return useQuery({
    queryKey: ["section-availability", activationCode],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/profile-services/section-availability/${activationCode}`)
      return data
    },
    enabled: Boolean(activationCode),
  });
};