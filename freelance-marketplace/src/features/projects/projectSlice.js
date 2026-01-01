import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/projects";

/* ===================== THUNKS ===================== */

// FETCH PROJECTS
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch projects");
    }
  }
);

// CREATE PROJECT
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, project, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to create project"
      );
    }
  }
);

// UPDATE PROJECT
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/${id}`, data);
      return { id, data };
    } catch (err) {
      return rejectWithValue("Failed to update project");
    }
  }
);

// DELETE PROJECT
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete project");
    }
  }
);

// ✅ MARK AS COMPLETED (ONLY ONE THUNK — IMPORTANT)
export const markAsCompleted = createAsyncThunk(
  "projects/markAsCompleted",
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.patch(`${API_URL}/${projectId}/complete`);
      return projectId; // 👈 ONLY projectId returned
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to mark project as completed"
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
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- FETCH ---------- */
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

      /* ---------- CREATE ---------- */
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

      /* ---------- UPDATE ---------- */
      .addCase(updateProject.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const project = state.projects.find(
          (p) => p.id === id || p._id === id
        );
        if (project) {
          Object.assign(project, data);
        }
        if (
          state.currentProject &&
          (state.currentProject.id === id ||
            state.currentProject._id === id)
        ) {
          Object.assign(state.currentProject, data);
        }
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (p) => p.id !== action.payload && p._id !== action.payload
        );
        if (
          state.currentProject &&
          (state.currentProject.id === action.payload ||
            state.currentProject._id === action.payload)
        ) {
          state.currentProject = null;
        }
      })

      /* ---------- MARK AS COMPLETED (🔥 CORE FIX) ---------- */
      .addCase(markAsCompleted.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(markAsCompleted.fulfilled, (state, action) => {
        state.status = "succeeded";

        const projectId = action.payload;

        // ✅ Update ONLY that project in list
        const project = state.projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        if (project) {
          project.status = "COMPLETED";
        }

        // ✅ Update ONLY currentProject if it matches
        if (
          state.currentProject &&
          (state.currentProject.id === projectId ||
            state.currentProject._id === projectId)
        ) {
          state.currentProject.status = "COMPLETED";
        }
      })
      
      .addCase(markAsCompleted.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

/* ===================== EXPORTS ===================== */

export const { setCurrentProject, clearCurrentProject } =
  projectSlice.actions;

export default projectSlice.reducer;
