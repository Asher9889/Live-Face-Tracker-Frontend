import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeNotification } from '@/store/slices/uiEventNotificationSlice';

const NotificationBell: React.FC = () => {
  const notifications = useAppSelector((s) => s.uiEventNotification.notifications);
  const dispatch = useAppDispatch();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-full relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-destructive text-white text-[10px]">{notifications.length}</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">Notifications</h4>
          <small className="text-xs text-muted-foreground">Latest</small>
        </div>

        {notifications.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4">No notifications</div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div key={n.id} className="px-2 py-2 rounded-md hover:bg-accent/50">
                <p className="text-sm font-medium text-foreground">{n.note}</p>
                <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                  <span>{n.role}</span>
                  {n.department && <span>· {n.department}</span>}
                </div>
                <div className="mt-2 text-right">
                  <Button variant="ghost" size="sm" onClick={() => dispatch(removeNotification(n.id))}>Dismiss</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
