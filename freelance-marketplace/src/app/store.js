// import { configureStore } from "@reduxjs/toolkit";
// import projectsReducer from "../features/projects/projectSlice";

// export const store = configureStore({
//   reducer: {
//     projects: projectsReducer,
//   },
// });

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,        // 🔥 THIS IS REQUIRED
    projects: projectReducer
  },
});

