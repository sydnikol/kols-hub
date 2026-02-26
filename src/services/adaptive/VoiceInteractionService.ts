import { EventEmitter } from 'events';
import { VoiceInteractionConfig } from '../types';
import { config } from '../config';

export class VoiceInteractionService extends EventEmitter {
  private activeStreams: Map<string, any>;
  private voiceConfigs: Map<string, VoiceInteractionConfig>;
  private deepgramApiKey: string;
  private elevenLabsApiKey: string;

  constructor() {
    super();
    this.activeStreams = new Map();
    this.voiceConfigs = new Map();
    // Get API keys from Vite env vars or localStorage
    this.deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY || localStorage.getItem('deepgram_api_key') || '';
    this.elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || localStorage.getItem('elevenlabs_api_key') || '';
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
    if (!this.deepgramApiKey) {
      console.error('Deepgram API key not configured. Set VITE_DEEPGRAM_API_KEY environment variable.');
      throw new Error('Deepgram API key not configured');
    }

    try {
      // Using Deepgram for speech-to-text with fetch
      const response = await fetch(
        'https://api.deepgram.com/v1/listen?punctuate=true&language=' +
        encodeURIComponent(this.voiceConfigs.get(userId)?.language || 'en'),
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${this.deepgramApiKey}`,
            'Content-Type': 'audio/wav',
          },
          body: audioBuffer
        }
      );

      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.statusText}`);
      }

      const data = await response.json();
      const transcript = data.results?.channels[0]?.alternatives[0]?.transcript || '';
      this.emit('transcription', { userId, transcript });

      return transcript;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async synthesizeSpeech(text: string, voiceId?: string): Promise<Buffer> {
    if (!this.elevenLabsApiKey) {
      console.error('ElevenLabs API key not configured. Set VITE_ELEVENLABS_API_KEY environment variable.');
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      // Using ElevenLabs for text-to-speech with fetch
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'default'}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.elevenLabsApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          })
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer);
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
