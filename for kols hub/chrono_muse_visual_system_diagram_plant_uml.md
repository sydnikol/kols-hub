# ChronoMuse – Visual System Diagram

Below is a single **PlantUML** diagram capturing your end‑to‑end flow (voice → emotion → scene → soundtrack → reels) plus realtime sync and storage. You can paste this into any PlantUML renderer to generate the image.

```plantuml
@startuml ChronoMuseSystem
skinparam componentStyle rectangle
skinparam wrapWidth 200
skinparam maxMessageSize 120

'==== Users & Clients ====
actor User as U
node "Clients" {
  component "Voice Input" as Voice
  component "DialogueManager" as DM
  component "EmotionEngine" as EE
  component "AISceneAssistant" as SA
  component "State Store\n(sceneState, tasteState)" as State
  component "SceneEditor" as SceneEd
  component "LightingEditor" as LightEd
  component "AIDirector" as Director
  component "DynamicSoundtrack" as Music
  component "BeatAnalyzer" as Beat
  component "AvatarRenderer" as Avatar
  component "CinematicRecorder" as Recorder
  component "HighlightCompiler" as Highlighter
  component "CaptionGenerator" as Captioner
  component "ReelCompiler" as Compiler
  component "Event Bus\n(mitt/Zustand actions)" as Bus
}

'==== Realtime & Cloud ====
node "Realtime Sync" {
  database "Firebase RTDB" as RTDB
}
node "Cloud Data" {
  database "Firestore" as FS
  collections "Firebase Storage\n(video/audio)" as FStore
  component "ReelShareHub\n(Gallery/Playback)" as RSH
}

'==== Data Structures (logical) ====
package "Data Models" {
  component "Rules/Events" as Rules
  component "Scene Props/Lighting" as SceneData
  component "TasteMemory" as Taste
  component "Reels/Captions/Tags" as ReelMeta
}

'==== Primary Flow ====
U --> Voice : speaks
Voice --> DM : transcript
DM --> EE : parsed dialogue
EE --> Bus : emit('emotionChange')
EE --> Director : new emotion
Director --> SA : scene command?
SA --> State : build JSON props (sceneState)
State --> SceneEd
State --> LightEd
Director --> Recorder : trigger shot
Music --> Beat : track audio
Beat --> LightEd : emit('beatEvent')
Beat --> Director : tempo for camera
Recorder --> Highlighter : video segment
Highlighter --> Compiler : tagged clips
Captioner --> Compiler : captions
Compiler --> RSH : upload final reel

'==== Visual + Audio Synergy ====
EE --> Music : emotion → soundtrack
Music --> Avatar : drive gestures
Music --> LightEd : adaptive lighting
Director --> Avatar : camera sync

'==== Realtime Multi‑User Sync ====
SceneEd --> RTDB : /scenes/{room}
LightEd --> RTDB : /scenes/{room}
DM --> RTDB : /presence/{user}
Voice --> RTDB : /voice/{session}
Compiler --> FS : /reels/{id} (metadata)
Compiler --> FStore : video assets
RSH --> FS : comments/likes

'==== Memory Loop ====
U --> Taste : actions/preferences
EE --> Taste : tone outcomes
Music --> Taste : tempo selections
LightEd --> Taste : lighting prefs
Taste --> State : update tasteState

'==== Subscriptions ====
RTDB --> Clients : listeners (subscribe/unsubscribe on room entry)
FS --> Clients : metadata updates

'==== Notes ====
note right of RTDB
  presence: /presence/{user}
  scenes:   /scenes/{room}
  voice:    /voice/{session}
end note

note right of FS
  reels: /reels/{id}
  users/{id}/taste
  comments/{reel}
end note

@enduml
```

