import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IPayload {
  cameraCode: string;
  trackId: number;
  bbox: NormalizedBBox;
  eventTs: number;
  frameTs: number;
  personId?: string;
  similarity?: number;
}

interface NormalizedBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TrackBBoxState {
  trackId: number;
  personId?: string;
  bbox: NormalizedBBox;
  frameTs: number;
  eventTs: number;
  similarity?: number;
}

interface CameraBBoxState {
  tracks: Record<number, TrackBBoxState[]>;
}

interface BBoxState {
  byCamera: Record<string, CameraBBoxState>;
}

const initialState: BBoxState = {
  byCamera: {},
};
// const BBOX_TTL_MS = 800; // tune this (500–1000ms)

const cameraBBoxSlice = createSlice({
  name: "cameraBBox",
  initialState,
  reducers: {
    bboxUpserted(state, action: PayloadAction<IPayload>) {

      const { cameraCode, trackId, bbox, personId, eventTs, frameTs } = action.payload;

      if (!state.byCamera[cameraCode]) {
        state.byCamera[cameraCode] = { tracks: {} };
      }

      const cameraState = state.byCamera[cameraCode];

      if (!cameraState.tracks[trackId]) {
        cameraState.tracks[trackId] = [];
      }

      cameraState.tracks[trackId].push({
        trackId,
        bbox,
        personId,
        frameTs,
        eventTs,
      });

    },

    clearCameraBBoxes(state, action: PayloadAction<{ trackId: number, cameraCode: string }>) {
      const { trackId, cameraCode } = action.payload;
      delete state.byCamera[cameraCode].tracks[trackId];
    },

    cleanupExpiredBBoxes(state, action: PayloadAction<{ now: number }>) {
      const { now } = action.payload;

      console.log("now", now, state)
    }

  },
});

export const { bboxUpserted, clearCameraBBoxes, cleanupExpiredBBoxes } = cameraBBoxSlice.actions;

export default cameraBBoxSlice.reducer;
