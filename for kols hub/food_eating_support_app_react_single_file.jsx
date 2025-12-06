import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Droplet, CupSoda, Soup, Sandwich, Salad, Utensils, Bottle, Milk, Coffee, Candy, Apple, ShoppingCart, Download, Upload, Check, X, Settings, BookOpen, ListChecks, CalendarDays, NotebookPen, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/**
 * Food & Eating Support App – single-file React component
 * - No backend required (persists to localStorage)
 * - Tracks sodium (default 4000 mg/day) and fluids (default 2500 ml)
 * - Low-spoon logging shortcuts + grocery/pantry + ideas library
 * - Designed for keyboard & mobile use; Tailwind for styling
 *
 * Usage: import and render <FoodSupportApp /> anywhere in your app.
 */

// --- Types ---------------------------------------------------------------
const todayKey = () => new Date().toISOString().slice(0, 10);

// --- Utilities -----------------------------------------------------------
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// --- Local Storage -------------------------------------------------------
const LS_KEY = "food_support_app_state_v1";
const loadState = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
const saveState = (s) => localStorage.setItem(LS_KEY, JSON.stringify(s));

// --- Seed data -----------------------------------------------------------
const seedQuickAdds = [
  { label: "Pickle juice shot", sodium: 800, fluids: 60, icon: Flame },
  { label: "Broth mug", sodium: 900, fluids: 240, icon: Soup },
  { label: "Electrolyte packet", sodium: 1000, fluids: 500, icon: Bottle },
  { label: "Olives (10)", sodium: 400, fluids: 0, icon: Utensils },
  { label: "Salted rice bowl", sodium: 700, fluids: 0, icon: BowlIcon },
  { label: "Tea / warm drink", sodium: 0, fluids: 250, icon: CupSoda },
  { label: "Smoothie", sodium: 150, fluids: 300, icon: Milk },
  { label: "Sandwich", sodium: 1200, fluids: 0, icon: Sandwich },
];

const seedIdeasByCategory = [
  {
    title: "Daily Nourishment & Routine",
    ideas: [
      "Make a daily food + meds checklist",
      "Label fridge shelves: low/med/high-spoon",
      "Pre-fill smoothie freezer bags",
      "Snack cart by bed with safe foods",
      "Use a menu board with 6 go-to meals",
    ],
  },
  {
    title: "Cooking & Accessibility",
    ideas: [
      "Cook seated; keep tools within arm’s reach",
      "Instant Pot one-pot soups",
      "Air fryer roasted potatoes",
      "Adaptive jar opener + silicone mats",
      "Theme nights: soup / bowls / noodles",
    ],
  },
  {
    title: "Hydration & Electrolytes",
    ideas: [
      "Electrolyte packets in every room",
      "Hourly bottle markings",
      "DIY mix: water + pinch sea salt + honey + citrus",
      "Ginger tea for nausea",
      "Broth mugs on high-pain days",
    ],
  },
  {
    title: "Comfort & Sensory-Safe",
    ideas: [
      "Soft rice + broth emergency bowl",
      "Warm oatmeal cups",
      "Broth popsicles for nausea",
      "Bland crackers bedside",
      "Divided plates for tiny portions",
    ],
  },
  {
    title: "Grocery & Pantry",
    ideas: [
      "Recurring grocery order templates",
      "Pre-washed greens & precut fruit",
      "Freeze cooked rice & beans",
      "Transparent bins for visibility",
      "Shared list with partners",
    ],
  },
  {
    title: "Community & Joy",
    ideas: [
      "Anime + soup night",
      "Low-spoon picnics (20 mins cap)",
      "Snack swap with friends",
      "Cook-for-care date night",
      "Food joy journal (wins count: ‘You ate!’)",
    ],
  },
];

const seedPantry = [
  { id: uid(), name: "Broth (chicken/veg)", area: "Pantry", tags: ["soft", "warm"], sodium: 900 },
  { id: uid(), name: "Electrolyte packets", area: "Pantry", tags: ["drink"], sodium: 1000 },
  { id: uid(), name: "Rice (cooked frozen)", area: "Freezer", tags: ["soft"], sodium: 10 },
  { id: uid(), name: "Olives", area: "Fridge", tags: ["salty"], sodium: 400 },
  { id: uid(), name: "Ginger tea", area: "Pantry", tags: ["drink"], sodium: 0 },
];

// --- Icons ---------------------------------------------------------------
function BowlIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...props}>
      <path fill="currentColor" d="M4 10a8 8 0 0 0 16 0H4zm-1 3h18a7 7 0 0 1-14 0H3z" />
    </svg>
  );
}

// --- Root Component ------------------------------------------------------
export default function FoodSupportApp() {
  const loaded = loadState();
  const [settings, setSettings] = useState(
    loaded?.settings || { sodiumGoal: 4000, fluidGoal: 2500 }
  );
  const [logsByDay, setLogsByDay] = useState(loaded?.logsByDay || {});
  const [pantry, setPantry] = useState(loaded?.pantry || seedPantry);
  const [grocery, setGrocery] = useState(loaded?.grocery || []);
  const [ideas, setIdeas] = useState(loaded?.ideas || seedIdeasByCategory);
  const [tab, setTab] = useState("today");

  // Persist
  useEffect(() => {
    saveState({ settings, logsByDay, pantry, grocery, ideas });
  }, [settings, logsByDay, pantry, grocery, ideas]);

  // Derived: today’s totals
  const today = todayKey();
  const todaysLogs = logsByDay[today] || [];
  const totals = useMemo(() => {
    const sodium = todaysLogs.reduce((a, b) => a + (b.sodium || 0), 0);
    const fluids = todaysLogs.reduce((a, b) => a + (b.fluids || 0), 0);
    return { sodium, fluids };
  }, [todaysLogs]);

  const sodiumPct = clamp((totals.sodium / settings.sodiumGoal) * 100, 0, 100);
  const fluidPct = clamp((totals.fluids / settings.fluidGoal) * 100, 0, 100);

  // Chart data – last 7 days
  const chartData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const list = logsByDay[key] || [];
      const sodium = list.reduce((a, b) => a + (b.sodium || 0), 0);
      const fluids = list.reduce((a, b) => a + (b.fluids || 0), 0);
      return { date: key.slice(5), sodium, fluids };
    });
    return days;
  }, [logsByDay]);

  // Actions
  const addLog = (item) => {
    const entry = { id: uid(), ts: Date.now(), ...item };
    setLogsByDay((s) => ({ ...s, [today]: [...(s[today] || []), entry] }));
  };
  const delLog = (id) => {
    setLogsByDay((s) => ({ ...s, [today]: (s[today] || []).filter((x) => x.id !== id) }));
  };

  const addGrocery = (name) => {
    if (!name) return;
    setGrocery((g) => [{ id: uid(), name, done: false }, ...g]);
  };
  const toggleGrocery = (id) => setGrocery((g) => g.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const removeGrocery = (id) => setGrocery((g) => g.filter((i) => i.id !== id));

  const addPantry = (p) => setPantry((list) => [{ id: uid(), ...p }, ...list]);
  const removePantry = (id) => setPantry((list) => list.filter((x) => x.id !== id));

  // Import/Export
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ settings, logsByDay, pantry, grocery, ideas }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `food_support_${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const onImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        setSettings(data.settings || settings);
        setLogsByDay(data.logsByDay || logsByDay);
        setPantry(data.pantry || pantry);
        setGrocery(data.grocery || grocery);
        setIdeas(data.ideas || ideas);
        alert("Imported successfully.");
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-zinc-100">
      <div className="rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 shadow-xl overflow-hidden">
        <Header todayTotals={totals} settings={settings} sodiumPct={sodiumPct} fluidPct={fluidPct} />
        <Tabs tab={tab} setTab={setTab} />
        {tab === "today" && (
          <TodayTab
            totals={totals}
            settings={settings}
            addLog={addLog}
            delLog={delLog}
            todaysLogs={todaysLogs}
            chartData={chartData}
          />
        )}
        {tab === "ideas" && <IdeasTab ideas={ideas} setIdeas={setIdeas} addLog={addLog} />}
        {tab === "grocery" && (
          <GroceryTab grocery={grocery} addGrocery={addGrocery} toggleGrocery={toggleGrocery} removeGrocery={removeGrocery} />
        )}
        {tab === "pantry" && <PantryTab pantry={pantry} addPantry={addPantry} removePantry={removePantry} addLog={addLog} />}
        {tab === "settings" && (
          <SettingsTab settings={settings} setSettings={setSettings} exportJSON={exportJSON} onImport={onImport} />
        )}
      </div>
      <FooterNote />
    </div>
  );
}

// --- UI Pieces -----------------------------------------------------------
function Header({ todayTotals, settings, sodiumPct, fluidPct }) {
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  return (
    <div className="p-5 md:p-6 border-b border-zinc-800 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Food & Eating Support</h1>
          <p className="text-sm text-zinc-400">{date} • Daily targets: {settings.sodiumGoal} mg Na, {settings.fluidGoal} ml fluids</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-zinc-400">
          <CalendarDays className="w-5 h-5" />
          <span>Today</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ProgressCard title="Sodium" icon={SaltIcon} value={todayTotals.sodium} goal={settings.sodiumGoal} pct={sodiumPct} unit="mg" />
        <ProgressCard title="Fluids" icon={Droplet} value={todayTotals.fluids} goal={settings.fluidGoal} pct={fluidPct} unit="ml" />
      </div>
    </div>
  );
}

function ProgressCard({ title, icon: Icon, value, goal, pct, unit }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-zinc-300" />
          <span className="font-medium">{title}</span>
        </div>
        <span className="text-sm text-zinc-400">Goal {goal} {unit}</span>
      </div>
      <div className="mt-3">
        <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 text-sm text-zinc-300">{value} {unit} • {Math.round(pct)}%</div>
      </div>
    </div>
  );
}

function Tabs({ tab, setTab }) {
  const tabs = [
    { key: "today", label: "Today", icon: ListChecks },
    { key: "ideas", label: "Ideas", icon: BookOpen },
    { key: "grocery", label: "Grocery", icon: ShoppingCart },
    { key: "pantry", label: "Pantry", icon: Utensils },
    { key: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="px-4 md:px-6 pt-3 border-b border-zinc-800">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${
              tab === t.key ? "bg-zinc-800/70 border-zinc-700" : "border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Today Tab -----------------------------------------------------------
function TodayTab({ totals, settings, addLog, delLog, todaysLogs, chartData }) {
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <QuickAdd onAdd={addLog} />
          <LogComposer onAdd={addLog} />
          <LogList logs={todaysLogs} onDelete={delLog} />
        </div>
        <div className="space-y-4">
          <StatsCard totals={totals} settings={settings} />
          <WeeklyChart data={chartData} />
        </div>
      </div>
    </div>
  );
}

function QuickAdd({ onAdd }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><FlashSaltIcon className="w-5 h-5" /><span className="font-medium">Low-spoon quick add</span></div>
        <span className="text-sm text-zinc-400">1 tap = log</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 mt-3">
        {seedQuickAdds.map((q) => (
          <button
            key={q.label}
            onClick={() => onAdd({ name: q.label, sodium: q.sodium, fluids: q.fluids })}
            className="group rounded-xl border border-zinc-800 px-3 py-3 text-left hover:border-zinc-600 transition"
          >
            <q.icon className="w-5 h-5 text-zinc-300 group-hover:scale-110 transition" />
            <div className="mt-2 text-sm font-medium line-clamp-1">{q.label}</div>
            <div className="text-xs text-zinc-400">{q.sodium} mg • {q.fluids} ml</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LogComposer({ onAdd }) {
  const [name, setName] = useState("");
  const [sodium, setSodium] = useState(0);
  const [fluids, setFluids] = useState(0);
  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
      <div className="flex items-center gap-2 font-medium"><NotebookPen className="w-5 h-5" />Log a food / drink</div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g., broth)" className="sm:col-span-2 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600" />
        <input type="number" value={sodium} onChange={(e) => setSodium(Number(e.target.value))} placeholder="Sodium (mg)" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600" />
        <input type="number" value={fluids} onChange={(e) => setFluids(Number(e.target.value))} placeholder="Fluids (ml)" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-600" />
        <button
          onClick={() => {
            if (!name && !sodium && !fluids) return;
            onAdd({ name: name || "—", sodium, fluids });
            setName("");
            setSodium(0);
            setFluids(0);
          }}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}

function LogList({ logs, onDelete }) {
  if (!logs.length) return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60 text-zinc-400">
      Nothing logged yet. Try a quick add above.
    </div>
  );
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-900/60 text-zinc-400">
          <tr>
            <th className="text-left p-3">Item</th>
            <th className="text-right p-3">Sodium (mg)</th>
            <th className="text-right p-3">Fluids (ml)</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-t border-zinc-800">
              <td className="p-3">{l.name}</td>
              <td className="p-3 text-right tabular-nums">{l.sodium}</td>
              <td className="p-3 text-right tabular-nums">{l.fluids}</td>
              <td className="p-3 text-right">
                <button onClick={() => onDelete(l.id)} className="inline-flex items-center gap-1 text-zinc-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsCard({ totals, settings }) {
  const remNa = Math.max(0, settings.sodiumGoal - totals.sodium);
  const remFl = Math.max(0, settings.fluidGoal - totals.fluids);
  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
      <div className="font-medium mb-2">Today’s math</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span>Sodium so far</span><span className="tabular-nums">{totals.sodium} mg</span></div>
        <div className="flex justify-between"><span>Fluids so far</span><span className="tabular-nums">{totals.fluids} ml</span></div>
        <div className="flex justify-between text-zinc-400"><span>Remaining sodium</span><span className="tabular-nums">{remNa} mg</span></div>
        <div className="flex justify-between text-zinc-400"><span>Remaining fluids</span><span className="tabular-nums">{remFl} ml</span></div>
      </div>
    </div>
  );
}

function WeeklyChart({ data }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
      <div className="font-medium mb-2">Last 7 days</div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="na" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
            <YAxis stroke="#a1a1aa" fontSize={12} />
            <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 12 }} />
            <Area type="monotone" dataKey="sodium" stroke="#22c55e" fill="url(#na)" />
            <Area type="monotone" dataKey="fluids" stroke="#60a5fa" fill="url(#fl)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- Ideas Tab -----------------------------------------------------------
function IdeasTab({ ideas, setIdeas, addLog }) {
  const [newIdea, setNewIdea] = useState("");
  const [newCat, setNewCat] = useState("Daily Nourishment & Routine");

  const addIdea = () => {
    if (!newIdea.trim()) return;
    const upd = ideas.map((c) => (c.title === newCat ? { ...c, ideas: [newIdea.trim(), ...c.ideas] } : c));
    setIdeas(upd);
    setNewIdea("");
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
        <div className="font-medium mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" />Idea library</div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 sm:col-span-2">
            {ideas.map((c) => (
              <option key={c.title}>{c.title}</option>
            ))}
          </select>
          <input value={newIdea} onChange={(e) => setNewIdea(e.target.value)} placeholder="Add a new idea" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 sm:col-span-2" />
          <button onClick={addIdea} className="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-2 flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {ideas.map((cat) => (
          <div key={cat.title} className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
            <div className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" />{cat.title}</div>
            <ul className="space-y-2">
              {cat.ideas.map((text, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-zinc-200">{text}</span>
                  <button onClick={() => addLog({ name: text, sodium: 0, fluids: 0 })} className="text-xs px-2 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800">Log</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Grocery Tab ---------------------------------------------------------
function GroceryTab({ grocery, addGrocery, toggleGrocery, removeGrocery }) {
  const [name, setName] = useState("");
  const pending = grocery.filter((g) => !g.done);
  const done = grocery.filter((g) => g.done);
  return (
    <div className="p-4 md:p-6 grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
        <div className="font-medium mb-2 flex items-center gap-2"><ShoppingCart className="w-5 h-5" />Add to list</div>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 w-full" />
          <button onClick={() => { addGrocery(name); setName(""); }} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2"><Plus className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
        <div className="font-medium mb-2">Pending</div>
        <ul className="space-y-2">
          {pending.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-2">
              <button onClick={() => toggleGrocery(i.id)} className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-900 flex items-center gap-1"><Check className="w-4 h-4" />Done</button>
              <span className="flex-1">{i.name}</span>
              <button onClick={() => removeGrocery(i.id)} className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </li>
          ))}
          {!pending.length && <li className="text-zinc-400">Nothing here.</li>}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60 md:col-span-2">
        <div className="font-medium mb-2">Completed</div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {done.map((i) => (
            <li key={i.id} className="rounded-md border border-zinc-800 px-3 py-2 text-sm flex items-center justify-between">
              <span className="line-through text-zinc-400">{i.name}</span>
              <button onClick={() => toggleGrocery(i.id)} className="text-xs px-2 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800">Undo</button>
            </li>
          ))}
          {!done.length && <li className="text-zinc-400">No completed items yet.</li>}
        </ul>
      </div>
    </div>
  );
}

// --- Pantry Tab ----------------------------------------------------------
function PantryTab({ pantry, addPantry, removePantry, addLog }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("Pantry");
  const [tags, setTags] = useState("soft, warm");
  const [sodium, setSodium] = useState(0);
  const areas = ["Pantry", "Fridge", "Freezer"];

  return (
    <div className="p-4 md:p-6 grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
        <div className="font-medium mb-2 flex items-center gap-2"><Utensils className="w-5 h-5" />Add pantry item</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2" />
          <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
            {areas.map((a) => <option key={a}>{a}</option>)}
          </select>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags (comma)" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2" />
          <input type="number" value={sodium} onChange={(e) => setSodium(Number(e.target.value))} placeholder="Sodium mg (optional)" className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2" />
          <button onClick={() => { if (!name) return; addPantry({ name, area, tags: tags.split(",").map((t)=>t.trim()).filter(Boolean), sodium }); setName(""); setTags("soft"); setSodium(0); }} className="sm:col-span-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-2 flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add item</button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
        <div className="font-medium mb-2">Pantry</div>
        <ul className="space-y-2">
          {pantry.map((p) => (
            <li key={p.id} className="rounded-md border border-zinc-800 px-3 py-2 flex items-center justify-between gap-2">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-zinc-400">{p.area} • {p.tags?.join(", ")}{p.sodium ? ` • ${p.sodium} mg Na` : ""}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => addLog({ name: p.name, sodium: p.sodium || 0, fluids: 0 })} className="text-xs px-2 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800">Log</button>
                <button onClick={() => removePantry(p.id)} className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </li>
          ))}
          {!pantry.length && <li className="text-zinc-400">No items yet.</li>}
        </ul>
      </div>
    </div>
  );
}

// --- Settings Tab --------------------------------------------------------
function SettingsTab({ settings, setSettings, exportJSON, onImport }) {
  const [na, setNa] = useState(settings.sodiumGoal);
  const [fl, setFl] = useState(settings.fluidGoal);
  return (
    <div className="p-4 md:p-6 grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60">
        <div className="font-medium mb-2 flex items-center gap-2"><Settings className="w-5 h-5" />Daily goals</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label className="text-sm">Sodium goal (mg)
            <input type="number" value={na} onChange={(e) => setNa(Number(e.target.value))} className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2" />
          </label>
          <label className="text-sm">Fluid goal (ml)
            <input type="number" value={fl} onChange={(e) => setFl(Number(e.target.value))} className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2" />
          </label>
          <button onClick={() => setSettings({ sodiumGoal: na, fluidGoal: fl })} className="sm:col-span-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 mt-1">Save</button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/60 space-y-2">
        <div className="font-medium mb-2 flex items-center gap-2"><Download className="w-5 h-5" />Backup / Restore</div>
        <div className="flex gap-2">
          <button onClick={exportJSON} className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-900 flex items-center gap-2"><Download className="w-4 h-4" />Export JSON</button>
          <label className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-900 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={onImport} />
          </label>
        </div>
        <p className="text-xs text-zinc-400">Tip: goals default to 4000 mg sodium / 2500 ml fluids. Adjust to your needs.</p>
      </div>
    </div>
  );
}

function FooterNote() {
  return (
    <div className="max-w-6xl mx-auto text-xs text-zinc-500 mt-3 px-1">
      Built for low-spoon days • Local-only storage • Nourishment as care 🖤
    </div>
  );
}

// --- Extra icons ---------------------------------------------------------
function SaltIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M7 2h10l1 4H6l1-4zm-1 6h12l-1.2 12.1a2 2 0 0 1-1.99 1.9H9.19a2 2 0 0 1-1.99-1.9L6 8z" />
    </svg>
  );
}
function FlashSaltIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
