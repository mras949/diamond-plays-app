// Consolidated interfaces for the Diamond Plays app
// This file centralizes all TypeScript interfaces used across the application

// Backend model equivalents for frontend use
export interface Team {
  _id: string;
  name: string;
  abbreviation: string;
  city: string;
  teamName: string;
  league: 'AL' | 'NL';
  division: string;
  players: string[]; // Player IDs
  mlbId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Player {
  _id: string;
  name: string;
  position: string;
  team: string; // Team ID
  birthDate?: string;
  height?: string;
  weight?: number;
  bats: 'L' | 'R' | 'S';
  throws: 'L' | 'R';
  mlbId?: number;
  seasonAvg: number;
  seasonOps: number;
  seasonHomeRuns: number;
  seasonRbis: number;
  seasonStolenBases: number;
  seasonHits: number;
  seasonRuns: number;
  seasonAtBats: number;
  seasonCaughtStealing: number;
  seasonStrikeOuts: number;
  seasonTriples: number;
  seasonDoubles: number;
  seasonSingles: number;
  seasonErrors: number;
  seasonPoints: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Game {
  _id: string;
  season: string; // Season ID
  date: string;
  dateTime: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'delayed' | 'suspended';
  inningOrdinal?: string;
  inningState?: string;
  winner?: string; // Team ID
  delayReason?: string;
  suspensionPoint?: string;
  resumedDate?: string;
  gamePk: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GamePlayer {
  _id: string;
  game: string | Game; // Game ID or populated game object
  player: Player; // Populated player object
  team: string | Team; // Team ID or populated team object
  battingOrder: number;
  atBats: number;
  hits: number;
  runs: number;
  rbis: number;
  homeRuns: number;
  stolenBases: number;
  triples: number;
  doubles: number;
  singles: number;
  walks: number;
  strikeOuts: number;
  caughtStealing: number;
  errors: number;
  points: number;
  createdAt?: string;
  updatedAt?: string;
  // For backward compatibility with existing code
  name?: string;
  position?: string;
}

export interface UserSelectedPlayer {
  _id: string;
  user: string; // User ID
  gamePlayer: string; // GamePlayer ID
  game: string; // Game ID
  team: string; // Team ID
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Component-specific interfaces
export interface PlayerListProps {
  gameId: string;
  teamId: string;
  onSelectionChange?: (selection: Selection) => void;
}

export interface GameAccordionProps {
  game: Game;
  isExpanded: boolean;
  onToggleExpand: () => void;
  tabIndex: number;
  onTabChange: (index: number) => void;
}

export interface GameDetailsProps {
  status: string;
  awayScore: number;
  homeScore: number;
  date: string;
}

// Selection interface for player selections
export interface Selection {
  gameId: string;
  teamId: string;
  playerId: string;
  notes?: string;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface GamesResponse {
  games: Game[];
  total: number;
}

export interface PlayersResponse {
  players: GamePlayer[];
  total: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
