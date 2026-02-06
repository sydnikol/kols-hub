import { google } from 'googleapis';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  reminders?: {
    minutes: number;
    method: 'email' | 'popup';
  }[];
}

export class GoogleCalendarIntegration {
  private calendar: any;
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  async authorize(code: string): Promise<void> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
    } catch (error) {
      console.error('Google Calendar authorization failed:', error);
      throw new Error('Failed to authorize with Google Calendar');
    }
  }

  async createMedicationReminder(
    medication: string,
    time: Date,
    frequency: 'daily' | 'weekly' | 'monthly'
  ): Promise<CalendarEvent> {
    const event = {
      summary: `💊 Take ${medication}`,
      description: `Medication reminder from Kol's Hub`,
      start: {
        dateTime: time.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(time.getTime() + 15 * 60000).toISOString(),
        timeZone: 'America/New_York',
      },
      recurrence: [this.getRecurrenceRule(frequency)],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
          { method: 'popup', minutes: 0 },
        ],
      },
      colorId: '10', // Green
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return this.parseEvent(response.data);
    } catch (error) {
      console.error('Error creating medication reminder:', error);
      throw new Error('Failed to create medication reminder');
    }
  }

  async createAppointment(
    provider: string,
    startTime: Date,
    duration: number,
    location?: string,
    notes?: string
  ): Promise<CalendarEvent> {
    const event = {
      summary: `🏥 Appointment with ${provider}`,
      description: notes || `Healthcare appointment from Kol's Hub`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(startTime.getTime() + duration * 60000).toISOString(),
        timeZone: 'America/New_York',
      },
      location,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 1440 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
      colorId: '11', // Red
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return this.parseEvent(response.data);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items.map(this.parseEvent);
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      return [];
    }
  }

  async createRitualReminder(
    ritual: string,
    time: Date,
    recurrence: string
  ): Promise<CalendarEvent> {
    const event = {
      summary: `🕯️ ${ritual}`,
      description: `Ritual reminder from Kol's Hub`,
      start: {
        dateTime: time.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(time.getTime() + 30 * 60000).toISOString(),
        timeZone: 'America/New_York',
      },
      recurrence: [recurrence],
      reminders: {
        useDefault: false,
        overrides: [{ method: 'popup', minutes: 5 }],
      },
      colorId: '9', // Purple
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return this.parseEvent(response.data);
    } catch (error) {
      console.error('Error creating ritual reminder:', error);
      throw new Error('Failed to create ritual reminder');
    }
  }

  private getRecurrenceRule(frequency: 'daily' | 'weekly' | 'monthly'): string {
    const rules: Record<string, string> = {
      daily: 'RRULE:FREQ=DAILY',
      weekly: 'RRULE:FREQ=WEEKLY',
      monthly: 'RRULE:FREQ=MONTHLY',
    };
    return rules[frequency];
  }

  private parseEvent(eventData: any): CalendarEvent {
    return {
      id: eventData.id,
      summary: eventData.summary,
      description: eventData.description,
      start: new Date(eventData.start.dateTime || eventData.start.date),
      end: new Date(eventData.end.dateTime || eventData.end.date),
      location: eventData.location,
    };
  }
}
