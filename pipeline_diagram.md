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
132: ║  └── design-tokens.json (visual values)                      ║
133: ║                                                              ║
134: ║  Builds the Stitch prompt with EVERYTHING:                   ║
135: ║  ┌─────────────────────────────────────────────┐             ║
136: ║  │ "Build a Skill Journeys dashboard.          │             ║
137: ║  │                                             │             ║
138: ║  │ PLATFORM CONSTRAINT: Desktop, 1024px min    │ ← spec.md  ║
139: ║  │ LAYOUT REQUIREMENT:                         │ ← spec.md  ║
140: ║  │   Fixed left sidebar 240px                  │             ║
141: ║  │   Fixed top nav 64px                        │             ║
142: ║  │   Scrollable main content                   │             ║
143: ║  │                                             │             ║
144: ║  │ CONTENT REQUIREMENTS:                       │ ← spec.md  ║
145: ║  │   Goal selector with pill buttons           │             ║
146: ║  │   Daily Track: 5 songs + 1 podcast          │             ║
147: ║  │   Horizontal progress bar                   │             ║
148: ║  │                                             │             ║
149: ║  │ DESIGN CONSTRAINTS:                         │ ← tokens   ║
150: ║  │   Primary: #1db954                          │             ║
151: ║  │   Background: #121212                       │             ║
152: ║  │   Font: Spotify Circular                    │             ║
153: ║  │   Spacing: 16px                             │             ║
154: ║  │                                             │             ║
155: ║  │ BUSINESS CONTEXT:                           │ ← brief    ║
156: ║  │   Boost 7-day retention by 5%"              │             ║
157: ║  └─────────────────────────────────────────────┘             ║
158: ║                                                              ║
159: ║  Stitch MCP generates UI screens                             ║
160: ║  ✋ GATE 4 — Human approves design                           ║
161: ╚══════════════════════════════════════════════════════════════╝
162:                     │
163:                     ▼
164: ╔══════════════════════════════════════════════════════════════╗
165: ║  STEP 4: /vibe:build + /opsx:apply                           ║
166: ║                                                              ║
167: ║  /opsx:apply reads tasks.md, drives implementation:          ║
168: ║  ✓ 1.1 Create Dashboard layout (sidebar + nav + main)        ║
169: ║  ✓ 2.1 GoalSelector component                               ║
170: ║  ✓ 2.2 DailyTrack component (5 songs + 1 podcast)           ║
171: ║  ✓ 2.3 ProgressBar component                                ║
172: ║  ✓ 2.4 NudgeBanner component                                ║
173: ║  ✓ 3.1 Compose into Dashboard page                          ║
174: ║                                                              ║
175: ║  All components use theme.css from design-tokens.json        ║
176: ╚══════════════════════════════════════════════════════════════╝
177:                     │
178:                     ▼
179: ╔══════════════════════════════════════════════════════════════╗
180: ║  STEP 5: /opsx:verify + /vibe:verify                         ║
181: ║                                                              ║
182: ║  /opsx:verify checks spec:                                   ║
183: ║  ✓ Layout matches spec (sidebar 240px, nav 64px)             ║
184: ║  ✓ Content matches spec (5 songs + 1 podcast)                ║
185: ║  ✓ All tasks completed                                       ║
186: ║                                                              ║
187: ║  /vibe:verify checks visuals + business:                     ║
188: ║  ✓ Colors match design-tokens.json                           ║
189: ║  ✓ Feature addresses retention metric (from brief)           ║
190: ║  ✋ GATE 5 — Human approves                                  ║
191: ╚══════════════════════════════════════════════════════════════╝
192:                     │
193:                     ▼
194: ╔══════════════════════════════════════════════════════════════╗
195: ║  STEP 6: /opsx:archive                                       ║
196: ║  Delta specs merged into openspec/specs/                     ║
197: ║  Change moved to archive/                                    ║
198: ║  Memory written to lessons-learned.md                        ║
199: ╚══════════════════════════════════════════════════════════════╝
200: ```
201: 
202: 
203: 
204: 
205: 
206: 
207: 
208: content = '''USER: \"Build a Skill Journeys feature for Spotify\"
209:                     │
210:                     ▼
211: ╔══════════════════════════════════════════════════════════════╗
212: ║  STEP 1: /vibe:brief                                         ║
213: ║  Interview Agent asks 6 business questions                   ║
214: ║  OUTPUT: feature-brief.md                                    ║
215: ║  ✋ GATE 1 — Human approves                                  ║
216: ╚══════════════════════════════════════════════════════════════╝
217:                     │
218:                     ▼
219: ╔══════════════════════════════════════════════════════════════╗
220: ║  STEP 2: /vibe:capture  ← USES: Chrome DevTools MCP          ║
221: ║                                                              ║
222: ║  Agent connects to Chrome DevTools MCP and calls:            ║
223: ║                                                              ║
224: ║  1. navigate_page → opens spotify.com                        ║
225: ║  2. take_snapshot → gets accessibility tree:                 ║
226: ║     ┌─────────────────────────────────────────┐              ║
227: ║     │ navigation \"Main\"    ← SIDEBAR          │              ║
228: ║     │ banner               ← TOP NAV          │              ║
229: ║     │ main                 ← CONTENT AREA     │              ║
230: ║     │   heading \"Good evening\"                │              ║
231: ║     │   group \"Recently Played\"               │              ║
232: ║     └─────────────────────────────────────────┘              ║
233: ║  3. take_screenshot → visual reference image                 ║
234: ║  4. evaluate_script → getComputedStyle() for key elements    ║
235: ║     (sidebar width, nav height, bg color, font)              ║
236: ║                                                              ║
237: ║  OUTPUT:                                                     ║
238: ║  ├── capture/screenshots/homepage.png (visual reference)    ║
239: ║  ├── capture/a11y-snapshot.json    ← FROM take_snapshot      ║
240: ║  └── capture/computed-styles.json  ← FROM evaluate_script    ║
241: ║  ✋ GATE 2 — Human approves capture                          ║
242: ╚══════════════════════════════════════════════════════════════╝
243:                     │
244:                     ▼
245: ╔══════════════════════════════════════════════════════════════╗
246: ║  STEP 3a: /opsx:new & STEP 3b: /opsx:ff ← USES: OpenSpec     ║
247: ║                                                              ║
248: ║  The spec agent now has THREE inputs:                        ║
249: ║  ├── feature-brief.md     (WHAT the user wants to build)     ║
250: ║  ├── a11y-snapshot.json   (WHAT the site structure IS)       ║
251: ║  └── computed-styles.json (exact measured values)            ║
252: ║                                                              ║
253: ║  /opsx:new skill-journeys                                    ║
254: ║  → Creates folder. ✋ GATE 3a — Human approves opsx-new      ║
255: ║                                                              ║
256: ║  /opsx:ff                                                    ║
257: ║  → Reads all 3 inputs, generates:                            ║
258: ║                                                              ║
259: ║  proposal.md ─── \"We're adding a goal-driven dashboard\"      ║
260: ║       │                                                      ║
261: ║       ▼                                                      ║
262: ║  specs/        ─ FROM a11y-snapshot:                         ║
263: ║       │          \"navigation exists → sidebar 240px\"         ║
264: ║       │          \"banner exists → top nav 64px\"              ║
265: ║       │          \"main exists → scrollable content\"          ║
266: ║       │          FROM feature-brief:                         ║
267: ║       │          \"goal selector, 5 songs + 1 podcast\"        ║
268: ║       │          (NO GUESSING — every value has a source)    ║
269: ║       │                                                      ║
270: ║       ▼                                                      ║
271: ║  design.md ───── \"React components, CSS Grid layout\"         ║
272: ║       │                                                      ║
273: ║       ▼                                                      ║
274: ║  tasks.md ────── \"1.1 Create sidebar layout, 2.1 Goal...\"    ║
275: ║                                                              ║
276: ║  ✋ GATE 3b — Human approves OpenSpec artifacts              ║
277: ╚══════════════════════════════════════════════════════════════╝
278:                     │
279:                     ▼
280: ╔══════════════════════════════════════════════════════════════╗
281: ║  STEP 4: /vibe:tokenize                                      ║
282: ║                                                              ║
283: ║  Tokenize Agent reads:                                       ║
284: ║  ├── capture/screenshots/homepage.png (visual)               ║
285: ║  └── capture/computed-styles.json (measured values)          ║
286: ║                                                              ║
287: ║  Cross-validates: screenshot colors vs computed colors        ║
288: ║  OUTPUT: design-tokens.json + theme.css                      ║
289: ║  ✋ GATE 4 — Human approves tokens                           ║
290: ╚══════════════════════════════════════════════════════════════╝
291:                     │
292:                     ▼
293: ╔══════════════════════════════════════════════════════════════╗
294: ║  STEP 5: /vibe:design  ← USES: Stitch MCP                    ║
295: ║                                                              ║
296: ║  Design Agent reads BOTH:                                    ║
297: ║  ├── specs/             (behavioral contract)                ║
298: ║  └── design-tokens.json (visual values)                      ║
299: ║                                                              ║
300: ║  Builds the Stitch prompt with EVERYTHING:                   ║
301: ║  ┌─────────────────────────────────────────────┐             ║
302: ║  │ \"Build a Skill Journeys dashboard.          │             ║
303: ║  │                                             │             ║
304: ║  │ PLATFORM CONSTRAINT: Desktop, 1024px min    │ ← specs     ║
305: ║  │ LAYOUT REQUIREMENT:                         │ ← specs     ║
306: ║  │   Fixed left sidebar 240px                  │             ║
307: ║  │   Fixed top nav 64px                        │             ║
308: ║  │   Scrollable main content                   │             ║
309: ║  │                                             │             ║
310: ║  │ CONTENT REQUIREMENTS:                       │ ← specs     ║
311: ║  │   Goal selector with pill buttons           │             ║
312: ║  │   Daily Track: 5 songs + 1 podcast          │             ║
313: ║  │   Horizontal progress bar                   │             ║
314: ║  │                                             │             ║
315: ║  │ DESIGN CONSTRAINTS:                         │ ← tokens    ║
316: ║  │   Primary: #1db954                          │             ║
317: ║  │   Background: #121212                       │             ║
318: ║  │   Font: Spotify Circular                    │             ║
319: ║  │   Spacing: 16px                             │             ║
320: ║  │                                             │             ║
321: ║  │ BUSINESS CONTEXT:                           │ ← brief     ║
322: ║  │   Boost 7-day retention by 5%\"              │             ║
323: ║  └─────────────────────────────────────────────┘             ║
324: ║                                                              ║
325: ║  Stitch MCP generates UI screens                             ║
326: ║  ✋ GATE 5 — Human approves design                           ║
327: ╚══════════════════════════════════════════════════════════════╝
328:                     │
329:                     ▼
330: ╔══════════════════════════════════════════════════════════════╗
331: ║  STEP 6: /vibe:build                                         ║
332: ║                                                              ║
333: ║  /opsx:apply reads tasks.md, drives implementation:          ║
334: ║  ✓ 1.1 Create Dashboard layout (sidebar + nav + main)        ║
335: ║  ✓ 2.1 GoalSelector component                                ║
336: ║  ✓ 2.2 DailyTrack component (5 songs + 1 podcast)            ║
337: ║  ✓ 2.3 ProgressBar component                                 ║
338: ║  ✓ 2.4 NudgeBanner component                                 ║
339: ║  ✓ 3.1 Compose into Dashboard page                           ║
340: ║                                                              ║
341: ║  All components use theme.css from design-tokens.json        ║
342: ║  OUTPUT: codebase/                                           ║
343: ║  ✋ GATE 6a, 6b, 6 — Build (Wave 1, Wave 2)                  ║
344: ╚══════════════════════════════════════════════════════════════╝
345:                     │
346:                     ▼
347: ╔══════════════════════════════════════════════════════════════╗
348: ║  STEP 7: /vibe:verify                                        ║
349: ║                                                              ║
350: ║  /vibe:verify checks spec, code, and visuals:                ║
351: ║  ✓ Layout matches specs/ (sidebar 240px, nav 64px)           ║
352: ║  ✓ Content matches tasks.md (5 songs + 1 podcast)            ║
353: ║  ✓ Colors match design-tokens.json                           ║
354: ║  ✓ Visuals match Stitch MCP screens                          ║
355: ║  ✓ Feature addresses retention metric (from brief)           ║
356: ║                                                              ║
357: ║  OUTPUT: verify-report.md                                    ║
358: ║  ✋ GATE 8 — Human approves verification                     ║
359: ╚══════════════════════════════════════════════════════════════╝
360:                     │
361:                     ▼
362: ╔══════════════════════════════════════════════════════════════╗
363: ║  STEP 8: /opsx:archive                                       ║
364: ║  Delta specs merged into openspec/specs/                     ║
365: ║  Change moved to archive/                                    ║
366: ║  Memory written to lessons-learned.md                        ║
367: ╚══════════════════════════════════════════════════════════════╝'''
