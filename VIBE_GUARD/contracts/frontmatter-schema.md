# frontmatter-schema.md (Vibe Engine Contract)
# Version: 1.0

## PRD FRONTMATTER (vibe_guard)
The following fields MUST be written by `prd_writer.md` into `feature-brief.md`.

- **project_id**: The project slug.
- **vibe_guard.has_auth**: [Boolean] True if site requires login.
- **vibe_guard.has_audio**: [Boolean] True if site involves sound.
- **vibe_guard.is_cross_device**: [Boolean] True if mobile capture is needed.
- **vibe_guard.platform**: [web/mobile/hybrid].
- **vibe_guard.aesthetic**: [String] The design theme description.

## RUNTIME ONLY (Do NOT include in PRD)
The following fields are computed by `brain.md` at runtime. Do NOT write these to the PRD.
- `workspace.concurrent_projects`
- `workspace.has_shared_design_system`
- `project.git_status`
- `project.is_archived`
