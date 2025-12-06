import React, { useState, useEffect } from 'react';
import { Award, Calendar, FileText, TrendingUp, Plus, Trash2, Star, BookOpen, Video, ClipboardList, GraduationCap, Clock, Check, Edit2, Save, X } from 'lucide-react';
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

interface StudyResource {
  id: string;
  certificationId: string;
  certificationName: string;
  name: string;
  type: 'book' | 'course' | 'practice-test' | 'video' | 'documentation';
  progress: number;
  completed: boolean;
  timeSpent: number;
  notes: string;
  url?: string;
  rating: number;
}

interface StudySession {
  id: string;
  certificationId: string;
  certificationName: string;
  resourceId: string;
  resourceName: string;
  date: string;
  duration: number;
  topics: string;
  notes: string;
}

interface StudySchedule {
  id: string;
  certificationId: string;
  certificationName: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  completed: boolean;
}

const CertificationsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certs' | 'study' | 'stats'>('certs');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [studyResources, setStudyResources] = useState<StudyResource[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [studySchedule, setStudySchedule] = useState<StudySchedule[]>([]);
  const [selectedCertForStudy, setSelectedCertForStudy] = useState<string>('all');
  const [studyView, setStudyView] = useState<'resources' | 'sessions' | 'schedule'>('resources');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const savedCerts = localStorage.getItem('certifications');
    if (savedCerts) {
      setCertifications(JSON.parse(savedCerts));
    } else {
      // Initialize with sample certifications
      const sampleCerts: Certification[] = [
        {
          id: '1',
          name: 'AWS Certified Solutions Architect - Associate',
          provider: 'Amazon Web Services',
          category: 'tech',
          status: 'studying',
          examDate: '2025-03-15',
          cost: 150,
          notes: 'Focus on EC2, S3, and VPC services. Practice exam required.',
        },
        {
          id: '2',
          name: 'Certified Information Systems Security Professional (CISSP)',
          provider: 'ISC2',
          category: 'tech',
          status: 'planning',
          cost: 749,
          notes: 'Requires 5 years of experience. Study all 8 domains.',
        },
        {
          id: '3',
          name: 'Project Management Professional (PMP)',
          provider: 'PMI',
          category: 'business',
          status: 'studying',
          examDate: '2025-04-20',
          cost: 555,
          notes: 'PMBOK Guide 7th edition. 35 contact hours required.',
        },
        {
          id: '4',
          name: 'Microsoft Azure Administrator',
          provider: 'Microsoft',
          category: 'tech',
          status: 'passed',
          earnedDate: '2024-11-05',
          score: 850,
          cost: 165,
          notes: 'Valid for 2 years. Renewal required by Nov 2026.',
        },
      ];
      setCertifications(sampleCerts);
    }

    const savedResources = localStorage.getItem('studyResources');
    if (savedResources) {
      setStudyResources(JSON.parse(savedResources));
    } else {
      // Initialize with sample study resources
      const sampleResources: StudyResource[] = [
        {
          id: 'r1',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          name: 'AWS Certified Solutions Architect Official Study Guide',
          type: 'book',
          progress: 65,
          completed: false,
          timeSpent: 28,
          notes: 'Great coverage of core services. Chapter 7 on VPC is essential.',
          rating: 5,
        },
        {
          id: 'r2',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          name: 'A Cloud Guru SAA-C03 Course',
          type: 'course',
          progress: 82,
          completed: false,
          timeSpent: 45,
          notes: 'Excellent hands-on labs. Instructor explanations are clear.',
          url: 'https://acloudguru.com',
          rating: 5,
        },
        {
          id: 'r3',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          name: 'AWS Practice Exams by Jon Bonso',
          type: 'practice-test',
          progress: 40,
          completed: false,
          timeSpent: 12,
          notes: 'Challenging questions. Score improving from 68% to 78%.',
          rating: 5,
        },
        {
          id: 'r4',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          name: 'AWS Well-Architected Framework',
          type: 'documentation',
          progress: 30,
          completed: false,
          timeSpent: 8,
          notes: 'Official AWS documentation. Five pillars framework.',
          url: 'https://aws.amazon.com/architecture/well-architected/',
          rating: 4,
        },
        {
          id: 'r5',
          certificationId: '2',
          certificationName: 'Certified Information Systems Security Professional (CISSP)',
          name: 'CISSP Official Study Guide 9th Edition',
          type: 'book',
          progress: 25,
          completed: false,
          timeSpent: 18,
          notes: 'Comprehensive coverage. 1000+ pages. Taking detailed notes.',
          rating: 5,
        },
        {
          id: 'r6',
          certificationId: '2',
          certificationName: 'Certified Information Systems Security Professional (CISSP)',
          name: 'Cybrary CISSP Course',
          type: 'course',
          progress: 35,
          completed: false,
          timeSpent: 24,
          notes: 'Free resource. Good for Domain 1-3 overview.',
          url: 'https://cybrary.com',
          rating: 4,
        },
        {
          id: 'r7',
          certificationId: '2',
          certificationName: 'Certified Information Systems Security Professional (CISSP)',
          name: 'Kelly Handerhan CISSP Videos',
          type: 'video',
          progress: 20,
          completed: false,
          timeSpent: 15,
          notes: 'Think like a manager approach. Very helpful mindset shift.',
          rating: 5,
        },
        {
          id: 'r8',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          name: 'PMBOK Guide 7th Edition',
          type: 'book',
          progress: 55,
          completed: false,
          timeSpent: 32,
          notes: 'Official PMI guide. Principles-based approach is new.',
          rating: 4,
        },
        {
          id: 'r9',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          name: 'Joseph Phillips PMP Udemy Course',
          type: 'course',
          progress: 70,
          completed: false,
          timeSpent: 48,
          notes: '35 contact hours. Engaging instructor. Great practice quizzes.',
          url: 'https://udemy.com',
          rating: 5,
        },
        {
          id: 'r10',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          name: 'PMP Exam Prep Simplified',
          type: 'book',
          progress: 45,
          completed: false,
          timeSpent: 20,
          notes: 'Easy to read. Good for quick review of formulas.',
          rating: 4,
        },
        {
          id: 'r11',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          name: 'PrepCast PMP Simulator',
          type: 'practice-test',
          progress: 60,
          completed: false,
          timeSpent: 22,
          notes: 'Realistic exam simulator. Detailed explanations. Currently scoring 72%.',
          rating: 5,
        },
        {
          id: 'r12',
          certificationId: '4',
          certificationName: 'Microsoft Azure Administrator',
          name: 'Microsoft Learn AZ-104 Path',
          type: 'documentation',
          progress: 100,
          completed: true,
          timeSpent: 40,
          notes: 'Official Microsoft training. Free and comprehensive.',
          url: 'https://learn.microsoft.com',
          rating: 5,
        },
      ];
      setStudyResources(sampleResources);
    }

    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions));
    } else {
      // Initialize with sample study sessions
      const sampleSessions: StudySession[] = [
        {
          id: 's1',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          resourceId: 'r2',
          resourceName: 'A Cloud Guru SAA-C03 Course',
          date: '2025-01-19',
          duration: 120,
          topics: 'EC2 Instance Types, Auto Scaling, Load Balancing',
          notes: 'Completed compute section. Practiced launching instances.',
        },
        {
          id: 's2',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          resourceId: 'r3',
          resourceName: 'AWS Practice Exams by Jon Bonso',
          date: '2025-01-20',
          duration: 90,
          topics: 'Practice Test 1 - Full exam simulation',
          notes: 'Scored 78%. Weak on S3 security and VPC peering.',
        },
        {
          id: 's3',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          resourceId: 'r9',
          resourceName: 'Joseph Phillips PMP Udemy Course',
          date: '2025-01-18',
          duration: 150,
          topics: 'Agile frameworks, Scrum vs Kanban',
          notes: 'Agile concepts clicking. Need to review hybrid approaches.',
        },
        {
          id: 's4',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          resourceId: 'r8',
          resourceName: 'PMBOK Guide 7th Edition',
          date: '2025-01-17',
          duration: 105,
          topics: 'Performance domains, Tailoring considerations',
          notes: 'New structure different from 6th edition. Making flashcards.',
        },
        {
          id: 's5',
          certificationId: '2',
          certificationName: 'Certified Information Systems Security Professional (CISSP)',
          resourceId: 'r5',
          resourceName: 'CISSP Official Study Guide 9th Edition',
          date: '2025-01-16',
          duration: 135,
          topics: 'Domain 1: Security and Risk Management',
          notes: 'CIA triad, governance, compliance frameworks covered.',
        },
      ];
      setStudySessions(sampleSessions);
    }

    const savedSchedule = localStorage.getItem('studySchedule');
    if (savedSchedule) {
      setStudySchedule(JSON.parse(savedSchedule));
    } else {
      // Initialize with sample study schedule
      const sampleSchedule: StudySchedule[] = [
        {
          id: 'sch1',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          date: '2025-01-22',
          time: '18:00',
          duration: 120,
          topic: 'S3 Storage Classes and Lifecycle Policies',
          completed: false,
        },
        {
          id: 'sch2',
          certificationId: '1',
          certificationName: 'AWS Certified Solutions Architect - Associate',
          date: '2025-01-23',
          time: '19:00',
          duration: 90,
          topic: 'VPC Networking and Security Groups',
          completed: false,
        },
        {
          id: 'sch3',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          date: '2025-01-22',
          time: '20:00',
          duration: 120,
          topic: 'Predictive vs Adaptive Project Management',
          completed: false,
        },
        {
          id: 'sch4',
          certificationId: '3',
          certificationName: 'Project Management Professional (PMP)',
          date: '2025-01-24',
          time: '18:30',
          duration: 150,
          topic: 'Practice Questions Review Session',
          completed: false,
        },
        {
          id: 'sch5',
          certificationId: '2',
          certificationName: 'Certified Information Systems Security Professional (CISSP)',
          date: '2025-01-25',
          time: '17:00',
          duration: 120,
          topic: 'Domain 2: Asset Security',
          completed: false,
        },
      ];
      setStudySchedule(sampleSchedule);
    }
  }, []);

  useEffect(() => { localStorage.setItem('certifications', JSON.stringify(certifications)); }, [certifications]);
  useEffect(() => { localStorage.setItem('studyResources', JSON.stringify(studyResources)); }, [studyResources]);
  useEffect(() => { localStorage.setItem('studySessions', JSON.stringify(studySessions)); }, [studySessions]);
  useEffect(() => { localStorage.setItem('studySchedule', JSON.stringify(studySchedule)); }, [studySchedule]);

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

  const addStudyResource = () => {
    if (certifications.length === 0) {
      toast.error('Please add a certification first');
      return;
    }
    const firstCert = certifications[0];
    const newResource: StudyResource = {
      id: Date.now().toString(),
      certificationId: firstCert.id,
      certificationName: firstCert.name,
      name: '',
      type: 'book',
      progress: 0,
      completed: false,
      timeSpent: 0,
      notes: '',
      rating: 0,
    };
    setStudyResources([...studyResources, newResource]);
    toast.success('Study resource added');
  };

  const updateStudyResource = (id: string, updates: Partial<StudyResource>) => {
    setStudyResources(studyResources.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteStudyResource = (id: string) => {
    setStudyResources(studyResources.filter(r => r.id !== id));
    toast.success('Resource deleted');
  };

  const addStudySession = () => {
    if (certifications.length === 0) {
      toast.error('Please add a certification first');
      return;
    }
    const firstCert = certifications[0];
    const newSession: StudySession = {
      id: Date.now().toString(),
      certificationId: firstCert.id,
      certificationName: firstCert.name,
      resourceId: '',
      resourceName: '',
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      topics: '',
      notes: '',
    };
    setStudySessions([...studySessions, newSession]);
    toast.success('Study session added');
  };

  const updateStudySession = (id: string, updates: Partial<StudySession>) => {
    setStudySessions(studySessions.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudySession = (id: string) => {
    setStudySessions(studySessions.filter(s => s.id !== id));
    toast.success('Session deleted');
  };

  const addScheduleItem = () => {
    if (certifications.length === 0) {
      toast.error('Please add a certification first');
      return;
    }
    const firstCert = certifications[0];
    const newItem: StudySchedule = {
      id: Date.now().toString(),
      certificationId: firstCert.id,
      certificationName: firstCert.name,
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      duration: 60,
      topic: '',
      completed: false,
    };
    setStudySchedule([...studySchedule, newItem]);
    toast.success('Schedule item added');
  };

  const updateScheduleItem = (id: string, updates: Partial<StudySchedule>) => {
    setStudySchedule(studySchedule.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteScheduleItem = (id: string) => {
    setStudySchedule(studySchedule.filter(s => s.id !== id));
    toast.success('Schedule item deleted');
  };

  const startEditNote = (resourceId: string, currentNote: string) => {
    setEditingNote(resourceId);
    setNoteText(currentNote);
  };

  const saveNote = (resourceId: string) => {
    updateStudyResource(resourceId, { notes: noteText });
    setEditingNote(null);
    toast.success('Note saved');
  };

  const cancelEditNote = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const activeCerts = certifications.filter(c => c.status === 'studying' || c.status === 'scheduled').length;
  const earnedCerts = certifications.filter(c => c.status === 'passed').length;
  const totalStudyTime = studySessions.reduce((acc, s) => acc + s.duration, 0);
  const avgStudyTime = studySessions.length > 0 ? Math.round(totalStudyTime / studySessions.length) : 0;

  const filteredResources = selectedCertForStudy === 'all'
    ? studyResources
    : studyResources.filter(r => r.certificationId === selectedCertForStudy);

  const filteredSessions = selectedCertForStudy === 'all'
    ? studySessions
    : studySessions.filter(s => s.certificationId === selectedCertForStudy);

  const filteredSchedule = selectedCertForStudy === 'all'
    ? studySchedule
    : studySchedule.filter(s => s.certificationId === selectedCertForStudy);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'course': return GraduationCap;
      case 'practice-test': return ClipboardList;
      case 'video': return Video;
      case 'documentation': return FileText;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-300';
      case 'studying': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'planning': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-20">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white p-6 shadow-lg">
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
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'certs' && (
          <div className="space-y-4">
            <button onClick={addCertification} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2 shadow-md">
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
                <div key={cert.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${cert.status === 'passed' ? 'border-green-500' : cert.status === 'studying' ? 'border-amber-500' : 'border-orange-400'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} placeholder="Certification name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteCertification(cert.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input type="text" value={cert.provider} onChange={(e) => updateCertification(cert.id, { provider: e.target.value })} placeholder="Provider..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none" />
                    <select value={cert.category} onChange={(e) => updateCertification(cert.id, { category: e.target.value as Certification['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none">
                      <option value="tech">Technology</option>
                      <option value="business">Business</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="trade">Trade</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={cert.status} onChange={(e) => updateCertification(cert.id, { status: e.target.value as Certification['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none">
                      <option value="planning">Planning</option>
                      <option value="studying">Studying</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="expired">Expired</option>
                    </select>
                    {cert.examDate && (
                      <input type="date" value={cert.examDate} onChange={(e) => updateCertification(cert.id, { examDate: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none" />
                    )}
                    {cert.status === 'passed' && cert.score && (
                      <div className="bg-green-50 px-3 py-2 rounded border border-green-300 text-sm font-medium text-green-800">
                        Score: {cert.score}
                      </div>
                    )}
                  </div>
                  <textarea value={cert.notes} onChange={(e) => updateCertification(cert.id, { notes: e.target.value })} placeholder="Notes, exam tips, requirements..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'study' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-amber-900">Filter by Certification</h3>
                <select
                  value={selectedCertForStudy}
                  onChange={(e) => setSelectedCertForStudy(e.target.value)}
                  className="text-sm bg-amber-50 px-3 py-2 rounded border border-amber-300 focus:border-amber-500 outline-none"
                >
                  <option value="all">All Certifications</option>
                  {certifications.map(cert => (
                    <option key={cert.id} value={cert.id}>{cert.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setStudyView('resources')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${studyView === 'resources' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Resources
                </button>
                <button
                  onClick={() => setStudyView('sessions')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${studyView === 'sessions' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                >
                  <Clock className="w-4 h-4 inline mr-1" />
                  Sessions
                </button>
                <button
                  onClick={() => setStudyView('schedule')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${studyView === 'schedule' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Schedule
                </button>
              </div>
            </div>

            {studyView === 'resources' && (
              <div className="space-y-4">
                <button onClick={addStudyResource} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2 shadow-md">
                  <Plus className="w-5 h-5" />
                  <span>Add Study Resource</span>
                </button>
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No study resources yet. Add your materials!</p>
                  </div>
                ) : (
                  filteredResources.map(resource => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                      <div key={resource.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <Icon className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <input
                                type="text"
                                value={resource.name}
                                onChange={(e) => updateStudyResource(resource.id, { name: e.target.value })}
                                placeholder="Resource name..."
                                className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none w-full mb-1"
                              />
                              <select
                                value={resource.certificationId}
                                onChange={(e) => {
                                  const cert = certifications.find(c => c.id === e.target.value);
                                  updateStudyResource(resource.id, {
                                    certificationId: e.target.value,
                                    certificationName: cert?.name || ''
                                  });
                                }}
                                className="text-xs bg-amber-50 px-2 py-1 rounded border border-amber-300 focus:border-amber-500 outline-none"
                              >
                                {certifications.map(cert => (
                                  <option key={cert.id} value={cert.id}>{cert.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button onClick={() => deleteStudyResource(resource.id)} className="text-red-500 hover:text-red-700 ml-2">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <select
                            value={resource.type}
                            onChange={(e) => updateStudyResource(resource.id, { type: e.target.value as StudyResource['type'] })}
                            className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none"
                          >
                            <option value="book">Book</option>
                            <option value="course">Online Course</option>
                            <option value="practice-test">Practice Test</option>
                            <option value="video">Video Series</option>
                            <option value="documentation">Documentation</option>
                          </select>
                          <input
                            type="number"
                            value={resource.timeSpent}
                            onChange={(e) => updateStudyResource(resource.id, { timeSpent: parseInt(e.target.value) || 0 })}
                            placeholder="Hours spent..."
                            className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-amber-700">{resource.progress}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300 rounded-full"
                                style={{ width: `${resource.progress}%` }}
                              />
                            </div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={resource.progress}
                              onChange={(e) => {
                                const progress = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                updateStudyResource(resource.id, {
                                  progress,
                                  completed: progress === 100
                                });
                              }}
                              className="w-16 text-sm bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:border-amber-500 outline-none text-center"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => updateStudyResource(resource.id, { rating: star })}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-5 h-5 ${star <= resource.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                                />
                              </button>
                            ))}
                          </div>
                          {resource.completed && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center">
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          )}
                        </div>

                        {resource.url && (
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => updateStudyResource(resource.id, { url: e.target.value })}
                            placeholder="URL..."
                            className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none mb-2"
                          />
                        )}

                        <div className="relative">
                          {editingNote === resource.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Notes and highlights..."
                                className="w-full text-sm bg-amber-50 px-3 py-2 rounded border border-amber-300 focus:border-amber-500 outline-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => saveNote(resource.id)}
                                  className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditNote}
                                  className="flex-1 bg-gray-400 text-white py-2 rounded text-sm font-medium hover:bg-gray-500 transition-colors flex items-center justify-center"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditNote(resource.id, resource.notes)}
                              className="w-full text-sm bg-amber-50 px-3 py-2 rounded border border-amber-300 cursor-pointer hover:border-amber-500 transition-colors min-h-[60px] flex items-start justify-between"
                            >
                              <span className={resource.notes ? 'text-gray-700' : 'text-gray-400'}>
                                {resource.notes || 'Click to add notes and highlights...'}
                              </span>
                              <Edit2 className="w-4 h-4 text-amber-600 flex-shrink-0 ml-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {studyView === 'sessions' && (
              <div className="space-y-4">
                <button onClick={addStudySession} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2 shadow-md">
                  <Plus className="w-5 h-5" />
                  <span>Log Study Session</span>
                </button>
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No study sessions logged yet. Track your study time!</p>
                  </div>
                ) : (
                  filteredSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => (
                    <div key={session.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <select
                            value={session.certificationId}
                            onChange={(e) => {
                              const cert = certifications.find(c => c.id === e.target.value);
                              updateStudySession(session.id, {
                                certificationId: e.target.value,
                                certificationName: cert?.name || ''
                              });
                            }}
                            className="w-full text-sm font-semibold bg-amber-50 px-3 py-2 rounded border border-amber-300 focus:border-amber-500 outline-none mb-2"
                          >
                            {certifications.map(cert => (
                              <option key={cert.id} value={cert.id}>{cert.name}</option>
                            ))}
                          </select>
                        </div>
                        <button onClick={() => deleteStudySession(session.id)} className="text-red-500 hover:text-red-700 ml-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="date"
                          value={session.date}
                          onChange={(e) => updateStudySession(session.id, { date: e.target.value })}
                          className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none"
                        />
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <input
                            type="number"
                            value={session.duration}
                            onChange={(e) => updateStudySession(session.id, { duration: parseInt(e.target.value) || 0 })}
                            placeholder="Minutes..."
                            className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none"
                          />
                          <span className="text-sm text-gray-600">min</span>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={session.topics}
                        onChange={(e) => updateStudySession(session.id, { topics: e.target.value })}
                        placeholder="Topics covered..."
                        className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-amber-500 outline-none mb-2"
                      />

                      <textarea
                        value={session.notes}
                        onChange={(e) => updateStudySession(session.id, { notes: e.target.value })}
                        placeholder="Session notes, key learnings..."
                        className="w-full text-sm bg-amber-50 px-3 py-2 rounded border border-amber-300 focus:border-amber-500 outline-none"
                        rows={2}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {studyView === 'schedule' && (
              <div className="space-y-4">
                <button onClick={addScheduleItem} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2 shadow-md">
                  <Plus className="w-5 h-5" />
                  <span>Add to Schedule</span>
                </button>
                {filteredSchedule.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No study sessions scheduled. Plan your study time!</p>
                  </div>
                ) : (
                  filteredSchedule.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(item => (
                    <div key={item.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${item.completed ? 'border-green-500 opacity-75' : 'border-blue-500'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <select
                            value={item.certificationId}
                            onChange={(e) => {
                              const cert = certifications.find(c => c.id === e.target.value);
                              updateScheduleItem(item.id, {
                                certificationId: e.target.value,
                                certificationName: cert?.name || ''
                              });
                            }}
                            className="w-full text-sm font-semibold bg-blue-50 px-3 py-2 rounded border border-blue-300 focus:border-blue-500 outline-none mb-2"
                          >
                            {certifications.map(cert => (
                              <option key={cert.id} value={cert.id}>{cert.name}</option>
                            ))}
                          </select>
                        </div>
                        <button onClick={() => deleteScheduleItem(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateScheduleItem(item.id, { date: e.target.value })}
                          className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                        />
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => updateScheduleItem(item.id, { time: e.target.value })}
                          className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                        />
                        <div className="col-span-2 flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <input
                            type="number"
                            value={item.duration}
                            onChange={(e) => updateScheduleItem(item.id, { duration: parseInt(e.target.value) || 0 })}
                            placeholder="Duration..."
                            className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                          />
                          <span className="text-sm text-gray-600">minutes</span>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={item.topic}
                        onChange={(e) => updateScheduleItem(item.id, { topic: e.target.value })}
                        placeholder="Topic or focus area..."
                        className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-3"
                      />

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => updateScheduleItem(item.id, { completed: e.target.checked })}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Mark as completed</span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Certification Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Certifications:</span>
                  <span className="font-semibold text-lg text-amber-900">{certifications.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Earned:</span>
                  <span className="font-semibold text-lg text-green-700">{earnedCerts}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-semibold text-lg text-amber-700">{activeCerts}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Planning:</span>
                  <span className="font-semibold text-lg text-gray-700">{certifications.filter(c => c.status === 'planning').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Study Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Study Resources:</span>
                  <span className="font-semibold text-lg text-amber-900">{studyResources.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Completed Resources:</span>
                  <span className="font-semibold text-lg text-green-700">{studyResources.filter(r => r.completed).length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Avg. Resource Progress:</span>
                  <span className="font-semibold text-lg text-amber-700">
                    {studyResources.length > 0 ? Math.round(studyResources.reduce((acc, r) => acc + r.progress, 0) / studyResources.length) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Study Time:</span>
                  <span className="font-semibold text-lg text-amber-900">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Study Sessions:</span>
                  <span className="font-semibold text-lg text-amber-900">{studySessions.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Avg. Session Duration:</span>
                  <span className="font-semibold text-lg text-amber-700">{avgStudyTime} minutes</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Scheduled Sessions:</span>
                  <span className="font-semibold text-lg text-amber-900">{studySchedule.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Completed Sessions:</span>
                  <span className="font-semibold text-lg text-green-700">{studySchedule.filter(s => s.completed).length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Upcoming Sessions:</span>
                  <span className="font-semibold text-lg text-blue-700">{studySchedule.filter(s => !s.completed).length}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg shadow-md p-6 border border-amber-300">
              <h3 className="text-lg font-semibold mb-3 text-amber-900 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                By Category
              </h3>
              <div className="space-y-2">
                {['tech', 'business', 'healthcare', 'education', 'trade', 'other'].map(category => {
                  const count = certifications.filter(c => c.category === category).length;
                  if (count === 0) return null;
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-amber-900 capitalize">{category}:</span>
                      <span className="text-sm font-bold text-amber-800">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsHubPage;
