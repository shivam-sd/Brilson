import axios from "axios";
import { logoutAction } from "../store/slices/authSlice";
import { store } from "../store";
import { toast } from "react-toastify";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && store.getState().auth.isAdminAuthenticated) {
            store.dispatch(logoutAction());
            toast.error("Session expired. Please log in again.");

            setTimeout(() => {
                window.location.href = "/admin/login";
            }, 1000);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;