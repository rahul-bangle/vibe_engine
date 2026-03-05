---
# PRD — Spotify Journeys
**Project ID:** spotify-journeys
**PRD Version:** 2.1
**Date:** 2026-03-05
**Status:** DRAFT — Awaiting Approval

## 1. Problem Statement
While young professionals in India (18–30) stream audio daily on Spotify, their engagement remains passive despite a strong desire to use audio for skill building (e.g., improving English, building focus habits). Currently, they must switch to YouTube or niche apps like Duolingo for structured learning, missing the opportunity to tie their existing music/podcast habits directly to personal growth goals.

## 2. Goal
Position Spotify as a personal growth tool in India by launching an MVP that allows users to set structured, audio-based learning goals with progress tracking.

## 3. Scope
**In scope:**
- Ability for users to select/set a learning goal (e.g., "Improve English vocabulary", "Focus better").
- A structured audio track/playlist format combining songs and podcast clips.
- A basic progress tracker (streak days, completion percentage).
- Light nudge system (reminders, motivational messages).

**Out of scope:**
- Interactive quizzes.
- Highly AI-personalized learning paths (dynamic generation beyond simple track assignment).
- Complex certificate/badge issuance systems (beyond simple completion %).
- A full creator marketplace for audio courses.
- Dedicated mobile app builds (MVP is Web-focused).

## 4. Platform & Context
**Target platform:** Desktop Web
**Target URL:** https://open.spotify.com
**Authentication required:** YES
**Visual reference:** https://open.spotify.com
**Existing codebase:** No (Building new MVP prototype using AI tools like Lovable/Replit)
**Entry point:** A new "Journeys" or "Skills" section accessible from the main navigation sidebar.

## 4b. Pages & Capture Scope
- Homepage (Logged-in view)
- Playlist/Track detail page
- Podcast episode page
- User profile/progress overview page

## 5. Functional Requirements
### Requirement 1: Goal Selection
The system SHALL provide a predefined list of learning goals for the user to select from during an onboarding flow.

### Requirement 2: Journey Track Generation
The system SHALL generate a structured playlist (a "Journey") consisting of a mix of music tracks and educational podcast clips aligned with the selected goal.

### Requirement 3: Progress Tracking
The system SHALL track daily audio consumption within the Journey and display a visual progress indicator (days streak, % completed) to the user.

### Requirement 4: User Nudges
The system SHALL display light, motivational messages or reminders based on the user's progress or lack of activity.

## 6. Business Intent
**Why are we building this?** To differentiate Spotify in the highly competitive Indian market by transforming passive listening into high-intent engagement.
**What metric does this move?** Average Session Length and D7 Retention per engaged user.
**What happens if we skip this?** Spotify risks remaining simply an easily replaceable entertainment app, failing to capture the growing "edutainment" and self-improvement market share.

## 7. Success Criteria
- [ ] 20% of the 1,000 pilot users complete at least one full Journey (e.g., a 7-day track).
- [ ] Pilot users show a 15% higher Average Session Length compared to their baseline.
- [ ] Positive qualitative feedback indicating Spotify is viewed as a "learning" tool.
---
