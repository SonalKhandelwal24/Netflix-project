import { createSlice } from "@reduxjs/toolkit";

// Define the initial state and its type
interface RefreshState {
  refresh: boolean;
}

const initialState: RefreshState = {
  refresh: true,
};

const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    toggleRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { toggleRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
