import React, { useState, useEffect } from 'react';
import { GoogleHomeDashboard } from '../components/googlehome/GoogleHomeDashboard';
import {
  Mail,
  Calendar,
  Home,
  Cast,
  Inbox,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  unread: boolean;
  starred: boolean;
  timestamp: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  attendees?: string[];
}

const GoogleEcosystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'gmail' | 'calendar'>('home');
  const [emails, setEmails] = useState<Email[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    loadGmailData();
    loadCalendarData();
  }, []);

  const loadGmailData = async () => {
    // In production, use Gmail API
    // For now, mock data
    setEmails([
      {
        id: '1',
        from: 'noreply@github.com',
        subject: 'Your passive income bot made $125 today!',
        snippet: 'Congratulations! Your AI passive income strategies generated $125 in revenue...',
        unread: true,
        starred: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '2',
        from: 'Google Health',
        subject: 'Your Pixel Watch 2 weekly summary',
        snippet: 'Here\'s your health summary for this week. You walked 52,000 steps...',
        unread: true,
        starred: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: '3',
        from: 'Medium Partner Program',
        subject: 'Your AI-written article earned $45',
        snippet: 'Your article "10 AI Tools That Will Change Your Life" earned $45 this month...',
        unread: false,
        starred: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5)
      },
      {
        id: '4',
        from: 'Udemy',
        subject: 'Your course has 3 new enrollments',
        snippet: 'Great news! Your course "AI Mastery for Beginners" has 3 new students...',
        unread: false,
        starred: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ]);
    setGmailConnected(true);
  };

  const loadCalendarData = async () => {
    // In production, use Google Calendar API
    // For now, mock data
    const now = new Date();
    setEvents([
      {
        id: '1',
        title: 'Morning Medication Reminder',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 15),
        description: 'Take your morning medications'
      },
      {
        id: '2',
        title: 'Health Check-in with Pixel Watch',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 15),
        description: 'Review vitals and activity data'
      },
      {
        id: '3',
        title: 'Passive Income Review',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30),
        description: 'Check AI passive income performance'
      },
      {
        id: '4',
        title: 'Online Course Q&A Session',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0),
        location: 'Zoom',
        attendees: ['student1@email.com', 'student2@email.com']
      },
      {
        id: '5',
        title: 'Weekly Health Review',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0),
        description: 'Review weekly health metrics and adjust goals'
      }
    ]);
    setCalendarConnected(true);
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
            return email; // Would remove in production
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
    return `${days}d ago`;
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const tabs = [
    { id: 'home', label: 'Google Home & Hub', icon: <Home className="w-4 h-4" /> },
    { id: 'gmail', label: 'Gmail', icon: <Mail className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Google Ecosystem Integration
          </h1>
          <p className="text-purple-400">
            Unified control for Google Home, Gmail, and Calendar
          </p>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-bold text-white">Google Home</div>
                <div className="text-sm text-green-400">✓ Connected</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 p-4 rounded-xl border border-red-500/30">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-red-400" />
              <div>
                <div className="font-bold text-white">Gmail</div>
                <div className="text-sm text-green-400">
                  {gmailConnected ? '✓ Connected' : '✗ Not Connected'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-bold text-white">Calendar</div>
                <div className="text-sm text-green-400">
                  {calendarConnected ? '✓ Connected' : '✗ Not Connected'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-purple-900/20 p-1 rounded-lg border border-purple-500/30 mb-6 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-transparent text-purple-400 hover:bg-purple-500/10'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'home' && (
          <GoogleHomeDashboard />
        )}

        {activeTab === 'gmail' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Gmail Inbox</h2>
              <div className="flex items-center gap-2">
                <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-sm font-bold">
                  {emails.filter(e => e.unread).length} unread
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-purple-400 py-12">Loading emails...</div>
            ) : (
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className={`bg-gradient-to-r p-4 rounded-xl border transition-all ${
                      email.unread
                        ? 'from-purple-900/40 to-indigo-900/40 border-purple-500/40'
                        : 'from-purple-900/20 to-indigo-900/20 border-purple-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {email.unread && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          )}
                          <div className="font-bold text-white">{email.from}</div>
                          <div className="text-sm text-purple-400">{formatTime(email.timestamp)}</div>
                          {email.starred && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                        <div className={`text-lg mb-1 ${email.unread ? 'font-bold text-white' : 'text-purple-200'}`}>
                          {email.subject}
                        </div>
                        <div className="text-sm text-purple-400">{email.snippet}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {email.unread && (
                          <button
                            onClick={() => handleEmailAction(email.id, 'read')}
                            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4 text-purple-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEmailAction(email.id, 'star')}
                          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Star"
                        >
                          <Star className={`w-4 h-4 ${email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-purple-400'}`} />
                        </button>
                        <button
                          onClick={() => handleEmailAction(email.id, 'archive')}
                          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4 text-purple-400" />
                        </button>
                        <button
                          onClick={() => handleEmailAction(email.id, 'delete')}
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
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
              <button
                onClick={() => toast.info('Add event functionality coming soon!')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors font-bold"
              >
                + Add Event
              </button>
            </div>

            {loading ? (
              <div className="text-center text-purple-400 py-12">Loading calendar...</div>
            ) : (
              <div className="space-y-3">
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
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-blue-500/20 p-3 rounded-lg min-w-[80px]">
                          <div className="text-xs text-blue-400 uppercase">
                            {event.start.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {event.start.getDate()}
                          </div>
                          <div className="text-xs text-blue-400">
                            {formatEventTime(event.start)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-bold text-white text-lg">{event.title}</div>
                            {isToday && (
                              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold">
                                TODAY
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-purple-400 mb-2">
                            <Clock className="w-4 h-4" />
                            {formatEventTime(event.start)} - {formatEventTime(event.end)}
                            {event.location && (
                              <>
                                <span>•</span>
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>

                          {event.description && (
                            <div className="text-sm text-purple-300 mb-2">{event.description}</div>
                          )}

                          {event.attendees && event.attendees.length > 0 && (
                            <div className="text-xs text-purple-400">
                              {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleEcosystemPage;
