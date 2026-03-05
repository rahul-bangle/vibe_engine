---
description: Read at the start of EVERY conversation. Orient the agent. Tell it exactly what step it's on, what gate to check, and what file to activate.
---

# feature_kickoff.md
# Vibe Engine — Pipeline Traffic Controller
# Location: .agents/workflows/feature_kickoff.md
# Version: 1.2
#
# Rule: Read this file at the START of every conversation.
# You are not a "step" — you are the controller.
# You orient, check the gate, and hand off to the correct prompt.
# feature_kickoff.md + the step's prompt file run in the SAME conversation.

---

## WHAT YOU DO

You are the traffic controller for Vibe Engine.
You do NOT build anything. You do NOT write specs.
You orient the agent, check the gate, and activate the correct prompt.
That is your only job.

---

## STEP 1 — IDENTIFY THE PROJECT

Ask the user one thing:
> "What is the project name?
> (e.g. spotify-journeys, netflix-watchlist)"

When the user responds:
1. **Immediately auto-slugify** the name: lowercase, replace spaces with hyphens, strip all non-alphanumeric and non-hyphen characters. Regex: `/^[a-z][a-z0-9-]{1,30}$/`
   - Example: "Spotify Journeys" → `spotify-journeys`
   - Example: "My App 2.0!" → `my-app-20`
2. **Show the user the slug** and confirm: `Project slug: spotify-journeys. Correct? (Y/N)`
3. **On confirmation**: Write the slug as a single line to `projects/[slug]/.project-id`
   This is the canonical slug. All files in this project MUST use this slug for folder paths.

Then confirm the project folder exists at `projects/[slug]/`

If the folder does not exist → this is a new project. Go to NEW PROJECT flow.
If the folder exists → go to RESUME PROJECT flow.

---

## NEW PROJECT FLOW

Tell the user:
```
Starting new project: [slug]
Step 1 of 8 — /vibe:brief

Activating Interview Agent now.
```

Then immediately read and follow `prompts/prd_writer.md`.
**IMPORTANT:** Pass the locked slug from `.project-id` to prd_writer. prd_writer MUST use this slug verbatim as the Project ID — it does NOT re-slugify.

---

## RESUME PROJECT FLOW

Check the `projects/[slug]/.gates/` folder.
Use `list_dir` on `projects/[slug]/.gates/` to get all gate files.
For each gate file found, use `view_file` to read its contents.
Use this decision table:

| Gates Present | Current Step | Activate |
|--------------|-------------|---------|
| none | Step 1 — /vibe:brief | `prompts/prd_writer.md` |
| gate-1-brief-approved.md | Step 2 — /vibe:capture | `prompts/vibe_capture.md` |
| gate-2-capture-approved.md | Step 3a — /opsx:new | OpenSpec instructions below |
| gate-3a-opsx-new-done.md | Step 3b — /opsx:ff | OpenSpec instructions below |
| gate-3b-opsx-ff-approved.md | Step 4 — /vibe:tokenize | `prompts/vibe_tokenize.md` |
| gate-4-tokenize-approved.md | Step 5 — /vibe:design | `prompts/vibe_design.md` |
| gate-5-design-approved.md | Step 6 — /vibe:build (Wave 1) | `prompts/vibe_build.md` |
| gate-5 + gate-6a-wave1-verified.md | Step 6 — /vibe:build (Wave 2) | `prompts/vibe_build.md` |
| gate-5 + gate-6b-wave2-verified.md | Step 6 — /vibe:build APPROVE | `prompts/vibe_build.md` |
| gate-6-build-approved.md | Step 7 — /vibe:verify | `prompts/vibe_verify.md` |
| gate-8-verify-approved.md | Step 8 — /opsx:archive | OpenSpec instructions below |
| FAILURE.md present | HALTED | Failure flow below |

Report to user exactly:
```
Project: [slug]
Current step: [step name] — [command]
Gate confirmed: [gate file name]
Activating: [prompt file or tool]
```

Then immediately activate.

---

## WRONG ORDER DETECTION

If the user types a command that doesn't match the current step:

```
[WRONG ORDER — Step X required]
You typed: /vibe:[command]
Current step is: [correct step] — [correct command]
Gate required: [gate file name]

Complete Step [X] first. Type the correct command to continue.
```

Do not execute the wrong command. Do not skip steps.

---

## OPENSPEC INSTRUCTIONS — Step 3a: /opsx:new

When gate-2-capture-approved.md exists:

```
Step 3a — /opsx:new

Run in your terminal FROM the Vibe_Engine root (not inside a project folder):

  /opsx:new [feature-name]

This creates: openspec/changes/[feature-name]/

When done — type DONE here.
```

On DONE — write `projects/[feature-name]/.gates/gate-3a-opsx-new-done.md`:
```markdown
# gate-3a-opsx-new-done.md
Date: [date]
Project: [feature-name]
Output: openspec/changes/[feature-name]/ ✅
Unlocks: Step 3b — /opsx:ff
```

---

## OPENSPEC INSTRUCTIONS — Step 3b: /opsx:ff

When gate-3a-opsx-new-done.md exists:

```
Step 3b — /opsx:ff

OpenSpec needs your capture data as context.
Run from Vibe_Engine root:

  /opsx:ff

OpenSpec will generate:
  openspec/changes/[feature-name]/proposal.md
  openspec/changes/[feature-name]/specs/
  openspec/changes/[feature-name]/design.md
  openspec/changes/[feature-name]/tasks.md  ← Wave 1 + Wave 2 labels

Review all 4 outputs. Type APPROVED when ready.
```

On APPROVED — write `projects/[feature-name]/.gates/gate-3b-opsx-ff-approved.md`:
```markdown
# gate-3b-opsx-ff-approved.md
Date: [date]
Project: [feature-name]
Outputs: proposal.md ✅ specs/ ✅ design.md ✅ tasks.md ✅
Approved: YES
Unlocks: Step 4 — /vibe:tokenize
```

---

## OPENSPEC INSTRUCTIONS — Step 9: /opsx:archive

When gate-8-verify-approved.md exists:

```
Step 9 — /opsx:archive

Run from Vibe_Engine root:
  /opsx:archive

This moves openspec/changes/[feature-name]/ to archive/
and updates the spec index.

Type DONE when complete.
```

---

## FAILURE FLOW

If `FAILURE.md` exists in the project folder:

```
[PROJECT HALTED]
Project: [feature-name]
A failure was recorded in FAILURE.md.

Contents:
[read and display FAILURE.md]

Options:
1. Fix the issue → type RETRY to continue from the failed step
2. Type RESET to clear FAILURE.md and restart the current step
3. Type ABANDON to archive this project as failed
```

Do not run any step until user makes a choice.

---

## GATE FILE FORMAT

Every gate file must follow this format:

```markdown
# gate-[N]-[step]-approved.md
Date: [date]
Project: [feature-name]
Step: [N] — [command]
Outputs: [list] ✅
Approved: YES
Unlocks: [next step]
```