
import json, random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

categories = [
    "Health & Daily Care",
    "Mental Health & Emotional Regulation",
    "Relationships & Support Circle",
    "Disability & Advocacy Tools",
    "Organization, Planning & Automation",
    "Communication & Safety",
    "Spiritual, Hoodoo & Reflection Modules",
    "Creativity & Identity",
    "Community & Activism"
]

verbs = ["Add", "Build", "Create", "Design", "Implement", "Introduce", "Integrate", "Optimize", "Revamp", "Prototype"]
features = ["Dashboard", "Tracker", "Assistant", "Planner", "Journal", "Wizard", "Checklist", "Reminder", "Analyzer", "Visualizer",
            "Timer", "Coach", "Summarizer", "Directory", "Library", "Map", "Flow", "Guide", "Mode", "Module"]
dimensions = ["with adaptive themes", "with spoon-aware pacing", "with trauma-informed tips",
              "with low-stim UI", "with voice control", "with offline support", "with privacy lock",
              "with Notion sync", "with Google Sheets export", "with Spotify routines",
              "with AI insights", "with custom tags", "with energy prediction",
              "with partner-sharing", "with emergency quick launch", "with location awareness"]
triggers = ["on flare-up detection", "at bedtime", "after appointments", "on low hydration", "on high heart rate",
            "when anxiety rises", "during sensory overload", "when leaving home", "on weekly review", "on calendar conflict"]
integrations = ["Notion", "Google Calendar", "Google Sheets", "Spotify", "Apple Health", "Fitbit", "Strava",
                "MyChart (manual import)", "Discord", "Email"]

def random_desc(cat, idx):
    v = random.choice(verbs)
    f = random.choice(features)
    d = random.choice(dimensions)
    t = random.choice(triggers)
    integ = ", ".join(random.sample(integrations, k=2))
    return (f"{v} a {cat.lower()} {f} {d}. "
            f"Triggers {t}. Includes integrations for {integ}. "
            f"Focus on accessibility (large fonts, contrast-aware colors, screen reader labels) and gentle tone.")

def user_story():
    return random.choice([
        "As Kol, I want to reduce cognitive load so I can conserve spoons.",
        "As a partner, I want to coordinate care so Kol feels supported.",
        "As a caregiver, I want clear checklists so I don’t miss steps.",
        "As an organizer, I want to track actions so I can see impact.",
        "As a friend, I want low-pressure ways to connect so we stay close."
    ])

def acceptance_criteria(cat):
    common = [
        "A11y: passes WCAG AA for color contrast",
        "Dark mode by default",
        "Keyboard-only navigation and ARIA labels",
        "Voice input and playback",
        "Exports to JSON/CSV; optional Notion sync",
        "Quiet/Low-Stim mode toggle",
        "Gentle, snoozable notifications"
    ]
    extra = {
        "Health & Daily Care": "Logs vitals and meds with timestamp and source",
        "Mental Health & Emotional Regulation": "Provides at least three grounding options (visual, audio, breath)",
        "Relationships & Support Circle": "Shares selected entries with designated partners only",
        "Disability & Advocacy Tools": "Generates PDFs for scripts/letters with name/date",
        "Organization, Planning & Automation": "Auto-inserts rest blocks between tasks",
        "Communication & Safety": "One-tap SOS with customizable message and contacts",
        "Spiritual, Hoodoo & Reflection Modules": "Supports ritual timers and moon phase metadata",
        "Creativity & Identity": "Embeds media (images/audio) with alt text fields",
        "Community & Activism": "Tracks actions and impact with date/location"
    }
    return common + [extra.get(cat, "Has category-specific safeguards")]

def spoon_cost():
    return random.choice(["XS", "S", "M", "L"])

def priority():
    return random.choice(["P0", "P1", "P2", "P3"])

def tags_for(cat):
    base = ["a11y", "trauma-informed", "low-stim", "sync"]
    cat_tags = {
        "Health & Daily Care": ["vitals", "meds", "pacing"],
        "Mental Health & Emotional Regulation": ["grounding", "journaling", "sleep"],
        "Relationships & Support Circle": ["partners", "poly", "rituals"],
        "Disability & Advocacy Tools": ["scripts", "appeals", "rights"],
        "Organization, Planning & Automation": ["calendar", "tasks", "automation"],
        "Communication & Safety": ["sos", "alerts", "location"],
        "Spiritual, Hoodoo & Reflection Modules": ["altars", "rituals", "moon"],
        "Creativity & Identity": ["art", "wardrobe", "gallery"],
        "Community & Activism": ["actions", "events", "mutual-aid"]
    }
    return base + cat_tags.get(cat, [])

def generate(total_per_cat=10000, outfile="KolHub_Ideas_90000_detailed.json"):
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    ideas = []
    idea_id = 1
    for cat in categories:
        for i in range(total_per_cat):
            title = f"{random.choice(verbs)} {random.choice(features)} {random.choice(dimensions)}"
            entry = {
                "id": idea_id,
                "category": cat,
                "title": title,
                "description": random_desc(cat, i),
                "user_story": user_story(),
                "acceptance_criteria": acceptance_criteria(cat),
                "energy": "Adaptive",
                "spoon_cost": spoon_cost(),
                "priority": priority(),
                "status": "Backlog",
                "tags": tags_for(cat),
                "created_at": (now - timedelta(minutes=i)).isoformat() + "Z"
            }
            ideas.append(entry)
            idea_id += 1
    with open(outfile, "w", encoding="utf-8") as f:
        json.dump({"ideas": ideas}, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(ideas)} ideas to {outfile}")

if __name__ == "__main__":
    generate()
