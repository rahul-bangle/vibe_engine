## Context
The Spotify Journeys MVP aims to transform passive audio consumption into high-intent engagement for Indian users. We are building a lightweight overlay or integrated dashboard within the Spotify Web Player context that provides structured learning paths.

## Goals / Non-Goals

**Goals:**
- Provide a clear entry point for "Journeys" in the sidebar.
- Enable goal-based onboarding (e.g., Focus, Language).
- Deliver a structured playback experience (interleaved songs/podcasts).
- Track and display user progress (streaks/completion %).

**Non-Goals:**
- Real-time interactive quizzes during playback.
- Backend-driven AI track generation (MVP uses predefined tracks).
- Integration with external LMS (Learning Management Systems).

## Decisions

- **Architecture**: A React-based modular extension approach will be used for the UI prototype.
  - *Rationale*: Speed of development and high fidelity with Spotify's modern UI.
- **State Management**: Browser `localStorage` will be used to store active goals, streaks, and completion state.
  - *Rationale*: Eliminates backend dependency for the initial pilot phase.
- **Component Strategy**: Styled components using Tailwind CSS to match Spotify's aesthetic (rounded corners, specific grays/greens).

## Risks / Trade-offs

- **Risk**: User clears browser cache and loses progress.
  - *Mitigation*: Clearly inform users that progress is local for the MVP phase.
- **Risk**: Inconsistent playback control via the Web API.
  - *Mitigation*: Implement basic "Next" and "Previous" logic that wraps around the standard Spotify controls.

## Migration Plan
1. Scaffolding: Initialize the project folder.
2. Tokenization: Extract design tokens from Spotify screenshots.
3. Stitch: Build the high-fidelity UI in Stitch.
4. Build: Implement the logic and inject into the prototype environment.
