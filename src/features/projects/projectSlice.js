import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

const API_URL = "/projects";

/* ===================== THUNKS ===================== */

// FETCH PROJECTS (PUBLIC)
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URL);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to fetch projects"
      );
    }
  }
);

// CREATE PROJECT (AUTH)
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token available:", !!token);
      console.log("Posting project:", project);
      const res = await api.post(API_URL, project);
      console.log("Project created response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error creating project:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create project";
      console.error("Error message:", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// UPDATE PROJECT (AUTH)
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${projectId}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update project"
      );
    }
  }
);

// DELETE PROJECT (AUTH)
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`${API_URL}/${projectId}`);
      return projectId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete project"
      );
    }
  }
);

/* ===================== SLICE ===================== */

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    currentProject: null,
    status: "idle",
    error: null,
  },

  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    resetProjectsState: (state) => {
      state.projects = [];
      state.currentProject = null;
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH PROJECTS
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CREATE PROJECT
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE PROJECT
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // DELETE PROJECT
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = state.projects.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProject,
  clearCurrentProject,
  resetProjectsState,
} = projectSlice.actions;

export default projectSlice.reducer;
