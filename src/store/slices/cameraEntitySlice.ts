import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ICameraEntity {
  code: string;
  name: string;
  location: string;
  gateType: string;
  enabled: boolean;
}

interface ICameraEntityState {
  byCode: Record<string, ICameraEntity>
  ids: string[]
}

const initialState: ICameraEntityState   = {
  byCode : {},
  ids: []
}

const cameraEntitySlice = createSlice ({
  name: "cameraEntity",
  initialState,
  reducers : {

    registerAll : (state, action:PayloadAction<ICameraEntity[]>) => {
      action.payload.forEach((cam) => {
        state.byCode[cam.code] = cam;
        if (!state.ids.includes(cam.code)) {
          state.ids.push(cam.code);
        }
      })
    }

  }
})

export const { registerAll } = cameraEntitySlice.actions;
export default cameraEntitySlice.reducer;
