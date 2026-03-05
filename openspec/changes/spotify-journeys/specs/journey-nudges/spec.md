## ADDED Requirements

### Requirement: Motivational Nudges
The system SHALL intermittently display motivational overlays or banners based on user performance.

#### Scenario: High Performance Nudge
- **WHEN** a user completes a 3-day streak
- **THEN** the system SHALL display a "Keep it up!" motivational toast notification.

#### Scenario: Inactivity Reminder
- **WHEN** the user has not completed a track for 24 hours
- **THEN** the system SHALL display a subtle reminder in the "Journeys" sidebar section: "Ready for Day X?".
