import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";

export const markProjectComplete = createAsyncThunk(
  "projects/markComplete",
  async (projectId, { getState }) => {
    const token = getState().auth.token;

    await axios.post(
      `/projects/${projectId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return projectId;
  }
);
