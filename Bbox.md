Python AI
  ↓ (Redis publish)
Redis channel: live-face-tracker:camera-events:<camera_code>
  ↓ (Redis SUBSCRIBE)
Node.js (subscriber)
  ↓ (WebSocket broadcast)
Frontend
  ↓
Redux (runtime bbox state)
  ↓
CameraOverlay
