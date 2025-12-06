import React, { useState, useEffect } from 'react';
import { GoogleHomeDashboard } from '../components/googlehome/GoogleHomeDashboard';
import {
  Mail,
  Calendar,
  Home,
  HardDrive,
  Image,
  FileText,
  Inbox,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Archive,
  Trash2,
  Download,
  Share2,
  FolderOpen,
  File,
  Video,
  Music,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Tag,
  StickyNote
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  body: string;
  unread: boolean;
  starred: boolean;
  timestamp: Date;
  hasAttachment?: boolean;
  labels?: string[];
  category: 'primary' | 'social' | 'promotions' | 'updates';
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  attendees?: string[];
  color: string;
  isAllDay?: boolean;
  isRecurring?: boolean;
  meetingLink?: string;
}

interface DriveFile {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'video' | 'folder';
  size: string;
  modified: Date;
  owner: string;
  shared: boolean;
  starred: boolean;
}

interface Photo {
  id: string;
  url: string;
  title: string;
  location?: string;
  date: Date;
  size: string;
  dimensions: string;
}

interface KeepNote {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  archived: boolean;
  created: Date;
  modified: Date;
  labels?: string[];
  checklist?: { text: string; checked: boolean }[];
}

const GoogleEcosystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'gmail' | 'calendar' | 'drive' | 'photos' | 'keep'>('home');
  const [emails, setEmails] = useState<Email[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [keepNotes, setKeepNotes] = useState<KeepNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gmailConnected, setGmailConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    loadGmailData();
    loadCalendarData();
    loadDriveData();
    loadPhotosData();
    loadKeepNotesData();
  }, []);

  const loadGmailData = async () => {
    const now = new Date();
    setEmails([
      {
        id: '1',
        from: 'Sarah Johnson',
        fromEmail: 'sarah.johnson@company.com',
        subject: 'Q4 Marketing Strategy Review - Action Required',
        snippet: 'Hi team, please review the attached Q4 marketing strategy document before our meeting...',
        body: 'Hi team, I hope this email finds you well. Please review the attached Q4 marketing strategy document before our meeting on Friday. We need to finalize the budget allocation and campaign timelines. Looking forward to your feedback.',
        unread: true,
        starred: true,
        timestamp: new Date(now.getTime() - 1000 * 60 * 15),
        hasAttachment: true,
        labels: ['Work', 'Important'],
        category: 'primary'
      },
      {
        id: '2',
        from: 'GitHub',
        fromEmail: 'notifications@github.com',
        subject: 'Your pull request was merged into main',
        snippet: 'Congratulations! Your pull request #1247 "Add authentication middleware" has been merged...',
        body: 'Your pull request has been successfully merged into the main branch. The CI/CD pipeline is running and will deploy to production in approximately 10 minutes.',
        unread: true,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 45),
        hasAttachment: false,
        labels: ['Development'],
        category: 'updates'
      },
      {
        id: '3',
        from: 'LinkedIn',
        fromEmail: 'notifications@linkedin.com',
        subject: 'Your post received 1,247 impressions',
        snippet: 'Your recent post about AI development is performing well. It has received 1,247 impressions...',
        body: 'Your content is resonating with your network. Consider engaging with comments to increase reach further.',
        unread: true,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 90),
        hasAttachment: false,
        labels: ['Social'],
        category: 'social'
      },
      {
        id: '4',
        from: 'Michael Chen',
        fromEmail: 'michael.chen@freelance.io',
        subject: 'Project Update: Mobile App Development',
        snippet: 'The mobile app beta is ready for testing. I have deployed it to TestFlight...',
        body: 'Hi, great news! The mobile app beta version is now available on TestFlight. Please test the new authentication flow and the dashboard features. Let me know if you encounter any issues.',
        unread: false,
        starred: true,
        timestamp: new Date(now.getTime() - 1000 * 60 * 120),
        hasAttachment: true,
        labels: ['Work', 'Mobile'],
        category: 'primary'
      },
      {
        id: '5',
        from: 'AWS Support',
        fromEmail: 'support@aws.amazon.com',
        subject: 'Your AWS bill for November 2025',
        snippet: 'Your AWS usage for November 2025 is $847.32. View detailed breakdown...',
        body: 'This months charges include EC2 instances, S3 storage, and Lambda function executions. Your usage increased by 12% compared to last month.',
        unread: false,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3),
        hasAttachment: true,
        labels: ['Finance'],
        category: 'updates'
      },
      {
        id: '6',
        from: 'Emma Thompson',
        fromEmail: 'emma.thompson@design.studio',
        subject: 'Design mockups for homepage redesign',
        snippet: 'I have completed the homepage redesign mockups. Please find the Figma link attached...',
        body: 'Hi team, I have finished the new homepage designs with three different layout options. The mockups are available in Figma. I would love to get your feedback by end of week.',
        unread: false,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5),
        hasAttachment: true,
        labels: ['Design', 'Work'],
        category: 'primary'
      },
      {
        id: '7',
        from: 'Stripe',
        fromEmail: 'notifications@stripe.com',
        subject: 'New payment of $299.00 received',
        snippet: 'You have received a new payment from customer_a8sd7f9s8df for your SaaS subscription...',
        body: 'A successful payment has been processed. The customer has been upgraded to the Pro plan. Net amount after fees: $287.13',
        unread: false,
        starred: true,
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 8),
        hasAttachment: false,
        labels: ['Finance'],
        category: 'updates'
      },
      {
        id: '8',
        from: 'Medium Partner Program',
        fromEmail: 'earnings@medium.com',
        subject: 'Your earnings report for November',
        snippet: 'Your stories earned $156.42 this month from 12,847 reads. Your top story was...',
        body: 'Congratulations on another successful month! Your article "Building Scalable APIs with Node.js" was your top performer with 4,823 reads.',
        unread: false,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 12),
        hasAttachment: true,
        labels: ['Writing', 'Finance'],
        category: 'updates'
      },
      {
        id: '9',
        from: 'Alex Rodriguez',
        fromEmail: 'alex.r@techstartup.com',
        subject: 'Coffee chat tomorrow at 3 PM?',
        snippet: 'Hey! Are you available for a quick coffee chat tomorrow afternoon? I would love to discuss...',
        body: 'I have been following your work on microservices architecture and would love to pick your brain about some challenges we are facing at my startup.',
        unread: false,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        hasAttachment: false,
        labels: ['Networking'],
        category: 'primary'
      },
      {
        id: '10',
        from: 'Google Cloud Platform',
        fromEmail: 'noreply@google.com',
        subject: 'Security alert: New sign-in from Windows device',
        snippet: 'We detected a new sign-in to your Google Cloud Platform account from a Windows device...',
        body: 'A new sign-in was detected from Seattle, Washington on a Windows 11 device. If this was not you, please secure your account immediately.',
        unread: false,
        starred: false,
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 36),
        hasAttachment: false,
        labels: ['Security'],
        category: 'updates'
      }
    ]);
    setGmailConnected(true);
  };

  const loadCalendarData = async () => {
    const now = new Date();
    setEvents([
      {
        id: '1',
        title: 'Team Standup Meeting',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30),
        location: 'Conference Room A',
        description: 'Daily team sync-up to discuss progress and blockers',
        attendees: ['sarah@company.com', 'mike@company.com', 'emma@company.com'],
        color: '#4285F4',
        isRecurring: true,
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      },
      {
        id: '2',
        title: 'Client Presentation - Product Demo',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
        location: 'Virtual - Google Meet',
        description: 'Demonstrate new features to client stakeholders',
        attendees: ['client@company.com', 'sales@company.com'],
        color: '#EA4335',
        meetingLink: 'https://meet.google.com/xyz-abcd-efg'
      },
      {
        id: '3',
        title: 'Lunch with Alex Rodriguez',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
        location: 'Blue Bottle Coffee, Downtown',
        description: 'Networking coffee chat about microservices architecture',
        color: '#FBBC04',
        attendees: ['alex@techstartup.com']
      },
      {
        id: '4',
        title: 'Code Review Session',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0),
        description: 'Review pull requests and discuss code quality improvements',
        color: '#34A853',
        isRecurring: true
      },
      {
        id: '5',
        title: 'Q4 Marketing Strategy Review',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 30),
        location: 'Conference Room B',
        description: 'Finalize Q4 marketing budget and campaign timelines',
        attendees: ['sarah@company.com', 'marketing@company.com'],
        color: '#EA4335',
        meetingLink: 'https://meet.google.com/mkr-tyui-opq'
      },
      {
        id: '6',
        title: 'Doctor Appointment - Annual Checkup',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 30),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 30),
        location: 'Seattle Medical Center',
        description: 'Annual physical examination',
        color: '#9C27B0'
      },
      {
        id: '7',
        title: 'Homepage Redesign Review',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 16, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 17, 0),
        description: 'Review Emma\'s design mockups and provide feedback',
        attendees: ['emma@design.studio'],
        color: '#4285F4',
        meetingLink: 'https://meet.google.com/des-ign-rev'
      },
      {
        id: '8',
        title: 'Mobile App Beta Testing',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 12, 0),
        description: 'Test new authentication flow and dashboard features',
        color: '#34A853'
      },
      {
        id: '9',
        title: 'Weekend Hiking Trip',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 8, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 17, 0),
        location: 'Mt. Rainier National Park',
        description: 'Day hike on the Skyline Trail',
        color: '#0F9D58',
        isAllDay: false
      },
      {
        id: '10',
        title: 'Conference: Tech Summit 2025',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 9, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9, 17, 0),
        location: 'Seattle Convention Center',
        description: 'Three-day technology conference with workshops and keynotes',
        color: '#F4B400',
        isAllDay: true
      },
      {
        id: '11',
        title: 'Yoga Class',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 7, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0),
        location: 'Downtown Yoga Studio',
        color: '#9C27B0',
        isRecurring: true
      },
      {
        id: '12',
        title: 'Weekly Team Retrospective',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 16, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 17, 0),
        description: 'Reflect on the week and discuss improvements',
        attendees: ['team@company.com'],
        color: '#4285F4',
        isRecurring: true,
        meetingLink: 'https://meet.google.com/ret-rosp-ect'
      },
      {
        id: '13',
        title: 'Coffee with Potential Investor',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 15, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 16, 0),
        location: 'Starbucks Reserve Roastery',
        description: 'Discuss Series A funding opportunities',
        color: '#EA4335'
      },
      {
        id: '14',
        title: 'Project Planning Workshop',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 13, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 16, 0),
        location: 'Conference Room A',
        description: 'Plan Q1 2026 projects and allocate resources',
        attendees: ['leadership@company.com'],
        color: '#34A853'
      },
      {
        id: '15',
        title: 'Birthday Dinner',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 19, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 21, 0),
        location: 'The Pink Door Restaurant',
        description: 'Celebrate Mom\'s birthday',
        color: '#F4B400'
      }
    ]);
    setCalendarConnected(true);
  };

  const loadDriveData = async () => {
    const now = new Date();
    setDriveFiles([
      {
        id: '1',
        name: 'Q4 Marketing Strategy 2025.docx',
        type: 'document',
        size: '2.4 MB',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 2),
        owner: 'sarah.johnson@company.com',
        shared: true,
        starred: true
      },
      {
        id: '2',
        name: 'Homepage Redesign Mockups',
        type: 'folder',
        size: '15 items',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 5),
        owner: 'emma.thompson@design.studio',
        shared: true,
        starred: false
      },
      {
        id: '3',
        name: 'Financial Report November 2025.xlsx',
        type: 'spreadsheet',
        size: '1.8 MB',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 12),
        owner: 'finance@company.com',
        shared: true,
        starred: true
      },
      {
        id: '4',
        name: 'Product Demo Presentation.pptx',
        type: 'presentation',
        size: '8.7 MB',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        owner: 'You',
        shared: true,
        starred: false
      },
      {
        id: '5',
        name: 'API Documentation v3.2.pdf',
        type: 'pdf',
        size: '3.2 MB',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 36),
        owner: 'michael.chen@freelance.io',
        shared: true,
        starred: false
      },
      {
        id: '6',
        name: 'Team Photo - Summer Retreat.jpg',
        type: 'image',
        size: '4.5 MB',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 48),
        owner: 'You',
        shared: false,
        starred: true
      },
      {
        id: '7',
        name: 'Project Recordings',
        type: 'folder',
        size: '8 items',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 72),
        owner: 'You',
        shared: false,
        starred: false
      },
      {
        id: '8',
        name: 'Meeting Notes - Client Onboarding.docx',
        type: 'document',
        size: '892 KB',
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 96),
        owner: 'You',
        shared: true,
        starred: false
      }
    ]);
  };

  const loadPhotosData = async () => {
    const now = new Date();
    setPhotos([
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        title: 'Mountain Sunset',
        location: 'Mt. Rainier National Park, WA',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
        size: '4.2 MB',
        dimensions: '4032 x 3024'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        title: 'Forest Trail',
        location: 'Olympic National Park, WA',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14),
        size: '3.8 MB',
        dimensions: '3840 x 2160'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
        title: 'Coffee Break',
        location: 'Blue Bottle Coffee, Seattle',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
        size: '2.1 MB',
        dimensions: '3024 x 4032'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
        title: 'Workspace Setup',
        location: 'Home Office',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21),
        size: '3.5 MB',
        dimensions: '4000 x 3000'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
        title: 'City Skyline',
        location: 'Seattle, WA',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30),
        size: '5.1 MB',
        dimensions: '5472 x 3648'
      }
    ]);
  };

  const loadKeepNotesData = async () => {
    const now = new Date();
    setKeepNotes([
      {
        id: '1',
        title: 'Project Ideas',
        content: 'AI-powered task manager, Voice assistant integration, Smart home dashboard, Real-time collaboration tool',
        color: '#FFD700',
        pinned: true,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 12),
        labels: ['Ideas', 'Work']
      },
      {
        id: '2',
        title: 'Shopping List',
        content: '',
        color: '#98D8C8',
        pinned: true,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 6),
        labels: ['Personal'],
        checklist: [
          { text: 'Milk', checked: false },
          { text: 'Eggs', checked: false },
          { text: 'Bread', checked: true },
          { text: 'Coffee beans', checked: false },
          { text: 'Fresh vegetables', checked: false }
        ]
      },
      {
        id: '3',
        title: 'Meeting Notes - Q4 Strategy',
        content: 'Budget allocation: $50k for digital marketing. Focus on social media campaigns. Launch new product features by Dec 15. Hire 2 additional developers.',
        color: '#F28B82',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 8),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 8),
        labels: ['Meetings', 'Work']
      },
      {
        id: '4',
        title: 'Book Recommendations',
        content: 'The Pragmatic Programmer, Clean Code, Design Patterns, System Design Interview, Atomic Habits',
        color: '#AECBFA',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
        labels: ['Reading', 'Personal']
      },
      {
        id: '5',
        title: 'Workout Plan',
        content: '',
        color: '#CCFF90',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
        labels: ['Health', 'Personal'],
        checklist: [
          { text: 'Monday: Chest & Triceps', checked: true },
          { text: 'Tuesday: Yoga', checked: true },
          { text: 'Wednesday: Back & Biceps', checked: false },
          { text: 'Thursday: Rest', checked: false },
          { text: 'Friday: Legs', checked: false }
        ]
      },
      {
        id: '6',
        title: 'Tech Stack for New Project',
        content: 'Frontend: React, TypeScript, Tailwind CSS. Backend: Node.js, Express, PostgreSQL. Infrastructure: AWS, Docker, GitHub Actions. Authentication: Auth0',
        color: '#E6C9A8',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4),
        labels: ['Development', 'Work']
      },
      {
        id: '7',
        title: 'Travel Itinerary - Tokyo',
        content: 'Day 1: Shibuya, Harajuku. Day 2: Asakusa, Tokyo Skytree. Day 3: Akihabara, Imperial Palace. Day 4: Day trip to Mt. Fuji',
        color: '#FFD700',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15),
        labels: ['Travel', 'Personal']
      },
      {
        id: '8',
        title: 'Code Snippets',
        content: 'React custom hook for debounce, PostgreSQL query optimization, Docker compose setup, AWS Lambda deployment script',
        color: '#98D8C8',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12),
        labels: ['Code', 'Reference']
      },
      {
        id: '9',
        title: 'Gift Ideas',
        content: 'Mom: Smart watch, Dad: Noise-canceling headphones, Sister: Kindle Paperwhite, Brother: Gaming keyboard',
        color: '#F28B82',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 25),
        labels: ['Personal', 'Shopping']
      },
      {
        id: '10',
        title: 'Quick Thoughts',
        content: 'Consider microservices for scaling. Need to refactor authentication module. Explore GraphQL for API. Schedule team building activity.',
        color: '#AECBFA',
        pinned: false,
        archived: false,
        created: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
        modified: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
        labels: ['Work', 'Random']
      }
    ]);
    setLoading(false);
  };

  const handleEmailAction = (emailId: string, action: 'read' | 'star' | 'archive' | 'delete') => {
    setEmails(emails.map(email => {
      if (email.id === emailId) {
        switch (action) {
          case 'read':
            return { ...email, unread: false };
          case 'star':
            return { ...email, starred: !email.starred };
          case 'archive':
          case 'delete':
            return email;
        }
      }
      return email;
    }));

    const actionMessages = {
      read: 'Marked as read',
      star: 'Starred',
      archive: 'Archived',
      delete: 'Deleted'
    };
    toast.success(actionMessages[action]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'spreadsheet': return <FileText className="w-5 h-5 text-green-400" />;
      case 'presentation': return <FileText className="w-5 h-5 text-orange-400" />;
      case 'pdf': return <File className="w-5 h-5 text-red-400" />;
      case 'image': return <Image className="w-5 h-5 text-purple-400" />;
      case 'video': return <Video className="w-5 h-5 text-pink-400" />;
      case 'folder': return <FolderOpen className="w-5 h-5 text-yellow-400" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const tabs = [
    { id: 'home', label: 'Google Home', icon: <Home className="w-4 h-4" /> },
    { id: 'gmail', label: 'Gmail', icon: <Mail className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'drive', label: 'Drive', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'photos', label: 'Photos', icon: <Image className="w-4 h-4" /> },
    { id: 'keep', label: 'Keep', icon: <StickyNote className="w-4 h-4" /> }
  ];

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Google Ecosystem Integration
          </h1>
          <p className="text-purple-400">
            Unified control for Google Home, Gmail, Calendar, Drive, Photos, and Keep
          </p>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-bold text-white text-sm">Home</div>
                <div className="text-xs text-green-400">Connected</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 p-3 rounded-xl border border-red-500/30">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-bold text-white text-sm">Gmail</div>
                <div className="text-xs text-green-400">
                  {gmailConnected ? 'Connected' : 'Not Connected'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-3 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-bold text-white text-sm">Calendar</div>
                <div className="text-xs text-green-400">
                  {calendarConnected ? 'Connected' : 'Not Connected'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-3 rounded-xl border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-bold text-white text-sm">Drive</div>
                <div className="text-xs text-green-400">Connected</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 p-3 rounded-xl border border-pink-500/30">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-pink-400" />
              <div>
                <div className="font-bold text-white text-sm">Photos</div>
                <div className="text-xs text-green-400">Connected</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 p-3 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-white text-sm">Keep</div>
                <div className="text-xs text-green-400">Connected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-purple-900/20 p-1 rounded-lg border border-purple-500/30 mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-transparent text-purple-400 hover:bg-purple-500/10'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'home' && (
          <GoogleHomeDashboard />
        )}

        {activeTab === 'gmail' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Gmail Inbox</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg text-xs font-bold">
                    {emails.filter(e => e.unread).length} unread
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-xs font-bold">
                    {emails.length} total
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-purple-400 py-12">Loading emails...</div>
            ) : (
              <div className="space-y-2">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`bg-gradient-to-r p-4 rounded-xl border transition-all cursor-pointer hover:border-purple-400/60 ${
                      email.unread
                        ? 'from-purple-900/40 to-indigo-900/40 border-purple-500/40'
                        : 'from-purple-900/20 to-indigo-900/20 border-purple-500/20'
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {email.unread && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                          )}
                          <div className="font-bold text-white truncate">{email.from}</div>
                          <div className="text-xs text-purple-400 flex-shrink-0">{formatTime(email.timestamp)}</div>
                          {email.starred && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                          )}
                          {email.hasAttachment && (
                            <Paperclip className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className={`text-base mb-1 truncate ${email.unread ? 'font-bold text-white' : 'text-purple-200'}`}>
                          {email.subject}
                        </div>
                        <div className="text-sm text-purple-400 truncate">{email.snippet}</div>
                        {email.labels && email.labels.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {email.labels.map((label, idx) => (
                              <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        {email.unread && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEmailAction(email.id, 'read'); }}
                            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4 text-purple-400" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEmailAction(email.id, 'star'); }}
                          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Star"
                        >
                          <Star className={`w-4 h-4 ${email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-purple-400'}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEmailAction(email.id, 'archive'); }}
                          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4 text-purple-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEmailAction(email.id, 'delete'); }}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                <p className="text-sm text-purple-400 mt-1">{events.length} events scheduled</p>
              </div>
              <button
                onClick={() => toast.success('Event added to your calendar')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            {loading ? (
              <div className="text-center text-purple-400 py-12">Loading calendar...</div>
            ) : (
              <div className="grid gap-3">
                {events.map((event) => {
                  const now = new Date();
                  const isToday = event.start.toDateString() === now.toDateString();
                  const isPast = event.end < now;

                  return (
                    <div
                      key={event.id}
                      className={`bg-gradient-to-r p-4 rounded-xl border transition-all ${
                        isToday
                          ? 'from-blue-900/40 to-cyan-900/40 border-blue-500/40'
                          : isPast
                          ? 'from-gray-900/20 to-gray-800/20 border-gray-500/20 opacity-60'
                          : 'from-purple-900/20 to-indigo-900/20 border-purple-500/20'
                      }`}
                      style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-purple-500/20 p-3 rounded-lg min-w-[80px]">
                          <div className="text-xs text-purple-400 uppercase">
                            {event.start.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {event.start.getDate()}
                          </div>
                          <div className="text-xs text-purple-400">
                            {event.isAllDay ? 'All Day' : formatEventTime(event.start)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <div className="font-bold text-white text-lg">{event.title}</div>
                            {isToday && (
                              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold">
                                TODAY
                              </span>
                            )}
                            {event.isRecurring && (
                              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-bold">
                                RECURRING
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            {!event.isAllDay && (
                              <div className="flex items-center gap-2 text-sm text-purple-400">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                {formatEventTime(event.start)} - {formatEventTime(event.end)}
                              </div>
                            )}

                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-purple-400">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                {event.location}
                              </div>
                            )}

                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-purple-400">
                                <Users className="w-4 h-4 flex-shrink-0" />
                                {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                              </div>
                            )}

                            {event.description && (
                              <div className="text-sm text-purple-300 mt-2">{event.description}</div>
                            )}

                            {event.meetingLink && (
                              <a
                                href={event.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mt-2"
                              >
                                Join Meeting
                                <Share2 className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'drive' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Google Drive</h2>
                <p className="text-sm text-purple-400 mt-1">{driveFiles.length} files and folders</p>
              </div>
              <button
                onClick={() => toast.success('Upload file dialog opened')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload
              </button>
            </div>

            <div className="grid gap-2">
              {driveFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-4 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      {getFileIcon(file.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{file.name}</div>
                      <div className="flex items-center gap-2 text-xs text-purple-400 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Modified {formatTime(file.modified)}</span>
                        <span>•</span>
                        <span>{file.owner}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      {file.starred && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                      {file.shared && (
                        <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                          <Users className="w-4 h-4 text-purple-400" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-purple-400" />
                      </button>
                      <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-purple-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Google Photos</h2>
                <p className="text-sm text-purple-400 mt-1">{photos.length} recent photos</p>
              </div>
              <button
                onClick={() => toast.success('Upload photo dialog opened')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-video w-full bg-purple-900/30 relative overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-3">
                    <div className="font-bold text-white mb-1">{photo.title}</div>
                    <div className="flex items-center gap-1 text-xs text-purple-400 mb-2">
                      {photo.location && (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span>{photo.location}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-purple-400">
                      <span>{formatTime(photo.date)}</span>
                      <span>{photo.dimensions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keep' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Google Keep</h2>
                <p className="text-sm text-purple-400 mt-1">{keepNotes.length} notes</p>
              </div>
              <button
                onClick={() => toast.success('New note created')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Note
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {keepNotes.filter(note => note.pinned).map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border-2 border-yellow-400/50 p-4 hover:shadow-lg transition-all cursor-pointer"
                  style={{ backgroundColor: note.color + '20' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-white">{note.title}</div>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  </div>

                  {note.checklist ? (
                    <div className="space-y-1 mb-3">
                      {note.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            readOnly
                            className="rounded"
                          />
                          <span className={`text-sm ${item.checked ? 'line-through text-purple-400' : 'text-purple-200'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-purple-200 mb-3 line-clamp-4">{note.content}</div>
                  )}

                  {note.labels && note.labels.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {note.labels.map((label, idx) => (
                        <span key={idx} className="bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded text-xs">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {keepNotes.filter(note => !note.pinned).map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-purple-500/20 p-4 hover:border-purple-400/40 hover:shadow-lg transition-all cursor-pointer"
                  style={{ backgroundColor: note.color + '20' }}
                >
                  <div className="font-bold text-white mb-2">{note.title}</div>

                  {note.checklist ? (
                    <div className="space-y-1 mb-3">
                      {note.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            readOnly
                            className="rounded"
                          />
                          <span className={`text-sm ${item.checked ? 'line-through text-purple-400' : 'text-purple-200'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-purple-200 mb-3 line-clamp-4">{note.content}</div>
                  )}

                  {note.labels && note.labels.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {note.labels.map((label, idx) => (
                        <span key={idx} className="bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded text-xs">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleEcosystemPage;
