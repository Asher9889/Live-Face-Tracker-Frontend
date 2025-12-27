import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import cameraRuntimeReducer from './slices/cameraRuntimeSlice';
import cameraEntityReducer from "./slices/cameraEntitySlice";
import bootstrapReducer from "./slices/bootstrapSlice";
import cameraBBoxReducer from "./slices/cameraBBoxSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        cameraEntity: cameraEntityReducer,
        cameraRuntime: cameraRuntimeReducer,
        bootstrap : bootstrapReducer,
        cameraBBox : cameraBBoxReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
