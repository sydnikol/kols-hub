import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Phone, Mail, MapPin, Calendar, Star, MessageSquare, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  facility: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  isPrimary: boolean;
  lastVisit?: string;
  nextAppointment?: string;
  notes: string;
  rating: number;
  tags: string[];
  createdDate: number;
}

const CareTeamDirectory: React.FC = () => {
  const [team, setTeam] = useState<CareTeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CareTeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<CareTeamMember>>({
    isPrimary: false,
    rating: 0,
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  const roles = [
    'Primary Care',
    'Cardiologist',
    'Neurologist',
    'Gastroenterologist',
    'Rheumatologist',
    'Pain Specialist',
    'Physical Therapist',
    'Mental Health',
    'Dentist',
    'Eye Doctor',
    'Pharmacist',
    'Case Manager',
    'Social Worker',
    'Other Specialist'
  ];

  const commonTags = [
    'POTS Specialist',
    'Chronic Pain',
    'Disability Forms',
    'Telehealth',
    'Accepts Insurance',
    'Accessible Office',
    'Wheelchair Accessible',
    'Good Listener',
    'Long Wait Times'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('care-team');
    if (stored) {
      setTeam(JSON.parse(stored));
    }
  }, []);

  const saveTeam = (newTeam: CareTeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem('care-team', JSON.stringify(newTeam));
  };

  const addMember = () => {
    if (!formData.name || !formData.role) {
      toast.error('Name and role required');
      return;
    }

    const newMember: CareTeamMember = {
      id: `member_${Date.now()}`,
      name: formData.name!,
      role: formData.role!,
      specialty: formData.specialty || '',
      facility: formData.facility || '',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      website: formData.website,
      isPrimary: formData.isPrimary || false,
      lastVisit: formData.lastVisit,
      nextAppointment: formData.nextAppointment,
      notes: formData.notes || '',
      rating: formData.rating || 0,
      tags: formData.tags || [],
      createdDate: Date.now(),
    };

    saveTeam([...team, newMember]);
    setFormData({ isPrimary: false, rating: 0, tags: [] });
    setShowForm(false);
    toast.success('Team member added');
  };

  const deleteMember = (id: string) => {
    saveTeam(team.filter(m => m.id !== id));
    toast.success('Member removed');
    if (selectedMember?.id === id) {
      setSelectedMember(null);
    }
  };

  const togglePrimary = (id: string) => {
    const updated = team.map(m =>
      m.id === id ? { ...m, isPrimary: !m.isPrimary } : m
    );
    saveTeam(updated);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), newTag]
    });
    setNewTag('');
  };

  const removeTag = (index: number) => {
    const tags = formData.tags || [];
    setFormData({
      ...formData,
      tags: tags.filter((_, i) => i !== index)
    });
  };

  const primaryProviders = team.filter(m => m.isPrimary).sort((a, b) => a.name.localeCompare(b.name));
  const otherProviders = team.filter(m => !m.isPrimary).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Care Team Directory</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Provider'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">Total Providers</span>
          </div>
          <p className="text-3xl font-bold text-white">{team.length}</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-pink-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-pink-400" />
            <span className="text-pink-300 text-sm font-semibold">Primary Team</span>
          </div>
          <p className="text-3xl font-bold text-white">{primaryProviders.length}</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-semibold">Upcoming Appts</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {team.filter(m => m.nextAppointment && new Date(m.nextAppointment) >= new Date()).length}
          </p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">Avg Rating</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {team.length > 0
              ? (team.reduce((sum, m) => sum + m.rating, 0) / team.filter(m => m.rating > 0).length || 0).toFixed(1)
              : '-'}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30 mb-6 space-y-4">
          <h3 className="text-purple-300 font-semibold text-lg">Add Care Team Member</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Dr. Jane Smith"
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Role *</label>
              <select
                value={formData.role || ''}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select role...</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Specialty</label>
              <input
                type="text"
                value={formData.specialty || ''}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                placeholder="POTS, Chronic Pain, etc."
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Facility</label>
              <input
                type="text"
                value={formData.facility || ''}
                onChange={(e) => setFormData({...formData, facility: e.target.value})}
                placeholder="City Hospital, ABC Clinic"
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="provider@clinic.com"
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm font-semibold mb-2">Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Medical Plaza, City, State 12345"
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Last Visit</label>
              <input
                type="date"
                value={formData.lastVisit || ''}
                onChange={(e) => setFormData({...formData, lastVisit: e.target.value})}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Next Appointment</label>
              <input
                type="date"
                value={formData.nextAppointment || ''}
                onChange={(e) => setFormData({...formData, nextAppointment: e.target.value})}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm font-semibold mb-2">Rating (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFormData({...formData, rating})}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    (formData.rating || 0) >= rating
                      ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                      : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                  }`}
                >
                  ⭐ {rating}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm font-semibold mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add custom tag..."
                className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-purple-600/30 hover:bg-purple-500/40 text-purple-300 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFormData({...formData, tags: [...(formData.tags || []), tag]})}
                  className="px-2 py-1 bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 text-xs rounded transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  {tag}
                  <button onClick={() => removeTag(idx)} className="hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Important info, preferences, communication style..."
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})}
              className="w-4 h-4"
            />
            <label htmlFor="isPrimary" className="text-purple-300 font-semibold">
              Mark as Primary Care Team Member
            </label>
          </div>

          <button
            onClick={addMember}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Team Member
          </button>
        </div>
      )}

      {/* Primary Care Team */}
      {primaryProviders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Primary Care Team
          </h3>
          <div className="space-y-3">
            {primaryProviders.map(member => (
              <div key={member.id} className="bg-black/40 p-4 rounded-lg border-2 border-yellow-500/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-bold text-lg">{member.name}</h4>
                      {member.rating > 0 && (
                        <span className="text-yellow-400">
                          {'⭐'.repeat(member.rating)}
                        </span>
                      )}
                    </div>
                    <p className="text-purple-300 font-semibold">{member.role}</p>
                    {member.specialty && <p className="text-gray-400 text-sm">{member.specialty}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePrimary(member.id)}
                      className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
                      title="Remove from primary team"
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {member.facility && (
                    <div className="flex items-start gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{member.facility}</span>
                    </div>
                  )}

                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-400" />
                      <a href={`tel:${member.phone}`} className="text-green-300 hover:text-green-200">
                        {member.phone}
                      </a>
                    </div>
                  )}

                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <a href={`mailto:${member.email}`} className="text-blue-300 hover:text-blue-200 truncate">
                        {member.email}
                      </a>
                    </div>
                  )}

                  {member.nextAppointment && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300">
                        Next: {new Date(member.nextAppointment).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {member.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {member.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {member.notes && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-400 text-sm italic">{member.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Providers */}
      {otherProviders.length > 0 && (
        <div>
          <h3 className="text-gray-400 font-semibold mb-3">Other Providers</h3>
          <div className="space-y-2">
            {otherProviders.map(member => (
              <div key={member.id} className="bg-black/20 p-3 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{member.name}</span>
                      <span className="text-gray-400 text-sm">- {member.role}</span>
                      {member.rating > 0 && (
                        <span className="text-yellow-400 text-sm">
                          {'⭐'.repeat(member.rating)}
                        </span>
                      )}
                    </div>
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="text-green-400 text-sm hover:text-green-300">
                        {member.phone}
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePrimary(member.id)}
                      className="p-1 hover:bg-yellow-500/20 rounded"
                      title="Add to primary team"
                    >
                      <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {team.length === 0 && (
        <div className="text-center text-purple-400 py-12">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No care team members yet</p>
          <p className="text-sm mt-2">Click "Add Provider" to start building your care team directory</p>
        </div>
      )}

      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
        <p className="text-purple-300 text-xs">
          <span className="font-bold">Care Team Management:</span> Keep all provider contact info organized. Star your primary team for quick access. Track appointments, ratings, and important notes about each provider.
        </p>
      </div>
    </div>
  );
};

export default CareTeamDirectory;
