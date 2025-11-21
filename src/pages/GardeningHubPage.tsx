import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, Droplet, Sun, TrendingUp, Plus, Edit2, Trash2, Star, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plant {
  id: string;
  name: string;
  type: 'vegetable' | 'herb' | 'flower' | 'fruit' | 'succulent' | 'houseplant' | 'tree' | 'other';
  variety: string;
  location: string;
  plantedDate: string;
  harvestDate?: string;
  wateringFrequency: string;
  sunlight: 'full-sun' | 'partial-sun' | 'shade';
  health: number; // 1-5
  notes: string;
  starred: boolean;
}

interface WateringLog {
  id: string;
  plantId: string;
  plantName: string;
  date: string;
  amount: string;
  notes: string;
}

interface GardenTask {
  id: string;
  task: string;
  category: 'watering' | 'fertilizing' | 'pruning' | 'weeding' | 'planting' | 'harvesting' | 'other';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  recurring: boolean;
  frequency?: string;
}

interface Harvest {
  id: string;
  plantId: string;
  plantName: string;
  date: string;
  quantity: string;
  quality: number; // 1-5
  notes: string;
}

interface GardenLayout {
  id: string;
  zone: string;
  size: string;
  soilType: string;
  sunExposure: 'full-sun' | 'partial-sun' | 'shade';
  plants: string[];
  notes: string;
}

const GardeningHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plants' | 'watering' | 'tasks' | 'harvest' | 'layout'>('plants');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [wateringLogs, setWateringLogs] = useState<WateringLog[]>([]);
  const [tasks, setTasks] = useState<GardenTask[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [layouts, setLayouts] = useState<GardenLayout[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedPlants = localStorage.getItem('gardenPlants');
    const savedWatering = localStorage.getItem('wateringLogs');
    const savedTasks = localStorage.getItem('gardenTasks');
    const savedHarvests = localStorage.getItem('gardenHarvests');
    const savedLayouts = localStorage.getItem('gardenLayouts');

    if (savedPlants) setPlants(JSON.parse(savedPlants));
    if (savedWatering) setWateringLogs(JSON.parse(savedWatering));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHarvests) setHarvests(JSON.parse(savedHarvests));
    if (savedLayouts) setLayouts(JSON.parse(savedLayouts));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gardenPlants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('wateringLogs', JSON.stringify(wateringLogs));
  }, [wateringLogs]);

  useEffect(() => {
    localStorage.setItem('gardenTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('gardenHarvests', JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem('gardenLayouts', JSON.stringify(layouts));
  }, [layouts]);

  const addPlant = () => {
    const newPlant: Plant = {
      id: Date.now().toString(),
      name: '',
      type: 'vegetable',
      variety: '',
      location: '',
      plantedDate: new Date().toISOString().split('T')[0],
      wateringFrequency: '',
      sunlight: 'full-sun',
      health: 5,
      notes: '',
      starred: false,
    };
    setPlants([...plants, newPlant]);
    toast.success('Plant added');
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setPlants(plants.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Plant updated');
  };

  const deletePlant = (id: string) => {
    setPlants(plants.filter(p => p.id !== id));
    toast.success('Plant deleted');
  };

  const addWateringLog = () => {
    if (plants.length === 0) {
      toast.error('Add a plant first!');
      return;
    }
    const newLog: WateringLog = {
      id: Date.now().toString(),
      plantId: plants[0].id,
      plantName: plants[0].name,
      date: new Date().toISOString().split('T')[0],
      amount: '',
      notes: '',
    };
    setWateringLogs([...wateringLogs, newLog]);
    toast.success('Watering logged');
  };

  const updateWateringLog = (id: string, updates: Partial<WateringLog>) => {
    setWateringLogs(wateringLogs.map(log => log.id === id ? { ...log, ...updates } : log));
    toast.success('Log updated');
  };

  const deleteWateringLog = (id: string) => {
    setWateringLogs(wateringLogs.filter(log => log.id !== id));
    toast.success('Log deleted');
  };

  const addTask = () => {
    const newTask: GardenTask = {
      id: Date.now().toString(),
      task: '',
      category: 'watering',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      recurring: false,
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added');
  };

  const updateTask = (id: string, updates: Partial<GardenTask>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Task updated');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const addHarvest = () => {
    if (plants.length === 0) {
      toast.error('Add a plant first!');
      return;
    }
    const newHarvest: Harvest = {
      id: Date.now().toString(),
      plantId: plants[0].id,
      plantName: plants[0].name,
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      quality: 4,
      notes: '',
    };
    setHarvests([...harvests, newHarvest]);
    toast.success('Harvest logged');
  };

  const updateHarvest = (id: string, updates: Partial<Harvest>) => {
    setHarvests(harvests.map(h => h.id === id ? { ...h, ...updates } : h));
    toast.success('Harvest updated');
  };

  const deleteHarvest = (id: string) => {
    setHarvests(harvests.filter(h => h.id !== id));
    toast.success('Harvest deleted');
  };

  const addLayout = () => {
    const newLayout: GardenLayout = {
      id: Date.now().toString(),
      zone: '',
      size: '',
      soilType: '',
      sunExposure: 'full-sun',
      plants: [],
      notes: '',
    };
    setLayouts([...layouts, newLayout]);
    toast.success('Garden zone added');
  };

  const updateLayout = (id: string, updates: Partial<GardenLayout>) => {
    setLayouts(layouts.map(l => l.id === id ? { ...l, ...updates } : l));
    toast.success('Layout updated');
  };

  const deleteLayout = (id: string) => {
    setLayouts(layouts.filter(l => l.id !== id));
    toast.success('Layout deleted');
  };

  const totalPlants = plants.length;
  const healthyPlants = plants.filter(p => p.health >= 4).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const recentHarvests = harvests.filter(h => {
    const harvestDate = new Date(h.date);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return harvestDate >= monthAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Sprout className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Gardening Hub</h1>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Sprout className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalPlants}</div>
            <div className="text-xs opacity-90">Total Plants</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Sun className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{healthyPlants}</div>
            <div className="text-xs opacity-90">Healthy</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingTasks}</div>
            <div className="text-xs opacity-90">Tasks Due</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{recentHarvests}</div>
            <div className="text-xs opacity-90">Harvests (30d)</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'plants', label: 'Plants', icon: Sprout },
            { id: 'watering', label: 'Watering', icon: Droplet },
            { id: 'tasks', label: 'Tasks', icon: Calendar },
            { id: 'harvest', label: 'Harvest', icon: TrendingUp },
            { id: 'layout', label: 'Layout', icon: Sun },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
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
        {/* Plants Tab */}
        {activeTab === 'plants' && (
          <div className="space-y-4">
            <button
              onClick={addPlant}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Plant</span>
            </button>

            {plants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sprout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No plants yet. Start your garden!</p>
              </div>
            ) : (
              plants.map(plant => (
                <div key={plant.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={plant.name}
                      onChange={(e) => updatePlant(plant.id, { name: e.target.value })}
                      placeholder="Plant name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updatePlant(plant.id, { starred: !plant.starred })}
                        className={plant.starred ? 'text-green-500' : 'text-gray-300'}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                      <button onClick={() => deletePlant(plant.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={plant.type}
                      onChange={(e) => updatePlant(plant.id, { type: e.target.value as Plant['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="vegetable">Vegetable</option>
                      <option value="herb">Herb</option>
                      <option value="flower">Flower</option>
                      <option value="fruit">Fruit</option>
                      <option value="succulent">Succulent</option>
                      <option value="houseplant">Houseplant</option>
                      <option value="tree">Tree</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={plant.variety}
                      onChange={(e) => updatePlant(plant.id, { variety: e.target.value })}
                      placeholder="Variety..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plant.location}
                      onChange={(e) => updatePlant(plant.id, { location: e.target.value })}
                      placeholder="Location..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="date"
                      value={plant.plantedDate}
                      onChange={(e) => updatePlant(plant.id, { plantedDate: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plant.wateringFrequency}
                      onChange={(e) => updatePlant(plant.id, { wateringFrequency: e.target.value })}
                      placeholder="Water every..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <select
                      value={plant.sunlight}
                      onChange={(e) => updatePlant(plant.id, { sunlight: e.target.value as Plant['sunlight'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="full-sun">Full Sun</option>
                      <option value="partial-sun">Partial Sun</option>
                      <option value="shade">Shade</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Health: {plant.health}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updatePlant(plant.id, { health: level })}
                          className={`w-10 h-10 rounded ${level <= plant.health ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={plant.notes}
                    onChange={(e) => updatePlant(plant.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Watering Tab */}
        {activeTab === 'watering' && (
          <div className="space-y-4">
            <button
              onClick={addWateringLog}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Log Watering</span>
            </button>

            {wateringLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Droplet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No watering logs yet. Track your watering schedule!</p>
              </div>
            ) : (
              wateringLogs.map(log => (
                <div key={log.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <select
                      value={log.plantId}
                      onChange={(e) => {
                        const selectedPlant = plants.find(p => p.id === e.target.value);
                        updateWateringLog(log.id, {
                          plantId: e.target.value,
                          plantName: selectedPlant?.name || ''
                        });
                      }}
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    >
                      {plants.map(plant => (
                        <option key={plant.id} value={plant.id}>{plant.name}</option>
                      ))}
                    </select>
                    <button onClick={() => deleteWateringLog(log.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="date"
                      value={log.date}
                      onChange={(e) => updateWateringLog(log.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={log.amount}
                      onChange={(e) => updateWateringLog(log.id, { amount: e.target.value })}
                      placeholder="Amount..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={log.notes}
                    onChange={(e) => updateWateringLog(log.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <button
              onClick={addTask}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>

            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Plan your garden work!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${task.completed ? 'border-green-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={task.task}
                      onChange={(e) => updateTask(task.id, { task: e.target.value })}
                      placeholder="Task..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select
                      value={task.category}
                      onChange={(e) => updateTask(task.id, { category: e.target.value as GardenTask['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="watering">Watering</option>
                      <option value="fertilizing">Fertilizing</option>
                      <option value="pruning">Pruning</option>
                      <option value="weeding">Weeding</option>
                      <option value="planting">Planting</option>
                      <option value="harvesting">Harvesting</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(task.id, { priority: e.target.value as GardenTask['priority'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none col-span-2"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Completed</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={task.recurring}
                        onChange={(e) => updateTask(task.id, { recurring: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Recurring</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Harvest Tab */}
        {activeTab === 'harvest' && (
          <div className="space-y-4">
            <button
              onClick={addHarvest}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Log Harvest</span>
            </button>

            {harvests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No harvests yet. Log your garden yields!</p>
              </div>
            ) : (
              harvests.map(harvest => (
                <div key={harvest.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <select
                      value={harvest.plantId}
                      onChange={(e) => {
                        const selectedPlant = plants.find(p => p.id === e.target.value);
                        updateHarvest(harvest.id, {
                          plantId: e.target.value,
                          plantName: selectedPlant?.name || ''
                        });
                      }}
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    >
                      {plants.map(plant => (
                        <option key={plant.id} value={plant.id}>{plant.name}</option>
                      ))}
                    </select>
                    <button onClick={() => deleteHarvest(harvest.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="date"
                      value={harvest.date}
                      onChange={(e) => updateHarvest(harvest.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={harvest.quantity}
                      onChange={(e) => updateHarvest(harvest.id, { quantity: e.target.value })}
                      placeholder="Quantity..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Quality: {harvest.quality}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateHarvest(harvest.id, { quality: level })}
                          className={`w-10 h-10 rounded ${level <= harvest.quality ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={harvest.notes}
                    onChange={(e) => updateHarvest(harvest.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <button
              onClick={addLayout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Garden Zone</span>
            </button>

            {layouts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sun className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No garden zones yet. Plan your layout!</p>
              </div>
            ) : (
              layouts.map(layout => (
                <div key={layout.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={layout.zone}
                      onChange={(e) => updateLayout(layout.id, { zone: e.target.value })}
                      placeholder="Zone name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteLayout(layout.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="text"
                      value={layout.size}
                      onChange={(e) => updateLayout(layout.id, { size: e.target.value })}
                      placeholder="Size..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={layout.soilType}
                      onChange={(e) => updateLayout(layout.id, { soilType: e.target.value })}
                      placeholder="Soil type..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <select
                      value={layout.sunExposure}
                      onChange={(e) => updateLayout(layout.id, { sunExposure: e.target.value as GardenLayout['sunExposure'] })}
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="full-sun">Full Sun</option>
                      <option value="partial-sun">Partial Sun</option>
                      <option value="shade">Shade</option>
                    </select>
                  </div>

                  <textarea
                    value={layout.notes}
                    onChange={(e) => updateLayout(layout.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
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

export default GardeningHubPage;
