const WS_EVENTS = {
  FACE_BBOX: "face:bbox", // all bbox will get here (type, payload)
  CAMERA_STATUS_CHANGED: "live-face-tracker:camera-event:status:change", // live-face-tracker:camera-event:status:change
  CAMERA_STREAM_STARTED: "camera:stream:started",
} as const;

export default WS_EVENTS;