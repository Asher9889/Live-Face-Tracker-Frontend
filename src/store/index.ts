import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import cameraRuntimeReducer from './slices/cameraRuntimeSlice';
import cameraEntityReducer from "./slices/cameraEntitySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        cameraEntity: cameraEntityReducer,
        cameraRuntime: cameraRuntimeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
