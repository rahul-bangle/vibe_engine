## ADDED Requirements

### Requirement: Goal Selection UI
The system SHALL provide a modal or dedicated view for users to select their learning goal (e.g., "Improve English", "Focus Training").

#### Scenario: User opens Journeys for the first time
- **WHEN** the user clicks the "Journeys" sidebar link and has no active goal
- **THEN** the onboarding modal SHALL be displayed showing at least 3 predefined goal options.

#### Scenario: User selects a goal
- **WHEN** the user clicks a goal card and confirms
- **THEN** the system SHALL save the goal to the user's profile and unlock the first day's Journey track.
