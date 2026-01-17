import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

const API_URL = "/auth";

/* ================== THUNKS ================== */

// ------------------ LOGIN ------------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}/login`, credentials);
      return res.data; // { access_token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Login failed"
      );
    }
  }
);

// ------------------ SIGNUP ------------------
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}/signup`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Signup failed"
      );
    }
  }
);

/* ================== SLICE ================== */

// ✅ Restore session from localStorage (NOT sessionStorage)
const storedAuth = localStorage.getItem("auth");
const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: parsedAuth?.user || null,
    accessToken: parsedAuth?.accessToken || null,
    isAuthenticated: !!parsedAuth?.accessToken,
    status: "idle",
    error: null,
  },

  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.isAuthenticated = true;

        // 🔑 STORE CONSISTENTLY
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload.user,
            accessToken: action.payload.access_token,
          })
        );

        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
      })

      // ❌ LOGIN FAILED
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })

      // ❌ SIGNUP FAILED
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
