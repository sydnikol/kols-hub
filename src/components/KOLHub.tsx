import { Users, TrendingUp, Search, Plus } from 'lucide-react'

export default function KOLHub() {
  const sampleKOLs = [
    { name: 'Sarah Johnson', followers: '125K', engagement: '4.2%', niche: 'Fashion' },
    { name: 'Mike Chen', followers: '89K', engagement: '5.1%', niche: 'Tech' },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">📊 KOL Hub</h2>
        <p className="text-blue-100">Manage and track key opinion leaders</p>
      </div>

      {/* Search & Add */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search KOLs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add KOL
          </button>
        </div>
      </div>

      {/* KOL List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Your KOLs
        </h3>
        <div className="space-y-4">
          {sampleKOLs.map((kol, idx) => (
            <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800 dark:text-white">{kol.name}</h4>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                  {kol.niche}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Followers</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{kol.followers}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Engagement</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{kol.engagement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analytics Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sampleKOLs.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total KOLs</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.7%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg Engagement</p>
          </div>
        </div>
      </div>
    </div>
  )
}
