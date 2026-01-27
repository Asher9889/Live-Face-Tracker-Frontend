import { useEffect, useRef } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import { envs } from "@/config";

type Props = {
  token?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export function useLiveKitRoom({ token, videoRef }: Props) {
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    if (!token || !videoRef.current) return;

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    roomRef.current = room;

    const onTrackSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
      }
    };

    const onTrackUnsubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Video) {
        track.detach();
      }
    };

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
    room.connect(envs.liveKitUrl, token);

    return () => {
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
      room.disconnect();
      roomRef.current = null;
    };
  }, [token, videoRef]);
}
