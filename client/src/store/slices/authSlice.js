import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        adminToken: null,
        user: null,
        isAuthenticated: false,
        isAdminAuthenticated: false,
    },
    reducers: {
        setCredentials: (state, action) => {
            const payload = action.payload || {};
            const token = payload.token || payload.data?.token;
            const adminToken = payload.adminToken || payload.data?.adminToken;
            const user = payload.user || payload.data?.user;

            if (token) {
                state.token = token;
                state.isAuthenticated = true;
            }

            if (adminToken) {
                state.adminToken = adminToken;
                state.isAdminAuthenticated = true;
            }

            if (user) {
                state.user = user;
            }
        },
        logoutAction: (state) => {
            state.token = null;
            state.adminToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isAdminAuthenticated = false;
        },
    },
});

export const { setCredentials, logoutAction } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectAdminToken = (state) => state.auth.adminToken;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdminAuthenticated = (state) => state.auth.isAdminAuthenticated;

export default authSlice.reducer;
