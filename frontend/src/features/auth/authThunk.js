import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../config/api";
import api from "../../config/api";


export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);
