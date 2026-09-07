import axios from "axios";
import { logoutAction } from "../store/slices/authSlice";
import { store } from "../store";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logoutAction());
            window.location.href = "/admin/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;