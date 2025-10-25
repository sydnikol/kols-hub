import { FileText, CheckSquare, Bookmark, Database } from 'lucide-react'

export default function DesktopFeatures() {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">💼 Desktop Pro Tools</h2>
        <p className="text-green-100">Productivity tools for power users</p>
      </div>

      {/* Notes Manager */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Quick Notes
        </h3>
        <textarea
          placeholder="Write your notes here..."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
        />
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Save Note
        </button>
      </div>

      {/* Task Manager */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Task Manager
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <input type="checkbox" className="w-5 h-5" />
            <span className="flex-1 text-gray-800 dark:text-white">Example task 1</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <input type="checkbox" className="w-5 h-5" />
            <span className="flex-1 text-gray-800 dark:text-white">Example task 2</span>
          </div>
        </div>
        <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Add Task
        </button>
      </div>

      {/* Bookmarks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5" />
          Quick Bookmarks
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No bookmarks saved yet
        </p>
      </div>

      {/* Database Tools */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Manager
        </h3>
        <p className="text-gray-600 dark:text-gray-300">Connect to databases and manage your data</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Connect Database
        </button>
      </div>
    </div>
  )
}
