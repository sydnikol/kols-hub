import React, { useState, useEffect } from 'react';
import { Home, Wrench, CheckCircle, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface HomeTask {
  id: string;
  title: string;
  category: 'cleaning' | 'maintenance' | 'organization' | 'repair' | 'upgrade' | 'decoration' | 'outdoor' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'deferred';
  dueDate?: string;
  estimatedTime?: number; // minutes
  actualTime?: number;
  cost?: number;
  notes: string;
}

interface MaintenanceItem {
  id: string;
  item: string;
  category: 'appliance' | 'hvac' | 'plumbing' | 'electrical' | 'structural' | 'other';
  lastMaintenance?: string;
  nextMaintenance?: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'as-needed';
  cost: number;
  provider?: string;
  notes: string;
}

interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living-room' | 'office' | 'garage' | 'outdoor' | 'other';
  size?: number; // square feet
  condition: 'excellent' | 'good' | 'fair' | 'needs-work';
  lastCleaned?: string;
  organizationLevel: number; // 1-5
  improvementIdeas: string;
}

const HomeManagementHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'maintenance' | 'rooms' | 'stats'>('tasks');
  const [tasks, setTasks] = useState<HomeTask[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('homeTasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    const savedMaintenance = localStorage.getItem('homeMaintenance');
    if (savedMaintenance) setMaintenance(JSON.parse(savedMaintenance));
    const savedRooms = localStorage.getItem('homeRooms');
    if (savedRooms) setRooms(JSON.parse(savedRooms));
  }, []);

  useEffect(() => { localStorage.setItem('homeTasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('homeMaintenance', JSON.stringify(maintenance)); }, [maintenance]);
  useEffect(() => { localStorage.setItem('homeRooms', JSON.stringify(rooms)); }, [rooms]);

  const addTask = () => {
    const newTask: HomeTask = {
      id: Date.now().toString(),
      title: '',
      category: 'cleaning',
      priority: 'medium',
      status: 'pending',
      notes: '',
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added');
  };

  const updateTask = (id: string, updates: Partial<HomeTask>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Task updated');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const addMaintenanceItem = () => {
    const newItem: MaintenanceItem = {
      id: Date.now().toString(),
      item: '',
      category: 'appliance',
      frequency: 'annual',
      cost: 0,
      notes: '',
    };
    setMaintenance([...maintenance, newItem]);
    toast.success('Maintenance item added');
  };

  const updateMaintenanceItem = (id: string, updates: Partial<MaintenanceItem>) => {
    setMaintenance(maintenance.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Maintenance item updated');
  };

  const deleteMaintenanceItem = (id: string) => {
    setMaintenance(maintenance.filter(m => m.id !== id));
    toast.success('Maintenance item deleted');
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: '',
      type: 'other',
      condition: 'good',
      organizationLevel: 3,
      improvementIdeas: '',
    };
    setRooms([...rooms, newRoom]);
    toast.success('Room added');
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Room updated');
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
    toast.success('Room deleted');
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const avgOrganization = rooms.length > 0 ? (rooms.reduce((sum, r) => sum + r.organizationLevel, 0) / rooms.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Home className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Home Management Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingTasks}</div>
            <div className="text-xs opacity-90">Pending</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedTasks}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Wrench className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{maintenance.length}</div>
            <div className="text-xs opacity-90">Maintenance</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Home className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{rooms.length}</div>
            <div className="text-xs opacity-90">Rooms</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'rooms', label: 'Rooms', icon: Home },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <button onClick={addTask} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Home className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Keep your home organized!</p>
              </div>
            ) : (
              tasks.sort((a, b) => {
                const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }).map(task => (
                <div key={task.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${task.status === 'completed' ? 'border-green-500' : task.priority === 'urgent' ? 'border-red-500' : task.priority === 'high' ? 'border-orange-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={task.title} onChange={(e) => updateTask(task.id, { title: e.target.value })} placeholder="Task title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={task.category} onChange={(e) => updateTask(task.id, { category: e.target.value as HomeTask['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="organization">Organization</option>
                      <option value="repair">Repair</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="decoration">Decoration</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={task.priority} onChange={(e) => updateTask(task.id, { priority: e.target.value as HomeTask['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value as HomeTask['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="deferred">Deferred</option>
                    </select>
                    <input type="date" value={task.dueDate || ''} onChange={(e) => updateTask(task.id, { dueDate: e.target.value })} placeholder="Due date..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                  </div>
                  <textarea value={task.notes} onChange={(e) => updateTask(task.id, { notes: e.target.value })} placeholder="Notes, instructions..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <button onClick={addMaintenanceItem} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Maintenance Item</span>
            </button>
            {maintenance.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={item.item} onChange={(e) => updateMaintenanceItem(item.id, { item: e.target.value })} placeholder="Item name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none flex-1 mr-2" />
                  <button onClick={() => deleteMaintenanceItem(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={item.category} onChange={(e) => updateMaintenanceItem(item.id, { category: e.target.value as MaintenanceItem['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                    <option value="appliance">Appliance</option>
                    <option value="hvac">HVAC</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="structural">Structural</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={item.frequency} onChange={(e) => updateMaintenanceItem(item.id, { frequency: e.target.value as MaintenanceItem['frequency'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="biannual">Biannual</option>
                    <option value="annual">Annual</option>
                    <option value="as-needed">As Needed</option>
                  </select>
                  <input type="date" value={item.lastMaintenance || ''} onChange={(e) => updateMaintenanceItem(item.id, { lastMaintenance: e.target.value })} placeholder="Last maintenance..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                  <input type="date" value={item.nextMaintenance || ''} onChange={(e) => updateMaintenanceItem(item.id, { nextMaintenance: e.target.value })} placeholder="Next maintenance..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                  <input type="number" step="0.01" value={item.cost} onChange={(e) => updateMaintenanceItem(item.id, { cost: parseFloat(e.target.value) || 0 })} placeholder="Cost..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                  <input type="text" value={item.provider || ''} onChange={(e) => updateMaintenanceItem(item.id, { provider: e.target.value })} placeholder="Provider..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                </div>
                <textarea value={item.notes} onChange={(e) => updateMaintenanceItem(item.id, { notes: e.target.value })} placeholder="Notes, warranty info..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <button onClick={addRoom} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Room</span>
            </button>
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={room.name} onChange={(e) => updateRoom(room.id, { name: e.target.value })} placeholder="Room name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none flex-1 mr-2" />
                  <button onClick={() => deleteRoom(room.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={room.type} onChange={(e) => updateRoom(room.id, { type: e.target.value as Room['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                    <option value="bedroom">Bedroom</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="living-room">Living Room</option>
                    <option value="office">Office</option>
                    <option value="garage">Garage</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={room.condition} onChange={(e) => updateRoom(room.id, { condition: e.target.value as Room['condition'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs-work">Needs Work</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">Organization Level: {room.organizationLevel}/5</label>
                  <input type="range" min="1" max="5" value={room.organizationLevel} onChange={(e) => updateRoom(room.id, { organizationLevel: parseInt(e.target.value) })} className="w-full" />
                </div>
                <textarea value={room.improvementIdeas} onChange={(e) => updateRoom(room.id, { improvementIdeas: e.target.value })} placeholder="Improvement ideas..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600">Home Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks:</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Tasks:</span>
                  <span className="font-semibold">{pendingTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Tasks:</span>
                  <span className="font-semibold">{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance Items:</span>
                  <span className="font-semibold">{maintenance.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Maintenance Cost:</span>
                  <span className="font-semibold">${totalMaintenanceCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms Tracked:</span>
                  <span className="font-semibold">{rooms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Organization:</span>
                  <span className="font-semibold">{avgOrganization}/5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeManagementHubPage;
