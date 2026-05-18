import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UIEventNotificationPayload } from "@/types/ws/camera-status";

const MAX_NOTIFICATIONS = 10;

export interface UINotification extends UIEventNotificationPayload {
  id: string;
  createdAt: number;
  soundPlayed: boolean;
}

interface UIEventNotificationState {
  notifications: UINotification[];
}

const initialState: UIEventNotificationState = {
  notifications: [],
};

const uiEventNotificationSlice = createSlice({
  name: "uiEventNotification",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<UIEventNotificationPayload>
    ) => {
      const newNotification: UINotification = {
        ...action.payload,
        createdAt: Date.now(),
        soundPlayed: false,
      };

      // Add new notification at the beginning
      state.notifications.unshift(newNotification);

      // Keep only top 10 notifications
      if (state.notifications.length > MAX_NOTIFICATIONS) {
        state.notifications = state.notifications.slice(0, MAX_NOTIFICATIONS);
      }
    },

    markSoundPlayed: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.soundPlayed = true;
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  markSoundPlayed,
  removeNotification,
  clearAllNotifications,
} = uiEventNotificationSlice.actions;

export default uiEventNotificationSlice.reducer;

