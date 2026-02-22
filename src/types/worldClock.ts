export interface WorldClock {
  id: string;
  timezone: string;    // IANA timezone (e.g., 'America/New_York')
  label: string;       // Display name (e.g., 'New York')
}
