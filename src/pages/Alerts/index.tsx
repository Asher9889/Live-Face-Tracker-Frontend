import { useState, useEffect } from 'react';
import AlertsFeed from '@/components/alerts/AlertsFeed';
import { Button } from '@/components/ui/button';
import { BellOff, Bell, Settings } from 'lucide-react';
import { notificationSoundSettings } from '@/utils/notificationSoundSettings';

const Alerts = () => {
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

  const handleToggleSound = () => {
    notificationSoundSettings.toggleSound();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Real-Time Alerts</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
          >
            {soundEnabled ? (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                Mute Sounds
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Enable Sounds
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <AlertsFeed />
      </div>
    </div>
  );
};

export default Alerts;
