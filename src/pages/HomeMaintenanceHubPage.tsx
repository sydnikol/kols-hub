import React, { useState, useEffect } from 'react';
import { Home, Wrench, Calendar, CheckCircle, AlertCircle, Plus, Edit2, Trash2, Star, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface MaintenanceTask {
  id: string;
  title: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliances' | 'exterior' | 'interior' | 'yard' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastCompleted?: string;
  nextDue: string;
  completed: boolean;
  notes: string;
  cost?: number;
}

interface Repair {
  id: string;
  issue: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliances' | 'structural' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'emergency';
  dateReported: string;
  dateResolved?: string;
  resolved: boolean;
  diy: boolean;
  cost: number;
  contractor?: string;
  notes: string;
}

interface CleaningSchedule {
  id: string;
  area: string;
  task: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'seasonal';
  lastDone?: string;
  nextDue: string;
  duration: number; // minutes
  completed: boolean;
  notes: string;
}

interface Inventory {
  id: string;
  item: string;
  category: 'tools' | 'supplies' | 'cleaning' | 'seasonal' | 'emergency' | 'other';
  quantity: number;
  location: string;
  purchaseDate?: string;
  expirationDate?: string;
  lowStockThreshold: number;
  notes: string;
}

interface Warranty {
  id: string;
  item: string;
  category: 'appliance' | 'electronics' | 'hvac' | 'structural' | 'other';
  purchaseDate: string;
  warrantyExpiration: string;
  provider: string;
  cost: number;
  serialNumber?: string;
  notes: string;
}

const HomeMaintenanceHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'repairs' | 'cleaning' | 'inventory' | 'warranties'>('tasks');
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [cleaningSchedule, setCleaningSchedule] = useState<CleaningSchedule[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('maintenanceTasks');
    const savedRepairs = localStorage.getItem('homeRepairs');
    const savedCleaning = localStorage.getItem('cleaningSchedule');
    const savedInventory = localStorage.getItem('homeInventory');
    const savedWarranties = localStorage.getItem('homeWarranties');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedRepairs) setRepairs(JSON.parse(savedRepairs));
    if (savedCleaning) setCleaningSchedule(JSON.parse(savedCleaning));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedWarranties) setWarranties(JSON.parse(savedWarranties));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('maintenanceTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('homeRepairs', JSON.stringify(repairs));
  }, [repairs]);

  useEffect(() => {
    localStorage.setItem('cleaningSchedule', JSON.stringify(cleaningSchedule));
  }, [cleaningSchedule]);

  useEffect(() => {
    localStorage.setItem('homeInventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('homeWarranties', JSON.stringify(warranties));
  }, [warranties]);

  const addTask = () => {
    const newTask: MaintenanceTask = {
      id: Date.now().toString(),
      title: '',
      category: 'other',
      priority: 'medium',
      frequency: 'monthly',
      nextDue: new Date().toISOString().split('T')[0],
      completed: false,
      notes: '',
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added');
  };

  const updateTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Task updated');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const addRepair = () => {
    const newRepair: Repair = {
      id: Date.now().toString(),
      issue: '',
      category: 'other',
      severity: 'moderate',
      dateReported: new Date().toISOString().split('T')[0],
      resolved: false,
      diy: false,
      cost: 0,
      notes: '',
    };
    setRepairs([...repairs, newRepair]);
    toast.success('Repair added');
  };

  const updateRepair = (id: string, updates: Partial<Repair>) => {
    setRepairs(repairs.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Repair updated');
  };

  const deleteRepair = (id: string) => {
    setRepairs(repairs.filter(r => r.id !== id));
    toast.success('Repair deleted');
  };

  const addCleaningTask = () => {
    const newTask: CleaningSchedule = {
      id: Date.now().toString(),
      area: '',
      task: '',
      frequency: 'weekly',
      nextDue: new Date().toISOString().split('T')[0],
      duration: 30,
      completed: false,
      notes: '',
    };
    setCleaningSchedule([...cleaningSchedule, newTask]);
    toast.success('Cleaning task added');
  };

  const updateCleaningTask = (id: string, updates: Partial<CleaningSchedule>) => {
    setCleaningSchedule(cleaningSchedule.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Cleaning task updated');
  };

  const deleteCleaningTask = (id: string) => {
    setCleaningSchedule(cleaningSchedule.filter(c => c.id !== id));
    toast.success('Cleaning task deleted');
  };

  const addInventoryItem = () => {
    const newItem: Inventory = {
      id: Date.now().toString(),
      item: '',
      category: 'supplies',
      quantity: 0,
      location: '',
      lowStockThreshold: 1,
      notes: '',
    };
    setInventory([...inventory, newItem]);
    toast.success('Item added');
  };

  const updateInventoryItem = (id: string, updates: Partial<Inventory>) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, ...updates } : i));
    toast.success('Item updated');
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(i => i.id !== id));
    toast.success('Item deleted');
  };

  const addWarranty = () => {
    const newWarranty: Warranty = {
      id: Date.now().toString(),
      item: '',
      category: 'appliance',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiration: '',
      provider: '',
      cost: 0,
      notes: '',
    };
    setWarranties([...warranties, newWarranty]);
    toast.success('Warranty added');
  };

  const updateWarranty = (id: string, updates: Partial<Warranty>) => {
    setWarranties(warranties.map(w => w.id === id ? { ...w, ...updates } : w));
    toast.success('Warranty updated');
  };

  const deleteWarranty = (id: string) => {
    setWarranties(warranties.filter(w => w.id !== id));
    toast.success('Warranty deleted');
  };

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const openRepairs = repairs.filter(r => !r.resolved).length;
  const pendingCleaning = cleaningSchedule.filter(c => !c.completed).length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Home className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Home Maintenance Hub</h1>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Wrench className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingTasks}</div>
            <div className="text-xs opacity-90">Pending Tasks</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <AlertCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{openRepairs}</div>
            <div className="text-xs opacity-90">Open Repairs</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingCleaning}</div>
            <div className="text-xs opacity-90">Cleaning Due</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{lowStockItems}</div>
            <div className="text-xs opacity-90">Low Stock</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'tasks', label: 'Tasks', icon: Wrench },
            { id: 'repairs', label: 'Repairs', icon: AlertCircle },
            { id: 'cleaning', label: 'Cleaning', icon: CheckCircle },
            { id: 'inventory', label: 'Inventory', icon: Home },
            { id: 'warranties', label: 'Warranties', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <button
              onClick={addTask}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Maintenance Task</span>
            </button>

            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No maintenance tasks yet. Keep your home in shape!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${task.completed ? 'border-green-500' : 'border-blue-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      placeholder="Task title..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={task.category}
                      onChange={(e) => updateTask(task.id, { category: e.target.value as MaintenanceTask['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="appliances">Appliances</option>
                      <option value="exterior">Exterior</option>
                      <option value="interior">Interior</option>
                      <option value="yard">Yard</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(task.id, { priority: e.target.value as MaintenanceTask['priority'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <select
                      value={task.frequency}
                      onChange={(e) => updateTask(task.id, { frequency: e.target.value as MaintenanceTask['frequency'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="one-time">One-time</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                    <input
                      type="date"
                      value={task.nextDue}
                      onChange={(e) => updateTask(task.id, { nextDue: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={task.notes}
                    onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2"
                    rows={2}
                  />

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => updateTask(task.id, { completed: e.target.checked, lastCompleted: e.target.checked ? new Date().toISOString().split('T')[0] : undefined })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Completed</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Repairs Tab */}
        {activeTab === 'repairs' && (
          <div className="space-y-4">
            <button
              onClick={addRepair}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Repair</span>
            </button>

            {repairs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No repairs logged yet. Track what needs fixing!</p>
              </div>
            ) : (
              repairs.map(repair => (
                <div key={repair.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${repair.resolved ? 'border-green-500' : repair.severity === 'emergency' ? 'border-red-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={repair.issue}
                      onChange={(e) => updateRepair(repair.id, { issue: e.target.value })}
                      placeholder="Issue description..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteRepair(repair.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={repair.category}
                      onChange={(e) => updateRepair(repair.id, { category: e.target.value as Repair['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="appliances">Appliances</option>
                      <option value="structural">Structural</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={repair.severity}
                      onChange={(e) => updateRepair(repair.id, { severity: e.target.value as Repair['severity'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="major">Major</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <input
                      type="date"
                      value={repair.dateReported}
                      onChange={(e) => updateRepair(repair.id, { dateReported: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      value={repair.cost}
                      onChange={(e) => updateRepair(repair.id, { cost: parseFloat(e.target.value) || 0 })}
                      placeholder="Cost..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={repair.contractor || ''}
                      onChange={(e) => updateRepair(repair.id, { contractor: e.target.value })}
                      placeholder="Contractor (optional)..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={repair.notes}
                    onChange={(e) => updateRepair(repair.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2"
                    rows={2}
                  />

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={repair.resolved}
                        onChange={(e) => updateRepair(repair.id, { resolved: e.target.checked, dateResolved: e.target.checked ? new Date().toISOString().split('T')[0] : undefined })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Resolved</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={repair.diy}
                        onChange={(e) => updateRepair(repair.id, { diy: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">DIY</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Cleaning Tab */}
        {activeTab === 'cleaning' && (
          <div className="space-y-4">
            <button
              onClick={addCleaningTask}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Cleaning Task</span>
            </button>

            {cleaningSchedule.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No cleaning schedule yet. Stay organized!</p>
              </div>
            ) : (
              cleaningSchedule.map(task => (
                <div key={task.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${task.completed ? 'border-green-500' : 'border-cyan-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={task.area}
                      onChange={(e) => updateCleaningTask(task.id, { area: e.target.value })}
                      placeholder="Area..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteCleaningTask(task.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={task.task}
                      onChange={(e) => updateCleaningTask(task.id, { task: e.target.value })}
                      placeholder="Task..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <select
                      value={task.frequency}
                      onChange={(e) => updateCleaningTask(task.id, { frequency: e.target.value as CleaningSchedule['frequency'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                    <input
                      type="date"
                      value={task.nextDue}
                      onChange={(e) => updateCleaningTask(task.id, { nextDue: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      value={task.duration}
                      onChange={(e) => updateCleaningTask(task.id, { duration: parseInt(e.target.value) || 0 })}
                      placeholder="Duration (minutes)..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={task.notes}
                    onChange={(e) => updateCleaningTask(task.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2"
                    rows={2}
                  />

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => updateCleaningTask(task.id, { completed: e.target.checked, lastDone: e.target.checked ? new Date().toISOString().split('T')[0] : undefined })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Completed</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <button
              onClick={addInventoryItem}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Item</span>
            </button>

            {inventory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Home className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No inventory yet. Track your supplies!</p>
              </div>
            ) : (
              inventory.map(item => (
                <div key={item.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${item.quantity <= item.lowStockThreshold ? 'border-red-500' : 'border-green-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => updateInventoryItem(item.id, { item: e.target.value })}
                      placeholder="Item name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteInventoryItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select
                      value={item.category}
                      onChange={(e) => updateInventoryItem(item.id, { category: e.target.value as Inventory['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="tools">Tools</option>
                      <option value="supplies">Supplies</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="seasonal">Seasonal</option>
                      <option value="emergency">Emergency</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => updateInventoryItem(item.id, { location: e.target.value })}
                      placeholder="Location..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateInventoryItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                      placeholder="Quantity..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      value={item.lowStockThreshold}
                      onChange={(e) => updateInventoryItem(item.id, { lowStockThreshold: parseInt(e.target.value) || 1 })}
                      placeholder="Low stock alert..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={item.notes}
                    onChange={(e) => updateInventoryItem(item.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Warranties Tab */}
        {activeTab === 'warranties' && (
          <div className="space-y-4">
            <button
              onClick={addWarranty}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Warranty</span>
            </button>

            {warranties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No warranties tracked yet. Never lose a warranty again!</p>
              </div>
            ) : (
              warranties.map(warranty => (
                <div key={warranty.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={warranty.item}
                      onChange={(e) => updateWarranty(warranty.id, { item: e.target.value })}
                      placeholder="Item name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteWarranty(warranty.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select
                      value={warranty.category}
                      onChange={(e) => updateWarranty(warranty.id, { category: e.target.value as Warranty['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="appliance">Appliance</option>
                      <option value="electronics">Electronics</option>
                      <option value="hvac">HVAC</option>
                      <option value="structural">Structural</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={warranty.provider}
                      onChange={(e) => updateWarranty(warranty.id, { provider: e.target.value })}
                      placeholder="Provider..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="date"
                      value={warranty.purchaseDate}
                      onChange={(e) => updateWarranty(warranty.id, { purchaseDate: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="date"
                      value={warranty.warrantyExpiration}
                      onChange={(e) => updateWarranty(warranty.id, { warrantyExpiration: e.target.value })}
                      placeholder="Expiration..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      value={warranty.cost}
                      onChange={(e) => updateWarranty(warranty.id, { cost: parseFloat(e.target.value) || 0 })}
                      placeholder="Cost..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={warranty.serialNumber || ''}
                      onChange={(e) => updateWarranty(warranty.id, { serialNumber: e.target.value })}
                      placeholder="Serial number (optional)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={warranty.notes}
                    onChange={(e) => updateWarranty(warranty.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeMaintenanceHubPage;
