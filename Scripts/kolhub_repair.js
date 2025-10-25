/**
 * KolHub OS v3 — Auto-Heal + Auto-Launch Repair Script
 * Works on Windows, macOS, and Linux.
 * Fixes dependency issues, reinstalls missing modules, and launches servers.
 */

import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";

const run = (cmd, desc = "") => {
  console.log(`\n⚙️ ${desc || "Running"}: ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.warn(`⚠️ Command failed: ${cmd}\n${err.message}`);
  }
};

// 🧩 Environment Version Check
try {
  const nodeVersion = process.versions.node;
  const npmVersion = execSync("npm -v").toString().trim();
  console.log(`🧠 Node.js v${nodeVersion} | npm v${npmVersion}`);
} catch {
  console.error("❌ npm not found. Please install Node.js LTS (18+).");
  process.exit(1);
}

// 🧹 Cleanup
["node_modules", "package-lock.json"].forEach((item) => {
  if (fs.existsSync(item)) fs.rmSync(item, { recursive: true, force: true });
});
run("npm cache clean --force", "Cleaning npm cache");

// 🧱 Install Core Dependencies
run(
  "npm install express cors dotenv sqlite3 react-router-dom vite @vitejs/plugin-react --legacy-peer-deps",
  "Installing core backend & frontend dependencies"
);

// ⚡ Capacitor (stable versions)
run(
  "npm install @capacitor/core@5.7.8 @capacitor/app@5.0.8 @capacitor/android@5.7.8 @capacitor/ios@5.7.8 @capacitor/splash-screen@5.0.8 --legacy-peer-deps",
  "Installing Capacitor stable dependencies"
);

// 🔧 Ensure .env exists
const envFile = path.join(process.cwd(), ".env");
if (!fs.existsSync(envFile)) {
  console.log("🪄 Creating .env...");
  fs.writeFileSync(
    envFile,
    `AI_API_KEY=your_cloud_key_here
GOOGLE_CLIENT_ID=your_oauth_client_id
VITE_API_BASE=/api
NODE_ENV=development`
  );
} else {
  console.log("✅ .env already exists.");
}

// 🔍 Detect Backend Entry
const backendCandidates = ["server.js", "server/index.js"];
let backendPath = backendCandidates.find((f) => fs.existsSync(f));
if (!backendPath) {
  console.warn("⚠️ No backend file found! Creating a simple Express server...");
  const defaultServer = `
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("KolHub Backend Active ✅"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
`;
  fs.writeFileSync("server.js", defaultServer);
  backendPath = "server.js";
}

// 🏗️ Rebuild Frontend
run("npx vite build", "Building frontend");

// 🚀 Launch backend, frontend, and Electron
console.log("\n🚀 Launching KolHub OS...");
console.log("➡ Backend: http://localhost:3000");
console.log("➡ Frontend: http://localhost:5173");
console.log("➡ Electron Desktop: Starting...");

const backend = spawn("node", [backendPath], { stdio: "inherit", shell: true });
const frontend = spawn("npx", ["vite"], { stdio: "inherit", shell: true });

// Give frontend a few seconds to boot, then start Electron
setTimeout(() => {
  try {
    spawn("npx", ["electron", "."], { stdio: "inherit", shell: true });
  } catch (err) {
    console.warn("⚠️ Electron launch failed. Try installing with: npm install electron -D");
  }
}, 5000);

// Handle exit cleanly
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping KolHub OS...");
  backend.kill("SIGINT");
  frontend.kill("SIGINT");
  process.exit(0);
});

console.log("\n✅ KolHub repair + auto-launch complete!");
