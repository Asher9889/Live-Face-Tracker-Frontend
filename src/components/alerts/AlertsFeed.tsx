import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, UserX, Users, DoorOpen, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface Alert {
    id: string;
    type: 'spoof' | 'unknown' | 'tailgating' | 'blacklist' | 'intrusion';
    message: string;
    camera: string;
    timestamp: string;
    severity: 'high' | 'medium' | 'low';
    image?: string;
}

const AlertsFeed = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // Mock incoming alerts
    useEffect(() => {
        const interval = setInterval(() => {
            const types = ['spoof', 'unknown', 'tailgating', 'blacklist', 'intrusion'] as const;
            const type = types[Math.floor(Math.random() * types.length)];

            const newAlert: Alert = {
                id: Date.now().toString(),
                type,
                message: getAlertMessage(type),
                camera: `Camera ${Math.floor(Math.random() * 4) + 1}`,
                timestamp: new Date().toLocaleTimeString(),
                severity: getSeverity(type),
                image: `https://i.pravatar.cc/150?u=${Date.now()}`,
            };

            setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getAlertMessage = (type: string) => {
        switch (type) {
            case 'spoof': return 'Potential spoofing attempt detected';
            case 'unknown': return 'Unknown person detected in restricted area';
            case 'tailgating': return 'Tailgating event detected at entry';
            case 'blacklist': return 'Blacklisted individual identified';
            case 'intrusion': return 'After-hours intrusion detected';
            default: return 'Security alert';
        }
    };

    const getSeverity = (type: string) => {
        switch (type) {
            case 'spoof':
            case 'blacklist':
            case 'intrusion':
                return 'high';
            case 'tailgating':
                return 'medium';
            default:
                return 'low';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'spoof': return <UserX className="h-5 w-5" />;
            case 'unknown': return <Users className="h-5 w-5" />;
            case 'tailgating': return <DoorOpen className="h-5 w-5" />;
            case 'blacklist': return <AlertTriangle className="h-5 w-5" />;
            case 'intrusion': return <ShieldAlert className="h-5 w-5" />;
            default: return <AlertTriangle className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-4">
            <AnimatePresence initial={false}>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <Card className={cn(
                            "p-4 border-l-4",
                            alert.severity === 'high' ? "border-l-red-500 bg-red-500/10" :
                                alert.severity === 'medium' ? "border-l-orange-500 bg-orange-500/10" :
                                    "border-l-blue-500 bg-blue-500/10"
                        )}>
                            <div className="flex gap-4">
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                                    {alert.image && <img src={alert.image} alt="Snapshot" className="h-full w-full object-cover" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-semibold">
                                            {getIcon(alert.type)}
                                            <span className="capitalize">{alert.type} Alert</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground">{alert.camera}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
            {alerts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No active alerts
                </div>
            )}
        </div>
    );
};

export default AlertsFeed;
