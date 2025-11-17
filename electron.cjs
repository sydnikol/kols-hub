const { app, BrowserWindow, Menu, shell, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

// Enable live reload for Electron in dev mode (optional)
// if (process.env.NODE_ENV === 'development') {
//   try {
//     require('electron-reload')(__dirname, {
//       electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//       hardResetMethod: 'exit'
//     });
//   } catch (e) {
//     console.log('electron-reload not available');
//   }
// }

let mainWindow;
let splashWindow;

// Configuration
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const appName = 'KOL Personal OS';
const appVersion = '1.0.0';

// Create splash screen
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: '#111827',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  // Create simple splash HTML
  const splashHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1e1b4b 0%, #111827 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Segoe UI', system-ui, sans-serif;
            color: white;
            user-select: none;
          }
          .container {
            text-align: center;
            animation: fadeIn 0.5s ease-in;
          }
          h1 {
            font-size: 3rem;
            margin: 0;
            background: linear-gradient(45deg, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 2px;
          }
          .subtitle {
            margin-top: 10px;
            font-size: 1.2rem;
            color: #9ca3af;
          }          .loading {
            margin-top: 30px;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(139, 92, 246, 0.3);
            border-top-color: #8b5cf6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: auto;
            margin-right: auto;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>KOL</h1>
          <div class="subtitle">Personal Operating System</div>
          <div class="loading"></div>
        </div>
      </body>
    </html>
  `;
  
  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`);
}
// Create main application window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    backgroundColor: '#111827',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, 'public', 'icon.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Set window title
  mainWindow.setTitle(appName);

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        { 
          label: 'New', 
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu-action', 'new')
        },        { 
          label: 'Open', 
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu-action', 'open')
        },
        { type: 'separator' },
        { 
          label: 'Save', 
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-action', 'save')
        },
        { type: 'separator' },
        { 
          label: 'Quit', 
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About ' + appName,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About ' + appName,
              message: appName,              detail: `Version: ${appVersion}\n\nYour self-evolving personal operating system.\nBuilding bridges between consciousness and code.`,
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://github.com/yourusername/kol-unified-mega-app')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  // Handle window ready to show
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
      }
      mainWindow.show();
      mainWindow.focus();
    }, isDev ? 2000 : 1500);  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation away from the app
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://') && !url.startsWith('http://localhost')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.toggleDevTools();
  });
}
// IPC Main handlers
ipcMain.handle('app:version', () => appVersion);
ipcMain.handle('app:name', () => appName);
ipcMain.handle('app:platform', () => process.platform);
ipcMain.handle('app:isDev', () => isDev);

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result;
});

ipcMain.handle('dialog:saveFile', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, data);
    return { success: true, path: result.filePath };
  }
  return { success: false };
});

// App event handlers
app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow();
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Export for testing
module.exports = { createMainWindow, createSplashWindow };
