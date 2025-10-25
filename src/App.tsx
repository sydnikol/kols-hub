import React, { useState, useEffect } from "react";
import "./index.css";

/**
 * KolHub OS v3 - Unified Hybrid Shell
 * -----------------------------------
 * React + TypeScript + Tailwind + Vite + Electron + Capacitor
 * Theme: Gothic Dark
 * Author: KolHub Core
 */

const App: React.FC = () => {
  const [theme, setTheme] = useState("dark");
  const [status, setStatus] = useState("Initializing KolHub...");

  useEffect(() => {
    // Simulate backend readiness
    const timer = setTimeout(() => setStatus("KolHub OS Ready."), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0d0d0d] text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="navbar border-b border-gray-800 bg-opacity-90 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-purple-400 tracking-widest">
            ⚙️ KolHub OS
          </h1>
          <button
            onClick={toggleTheme}
            className="btn bg-purple-700 hover:bg-purple-800 transition-all rounded-lg px-4 py-2"
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-10 flex flex-col items-center fade-in">
        <div className="card w-full md:w-3/4 lg:w-2/3 mb-8 text-center">
          <h2 className="text-2xl mb-4 font-semibold text-purple-400">
            {status}
          </h2>
          <p className="text-gray-400">
            Welcome to <strong>KolHub Unified Mega-App</strong> — a seamless environment integrating hybrid web, native, and desktop systems.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="btn bg-purple-700 hover:bg-purple-800"
            onClick={() => alert("Launching Backend...")}
          >
            🚀 Launch Backend
          </button>
          <button
            className="btn bg-gray-700 hover:bg-gray-800"
            onClick={() => alert("Opening Frontend UI...")}
          >
            🖥️ Start Frontend
          </button>
          <button
            className="btn bg-indigo-700 hover:bg-indigo-800"
            onClick={() => alert("Electron Desktop Loaded")}
          >
            💻 Start Desktop Shell
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer border-t border-gray-800">
        <p>
          © {new Date().getFullYear()} KolHub OS — Unified Hybrid Framework.
          <br />
          Built with ❤️ using React + Tailwind + Capacitor + Electron.
        </p>
      </footer>
    </div>
  );
};

export default App;
