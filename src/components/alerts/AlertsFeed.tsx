import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogIn, LogOut, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markSoundPlayed, removeNotification } from '@/store/slices/uiEventNotificationSlice';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { TfiLocationPin } from "react-icons/tfi";


const AlertsFeed = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.uiEventNotification.notifications);
  const { playSound } = useNotificationSound();

  // Play sound for notifications that haven't played sound yet
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.soundPlayed) {
        playSound();
        dispatch(markSoundPlayed(notification.id));
      }
    });
  }, [notifications, playSound, dispatch]);

  // Auto-remove notifications after 8 seconds
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = Date.now();
//       notifications.forEach((notification) => {
//         if (now - notification.createdAt > 15000) { // 15 seconds
//           dispatch(removeNotification(notification.id));
//         }
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [notifications, dispatch]);

  const getEventIcon = (noteKey: string) => {
    switch (noteKey) {
      case 'person_entered':
        return <LogIn className="h-5 w-5 text-green-600" />;
      case 'person_exited':
        return <LogOut className="h-5 w-5 text-blue-600" />;
      case 'unknown_entered':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'unknown_exited':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getEventTitle = (noteKey: string) => {
    switch (noteKey) {
      case 'person_entered':
        return 'Person Entered';
      case 'person_exited':
        return 'Person Exited';
      case 'unknown_entered':
        return 'Unknown Person Entered';
      case 'unknown_exited':
        return 'Unknown Person Exited';
      default:
        return 'Event';
    }
  };

  const getSeverityColor = (noteKey: string) => {
    if (noteKey.includes('unknown')) {
      return 'border-l-orange-500 bg-orange-500/10';
    }
    if (noteKey.includes('entered')) {
      return 'border-l-green-500 bg-green-500/10';
    }
    return 'border-l-blue-500 bg-blue-500/10';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Real-Time Alerts
        </h3>
      </div>

      <AnimatePresence initial={false}>
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground py-8"
          >
            No recent alerts
          </motion.div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Card
                className={cn(
                  'p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow',
                  getSeverityColor(notification.noteKey)
                )}
                onClick={() => dispatch(removeNotification(notification.id))}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                    {notification.avatar ? (
                      <img
                        src={notification.avatar}
                        alt={notification.name || 'Unknown'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold">
                        {getEventIcon(notification.noteKey)}
                        <span>{getEventTitle(notification.noteKey)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.eventTs)}
                      </span>
                    </div>

                    {/* Person Info */}
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {notification.name || 'Unknown Person'}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {notification.role && (
                          <span className="px-2 py-0.5 bg-secondary rounded-full">
                            {notification.role}
                          </span>
                        )}
                        {notification.department && (
                          <span className="px-2 py-0.5 bg-secondary rounded-full">
                            {notification.department}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message and Camera */}
                    <div className="space-y-1 pt-2">
                      <p className="text-sm">{notification.note}</p>
                      <p className="text-xs text-muted-foreground">
                        <TfiLocationPin className="inline-block mr-1 text-green-500 " /> {notification.cameraName} ({notification.cameraCode})
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertsFeed;
