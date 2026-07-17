import React from 'react';
import { Coordinate, Obstacle, Trash } from '../types';
import { ROWS, COLS, OBSTACLES } from '../data';

interface GameBoardProps {
  robotPos: Coordinate;
  remainingTrash: string[]; // Set of trash coordinates, e.g. ["0,6", "2,4"]
  allTrash: Trash[];
  basePos: Coordinate;
}

export default function GameBoard({ robotPos, remainingTrash, allTrash, basePos }: GameBoardProps) {
  // Check if cell is an obstacle
  const getObstacle = (r: number, c: number): Obstacle | undefined => {
    return OBSTACLES.find((o) => o.r === r && o.c === c);
  };

  // Check if cell is a trash
  const getTrash = (r: number, c: number): Trash | undefined => {
    const trash = allTrash.find((t) => t.r === r && t.c === c);
    if (trash && remainingTrash.includes(`${r},${c}`)) {
      return trash;
    }
    return undefined;
  };

  // Check if cell is the base
  const isBase = (r: number, c: number): boolean => {
    return basePos.r === r && basePos.c === c;
  };

  // Check if cell has the robot
  const isRobot = (r: number, c: number): boolean => {
    return robotPos.r === r && robotPos.c === c;
  };

  return (
    <div id="game-board-container" className="bg-white/60 backdrop-blur-md border border-white/50 p-4 sm:p-6 rounded-3xl shadow-lg flex flex-col items-center">
      {/* Board Title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">แผนผังเมืองและพิกัดหุ่นยนต์ (8 × 8 Grid)</h3>
        <p className="text-xs text-slate-500">นำทางหุ่นยนต์จากจุดเริ่มต้น (A1) สู่จุดเก็บขยะและกลับฐาน (H1)</p>
      </div>

      {/* Grid container with 9 columns */}
      <div className="grid grid-cols-9 gap-1 max-w-full overflow-auto bg-purple-900/5 p-3 rounded-2xl border border-purple-100/30 shadow-inner">
        {/* Header Cell (0,0) */}
        <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center font-bold text-purple-600 bg-purple-100/30 rounded-xl text-xs md:text-sm select-none shadow-inner">
          🧭
        </div>

        {/* Column Headers (1 to 8) */}
        {COLS.map((col, idx) => (
          <div
            key={`col-header-${idx}`}
            className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center font-bold text-purple-700 bg-purple-100/40 rounded-xl text-xs md:text-sm select-none"
          >
            {col}
          </div>
        ))}

        {/* Rows of the board */}
        {ROWS.map((rowName, rowIdx) => (
          <React.Fragment key={`row-frag-${rowIdx}`}>
            {/* Row Header (A to H) */}
            <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center font-bold text-purple-700 bg-purple-100/40 rounded-xl text-xs md:text-sm select-none">
              {rowName}
            </div>

            {/* Board Cells (1 to 8) */}
            {Array.from({ length: 8 }).map((_, colIdx) => {
              const obstacle = getObstacle(rowIdx, colIdx);
              const trash = getTrash(rowIdx, colIdx);
              const base = isBase(rowIdx, colIdx);
              const robot = isRobot(rowIdx, colIdx);

              // Background state classes
              let cellBg = 'bg-white/90 hover:bg-purple-50/50';
              let cellBorder = 'border-purple-100/40';

              if (robot) {
                cellBg = 'bg-yellow-100/90 ring-4 ring-yellow-400 ring-offset-2 ring-offset-purple-50/50 shadow-md animate-pulse';
                cellBorder = 'border-yellow-300';
              } else if (base) {
                cellBg = 'bg-indigo-50 hover:bg-indigo-100/80';
                cellBorder = 'border-indigo-200 border-dashed border-2';
              } else if (obstacle) {
                if (obstacle.type === 'pond') cellBg = 'bg-blue-50/80';
                if (obstacle.type === 'tree') cellBg = 'bg-emerald-50/80';
                if (obstacle.type === 'rock') cellBg = 'bg-stone-50/80';
                cellBorder = 'border-slate-200/50';
              } else if (trash) {
                cellBg = 'bg-amber-50/60 hover:bg-amber-100/50';
                cellBorder = 'border-amber-200/60';
              }

              return (
                <div
                  id={`cell-${rowName}${colIdx + 1}`}
                  key={`cell-${rowIdx}-${colIdx}`}
                  className={`relative w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center border rounded-xl transition-all duration-200 select-none ${cellBg} ${cellBorder}`}
                  title={`พิกัด ${rowName}${colIdx + 1}`}
                >
                  {/* Grid cell background label (very faint) */}
                  <span className="absolute bottom-0.5 right-0.5 text-[7px] sm:text-[9px] text-slate-400/60 font-mono pointer-events-none">
                    {rowName}{colIdx + 1}
                  </span>

                  {/* Rendering Priority: Robot -> Trash -> Obstacle -> Base -> Empty */}
                  {robot ? (
                    <span className="text-xl sm:text-2xl md:text-3xl transform transition-transform duration-150 scale-110 drop-shadow-md select-none animate-[bounce_1.5s_infinite]">
                      🤖
                    </span>
                  ) : trash ? (
                    <span className="text-xl sm:text-2xl md:text-3xl select-none drop-shadow-sm transform hover:scale-110 transition-transform">
                      {trash.emoji}
                    </span>
                  ) : obstacle ? (
                    <span className="text-xl sm:text-2xl md:text-3xl select-none drop-shadow-sm filter saturate-90 hover:saturate-100 transition-all">
                      {obstacle.emoji}
                    </span>
                  ) : base ? (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xl sm:text-2xl md:text-3xl select-none drop-shadow-sm">🏠</span>
                      <span className="text-[7px] sm:text-[9px] text-indigo-700 font-bold bg-indigo-100 px-1 rounded -mt-1 sm:mt-0 select-none">
                        ฐาน
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Grid Color Legends */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
          <span>หุ่นยนต์ (🤖)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 bg-amber-50 border border-amber-200 rounded" />
          <span>ขยะ (🗑️)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 bg-indigo-50 border border-indigo-200 border-dashed rounded" />
          <span>ฐาน (🏠)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 bg-emerald-50 border border-gray-200 rounded" />
          <span>ป่าไม้ (🌳)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 bg-blue-50 border border-gray-200 rounded" />
          <span>บ่อน้ำ (💧)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 bg-stone-50 border border-gray-200 rounded" />
          <span>ก้อนหิน (⛰️)</span>
        </div>
      </div>
    </div>
  );
}
