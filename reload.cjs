#!/usr/bin/env node
/**
 * KolHub OS - Reload Script (Electron + Vite)
 * -------------------------------------------
 * Watches files for changes and restarts Electron automatically.
 */

const path = require("path");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

let electronProcess = null;
const electronBinary = require("electron");

// Path to your Electron main file (.cjs so it works with CommonJS)
const appPath = path.join(__dirname, "main.cjs");

// Watch these folders for file changes
const watchPaths = [
  path.join(__dirname, "src"),
  path.join(__dirname, "server"),
  path.join(__dirname, "main.cjs"),
];

// Function to start Electron
function startElectron() {
  if (electronProcess) {
    console.log("♻️ Restarting KolHub Electron Desktop...");
    electronProcess.kill();
  }

  console.log("⚙️ Starting KolHub Electron Desktop...");
  electronProcess = spawn(electronBinary, [appPath], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  });

  electronProcess.on("close", (code) => {
    if (code !== 0) {
      console.log(`⚠️ Electron exited with code ${code}`);
    }
  });
}

// Watch for changes in the source directories
console.log("🔍 Watching KolHub files for changes...");
chokidar.watch(watchPaths, { ignoreInitial: true }).on("all", (event, changedPath) => {
  console.log(`📂 File changed: ${changedPath}`);
  startElectron();
});

// Start for the first time
startElectron();
