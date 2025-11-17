## Quick orientation for AI coding agents

This repo is a "unified mega app" combining a Vite + React frontend, a small Express backend, and packaging targets (Electron / Capacitor). The instructions below highlight the concrete, discoverable patterns an agent needs to be productive here.

1. Architecture (big picture)
   - Frontend: `src/` — TypeScript React app (Vite). Entry: `src/main.tsx`, top-level UI in `src/App.tsx`, reusable chunks in `src/components/`.
   - Backend: `server/` — Express routes and a tiny SQLite wrapper. Key files: `server/index.js`, `server/db.js`, `server/routes/*.js`.
   - Data: JSON and SQLite files live under `data/` (e.g. `data/kol_ai_companion_reference.json`, `data/kolhub.db`). The server reads these directly.
   - Packaging: Electron and Capacitor integrations exist (see `electron-main.js`, `capacitor.config.json`, and platform folders `android/`, `ios/`).

2. Developer workflows (commands and how pieces connect)
   - Frontend dev: `npm run dev` (runs `vite`). Vite config: `vite.config.ts` (note aliases: `@` => `src`, `@server` => `server`, `@data` => `data`).
   - Build frontend for production: `npm run build` → outputs to `dist/` (Vite build). The Express server serves `dist/` statically in production.
   - Backend: there is no npm script to start the API. Run the server with Node: `node server/index.js` (environment: set `PORT` if needed). The server exposes APIs under `/api/*` (see `server/routes`).
   - Local dev proxy: Vite dev server proxies `/api` to `http://localhost:3000` (see `vite.config.ts`). Run both frontend (`npm run dev`) and backend (`node server/index.js`) for full local behavior.

3. Patterns & conventions specific to this repo
   - Path aliases are used in code (`@/...`, `@server`, `@data`); prefer them when adding imports in the frontend.
   - API routes use separate files under `server/routes/` and are mounted in `server/index.js` (e.g. `health.js`, `daily.js`, `relationships.js`). Follow that structure for new endpoints.
   - The server uses a small `initDB()` helper (`server/db.js`) that opens the SQLite DB on-demand. Route handlers call `initDB()` then use `db.all` / `db.run`.
   - Frontend calls backend via relative `/api/...` paths (relying on Vite proxy in dev and static serving in production). Avoid hardcoding backend hosts in frontend code.
   - Styling: Tailwind is used (`tailwind.config.js`, `index.css`) and the UI uses a dark theme convention in `App.tsx`.

4. Integration and cross-component touchpoints to watch
   - Static asset base: `vite.config.ts` sets `root: './'` and `base: './'` (relative assets). This matters for Electron packaging and static-serving from `dist/`.
   - Server -> Data: server reads `data/*.json` and `data/kolhub.db`. If adding migrations or seeds, update the `data/` folder and `server/db.js` accordingly.
   - Electron/Capacitor: packaging code expects `dist/` to exist. Build the frontend first (`npm run build`) before packaging or starting the desktop shell.

5. Small gotchas I discovered (do not assume these are fixed)
   - `server/index.js` imports routes and serves static content but does not declare `app` or `PORT` at top of file in the current copy; verify/define `const app = express()` and `const PORT = process.env.PORT || 3000` before starting the server.
   - The server uses ES modules (`package.json` has `"type":"module"`) — run `node server/index.js` (modern Node) rather than `node` flavors that assume CommonJS.

6. Examples (copyable) for common agent tasks
   - Add a new API route: create `server/routes/myfeature.js`, export an Express router, then import & mount it in `server/index.js` with `app.use('/api/myfeature', myFeatureRoutes)`.
   - Fetching from frontend (dev & prod safe):
     fetch('/api/health').then(r => r.json())

7. Files to reference when making changes
   - Frontend: `src/main.tsx`, `src/App.tsx`, `src/components/` (component examples: `KOLHub.tsx`, `KolCompanion.tsx`).
   - Build/dev: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`.
   - Backend: `server/index.js`, `server/db.js`, `server/routes/*.js`.
   - Data & seeds: `data/` (JSON seeds) and scripts like `KolHub_DetailedSeed_9000_plus_Generator/generate_full_seed.py`.

If anything in this short guide is unclear or you want more details (for example, an exact `node` startup script to add to `package.json`, or a suggested test harness for the API), tell me which part and I will update the file.
