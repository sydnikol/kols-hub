import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * KOL Theme Generator – MVP
 * - Loads seed themes from /mnt/data/alt_goth_ui_themes_100.json
 * - Prompt → Generate Theme → Live Preview → Save (localStorage + download JSON)
 * - Cross‑platform friendly (PWA/Electron/Capacitor)
 */

// ---- Types ---------------------------------------------------------------
type Theme = {
  id: string;
  name: string;
  palette: { bg: string; surface: string; text: string; muted: string; brand: string; accent: string };
  materials: { wood: string; stone: string; metal: string };
  lighting: { kelvin: number; contrast: number; edgeGlow: number };
  radius: { card: number; control: number };
  elevation: { low: string; high: string };
  textures: { surface: string };
  motion: { easing: string; durationMs: number };
  beatReactivity: { intensity: number; bands: number[] };
  typography: { display: string; text: string };
};

type SeedIdea = {
  name: string;
  tags?: string[];
  palette?: Partial<Theme["palette"]> & { hint?: string };
  lighting?: Partial<Theme["lighting"]>;
  textures?: Partial<Theme["textures"]>;
  materials?: Partial<Theme["materials"]>;
};

// ---- Utilities -----------------------------------------------------------
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 };
}
function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) => v.toString(16).padStart(2, "0");
  return `#${to(Math.round(r))}${to(Math.round(g))}${to(Math.round(b))}`;
}
function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.r + (B.r - A.r) * t, A.g + (B.g - A.g) * t, A.b + (B.b - A.b) * t);
}
function ensureContrast(bg: string, text: string) {
  // Very light heuristic: if contrast too low, push text toward white/black
  const { r: br, g: bg_, b: bb } = hexToRgb(bg);
  const { r: tr, g: tg, b: tb } = hexToRgb(text);
  const luma = (0.2126 * br + 0.7152 * bg_ + 0.0722 * bb) / 255;
  const textLuma = (0.2126 * tr + 0.7152 * tg + 0.0722 * tb) / 255;
  const contrast = (Math.max(luma, textLuma) + 0.05) / (Math.min(luma, textLuma) + 0.05);
  if (contrast >= 4.5) return text; // approx WCAG AA
  return luma > 0.5 ? "#0C0D10" : "#EDEFF2";
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

// Default fallback base
const BASE: Theme = {
  id: "modern-noir-penthouse",
  name: "Modern Noir Penthouse",
  palette: { bg: "#0C0D10", surface: "#14161A", text: "#EDEFF2", muted: "#A8AFBF", brand: "#D4AF37", accent: "#7BD1FF" },
  materials: { wood: "walnut", stone: "marquina", metal: "brass" },
  lighting: { kelvin: 2900, contrast: 0.85, edgeGlow: 0.2 },
  radius: { card: 24, control: 14 },
  elevation: { low: "0 2px 8px rgba(0,0,0,.35)", high: "0 10px 30px rgba(0,0,0,.45)" },
  textures: { surface: "glass" },
  motion: { easing: "cubic-bezier(.2,.8,.2,1)", durationMs: 320 },
  beatReactivity: { intensity: 0.4, bands: [60, 120, 240] },
  typography: { display: "Cinzel", text: "Inter" },
};

// ---- Theme synthesis (heuristic MVP) ------------------------------------
function synthTheme(prompt: string, seeds: SeedIdea[], warmCool: number, contrastBoost: number, edgeGlow: number): Theme {
  const words = prompt.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);
  // score seeds by tag overlap / name match
  const scored = seeds
    .map((s) => {
      const tagScore = (s.tags || []).reduce((acc, t) => acc + (words.includes(t.toLowerCase()) ? 1 : 0), 0);
      const nameScore = words.some((w) => (s.name || "").toLowerCase().includes(w)) ? 1 : 0;
      return { seed: s, score: tagScore * 2 + nameScore };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).map((x) => x.seed);
  const base = { ...BASE };

  // Mix palettes
  let bg = base.palette.bg;
  let surface = base.palette.surface;
  let brand = base.palette.brand;
  let accent = base.palette.accent;

  if (top[0]?.palette?.bg) bg = mixHex(bg, top[0].palette!.bg!, 0.6);
  if (top[1]?.palette?.bg) bg = mixHex(bg, top[1].palette!.bg!, 0.3);
  if (top[0]?.palette?.brand) brand = mixHex(brand, top[0].palette!.brand!, 0.5);
  if (top[0]?.palette?.accent) accent = mixHex(accent, top[0].palette!.accent!, 0.6);

  // Warm/Cool shift via mixing toward warm (amber) or cool (ice)
  const warm = "#D0A060";
  const cool = "#A5D8FF";
  const shift = warmCool >= 0.5 ? warm : cool;
  const t = Math.abs(warmCool - 0.5) * 0.5; // max 0.25 blend
  bg = mixHex(bg, shift, t * 0.2);
  surface = mixHex(surface, shift, t * 0.1);
  brand = mixHex(brand, shift, t * 0.3);
  accent = mixHex(accent, shift, t * 0.4);

  // Lighting & materials from top seed hints
  const lighting = {
    kelvin: Math.round(BASE.lighting.kelvin + (warmCool - 0.5) * -800),
    contrast: clamp01(BASE.lighting.contrast + (contrastBoost - 0.5) * 0.4),
    edgeGlow: clamp01(edgeGlow),
  };
  const materials = {
    wood: top[0]?.materials?.wood || BASE.materials.wood,
    stone: top[0]?.materials?.stone || BASE.materials.stone,
    metal: top[0]?.materials?.metal || BASE.materials.metal,
  };

  const text = ensureContrast(bg, BASE.palette.text);
  const theme: Theme = {
    ...BASE,
    id: slug(`${prompt || "custom"}-${Date.now()}`),
    name: prompt ? prompt.replace(/\s+/g, " ").trim() : "Custom Theme",
    palette: { bg, surface, text, muted: BASE.palette.muted, brand, accent },
    lighting,
    materials,
  };
  return theme;
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.palette.bg);
  root.style.setProperty("--surface", theme.palette.surface);
  root.style.setProperty("--text", theme.palette.text);
  root.style.setProperty("--muted", theme.palette.muted);
  root.style.setProperty("--brand", theme.palette.brand);
  root.style.setProperty("--accent", theme.palette.accent);
}

function downloadJSON(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- Component -----------------------------------------------------------
export default function ThemeLab() {
  const [seeds, setSeeds] = useState<SeedIdea[]>([]);
  const [prompt, setPrompt] = useState("baroque cyberpunk winter");
  const [warmCool, setWarmCool] = useState(0.55); // >0.5 warm
  const [contrastBoost, setContrastBoost] = useState(0.6);
  const [edgeGlow, setEdgeGlow] = useState(0.25);
  const [theme, setTheme] = useState<Theme>(BASE);
  const [saved, setSaved] = useState<string | null>(null);
  const [packInfo, setPackInfo] = useState<{ name: string; version: string; count: number } | null>(null);
  const [presets, setPresets] = useState<Theme[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load any previously imported pack from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kol-theme-pack");
      if (raw) {
        const pack = JSON.parse(raw);
        const pr: Theme[] = Array.isArray(pack?.presets) ? pack.presets : [];
        if (pr.length) {
          setPresets(pr);
          if (!selectedId) {
            setSelectedId(pr[0].id);
            setTheme(pr[0]);
          }
        }
      }
    } catch {}
  }, []);

  async function onImportPack() {
    try {
      const res = await fetch("/mnt/data/kol_theme_pack.json");
      const pack = await res.json();
      const pr: Theme[] = Array.isArray(pack?.presets) ? pack.presets : [];
      localStorage.setItem("kol-theme-pack", JSON.stringify(pack));
      setPackInfo({ name: pack.name || "Theme Pack", version: pack.version || "", count: pr.length });
      setPresets(pr);
      if (pr.length) { setSelectedId(pr[0].id); setTheme(pr[0]); }
    } catch (err) {
      console.error(err);
      setPackInfo({ name: "Import failed", version: "", count: 0 });
    }
  }

  function onSelectPreset(id: string) {
    setSelectedId(id);
    const p = presets.find(x => x.id === id);
    if (p) setTheme(p);
  });
      if (presets.length) setTheme(presets[0]);
    } catch (err) {
      console.error(err);
      setPackInfo({ name: "Import failed", version: "", count: 0 });
    }
  }

  // Load seeds (local file path provided in chat history)
  useEffect(() => {
    fetch("/mnt/data/alt_goth_ui_themes_100.json")
      .then((r) => r.json())
      .then((data) => setSeeds(data as SeedIdea[]))
      .catch(() => setSeeds([]));
  }, []);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const previewStyle: React.CSSProperties = useMemo(
    () => ({
      background: `radial-gradient(1200px 800px at 70% 0%, ${theme.palette.surface} 0%, ${theme.palette.bg} 60%)`,
      color: theme.palette.text,
    }),
    [theme]
  );

  function onGenerate() {
    const next = synthTheme(prompt, seeds, warmCool, contrastBoost, edgeGlow);
    setTheme(next);
  }

  function onSave() {
    const key = `kol-theme-${theme.id}`;
    localStorage.setItem(key, JSON.stringify(theme));
    setSaved(key);
    downloadJSON(`${theme.id}.json`, theme);
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={previewStyle}>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {/* Controls */}
        <motion.div
          className="rounded-2xl p-4 md:p-6 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(212,175,55,0.25)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: theme.palette.text }}>AI Theme Generator</h2>
          <label className="text-sm opacity-80">Prompt</label>
          <input
            className="w-full mt-1 mb-3 rounded-xl px-3 py-2 bg-[rgba(0,0,0,0.35)] border border-[rgba(255,255,255,0.12)]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., witchy conservatory night"
            style={{ color: theme.palette.text }}
          />

          <div className="mt-2">
            <label className="text-sm opacity-80">Warm ↔ Cool</label>
            <input type="range" min={0} max={1} step={0.01} value={warmCool} onChange={(e) => setWarmCool(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div className="mt-2">
            <label className="text-sm opacity-80">Contrast Boost</label>
            <input type="range" min={0} max={1} step={0.01} value={contrastBoost} onChange={(e) => setContrastBoost(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div className="mt-2">
            <label className="text-sm opacity-80">Edge Glow</label>
            <input type="range" min={0} max={1} step={0.01} value={edgeGlow} onChange={(e) => setEdgeGlow(parseFloat(e.target.value))} className="w-full" />
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={onGenerate} className="px-4 py-2 rounded-xl bg-[rgba(212,175,55,0.9)] text-black font-medium">Generate</button>
            <button onClick={onSave} className="px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.25)]">Save Theme</button>
            <button onClick={onImportPack} className="px-4 py-2 rounded-xl border border-[rgba(123,209,255,0.6)]">Import Theme Pack</button>
          </div>

          {packInfo && (
            <p className="text-xs opacity-70 mt-2">Imported <b>{packInfo.name}</b> v{packInfo.version} ▸ {packInfo.count} presets. First preset applied.</p>
          )}

          {presets.length > 0 && (
            <div className="mt-3">
              <label className="text-sm opacity-80">Preset</label>
              <select
                className="w-full mt-1 rounded-xl px-3 py-2 bg-[rgba(0,0,0,0.35)] border border-[rgba(255,255,255,0.12)]"
                value={selectedId || ""}
                onChange={(e) => onSelectPreset(e.target.value)}
                style={{ color: theme.palette.text }}
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {saved && <p className="text-xs opacity-70 mt-2">Saved locally as <code>{saved}</code> and downloaded JSON.</p>}

          <div className="text-xs opacity-70 mt-4">
            <p>Seeds loaded: {seeds.length}</p>
            <p>Current: <b>{theme.name}</b></p>
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          className="rounded-2xl p-4 md:p-6 border border-[rgba(212,175,55,0.25)] backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.06)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(theme.palette).map(([k, v]) => (
              <div key={k} className="rounded-xl h-12 border border-[rgba(255,255,255,0.15)]" style={{ background: v }} title={`${k}: ${v}`}></div>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl p-4" style={{ background: theme.palette.surface, boxShadow: theme.elevation.high }}>
              <div className="text-sm opacity-80">Scene Card</div>
              <div className="text-2xl font-semibold" style={{ color: theme.palette.text }}>Luxury Apartment</div>
              <div className="text-sm" style={{ color: theme.palette.muted }}>brass • smoked glass • warm {theme.lighting.kelvin}K</div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-2 rounded-xl" style={{ background: theme.palette.brand, color: "#0C0D10" }}>Primary</button>
                <button className="px-3 py-2 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.25)" }}>Ghost</button>
              </div>
            </div>
            <div className="rounded-2xl p-4 grid grid-cols-3 gap-3" style={{ background: "rgba(0,0,0,0.25)" }}>
              {["Hydration", "Sodium", "Mood"].map((label) => (
                <div key={label} className="rounded-2xl p-3 border border-[rgba(255,255,255,0.12)]" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="text-xs opacity-75">{label}</div>
                  <div className="text-xl font-semibold">{Math.floor(Math.random() * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Token JSON */}
        <motion.div
          className="rounded-2xl p-4 md:p-6 bg-[rgba(0,0,0,0.35)] border border-[rgba(255,255,255,0.12)] overflow-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-2">Theme JSON</h3>
          <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(theme, null, 2)}</pre>
        </motion.div>
      </div>
    </div>
  );
}


## Method – Wardrobe Scanner & Dress‑Up (MVP)

**Goal:** Let users scan real clothes with their phone, auto‑catalog them, and play dress‑up (2D now; 3D avatar try‑on beta) — all cross‑platform.

### Capture → Catalog → Dress‑Up pipeline
1) **Capture** (mobile camera): user photographs garment on a plain surface (guides + grid). Optional multi‑angle (front/back/detail).  
2) **On‑device ML**: background removal + clothing segmentation (top/bottom/outerwear/shoes/accessory) and edge mask; auto color/pattern extraction; suggested category + season.  
3) **Auto‑metadata**: type, dominant colors, texture hints, brand (OCR if label visible), care icons (optional).  
4) **Catalog entry** saved locally; images stored in app sandbox. User can edit tags (occasion, sensory‑safe, warmth, vibe).  
5) **Dress‑Up**: mix‑and‑match in the **Outfit Studio**; save looks; export packing lists.  
6) **Avatar try‑on (beta)**: overlay garment masks onto a pre‑posed avatar snapshot; optional 3D proxy for tops/jackets.

### Components
- **Scanner** (Capacitor Camera/Media): capture with pose guides + auto‑crop.  
- **Segmentation**: on‑device model (e.g., TFLite) for background removal + cloth mask; fall back to serverless function if user opts in.  
- **Feature Extractor**: dominant colors (k‑means), pattern type (solid/stripe/plaid/graphic), texture hint.  
- **Classifier**: garment class → tops, bottoms, outerwear, dresses, footwear, accessory; subtypes (tee, blouse, jeans, skirt, boots, scarf…).  
- **Catalog Store**: Dexie/SQLite tables; optional backup to Firestore/Storage (user opt‑in).  
- **Outfit Engine**: rules + constraints (weather, event, “sensory safe now”).  
- **Avatar Bridge**: use your model `/mnt/data/68e94e474099d80b93c9b714.glb` (Ready Player Me) to render snapshots for 2D overlay; explore 3D garment proxies later.

### Local DB Schema (Dexie/SQLite)
- `garments`(id, kind, subtype, colors[], patterns[], warmth:int, sensory_safe:bool, season[], brand?, care?, created_at, updated_at)  
- `garment_images`(id, garment_id FK, uri, angle:enum[front,back,detail], mask_uri, width, height)  
- `outfits`(id, name, items:[garment_id], tags[], weather?, event?, created_at)  
- `wardrobe_prefs`(id, default_avatar_pose, collage_style, tryon_mode)

### Firestore/Storage (opt‑in backup)
- `users/{id}/wardrobe/{garmentId}` → garment doc (same fields)  
- Storage: `gs://wardrobe/{userId}/{garmentId}/front.png`, `mask.png`, `detail*.jpg`

### PlantUML — Capture & Catalog
```plantuml
@startuml WardrobeScan
actor User
participant "Camera UI" as Cam
participant "Segmentation (on‑device)" as Seg
participant "Feature Extractor" as FE
database "Local DB" as DB

User -> Cam: snap garment (front)
Cam -> Seg: image
Seg --> Cam: cutout + mask
Cam -> FE: cutout
FE --> Cam: colors/pattern/category
Cam -> DB: upsert garment + images + metadata
@enduml
```

### PlantUML — Dress‑Up & Avatar Snapshot (2D beta)
```plantuml
@startuml DressUp
actor User
participant "Outfit Studio" as Studio
participant "Outfit Engine" as OE
participant "Avatar Renderer (GLB)" as AR
participant "Collage Composer" as CC

User -> Studio: pick garments
Studio -> OE: validate constraints (weather/event/sensory)
OE --> Studio: ok + suggestions
Studio -> AR: render avatar pose (from /mnt/data/68e94e474099d80b93c9b714.glb)
Studio -> CC: overlay garment cutouts onto avatar snapshot
CC --> User: preview + save outfit
@enduml
```

### React hook sketches
```ts
// useClothSegmentation(file: File): Promise<{ cutout: Blob; mask: Blob }>
// useColorExtract(img: HTMLImageElement): { dominant: string[], pattern: 'solid'|'stripe'|'plaid'|'graphic' }
// useOutfitSuggestions(wardrobe, constraints): Outfit[]
```

### MVP Constraints
- Single‑angle **front** capture required; back/detail optional.  
- 2D try‑on only (overlay/collage) for reliability + speed; 3D proxies later.  
- All ML runs **on‑device** by default; serverless fallback opt‑in.

### Implementation Steps
1) Camera UI with capture guides + auto‑crop + quality checks.  
2) TFLite background removal + garment segmentation; store `mask_uri`; extract colors/pattern.  
3) Catalog CRUD + Outfit Studio (mix‑and‑match).  
4) Weather/event/sensory rules for suggestions; print/export lookboards.  
5) Avatar snapshot overlay (Ready Player Me GLB).  
6) Optional Firestore/Storage backup toggle.


## Background (Expanded – Purpose & Context)

Kol is a creative technologist from Kansas City building **KOL’s Hub** (aka “unified‑mega‑app” / “Your Self‑Evolving Personal OS”): a cross‑platform personal ecosystem (desktop/web/mobile) with online/offline modes. Philosophy: **“one hand on the keyboard, one hand on the altar.”** The app unifies health, art, activism, outfits, emotions, learning, automation, and creative tooling.

**State of the app**
- Deployed locally at `C:\Users\Asus User\Desktop\unified-mega-app` (React 18 + TS + Vite), live at kolshub.net (Netlify). Electron (desktop), PWA (web), Capacitor (mobile), IndexedDB offline‑first.
- Implemented: health + meds (Excel import, myUHealth/MySaintLukes), music (Spotify/YouTube/SoundCloud), Ready Player Me avatar (ID: 68e94e474099d80b93c9b714), 3D mood effects, 9k+ JSON feature ideas.
- Focus: build fixes, dependency updates, cross‑platform parity.

**Aesthetic/UX**
- Gothic futurism (dark, purple/indigo/violet, neon accents; no pastels). Accessibility (WCAG AA), trauma‑informed, energy‑aware (spoon theory).

**Roadmap highlights**
- 250+ backlog features; advanced AI voice; Apple Watch/Fitbit; telemedicine; community & plugins; multi‑language (ES/JA/KO); Notion/Google sync; D&D & creative tools; passive‑income product launches.

**Principles**
- Offline‑first; cross‑platform parity; comprehensive integration; unified data with historical logs; privacy‑by‑design; **automation‑only E2EE sync** in MVP.


## Theme Pack – All Variants Included

We’ve bundled **all 15 presets** into a single Theme Pack for the app (plus your AI Theme Generator stays enabled). The pack follows the Theme Token Schema so it can be applied across Web/iOS/Android/Desktop immediately.

**Included presets:** Modern Noir Penthouse, Dark Velvet, Warm Art‑Deco Luxe, Cyber‑Deco Nightclub, Brutalist Monastery, Neo‑Baroque Salon, Witchy Cottage Noir, Industrial Loft, Sola‑Punk Conservatory, Kintsugi Minimal, Desert Night Riad, Cathedral Techno, Vaporwave Boudoir, Arctic Marble Gallery, Goth Regency Study.

I’ll also attach a downloadable JSON file you can drop straight into the repo and import at runtime.
