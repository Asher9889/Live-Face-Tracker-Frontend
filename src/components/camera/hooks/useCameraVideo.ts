import { useEffect } from "react";
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication } from "livekit-client";

const isCameraVideo = (pub: RemoteTrackPublication): boolean =>
    pub.kind === Track.Kind.Video &&
    pub.source !== Track.Source.ScreenShare &&
    pub.source !== Track.Source.ScreenShareAudio;

/**
 * Attaches the camera's remote video track to a <video> element.
 *
 * The room is shared across the grid, so the track may already be subscribed
 * when this mounts — the subscribe event would then never fire for it.
 */
export function useCameraVideo(
    room: Room | null,
    videoRef: React.RefObject<HTMLVideoElement | null>
) {
    useEffect(() => {
        if (!room) return;
        // The element must already be mounted when this runs. Ref objects are
        // stable, so a null here would not re-trigger the effect and the track
        // would silently never attach.
        const el = videoRef.current;
        if (!el) return;

        const publications = (): RemoteTrackPublication[] => {
            const found: RemoteTrackPublication[] = [];
            room.remoteParticipants.forEach((participant) => {
                participant.videoTrackPublications.forEach((pub) => {
                    if (isCameraVideo(pub)) found.push(pub);
                });
            });
            return found;
        };

        const attachExisting = () => {
            publications().forEach((pub) => {
                if (pub.isSubscribed && pub.track) pub.track.attach(el);
            });
        };

        attachExisting();

        const onSubscribed = (track: RemoteTrack, pub: RemoteTrackPublication) => {
            if (isCameraVideo(pub)) track.attach(el);
        };

        // A re-subscribe after an adaptive-stream or network change re-emits
        // the track, so re-run the attach rather than trusting the first event.
        const onUnsubscribed = () => attachExisting();

        room.on(RoomEvent.TrackSubscribed, onSubscribed);
        room.on(RoomEvent.TrackUnsubscribed, onUnsubscribed);

        return () => {
            room.off(RoomEvent.TrackSubscribed, onSubscribed);
            room.off(RoomEvent.TrackUnsubscribed, onUnsubscribed);
            publications().forEach((pub) => pub.track?.detach(el));
        };
    }, [room, videoRef]);
}
