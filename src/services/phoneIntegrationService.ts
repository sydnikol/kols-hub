/**
 * Phone Integration Service
 * Handles native contacts, calls, and SMS via Capacitor plugins
 */

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// Dynamic import for optional mobile plugin
let Contacts: any = null;
import {
  Contact,
  CareTeamContact,
  ContactPermissionStatus,
  ContactSearchOptions,
  CallOptions,
  SMSOptions,
  ContactSyncResult,
  EmergencyContact,
  EMERGENCY_NUMBERS,
  ContactRole,
  QuickAction
} from '../types/phoneContacts';
import { db } from '../utils/database';

class PhoneIntegrationService {
  private platform: 'ios' | 'android' | 'web';

  constructor() {
    this.platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';
  }

  /**
   * Check if running on native platform
   */
  isNativePlatform(): boolean {
    return this.platform === 'ios' || this.platform === 'android';
  }

  /**
   * Load Contacts plugin dynamically (mobile only)
   */
  private async loadContactsPlugin() {
    if (!Contacts && this.isNativePlatform()) {
      try {
        const module = await import('@capacitor-community/contacts');
        Contacts = module.Contacts;
      } catch (e) {
        console.warn('Contacts plugin not available');
      }
    }
    return Contacts;
  }

  /**
   * Request contacts permission
   */
  async requestContactsPermission(): Promise<ContactPermissionStatus> {
    if (!this.isNativePlatform()) {
      return {
        granted: false,
        canRequest: false,
        platform: 'web'
      };
    }

    await this.loadContactsPlugin();
    if (!Contacts) {
      return {
        granted: false,
        canRequest: false,
        platform: this.platform,
        error: 'Contacts plugin not available'
      };
    }

    try {
      const permission = await Contacts.requestPermissions();

      return {
        granted: permission.granted === true,
        canRequest: true,
        platform: this.platform
      };
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return {
        granted: false,
        canRequest: false,
        platform: this.platform
      };
    }
  }

  /**
   * Check contacts permission status
   */
  async checkContactsPermission(): Promise<ContactPermissionStatus> {
    if (!this.isNativePlatform()) {
      return {
        granted: false,
        canRequest: false,
        platform: 'web'
      };
    }

    try {
      const permission = await Contacts.checkPermissions();

      return {
        granted: permission.granted === true,
        canRequest: true,
        platform: this.platform
      };
    } catch (error) {
      console.error('Error checking contacts permission:', error);
      return {
        granted: false,
        canRequest: false,
        platform: this.platform
      };
    }
  }

  /**
   * Get all phone contacts
   */
  async getPhoneContacts(): Promise<Contact[]> {
    if (!this.isNativePlatform()) {
      console.warn('Contacts not available on web platform');
      return [];
    }

    try {
      const permission = await this.checkContactsPermission();

      if (!permission.granted) {
        const requested = await this.requestContactsPermission();
        if (!requested.granted) {
          throw new Error('Contacts permission denied');
        }
      }

      const result = await Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
          emails: true,
          organization: true,
          birthday: true,
          note: true,
          image: true
        }
      });

      return result.contacts as Contact[];
    } catch (error) {
      console.error('Error getting phone contacts:', error);
      throw error;
    }
  }

  /**
   * Search phone contacts
   */
  async searchPhoneContacts(query: string): Promise<Contact[]> {
    const allContacts = await this.getPhoneContacts();

    if (!query) return allContacts;

    const normalizedQuery = query.toLowerCase();

    return allContacts.filter(contact => {
      const nameMatch =
        contact.displayName?.toLowerCase().includes(normalizedQuery) ||
        contact.firstName?.toLowerCase().includes(normalizedQuery) ||
        contact.lastName?.toLowerCase().includes(normalizedQuery);

      const phoneMatch = contact.phoneNumbers?.some(phone =>
        phone.number.includes(query)
      );

      const emailMatch = contact.emails?.some(email =>
        email.address.toLowerCase().includes(normalizedQuery)
      );

      return nameMatch || phoneMatch || emailMatch;
    });
  }

  /**
   * Make a phone call
   */
  async makeCall(options: CallOptions): Promise<void> {
    const { phoneNumber, contactName } = options;

    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Remove non-numeric characters except + for international numbers
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    try {
      // Use tel: URL scheme which works on all platforms
      const telUrl = `tel:${cleanNumber}`;

      if (this.isNativePlatform()) {
        // Open phone dialer on native platforms
        await App.openUrl({ url: telUrl });

        // Log the call attempt
        await this.logCallAttempt(cleanNumber, contactName);
      } else {
        // On web, open in new window
        window.open(telUrl, '_blank');
      }
    } catch (error) {
      console.error('Error making call:', error);
      throw new Error(`Failed to initiate call: ${error}`);
    }
  }

  /**
   * Send SMS
   */
  async sendSMS(options: SMSOptions): Promise<void> {
    const { phoneNumber, message, contactName } = options;

    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    try {
      // Use sms: URL scheme
      let smsUrl = `sms:${cleanNumber}`;

      // Add message body if provided
      if (message) {
        const separator = this.platform === 'ios' ? '&' : '?';
        smsUrl += `${separator}body=${encodeURIComponent(message)}`;
      }

      if (this.isNativePlatform()) {
        await App.openUrl({ url: smsUrl });

        // Log the SMS attempt
        await this.logSMSAttempt(cleanNumber, contactName);
      } else {
        window.open(smsUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to open SMS: ${error}`);
    }
  }

  /**
   * Import phone contact to care team
   */
  async importContactToCareTeam(
    contact: Contact,
    role?: ContactRole,
    tags?: string[]
  ): Promise<CareTeamContact> {
    const careTeamContact: CareTeamContact = {
      ...contact,
      careTeamId: `care-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: role || 'other',
      tags: tags || [],
      isEmergency: false,
      isFavorite: false,
      syncedFromPhone: true,
      lastContacted: new Date()
    };

    try {
      // Store in IndexedDB
      await db.careTeam.add(careTeamContact as any);

      return careTeamContact;
    } catch (error) {
      console.error('Error importing contact to care team:', error);
      throw error;
    }
  }

  /**
   * Sync multiple contacts to care team
   */
  async syncContactsToCareTeam(
    contacts: Contact[],
    defaultRole?: ContactRole
  ): Promise<ContactSyncResult> {
    const result: ContactSyncResult = {
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (const contact of contacts) {
      try {
        // Check if contact already exists
        const existing = await db.careTeam
          .where('contactId')
          .equals(contact.contactId)
          .first();

        if (existing) {
          // Update existing contact
          await db.careTeam.update(existing.id!, {
            ...contact,
            syncedFromPhone: true
          });
          result.updated++;
        } else {
          // Import new contact
          await this.importContactToCareTeam(contact, defaultRole);
          result.imported++;
        }
      } catch (error) {
        result.skipped++;
        result.errors.push(
          `Failed to sync ${contact.displayName || 'Unknown'}: ${error}`
        );
      }
    }

    return result;
  }

  /**
   * Get care team contacts
   */
  async getCareTeamContacts(
    options?: ContactSearchOptions
  ): Promise<CareTeamContact[]> {
    try {
      let query = db.careTeam.toCollection();

      // Apply filters
      if (options?.role) {
        query = db.careTeam.where('role').equals(options.role);
      }

      if (options?.isEmergency) {
        query = db.careTeam.where('isEmergency').equals(true);
      }

      if (options?.isFavorite) {
        query = db.careTeam.where('isFavorite').equals(true);
      }

      let contacts = await query.toArray();

      // Text search
      if (options?.query) {
        const normalizedQuery = options.query.toLowerCase();
        contacts = contacts.filter(contact =>
          contact.displayName?.toLowerCase().includes(normalizedQuery) ||
          contact.firstName?.toLowerCase().includes(normalizedQuery) ||
          contact.lastName?.toLowerCase().includes(normalizedQuery) ||
          contact.role?.toLowerCase().includes(normalizedQuery)
        );
      }

      // Tag filter
      if (options?.tags && options.tags.length > 0) {
        contacts = contacts.filter(contact =>
          contact.tags?.some(tag => options.tags!.includes(tag))
        );
      }

      return contacts as CareTeamContact[];
    } catch (error) {
      console.error('Error getting care team contacts:', error);
      return [];
    }
  }

  /**
   * Get emergency contacts
   */
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const contacts = await this.getCareTeamContacts({ isEmergency: true });

      return contacts
        .map((contact, index) => {
          const quickActions: QuickAction[] = [];

          // Add call actions for phone numbers
          if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            contact.phoneNumbers.forEach(phone => {
              quickActions.push({
                type: 'call',
                label: `Call ${phone.type || 'phone'}`,
                value: phone.number,
                icon: 'phone'
              });
            });
          }

          // Add SMS actions
          if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            quickActions.push({
              type: 'sms',
              label: 'Send SMS',
              value: contact.phoneNumbers[0].number,
              icon: 'message-square'
            });
          }

          // Add email actions
          if (contact.emails && contact.emails.length > 0) {
            contact.emails.forEach(email => {
              quickActions.push({
                type: 'email',
                label: `Email ${email.type || 'address'}`,
                value: email.address,
                icon: 'mail'
              });
            });
          }

          return {
            contact,
            priority: index + 1,
            quickActions
          };
        })
        .sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }

  /**
   * Toggle emergency contact status
   */
  async toggleEmergencyContact(contactId: string): Promise<void> {
    try {
      const contact = await db.careTeam.get(contactId);
      if (contact) {
        await db.careTeam.update(contactId, {
          isEmergency: !contact.isEmergency
        });
      }
    } catch (error) {
      console.error('Error toggling emergency contact:', error);
      throw error;
    }
  }

  /**
   * Toggle favorite contact status
   */
  async toggleFavoriteContact(contactId: string): Promise<void> {
    try {
      const contact = await db.careTeam.get(contactId);
      if (contact) {
        await db.careTeam.update(contactId, {
          isFavorite: !contact.isFavorite
        });
      }
    } catch (error) {
      console.error('Error toggling favorite contact:', error);
      throw error;
    }
  }

  /**
   * Update contact tags
   */
  async updateContactTags(contactId: string, tags: string[]): Promise<void> {
    try {
      await db.careTeam.update(contactId, { tags });
    } catch (error) {
      console.error('Error updating contact tags:', error);
      throw error;
    }
  }

  /**
   * Delete care team contact
   */
  async deleteCareTeamContact(contactId: string): Promise<void> {
    try {
      await db.careTeam.delete(contactId);
    } catch (error) {
      console.error('Error deleting care team contact:', error);
      throw error;
    }
  }

  /**
   * Call emergency number
   */
  async callEmergencyNumber(number: string): Promise<void> {
    const emergencyNumber = EMERGENCY_NUMBERS.find(e => e.number === number);

    await this.makeCall({
      phoneNumber: number,
      contactName: emergencyNumber?.name || 'Emergency'
    });
  }

  /**
   * Quick dial - Call primary number of contact
   */
  async quickDial(contactId: string): Promise<void> {
    try {
      const contact = await db.careTeam.get(contactId);

      if (!contact || !contact.phoneNumbers || contact.phoneNumbers.length === 0) {
        throw new Error('No phone number available for this contact');
      }

      await this.makeCall({
        phoneNumber: contact.phoneNumbers[0].number,
        contactName: contact.displayName || 'Unknown'
      });

      // Update last contacted
      await db.careTeam.update(contactId, {
        lastContacted: new Date()
      });
    } catch (error) {
      console.error('Error in quick dial:', error);
      throw error;
    }
  }

  /**
   * Quick text - Send SMS to primary number of contact
   */
  async quickText(contactId: string, message?: string): Promise<void> {
    try {
      const contact = await db.careTeam.get(contactId);

      if (!contact || !contact.phoneNumbers || contact.phoneNumbers.length === 0) {
        throw new Error('No phone number available for this contact');
      }

      await this.sendSMS({
        phoneNumber: contact.phoneNumbers[0].number,
        message,
        contactName: contact.displayName || 'Unknown'
      });

      // Update last contacted
      await db.careTeam.update(contactId, {
        lastContacted: new Date()
      });
    } catch (error) {
      console.error('Error in quick text:', error);
      throw error;
    }
  }

  /**
   * Log call attempt
   */
  private async logCallAttempt(phoneNumber: string, contactName?: string): Promise<void> {
    try {
      await db.activityLog.add({
        type: 'phone_call',
        timestamp: new Date(),
        metadata: {
          phoneNumber,
          contactName,
          platform: this.platform
        }
      });
    } catch (error) {
      console.error('Error logging call attempt:', error);
    }
  }

  /**
   * Log SMS attempt
   */
  private async logSMSAttempt(phoneNumber: string, contactName?: string): Promise<void> {
    try {
      await db.activityLog.add({
        type: 'sms',
        timestamp: new Date(),
        metadata: {
          phoneNumber,
          contactName,
          platform: this.platform
        }
      });
    } catch (error) {
      console.error('Error logging SMS attempt:', error);
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(contactId: string): Promise<CareTeamContact | undefined> {
    try {
      return await db.careTeam.get(contactId) as CareTeamContact | undefined;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      return undefined;
    }
  }

  /**
   * Search care team contacts
   */
  async searchCareTeam(query: string): Promise<CareTeamContact[]> {
    return this.getCareTeamContacts({ query });
  }

  /**
   * Get recent contacts
   */
  async getRecentContacts(limit: number = 5): Promise<CareTeamContact[]> {
    try {
      const contacts = await db.careTeam
        .orderBy('lastContacted')
        .reverse()
        .limit(limit)
        .toArray();

      return contacts as CareTeamContact[];
    } catch (error) {
      console.error('Error getting recent contacts:', error);
      return [];
    }
  }

  /**
   * Get favorite contacts
   */
  async getFavoriteContacts(): Promise<CareTeamContact[]> {
    return this.getCareTeamContacts({ isFavorite: true });
  }
}

// Export singleton instance
export const phoneIntegrationService = new PhoneIntegrationService();
export default phoneIntegrationService;
