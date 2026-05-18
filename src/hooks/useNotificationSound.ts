import { useCallback, useRef, useEffect, useState } from 'react';
import { notificationSoundSettings } from '@/utils/notificationSoundSettings';

const NOTIFICATION_SOUND_URL = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';

/**
 * Hook to play notification sound
 * Creates a pool of audio elements to avoid conflicts
 * Respects user's sound settings
 */
export const useNotificationSound = () => {
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(() =>
    notificationSoundSettings.isSoundEnabled()
  );

  // Listen for sound setting changes
  useEffect(() => {
    const handleSoundSettingChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSoundEnabled(customEvent.detail.enabled);
    };

    window.addEventListener('soundSettingChanged', handleSoundSettingChange);
    return () => {
      window.removeEventListener('soundSettingChanged', handleSoundSettingChange);
    };
  }, []);

  useEffect(() => {
    // Initialize audio pool on mount
    audioPoolRef.current = Array.from({ length: 3 }, () => {
      const audio = new Audio();
      audio.preload = 'auto';
      return audio;
    });

    return () => {
      audioPoolRef.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const playSound = useCallback(() => {
    // Don't play if sound is disabled
    if (!soundEnabled) return;

    // Find an available audio element
    const availableAudio = audioPoolRef.current.find(
      (audio) => audio.paused || audio.ended
    );

    if (availableAudio && !isPlayingRef.current) {
      isPlayingRef.current = true;

      // Use a simple beep sound (web audio API approach)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure sound parameters
        oscillator.frequency.value = 800; // Hz
        oscillator.type = 'sine';

        // Set volume
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        // Play sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);

        oscillator.onended = () => {
          isPlayingRef.current = false;
        };
      } catch (error) {
        console.warn('Audio context not available, falling back to HTML Audio API');

        // Fallback: try to use a simple beep with HTML Audio element
        availableAudio.src = NOTIFICATION_SOUND_URL;
        availableAudio.volume = 0.5;

        availableAudio.onended = () => {
          isPlayingRef.current = false;
        };

        availableAudio.play().catch(() => {
          isPlayingRef.current = false;
          console.warn('Could not play notification sound');
        });
      }
    }
  }, [soundEnabled]);

  return { playSound, soundEnabled };
};

