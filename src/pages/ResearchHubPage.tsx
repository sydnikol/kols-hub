import React, { useState, useEffect } from 'react';
import { Search, FileText, Lightbulb, TrendingUp, Plus, Trash2, BookOpen, Calendar, Tag, Download, Filter, Clock, Edit3, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResearchProject {
  id: string;
  title: string;
  topic: string;
  field: 'science' | 'technology' | 'humanities' | 'social-sciences' | 'arts' | 'other';
  status: 'planning' | 'researching' | 'writing' | 'reviewing' | 'completed';
  startDate: string;
  deadline?: string;
  progress: number;
  notes: string;
}

interface ResearchNote {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  content: string;
  tags: string[];
  dateCreated: string;
  lastEdited: string;
}

interface Citation {
  id: string;
  projectId: string;
  projectTitle: string;
  type: 'book' | 'journal' | 'website' | 'conference' | 'thesis' | 'report';
  authors: string[];
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  accessDate?: string;
}

const SAMPLE_NOTES: ResearchNote[] = [
  {
    id: '1',
    projectId: 'sample-1',
    projectTitle: 'Climate Change Impact on Marine Ecosystems',
    title: 'Ocean Acidification Effects',
    content: 'Recent studies show that ocean acidification is increasing at an alarming rate due to CO2 absorption. pH levels have decreased by 0.1 units since pre-industrial times, affecting calcifying organisms like corals and shellfish. This has cascading effects on entire marine food webs.',
    tags: ['ocean', 'acidification', 'marine-life', 'climate'],
    dateCreated: '2025-01-15',
    lastEdited: '2025-01-18'
  },
  {
    id: '2',
    projectId: 'sample-1',
    projectTitle: 'Climate Change Impact on Marine Ecosystems',
    title: 'Temperature Rise in Tropical Waters',
    content: 'Tropical ocean temperatures have risen by 0.5°C over the past three decades. This warming triggers coral bleaching events and forces species migration toward cooler waters. The Great Barrier Reef has experienced three mass bleaching events in the last five years.',
    tags: ['temperature', 'coral-reefs', 'tropical', 'bleaching'],
    dateCreated: '2025-01-16',
    lastEdited: '2025-01-19'
  },
  {
    id: '3',
    projectId: 'sample-2',
    projectTitle: 'Machine Learning in Healthcare Diagnostics',
    title: 'CNN Architecture for Medical Imaging',
    content: 'Convolutional Neural Networks (CNNs) have shown remarkable accuracy in detecting abnormalities in medical imaging. ResNet-50 and DenseNet architectures achieve over 95% accuracy in identifying lung nodules from CT scans. Transfer learning from ImageNet significantly reduces training time.',
    tags: ['deep-learning', 'cnn', 'medical-imaging', 'diagnosis'],
    dateCreated: '2025-01-10',
    lastEdited: '2025-01-20'
  },
  {
    id: '4',
    projectId: 'sample-2',
    projectTitle: 'Machine Learning in Healthcare Diagnostics',
    title: 'Data Privacy in Healthcare AI',
    content: 'HIPAA compliance requires strict data anonymization protocols. Federated learning allows models to train on distributed hospital data without centralizing sensitive patient information. Differential privacy techniques add noise to protect individual patient data while maintaining model accuracy.',
    tags: ['privacy', 'hipaa', 'federated-learning', 'security'],
    dateCreated: '2025-01-12',
    lastEdited: '2025-01-17'
  },
  {
    id: '5',
    projectId: 'sample-3',
    projectTitle: 'Renewable Energy Storage Solutions',
    title: 'Lithium-Ion Battery Limitations',
    content: 'Current lithium-ion batteries face degradation after 1000-1500 charge cycles. Energy density plateaus around 250 Wh/kg, limiting electric vehicle range. Lithium mining raises environmental concerns and supply chain dependencies on specific geographic regions.',
    tags: ['batteries', 'lithium-ion', 'energy-storage', 'limitations'],
    dateCreated: '2025-01-08',
    lastEdited: '2025-01-14'
  },
  {
    id: '6',
    projectId: 'sample-3',
    projectTitle: 'Renewable Energy Storage Solutions',
    title: 'Solid-State Battery Potential',
    content: 'Solid-state batteries promise 50% higher energy density and improved safety by replacing liquid electrolytes with solid ceramic or polymer materials. Toyota and QuantumScape are leading development, targeting commercial production by 2027. Challenges include manufacturing scalability and interface resistance.',
    tags: ['solid-state', 'innovation', 'safety', 'future-tech'],
    dateCreated: '2025-01-11',
    lastEdited: '2025-01-15'
  },
  {
    id: '7',
    projectId: 'sample-4',
    projectTitle: 'Ancient Roman Architecture and Urban Planning',
    title: 'Concrete Technology in Roman Construction',
    content: 'Roman concrete (opus caementicium) combined volcanic ash, lime, and seawater, creating incredibly durable structures that have lasted 2000+ years. The Pantheon dome remains the world\'s largest unreinforced concrete dome. Modern analysis reveals that seawater reacted with volcanic ash to create aluminum-tobermorite crystals, strengthening the material over time.',
    tags: ['concrete', 'construction', 'pantheon', 'materials'],
    dateCreated: '2025-01-05',
    lastEdited: '2025-01-13'
  },
  {
    id: '8',
    projectId: 'sample-4',
    projectTitle: 'Ancient Roman Architecture and Urban Planning',
    title: 'Aqueduct Engineering Systems',
    content: 'Roman aqueducts utilized gravity flow with precise gradient calculations (typically 1:1000 slope). The Aqua Claudia stretched 69 km, delivering 190,000 cubic meters of water daily to Rome. Engineers used surveying instruments like the chorobates and dioptra to maintain consistent elevation over long distances.',
    tags: ['aqueducts', 'engineering', 'water-systems', 'surveying'],
    dateCreated: '2025-01-07',
    lastEdited: '2025-01-16'
  },
  {
    id: '9',
    projectId: 'sample-5',
    projectTitle: 'Behavioral Economics and Decision Making',
    title: 'Prospect Theory Applications',
    content: 'Kahneman and Tversky\'s prospect theory demonstrates that people are loss-averse, with losses causing about twice the emotional impact of equivalent gains. This asymmetry explains risk-seeking behavior in loss domains and risk aversion in gain domains. Applications include pricing strategies, insurance design, and investment decisions.',
    tags: ['prospect-theory', 'loss-aversion', 'decision-making', 'kahneman'],
    dateCreated: '2025-01-09',
    lastEdited: '2025-01-19'
  },
  {
    id: '10',
    projectId: 'sample-5',
    projectTitle: 'Behavioral Economics and Decision Making',
    title: 'Nudge Theory in Public Policy',
    content: 'Choice architecture can influence behavior without restricting options. Default options significantly affect outcomes: opt-out organ donation increases participation by 30-40% compared to opt-in systems. Thaler and Sunstein\'s nudge framework has been adopted by government behavioral insight teams worldwide.',
    tags: ['nudge', 'public-policy', 'choice-architecture', 'thaler'],
    dateCreated: '2025-01-11',
    lastEdited: '2025-01-18'
  },
  {
    id: '11',
    projectId: 'sample-6',
    projectTitle: 'Quantum Computing Algorithms',
    title: 'Shor\'s Algorithm for Factorization',
    content: 'Shor\'s algorithm can factor large numbers in polynomial time on quantum computers, threatening RSA encryption. It uses quantum Fourier transform and period finding. A sufficiently powerful quantum computer (4000+ logical qubits) could break 2048-bit RSA keys. This drives research in post-quantum cryptography.',
    tags: ['quantum', 'shor', 'cryptography', 'algorithms'],
    dateCreated: '2025-01-06',
    lastEdited: '2025-01-17'
  },
  {
    id: '12',
    projectId: 'sample-6',
    projectTitle: 'Quantum Computing Algorithms',
    title: 'Grover\'s Search Algorithm',
    content: 'Grover\'s algorithm provides quadratic speedup for unstructured search problems, reducing complexity from O(N) to O(√N). While less dramatic than Shor\'s exponential speedup, it has broad applications in database search, optimization, and cryptanalysis. Implementation requires amplitude amplification and careful oracle design.',
    tags: ['grover', 'search', 'optimization', 'quantum-speedup'],
    dateCreated: '2025-01-08',
    lastEdited: '2025-01-20'
  }
];

const SAMPLE_CITATIONS: Citation[] = [
  {
    id: '1',
    projectId: 'sample-1',
    projectTitle: 'Climate Change Impact on Marine Ecosystems',
    type: 'journal',
    authors: ['Doney, S. C.', 'Fabry, V. J.', 'Feely, R. A.', 'Kleypas, J. A.'],
    title: 'Ocean Acidification: The Other CO2 Problem',
    year: '2009',
    journal: 'Annual Review of Marine Science',
    volume: '1',
    issue: '1',
    pages: '169-192',
    doi: '10.1146/annurev.marine.010908.163834'
  },
  {
    id: '2',
    projectId: 'sample-1',
    projectTitle: 'Climate Change Impact on Marine Ecosystems',
    type: 'report',
    authors: ['Hughes, T. P.', 'Kerry, J. T.', 'Baird, A. H.'],
    title: 'Global Warming Transforms Coral Reef Assemblages',
    year: '2018',
    journal: 'Nature',
    volume: '556',
    pages: '492-496',
    doi: '10.1038/s41586-018-0041-2'
  },
  {
    id: '3',
    projectId: 'sample-2',
    projectTitle: 'Machine Learning in Healthcare Diagnostics',
    type: 'journal',
    authors: ['Esteva, A.', 'Kuprel, B.', 'Novoa, R. A.', 'Ko, J.', 'Swetter, S. M.'],
    title: 'Dermatologist-level Classification of Skin Cancer with Deep Neural Networks',
    year: '2017',
    journal: 'Nature',
    volume: '542',
    pages: '115-118',
    doi: '10.1038/nature21056'
  },
  {
    id: '4',
    projectId: 'sample-2',
    projectTitle: 'Machine Learning in Healthcare Diagnostics',
    type: 'conference',
    authors: ['Rajkomar, A.', 'Dean, J.', 'Kohane, I.'],
    title: 'Machine Learning in Medicine',
    year: '2019',
    journal: 'New England Journal of Medicine',
    volume: '380',
    issue: '14',
    pages: '1347-1358',
    doi: '10.1056/NEJMra1814259'
  },
  {
    id: '5',
    projectId: 'sample-3',
    projectTitle: 'Renewable Energy Storage Solutions',
    type: 'journal',
    authors: ['Goodenough, J. B.', 'Park, K. S.'],
    title: 'The Li-Ion Rechargeable Battery: A Perspective',
    year: '2013',
    journal: 'Journal of the American Chemical Society',
    volume: '135',
    issue: '4',
    pages: '1167-1176',
    doi: '10.1021/ja3091438'
  },
  {
    id: '6',
    projectId: 'sample-3',
    projectTitle: 'Renewable Energy Storage Solutions',
    type: 'journal',
    authors: ['Janek, J.', 'Zeier, W. G.'],
    title: 'A Solid Future for Battery Development',
    year: '2016',
    journal: 'Nature Energy',
    volume: '1',
    pages: '16141',
    doi: '10.1038/nenergy.2016.141'
  },
  {
    id: '7',
    projectId: 'sample-4',
    projectTitle: 'Ancient Roman Architecture and Urban Planning',
    type: 'book',
    authors: ['Lancaster, L. C.'],
    title: 'Concrete Vaulted Construction in Imperial Rome: Innovations in Context',
    year: '2005',
    publisher: 'Cambridge University Press',
    pages: '1-256'
  },
  {
    id: '8',
    projectId: 'sample-4',
    projectTitle: 'Ancient Roman Architecture and Urban Planning',
    type: 'journal',
    authors: ['Jackson, M. D.', 'Mulcahy, S. R.', 'Chen, H.'],
    title: 'Phillipsite and Al-tobermorite Mineral Cements Produced Through Low-temperature Water-rock Reactions in Roman Marine Concrete',
    year: '2017',
    journal: 'American Mineralogist',
    volume: '102',
    issue: '7',
    pages: '1435-1450',
    doi: '10.2138/am-2017-5993CCBY'
  },
  {
    id: '9',
    projectId: 'sample-5',
    projectTitle: 'Behavioral Economics and Decision Making',
    type: 'journal',
    authors: ['Kahneman, D.', 'Tversky, A.'],
    title: 'Prospect Theory: An Analysis of Decision under Risk',
    year: '1979',
    journal: 'Econometrica',
    volume: '47',
    issue: '2',
    pages: '263-291',
    doi: '10.2307/1914185'
  },
  {
    id: '10',
    projectId: 'sample-5',
    projectTitle: 'Behavioral Economics and Decision Making',
    type: 'book',
    authors: ['Thaler, R. H.', 'Sunstein, C. R.'],
    title: 'Nudge: Improving Decisions about Health, Wealth, and Happiness',
    year: '2008',
    publisher: 'Yale University Press',
    pages: '1-293'
  }
];

const ResearchHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'notes' | 'citations'>('projects');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [citationFormat, setCitationFormat] = useState<'apa' | 'mla' | 'chicago'>('apa');
  const [filterCitationType, setFilterCitationType] = useState('all');

  useEffect(() => {
    const savedProjects = localStorage.getItem('researchProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    const savedNotes = localStorage.getItem('researchNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes(SAMPLE_NOTES);
      localStorage.setItem('researchNotes', JSON.stringify(SAMPLE_NOTES));
    }

    const savedCitations = localStorage.getItem('citations');
    if (savedCitations) {
      setCitations(JSON.parse(savedCitations));
    } else {
      setCitations(SAMPLE_CITATIONS);
      localStorage.setItem('citations', JSON.stringify(SAMPLE_CITATIONS));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('researchProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('researchNotes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('citations', JSON.stringify(citations));
  }, [citations]);

  const addProject = () => {
    const newProject: ResearchProject = {
      id: Date.now().toString(),
      title: '',
      topic: '',
      field: 'other',
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      progress: 0,
      notes: '',
    };
    setProjects([...projects, newProject]);
    toast.success('Project added');
  };

  const updateProject = (id: string, updates: Partial<ResearchProject>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Project updated');
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted');
  };

  const addNote = () => {
    const newNote: ResearchNote = {
      id: Date.now().toString(),
      projectId: 'unassigned',
      projectTitle: 'Unassigned',
      title: '',
      content: '',
      tags: [],
      dateCreated: new Date().toISOString().split('T')[0],
      lastEdited: new Date().toISOString().split('T')[0]
    };
    setNotes([...notes, newNote]);
    toast.success('Note added');
  };

  const updateNote = (id: string, updates: Partial<ResearchNote>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, lastEdited: new Date().toISOString().split('T')[0] } : n));
    toast.success('Note updated');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  const addCitation = () => {
    const newCitation: Citation = {
      id: Date.now().toString(),
      projectId: 'unassigned',
      projectTitle: 'Unassigned',
      type: 'journal',
      authors: [''],
      title: '',
      year: new Date().getFullYear().toString(),
    };
    setCitations([...citations, newCitation]);
    toast.success('Citation added');
  };

  const updateCitation = (id: string, updates: Partial<Citation>) => {
    setCitations(citations.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Citation updated');
  };

  const deleteCitation = (id: string) => {
    setCitations(citations.filter(c => c.id !== id));
    toast.success('Citation deleted');
  };

  const formatCitation = (citation: Citation, format: 'apa' | 'mla' | 'chicago'): string => {
    const authors = citation.authors.join(', ');

    if (format === 'apa') {
      let formatted = `${authors} (${citation.year}). ${citation.title}. `;
      if (citation.type === 'journal' && citation.journal) {
        formatted += `${citation.journal}`;
        if (citation.volume) formatted += `, ${citation.volume}`;
        if (citation.issue) formatted += `(${citation.issue})`;
        if (citation.pages) formatted += `, ${citation.pages}`;
        if (citation.doi) formatted += `. https://doi.org/${citation.doi}`;
      } else if (citation.type === 'book' && citation.publisher) {
        formatted += `${citation.publisher}.`;
      } else if (citation.type === 'website' && citation.url) {
        formatted += `Retrieved from ${citation.url}`;
      }
      return formatted;
    } else if (format === 'mla') {
      let formatted = `${authors}. "${citation.title}." `;
      if (citation.type === 'journal' && citation.journal) {
        formatted += `${citation.journal}`;
        if (citation.volume) formatted += `, vol. ${citation.volume}`;
        if (citation.issue) formatted += `, no. ${citation.issue}`;
        formatted += `, ${citation.year}`;
        if (citation.pages) formatted += `, pp. ${citation.pages}`;
      } else if (citation.type === 'book' && citation.publisher) {
        formatted += `${citation.publisher}, ${citation.year}.`;
      } else if (citation.type === 'website' && citation.url) {
        formatted += `${citation.url}. Accessed ${citation.accessDate || 'date'}.`;
      }
      return formatted;
    } else {
      let formatted = `${authors}. "${citation.title}." `;
      if (citation.type === 'journal' && citation.journal) {
        formatted += `${citation.journal} ${citation.volume}`;
        if (citation.issue) formatted += `, no. ${citation.issue}`;
        formatted += ` (${citation.year})`;
        if (citation.pages) formatted += `: ${citation.pages}`;
      } else if (citation.type === 'book' && citation.publisher) {
        formatted += `${citation.publisher}, ${citation.year}.`;
      } else if (citation.type === 'website' && citation.url) {
        formatted += `${citation.url} (accessed ${citation.accessDate || 'date'}).`;
      }
      return formatted;
    }
  };

  const exportCitations = () => {
    const formatted = citations.map(c => formatCitation(c, citationFormat)).join('\n\n');
    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibliography-${citationFormat}.txt`;
    a.click();
    toast.success('Bibliography exported');
  };

  const copyCitation = (citation: Citation) => {
    const formatted = formatCitation(citation, citationFormat);
    navigator.clipboard.writeText(formatted);
    toast.success('Citation copied to clipboard');
  };

  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));
  const allProjectTitles = Array.from(new Set([...notes.map(n => n.projectTitle), ...citations.map(c => c.projectTitle)]));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || note.tags.includes(filterTag);
    const matchesProject = filterProject === 'all' || note.projectTitle === filterProject;
    return matchesSearch && matchesTag && matchesProject;
  });

  const filteredCitations = citations.filter(citation => {
    const matchesSearch = citation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         citation.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterCitationType === 'all' || citation.type === filterCitationType;
    const matchesProject = filterProject === 'all' || citation.projectTitle === filterProject;
    return matchesSearch && matchesType && matchesProject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 pb-20">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Research Hub</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeProjects}</div>
            <div className="text-xs opacity-90">Active Projects</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{notes.length}</div>
            <div className="text-xs opacity-90">Notes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Lightbulb className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{citations.length}</div>
            <div className="text-xs opacity-90">Citations</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'projects', label: 'Projects', icon: TrendingUp },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'citations', label: 'Citations', icon: Lightbulb },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                  : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <button
              onClick={addProject}
              className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Research Project</span>
            </button>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No projects yet. Start your research journey!</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(project.id, { title: e.target.value })}
                      placeholder="Project title..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={project.topic}
                      onChange={(e) => updateProject(project.id, { topic: e.target.value })}
                      placeholder="Topic..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                    />
                    <select
                      value={project.field}
                      onChange={(e) => updateProject(project.id, { field: e.target.value as ResearchProject['field'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                    >
                      <option value="science">Science</option>
                      <option value="technology">Technology</option>
                      <option value="humanities">Humanities</option>
                      <option value="social-sciences">Social Sciences</option>
                      <option value="arts">Arts</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={project.status}
                      onChange={(e) => updateProject(project.id, { status: e.target.value as ResearchProject['status'] })}
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                    >
                      <option value="planning">Planning</option>
                      <option value="researching">Researching</option>
                      <option value="writing">Writing</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Progress: {project.progress}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={project.progress}
                      onChange={(e) => updateProject(project.id, { progress: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                  <textarea
                    value={project.notes}
                    onChange={(e) => updateProject(project.id, { notes: e.target.value })}
                    placeholder="Notes, methodology, findings..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <button
              onClick={addNote}
              className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Research Note</span>
            </button>

            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>

                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Projects</option>
                  {allProjectTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No notes found. Add your research findings!</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-teal-500">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => updateNote(note.id, { title: e.target.value })}
                      placeholder="Note title..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {note.dateCreated}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>Edited: {note.lastEdited}</span>
                  </div>

                  <input
                    type="text"
                    value={note.projectTitle}
                    onChange={(e) => updateNote(note.id, { projectTitle: e.target.value })}
                    placeholder="Project..."
                    className="text-sm text-cyan-600 font-medium bg-gray-50 px-2 py-1 rounded mb-3 w-full border border-gray-200 focus:border-cyan-500 outline-none"
                  />

                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    placeholder="Note content..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none mb-3"
                    rows={4}
                  />

                  <div className="flex flex-wrap gap-2 mb-2">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Add tags (comma-separated)..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        const newTags = input.value.split(',').map(t => t.trim()).filter(t => t);
                        updateNote(note.id, { tags: [...note.tags, ...newTags] });
                        input.value = '';
                      }
                    }}
                    className="w-full text-xs bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'citations' && (
          <div className="space-y-4">
            <button
              onClick={addCitation}
              className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Citation</span>
            </button>

            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search citations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterCitationType}
                  onChange={(e) => setFilterCitationType(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="book">Book</option>
                  <option value="journal">Journal</option>
                  <option value="website">Website</option>
                  <option value="conference">Conference</option>
                  <option value="thesis">Thesis</option>
                  <option value="report">Report</option>
                </select>

                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Projects</option>
                  {allProjectTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Format:</span>
                  <select
                    value={citationFormat}
                    onChange={(e) => setCitationFormat(e.target.value as 'apa' | 'mla' | 'chicago')}
                    className="text-sm bg-cyan-50 px-3 py-1 rounded border border-cyan-300 focus:border-cyan-500 outline-none"
                  >
                    <option value="apa">APA</option>
                    <option value="mla">MLA</option>
                    <option value="chicago">Chicago</option>
                  </select>
                </div>

                <button
                  onClick={exportCitations}
                  className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {filteredCitations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No citations found. Build your bibliography!</p>
              </div>
            ) : (
              filteredCitations.map(citation => (
                <div key={citation.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium uppercase">
                        {citation.type}
                      </span>
                      <input
                        type="text"
                        value={citation.projectTitle}
                        onChange={(e) => updateCitation(citation.id, { projectTitle: e.target.value })}
                        placeholder="Project..."
                        className="text-xs text-cyan-600 bg-gray-50 px-2 py-1 rounded flex-1 border border-gray-200 focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyCitation(citation)}
                        className="text-cyan-600 hover:text-cyan-700"
                        title="Copy citation"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCitation(citation.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={citation.authors.join('; ')}
                      onChange={(e) => updateCitation(citation.id, { authors: e.target.value.split(';').map(a => a.trim()) })}
                      placeholder="Authors (separate with semicolons)..."
                      className="w-full text-sm font-medium bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                    />

                    <input
                      type="text"
                      value={citation.title}
                      onChange={(e) => updateCitation(citation.id, { title: e.target.value })}
                      placeholder="Title..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={citation.year}
                        onChange={(e) => updateCitation(citation.id, { year: e.target.value })}
                        placeholder="Year..."
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                      />

                      <select
                        value={citation.type}
                        onChange={(e) => updateCitation(citation.id, { type: e.target.value as Citation['type'] })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                      >
                        <option value="book">Book</option>
                        <option value="journal">Journal</option>
                        <option value="website">Website</option>
                        <option value="conference">Conference</option>
                        <option value="thesis">Thesis</option>
                        <option value="report">Report</option>
                      </select>
                    </div>

                    {(citation.type === 'journal' || citation.type === 'report') && (
                      <>
                        <input
                          type="text"
                          value={citation.journal || ''}
                          onChange={(e) => updateCitation(citation.id, { journal: e.target.value })}
                          placeholder="Journal name..."
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                        />

                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={citation.volume || ''}
                            onChange={(e) => updateCitation(citation.id, { volume: e.target.value })}
                            placeholder="Volume..."
                            className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                          />
                          <input
                            type="text"
                            value={citation.issue || ''}
                            onChange={(e) => updateCitation(citation.id, { issue: e.target.value })}
                            placeholder="Issue..."
                            className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                          />
                          <input
                            type="text"
                            value={citation.pages || ''}
                            onChange={(e) => updateCitation(citation.id, { pages: e.target.value })}
                            placeholder="Pages..."
                            className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                          />
                        </div>

                        <input
                          type="text"
                          value={citation.doi || ''}
                          onChange={(e) => updateCitation(citation.id, { doi: e.target.value })}
                          placeholder="DOI..."
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                        />
                      </>
                    )}

                    {citation.type === 'book' && (
                      <input
                        type="text"
                        value={citation.publisher || ''}
                        onChange={(e) => updateCitation(citation.id, { publisher: e.target.value })}
                        placeholder="Publisher..."
                        className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                      />
                    )}

                    {citation.type === 'website' && (
                      <>
                        <input
                          type="text"
                          value={citation.url || ''}
                          onChange={(e) => updateCitation(citation.id, { url: e.target.value })}
                          placeholder="URL..."
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                        />
                        <input
                          type="text"
                          value={citation.accessDate || ''}
                          onChange={(e) => updateCitation(citation.id, { accessDate: e.target.value })}
                          placeholder="Access date..."
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                        />
                      </>
                    )}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <div className="flex items-start space-x-2 text-xs text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 leading-relaxed">
                        {formatCitation(citation, citationFormat)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchHubPage;
