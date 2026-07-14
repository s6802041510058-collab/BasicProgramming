import React, { useState } from 'react';
import { PlayerRecord } from '../types';
import { Award, Search, Users, Trophy } from 'lucide-react';

interface LeaderboardProps {
  players: PlayerRecord[];
  isLoading: boolean;
}

export default function Leaderboard({ players, isLoading }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort players: Score desc, then Steps asc
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.Score !== a.Score) {
      return b.Score - a.Score;
    }
    return a.Steps - b.Steps;
  });

  // Filter players based on search term
  const filteredPlayers = sortedPlayers.filter((player) =>
    player.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="leaderboard-card" className="w-full bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">ทำเนียบผู้พิทักษ์โลก (Leaderboard)</h3>
            <p className="text-xs text-slate-500">รวมรายชื่อผู้เล่นที่วางแผนเก็บขยะได้ยอดเยี่ยมที่สุด</p>
          </div>
        </div>
        
        {/* Real-time search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            id="search-input"
            type="text"
            placeholder="ค้นหารายชื่อผู้เล่น..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white/80 border border-purple-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-purple-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-100/50 text-purple-900 text-xs sm:text-sm font-semibold border-b border-purple-100">
              <th className="py-3 px-4 text-center">อันดับ</th>
              <th className="py-3 px-4">ชื่อ-นามสกุล</th>
              <th className="py-3 px-4 text-center">คะแนน</th>
              <th className="py-3 px-4 text-center">จำนวนก้าว</th>
              <th className="py-3 px-4">ระดับประเมิน</th>
              <th className="py-3 px-4 text-right">เวลาที่ทำสำเร็จ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b border-purple-50 animate-pulse">
                  <td className="py-4 px-4 text-center">
                    <div className="h-5 w-5 bg-purple-200 rounded-full mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-32 bg-purple-200 rounded" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-5 w-10 bg-purple-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-5 w-10 bg-purple-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-purple-200 rounded" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 w-24 bg-purple-200 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredPlayers.length > 0 ? (
              filteredPlayers.map((player, index) => {
                // Style for Top 3
                let medalBg = 'text-gray-500';
                let rowBg = 'hover:bg-purple-50/30 transition-colors';
                let medalEmoji = '';

                if (index === 0) {
                  medalBg = 'bg-amber-100 text-amber-700 font-bold border border-amber-200';
                  rowBg = 'bg-amber-50/20 hover:bg-amber-50/40 transition-colors';
                  medalEmoji = '🥇';
                } else if (index === 1) {
                  medalBg = 'bg-slate-100 text-slate-700 font-bold border border-slate-200';
                  rowBg = 'bg-slate-50/10 hover:bg-slate-50/30 transition-colors';
                  medalEmoji = '🥈';
                } else if (index === 2) {
                  medalBg = 'bg-orange-100 text-orange-700 font-bold border border-orange-200';
                  rowBg = 'bg-orange-50/10 hover:bg-orange-50/30 transition-colors';
                  medalEmoji = '🥉';
                }

                return (
                  <tr key={index} className={`border-b border-purple-50 ${rowBg}`}>
                    <td className="py-3 px-4 text-center">
                      {medalEmoji ? (
                        <span className="text-xl" title={`อันดับที่ ${index + 1}`}>{medalEmoji}</span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-50 text-xs font-semibold text-purple-700">
                          {index + 1}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {player.FullName}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">
                      {player.Score} คะแนน
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-mono">
                      {player.Steps} ก้าว
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${player.PerformanceLevel === 'นักวางแผนยอดเยี่ยม' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                          player.PerformanceLevel === 'นักวางแผนดีมาก' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                          player.PerformanceLevel === 'นักวางแผนระดับดี' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }
                      `}>
                        <Award className="w-3.5 h-3.5" />
                        {player.PerformanceLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500 font-mono">
                      {player.CompletedAt}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-slate-300" />
                    <span>ยังไม่มีข้อมูลผู้เล่นตามเงื่อนไขที่ค้นหา</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
