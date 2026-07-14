export type MenuItem = 'home' | 'rules' | 'game' | 'results' | 'logout';

export interface PlayerRecord {
  FullName: string;
  Score: number;
  Steps: number;
  TrashCollected: number;
  HintUsed: number;
  MissionStatus: string;
  PerformanceLevel: string;
  CompletedAt: string;
}

export type CommandType = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coordinate {
  r: number; // Row index 0-7 (A-H)
  c: number; // Col index 0-7 (1-8)
}

export interface Obstacle {
  r: number;
  c: number;
  type: 'pond' | 'tree' | 'rock';
  emoji: string;
  name: string;
}

export interface Trash {
  r: number;
  c: number;
  id: string;
  emoji: string;
}
