USER: "Build a Skill Journeys feature for Spotify"
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 0: /vibe:brief                                        ║
║  Interview Agent asks 6 business questions                   ║
║  OUTPUT: feature-brief.md                                    ║
║  ✋ GATE 1 — Human approves                                  ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 0.5: /vibe:capture  ← USES: Chrome DevTools MCP       ║
║                                                              ║
║  Agent connects to Chrome DevTools MCP and calls:            ║
║                                                              ║
║  1. navigate_page → opens spotify.com                        ║
║  2. take_snapshot → gets accessibility tree:                 ║
║     ┌─────────────────────────────────────────┐              ║
║     │ navigation "Main"    ← SIDEBAR          │              ║
║     │ banner               ← TOP NAV          │              ║
║     │ main                 ← CONTENT AREA     │              ║
║     │   heading "Good evening"                │              ║
║     │   group "Recently Played"               │              ║
║     └─────────────────────────────────────────┘              ║
║  3. take_screenshot → visual reference image                 ║
║  4. evaluate_script → getComputedStyle() for key elements    ║
║     (sidebar width, nav height, bg color, font)              ║
║                                                              ║
║  OUTPUT:                                                     ║
║  ├── capture/screenshots/homepage.png                        ║
║  ├── capture/a11y-snapshot.json    ← FROM take_snapshot      ║
║  └── capture/computed-styles.json  ← FROM evaluate_script    ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 1: /opsx:new + /opsx:ff  ← USES: OpenSpec             ║
║                                                              ║
║  The spec agent now has THREE inputs:                        ║
║  ├── feature-brief.md     (WHAT the user wants to build)     ║
║  ├── a11y-snapshot.json   (WHAT the site structure IS)       ║
║  └── computed-styles.json (exact measured values)            ║
║                                                              ║
║  /opsx:new skill-journeys                                    ║
║  → Creates: openspec/changes/skill-journeys/                 ║
║                                                              ║
║  /opsx:ff                                                    ║
║  → Reads all 3 inputs, generates:                            ║
║                                                              ║
║  proposal.md ─── "We're adding a goal-driven dashboard"      ║
║       │                                                      ║
║       ▼                                                      ║
║  spec.md ─────── FROM a11y-snapshot:                         ║
║       │          "navigation exists → sidebar 240px"         ║
║       │          "banner exists → top nav 64px"              ║
║       │          "main exists → scrollable content"          ║
║       │          FROM feature-brief:                         ║
║       │          "goal selector, 5 songs + 1 podcast"        ║
║       │          (NO GUESSING — every value has a source)    ║
║       │                                                      ║
║       ▼                                                      ║
║  design.md ───── "React components, CSS Grid layout"         ║
║       │                                                      ║
║       ▼                                                      ║
║  tasks.md ────── "1.1 Create sidebar layout, 2.1 Goal..."   ║
║                                                              ║
║  ✋ GATE 2 — Human reviews all 4 artifacts                   ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 2: /vibe:tokenize                                      ║
║                                                              ║
║  Tokenize Agent reads:                                       ║
║  ├── capture/screenshots/homepage.png (visual)               ║
║  └── capture/computed-styles.json (measured values)          ║
║                                                              ║
║  Cross-validates: screenshot colors vs computed colors        ║
║  OUTPUT: design-tokens.json + theme.css                      ║
║  ✋ GATE 3 — Human approves tokens                           ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 3: /vibe:design  ← USES: Stitch MCP                   ║
║                                                              ║
║  Design Agent reads BOTH:                                    ║
║  ├── spec.md          (behavioral contract)                  ║
║  └── design-tokens.json (visual values)                      ║
║                                                              ║
║  Builds the Stitch prompt with EVERYTHING:                   ║
║  ┌─────────────────────────────────────────────┐             ║
║  │ "Build a Skill Journeys dashboard.          │             ║
║  │                                             │             ║
║  │ PLATFORM CONSTRAINT: Desktop, 1024px min    │ ← spec.md  ║
║  │ LAYOUT REQUIREMENT:                         │ ← spec.md  ║
║  │   Fixed left sidebar 240px                  │             ║
║  │   Fixed top nav 64px                        │             ║
║  │   Scrollable main content                   │             ║
║  │                                             │             ║
║  │ CONTENT REQUIREMENTS:                       │ ← spec.md  ║
║  │   Goal selector with pill buttons           │             ║
║  │   Daily Track: 5 songs + 1 podcast          │             ║
║  │   Horizontal progress bar                   │             ║
║  │                                             │             ║
║  │ DESIGN CONSTRAINTS:                         │ ← tokens   ║
║  │   Primary: #1db954                          │             ║
║  │   Background: #121212                       │             ║
║  │   Font: Spotify Circular                    │             ║
║  │   Spacing: 16px                             │             ║
║  │                                             │             ║
║  │ BUSINESS CONTEXT:                           │ ← brief    ║
║  │   Boost 7-day retention by 5%"              │             ║
║  └─────────────────────────────────────────────┘             ║
║                                                              ║
║  Stitch MCP generates UI screens                             ║
║  ✋ GATE 4 — Human approves design                           ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 4: /vibe:build + /opsx:apply                           ║
║                                                              ║
║  /opsx:apply reads tasks.md, drives implementation:          ║
║  ✓ 1.1 Create Dashboard layout (sidebar + nav + main)        ║
║  ✓ 2.1 GoalSelector component                               ║
║  ✓ 2.2 DailyTrack component (5 songs + 1 podcast)           ║
║  ✓ 2.3 ProgressBar component                                ║
║  ✓ 2.4 NudgeBanner component                                ║
║  ✓ 3.1 Compose into Dashboard page                          ║
║                                                              ║
║  All components use theme.css from design-tokens.json        ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 5: /opsx:verify + /vibe:verify                         ║
║                                                              ║
║  /opsx:verify checks spec:                                   ║
║  ✓ Layout matches spec (sidebar 240px, nav 64px)             ║
║  ✓ Content matches spec (5 songs + 1 podcast)                ║
║  ✓ All tasks completed                                       ║
║                                                              ║
║  /vibe:verify checks visuals + business:                     ║
║  ✓ Colors match design-tokens.json                           ║
║  ✓ Feature addresses retention metric (from brief)           ║
║  ✋ GATE 5 — Human approves                                  ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 6: /opsx:archive                                       ║
║  Delta specs merged into openspec/specs/                     ║
║  Change moved to archive/                                    ║
║  Memory written to lessons-learned.md                        ║
╚══════════════════════════════════════════════════════════════╝
```







content = '''USER: \"Build a Skill Journeys feature for Spotify\"
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 1: /vibe:brief                                         ║
║  Interview Agent asks 6 business questions                   ║
║  OUTPUT: feature-brief.md                                    ║
║  ✋ GATE 1 — Human approves                                  ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 2: /vibe:capture  ← USES: Chrome DevTools MCP          ║
║                                                              ║
║  Agent connects to Chrome DevTools MCP and calls:            ║
║                                                              ║
║  1. navigate_page → opens spotify.com                        ║
║  2. take_snapshot → gets accessibility tree:                 ║
║     ┌─────────────────────────────────────────┐              ║
║     │ navigation \"Main\"    ← SIDEBAR          │              ║
║     │ banner               ← TOP NAV          │              ║
║     │ main                 ← CONTENT AREA     │              ║
║     │   heading \"Good evening\"                │              ║
║     │   group \"Recently Played\"               │              ║
║     └─────────────────────────────────────────┘              ║
║  3. take_screenshot → visual reference image                 ║
║  4. evaluate_script → getComputedStyle() for key elements    ║
║     (sidebar width, nav height, bg color, font)              ║
║                                                              ║
║  OUTPUT:                                                     ║
║  ├── capture/[category]/screenshots/[page]-[vp].png          ║
║  ├── capture/[category]/snapshots/[page]-snapshot.json       ║
║  └── capture/[category]/styles/[page]-computed-styles.json   ║
║  ✋ GATE 2 — Human approves capture                          ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 3a: /opsx:new & STEP 3b: /opsx:ff ← USES: OpenSpec     ║
║                                                              ║
║  The spec agent now has THREE inputs:                        ║
║  ├── feature-brief.md     (WHAT the user wants to build)     ║
║  ├── a11y-snapshot.json   (WHAT the site structure IS)       ║
║  └── computed-styles.json (exact measured values)            ║
║                                                              ║
║  /opsx:new skill-journeys                                    ║
║  → Creates folder. ✋ GATE 3a — Human approves opsx-new      ║
║                                                              ║
║  /opsx:ff                                                    ║
║  → Reads all 3 inputs, generates:                            ║
║                                                              ║
║  proposal.md ─── \"We're adding a goal-driven dashboard\"      ║
║       │                                                      ║
║       ▼                                                      ║
║  specs/        ─ FROM a11y-snapshot:                         ║
║       │          \"navigation exists → sidebar 240px\"         ║
║       │          \"banner exists → top nav 64px\"              ║
║       │          \"main exists → scrollable content\"          ║
║       │          FROM feature-brief:                         ║
║       │          \"goal selector, 5 songs + 1 podcast\"        ║
║       │          (NO GUESSING — every value has a source)    ║
║       │                                                      ║
║       ▼                                                      ║
║  design.md ───── \"React components, CSS Grid layout\"         ║
║       │                                                      ║
║       ▼                                                      ║
║  tasks.md ────── \"1.1 Create sidebar layout, 2.1 Goal...\"    ║
║                                                              ║
║  ✋ GATE 3b — Human approves OpenSpec artifacts              ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 4: /vibe:tokenize                                      ║
║                                                              ║
║  Tokenize Agent reads:                                       ║
║  ├── capture/.../screenshots/[page]-[vp].png (visual)        ║
║  └── capture/.../styles/[page]-computed-styles.json          ║
║                                                              ║
║  Cross-validates: screenshot colors vs computed colors       ║
║  OUTPUT: design-tokens.json + theme.css                      ║
║  ✋ GATE 4 — Human approves tokens                           ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 5: /vibe:design  ← USES: Stitch MCP                    ║
║                                                              ║
║  Design Agent reads BOTH:                                    ║
║  ├── specs/             (behavioral contract)                ║
║  └── design-tokens.json (visual values)                      ║
║                                                              ║
║  Builds the Stitch prompt with EVERYTHING:                   ║
║  ┌─────────────────────────────────────────────┐             ║
║  │ \"Build a Skill Journeys dashboard.          │             ║
║  │                                             │             ║
║  │ PLATFORM CONSTRAINT: Desktop, 1024px min    │ ← specs     ║
║  │ LAYOUT REQUIREMENT:                         │ ← specs     ║
║  │   Fixed left sidebar 240px                  │             ║
║  │   Fixed top nav 64px                        │             ║
║  │   Scrollable main content                   │             ║
║  │                                             │             ║
║  │ CONTENT REQUIREMENTS:                       │ ← specs     ║
║  │   Goal selector with pill buttons           │             ║
║  │   Daily Track: 5 songs + 1 podcast          │             ║
║  │   Horizontal progress bar                   │             ║
║  │                                             │             ║
║  │ DESIGN CONSTRAINTS:                         │ ← tokens    ║
║  │   Primary: #1db954                          │             ║
║  │   Background: #121212                       │             ║
║  │   Font: Spotify Circular                    │             ║
║  │   Spacing: 16px                             │             ║
║  │                                             │             ║
║  │ BUSINESS CONTEXT:                           │ ← brief     ║
║  │   Boost 7-day retention by 5%\"              │             ║
║  └─────────────────────────────────────────────┘             ║
║                                                              ║
║  Stitch MCP generates UI screens                             ║
║  ✋ GATE 5 — Human approves design                           ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 6: /vibe:build                                         ║
║                                                              ║
║  /opsx:apply reads tasks.md, drives implementation:          ║
║  ✓ 1.1 Create Dashboard layout (sidebar + nav + main)        ║
║  ✓ 2.1 GoalSelector component                                ║
║  ✓ 2.2 DailyTrack component (5 songs + 1 podcast)            ║
║  ✓ 2.3 ProgressBar component                                 ║
║  ✓ 2.4 NudgeBanner component                                 ║
║  ✓ 3.1 Compose into Dashboard page                           ║
║                                                              ║
║  All components use theme.css from design-tokens.json        ║
║  OUTPUT: codebase/                                           ║
║  ✋ GATE 6a, 6b, 6 — Build (Wave 1, Wave 2)                  ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 7: /vibe:verify                                        ║
║                                                              ║
║  /vibe:verify checks spec, code, and visuals:                ║
║  ✓ Layout matches specs/ (sidebar 240px, nav 64px)           ║
║  ✓ Content matches tasks.md (5 songs + 1 podcast)            ║
║  ✓ Colors match design-tokens.json                           ║
║  ✓ Visuals match Stitch MCP screens                          ║
║  ✓ Feature addresses retention metric (from brief)           ║
║                                                              ║
║  OUTPUT: verify-report.md                                    ║
║  ✋ GATE 8 — Human approves verification                     ║
╚══════════════════════════════════════════════════════════════╝
                    │
                    ▼
╔══════════════════════════════════════════════════════════════╗
║  STEP 8: /opsx:archive                                       ║
║  Delta specs merged into openspec/specs/                     ║
║  Change moved to archive/                                    ║
║  Memory written to lessons-learned.md                        ║
╚══════════════════════════════════════════════════════════════╝'''

with open('pipeline_diagram.md', 'w', encoding='utf-8') as f:
    f.write(content)
"