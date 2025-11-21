const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electron', {
  platform: () => ipcRenderer.invoke('get-platform'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback)
});

console.log('🔌 Electron preload script initialized');
