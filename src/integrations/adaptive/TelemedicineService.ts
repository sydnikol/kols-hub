import axios from 'axios';
import { TelemedicineSession } from '../types';
import { config } from '../config';

export class TelemedicineService {
  private activeSessions: Map<string, TelemedicineSession>;

  constructor() {
    this.activeSessions = new Map();
  }

  async createSession(
    userId: string,
    providerId: string,
    scheduledTime: Date
  ): Promise<TelemedicineSession> {
    try {
      // Create Twilio Video room
      const roomName = `session-${userId}-${Date.now()}`;

      const room = await this.createTwilioRoom(roomName);

      const session: TelemedicineSession = {
        id: `session-${Date.now()}`,
        userId,
        providerId,
        status: 'scheduled',
        scheduledTime,
        roomName,
      };

      this.activeSessions.set(session.id, session);

      return session;
    } catch (error) {
      console.error('Error creating telemedicine session:', error);
      throw new Error('Failed to create telemedicine session');
    }
  }

  private async createTwilioRoom(roomName: string): Promise<any> {
    const { accountSid, authToken } = config.telemedicine.twilio;

    try {
      const response = await axios.post(
        `https://video.twilio.com/v1/Rooms`,
        new URLSearchParams({
          UniqueName: roomName,
          Type: 'group',
          RecordParticipantsOnConnect: 'true',
        }),
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Twilio room:', error);
      throw error;
    }
  }

  async generateAccessToken(
    sessionId: string,
    participantName: string
  ): Promise<string> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // In a real implementation, you would generate a Twilio Access Token
    // using the Twilio SDK with the appropriate grants
    const { apiKey, apiSecret, accountSid } = config.telemedicine.twilio;

    // Placeholder for token generation
    // Real implementation would use: twilio.jwt.AccessToken
    const token = `twilio-token-${participantName}-${Date.now()}`;

    return token;
  }

  async startSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'in-progress';
    this.activeSessions.set(sessionId, session);
  }

  async endSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'completed';
    session.duration = Date.now() - session.scheduledTime.getTime();

    // Complete the Twilio room
    if (session.roomName) {
      await this.completeTwilioRoom(session.roomName);
    }

    this.activeSessions.set(sessionId, session);
  }

  private async completeTwilioRoom(roomName: string): Promise<void> {
    const { accountSid, authToken } = config.telemedicine.twilio;

    try {
      await axios.post(
        `https://video.twilio.com/v1/Rooms/${roomName}`,
        new URLSearchParams({ Status: 'completed' }),
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
    } catch (error) {
      console.error('Error completing Twilio room:', error);
    }
  }

  getSession(sessionId: string): TelemedicineSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  getUserSessions(userId: string): TelemedicineSession[] {
    return Array.from(this.activeSessions.values()).filter(
      (session) => session.userId === userId
    );
  }
}
