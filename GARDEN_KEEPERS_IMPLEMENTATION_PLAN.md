# 🌿 Garden Keepers — Implementation Plan
**Handover Document for Claude Code Session**

> This document provides a complete technical handover for continuing development of the Garden Keepers cooperative garden game. Read it top to bottom before touching any code.

---

## 1. Project Summary

Garden Keepers is a **real-time asymmetric cooperative game** for 2–4 players. One shared screen (TV/monitor) shows the garden state, while each player uses their own device (phone/tablet) as a private control panel. Players must communicate verbally to solve garden problems — no one player has enough information alone.

### Current Deliverables
| File | Description |
|------|-------------|
| `garden-game.html` | Single-file playable prototype (HTML/CSS/JS) |
| `GardenKeepers_UserGuide.docx` | Full player user guide (Word document) |

### Tech Stack (Current Prototype)
- **Single HTML file** — vanilla JS, no framework, no build step
- **localStorage** — cross-tab state sync (TV ↔ phone tabs, same browser only)
- **Google Fonts** — Playfair Display + Nunito
- **No backend** — all logic runs client-side

---

## 2. Architecture Overview

### Current State Machine

```
Lobby
  ├── [host] → TV Screen
  │     ├── renderGarden()        — initialises 6 plot DOM elements
  │     ├── startRound()          — picks random problem, starts 3-min timer
  │     │     ├── setInterval(pollActions, 1s)  — reads localStorage for new actions
  │     │     └── setInterval(timer, 1s)        — counts down, calls endRound on 0
  │     ├── applyAction(action)   — evaluates correct/wrong, updates health + score
  │     ├── endRound(success)     — increments round, checks win/lose
  │     └── endGame()             — shows end screen
  │
  └── [each player] → Phone Screen
        ├── launchPhone()         — renders role-specific action buttons
        ├── setInterval(pollClues, 1.5s)  — reads localStorage for clue updates
        └── doAction(action)      — writes action to localStorage, triggers cooldown
```

### State Object (stored in `localStorage` key `gk_state`)

```js
{
  round: 1,           // Current round (1–5)
  score: 0,           // Team cumulative score
  health: 100,        // Garden health percentage (0–100)
  timerSec: 180,      // Seconds remaining in current round
  roundActive: false, // Whether a round is in progress
  currentProblem: {   // Selected problem object (see Problem Data below)
    problem: string,  // Banner text shown on TV
    solution: string, // Correct action effect ID
    clues: {          // Role-keyed private clues
      water: string,
      sun: string,
      seed: string,
      animal: string
    },
    hint: string      // Unused field (reserved for future hint system)
  },
  actionsThisRound: [ // Array of action entries submitted this round
    {
      effect: string,   // Action ID (e.g. 'water_full')
      label: string,    // Display label for action log
      _rendered: false  // Flag to prevent double-processing on TV
    }
  ]
}
```

### Data Definitions

**Roles** (`ROLES` object)
```js
{ water, sun, seed, animal }
// Each has: name, icon, theme (CSS class)
```

**Actions** (`ACTIONS` object — keyed by role)
```js
// Each action: { id, icon, title, sub, effect }
// effect string links to problem.solution for correctness check
```

**Problems** (`PROBLEM_SETS` array — 6 entries)
```js
// Each: { problem, solution, clues: {water,sun,seed,animal}, hint }
```

---

## 3. Known Limitations & Bugs

These must be addressed in the next development phase:

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | 🔴 Critical | **localStorage sync only works within the same browser on the same device.** True cross-device play is broken — phones cannot read state from the TV tab on another machine. | `syncState()` / `loadState()` |
| 2 | 🔴 Critical | **`_rendered` flag on action objects is lost after `JSON.parse`** — if pollActions fires before the flag is saved, actions can double-apply. | `pollActions()` |
| 3 | 🟡 Medium | **Multiple simultaneous wrong actions** can stack health penalties within the same render tick if two players press buttons at the same moment. | `applyAction()` |
| 4 | 🟡 Medium | **Round ends immediately** after the first correct action — players with a cooldown active get no chance to participate. Consider a short celebration delay. | `endRound()` |
| 5 | 🟡 Medium | **Problem repeat probability is high** — 6 problems with random selection means the same scenario can appear multiple times in 5 rounds. No de-duplication logic exists. | `startRound()` |
| 6 | 🟠 Low | **Animal DOM element is not cleaned up** if a round ends by timeout (not by animal action). | `endRound()` / `removeAnimal()` |
| 7 | 🟠 Low | **TV screen `pollActions` interval is never cleared** when navigating back to lobby via the Back button. | `goLobby()` / `launchTV()` |
| 8 | 🟠 Low | **Garden plots are re-rendered from scratch** each round — withered plants (🥀) from prior rounds are reset, losing persistence. | `renderGarden()` |
| 9 | 🟠 Low | **No role deduplication** — two players can select the same role, leading to duplicated clue access and action overlap. | Lobby `selectRole()` |
| 10 | 🔵 Info | `state.plotsData` is initialised but never used by game logic — DOM is manipulated directly instead. | `renderGarden()` |

---

## 4. Recommended Architecture Upgrade

### Replace localStorage with WebSocket Server

The biggest blocker is cross-device communication. The recommended upgrade path:

```
[Node.js + Express + ws]
      │
      ├── /              → serves game HTML
      ├── ws://...       → WebSocket server for real-time state sync
      │
      ├── TV client      → subscribes to all events
      └── Phone clients  → subscribe to role-specific events
```

**Suggested message types:**
```json
{ "type": "STATE_SYNC",    "payload": { ...fullState } }
{ "type": "ACTION",        "payload": { "effect": "water_full", "role": "water" } }
{ "type": "ROUND_START",   "payload": { "problemIndex": 3 } }
{ "type": "ROUND_END",     "payload": { "success": true } }
{ "type": "PLAYER_JOIN",   "payload": { "role": "sun", "playerId": "abc123" } }
```

### Alternative: Firebase Realtime Database
For a no-backend option, Firebase RTDB is a drop-in localStorage replacement that works cross-device. Requires a Firebase project but no server to maintain.

---

## 5. Feature Backlog (Priority Order)

### Phase 1 — Fix Core Multiplayer (Must Have)
- [ ] **Real cross-device sync** — WebSocket server or Firebase RTDB
- [ ] **Role lock on join** — prevent two players selecting the same role; show taken roles as greyed out in lobby
- [ ] **Problem de-duplication** — shuffle PROBLEM_SETS at game start, draw without replacement
- [ ] **Fix `_rendered` double-apply bug** — track processed actions by index, not flag on the object
- [ ] **Clean up intervals on lobby return** — `goLobby()` must clear all `setInterval` handles
- [ ] **Persist plant state across rounds** — withered plots should carry over to next round

### Phase 2 — Gameplay Depth (Should Have)
- [ ] **Difficulty scaling** — Round 1 allows 3 min; rounds 3–5 reduce to 2 min 30 sec, then 2 min
- [ ] **Hint system** — after 90 seconds, the TV shows a partial hint drawn from the `hint` field
- [ ] **More problem variety** — expand from 6 to 12+ scenarios; support 2-condition problems (e.g. both soil AND animals)
- [ ] **Role-specific visual feedback** — water ripple only for Water Keeper action, sun shift only for Sun Guide, etc. (currently all effects apply globally)
- [ ] **Round summary screen** — 5-second inter-round screen showing what happened (correct/wrong/timeout) before next round starts
- [ ] **Seed Planter visual** — new plant emoji actually appears in the correct plot when Seed Planter acts correctly
- [ ] **Animal variety per problem** — spawn specific animal (rabbit/squirrel/hedgehog) based on which animal problem was selected

### Phase 3 — Polish & Accessibility (Nice to Have)
- [ ] **Sound effects** — water splash, correct chime, wrong buzz, timer warning beep (Web Audio API)
- [ ] **Animated plant growth** — CSS keyframe animation when a plant heals (scale + colour)
- [ ] **Mobile haptics** — `navigator.vibrate()` on action press for tactile feedback
- [ ] **QR code lobby** — TV screen shows a QR code players scan to join with correct role URL
- [ ] **Colour-blind mode** — replace health bar colour gradients with icon indicators
- [ ] **Accessibility** — ARIA labels on all action buttons, screen-reader announcements for TV events
- [ ] **Internationalisation** — clue strings and UI text in a locale object; support EN / MS / ZH-Hans

### Phase 4 — Extended Game Modes
- [ ] **Campaign mode** — 3 difficulty tiers (Apprentice / Keeper / Master) with different problem sets
- [ ] **Sudden Death mode** — any wrong action ends the game immediately
- [ ] **Solo practice mode** — one player sees all clues simultaneously, timer extended to 5 minutes
- [ ] **Spectator mode** — read-only TV view for observers who join after game start
- [ ] **Leaderboard** — persistent high score per team name (requires backend)

---

## 6. File & Folder Structure (Recommended Refactor)

```
garden-keepers/
├── package.json
├── server.js                  # Express + WebSocket server
├── public/
│   ├── index.html             # Lobby + role select
│   ├── tv.html                # TV screen (was #tv-screen div)
│   ├── phone.html             # Phone screen (was #phone-screen div)
│   └── end.html               # End screen
├── src/
│   ├── data/
│   │   ├── problems.js        # PROBLEM_SETS array
│   │   ├── roles.js           # ROLES + ACTIONS definitions
│   │   └── constants.js       # Game config (round duration, health deltas, etc.)
│   ├── game/
│   │   ├── engine.js          # Round logic, scoring, health
│   │   ├── state.js           # Centralised state object + mutation helpers
│   │   └── sync.js            # WebSocket message dispatch
│   └── ui/
│       ├── tv.js              # TV DOM updates
│       ├── phone.js           # Phone DOM + button rendering
│       └── effects.js         # Visual effects (ripple, heal, wither, sun)
├── styles/
│   ├── base.css               # Variables, reset, typography
│   ├── lobby.css
│   ├── tv.css
│   └── phone.css
└── docs/
    ├── IMPLEMENTATION_PLAN.md  # This file
    └── GardenKeepers_UserGuide.docx
```

---

## 7. Game Constants (All Tunable)

These are currently hardcoded in the HTML. Centralise them in `constants.js`:

```js
export const CONFIG = {
  ROUNDS_TOTAL:         5,
  ROUND_DURATION_SEC:   180,    // 3 minutes
  ACTION_COOLDOWN_SEC:  8,
  SCORE_CORRECT:        50,
  SCORE_WRONG:          -10,
  HEALTH_CORRECT:       +10,
  HEALTH_WRONG:         -15,
  HEALTH_TIMEOUT:       -10,
  HEALTH_WIN_THRESHOLD: 50,     // % needed to win after 5 rounds
  PLOTS_COUNT:          6,
  SCORE_TIERS: {
    MASTER:    250,
    SKILLED:   150,
    APPRENTICE: 50,
  },
  POLL_INTERVAL_TV_MS:    1000,
  POLL_INTERVAL_PHONE_MS: 1500,
};
```

---

## 8. Testing Checklist

Before shipping any update, verify:

### Functional
- [ ] TV screen launches without errors in Chrome, Safari, Firefox
- [ ] All 4 role phone views load with correct theme colour and 3 action buttons
- [ ] Lobby correctly blocks launching phone view without selecting a role
- [ ] `startRound()` shows problem banner and updates phone clues within 2 seconds
- [ ] Correct action → health increases, score increases, round ends, banner disappears
- [ ] Wrong action → plant wilts, health decreases, round continues
- [ ] Timer reaches 0:00 → health decreases, plant wilts, next round button appears
- [ ] Round 5 completion → end screen shows correct win/lose state
- [ ] Health reaching 0% mid-game triggers immediate end screen
- [ ] Back button from TV returns to lobby cleanly (no lingering intervals)

### Cross-Device (after WebSocket upgrade)
- [ ] TV on laptop + 2 phones on separate devices all sync within 1 second
- [ ] Late-joining player sees current round state after connecting
- [ ] Disconnect and reconnect restores player to correct role

### Edge Cases
- [ ] 2-player game (only 2 roles selected) completes all 5 rounds
- [ ] Rapid-fire wrong answers (health reaches 0 in round 1) — end screen appears correctly
- [ ] Player presses button during cooldown — toast shows, no action submitted
- [ ] Player presses button before round starts — toast shows, no action submitted

---

## 9. Session Handover Checklist

Hand this to the incoming Claude Code session along with the source files:

- [x] `garden-game.html` — current working prototype
- [x] `GardenKeepers_UserGuide.docx` — player documentation
- [x] `GARDEN_KEEPERS_IMPLEMENTATION_PLAN.md` — this file
- [ ] Confirm target: **browser-only enhancement** OR **Node.js server upgrade**
- [ ] Confirm deployment target: local file, static host (Netlify/Vercel), or self-hosted
- [ ] Confirm whether Firebase credentials are available (for RTDB option)
- [ ] Decide Phase 1 scope — fix bugs only, or full WebSocket refactor?

---

## 10. Quick-Start Commands (After Refactor)

```bash
# Install dependencies
npm install

# Run dev server with hot reload
npm run dev

# Run production build
npm run build

# Run tests
npm test

# Serve production build
npm start
```

---

*Last updated: March 2026 — Generated for Garden Keepers v1.0 prototype handover.*
