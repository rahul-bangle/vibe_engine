# prd-checklist.md (Vibe Engine Contract)
# Version: 1.0
#
# This file defines the mandatory extraction fields for Step 0 (Interview Agent).

## 1. Context Information
- **target_url**: The URL of the site to capture or clone. (Required unless greenfield)
- **has_auth**: Does the interaction require logged-in state? (Default: false)
- **is_cross_device**: Should we capture mobile viewports? (Default: false)
- **has_audio**: Does the feature involve sound/media players? (Default: false)
- **entry_point**: Where does the user start in the UI? (Required)

## 2. Requirement Structure
- **scope_in**: List of at least 2 functional requirements that are IN SCOPE.
- **scope_out**: List of at least 1 functional requirement that is OUT OF SCOPE.
- **core_metric**: The primary business metric this feature moves. (Default: "User Engagement")

## 3. Aesthetic/Vibe Checklist
- **primary_theme**: High-level visual style (e.g., Premium Dark, Minimalist).
- **aesthetic_mood**: Adjectives describing the UI (e.g., Sleek, Vibrant, Professional).
- **visual_references**: Any URLs to existing design inspirations.
