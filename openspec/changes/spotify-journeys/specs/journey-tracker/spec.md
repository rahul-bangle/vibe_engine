## ADDED Requirements

### Requirement: Progress Dashboard
The system SHALL display a visual summary of the user's Journey progress.

#### Scenario: View Progress
- **WHEN** the user navigates to the "Journeys" main section
- **THEN** the system SHALL display:
  - Total Completion % (calculated as completed days / total journey days).
  - Current Daily Streak (number of consecutive days with at least 1 track completed).
  - A calendar heat-map showing active days.

### Requirement: Streak Persistence
The system SHALL persist the streak count across sessions.
