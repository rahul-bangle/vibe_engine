## Why

Young professionals in India (18–30) frequently use Spotify but primarily for passive listening. While they have a strong desire for personal growth and skill building (e.g., English vocabulary, focus habits), they currently have to leave Spotify for apps like Duolingo or YouTube to find structured learning. "Spotify Journeys" bridge this gap by integrating structured, goal-oriented audio experiences directly into their existing daily habits.

## What Changes

We are introducing a new "Journeys" feature to the Spotify Web Player. This includes:
- A new Entry Point in the main navigation sidebar.
- An Onboarding Flow for goal selection.
- "Journey Tracks": Dedicated playlists that interleave music with educational podcast content.
- A Progress Dashboard to track completion percentages and daily streaks.
- A Nudge System to provide motivational feedback based on activity.

## Capabilities

## New Capabilities
- `journey-onboarding`: Selection interface for learning goals (e.g., "Improve English", "Focus Training").
- `journey-player`: A specialized playlist view that handles the structured mix of music and podcasts.
- `journey-tracker`: A data layer and UI component for monitoring user progress, streaks, and completion.
- `journey-nudges`: UI triggers for motivational messages and behavioral reminders.

## Modified Capabilities
- `sidebar-navigation`: Addition of the "Journeys" link to the existing navigation system.

## Impact

This feature adds new UI components to the sidebar and main view. It requires tracking user-specific "Journey" state (selected goal, progress). It leverages existing Spotify Playback mechanisms but adds a layer of structure.
