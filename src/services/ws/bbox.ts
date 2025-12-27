// src/realtime/bboxBus.ts

type BBoxPayload = any;

type Listener = (payload: BBoxPayload) => void;

// cameraCode -> listeners
const listeners = new Map<string, Set<Listener>>();

export function subscribeBBox(
  cameraCode: string,
  listener: Listener
) {
  let set = listeners.get(cameraCode);

  if (!set) {
    set = new Set();
    listeners.set(cameraCode, set);
  }

  set.add(listener);

  // return unsubscribe function
  return () => {
    set?.delete(listener);
    if (set && set.size === 0) {
      listeners.delete(cameraCode);
    }
  };
}

export function emitBBox(
  cameraCode: string,
  payload: BBoxPayload
) {
  const set = listeners.get(cameraCode);
  if (!set) return;

  for (const listener of set) {
    listener(payload);
  }
}
