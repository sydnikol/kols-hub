/**
 * Google Calendar Service
 * Handles calendar synchronization and event management
 * Uses the comprehensive googleSyncService for authentication
 */

import { googleSyncService } from './googleSyncService';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  attendees?: string[];
  reminders?: CalendarReminder[];
  colorId?: string;
  recurrence?: string[];
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface CalendarReminder {
  method: 'email' | 'popup';
  minutes: number;
}

export interface Calendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface CalendarSyncOptions {
  calendarId?: string;
  timeMin?: Date;
  timeMax?: Date;
  maxResults?: number;
  showDeleted?: boolean;
}

class GoogleCalendarService {
  /**
   * Initialize the calendar service
   */
  async initialize(): Promise<void> {
    await googleSyncService.initialize();
  }

  /**
   * Check if calendar is connected
   */
  async isConnected(): Promise<boolean> {
    return await googleSyncService.isAuthenticated();
  }

  /**
   * Connect to Google Calendar (start OAuth flow)
   */
  async connect(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.initialize();
      const result = await googleSyncService.authenticate();
      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Disconnect from Google Calendar
   */
  async disconnect(): Promise<void> {
    await googleSyncService.signOut();
  }

  /**
   * Get list of calendars
   */
  async getCalendars(): Promise<Calendar[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Calendar. Please authenticate first.');
      }

      const calendars = await googleSyncService.getCalendars();
      return calendars.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        primary: cal.primary,
        backgroundColor: cal.backgroundColor,
        foregroundColor: cal.foregroundColor,
      }));
    } catch (error) {
      console.error('Failed to get calendars:', error);
      throw error;
    }
  }

  /**
   * Sync calendar events
   */
  async syncEvents(options: CalendarSyncOptions = {}): Promise<CalendarEvent[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Calendar. Please authenticate first.');
      }

      const events = await googleSyncService.syncCalendarEvents({
        calendarId: options.calendarId || 'primary',
        timeMin: options.timeMin || new Date(),
        timeMax: options.timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        maxResults: options.maxResults || 50,
      });

      return events.map(event => this.mapGoogleEventToCalendarEvent(event));
    } catch (error) {
      console.error('Failed to sync calendar events:', error);
      throw error;
    }
  }

  /**
   * Get events for today
   */
  async getTodayEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.syncEvents({
      timeMin: today,
      timeMax: tomorrow,
    });
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date();
    const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return await this.syncEvents({
      timeMin: now,
      timeMax: future,
    });
  }

  /**
   * Create a new calendar event
   */
  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Calendar. Please authenticate first.');
      }

      const createdEvent = await googleSyncService.createCalendarEvent({
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
        reminders: event.reminders,
      });

      return this.mapGoogleEventToCalendarEvent(createdEvent);
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw error;
    }
  }

  /**
   * Create a medication reminder event
   */
  async createMedicationReminder(options: {
    medicationName: string;
    time: Date;
    dosage?: string;
    recurrence?: 'daily' | 'weekly' | 'monthly';
  }): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      summary: `💊 Take ${options.medicationName}`,
      description: options.dosage ? `Dosage: ${options.dosage}` : undefined,
      start: options.time,
      end: new Date(options.time.getTime() + 15 * 60 * 1000), // 15 minutes
      reminders: [
        { method: 'popup', minutes: 0 },
        { method: 'popup', minutes: 15 },
      ],
    };

    // Add recurrence if specified
    if (options.recurrence) {
      const recurrenceRules: Record<string, string> = {
        daily: 'RRULE:FREQ=DAILY',
        weekly: 'RRULE:FREQ=WEEKLY',
        monthly: 'RRULE:FREQ=MONTHLY',
      };
      event.recurrence = [recurrenceRules[options.recurrence]];
    }

    return await this.createEvent(event);
  }

  /**
   * Create a health check-in reminder
   */
  async createHealthCheckIn(options: {
    title: string;
    time: Date;
    description?: string;
    recurrence?: 'daily' | 'weekly' | 'monthly';
  }): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      summary: `🏥 ${options.title}`,
      description: options.description,
      start: options.time,
      end: new Date(options.time.getTime() + 30 * 60 * 1000), // 30 minutes
      reminders: [
        { method: 'popup', minutes: 0 },
        { method: 'popup', minutes: 30 },
      ],
    };

    if (options.recurrence) {
      const recurrenceRules: Record<string, string> = {
        daily: 'RRULE:FREQ=DAILY',
        weekly: 'RRULE:FREQ=WEEKLY',
        monthly: 'RRULE:FREQ=MONTHLY',
      };
      event.recurrence = [recurrenceRules[options.recurrence]];
    }

    return await this.createEvent(event);
  }

  /**
   * Create a passive income review reminder
   */
  async createPassiveIncomeReview(options: {
    time: Date;
    recurrence?: 'daily' | 'weekly' | 'monthly';
  }): Promise<CalendarEvent> {
    return await this.createEvent({
      summary: '💰 Passive Income Review',
      description: 'Check AI passive income performance and automation status',
      start: options.time,
      end: new Date(options.time.getTime() + 30 * 60 * 1000),
      reminders: [
        { method: 'popup', minutes: 0 },
      ],
      recurrence: options.recurrence ? [`RRULE:FREQ=${options.recurrence.toUpperCase()}`] : undefined,
    });
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Calendar. Please authenticate first.');
      }

      // Note: This would need to be implemented in googleSyncService
      // For now, we'll throw an error
      throw new Error('Update event not yet implemented in sync service');
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string, calendarId: string = 'primary'): Promise<void> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Calendar. Please authenticate first.');
      }

      // Note: This would need to be implemented in googleSyncService
      // For now, we'll throw an error
      throw new Error('Delete event not yet implemented in sync service');
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      throw error;
    }
  }

  /**
   * Search for events
   */
  async searchEvents(query: string, options: CalendarSyncOptions = {}): Promise<CalendarEvent[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Calendar. Please authenticate first.');
      }

      // Get events and filter by query
      const events = await this.syncEvents(options);

      const lowercaseQuery = query.toLowerCase();
      return events.filter(event =>
        event.summary.toLowerCase().includes(lowercaseQuery) ||
        event.description?.toLowerCase().includes(lowercaseQuery) ||
        event.location?.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Failed to search calendar events:', error);
      throw error;
    }
  }

  /**
   * Get events by date range
   */
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return await this.syncEvents({
      timeMin: startDate,
      timeMax: endDate,
    });
  }

  /**
   * Map Google Calendar event to our CalendarEvent format
   */
  private mapGoogleEventToCalendarEvent(googleEvent: any): CalendarEvent {
    return {
      id: googleEvent.id,
      summary: googleEvent.summary || 'No title',
      description: googleEvent.description,
      location: googleEvent.location,
      start: new Date(googleEvent.start.dateTime || googleEvent.start.date),
      end: new Date(googleEvent.end.dateTime || googleEvent.end.date),
      attendees: googleEvent.attendees?.map((a: any) => a.email) || [],
      reminders: googleEvent.reminders?.overrides?.map((r: any) => ({
        method: r.method,
        minutes: r.minutes,
      })) || [],
      colorId: googleEvent.colorId,
      recurrence: googleEvent.recurrence,
      status: googleEvent.status,
    };
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{ synced: boolean; lastSynced?: Date }> {
    const status = await googleSyncService.getSyncStatus();
    return {
      synced: status.calendar,
      lastSynced: status.lastSynced.calendar,
    };
  }

  /**
   * Batch create events (useful for importing schedules)
   */
  async batchCreateEvents(events: CalendarEvent[]): Promise<CalendarEvent[]> {
    const createdEvents: CalendarEvent[] = [];

    for (const event of events) {
      try {
        const created = await this.createEvent(event);
        createdEvents.push(created);
      } catch (error) {
        console.error('Failed to create event:', event.summary, error);
      }
    }

    return createdEvents;
  }

  /**
   * Create events from medication schedule
   */
  async createMedicationSchedule(medications: Array<{
    name: string;
    times: Date[];
    dosage?: string;
    recurrence?: 'daily' | 'weekly' | 'monthly';
  }>): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];

    for (const med of medications) {
      for (const time of med.times) {
        try {
          const event = await this.createMedicationReminder({
            medicationName: med.name,
            time,
            dosage: med.dosage,
            recurrence: med.recurrence,
          });
          events.push(event);
        } catch (error) {
          console.error(`Failed to create reminder for ${med.name}:`, error);
        }
      }
    }

    return events;
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();
