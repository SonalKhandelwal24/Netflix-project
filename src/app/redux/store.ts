import { configureStore } from "@reduxjs/toolkit";
import refreshSlice from "./slice/refreshSlice";

export const store = configureStore({
  reducer: {
    refreshSlice
  },
});

// Infer the RootState type
export type RootState = ReturnType<typeof store.getState>;

// Export AppDispatch for use in components
export type AppDispatch = typeof store.dispatch;
