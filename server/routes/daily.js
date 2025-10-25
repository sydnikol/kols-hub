import express from "express";
import { initDB } from "../db.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const db = await initDB();
  const data = await db.all("SELECT * FROM health ORDER BY date DESC LIMIT 50");
  res.json(data);
});

router.post("/", async (req, res) => {
  const { hydration, energy, notes } = req.body;
  const db = await initDB();
  await db.run("INSERT INTO health (hydration, energy, notes) VALUES (?, ?, ?)", [
    hydration,
    energy,
    notes
  ]);
  res.json({ ok: true });
});

export default router;
