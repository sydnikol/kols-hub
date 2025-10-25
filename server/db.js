import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function initDB() {
  const db = await open({
    filename: path.join(process.cwd(), "data", "kolhub.db"),
    driver: sqlite3.Database
  });

  // Basic tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS health (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      hydration REAL,
      energy INTEGER,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS daily (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      done INTEGER DEFAULT 0,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      boundaries TEXT,
      care_notes TEXT,
      updated TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}
