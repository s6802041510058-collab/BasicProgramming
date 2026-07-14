import React, { useState } from 'react';
import { CommandType } from '../types';
import {
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Trash2, RotateCcw, Play, Pause, PlayCircle, HelpCircle, X
} from 'lucide-react';

interface CommandPanelProps {
  commands: CommandType[];
  onAddCommand: (cmd: CommandType) => void;
  onRemoveLast: () => void;
  onClearAll: () => void;
  onExecute: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onGetHint: () => void;
  running: boolean;
  paused: boolean;
  currentStepIndex: number;
  onReorderCommands: (reordered: CommandType[]) => void;
  onRemoveSpecific: (index: number) => void;
  hintsUsed: number;
}

export default function CommandPanel({
  commands,
  onAddCommand,
  onRemoveLast,
  onClearAll,
  onExecute,
  onPause,
  onResume,
  onReset,
  onGetHint,
  running,
  paused,
  currentStepIndex,
  onReorderCommands,
  onRemoveSpecific,
  hintsUsed,
}: CommandPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Map of command configurations
  const commandConfig = {
    UP: { label: 'ขึ้น (A)', icon: <ArrowUp className="w-5 h-5" />, color: 'bg-indigo-500 hover:bg-indigo-600 border-indigo-600 hover:-translate-y-0.5 text-white', emoji: '⬆️' },
    DOWN: { label: 'ลง (B)', icon: <ArrowDown className="w-5 h-5" />, color: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 hover:-translate-y-0.5 text-white', emoji: '⬇️' },
    LEFT: { label: 'ซ้าย (C)', icon: <ArrowLeft className="w-5 h-5" />, color: 'bg-amber-500 hover:bg-amber-600 border-amber-600 hover:-translate-y-0.5 text-white', emoji: '⬅️' },
    RIGHT: { label: 'ขวา (D)', icon: <ArrowRight className="w-5 h-5" />, color: 'bg-pink-500 hover:bg-pink-600 border-pink-600 hover:-translate-y-0.5 text-white', emoji: '➡️' },
  };

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (running) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (running) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (running) return;
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...commands];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, removed);
    onReorderCommands(updated);
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg flex flex-col gap-6">
      {/* Step 1: Input Commands */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <span>1. เลือกคำสั่งทิศทาง</span>
            <span className="text-xs text-purple-600 font-normal normal-case">
              (คิวสูงสุด 30 คำสั่ง | ปัจจุบัน: {commands.length}/30)
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(commandConfig) as CommandType[]).map((cmd) => {
            const config = commandConfig[cmd];
            return (
              <button
                key={cmd}
                disabled={running || commands.length >= 30}
                onClick={() => onAddCommand(cmd)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-b-4 font-bold text-sm shadow-sm transition-all active:border-b-0 active:translate-y-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:border-b-4 disabled:active:translate-y-0 ${config.color}`}
              >
                {config.icon}
                <span>{config.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Sequence Queue & Edit */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <span>2. ลำดับคำสั่งที่วางแผนไว้</span>
            <span className="text-xs text-slate-400 font-normal">
              (คลิกค้างเพื่อลากสลับลำดับได้ ↕️)
            </span>
          </h4>

          {/* Quick queue operations */}
          <div className="flex items-center gap-2">
            <button
              disabled={running || commands.length === 0}
              onClick={onRemoveLast}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              title="ลบคำสั่งล่าสุดในคิว"
            >
              ลบคำสั่งล่าสุด
            </button>
            <span className="text-gray-300">|</span>
            <button
              disabled={running || commands.length === 0}
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              title="ล้างคำสั่งทั้งหมดในคิว"
            >
              ล้างทั้งหมด
            </button>
          </div>
        </div>

        {/* Display Command Queue */}
        <div
          id="command-queue-box"
          className="min-h-[100px] max-h-[220px] overflow-y-auto bg-purple-900/5 border border-purple-100/30 rounded-2xl p-3 flex flex-wrap gap-2.5 content-start shadow-inner"
        >
          {commands.length > 0 ? (
            commands.map((cmd, idx) => {
              const isActive = currentStepIndex === idx;
              const isPassed = currentStepIndex > idx;
              const config = commandConfig[cmd];

              // Base badge style
              let badgeStyle = 'bg-white/80 border-purple-200/50 text-gray-700';
              if (isActive) {
                badgeStyle = 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-400 font-bold text-yellow-900 scale-105 animate-pulse';
              } else if (isPassed) {
                badgeStyle = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
              }

              return (
                <div
                  key={`queue-item-${idx}`}
                  draggable={!running}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`relative flex items-center gap-1.5 py-1.5 pl-2.5 pr-2 rounded-2xl border text-xs shadow-sm transition-all ${
                    !running ? 'cursor-grab active:cursor-grabbing hover:shadow-md' : 'cursor-default'
                  } ${badgeStyle}`}
                  title={!running ? 'ลากเพื่อสลับลำดับคำสั่ง' : undefined}
                >
                  {/* Step order index */}
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-[10px] font-bold text-purple-800 shrink-0">
                    {idx + 1}
                  </span>

                  {/* Command Symbol */}
                  <span className="text-base shrink-0 select-none">{config.emoji}</span>

                  {/* Specific deletion button */}
                  {!running && (
                    <button
                      onClick={() => onRemoveSpecific(idx)}
                      className="text-gray-400 hover:text-rose-500 rounded-full p-0.5 hover:bg-gray-100 transition-colors"
                      title="ลบคำสั่งนี้"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center py-6 text-slate-400 text-center text-xs">
              <span>📭 ยังไม่ได้ใส่ชุดคำสั่ง</span>
              <p className="text-[10px] text-slate-400 mt-1">คลิกปุ่มด้านบนเพื่อเพิ่มคำสั่งลงในแผนการควบคุม</p>
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Run / Control Panel */}
      <div className="pt-2 border-t border-purple-100/40">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-2.5 col-span-2 sm:col-span-1">
            {/* If NOT running: show "เริ่มทำงาน" */}
            {!running ? (
              <button
                id="run-pipeline-btn"
                disabled={commands.length === 0}
                onClick={onExecute}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                title="เริ่มสั่งให้หุ่นยนต์เคลื่อนที่ตามคำสั่งในคิว"
              >
                <Play className="w-4 h-4 fill-current" />
                เริ่มทำงาน
              </button>
            ) : (
              <>
                {/* If running and NOT paused: show "หยุด" (Pause) */}
                {!paused ? (
                  <button
                    onClick={onPause}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                    title="หยุดหุ่นยนต์ชั่วคราว"
                  >
                    <Pause className="w-4 h-4" />
                    หยุดชั่วคราว
                  </button>
                ) : (
                  /* If running and paused: show "เล่นต่อ" (Resume) */
                  <button
                    onClick={onResume}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                    title="ให้หุ่นยนต์เดินหน้าต่อ"
                  >
                    <PlayCircle className="w-4 h-4" />
                    เล่นต่อ
                  </button>
                )}

                {/* Reset button always visible during execution */}
                <button
                  onClick={onReset}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                  title="หยุดและย้ายหุ่นยนต์กลับจุดเริ่มต้น"
                >
                  <RotateCcw className="w-4 h-4" />
                  เริ่มใหม่
                </button>
              </>
            )}

            {/* Reset button when not running (to reset board state/positions) */}
            {!running && (
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-2xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                title="ล้างแผนและคืนสถานะแผนที่"
              >
                <RotateCcw className="w-4 h-4" />
                ล้างสนาม
              </button>
            )}
          </div>

          {/* Hint button */}
          <button
            disabled={hintsUsed >= 2 || running}
            onClick={onGetHint}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-2xl border border-yellow-200 hover:-translate-y-0.5 shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="ขอรับแนวทางคำใบ้จากครูพี่เลี้ยง (ใช้ได้สูงสุด 2 ครั้ง, หัก 10 คะแนนต่อครั้ง)"
          >
            <HelpCircle className="w-4.5 h-4.5 text-yellow-700" />
            <span>ขอคำใบ้ ({2 - hintsUsed}/2)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
