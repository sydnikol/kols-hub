/**
 * NOTIFICATION ACTION
 * Send push notifications to device
 */

export interface NotificationParams {
  title: string;
  body: string;
  icon?: string;
  priority?: 'low' | 'normal' | 'high';
  vibrate?: boolean;
  sound?: boolean;
}

export async function execute(params: NotificationParams): Promise<void> {
  const {
    title,
    body,
    icon = '🔔',
    priority = 'normal',
    vibrate = true,
    sound = true,
  } = params;

  // Use Web Notifications API or Capacitor Local Notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon,
      vibrate: vibrate ? [200, 100, 200] : undefined,
      silent: !sound,
    });
  } else if ('Notification' in window) {
    // Request permission
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body, icon });
      }
    });
  }

  console.log(`🔔 Notification sent: ${title}`);
}
