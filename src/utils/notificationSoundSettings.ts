/**
 * Notification sound settings management
 */

const SOUND_ENABLED_KEY = 'ui_notification_sound_enabled';

export const notificationSoundSettings = {
  /**
   * Check if notification sounds are enabled
   */
  isSoundEnabled: (): boolean => {
    const stored = localStorage.getItem(SOUND_ENABLED_KEY);
    return stored !== null ? stored === 'true' : true; // Default: enabled
  },

  /**
   * Enable notification sounds
   */
  enableSound: (): void => {
    localStorage.setItem(SOUND_ENABLED_KEY, 'true');
    window.dispatchEvent(new CustomEvent('soundSettingChanged', { detail: { enabled: true } }));
  },

  /**
   * Disable notification sounds
   */
  disableSound: (): void => {
    localStorage.setItem(SOUND_ENABLED_KEY, 'false');
    window.dispatchEvent(new CustomEvent('soundSettingChanged', { detail: { enabled: false } }));
  },

  /**
   * Toggle notification sound setting
   */
  toggleSound: (): boolean => {
    const current = notificationSoundSettings.isSoundEnabled();
    if (current) {
      notificationSoundSettings.disableSound();
    } else {
      notificationSoundSettings.enableSound();
    }
    return !current;
  },
};
