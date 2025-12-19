import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ICameraRuntime } from '@/types/camera';

interface CameraState {
    byCode: Record<string, ICameraRuntime>
}

const initialState: CameraState = {
  byCode: {} 
}

const cameraRuntimeSlice = createSlice({
    name: "cameraRuntime",
    initialState,
    reducers: {
        updateOne: (state, action: PayloadAction<ICameraRuntime>) => {
            const {code, ...data} = action.payload;

            state.byCode[code] = {
                code: code,
                ...data
            };
        }
    }
})

export const { updateOne } = cameraRuntimeSlice.actions;

export default cameraRuntimeSlice.reducer;

