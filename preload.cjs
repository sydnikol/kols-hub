const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:version'),
  getName: () => ipcRenderer.invoke('app:name'),
  getPlatform: () => ipcRenderer.invoke('app:platform'),
  isDev: () => ipcRenderer.invoke('app:isDev'),
  
  // Dialog methods
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },
  
  // System info
  getSystemInfo: () => ({
    platform: process.platform,
    arch: process.arch,
    version: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  }),
  
  // Storage helpers
  store: {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
  }
});
