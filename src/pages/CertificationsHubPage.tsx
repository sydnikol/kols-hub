import React, { useState, useEffect } from 'react';
import { Award, Calendar, FileText, TrendingUp, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Certification {
  id: string;
  name: string;
  provider: string;
  category: 'tech' | 'business' | 'healthcare' | 'education' | 'trade' | 'other';
  status: 'planning' | 'studying' | 'scheduled' | 'passed' | 'failed' | 'expired';
  examDate?: string;
  earnedDate?: string;
  expirationDate?: string;
  score?: number;
  cost: number;
  notes: string;
}

interface StudyMaterial {
  id: string;
  certificationId: string;
  certificationName: string;
  name: string;
  type: 'book' | 'course' | 'practice-exam' | 'video' | 'other';
  progress: number; // 0-100
  completed: boolean;
  notes: string;
}

const CertificationsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certs' | 'study' | 'stats'>('certs');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    const savedCerts = localStorage.getItem('certifications');
    if (savedCerts) setCertifications(JSON.parse(savedCerts));
    const savedMaterials = localStorage.getItem('studyMaterials');
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
  }, []);

  useEffect(() => { localStorage.setItem('certifications', JSON.stringify(certifications)); }, [certifications]);
  useEffect(() => { localStorage.setItem('studyMaterials', JSON.stringify(materials)); }, [materials]);

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      provider: '',
      category: 'tech',
      status: 'planning',
      cost: 0,
      notes: '',
    };
    setCertifications([...certifications, newCert]);
    toast.success('Certification added');
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Certification updated');
  };

  const deleteCertification = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
    toast.success('Certification deleted');
  };

  const activeCerts = certifications.filter(c => c.status === 'studying' || c.status === 'scheduled').length;
  const earnedCerts = certifications.filter(c => c.status === 'passed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 pb-20">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Certifications Hub</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{earnedCerts}</div>
            <div className="text-xs opacity-90">Earned</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeCerts}</div>
            <div className="text-xs opacity-90">In Progress</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{certifications.length}</div>
            <div className="text-xs opacity-90">Total</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'certs', label: 'Certifications', icon: Award },
            { id: 'study', label: 'Study Materials', icon: FileText },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50' : 'text-gray-600 hover:text-violet-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'certs' && (
          <div className="space-y-4">
            <button onClick={addCertification} className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Certification</span>
            </button>
            {certifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No certifications yet. Track your credentials!</p>
              </div>
            ) : (
              certifications.map(cert => (
                <div key={cert.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${cert.status === 'passed' ? 'border-green-500' : 'border-violet-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} placeholder="Certification name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-violet-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteCertification(cert.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input type="text" value={cert.provider} onChange={(e) => updateCertification(cert.id, { provider: e.target.value })} placeholder="Provider..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" />
                    <select value={cert.category} onChange={(e) => updateCertification(cert.id, { category: e.target.value as Certification['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none">
                      <option value="tech">Technology</option>
                      <option value="business">Business</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="trade">Trade</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={cert.status} onChange={(e) => updateCertification(cert.id, { status: e.target.value as Certification['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none">
                      <option value="planning">Planning</option>
                      <option value="studying">Studying</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <textarea value={cert.notes} onChange={(e) => updateCertification(cert.id, { notes: e.target.value })} placeholder="Notes, exam tips..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-violet-600">Certification Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Certifications:</span>
                  <span className="font-semibold">{certifications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Earned:</span>
                  <span className="font-semibold">{earnedCerts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-semibold">{activeCerts}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsHubPage;
