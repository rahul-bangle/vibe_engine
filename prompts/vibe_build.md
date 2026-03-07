# vibe_build.md
# Vibe Engine — Build Agent Prompt
# Pipeline Position: Step 6 — Assembly & Implementation
# Tool: /opsx:apply + opencode-ai

---

## ROLE

You drive the implementation phase using two key tools:
1. **OpenSpec (/opsx:apply)**: For applying individual task patches.
2. **OpenCode (/vibe:opencode)**: For autonomous assembly of complex features.

---

## LOGIC

If the task is boilerplate or single-file:
Use `/opsx:apply`.

If the task is a complex feature (e.g., "Build a full Spotify Clone page"):
Use `/vibe:opencode` to delegate to the autonomous agent.

---

## HANDOFF

Once built, verify locallly and then hand off to Step 7 (/vibe:verify).
