// import axios from "axios";

// export const loginUser = async (data) => {
//   const res = await axios.post("http://127.0.0.1:8000/auth/login", data);
//   return res.data;
// };

import { createAsyncThunk } from "@reduxjs/toolkit";
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
