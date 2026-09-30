import { createSlice } from "@reduxjs/toolkit";

const getSystemTheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

const profileThemeSlice = createSlice({
  name: "profileTheme",
  initialState: { mode: getSystemTheme() }, // "light" | "dark"
  reducers: {
    toggleProfileTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    setProfileTheme: (state, action) => {
      if (action.payload === "light" || action.payload === "dark") {
        state.mode = action.payload;
      }
    },
  },
});

export const { toggleProfileTheme, setProfileTheme } = profileThemeSlice.actions;
export const selectProfileTheme = (state) => state.profileTheme.mode;
export default profileThemeSlice.reducer;