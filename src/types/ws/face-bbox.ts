
import { WS_EVENTS } from "@/constants";
import { type WSIncomingMessage } from "./base";

interface NormalizeBBOX {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FaceBBoxPayload = {
  event:string
  cameraCode: string;
  trackId: number;
  bbox: NormalizeBBOX;
  timestamp: number;
  eventTs: number;
  frameTs: number;
  frameWidth: number;
  frameHeight: number;
  personId?: string;
  similarity?: number;
};

export type FaceBBoxMessage = WSIncomingMessage<
  typeof WS_EVENTS.FACE_BBOX,
  FaceBBoxPayload
>;
