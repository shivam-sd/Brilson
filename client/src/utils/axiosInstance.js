import axios from "axios";
import { logoutAction } from "../store/slices/authSlice";
import { store } from "../store";
// const token = store.getState().auth.token;
// console.log(token);

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

// commenting out the request interceptor for now

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const state = store.getState();

//         const token = state.auth?.token;

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );


axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {

            
            if (store.getState().auth?.isAdminAuthenticated === true) {
                store.dispatch(logoutAction());
                window.location.href = "/admin/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;