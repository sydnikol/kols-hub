import express from "express";
import { initDB } from "../db.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const db = await initDB();
  const data = await db.all("SELECT * FROM relationships ORDER BY updated DESC");
  res.json(data);
});

router.post("/", async (req, res) => {
  const { name, type, boundaries, care_notes } = req.body;
  const db = await initDB();
  await db.run(
    "INSERT INTO relationships (name, type, boundaries, care_notes) VALUES (?, ?, ?, ?)",
    [name, type, boundaries, care_notes]
  );
  res.json({ ok: true });
});

export default router;
