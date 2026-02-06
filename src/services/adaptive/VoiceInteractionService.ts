import { EventEmitter } from 'events';
import { VoiceInteractionConfig } from '../types';
import { config } from '../config';
import axios from 'axios';

export class VoiceInteractionService extends EventEmitter {
  private activeStreams: Map<string, any>;
  private voiceConfigs: Map<string, VoiceInteractionConfig>;

  constructor() {
    super();
    this.activeStreams = new Map();
    this.voiceConfigs = new Map();
  }

  async startVoiceSession(userId: string, voiceConfig: VoiceInteractionConfig): Promise<void> {
    if (this.activeStreams.has(userId)) {
      throw new Error('Voice session already active for this user');
    }

    this.voiceConfigs.set(userId, voiceConfig);
    this.activeStreams.set(userId, { active: true });

    this.emit('session-started', { userId });
  }

  async stopVoiceSession(userId: string): Promise<void> {
    const stream = this.activeStreams.get(userId);
    if (stream) {
      stream.active = false;
      this.activeStreams.delete(userId);
      this.voiceConfigs.delete(userId);
      this.emit('session-stopped', { userId });
    }
  }

  async transcribeAudio(userId: string, audioBuffer: Buffer): Promise<string> {
    if (!config.voice.deepgramApiKey) {
      throw new Error('Deepgram API key not configured');
    }

    try {
      // Using Deepgram for speech-to-text
      const response = await axios.post(
        'https://api.deepgram.com/v1/listen',
        audioBuffer,
        {
          headers: {
            'Authorization': `Token ${config.voice.deepgramApiKey}`,
            'Content-Type': 'audio/wav',
          },
          params: {
            punctuate: true,
            language: this.voiceConfigs.get(userId)?.language || 'en',
          },
        }
      );

      const transcript = response.data.results?.channels[0]?.alternatives[0]?.transcript || '';
      this.emit('transcription', { userId, transcript });

      return transcript;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async synthesizeSpeech(text: string, voiceId?: string): Promise<Buffer> {
    if (!config.voice.elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      // Using ElevenLabs for text-to-speech
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'default'}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': config.voice.elevenLabsApiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw new Error('Failed to synthesize speech');
    }
  }

  isSessionActive(userId: string): boolean {
    return this.activeStreams.has(userId);
  }

  getActiveVoiceConfig(userId: string): VoiceInteractionConfig | undefined {
    return this.voiceConfigs.get(userId);
  }
}
