import { Obstacle, Trash, PlayerRecord } from './types';

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const COLS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const START_POS = { r: 0, c: 0 }; // A1
export const BASE_POS = { r: 7, c: 0 };  // H1

export const OBSTACLES: Obstacle[] = [
  { r: 1, c: 2, type: 'pond', emoji: '💧', name: 'บ่อน้ำ (B3)' },
  { r: 1, c: 5, type: 'tree', emoji: '🌳', name: 'ต้นไม้ (B6)' },
  { r: 2, c: 1, type: 'rock', emoji: '🪨', name: 'ก้อนหิน (C2)' },
  { r: 3, c: 3, type: 'tree', emoji: '🌳', name: 'ต้นไม้ (D4)' },
  { r: 3, c: 6, type: 'rock', emoji: '🪨', name: 'ก้อนหิน (D7)' },
  { r: 4, c: 5, type: 'pond', emoji: '💧', name: 'บ่อน้ำ (E6)' },
  { r: 5, c: 2, type: 'rock', emoji: '🪨', name: 'ก้อนหิน (F3)' },
  { r: 5, c: 6, type: 'tree', emoji: '🌳', name: 'ต้นไม้ (F7)' }
];

export const TRASH_LIST: Trash[] = [
  { r: 0, c: 6, id: 'A7', emoji: '🗑️' },
  { r: 2, c: 4, id: 'C5', emoji: '🗑️' },
  { r: 4, c: 1, id: 'E2', emoji: '🗑️' },
  { r: 6, c: 4, id: 'G5', emoji: '🗑️' }
];

export const MOCK_LEADERBOARD: PlayerRecord[] = [
  {
    FullName: 'สมชาย รักดี',
    Score: 100,
    Steps: 23,
    TrashCollected: 4,
    HintUsed: 0,
    MissionStatus: 'สำเร็จ',
    PerformanceLevel: 'นักวางแผนยอดเยี่ยม',
    CompletedAt: '2026-07-13 14:20'
  },
  {
    FullName: 'ศิริพร วงศ์สว่าง',
    Score: 96,
    Steps: 25,
    TrashCollected: 4,
    HintUsed: 0,
    MissionStatus: 'สำเร็จ',
    PerformanceLevel: 'นักวางแผนดีมาก',
    CompletedAt: '2026-07-13 15:05'
  },
  {
    FullName: 'กิตติศักดิ์ ชัยภูมิ',
    Score: 86,
    Steps: 24,
    TrashCollected: 4,
    HintUsed: 1,
    MissionStatus: 'สำเร็จ',
    PerformanceLevel: 'นักวางแผนดีมาก',
    CompletedAt: '2026-07-13 16:15'
  },
  {
    FullName: 'ณัฐชา เก่งคิด',
    Score: 80,
    Steps: 27,
    TrashCollected: 4,
    HintUsed: 0,
    PerformanceLevel: 'นักวางแผนระดับดี',
    MissionStatus: 'สำเร็จ',
    CompletedAt: '2026-07-13 17:33'
  }
];

export const GAME_HINTS = [
  "💡 คำใบ้ที่ 1: แนะนำให้วางแผนเดินทางไปเก็บขยะที่ A7 (ขวาบนสุด) ก่อน เนื่องจากอยู่ใกล้แถวเริ่มต้นมากที่สุด จากนั้นจึงลัดเลาะลงมาทางซ้าย เพื่อหลีกเลี่ยงสิ่งกีดขวาง",
  "💡 คำใบ้ที่ 2: เส้นทางสู่รางวัลสูงสุด (23 ก้าว): เดินขวา 6 ช่องเพื่อเก็บขยะที่ A7 -> เดินลง 2, ซ้าย 2 เพื่อเก็บขยะที่ C5 -> เดินลง 4 เพื่อเก็บขยะที่ G5 -> เดินขึ้น 2, ซ้าย 3 เพื่อเก็บขยะที่ E2 -> เดินซ้าย 1, ลง 3 เพื่อกลับฐาน H1 อย่างปลอดภัย!"
];
