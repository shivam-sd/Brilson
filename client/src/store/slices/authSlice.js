import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        setCredentials: (state, action) => {
            const payload = action.payload || {};
            const token = payload.token || payload.data?.token;
            const user = payload.user || payload.data?.user;

            if (token) {
                state.token = token;
                state.isAuthenticated = true;
            }

            if (user) {
                state.user = user;
            }
        },
        logoutAction: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, logoutAction } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
