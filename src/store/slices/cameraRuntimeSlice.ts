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
            const { code, ...data } = action.payload;

            state.byCode[code] = {
                ...state.byCode[code],
                ...data,
            };
        },
        updateStreamStartTs: (state, action: PayloadAction<{ code: string, streamStartTs: number }>) => {
            const { code, streamStartTs } = action.payload;
            if (!state.byCode[code]) {
                state.byCode[code] = {
                    code,
                    status: "online",
                    lastFrameAt: 0,
                    streamStartTs,
                };
            } else {
                state.byCode[code].streamStartTs = streamStartTs;
            }
        }
    }
})

export const { updateOne, updateStreamStartTs } = cameraRuntimeSlice.actions;

export default cameraRuntimeSlice.reducer;

