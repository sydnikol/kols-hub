import { useState } from 'react'
import { Mail, Send, Inbox, Star, Archive, Trash2, Search, Plus, RefreshCw, User, Calendar, Paperclip, Activity, FileText, Pill, Phone } from 'lucide-react'

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  read: boolean
  starred: boolean
  hasAttachment: boolean
}

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  lastContact?: string
}

function Communications() {
  const [view, setView] = useState<'email' | 'contacts' | 'mychart' | 'myuhealth'>('email')
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      from: 'Dr. Smith',
      subject: 'Test Results Available',
      preview: 'Your recent lab results are now available in MyChart...',
      time: '2h ago',
      read: false,
      starred: true,
      hasAttachment: true
    },
    {
      id: '2',
      from: 'Pharmacy',
      subject: 'Prescription Ready for Pickup',
      preview: 'Your prescription is ready at CVS Pharmacy...',
      time: '5h ago',
      read: false,
      starred: false,
      hasAttachment: false
    }
  ])

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. Smith',
      email: 'dr.smith@hospital.com',
      phone: '(555) 123-4567',
      lastContact: '2 days ago'
    },
    {
      id: '2',
      name: 'Mom',
      email: 'mom@example.com',
      phone: '(555) 987-6543',
      lastContact: '1 day ago'
    }
  ])

  const toggleStar = (emailId: string) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">📬 Communications Hub</h2>
            <p className="text-blue-100">Email, Contacts, MyChart & myUHealth - All in one place</p>
          </div>
          <Mail className="h-16 w-16 opacity-50" />
        </div>
      </div>

      {/* View Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg">
        <button
          onClick={() => setView('email')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
            view === 'email'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Mail className="h-5 w-5 inline mr-2" />
          Email
        </button>
        <button
          onClick={() => setView('contacts')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
            view === 'contacts'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <User className="h-5 w-5 inline mr-2" />
          Contacts
        </button>
        <button
          onClick={() => setView('mychart')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
            view === 'mychart'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5 inline mr-2" />
          MyChart
        </button>
        <button
          onClick={() => setView('myuhealth')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
            view === 'myuhealth'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Activity className="h-5 w-5 inline mr-2" />
          myUHealth
        </button>
      </div>

      {/* Email View */}
      {view === 'email' && (
        <div className="space-y-4">
          {/* Email Actions */}
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </button>
            <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-md border border-gray-300 dark:border-gray-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Email List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {emails.map(email => (
              <div
                key={email.id}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${
                  !email.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-semibold ${!email.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {email.from}
                      </span>
                      {email.hasAttachment && (
                        <Paperclip className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className={`font-medium mb-1 ${!email.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {email.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {email.preview}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {email.time}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(email.id)
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className={`h-5 w-5 ${email.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Integration Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 inline mr-2" />
              <strong>Gmail Integration:</strong> Connect your Gmail account in Settings to sync your real emails here!
            </p>
          </div>
        </div>
      )}

      {/* Contacts View */}
      {view === 'contacts' && (
        <div className="space-y-4">
          <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Contact</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {contact.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{contact.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                    {contact.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</p>
                    )}
                  </div>
                </div>
                {contact.lastContact && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Last contact: {contact.lastContact}
                  </p>
                )}
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </button>
                  <button className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold">
                    <Send className="h-4 w-4 inline mr-1" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 inline mr-2" />
              <strong>Phone Sync:</strong> Enable phone contacts sync in Settings to access all your contacts here!
            </p>
          </div>
        </div>
      )}

      {/* MyChart View */}
      {view === 'mychart' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Connect to MyChart
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Access your medical records, appointments, test results, and more
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg font-semibold">
                Connect MyChart Account
              </button>
            </div>
          </div>

          {/* MyChart Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <Calendar className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Appointments</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">View & schedule</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <Mail className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Messages</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contact providers</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <FileText className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Test Results</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lab results</p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 inline mr-2" />
              <strong>MyChart Integration:</strong> Securely connect your MyChart account to view all your health information in one place!
            </p>
          </div>
        </div>
      )}

      {/* myUHealth View */}
      {view === 'myuhealth' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-center py-8">
              <Activity className="h-16 w-16 mx-auto text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Connect to myUHealth Patient Portal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Access University of Miami Health System records, appointments, prescriptions, and secure messaging
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all shadow-lg font-semibold">
                Connect myUHealth Account
              </button>
            </div>
          </div>

          {/* myUHealth Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <Calendar className="h-8 w-8 mx-auto text-teal-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Appointments</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Schedule & manage</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <Pill className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Prescriptions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Request refills</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <FileText className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Medical Records</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">View history</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
              <Mail className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Secure Messages</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contact care team</p>
            </div>
          </div>

          {/* University of Miami Health System Info */}
          <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500 p-4 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <Activity className="h-4 w-4 inline mr-2" />
              <strong>myUHealth Portal:</strong> Connect to University of Miami Health System for complete access to your UHealth medical records, test results, and care team communication!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg">
              <Phone className="h-6 w-6 mx-auto mb-2" />
              <p className="font-semibold">Call UHealth</p>
              <p className="text-xs opacity-75 mt-1">305-243-4000</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <p className="font-semibold">Find a Doctor</p>
              <p className="text-xs opacity-75 mt-1">Search providers</p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Communications
