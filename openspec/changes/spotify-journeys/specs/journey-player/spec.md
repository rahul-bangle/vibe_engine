## ADDED Requirements

### Requirement: Journey Playlist Structure
A "Journey Track" SHALL consist of a sequence of content blocks: 
1. Intro Audio (Motivational/Contextual)
2. Music Track (Focus/Thematic)
3. Educational Podcast Clip (Skill-building)
4. Outro Audio (Progress update)

#### Scenario: User starts a Journey Day
- **WHEN** the user clicks "Start Day 1"
- **THEN** the system SHALL load the predefined sequence into the Spotify Web Player and begin playback from the first block.

#### Scenario: Track Completion
- **WHEN** a Journey Track reaches the end of the final block
- **THEN** the system SHALL mark that specific day as "Completed" in the progress tracker.
