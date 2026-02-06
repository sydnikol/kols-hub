import { BiometricAuth } from '../types';
import * as crypto from 'crypto';

export class BiometricAuthService {
  private userBiometrics: Map<string, BiometricAuth>;
  private enrolledData: Map<string, Buffer>;

  constructor() {
    this.userBiometrics = new Map();
    this.enrolledData = new Map();
  }

  async enrollBiometric(
    userId: string,
    type: 'fingerprint' | 'face' | 'voice',
    biometricData: Buffer,
    deviceId?: string
  ): Promise<void> {
    // Hash the biometric data for secure storage
    const hash = crypto.createHash('sha256').update(biometricData).digest();

    this.enrolledData.set(`${userId}-${type}`, hash);

    const biometricAuth: BiometricAuth = {
      type,
      enabled: true,
      deviceId,
    };

    this.userBiometrics.set(userId, biometricAuth);
  }

  async verifyBiometric(
    userId: string,
    type: 'fingerprint' | 'face' | 'voice',
    biometricData: Buffer
  ): Promise<boolean> {
    const storedHash = this.enrolledData.get(`${userId}-${type}`);
    if (!storedHash) {
      throw new Error('Biometric not enrolled for this user');
    }

    // Hash the provided biometric data
    const providedHash = crypto.createHash('sha256').update(biometricData).digest();

    // Compare hashes
    return crypto.timingSafeEqual(storedHash, providedHash);
  }

  async enableBiometric(userId: string): Promise<void> {
    const biometric = this.userBiometrics.get(userId);
    if (!biometric) {
      throw new Error('No biometric enrolled for this user');
    }

    biometric.enabled = true;
    this.userBiometrics.set(userId, biometric);
  }

  async disableBiometric(userId: string): Promise<void> {
    const biometric = this.userBiometrics.get(userId);
    if (!biometric) {
      throw new Error('No biometric enrolled for this user');
    }

    biometric.enabled = false;
    this.userBiometrics.set(userId, biometric);
  }

  async removeBiometric(userId: string, type: 'fingerprint' | 'face' | 'voice'): Promise<void> {
    this.enrolledData.delete(`${userId}-${type}`);
    this.userBiometrics.delete(userId);
  }

  isBiometricEnabled(userId: string): boolean {
    const biometric = this.userBiometrics.get(userId);
    return biometric?.enabled || false;
  }

  getBiometricInfo(userId: string): BiometricAuth | undefined {
    return this.userBiometrics.get(userId);
  }

  // For voice biometrics, you would typically use a service like Azure Speaker Recognition
  async enrollVoiceBiometric(userId: string, audioSamples: Buffer[]): Promise<void> {
    // In production, this would create a voice profile with a service like:
    // - Azure Cognitive Services Speaker Recognition
    // - AWS Connect Voice ID
    // - Google Cloud Speaker ID

    // For now, we'll simulate enrollment
    const combinedAudio = Buffer.concat(audioSamples);
    await this.enrollBiometric(userId, 'voice', combinedAudio);
  }

  async verifyVoiceBiometric(userId: string, audioSample: Buffer): Promise<boolean> {
    return this.verifyBiometric(userId, 'voice', audioSample);
  }
}
