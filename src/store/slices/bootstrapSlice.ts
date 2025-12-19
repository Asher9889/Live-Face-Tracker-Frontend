// store/slices/bootstrapSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type BootstrapState = {
  status: "idle" | "loading" | "ready" | "error";
  error?: string;
};

const initialState: BootstrapState = {
  status: "idle",
};

const bootstrapSlice = createSlice({
  name: "bootstrap",
  initialState,
  reducers: {
    bootstrapStarted(state) {
      state.status = "loading";
      state.error = undefined;
    },
    bootstrapSucceeded(state) {
      state.status = "ready";
    },
    bootstrapFailed(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const {
  bootstrapStarted,
  bootstrapSucceeded,
  bootstrapFailed,
} = bootstrapSlice.actions;

export default bootstrapSlice.reducer;
