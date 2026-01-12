import { useEffect } from "react";
import { RoomEvent, Track } from "livekit-client";

export function useCameraVideo(room: any, videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    if (!room || !videoRef.current) return;

    const el = videoRef.current;

    // Helper to get all video tracks from remote participants
    const getRemoteVideoTracks = () => {
      const tracks: any[] = [];
      room.remoteParticipants.forEach((p: any) => {
        p.trackPublications.forEach((pub: any) => {
          if (pub.kind === Track.Kind.Video && pub.track) {
            tracks.push(pub);
          }
        });
      });
      return tracks;
    };

    // 1️⃣ Handle existing tracks (Room is persistent/singleton)
    getRemoteVideoTracks().forEach((pub: any) => {
      if (pub.isSubscribed) {
        pub.track.attach(el);
      }
    });

    // 2️⃣ Handle NEW tracks (fresh connection)
    const onTrackSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Video) {
        track.attach(el);
      }
    };

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);

    return () => {
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      // Clean detach on unmount
      getRemoteVideoTracks().forEach((pub: any) => {
        pub.track?.detach(el);
      });
    };
  }, [room, videoRef]);
}
