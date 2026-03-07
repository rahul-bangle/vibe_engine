# AGENTS.md
# Vibe Engine — v1.2
# Rule: Read this file at the START of every conversation. No exceptions.

---

## Pipeline

Every project runs in this exact order.
feature_kickoff.md runs first in every conversation, then hands off to the correct step.

| Step | Command | Prompt / Tool |
|------|---------|---------------|
| 1 | `/vibe:brief` | `prompts/prd_writer.md` |
| 2 | `/vibe:capture` | `prompts/vibe_capture.md` ← Chrome DevTools MCP |
| 3a | `/opsx:new` | OpenSpec CLI — creates change folder |
| 3b | `/opsx:ff` | OpenSpec CLI — generates all artifacts |
| 4 | `/vibe:tokenize` | `prompts/vibe_tokenize.md` |
| 5 | `/vibe:design` | `prompts/vibe_design.md` ← Stitch MCP |
| 6 | `/vibe:build` | `prompts/vibe_build.md` ← wraps `/opsx:apply` |
| 7 | `/vibe:verify` | `prompts/vibe_verify.md` |
| 8 | `/opsx:archive` | OpenSpec CLI |
| 9 | `/vibe:opencode` | `prompts/vibe_opencode.md` ← OpenCode AI |

---

## Hard Rules

1. No step runs without the previous gate file confirmed in `projects/[name]/.gates/`
2. feature_kickoff.md runs at the start of every conversation — it is not a "step", it is the controller
3. Stack is locked: Vite + React + Tailwind — no exceptions
4. All project files live in `projects/[feature-name]/`
5. On any failure — write `FAILURE.md` to the project folder and stop. Never continue past a failure.

---

## Required Tools

**MCPs (configure in Antigravity MCP settings):**
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222", "-y"]
    }
  }
}
```
Used by: `/vibe:capture` only

Stitch MCP → configure separately. Used by: `/vibe:design` only

**OpenSpec CLI (install once at Vibe_Engine root):**
```
npm install -g @fission-ai/openspec@latest
cd Vibe_Engine
openspec init
```
⚠️ Run `openspec init` at Vibe_Engine root ONLY — never inside a project subfolder.
OpenSpec writes to: `Vibe_Engine/openspec/changes/[feature-name]/`

---

## Canonical Path Reference

| File | Written By | Exact Path |
|------|-----------|------------|
| feature-brief.md | `/vibe:brief` | `projects/[name]/docs/feature-brief.md` |
| target URL | `/vibe:brief` | `projects/[name]/docs/target-url.txt` |
| .project-id | `feature_kickoff` | `projects/[name]/.project-id` |
| screenshots | `/vibe:capture` | `projects/[name]/capture/[category]/screenshots/[page]-[viewport].png` |
| a11y-snapshot.json | `/vibe:capture` | `projects/[name]/capture/[category]/snapshots/[page]-snapshot.json` |
| computed-styles.json | `/vibe:capture` | `projects/[name]/capture/[category]/styles/[page]-computed-styles.json` |
| proposal.md | `/opsx:ff` | `openspec/changes/[name]/proposal.md` |
| specs/ | `/opsx:ff` | `openspec/changes/[name]/specs/` |
| design.md | `/opsx:ff` | `openspec/changes/[name]/design.md` |
| tasks.md | `/opsx:ff` | `openspec/changes/[name]/tasks.md` |
| design-tokens.json | `/vibe:tokenize` | `projects/[name]/tokens/design-tokens.json` |
| theme.css | `/vibe:tokenize` | `projects/[name]/tokens/theme.css` |
| Stitch screens | `/vibe:design` | `projects/[name]/stitch/` |
| codebase | `/vibe:build` | `projects/[name]/codebase/` |
| HANDOFF.md | `/vibe:build` | `projects/[name]/HANDOFF.md` |
| verify-report.md | `/vibe:verify` | `projects/[name]/verify-report.md` |
| FAILURE.md | any step | `projects/[name]/FAILURE.md` |
| **gate-1** | `/vibe:brief` | `projects/[name]/.gates/gate-1-brief-approved.md` |
| **gate-2** | `/vibe:capture` | `projects/[name]/.gates/gate-2-capture-approved.md` |
| **gate-3a** | `/opsx:new` | `projects/[name]/.gates/gate-3a-opsx-new-done.md` |
| **gate-3b** | `/opsx:ff` | `projects/[name]/.gates/gate-3b-opsx-ff-approved.md` |
| **gate-4** | `/vibe:tokenize` | `projects/[name]/.gates/gate-4-tokenize-approved.md` |
| **gate-5** | `/vibe:design` | `projects/[name]/.gates/gate-5-design-approved.md` |
| **gate-6a** | `/vibe:build` | `projects/[name]/.gates/gate-6a-wave1-verified.md` |
| **gate-6b** | `/vibe:build` | `projects/[name]/.gates/gate-6b-wave2-verified.md` |
| **gate-6** | `/vibe:build` | `projects/[name]/.gates/gate-6-build-approved.md` |
| **gate-8** | `/vibe:verify` | `projects/[name]/.gates/gate-8-verify-approved.md` |
| **gate-9** | `/vibe:opencode` | `projects/[name]/.gates/gate-9-opencode-done.md` |

---

## Project Folder Structure

```
Vibe_Engine/
├── openspec/
│   └── changes/
│       └── [feature-name]/     ← OpenSpec writes here (repo root)
│           ├── proposal.md
│           ├── specs/
│           ├── design.md
│           └── tasks.md
├── projects/
│   └── [feature-name]/
│       ├── .project-id          ← canonical slug lockfile
│       ├── .gates/             ← gate files — pipeline enforcement
│       ├── docs/
│       │   ├── feature-brief.md
│       │   └── target-url.txt  ← URL per project, not global
│       ├── capture/
│       │   ├── [category-name]/
│       │   │   ├── screenshots/
│       │   │   ├── snapshots/
│       │   │   └── styles/
│       ├── tokens/
│       │   ├── design-tokens.json
│       │   └── theme.css
│       ├── stitch/
│       ├── codebase/
│       ├── HANDOFF.md          ← written by /vibe:build on completion
│       ├── FAILURE.md          ← only exists if something broke
│       └── verify-report.md    ← written by /vibe:verify
```
