import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Edit2, Trash2, Check, X, User, Calendar, AlertCircle, List, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface CareTask {
  id: string;
  title: string;
  description: string;
  category: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  checklist: ChecklistItem[];
  notes: string;
  createdAt: number;
  completedAt?: number;
}

const taskCategories = [
  'Medical Care',
  'Personal Care',
  'Medication Management',
  'Meal Preparation',
  'House Cleaning',
  'Laundry',
  'Grocery Shopping',
  'Transportation',
  'Appointment Scheduling',
  'Communication',
  'Documentation',
  'Other',
];

export default function CareTasks() {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: taskCategories[0],
    assignedTo: '',
    priority: 'medium' as CareTask['priority'],
    dueDate: '',
    notes: '',
  });
  const [checklistInput, setChecklistInput] = useState('');
  const [tempChecklist, setTempChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('careTasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (editingId) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? {
              ...task,
              ...formData,
              checklist: tempChecklist,
            }
          : task
      ));
      toast.success('Task updated!');
      setEditingId(null);
    } else {
      const newTask: CareTask = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        checklist: tempChecklist,
        createdAt: Date.now(),
      };
      setTasks([...tasks, newTask]);
      toast.success('Task created!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: taskCategories[0],
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      notes: '',
    });
    setTempChecklist([]);
    setChecklistInput('');
    setIsAdding(false);
  };

  const handleEdit = (task: CareTask) => {
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate,
      notes: task.notes,
    });
    setTempChecklist(task.checklist);
    setEditingId(task.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    }
  };

  const updateTaskStatus = (id: string, status: CareTask['status']) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
            ...task,
            status,
            completedAt: status === 'completed' ? Date.now() : undefined,
          }
        : task
    ));
    toast.success(`Task marked as ${status.replace('-', ' ')}`);
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            checklist: task.checklist.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
          }
        : task
    ));
  };

  const addChecklistItem = () => {
    if (!checklistInput.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: checklistInput.trim(),
      completed: false,
    };

    setTempChecklist([...tempChecklist, newItem]);
    setChecklistInput('');
  };

  const removeChecklistItem = (id: string) => {
    setTempChecklist(tempChecklist.filter(item => item.id !== id));
  };

  const toggleTaskExpanded = (id: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTasks(newExpanded);
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filter === 'active') {
        return task.status !== 'completed';
      } else if (filter === 'completed') {
        return task.status === 'completed';
      }
      return true;
    }).sort((a, b) => {
      // Sort by priority first (high > medium > low), then by due date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority: CareTask['priority']) => {
    return {
      low: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
      medium: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
      high: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    }[priority];
  };

  const getStatusColor = (status: CareTask['status']) => {
    return {
      pending: { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
      'in-progress': { bg: 'bg-indigo-500/20', text: 'text-indigo-300' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-300' },
    }[status];
  };

  const filteredTasks = getFilteredTasks();
  const activeCount = tasks.filter(t => t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <CheckSquare className="w-7 h-7 text-cyan-400" />
            Care Tasks
          </h2>
          <p className="text-cyan-200/70 mt-1">
            {activeCount} active • {completedCount} completed
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              resetForm();
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
        {(['active', 'completed', 'all'] as const).map(tab => {
          const count = tab === 'active' ? activeCount : tab === 'completed' ? completedCount : tasks.length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'text-cyan-200/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Task' : 'Create New Task'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-cyan-100 mb-2">Task Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyan-100 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  {taskCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-cyan-100 mb-2">Assigned To</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Caregiver name"
                />
              </div>

              <div>
                <label className="block text-cyan-100 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as CareTask['priority'] })}
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-cyan-100 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 min-h-[80px]"
                placeholder="Task description..."
              />
            </div>

            {/* Checklist Builder */}
            <div>
              <label className="block text-cyan-100 mb-2">Checklist</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                  className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Add checklist item..."
                />
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {tempChecklist.length > 0 && (
                <div className="space-y-2 bg-black/30 rounded-lg p-3 border border-cyan-500/20">
                  {tempChecklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-cyan-100">
                      <List className="w-4 h-4 text-cyan-400" />
                      <span className="flex-1">{item.text}</span>
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(item.id)}
                        className="p-1 text-red-300 hover:text-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 min-h-[80px]"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all font-medium"
            >
              {editingId ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
            <CheckSquare className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
            <p className="text-cyan-200/70 text-lg">
              {filter === 'active' ? 'No active tasks' :
               filter === 'completed' ? 'No completed tasks' :
               'No tasks created yet'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const priorityColor = getPriorityColor(task.priority);
            const statusColor = getStatusColor(task.status);
            const checklistProgress = task.checklist.length > 0
              ? task.checklist.filter(i => i.completed).length / task.checklist.length * 100
              : 0;

            return (
              <div
                key={task.id}
                className={`bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-5 border transition-all ${
                  task.status === 'completed'
                    ? 'border-green-500/30 opacity-75'
                    : `border-cyan-500/20 hover:border-cyan-400/40`
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                      <span className={`px-2 py-1 ${priorityColor.bg} ${priorityColor.text} rounded-full text-xs font-semibold`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 ${statusColor.bg} ${statusColor.text} rounded-full text-xs font-semibold`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-cyan-200 text-sm">{task.category}</div>

                      {task.assignedTo && (
                        <div className="flex items-center gap-2 text-cyan-200">
                          <User className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm">{task.assignedTo}</span>
                        </div>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span className={`text-sm ${
                            formatDueDate(task.dueDate) === 'Overdue' ? 'text-red-300' : 'text-cyan-200'
                          }`}>
                            {formatDueDate(task.dueDate)}
                          </span>
                        </div>
                      )}

                      {task.checklist.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 bg-black/40 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${checklistProgress}%` }}
                              />
                            </div>
                            <span className="text-cyan-200 text-sm">
                              {task.checklist.filter(i => i.completed).length}/{task.checklist.length}
                            </span>
                          </div>
                        </div>
                      )}

                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {task.description && (
                            <div className="p-3 bg-black/30 rounded-lg border border-cyan-500/20">
                              <p className="text-cyan-100 text-sm whitespace-pre-wrap">{task.description}</p>
                            </div>
                          )}

                          {task.checklist.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-cyan-100 font-semibold text-sm">Checklist:</h4>
                              {task.checklist.map(item => (
                                <label
                                  key={item.id}
                                  className="flex items-center gap-3 p-2 bg-black/30 rounded-lg border border-cyan-500/20 cursor-pointer hover:bg-black/40 transition-all"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => toggleChecklistItem(task.id, item.id)}
                                    className="w-4 h-4 rounded border-cyan-500/30"
                                    disabled={task.status === 'completed'}
                                  />
                                  <span className={`flex-1 text-sm ${
                                    item.completed ? 'text-cyan-200/50 line-through' : 'text-cyan-100'
                                  }`}>
                                    {item.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {task.notes && (
                            <div className="p-3 bg-black/30 rounded-lg border border-cyan-500/20">
                              <h4 className="text-cyan-100 font-semibold text-sm mb-2">Notes:</h4>
                              <p className="text-cyan-100/70 text-sm whitespace-pre-wrap">{task.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {task.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => updateTaskStatus(task.id, task.status === 'in-progress' ? 'pending' : 'in-progress')}
                          className={`p-2 rounded-lg transition-all ${
                            task.status === 'in-progress'
                              ? 'bg-indigo-500/30 text-indigo-300 hover:bg-indigo-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                          }`}
                          title={task.status === 'in-progress' ? 'Mark as pending' : 'Start task'}
                        >
                          <AlertCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all"
                          title="Mark as complete"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                      title="Edit task"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                      title="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleTaskExpanded(task.id)}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
