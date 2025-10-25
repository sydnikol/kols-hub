import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";


import healthRoutes from "./routes/health.js";
import dailyRoutes from "./routes/daily.js";
import relationshipRoutes from "./routes/relationships.js";

app.use("/api/health", healthRoutes);
app.use("/api/daily", dailyRoutes);
app.use("/api/relationships", relationshipRoutes);
// Serve static build (for web and Electron)
app.use(express.static(path.resolve("dist")));

// simple SQLite setup
const dbPromise = open({
  filename: path.join(process.cwd(), "data", "kolhub.db"),
  driver: sqlite3.Database
});

app.get("/api/status", (req, res) => {
  res.json({ ok: true, version: "3.0.0" });
});

// example endpoint for Kol data
app.get("/api/kol", (req, res) => {
  const kol = JSON.parse(
    fs.readFileSync(path.join("data", "kol_ai_companion_reference.json"), "utf8")
  );
  res.json(kol);
});

// fallback route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve("dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ KolHub API running at http://localhost:${PORT}`);
});

