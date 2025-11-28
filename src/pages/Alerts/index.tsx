import AlertsFeed from '@/components/alerts/AlertsFeed';
import { Button } from '@/components/ui/button';
import { BellOff, Settings } from 'lucide-react';

const Alerts = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Real-Time Alerts</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <BellOff className="mr-2 h-4 w-4" />
                        Mute Sounds
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
