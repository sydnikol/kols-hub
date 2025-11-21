## Quick orientation for AI coding agents

This repo is a "unified mega app" combining a Vite + React frontend (Dexie/IndexedDB), an optional Express backend (dormant), and packaging targets (Electron / Capacitor). The instructions below highlight the concrete, discoverable patterns an agent needs to be productive here.

1. Architecture (big picture)
   - **Frontend (PRIMARY)**: `src/` — TypeScript React app (Vite). Entry: `src/main.tsx`, top-level UI in `src/App.tsx`, components in `src/components/`, services in `src/services/`.
   - **Data layer (LOCAL FIRST)**: Dexie/IndexedDB via `src/utils/database.ts` (Kol Database). Components import `db` from services (`src/services/db.ts`) and use `db.<table>` for CRUD (e.g., `db.medications.toArray()`, `db.vitals.add(record)`).
   - **Backend (OPTIONAL)**: `server/` — Express with dormant routes. Used rarely; most app works offline-first with local IndexedDB.
   - **Data files**: JSON seeds under `data/` (e.g., `kol_ai_companion_reference.json`). Server can load these, but frontend typically uses IndexedDB.
   - **Packaging**: Electron (`electron-main.js`) and Capacitor (`capacitor.config.json`) for desktop/mobile; both rely on `dist/` build from Vite.

2. Data persistence and core workflows
   - **IndexedDB-first**: All user data (medications, vitals, hydration, moods, ideas, preferences, etc.) lives in Dexie tables. Import `const { db } = require('../services/db')` in components.
   - **Dexie usage**: Tables are defined as interfaces in `src/utils/database.ts` (e.g., `MedicationRecord`, `VitalRecord`, `HydrationRecord`). Access via `db.<table>.<method>()`:
     - `db.medications.toArray()` — fetch all
     - `db.medications.add(record)` — insert
     - `db.medications.update(id, changes)` — partial update
     - `db.vitals.where('timestamp').aboveOrEqual(date).toArray()` — range queries
   - **Frontend dev**: `npm run dev` (Vite on 5173). Vite config has aliases: `@` => `src`, `@server` => `server`, `@data` => `data`.
   - **Build & serve**: `npm run build` → `dist/`. Electron and Capacitor load this build; Express (if started) serves it statically.
   - **Local dev workflows**:
     - Frontend only: `npm run dev` (offline-first, all data in IndexedDB).
     - With backend (optional): run `npm run start:api` in a separate terminal (PORT 3000). Frontend proxies `/api` to it in dev mode (`vite.config.ts`).
     - Both together: `npm run dev:full` (requires `concurrently` installed; spawns both frontend and backend).
   - **No test runner**: Repo has no npm `test` script; testing is manual or scripted separately.

3. Project-specific patterns & conventions
   - **Path aliases**: Use `@/...` for src (e.g., `import { db } from '@/services/db'`); prefer them in new code.
   - **Dexie schema**: All table schemas are in `src/utils/database.ts`. Before adding data, define the interface there and increment the db version if migrating.
   - **Component structure**: Big components live in `src/components/` (e.g., `HealthTracker.tsx`, `KolCompanion.tsx`, `KOLHub.tsx`). Smaller ones go in feature folders (e.g., `src/features/education/`).
   - **Services**: Reusable logic lives in `src/services/` (e.g., `spotify-service.ts`, `youtube-service.ts`, `medicationDatabase.ts`). Services export singletons or utility functions.
   - **Styling**: Tailwind CSS (`tailwind.config.js`, `index.css`). Components use `className=` with Tailwind utilities. Dark mode is default in `App.tsx` with theme toggle.
   - **External APIs**: Spotify, YouTube, SoundCloud integrations exist in services. They use OAuth or API tokens (check `.env` or service code for config).
   - **Feature "rooms"**: Components like `HealthTracker` (vitals, meds, hydration), `KolCompanion` (AI chat), `KOLHub` (influencer tracking), `EducationDashboard` (courses & learning) represent distinct domains. Each manages its own Dexie tables and UI state.
   - **Music integrations**: `spotify-service.ts`, `youtube-service.ts`, `soundcloud-service.ts` handle external platform auth & caching. Music data may be stored in `CachedTrack` table in Dexie.

4. Integration touchpoints and cross-component communication
   - **Local storage + IndexedDB**: Components use `db` for persistence; no server round-trip needed for most user data.
   - **Static assets**: `vite.config.ts` sets `root: './'` and `base: './'` (relative paths). This matters for Electron and Capacitor builds.
   - **Service worker**: `src/service-worker.ts` enables offline caching. Register happens in `src/main.tsx`.
   - **Electron integration**: `electron-main.js` loads the Vite dev server (`http://localhost:5173`) in dev mode or the built `dist/` in production. Menu items can send IPC events (e.g., `import-medications`, `export-data`). Start with `npm run desktop`.
   - **Capacitor (mobile)**: Run `npm run mobile:ios` or `npm run mobile:android` to sync and open the native IDEs. Capacitor wraps the built `dist/` for iOS/Android.
   - **Backend (rare)**: If you need to add an `/api/...` endpoint, create `server/routes/newroute.js`, export a router, import and mount it in `server/index.js`. Use `initDB()` from `server/db.js` for data access.
   - **Vite dev proxy**: In dev, `/api/*` proxies to `http://localhost:3000`. Ensure backend is running (`npm run start:api`) if you use API calls.

5. Small gotchas I discovered
   - **No test runner**: Repo has no `npm test` script. Validation is manual or via CI/CD integration.
   - **Backend incomplete**: `server/index.js` imports routes but `app` and `PORT` may not be declared at the top. Verify before running `node server/index.js`.
   - **ES modules**: Backend uses `"type": "module"` in `package.json`. Always run `node server/index.js`, not npm scripts.
   - **Dexie instance**: Only one instance (`src/services/db.ts`). Don't create multiple `new KolDatabase()` instances; always import from `src/services/db`.
   - **Missing dependencies**: Some services (Spotify, YouTube, SoundCloud) need API credentials in `.env` or hardcoded in the service file.

6. Examples (copyable) for common agent tasks
   - Add a new Dexie table: Define an interface in `src/utils/database.ts`, add a `Table<T>` property to the `KolDatabase` class, and increment the version number.
   - Fetch data in a component:
     ```tsx
     const [data, setData] = useState([]);
     useEffect(() => {
       db.medications.toArray().then(setData);
     }, []);
     ```
   - Add a new API route: create `server/routes/myfeature.js`, export an Express router, then import & mount it in `server/index.js` with `app.use('/api/myfeature', myFeatureRoutes)`.
   - Fetching from frontend (dev & prod safe):
     ```
     fetch('/api/health').then(r => r.json())
     ```

7. Files to reference when making changes
   - Frontend: `src/main.tsx`, `src/App.tsx`, `src/components/` (component examples: `KOLHub.tsx`, `KolCompanion.tsx`, `HealthTracker.tsx`).
   - Build/dev: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`.
   - Backend: `server/index.js`, `server/db.js`, `server/routes/*.js`.
   - Data & seeds: `data/` (JSON seeds) and scripts like `KolHub_DetailedSeed_9000_plus_Generator/generate_full_seed.py`.
   - Packaging: `electron-main.js` (Electron), `capacitor.config.json` (mobile), `android/`, `ios/`.

If anything in this short guide is unclear or you want more details (for example, an exact `node` startup script to add to `package.json`, or a suggested test harness for the API), tell me which part and I will update the file.
