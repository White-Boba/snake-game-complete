# Snake Game — Codebase Map
> Maintained by Boba (orchestrator). Update this after every significant change.
> Use this instead of re-reading the full file. Last updated: 2026-04-01

## File: `index.html`
Single-file game. ~600 lines. HTML + CSS + JS all inline.

---

## HTML Structure
- `.game-wrapper` — outer card, centered on page
- `#score`, `#highScore` — live score displays in `.score-board`
- `#powerupHud` — active powerup tags shown above canvas
- `#gameCanvas` — 640×640 canvas, GRID=20, TILES=32 (32×32 grid)
- `#startScreen` — overlay shown before game starts (click or Space to dismiss)
- `#shopScreen` — overlay shown on game over (upgrade shop)
- `.dpad` — mobile directional buttons (hidden on ≥700px screens)

---

## CSS Highlights
- Body: purple gradient bg, flexbox centered
- Canvas: dark (#111) with white border
- `#shopScreen`: fullscreen dark overlay, flex column, scrollable
- `.powerup-tag`: pill badge for HUD
- `.dpad`: CSS grid 3×2, hidden on desktop via `@media (min-width: 700px)`

---

## JS — Global State Variables
| Variable | Type | Purpose |
|---|---|---|
| `GRID` | const 20 | Pixel size of each tile |
| `TILES` | const 32 | Number of tiles per row/col |
| `pointsPool` | int | Persistent points across runs (session only) |
| `upgrades` | object | `{ ghostChance:0-3, magnet:bool, headStart:0-3, extraLife:bool }` |
| `snake` | array | Array of `{x,y}` — index 0 is head |
| `food` | object | `{x,y}` current food position |
| `dx,dy` | int | Current movement direction |
| `nextDx,nextDy` | int | Buffered next direction (prevents mid-tick reversal) |
| `score` | int | Current run score |
| `highScore` | int | Persisted in localStorage |
| `gameSpeed` | int ms | setInterval delay, starts 150, min 50 |
| `gameInterval` | id | setInterval handle |
| `gameRunning` | bool | False when dead |
| `gameStarted` | bool | False until first space/click |
| `isPaused` | bool | Toggle with Space |
| `scoreAnims` | array | Float `+10` animations `{x,y,alpha,offsetY}` |
| `extraLifeUsed` | bool | Per-run flag for extra life upgrade |
| `activePowerup` | obj/null | `{type, label, endTime}` — currently active powerup effect |
| `spawnedPowerup` | obj/null | `{x,y,type,emoji,color,spawnedAt}` — powerup on board |
| `foodEatenCount` | int | Resets each run, triggers powerup spawn at multiples of 10 |
| `shieldActive` | bool | True when shield powerup collected |

---

## JS — Key Functions

### Game Flow
| Function | What it does |
|---|---|
| `initGame()` | Resets all per-run state, applies upgrade effects (headStart), calls spawnFood()+draw() |
| `startGame()` | Hides startScreen, calls initGame(), starts gameInterval |
| `startFromShop()` | Hides shopScreen, calls initGame(), starts gameInterval |
| `togglePause()` | Flips isPaused, clears/restarts interval |
| `gameOver()` | Sets gameRunning=false, clears interval, calls showShop() |
| `restartGame()` | (legacy, not used — shop replaced it) |

### Game Loop
| Function | What it does |
|---|---|
| `update()` | Main tick: move snake, check wall wrap, check self-collision (with shield/ghost/extraLife logic), check food, check powerup pickup, call draw() |
| `spawnFood()` | Random position (or magnet-biased near head), avoids snake body |
| `spawnPowerup()` | Picks random POWERUP_TYPES entry, places on board, sets 8s despawn timeout |
| `applyPowerup(type)` | Activates powerup: shield sets shieldActive, others set activePowerup with endTime + setTimeout to clear |

### Drawing
| Function | What it does |
|---|---|
| `draw()` | Clears canvas, draws: grid lines, snake body, food (pulsing), spawnedPowerup (pulsing circle + emoji), scoreAnims, pause overlay |
| `drawEyes(sx,sy,sz)` | Draws 2 eyes on snake head based on current dx/dy direction |
| `drawScoreAnims()` | (inlined in draw) — iterates scoreAnims, fades/rises +10 text |
| `updateHud()` | Updates #powerupHud with current shield + active powerup tags |

### Input
| Function | What it does |
|---|---|
| `handleInput(e)` | Keydown: always preventDefault for arrows+space. Space = start/pause. Arrows = setDirection |
| `setDirection(ndx,ndy)` | Validates no reversal, sets nextDx/nextDy |
| Touch handlers | touchstart saves position, touchend computes swipe delta (30px threshold), calls setDirection |

### Shop
| Function | What it does |
|---|---|
| `showShop()` | Renders SHOP_ITEMS into #shopItems DOM, shows #shopScreen |
| Buy button handler | Deducts pointsPool, calls item.buy(), re-renders shop |

---

## Data Structures

### POWERUP_TYPES (const array)
```
{ type: 'speed'|'ghost'|'shield', emoji, color, label, duration (ms or null) }
```

### SHOP_ITEMS (const array)
```
{ key, name, cost, maxLevel, desc, getLevel(), canBuy(), buy() }
```
Items: ghostChance (50pts, 3 levels), magnet (75pts, 1 level), headStart (30pts, 3 levels), extraLife (100pts, 1 level)

---

## Upgrade Effects (applied at runtime)
| Upgrade | Where applied |
|---|---|
| `headStart` | `initGame()` — snake starts with `1 + headStart*2` segments |
| `magnet` | `spawnFood()` — biases food within 10 tiles of head |
| `ghostChance` | `update()` self-collision check — `Math.random() < ghostChance * 0.1` |
| `extraLife` | `update()` self-collision check — resets snake to center, sets extraLifeUsed=true |

---

## Known Issues / Notes
- `spawnedPowerup` despawn setTimeout uses `spawnedAt === spawnedAt` (always true) — harmless but not a real guard. Fix: check by reference or id if needed.
- Speed boost powerup clears and resets interval — if another interval is already running due to speed change mid-boost, edge case possible.
- HUD refresh `setInterval` runs every 500ms unconditionally — minor CPU use when idle.
- `#restartBtn` still in CSS but not used (shop replaced it).
