# UI Event Notification System - Implementation Summary

## Overview
A complete real-time notification system has been implemented with Redux state management, sound notifications, and automatic cleanup. The system displays up to 10 notifications with auto-removal after 8 seconds.

---

## 📁 Files Created/Modified

### 1. **Redux Slice** - `src/store/slices/uiEventNotificationSlice.ts`
   - **State Structure**: Stores up to 10 notifications (MAX_NOTIFICATIONS = 10)
   - **Actions**:
     - `addNotification`: Adds new notifications at the beginning, maintains top 10 limit
     - `markSoundPlayed`: Tracks which notifications have played their sound (prevents duplicate sound)
     - `removeNotification`: Removes a specific notification by ID
     - `clearAllNotifications`: Clears all notifications
   
   - **Notification Interface**:
   ```typescript
   interface UINotification extends UIEventNotificationPayload {
     id: string;
     createdAt: number;
     soundPlayed: boolean; // Prevents sound from playing multiple times
   }
   ```

### 2. **Store Configuration** - `src/store/index.ts`
   - Added `uiEventNotificationReducer` to the Redux store configuration
   - Integrated with existing store structure

### 3. **WebSocket Handler** - `src/services/ws/cameraStatusWS.ts`
   - Added handler for `WS_EVENTS.UI_EVENT_NOTIFICATION`
   - Dispatches `addNotification` action when events arrive from server
   - Extracts payload: id, name, role, department, avatar, cameraCode, cameraName, eventTs, note, noteKey

### 4. **Sound Hook** - `src/hooks/useNotificationSound.ts` (NEW)
   - **Purpose**: Play notification sound when events arrive
   - **Features**:
     - Uses Web Audio API for cross-browser compatibility
     - Falls back to HTML Audio API if Web Audio unavailable
     - Audio pool: Creates 3 audio elements to prevent overlap
     - Respects user sound preference settings
     - Frequency: 800Hz sine wave, 0.2 second duration
     - Volume: 0.3 (configurable)
   
   - **Returns**:
   ```typescript
   { 
     playSound: () => void;
     soundEnabled: boolean;
   }
   ```

### 5. **Notification Settings** - `src/utils/notificationSoundSettings.ts` (NEW)
   - **LocalStorage Key**: `ui_notification_sound_enabled`
   - **Methods**:
     - `isSoundEnabled()`: Returns current sound preference (default: true)
     - `enableSound()`: Enable sounds and dispatch event
     - `disableSound()`: Disable sounds and dispatch event
     - `toggleSound()`: Toggle and return new state
   - **Custom Event**: Emits `soundSettingChanged` event for component reactivity

### 6. **Alerts Component** - `src/components/alerts/AlertsFeed.tsx` (UPDATED)
   - **Features**:
     - Displays Redux notifications from store
     - Automatically plays sound for unseen notifications
     - Auto-removes notifications after 8 seconds
     - Responsive grid with avatars and event details
     - Color-coded by event type:
       - 🟢 Green: Person entered
       - 🔵 Blue: Person exited
       - 🟠 Orange: Unknown person events
   
   - **Components**:
     - Avatar display (MinIO URL or default User icon)
     - Event type and timestamp
     - Person info (name, role, department badges)
     - Message and camera location
     - Click-to-dismiss functionality

### 7. **Alerts Page** - `src/pages/Alerts/index.tsx` (UPDATED)
   - Added sound control button with toggle functionality
   - Button changes icon and text based on sound state:
     - 🔇 Enabled → Shows "Mute Sounds"
     - 🔕 Disabled → Shows "Enable Sounds"
   - Real-time state update via custom events

### 8. **Type Definitions** - `src/types/ws/camera-status.ts` (UPDATED)
   - Enhanced `UIEventNotificationPayload` with all required fields:
     - `id`: Employee or unknown ID
     - `name`: Person's name (null for unknowns)
     - `role`: "Employee" or "Unknown"
     - `department`: Department or null
     - `avatar`: MinIO URL or null
     - `cameraCode`: Camera identifier
     - `cameraName`: Human-readable camera name
     - `eventTs`: Event timestamp in milliseconds
     - `note`: Human-friendly message
     - `noteKey`: Event type enum

### 9. **Hooks Export** - `src/hooks/index.tsx` (UPDATED)
   - Added `useNotificationSound` to barrel exports

---

## 🔄 Data Flow

```
WebSocket Message (UI_EVENT_NOTIFICATION)
        ↓
cameraStatusWS.ts (handler)
        ↓
dispatch(addNotification(payload))
        ↓
Redux Store (uiEventNotification)
        ↓
AlertsFeed Component (subscribed via useAppSelector)
        ↓
1. Check if soundPlayed = false
2. Play sound via useNotificationSound
3. Mark sound as played
4. Display notification card
5. Auto-remove after 8 seconds
```

---

## 🎵 Sound Behavior

### Playing Sound
- **Trigger**: New notification added AND `soundPlayed === false`
- **Mechanism**: 
  1. Uses Web Audio API (primary)
  2. Falls back to HTML Audio API
  3. Audio pool prevents overlapping
  
### Preventing Duplicate Sounds
- Each notification has `soundPlayed` flag
- After sound plays, flag is set to `true` via `markSoundPlayed` action
- Prevents sound from replaying on re-renders

### Sound Control
- User can mute/enable via Alerts page button
- Settings persisted in localStorage
- State updates trigger re-renders via custom event

---

## 🚀 Event Types Supported

| noteKey | Type | Color | Use Case |
|---------|------|-------|----------|
| `person_entered` | Entry | 🟢 Green | Known employee entered |
| `person_exited` | Exit | 🔵 Blue | Known employee exited |
| `unknown_entered` | Alert | 🟠 Orange | Unknown person entered |
| `unknown_exited` | Alert | 🟠 Orange | Unknown person exited |

---

## 🎨 UI Features

### Notification Card
- **Avatar**: 60x60px image from MinIO (fallback: User icon)
- **Event Title**: Icons + text based on event type
- **Timestamp**: Event time in local timezone
- **Person Details**: Name, role, and department badges
- **Message**: The note from server
- **Camera**: Location info with emoji and code
- **Interactions**: Click to dismiss

### Recent Alerts Section
- Header: "Real-Time Alerts"
- Empty state: "No recent alerts"
- Smooth animations via Framer Motion
- Maximum 10 notifications visible

---

## ⚙️ Configuration

### Max Notifications
```typescript
const MAX_NOTIFICATIONS = 10; // in uiEventNotificationSlice.ts
```

### Auto-Removal Timer
```typescript
// 8 seconds before removal
if (now - notification.createdAt > 8000)
```

### Sound Frequency
```typescript
oscillator.frequency.value = 800; // Hz (edit in useNotificationSound.ts)
```

### Sound Duration
```typescript
oscillator.stop(audioContext.currentTime + 0.2); // 200ms
```

---

## 🧪 Testing the Feature

### 1. **Open Browser DevTools**
```javascript
// Check notifications in Redux DevTools or console
store.getState().uiEventNotification.notifications
```

### 2. **Simulate Notification**
Send WebSocket message from backend:
```json
{
  "type": "ui:event:notification",
  "event": "person_entered",
  "payload": {
    "id": "69ec59eea047aa9eff3065fa",
    "name": "John Doe",
    "role": "Employee",
    "department": "Engineering",
    "avatar": "https://minio.mssplonline.in/...",
    "cameraCode": "entry_1",
    "cameraName": "Entry Gate 1",
    "eventTs": 1779103803424,
    "note": "John Doe was detected entering at Entry Gate 1",
    "noteKey": "person_entered"
  }
}
```

### 3. **Test Sound**
- Navigate to Alerts page
- Toggle "Mute Sounds" button
- Check localStorage: `ui_notification_sound_enabled`
- Send test notification and listen

---

## 🔒 Error Handling

### Audio Context Fallback
```typescript
try {
  // Use Web Audio API
} catch (error) {
  // Fallback to HTML Audio API
}
```

### Graceful Degradation
- If sounds can't play: Silent failure with console warning
- Notifications still display even if sound fails

---

## 📦 Dependencies Used

- **Redux Toolkit**: State management
- **Framer Motion**: Animations (already in project)
- **React Hooks**: Component state and effects
- **Web Audio API**: Sound playback (browser native)
- **LocalStorage**: Persistent user preferences

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Sound not playing | Check browser autoplay policy and user gesture requirement |
| Duplicate sounds | Ensure `soundPlayed` flag is being set correctly |
| Notifications not appearing | Verify WebSocket message format matches payload structure |
| Old notifications not removing | Check if 8-second timer interval is running |
| Sound settings not persisting | Check localStorage is enabled in browser |

---

## 📝 Future Enhancements

1. **Sound Customization**: Allow users to choose different alert sounds
2. **Desktop Notifications**: Browser notification API integration
3. **Notification Categories**: Filter by event type
4. **History**: Keep full notification history (current: 10 visible)
5. **Persistence**: Save notifications to IndexedDB
6. **Themes**: Different notification styles per severity
7. **Batch Notifications**: Combine similar events

---

## ✅ Checklist

- [x] Redux slice created with proper actions
- [x] Redux store configured
- [x] WebSocket handler implemented
- [x] Sound hook created with fallback
- [x] Settings management utility
- [x] AlertsFeed component updated
- [x] Alerts page with mute button
- [x] Type definitions updated
- [x] No TypeScript errors
- [x] Components exported properly
- [x] Event auto-removal implemented
- [x] Sound prevention for duplicates
- [x] LocalStorage settings persistence
- [x] Smooth animations

All features are production-ready! 🚀
