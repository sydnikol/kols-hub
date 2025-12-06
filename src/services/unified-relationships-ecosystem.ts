/**
 * UNIFIED RELATIONSHIPS ECOSYSTEM
 *
 * Consolidates all relationship functionality:
 * - RelationshipDashboardPage, SocialConnectionHubPage
 * - NetworkingHubPage, CommunityEventsHubPage
 * - Family, Friends, Professional connections
 * - Caregiver relationships
 *
 * Cross-system connections:
 * - Health: Caregiver coordination, support network
 * - Calendar: Events, birthdays, anniversaries
 * - Finance: Gift tracking, shared expenses
 * - Entertainment: Shared activities, watch parties
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  relationship: 'family' | 'friend' | 'colleague' | 'acquaintance' | 'professional' | 'caregiver' | 'care_recipient' | 'romantic' | 'other';
  relationshipDetail?: string; // e.g., "sister", "coworker", "therapist"
  status: 'active' | 'inactive' | 'estranged' | 'deceased';
  photo?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    socialMedia?: Array<{
      platform: string;
      handle: string;
      url?: string;
    }>;
  };
  importantDates: Array<{
    type: 'birthday' | 'anniversary' | 'memorial' | 'other';
    date: string; // MM-DD or YYYY-MM-DD
    label?: string;
    reminder: boolean;
    reminderDays?: number;
  }>;
  preferences: {
    communicationPreference?: 'phone' | 'text' | 'email' | 'in_person' | 'social_media';
    giftPreferences?: string[];
    interests?: string[];
    allergies?: string[];
    dislikes?: string[];
  };
  notes: Array<{
    id: string;
    content: string;
    date: Date;
    private: boolean;
  }>;
  tags: string[];
  groups: string[];
  linkedAncestryId?: string;
  caregiverDetails?: {
    type: 'primary' | 'secondary' | 'respite' | 'professional';
    specialty?: string;
    schedule?: string;
    emergencyContact: boolean;
    permissions: string[];
  };
  lastContact?: Date;
  contactFrequencyGoal?: number; // days
  closenessLevel: 1 | 2 | 3 | 4 | 5; // 1 = acquaintance, 5 = closest
  trustLevel: 1 | 2 | 3 | 4 | 5;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: string;
  personIds: string[];
  type: 'call' | 'text' | 'email' | 'in_person' | 'video_call' | 'social_media' | 'letter' | 'gift' | 'event' | 'other';
  date: Date;
  duration?: number; // minutes
  location?: string;
  summary: string;
  details?: string;
  mood?: 'positive' | 'neutral' | 'negative' | 'mixed';
  energyCost?: number; // spoons
  followUpNeeded: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  photos?: string[];
  linkedEventId?: string;
  linkedGiftId?: string;
  private: boolean;
  createdAt: Date;
}

export interface RelationshipGroup {
  id: string;
  name: string;
  type: 'family' | 'friends' | 'work' | 'community' | 'support' | 'hobby' | 'custom';
  description?: string;
  members: string[]; // Person IDs
  color?: string;
  icon?: string;
  sharedCalendar?: boolean;
  groupChat?: {
    platform: string;
    link?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'gathering' | 'meeting' | 'appointment' | 'celebration' | 'memorial' | 'other';
  date: Date;
  endDate?: Date;
  allDay: boolean;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  location?: {
    name: string;
    address?: string;
    virtual?: boolean;
    link?: string;
  };
  attendees: Array<{
    personId: string;
    status: 'invited' | 'confirmed' | 'declined' | 'maybe' | 'host';
    role?: string;
  }>;
  description?: string;
  reminders: Array<{
    type: 'notification' | 'email' | 'sms';
    before: number; // minutes
  }>;
  gifts?: string[]; // Gift IDs
  budget?: number;
  actualCost?: number;
  photos?: string[];
  notes?: string;
  linkedGroupId?: string;
  completed: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gift {
  id: string;
  recipientId: string;
  occasion: string;
  eventId?: string;
  status: 'idea' | 'planned' | 'purchased' | 'wrapped' | 'given' | 'shipped';
  item: string;
  description?: string;
  price?: number;
  purchasedFrom?: string;
  purchaseUrl?: string;
  purchaseDate?: Date;
  givenDate?: Date;
  reaction?: string;
  thanked: boolean;
  photos?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportNetwork {
  id: string;
  name: string;
  type: 'medical' | 'mental_health' | 'financial' | 'practical' | 'emotional' | 'emergency';
  members: Array<{
    personId: string;
    role: string;
    availability?: string;
    priority: number;
    canContact: boolean;
    contactPreference?: string;
  }>;
  purpose: string;
  protocols?: Array<{
    situation: string;
    steps: string[];
    contacts: string[];
  }>;
  lastActivated?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaregiverLog {
  id: string;
  caregiverId: string;
  careRecipientId?: string;
  date: Date;
  type: 'visit' | 'call' | 'medication' | 'appointment' | 'task' | 'observation';
  summary: string;
  details: string;
  vitalsRecorded?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    bloodSugar?: number;
  };
  medicationsGiven?: Array<{
    name: string;
    dose: string;
    time: Date;
  }>;
  moodObserved?: string;
  concernsRaised?: string[];
  followUpRequired: boolean;
  followUpNotes?: string;
  duration: number;
  nextVisitScheduled?: Date;
  createdAt: Date;
}

export interface RelationshipGoal {
  id: string;
  title: string;
  type: 'connection' | 'support' | 'boundary' | 'growth' | 'repair' | 'maintain';
  personIds?: string[];
  groupId?: string;
  description: string;
  targetDate?: Date;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress: number;
  milestones: Array<{
    description: string;
    completed: boolean;
    date?: Date;
  }>;
  actions: Array<{
    description: string;
    frequency?: string;
    lastCompleted?: Date;
  }>;
  reflections: Array<{
    date: Date;
    content: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// UNIFIED RELATIONSHIPS ECOSYSTEM CLASS
// ============================================================================

class UnifiedRelationshipsEcosystem {
  private static instance: UnifiedRelationshipsEcosystem;
  private people: Map<string, Person> = new Map();
  private interactions: Interaction[] = [];
  private groups: Map<string, RelationshipGroup> = new Map();
  private events: Map<string, Event> = new Map();
  private gifts: Map<string, Gift> = new Map();
  private supportNetworks: Map<string, SupportNetwork> = new Map();
  private caregiverLogs: CaregiverLog[] = [];
  private goals: Map<string, RelationshipGoal> = new Map();

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
    this.startDailyReminders();
  }

  static getInstance(): UnifiedRelationshipsEcosystem {
    if (!UnifiedRelationshipsEcosystem.instance) {
      UnifiedRelationshipsEcosystem.instance = new UnifiedRelationshipsEcosystem();
    }
    return UnifiedRelationshipsEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Health integration - caregiver coordination
    eventBus.on('health:medication:due', (data: any) => {
      this.notifyCaregivers(data);
    });

    eventBus.on('health:emergency', (data: any) => {
      this.activateSupportNetwork('emergency', data);
    });

    // Finance integration - gift budgets
    eventBus.on('finance:budget:updated', (data: any) => {
      if (data.category === 'gifts') {
        this.updateGiftBudget(data.amount);
      }
    });

    // Calendar integration
    eventBus.on('calendar:event:created', (data: any) => {
      if (data.type === 'social') {
        this.linkCalendarEvent(data);
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_relationships_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.people) data.people.forEach((p: Person) => this.people.set(p.id, p));
        if (data.interactions) this.interactions = data.interactions;
        if (data.groups) data.groups.forEach((g: RelationshipGroup) => this.groups.set(g.id, g));
        if (data.events) data.events.forEach((e: Event) => this.events.set(e.id, e));
        if (data.gifts) data.gifts.forEach((g: Gift) => this.gifts.set(g.id, g));
        if (data.supportNetworks) data.supportNetworks.forEach((s: SupportNetwork) => this.supportNetworks.set(s.id, s));
        if (data.caregiverLogs) this.caregiverLogs = data.caregiverLogs;
        if (data.goals) data.goals.forEach((g: RelationshipGoal) => this.goals.set(g.id, g));
      }
    } catch (error) {
      console.error('[Relationships] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        people: Array.from(this.people.values()),
        interactions: this.interactions.slice(-1000),
        groups: Array.from(this.groups.values()),
        events: Array.from(this.events.values()),
        gifts: Array.from(this.gifts.values()),
        supportNetworks: Array.from(this.supportNetworks.values()),
        caregiverLogs: this.caregiverLogs.slice(-500),
        goals: Array.from(this.goals.values())
      };
      localStorage.setItem('unified_relationships_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Relationships] Failed to save to storage:', error);
    }
  }

  private startDailyReminders(): void {
    // Check for upcoming birthdays and events daily
    setInterval(() => {
      this.checkUpcomingDates();
    }, 24 * 60 * 60 * 1000); // Daily

    // Initial check
    setTimeout(() => this.checkUpcomingDates(), 5000);
  }

  // ============================================================================
  // PEOPLE MANAGEMENT
  // ============================================================================

  async addPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> {
    const newPerson: Person = {
      ...person,
      id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.people.set(newPerson.id, newPerson);
    this.saveToStorage();

    eventBus.emit('relationships:person:added', newPerson);
    return newPerson;
  }

  async updatePerson(personId: string, updates: Partial<Person>): Promise<Person | null> {
    const person = this.people.get(personId);
    if (!person) return null;

    Object.assign(person, updates, { updatedAt: new Date() });
    this.people.set(personId, person);
    this.saveToStorage();

    return person;
  }

  getPerson(personId: string): Person | undefined {
    return this.people.get(personId);
  }

  getAllPeople(): Person[] {
    return Array.from(this.people.values());
  }

  getPeopleByRelationship(relationship: Person['relationship']): Person[] {
    return Array.from(this.people.values()).filter(p => p.relationship === relationship);
  }

  getPeopleByGroup(groupId: string): Person[] {
    const group = this.groups.get(groupId);
    if (!group) return [];
    return group.members.map(id => this.people.get(id)).filter((p): p is Person => !!p);
  }

  searchPeople(query: string): Person[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.people.values()).filter(p =>
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.nickname?.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  getNeedingContact(): Person[] {
    const now = new Date();
    return Array.from(this.people.values())
      .filter(p => {
        if (!p.contactFrequencyGoal || !p.lastContact) return false;
        const daysSinceContact = Math.floor((now.getTime() - new Date(p.lastContact).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceContact >= p.contactFrequencyGoal;
      })
      .sort((a, b) => {
        const aDays = a.lastContact ? Math.floor((now.getTime() - new Date(a.lastContact).getTime()) / (1000 * 60 * 60 * 24)) : 999;
        const bDays = b.lastContact ? Math.floor((now.getTime() - new Date(b.lastContact).getTime()) / (1000 * 60 * 60 * 24)) : 999;
        return bDays - aDays;
      });
  }

  // ============================================================================
  // INTERACTIONS
  // ============================================================================

  async logInteraction(interaction: Omit<Interaction, 'id' | 'createdAt'>): Promise<Interaction> {
    const newInteraction: Interaction = {
      ...interaction,
      id: `interaction_${Date.now()}`,
      createdAt: new Date()
    };

    this.interactions.push(newInteraction);

    // Update last contact for all involved people
    for (const personId of interaction.personIds) {
      const person = this.people.get(personId);
      if (person) {
        person.lastContact = interaction.date;
        person.updatedAt = new Date();
        this.people.set(personId, person);
      }
    }

    this.saveToStorage();

    // Track energy cost
    if (interaction.energyCost) {
      eventBus.emit('health:spoons:used', {
        amount: interaction.energyCost,
        activity: 'social_interaction',
        linkedId: newInteraction.id
      });
    }

    eventBus.emit('relationships:interaction:logged', newInteraction);
    return newInteraction;
  }

  getInteractionsForPerson(personId: string, limit?: number): Interaction[] {
    let interactions = this.interactions
      .filter(i => i.personIds.includes(personId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (limit) interactions = interactions.slice(0, limit);
    return interactions;
  }

  getRecentInteractions(days: number = 30): Interaction[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.interactions
      .filter(i => new Date(i.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getPendingFollowUps(): Interaction[] {
    const now = new Date();
    return this.interactions
      .filter(i => i.followUpNeeded && (!i.followUpDate || new Date(i.followUpDate) <= now))
      .sort((a, b) => {
        const aDate = a.followUpDate ? new Date(a.followUpDate).getTime() : 0;
        const bDate = b.followUpDate ? new Date(b.followUpDate).getTime() : 0;
        return aDate - bDate;
      });
  }

  // ============================================================================
  // GROUPS
  // ============================================================================

  async createGroup(group: Omit<RelationshipGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<RelationshipGroup> {
    const newGroup: RelationshipGroup = {
      ...group,
      id: `group_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.groups.set(newGroup.id, newGroup);

    // Update people with group membership
    for (const memberId of group.members) {
      const person = this.people.get(memberId);
      if (person && !person.groups.includes(newGroup.id)) {
        person.groups.push(newGroup.id);
        this.people.set(memberId, person);
      }
    }

    this.saveToStorage();
    return newGroup;
  }

  async addToGroup(groupId: string, personId: string): Promise<RelationshipGroup | null> {
    const group = this.groups.get(groupId);
    if (!group || group.members.includes(personId)) return null;

    group.members.push(personId);
    group.updatedAt = new Date();

    const person = this.people.get(personId);
    if (person && !person.groups.includes(groupId)) {
      person.groups.push(groupId);
      this.people.set(personId, person);
    }

    this.groups.set(groupId, group);
    this.saveToStorage();

    return group;
  }

  getAllGroups(): RelationshipGroup[] {
    return Array.from(this.groups.values());
  }

  // ============================================================================
  // EVENTS
  // ============================================================================

  async createEvent(event: Omit<Event, 'id' | 'completed' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}`,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.events.set(newEvent.id, newEvent);
    this.saveToStorage();

    // Track budget
    if (newEvent.budget) {
      eventBus.emit('finance:budget:allocated', {
        category: 'events',
        amount: newEvent.budget,
        linkedId: newEvent.id
      });
    }

    eventBus.emit('relationships:event:created', newEvent);
    eventBus.emit('calendar:event:created', {
      id: newEvent.id,
      title: newEvent.title,
      date: newEvent.date,
      type: 'social'
    });

    return newEvent;
  }

  async updateEventAttendee(eventId: string, personId: string, status: Event['attendees'][0]['status']): Promise<Event | null> {
    const event = this.events.get(eventId);
    if (!event) return null;

    const attendee = event.attendees.find(a => a.personId === personId);
    if (attendee) {
      attendee.status = status;
    } else {
      event.attendees.push({ personId, status });
    }
    event.updatedAt = new Date();

    this.events.set(eventId, event);
    this.saveToStorage();

    return event;
  }

  async completeEvent(eventId: string, actualCost?: number, rating?: number): Promise<Event | null> {
    const event = this.events.get(eventId);
    if (!event) return null;

    event.completed = true;
    if (actualCost !== undefined) event.actualCost = actualCost;
    if (rating !== undefined) event.rating = rating;
    event.updatedAt = new Date();

    this.events.set(eventId, event);
    this.saveToStorage();

    // Track expense
    if (actualCost && actualCost > 0) {
      eventBus.emit('finance:expense', {
        amount: actualCost,
        category: 'events',
        description: event.title,
        linkedId: eventId
      });
    }

    // Log interaction for all confirmed attendees
    const confirmedAttendees = event.attendees.filter(a => a.status === 'confirmed' || a.status === 'host');
    if (confirmedAttendees.length > 0) {
      await this.logInteraction({
        personIds: confirmedAttendees.map(a => a.personId),
        type: 'event',
        date: event.date,
        summary: event.title,
        location: event.location?.name,
        linkedEventId: eventId,
        mood: 'positive',
        followUpNeeded: false,
        private: false
      });
    }

    eventBus.emit('relationships:event:completed', event);
    return event;
  }

  getUpcomingEvents(days: number = 30): Event[] {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return Array.from(this.events.values())
      .filter(e => !e.completed && new Date(e.date) >= now && new Date(e.date) <= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  // ============================================================================
  // GIFTS
  // ============================================================================

  async addGift(gift: Omit<Gift, 'id' | 'thanked' | 'createdAt' | 'updatedAt'>): Promise<Gift> {
    const newGift: Gift = {
      ...gift,
      id: `gift_${Date.now()}`,
      thanked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.gifts.set(newGift.id, newGift);
    this.saveToStorage();

    eventBus.emit('relationships:gift:added', newGift);
    return newGift;
  }

  async updateGiftStatus(giftId: string, status: Gift['status'], details?: Partial<Gift>): Promise<Gift | null> {
    const gift = this.gifts.get(giftId);
    if (!gift) return null;

    gift.status = status;
    if (details) Object.assign(gift, details);
    gift.updatedAt = new Date();

    if (status === 'purchased' && gift.price) {
      eventBus.emit('finance:expense', {
        amount: gift.price,
        category: 'gifts',
        description: `Gift for ${this.people.get(gift.recipientId)?.firstName || 'someone'}: ${gift.item}`,
        linkedId: giftId
      });
    }

    this.gifts.set(giftId, gift);
    this.saveToStorage();

    return gift;
  }

  getGiftsForPerson(personId: string): Gift[] {
    return Array.from(this.gifts.values()).filter(g => g.recipientId === personId);
  }

  getGiftIdeas(): Gift[] {
    return Array.from(this.gifts.values()).filter(g => g.status === 'idea');
  }

  getPendingGifts(): Gift[] {
    return Array.from(this.gifts.values()).filter(g => g.status !== 'given' && g.status !== 'shipped');
  }

  // ============================================================================
  // SUPPORT NETWORKS
  // ============================================================================

  async createSupportNetwork(network: Omit<SupportNetwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportNetwork> {
    const newNetwork: SupportNetwork = {
      ...network,
      id: `network_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.supportNetworks.set(newNetwork.id, newNetwork);
    this.saveToStorage();

    return newNetwork;
  }

  async activateSupportNetwork(type: SupportNetwork['type'], data: any): Promise<void> {
    const network = Array.from(this.supportNetworks.values()).find(n => n.type === type);
    if (!network) {
      console.warn(`[Relationships] No support network found for type: ${type}`);
      return;
    }

    network.lastActivated = new Date();
    this.supportNetworks.set(network.id, network);
    this.saveToStorage();

    // Notify members based on priority
    const sortedMembers = [...network.members].sort((a, b) => a.priority - b.priority);

    for (const member of sortedMembers) {
      if (member.canContact) {
        eventBus.emit('notification:send', {
          type: 'support_network_activation',
          recipientId: member.personId,
          networkId: network.id,
          data
        });
      }
    }

    eventBus.emit('relationships:support:activated', { network, data });
  }

  getSupportNetworks(): SupportNetwork[] {
    return Array.from(this.supportNetworks.values());
  }

  getEmergencyContacts(): Person[] {
    const emergencyNetwork = Array.from(this.supportNetworks.values()).find(n => n.type === 'emergency');
    if (!emergencyNetwork) return [];

    return emergencyNetwork.members
      .sort((a, b) => a.priority - b.priority)
      .map(m => this.people.get(m.personId))
      .filter((p): p is Person => !!p);
  }

  // ============================================================================
  // CAREGIVER MANAGEMENT
  // ============================================================================

  async logCaregiverVisit(log: Omit<CaregiverLog, 'id' | 'createdAt'>): Promise<CaregiverLog> {
    const newLog: CaregiverLog = {
      ...log,
      id: `caregiver_log_${Date.now()}`,
      createdAt: new Date()
    };

    this.caregiverLogs.push(newLog);
    this.saveToStorage();

    // Track vitals if recorded
    if (log.vitalsRecorded) {
      eventBus.emit('health:vitals:recorded', {
        ...log.vitalsRecorded,
        source: 'caregiver',
        caregiverId: log.caregiverId,
        date: log.date
      });
    }

    // Track medications given
    if (log.medicationsGiven?.length) {
      for (const med of log.medicationsGiven) {
        eventBus.emit('health:medication:taken', {
          name: med.name,
          dose: med.dose,
          time: med.time,
          givenBy: log.caregiverId
        });
      }
    }

    eventBus.emit('relationships:caregiver:logged', newLog);
    return newLog;
  }

  getCaregiverLogs(caregiverId?: string, limit?: number): CaregiverLog[] {
    let logs = [...this.caregiverLogs];

    if (caregiverId) {
      logs = logs.filter(l => l.caregiverId === caregiverId);
    }

    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (limit) logs = logs.slice(0, limit);
    return logs;
  }

  getCaregivers(): Person[] {
    return Array.from(this.people.values()).filter(p => p.relationship === 'caregiver');
  }

  private notifyCaregivers(data: any): void {
    const caregivers = this.getCaregivers().filter(c => c.caregiverDetails?.emergencyContact);
    for (const caregiver of caregivers) {
      eventBus.emit('notification:send', {
        type: 'caregiver_alert',
        recipientId: caregiver.id,
        data
      });
    }
  }

  // ============================================================================
  // GOALS
  // ============================================================================

  async createGoal(goal: Omit<RelationshipGoal, 'id' | 'progress' | 'createdAt' | 'updatedAt'>): Promise<RelationshipGoal> {
    const newGoal: RelationshipGoal = {
      ...goal,
      id: `rel_goal_${Date.now()}`,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.goals.set(newGoal.id, newGoal);
    this.saveToStorage();

    return newGoal;
  }

  async updateGoalProgress(goalId: string, progress: number, reflection?: string): Promise<RelationshipGoal | null> {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    goal.progress = Math.min(100, Math.max(0, progress));
    goal.updatedAt = new Date();

    if (reflection) {
      goal.reflections.push({
        date: new Date(),
        content: reflection
      });
    }

    if (goal.progress === 100) {
      goal.status = 'completed';
      eventBus.emit('relationships:goal:completed', goal);
    }

    this.goals.set(goalId, goal);
    this.saveToStorage();

    return goal;
  }

  getActiveGoals(): RelationshipGoal[] {
    return Array.from(this.goals.values()).filter(g => g.status === 'active');
  }

  // ============================================================================
  // ANALYTICS & INSIGHTS
  // ============================================================================

  private checkUpcomingDates(): void {
    const today = new Date();
    const upcoming: Array<{ person: Person; date: Person['importantDates'][0]; daysUntil: number }> = [];

    for (const person of this.people.values()) {
      for (const importantDate of person.importantDates) {
        if (!importantDate.reminder) continue;

        const [month, day] = importantDate.date.split('-').slice(-2).map(Number);
        const thisYearDate = new Date(today.getFullYear(), month - 1, day);

        // If date has passed this year, check next year
        if (thisYearDate < today) {
          thisYearDate.setFullYear(thisYearDate.getFullYear() + 1);
        }

        const daysUntil = Math.ceil((thisYearDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const reminderDays = importantDate.reminderDays || 7;

        if (daysUntil <= reminderDays) {
          upcoming.push({ person, date: importantDate, daysUntil });
        }
      }
    }

    if (upcoming.length > 0) {
      eventBus.emit('relationships:dates:upcoming', upcoming);
    }
  }

  getRelationshipStats(): {
    totalPeople: number;
    byRelationship: Record<string, number>;
    interactionsThisMonth: number;
    averageContactFrequency: number;
    needingContact: number;
    upcomingEvents: number;
    pendingGifts: number;
    activeGoals: number;
  } {
    const people = Array.from(this.people.values());
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // By relationship type
    const byRelationship: Record<string, number> = {};
    people.forEach(p => {
      byRelationship[p.relationship] = (byRelationship[p.relationship] || 0) + 1;
    });

    // Contact frequency
    const withContact = people.filter(p => p.lastContact);
    const avgFrequency = withContact.length > 0
      ? withContact.reduce((sum, p) => {
        const days = Math.floor((now.getTime() - new Date(p.lastContact!).getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / withContact.length
      : 0;

    return {
      totalPeople: people.length,
      byRelationship,
      interactionsThisMonth: this.interactions.filter(i => new Date(i.date) >= monthAgo).length,
      averageContactFrequency: Math.round(avgFrequency),
      needingContact: this.getNeedingContact().length,
      upcomingEvents: this.getUpcomingEvents(30).length,
      pendingGifts: this.getPendingGifts().length,
      activeGoals: this.getActiveGoals().length
    };
  }

  getSocialEnergyAnalysis(): {
    averageEnergyCost: number;
    highEnergyCostPeople: Person[];
    lowEnergyCostPeople: Person[];
    recommendedSocialBudget: number;
  } {
    const interactionsWithEnergy = this.interactions.filter(i => i.energyCost !== undefined);

    if (interactionsWithEnergy.length === 0) {
      return {
        averageEnergyCost: 0,
        highEnergyCostPeople: [],
        lowEnergyCostPeople: [],
        recommendedSocialBudget: 5
      };
    }

    const avgCost = interactionsWithEnergy.reduce((sum, i) => sum + (i.energyCost || 0), 0) / interactionsWithEnergy.length;

    // Calculate average energy cost per person
    const personEnergyCosts: Map<string, number[]> = new Map();
    for (const interaction of interactionsWithEnergy) {
      for (const personId of interaction.personIds) {
        const costs = personEnergyCosts.get(personId) || [];
        costs.push(interaction.energyCost || 0);
        personEnergyCosts.set(personId, costs);
      }
    }

    const personAvgCosts: Array<{ personId: string; avgCost: number }> = [];
    personEnergyCosts.forEach((costs, personId) => {
      personAvgCosts.push({
        personId,
        avgCost: costs.reduce((a, b) => a + b, 0) / costs.length
      });
    });

    personAvgCosts.sort((a, b) => b.avgCost - a.avgCost);

    return {
      averageEnergyCost: Math.round(avgCost * 10) / 10,
      highEnergyCostPeople: personAvgCosts.slice(0, 5)
        .map(p => this.people.get(p.personId))
        .filter((p): p is Person => !!p),
      lowEnergyCostPeople: personAvgCosts.slice(-5).reverse()
        .map(p => this.people.get(p.personId))
        .filter((p): p is Person => !!p),
      recommendedSocialBudget: Math.ceil(avgCost * 3) // 3 interactions worth
    };
  }

  private updateGiftBudget(amount: number): void {
    console.log(`[Relationships] Gift budget updated to ${amount}`);
  }

  private linkCalendarEvent(data: any): void {
    console.log(`[Relationships] Calendar event linked: ${data.title}`);
  }
}

// Export singleton instance
export const relationshipsEcosystem = UnifiedRelationshipsEcosystem.getInstance();

// Export convenience functions
export const addPerson = (p: Parameters<typeof relationshipsEcosystem.addPerson>[0]) => relationshipsEcosystem.addPerson(p);
export const logInteraction = (i: Parameters<typeof relationshipsEcosystem.logInteraction>[0]) => relationshipsEcosystem.logInteraction(i);
export const createEvent = (e: Parameters<typeof relationshipsEcosystem.createEvent>[0]) => relationshipsEcosystem.createEvent(e);
export const getAllPeople = () => relationshipsEcosystem.getAllPeople();
export const getRelationshipStats = () => relationshipsEcosystem.getRelationshipStats();
