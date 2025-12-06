/**
 * Kol's Hub - Comprehensive Phone Integration Service
 * Connects to phone apps: Contacts, Calendar, Files, Camera, etc.
 * Cross-platform support for Android (Capacitor) and Web
 */

// Types
export interface PhoneContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  photo?: string;
  organization?: string;
  birthday?: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
  reminders?: number[];
  allDay?: boolean;
}

export interface DeviceInfo {
  platform: string;
  model: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  memoryUsed?: number;
  diskFree?: number;
  diskTotal?: number;
}

export interface FileInfo {
  name: string;
  path: string;
  type: string;
  size: number;
  modifiedTime: Date;
  uri?: string;
}

export interface PhoneIntegrationStatus {
  contacts: boolean;
  calendar: boolean;
  camera: boolean;
  files: boolean;
  location: boolean;
  notifications: boolean;
  share: boolean;
  clipboard: boolean;
  haptics: boolean;
}

// Check if running in Capacitor
const isCapacitor = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
};

// Main Phone Integration Service
class PhoneIntegrationService {
  private isNative: boolean;
  private capacitorModules: any = {};
  private syncCallbacks: Map<string, Function[]> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.isNative = isCapacitor();
    this.initializeService();
  }

  private async initializeService() {
    if (this.isNative && !this.initialized) {
      try {
        // Dynamically import Capacitor modules only on native platforms
        const [
          core,
          contacts,
          filesystem,
          camera,
          share,
          browser,
          clipboard,
          device,
          app,
          haptics,
          notifications
        ] = await Promise.allSettled([
          import('@capacitor/core'),
          import('@capacitor-community/contacts'),
          import('@capacitor/filesystem'),
          import('@capacitor/camera'),
          import('@capacitor/share'),
          import('@capacitor/browser'),
          import('@capacitor/clipboard'),
          import('@capacitor/device'),
          import('@capacitor/app'),
          import('@capacitor/haptics'),
          import('@capacitor/local-notifications'),
        ]);

        if (contacts.status === 'fulfilled') this.capacitorModules.Contacts = contacts.value.Contacts;
        if (filesystem.status === 'fulfilled') {
          this.capacitorModules.Filesystem = filesystem.value.Filesystem;
          this.capacitorModules.Directory = filesystem.value.Directory;
          this.capacitorModules.Encoding = filesystem.value.Encoding;
        }
        if (camera.status === 'fulfilled') {
          this.capacitorModules.Camera = camera.value.Camera;
          this.capacitorModules.CameraResultType = camera.value.CameraResultType;
          this.capacitorModules.CameraSource = camera.value.CameraSource;
        }
        if (share.status === 'fulfilled') this.capacitorModules.Share = share.value.Share;
        if (browser.status === 'fulfilled') this.capacitorModules.Browser = browser.value.Browser;
        if (clipboard.status === 'fulfilled') this.capacitorModules.Clipboard = clipboard.value.Clipboard;
        if (device.status === 'fulfilled') this.capacitorModules.Device = device.value.Device;
        if (app.status === 'fulfilled') this.capacitorModules.App = app.value.App;
        if (haptics.status === 'fulfilled') {
          this.capacitorModules.Haptics = haptics.value.Haptics;
          this.capacitorModules.ImpactStyle = haptics.value.ImpactStyle;
          this.capacitorModules.NotificationType = haptics.value.NotificationType;
        }
        if (notifications.status === 'fulfilled') {
          this.capacitorModules.LocalNotifications = notifications.value.LocalNotifications;
        }

        this.setupAppListeners();
      } catch (e) {
        console.log('Capacitor modules not available');
      }
      this.initialized = true;
    }
    console.log("Kol's Hub Phone Integration initialized");
  }

  // ==================== DEVICE INFO ====================
  async getDeviceInfo(): Promise<DeviceInfo> {
    try {
      if (this.isNative && this.capacitorModules.Device) {
        const info = await this.capacitorModules.Device.getInfo();
        const battery = await this.capacitorModules.Device.getBatteryInfo();

        return {
          platform: info.platform,
          model: info.model,
          osVersion: info.osVersion,
          manufacturer: info.manufacturer,
          isVirtual: info.isVirtual,
          batteryLevel: battery.batteryLevel,
          isCharging: battery.isCharging,
          memoryUsed: info.memUsed,
          diskFree: info.diskFree,
          diskTotal: info.diskTotal,
        };
      }

      // Web fallback
      const userAgent = navigator.userAgent;
      let platform = 'Web';
      let model = 'Browser';

      if (/Android/i.test(userAgent)) {
        platform = 'Android';
        model = 'Android Device';
      } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
        platform = 'iOS';
        model = 'iOS Device';
      } else if (/Windows/i.test(userAgent)) {
        platform = 'Windows';
        model = 'Windows PC';
      } else if (/Mac/i.test(userAgent)) {
        platform = 'macOS';
        model = 'Mac';
      }

      return {
        platform,
        model,
        osVersion: userAgent,
        manufacturer: 'Browser',
        isVirtual: false,
      };
    } catch (error) {
      console.error('Failed to get device info:', error);
      return {
        platform: 'Unknown',
        model: 'Unknown',
        osVersion: 'Unknown',
        manufacturer: 'Unknown',
        isVirtual: false,
      };
    }
  }

  // ==================== CONTACTS ====================
  async getContacts(): Promise<PhoneContact[]> {
    try {
      if (!this.isNative || !this.capacitorModules.Contacts) {
        return this.getWebStoredContacts();
      }

      const permission = await this.capacitorModules.Contacts.requestPermissions();
      if (permission.contacts !== 'granted') {
        console.warn('Contacts permission denied');
        return this.getWebStoredContacts();
      }

      const result = await this.capacitorModules.Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
          emails: true,
          organization: true,
          birthday: true,
          note: true,
          image: true,
        },
      });

      const contacts: PhoneContact[] = result.contacts.map((c: any) => ({
        id: c.contactId || String(Math.random()),
        name: c.name?.display || c.name?.given || 'Unknown',
        phone: c.phones?.[0]?.number,
        email: c.emails?.[0]?.address,
        photo: c.image?.base64String,
        organization: c.organization?.company,
        birthday: c.birthday?.year ? `${c.birthday.year}-${c.birthday.month}-${c.birthday.day}` : undefined,
        notes: c.note,
      }));

      await this.cacheContacts(contacts);
      return contacts;
    } catch (error) {
      console.error('Failed to get contacts:', error);
      return this.getWebStoredContacts();
    }
  }

  async searchContacts(query: string): Promise<PhoneContact[]> {
    const contacts = await this.getContacts();
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone?.includes(query) ||
      c.email?.toLowerCase().includes(lowerQuery)
    );
  }

  async createContact(contact: Partial<PhoneContact>): Promise<PhoneContact> {
    const newContact: PhoneContact = {
      id: String(Date.now()),
      name: contact.name || '',
      phone: contact.phone,
      email: contact.email,
      organization: contact.organization,
      notes: contact.notes,
    };

    const contacts = this.getWebStoredContacts();
    contacts.push(newContact);
    localStorage.setItem('kolshub_contacts_cache', JSON.stringify(contacts));
    return newContact;
  }

  private async cacheContacts(contacts: PhoneContact[]) {
    localStorage.setItem('kolshub_contacts_cache', JSON.stringify(contacts));
  }

  private getWebStoredContacts(): PhoneContact[] {
    const cached = localStorage.getItem('kolshub_contacts_cache');
    return cached ? JSON.parse(cached) : [];
  }

  // ==================== CALENDAR ====================
  async getCalendarEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const start = startDate || new Date();
    const end = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    try {
      const events = await this.fetchGoogleCalendarEvents(start, end);
      await this.cacheCalendarEvents(events);
      return events;
    } catch (error) {
      console.error('Failed to get calendar events:', error);
      return this.getWebCalendarEvents(start, end);
    }
  }

  async createCalendarEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      id: String(Date.now()),
      title: event.title || 'New Event',
      startDate: event.startDate || new Date(),
      endDate: event.endDate || new Date(Date.now() + 60 * 60 * 1000),
      location: event.location,
      description: event.description,
      reminders: event.reminders || [30],
      allDay: event.allDay || false,
    };

    await this.addToGoogleCalendar(newEvent);

    const events = this.getWebCalendarEvents(new Date(0), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    events.push(newEvent);
    localStorage.setItem('kolshub_calendar_cache', JSON.stringify(events));

    if (newEvent.reminders && newEvent.reminders.length > 0) {
      await this.scheduleEventReminder(newEvent);
    }

    return newEvent;
  }

  private async fetchGoogleCalendarEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    const token = localStorage.getItem('google_access_token');
    if (!token) return this.getWebCalendarEvents(start, end);

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start.toISOString()}&timeMax=${end.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Failed to fetch calendar');

      const data = await response.json();
      return data.items?.map((item: any) => ({
        id: item.id,
        title: item.summary,
        startDate: new Date(item.start?.dateTime || item.start?.date),
        endDate: new Date(item.end?.dateTime || item.end?.date),
        location: item.location,
        description: item.description,
        allDay: !!item.start?.date,
      })) || [];
    } catch (error) {
      console.error('Google Calendar fetch failed:', error);
      return this.getWebCalendarEvents(start, end);
    }
  }

  private async addToGoogleCalendar(event: CalendarEvent) {
    const token = localStorage.getItem('google_access_token');
    if (!token) return;

    try {
      await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          start: event.allDay
            ? { date: event.startDate.toISOString().split('T')[0] }
            : { dateTime: event.startDate.toISOString() },
          end: event.allDay
            ? { date: event.endDate.toISOString().split('T')[0] }
            : { dateTime: event.endDate.toISOString() },
          location: event.location,
          description: event.description,
        }),
      });
    } catch (error) {
      console.error('Failed to add to Google Calendar:', error);
    }
  }

  private getWebCalendarEvents(start: Date, end: Date): CalendarEvent[] {
    const cached = localStorage.getItem('kolshub_calendar_cache');
    if (!cached) return [];

    const events: CalendarEvent[] = JSON.parse(cached);
    return events.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate >= start && eventDate <= end;
    });
  }

  private async cacheCalendarEvents(events: CalendarEvent[]) {
    localStorage.setItem('kolshub_calendar_cache', JSON.stringify(events));
  }

  private async scheduleEventReminder(event: CalendarEvent) {
    if (!this.isNative || !this.capacitorModules.LocalNotifications) return;

    try {
      const reminderMinutes = event.reminders?.[0] || 30;
      const triggerTime = new Date(event.startDate.getTime() - reminderMinutes * 60 * 1000);

      await this.capacitorModules.LocalNotifications.schedule({
        notifications: [{
          id: parseInt(event.id) || Date.now(),
          title: `Reminder: ${event.title}`,
          body: event.description || `Event starting in ${reminderMinutes} minutes`,
          schedule: { at: triggerTime },
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#7c3aed',
        }],
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  // ==================== CAMERA & PHOTOS ====================
  async takePhoto(): Promise<string | null> {
    try {
      if (!this.isNative || !this.capacitorModules.Camera) {
        return await this.webFileInput('image/*');
      }

      const image = await this.capacitorModules.Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: this.capacitorModules.CameraResultType.DataUrl,
        source: this.capacitorModules.CameraSource.Camera,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Failed to take photo:', error);
      return null;
    }
  }

  async pickFromGallery(): Promise<string | null> {
    try {
      if (!this.isNative || !this.capacitorModules.Camera) {
        return await this.webFileInput('image/*');
      }

      const image = await this.capacitorModules.Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: this.capacitorModules.CameraResultType.DataUrl,
        source: this.capacitorModules.CameraSource.Photos,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Failed to pick from gallery:', error);
      return null;
    }
  }

  private webFileInput(accept: string): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  // ==================== FILES ====================
  async saveFile(filename: string, data: string): Promise<string> {
    try {
      if (!this.isNative || !this.capacitorModules.Filesystem) {
        localStorage.setItem(`kolshub_file_${filename}`, data);
        return filename;
      }

      const result = await this.capacitorModules.Filesystem.writeFile({
        path: filename,
        data,
        directory: this.capacitorModules.Directory.Documents,
        encoding: this.capacitorModules.Encoding.UTF8,
      });

      return result.uri;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  async readFile(filename: string): Promise<string> {
    try {
      if (!this.isNative || !this.capacitorModules.Filesystem) {
        return localStorage.getItem(`kolshub_file_${filename}`) || '';
      }

      const result = await this.capacitorModules.Filesystem.readFile({
        path: filename,
        directory: this.capacitorModules.Directory.Documents,
        encoding: this.capacitorModules.Encoding.UTF8,
      });

      return typeof result.data === 'string' ? result.data : '';
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  async listFiles(): Promise<FileInfo[]> {
    try {
      if (!this.isNative || !this.capacitorModules.Filesystem) {
        const files: FileInfo[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('kolshub_file_')) {
            files.push({
              name: key.replace('kolshub_file_', ''),
              path: key,
              type: 'text/plain',
              size: localStorage.getItem(key)?.length || 0,
              modifiedTime: new Date(),
            });
          }
        }
        return files;
      }

      const result = await this.capacitorModules.Filesystem.readdir({
        path: '',
        directory: this.capacitorModules.Directory.Documents,
      });

      return result.files.map((f: any) => ({
        name: f.name,
        path: f.uri || f.name,
        type: f.type,
        size: f.size,
        modifiedTime: new Date(f.mtime || Date.now()),
        uri: f.uri,
      }));
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      if (!this.isNative || !this.capacitorModules.Filesystem) {
        localStorage.removeItem(`kolshub_file_${filename}`);
        return;
      }

      await this.capacitorModules.Filesystem.deleteFile({
        path: filename,
        directory: this.capacitorModules.Directory.Documents,
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  // ==================== SHARING ====================
  async share(options: { title?: string; text?: string; url?: string }): Promise<void> {
    try {
      if (!this.isNative || !this.capacitorModules.Share) {
        if (navigator.share) {
          await navigator.share({
            title: options.title,
            text: options.text,
            url: options.url,
          });
        } else {
          await this.copyToClipboard(options.url || options.text || '');
          alert('Link copied to clipboard!');
        }
        return;
      }

      await this.capacitorModules.Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: "Share from Kol's Hub",
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  // ==================== CLIPBOARD ====================
  async copyToClipboard(text: string): Promise<void> {
    try {
      if (!this.isNative || !this.capacitorModules.Clipboard) {
        await navigator.clipboard.writeText(text);
        return;
      }

      await this.capacitorModules.Clipboard.write({ string: text });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  async readFromClipboard(): Promise<string> {
    try {
      if (!this.isNative || !this.capacitorModules.Clipboard) {
        return await navigator.clipboard.readText();
      }

      const result = await this.capacitorModules.Clipboard.read();
      return result.value;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      return '';
    }
  }

  // ==================== BROWSER ====================
  async openInBrowser(url: string): Promise<void> {
    try {
      if (!this.isNative || !this.capacitorModules.Browser) {
        window.open(url, '_blank');
        return;
      }

      await this.capacitorModules.Browser.open({ url });
    } catch (error) {
      console.error('Failed to open browser:', error);
    }
  }

  // ==================== HAPTICS ====================
  async vibrate(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    if (!this.isNative || !this.capacitorModules.Haptics) {
      navigator.vibrate?.(style === 'light' ? 50 : style === 'medium' ? 100 : 200);
      return;
    }

    try {
      const impactStyle = style === 'light' ? this.capacitorModules.ImpactStyle.Light
        : style === 'medium' ? this.capacitorModules.ImpactStyle.Medium
        : this.capacitorModules.ImpactStyle.Heavy;
      await this.capacitorModules.Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Haptics failed:', error);
    }
  }

  async notificationHaptic(type: 'success' | 'warning' | 'error' = 'success'): Promise<void> {
    if (!this.isNative || !this.capacitorModules.Haptics) return;

    try {
      const notificationType = type === 'success' ? this.capacitorModules.NotificationType.Success
        : type === 'warning' ? this.capacitorModules.NotificationType.Warning
        : this.capacitorModules.NotificationType.Error;
      await this.capacitorModules.Haptics.notification({ type: notificationType });
    } catch (error) {
      console.error('Notification haptic failed:', error);
    }
  }

  // ==================== NOTIFICATIONS ====================
  async scheduleNotification(options: {
    title: string;
    body: string;
    id?: number;
    schedule?: Date;
  }): Promise<void> {
    try {
      if (!this.isNative || !this.capacitorModules.LocalNotifications) {
        // Use browser notifications
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(options.title, { body: options.body });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification(options.title, { body: options.body });
          }
        }
        return;
      }

      const permission = await this.capacitorModules.LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }

      await this.capacitorModules.LocalNotifications.schedule({
        notifications: [{
          id: options.id || Date.now(),
          title: options.title,
          body: options.body,
          schedule: options.schedule ? { at: options.schedule } : undefined,
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#7c3aed',
        }],
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  async cancelNotification(id: number): Promise<void> {
    try {
      if (this.capacitorModules.LocalNotifications) {
        await this.capacitorModules.LocalNotifications.cancel({ notifications: [{ id }] });
      }
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  // ==================== APP STATE ====================
  private setupAppListeners() {
    if (!this.isNative || !this.capacitorModules.App) return;

    this.capacitorModules.App.addListener('appStateChange', ({ isActive }: any) => {
      console.log("Kol's Hub app state:", isActive ? 'active' : 'background');
      this.triggerSyncCallbacks('appState', { isActive });
    });

    this.capacitorModules.App.addListener('backButton', () => {
      console.log("Kol's Hub back button pressed");
      this.triggerSyncCallbacks('backButton', {});
    });

    this.capacitorModules.App.addListener('appUrlOpen', ({ url }: any) => {
      console.log("Kol's Hub opened with URL:", url);
      this.triggerSyncCallbacks('urlOpen', { url });
    });
  }

  // ==================== PERMISSIONS ====================
  async checkAllPermissions(): Promise<PhoneIntegrationStatus> {
    const status: PhoneIntegrationStatus = {
      contacts: false,
      calendar: false,
      camera: false,
      files: false,
      location: false,
      notifications: false,
      share: true,
      clipboard: true,
      haptics: true,
    };

    if (!this.isNative) return status;

    try {
      if (this.capacitorModules.Contacts) {
        const contactsPerm = await this.capacitorModules.Contacts.requestPermissions();
        status.contacts = contactsPerm.contacts === 'granted';
      }

      if (this.capacitorModules.LocalNotifications) {
        const notifPerm = await this.capacitorModules.LocalNotifications.requestPermissions();
        status.notifications = notifPerm.display === 'granted';
      }

      status.camera = true;
      status.files = true;
    } catch (error) {
      console.error('Permission check failed:', error);
    }

    return status;
  }

  // ==================== SYNC CALLBACKS ====================
  onSync(event: string, callback: Function): void {
    if (!this.syncCallbacks.has(event)) {
      this.syncCallbacks.set(event, []);
    }
    this.syncCallbacks.get(event)!.push(callback);
  }

  private triggerSyncCallbacks(event: string, data: any): void {
    const callbacks = this.syncCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  // ==================== UTILITY ====================
  isNativePlatform(): boolean {
    return this.isNative;
  }

  getPlatform(): string {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      return (window as any).Capacitor.getPlatform();
    }
    return 'web';
  }
}

// Export singleton
export const phoneIntegration = new PhoneIntegrationService();
export default phoneIntegration;
