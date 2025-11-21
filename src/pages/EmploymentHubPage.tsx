import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, FileText, Users, Shield, TrendingUp, Calendar, DollarSign, Plus, Edit2, Trash2, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary: string;
  postedDate: string;
  deadline: string;
  status: 'interested' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  url: string;
  notes: string;
  starred: boolean;
  safetyRating: number; // 1-5
  lgbtqFriendly: boolean;
  createdAt: number;
}

interface Application {
  id: string;
  jobId: string;
  appliedDate: string;
  method: 'online' | 'email' | 'in-person' | 'referral';
  contactPerson: string;
  followUpDate?: string;
  notes: string;
  documents: string[]; // resume, cover letter, etc.
  createdAt: number;
}

interface Interview {
  id: string;
  jobId: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'in-person' | 'panel' | 'technical';
  interviewer: string;
  location: string;
  prepNotes: string;
  outcome: string;
  followUpSent: boolean;
  createdAt: number;
}

interface WorkplaceSafety {
  id: string;
  type: 'discrimination' | 'harassment' | 'unsafe-condition' | 'rights-violation' | 'concern';
  date: string;
  description: string;
  witnesses: string[];
  actionTaken: string;
  resolved: boolean;
  notes: string;
  createdAt: number;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'certification';
  proficiency: number; // 1-5
  yearsExperience: number;
  verified: boolean;
  notes: string;
  createdAt: number;
}

const EmploymentHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'interviews' | 'safety' | 'skills'>('jobs');

  // Jobs Tab
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<Partial<JobListing>>({
    type: 'full-time',
    status: 'interested',
    starred: false,
    safetyRating: 3,
    lgbtqFriendly: false
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Applications Tab
  const [applications, setApplications] = useState<Application[]>([]);
  const [showAppForm, setShowAppForm] = useState(false);
  const [newApplication, setNewApplication] = useState<Partial<Application>>({
    method: 'online',
    documents: []
  });

  // Interviews Tab
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState<string | null>(null);
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({
    type: 'phone',
    followUpSent: false
  });

  // Safety Tab
  const [safetyIssues, setSafetyIssues] = useState<WorkplaceSafety[]>([]);
  const [showSafetyForm, setShowSafetyForm] = useState(false);
  const [newSafetyIssue, setNewSafetyIssue] = useState<Partial<WorkplaceSafety>>({
    type: 'concern',
    witnesses: [],
    resolved: false
  });

  // Skills Tab
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    category: 'technical',
    proficiency: 3,
    yearsExperience: 0,
    verified: false
  });

  // Load data
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobListings');
    const savedApps = localStorage.getItem('jobApplications');
    const savedInterviews = localStorage.getItem('interviews');
    const savedSafety = localStorage.getItem('workplaceSafety');
    const savedSkills = localStorage.getItem('skills');

    if (savedJobs) setJobs(JSON.parse(savedJobs));
    if (savedApps) setApplications(JSON.parse(savedApps));
    if (savedInterviews) setInterviews(JSON.parse(savedInterviews));
    if (savedSafety) setSafetyIssues(JSON.parse(savedSafety));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('jobListings', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('workplaceSafety', JSON.stringify(safetyIssues));
  }, [safetyIssues]);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  // Job functions
  const saveJob = () => {
    if (!newJob.title || !newJob.company) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingJob) {
      setJobs(jobs.map(j => j.id === editingJob ? { ...j, ...newJob } as JobListing : j));
      toast.success('Job updated!');
    } else {
      const job: JobListing = {
        id: Date.now().toString(),
        title: newJob.title!,
        company: newJob.company!,
        location: newJob.location || '',
        type: newJob.type || 'full-time',
        salary: newJob.salary || '',
        postedDate: newJob.postedDate || new Date().toISOString().split('T')[0],
        deadline: newJob.deadline || '',
        status: newJob.status || 'interested',
        url: newJob.url || '',
        notes: newJob.notes || '',
        starred: false,
        safetyRating: newJob.safetyRating || 3,
        lgbtqFriendly: newJob.lgbtqFriendly || false,
        createdAt: Date.now()
      };
      setJobs([job, ...jobs]);
      toast.success('Job added!');
    }

    setNewJob({ type: 'full-time', status: 'interested', starred: false, safetyRating: 3, lgbtqFriendly: false });
    setShowJobForm(false);
    setEditingJob(null);
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success('Job deleted');
  };

  const toggleStarJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, starred: !j.starred } : j));
  };

  // Application functions
  const saveApplication = () => {
    if (!newApplication.jobId || !newApplication.appliedDate) {
      toast.error('Please fill in required fields');
      return;
    }

    const app: Application = {
      id: Date.now().toString(),
      jobId: newApplication.jobId!,
      appliedDate: newApplication.appliedDate!,
      method: newApplication.method || 'online',
      contactPerson: newApplication.contactPerson || '',
      followUpDate: newApplication.followUpDate,
      notes: newApplication.notes || '',
      documents: newApplication.documents || [],
      createdAt: Date.now()
    };
    setApplications([app, ...applications]);

    // Update job status
    setJobs(jobs.map(j => j.id === newApplication.jobId ? { ...j, status: 'applied' } : j));

    toast.success('Application logged!');

    setNewApplication({ method: 'online', documents: [] });
    setShowAppForm(false);
  };

  // Interview functions
  const saveInterview = () => {
    if (!newInterview.jobId || !newInterview.date) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingInterview) {
      setInterviews(interviews.map(i => i.id === editingInterview ? { ...i, ...newInterview } as Interview : i));
      toast.success('Interview updated!');
    } else {
      const interview: Interview = {
        id: Date.now().toString(),
        jobId: newInterview.jobId!,
        date: newInterview.date!,
        time: newInterview.time || '',
        type: newInterview.type || 'phone',
        interviewer: newInterview.interviewer || '',
        location: newInterview.location || '',
        prepNotes: newInterview.prepNotes || '',
        outcome: newInterview.outcome || '',
        followUpSent: false,
        createdAt: Date.now()
      };
      setInterviews([interview, ...interviews]);

      // Update job status
      setJobs(jobs.map(j => j.id === newInterview.jobId ? { ...j, status: 'interviewing' } : j));

      toast.success('Interview scheduled!');
    }

    setNewInterview({ type: 'phone', followUpSent: false });
    setShowInterviewForm(false);
    setEditingInterview(null);
  };

  const deleteInterview = (id: string) => {
    setInterviews(interviews.filter(i => i.id !== id));
    toast.success('Interview deleted');
  };

  const toggleFollowUp = (id: string) => {
    setInterviews(interviews.map(i => i.id === id ? { ...i, followUpSent: !i.followUpSent } : i));
  };

  // Safety functions
  const saveSafetyIssue = () => {
    if (!newSafetyIssue.type || !newSafetyIssue.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const issue: WorkplaceSafety = {
      id: Date.now().toString(),
      type: newSafetyIssue.type!,
      date: newSafetyIssue.date || new Date().toISOString().split('T')[0],
      description: newSafetyIssue.description!,
      witnesses: newSafetyIssue.witnesses || [],
      actionTaken: newSafetyIssue.actionTaken || '',
      resolved: false,
      notes: newSafetyIssue.notes || '',
      createdAt: Date.now()
    };
    setSafetyIssues([issue, ...safetyIssues]);
    toast.success('Safety issue documented');

    setNewSafetyIssue({ type: 'concern', witnesses: [], resolved: false });
    setShowSafetyForm(false);
  };

  const toggleResolved = (id: string) => {
    setSafetyIssues(safetyIssues.map(s => s.id === id ? { ...s, resolved: !s.resolved } : s));
  };

  const deleteSafetyIssue = (id: string) => {
    setSafetyIssues(safetyIssues.filter(s => s.id !== id));
    toast.success('Safety issue deleted');
  };

  // Skill functions
  const saveSkill = () => {
    if (!newSkill.name) {
      toast.error('Please enter skill name');
      return;
    }

    if (editingSkill) {
      setSkills(skills.map(s => s.id === editingSkill ? { ...s, ...newSkill } as Skill : s));
      toast.success('Skill updated!');
    } else {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name!,
        category: newSkill.category || 'technical',
        proficiency: newSkill.proficiency || 3,
        yearsExperience: newSkill.yearsExperience || 0,
        verified: false,
        notes: newSkill.notes || '',
        createdAt: Date.now()
      };
      setSkills([skill, ...skills]);
      toast.success('Skill added!');
    }

    setNewSkill({ category: 'technical', proficiency: 3, yearsExperience: 0, verified: false });
    setShowSkillForm(false);
    setEditingSkill(null);
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
    toast.success('Skill deleted');
  };

  const toggleVerified = (id: string) => {
    setSkills(skills.map(s => s.id === id ? { ...s, verified: !s.verified } : s));
  };

  // Stats
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter(j => j.status === 'applied' || j.status === 'interviewing' || j.status === 'offered').length;
  const activeInterviews = interviews.filter(i => new Date(i.date) >= new Date()).length;
  const unresolvedSafety = safetyIssues.filter(s => !s.resolved).length;

  const filteredJobs = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-teal-900 p-6">
        <button onClick={() => navigate('/')} className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Employment Hub</h1>
        </div>
        <p className="text-cyan-200">Track jobs, build skills, stay safe at work</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{totalJobs}</div>
          <div className="text-sm text-blue-200">Total Jobs</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-4 rounded-lg border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">{appliedJobs}</div>
          <div className="text-sm text-green-200">Applied</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-4 rounded-lg border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{activeInterviews}</div>
          <div className="text-sm text-purple-200">Interviews</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-4 rounded-lg border border-orange-500/30">
          <div className="text-2xl font-bold text-orange-400">{skills.length}</div>
          <div className="text-sm text-orange-200">Skills</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 px-6 mb-6 no-scrollbar">
        {[
          { id: 'jobs', label: 'Jobs', icon: Briefcase },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'interviews', label: 'Interviews', icon: Users },
          { id: 'safety', label: 'Safety', icon: Shield },
          { id: 'skills', label: 'Skills', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Job Listing
          </button>

          {/* Status Filter */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {['all', 'interested', 'applied', 'interviewing', 'offered', 'rejected', 'accepted'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap text-sm transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {showJobForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Job title"
                value={newJob.title || ''}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Company"
                value={newJob.company || ''}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Location"
                value={newJob.location || ''}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
              <input
                type="text"
                placeholder="Salary range (optional)"
                value={newJob.salary || ''}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Posted date"
                  value={newJob.postedDate || ''}
                  onChange={(e) => setNewJob({ ...newJob, postedDate: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="date"
                  placeholder="Deadline"
                  value={newJob.deadline || ''}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <input
                type="url"
                placeholder="Job URL (optional)"
                value={newJob.url || ''}
                onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div>
                <label className="block text-sm text-gray-400 mb-2">Safety Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewJob({ ...newJob, safetyRating: rating })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newJob.safetyRating === rating
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newJob.lgbtqFriendly || false}
                  onChange={(e) => setNewJob({ ...newJob, lgbtqFriendly: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">LGBTQ+ Friendly</span>
              </label>
              <textarea
                placeholder="Notes (optional)"
                value={newJob.notes || ''}
                onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveJob}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingJob ? 'Update' : 'Save'} Job
                </button>
                <button
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                    setNewJob({ type: 'full-time', status: 'interested', starred: false, safetyRating: 3, lgbtqFriendly: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No jobs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map(job => {
                const daysUntilDeadline = job.deadline
                  ? Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isDeadlineSoon = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline >= 0;

                return (
                  <div key={job.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStarJob(job.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            job.starred ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                          }`}
                        >
                          <Star className="w-4 h-4" fill={job.starred ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingJob(job.id);
                            setNewJob(job);
                            setShowJobForm(true);
                          }}
                          className="p-2 text-cyan-400 hover:bg-cyan-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs capitalize ${
                        job.status === 'offered' ? 'bg-green-900/30 text-green-400' :
                        job.status === 'interviewing' ? 'bg-blue-900/30 text-blue-400' :
                        job.status === 'applied' ? 'bg-purple-900/30 text-purple-400' :
                        job.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                        job.status === 'accepted' ? 'bg-emerald-900/30 text-emerald-400' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                      <span className="inline-block px-2 py-1 rounded text-xs bg-gray-800 text-gray-400 capitalize">
                        {job.type.replace('-', ' ')}
                      </span>
                      {job.lgbtqFriendly && (
                        <span className="inline-block px-2 py-1 rounded text-xs bg-purple-900/30 text-purple-400">
                          LGBTQ+ Friendly
                        </span>
                      )}
                    </div>
                    {job.salary && (
                      <div className="text-sm text-green-400 mb-1">{job.salary}</div>
                    )}
                    {job.deadline && (
                      <div className={`text-sm ${isDeadlineSoon ? 'text-orange-400 font-semibold' : 'text-gray-400'}`}>
                        Deadline: {job.deadline}
                        {isDeadlineSoon && <span className="ml-2">({daysUntilDeadline} days left)</span>}
                      </div>
                    )}
                    <div className="text-sm text-gray-400">Safety: {job.safetyRating}/5</div>
                    {job.notes && (
                      <p className="text-sm text-gray-400 mt-2">{job.notes}</p>
                    )}
                    {job.url && (
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-2 block">
                        View Listing
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="px-6 space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add jobs first to track applications</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowAppForm(!showAppForm)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Log Application
              </button>

              {showAppForm && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
                  <select
                    value={newApplication.jobId || ''}
                    onChange={(e) => setNewApplication({ ...newApplication, jobId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select a job</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title} - {job.company}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newApplication.appliedDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewApplication({ ...newApplication, appliedDate: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <select
                    value={newApplication.method}
                    onChange={(e) => setNewApplication({ ...newApplication, method: e.target.value as any })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="online">Online Application</option>
                    <option value="email">Email</option>
                    <option value="in-person">In Person</option>
                    <option value="referral">Referral</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Contact person (optional)"
                    value={newApplication.contactPerson || ''}
                    onChange={(e) => setNewApplication({ ...newApplication, contactPerson: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Follow-up date</label>
                    <input
                      type="date"
                      value={newApplication.followUpDate || ''}
                      onChange={(e) => setNewApplication({ ...newApplication, followUpDate: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <textarea
                    placeholder="Notes (optional)"
                    value={newApplication.notes || ''}
                    onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveApplication}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Save Application
                    </button>
                    <button
                      onClick={() => {
                        setShowAppForm(false);
                        setNewApplication({ method: 'online', documents: [] });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No applications logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);

                    return (
                      <div key={app.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-semibold">{job?.title || 'Unknown Job'}</h3>
                        <p className="text-sm text-gray-400">{job?.company}</p>
                        <div className="space-y-1 text-sm mt-2">
                          <div className="text-gray-400">Applied: {app.appliedDate}</div>
                          <div className="text-gray-400 capitalize">Method: {app.method.replace('-', ' ')}</div>
                          {app.contactPerson && (
                            <div className="text-gray-400">Contact: {app.contactPerson}</div>
                          )}
                          {app.followUpDate && (
                            <div className="text-blue-400">Follow-up: {app.followUpDate}</div>
                          )}
                        </div>
                        {app.notes && (
                          <p className="text-sm text-gray-400 mt-2">{app.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Interviews Tab - continuing in next part */}
      {activeTab === 'interviews' && (
        <div className="px-6 space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add jobs first to track interviews</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowInterviewForm(!showInterviewForm)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Schedule Interview
              </button>

              {showInterviewForm && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
                  <select
                    value={newInterview.jobId || ''}
                    onChange={(e) => setNewInterview({ ...newInterview, jobId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select a job</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title} - {job.company}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={newInterview.date || ''}
                      onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      type="time"
                      value={newInterview.time || ''}
                      onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <select
                    value={newInterview.type}
                    onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as any })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="phone">Phone Screen</option>
                    <option value="video">Video Interview</option>
                    <option value="in-person">In-Person</option>
                    <option value="panel">Panel Interview</option>
                    <option value="technical">Technical Interview</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Interviewer name (optional)"
                    value={newInterview.interviewer || ''}
                    onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Location/Link (optional)"
                    value={newInterview.location || ''}
                    onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <textarea
                    placeholder="Prep notes (optional)"
                    value={newInterview.prepNotes || ''}
                    onChange={(e) => setNewInterview({ ...newInterview, prepNotes: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveInterview}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {editingInterview ? 'Update' : 'Schedule'} Interview
                    </button>
                    <button
                      onClick={() => {
                        setShowInterviewForm(false);
                        setEditingInterview(null);
                        setNewInterview({ type: 'phone', followUpSent: false });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {interviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No interviews scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviews.map(interview => {
                    const job = jobs.find(j => j.id === interview.jobId);

                    return (
                      <div key={interview.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{job?.title || 'Unknown Job'}</h3>
                            <p className="text-sm text-gray-400">{job?.company}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingInterview(interview.id);
                                setNewInterview(interview);
                                setShowInterviewForm(true);
                              }}
                              className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInterview(interview.id)}
                              className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-blue-400">
                            <Calendar className="w-3 h-3" />
                            {interview.date} at {interview.time}
                          </div>
                          <div className="text-gray-400 capitalize">{interview.type.replace('-', ' ')}</div>
                          {interview.interviewer && (
                            <div className="text-gray-400">Interviewer: {interview.interviewer}</div>
                          )}
                          {interview.location && (
                            <div className="text-gray-400">Location: {interview.location}</div>
                          )}
                        </div>
                        {interview.prepNotes && (
                          <p className="text-sm text-gray-400 mt-2">{interview.prepNotes}</p>
                        )}
                        <button
                          onClick={() => toggleFollowUp(interview.id)}
                          className={`mt-2 px-3 py-1 rounded text-xs transition-colors ${
                            interview.followUpSent
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {interview.followUpSent ? '✓ Follow-up Sent' : 'Mark Follow-up Sent'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Safety Tab */}
      {activeTab === 'safety' && (
        <div className="px-6 space-y-4">
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-4 rounded-lg border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-300 mb-1">Document Workplace Issues</h3>
                <p className="text-sm text-red-200">Keep records of any safety concerns, discrimination, harassment, or rights violations. Include dates, times, witnesses, and details.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSafetyForm(!showSafetyForm)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Document Safety Issue
          </button>

          {showSafetyForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <select
                value={newSafetyIssue.type}
                onChange={(e) => setNewSafetyIssue({ ...newSafetyIssue, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="concern">General Concern</option>
                <option value="discrimination">Discrimination</option>
                <option value="harassment">Harassment</option>
                <option value="unsafe-condition">Unsafe Condition</option>
                <option value="rights-violation">Rights Violation</option>
              </select>
              <input
                type="date"
                value={newSafetyIssue.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewSafetyIssue({ ...newSafetyIssue, date: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Description (be specific with dates, times, and details)"
                value={newSafetyIssue.description || ''}
                onChange={(e) => setNewSafetyIssue({ ...newSafetyIssue, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-32"
              />
              <textarea
                placeholder="Action taken (optional)"
                value={newSafetyIssue.actionTaken || ''}
                onChange={(e) => setNewSafetyIssue({ ...newSafetyIssue, actionTaken: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <textarea
                placeholder="Additional notes (optional)"
                value={newSafetyIssue.notes || ''}
                onChange={(e) => setNewSafetyIssue({ ...newSafetyIssue, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveSafetyIssue}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                >
                  Document Issue
                </button>
                <button
                  onClick={() => {
                    setShowSafetyForm(false);
                    setNewSafetyIssue({ type: 'concern', witnesses: [], resolved: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {safetyIssues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No safety issues documented</p>
            </div>
          ) : (
            <div className="space-y-3">
              {safetyIssues.map(issue => (
                <div key={issue.id} className={`bg-gray-900 p-4 rounded-lg border ${issue.resolved ? 'border-green-500/50' : 'border-red-500/50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className={`inline-block px-2 py-1 rounded text-xs mb-2 capitalize ${
                        issue.type === 'discrimination' ? 'bg-red-900/30 text-red-400' :
                        issue.type === 'harassment' ? 'bg-red-900/30 text-red-400' :
                        issue.type === 'unsafe-condition' ? 'bg-orange-900/30 text-orange-400' :
                        issue.type === 'rights-violation' ? 'bg-red-900/30 text-red-400' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {issue.type.replace('-', ' ')}
                      </div>
                      {issue.resolved && (
                        <span className="ml-2 inline-block px-2 py-1 rounded text-xs bg-green-900/30 text-green-400">
                          Resolved
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleResolved(issue.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          issue.resolved ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSafetyIssue(issue.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">Date: {issue.date}</div>
                  <p className="text-sm text-white mb-2">{issue.description}</p>
                  {issue.actionTaken && (
                    <div className="text-sm text-gray-400 mb-2">
                      <strong>Action Taken:</strong> {issue.actionTaken}
                    </div>
                  )}
                  {issue.notes && (
                    <p className="text-sm text-gray-400 mt-2">{issue.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Skill
          </button>

          {showSkillForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Skill name"
                value={newSkill.name || ''}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="technical">Technical</option>
                <option value="soft">Soft Skill</option>
                <option value="language">Language</option>
                <option value="certification">Certification</option>
              </select>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Proficiency (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewSkill({ ...newSkill, proficiency: level })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newSkill.proficiency === level
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                placeholder="Years of experience"
                value={newSkill.yearsExperience || ''}
                onChange={(e) => setNewSkill({ ...newSkill, yearsExperience: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Notes (optional)"
                value={newSkill.notes || ''}
                onChange={(e) => setNewSkill({ ...newSkill, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveSkill}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingSkill ? 'Update' : 'Add'} Skill
                </button>
                <button
                  onClick={() => {
                    setShowSkillForm(false);
                    setEditingSkill(null);
                    setNewSkill({ category: 'technical', proficiency: 3, yearsExperience: 0, verified: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {skills.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No skills added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map(skill => (
                <div key={skill.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{skill.category.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVerified(skill.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          skill.verified ? 'text-blue-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSkill(skill.id);
                          setNewSkill(skill);
                          setShowSkillForm(true);
                        }}
                        className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div className="text-gray-400">
                      Proficiency: {skill.proficiency}/5
                    </div>
                    <div className="text-gray-400">
                      Experience: {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'}
                    </div>
                  </div>
                  {skill.verified && (
                    <div className="inline-block px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-400 mb-2">
                      Verified
                    </div>
                  )}
                  {skill.notes && (
                    <p className="text-sm text-gray-400 mt-2">{skill.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmploymentHubPage;
