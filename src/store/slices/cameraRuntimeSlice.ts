import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type TCameraRuntimeStatus = "online" | "offline" | "connecting" | "error";

interface ICameraRuntime {
    code: string;
    status: TCameraRuntimeStatus;
    fps: number;
    lastFrameAt: number
}

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

