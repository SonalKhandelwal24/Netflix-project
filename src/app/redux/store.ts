import { configureStore } from "@reduxjs/toolkit";
import refreshSlice from "./slice/refreshSlice";

export const store = configureStore({
  reducer: {
    refreshSlice
  },
});

// Infer the RootState type
//Selector - function that returns a value from the state
export type RootState = ReturnType<typeof store.getState>;

// Export AppDispatch for use in components
//Dispatch - function that sends an action to the store
export type AppDispatch = typeof store.dispatch;
