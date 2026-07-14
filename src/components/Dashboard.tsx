import React from 'react';
import { Play, BookOpen, Trophy, Compass, HelpCircle, AlertCircle } from 'lucide-react';

interface DashboardProps {
  playerName: string;
  onNavigate: (tab: 'home' | 'rules' | 'game' | 'results' | 'logout') => void;
  onScrollToLeaderboard: () => void;
}

export default function Dashboard({ playerName, onNavigate, onScrollToLeaderboard }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Card with Animation Effect */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white rounded-3xl shadow-xl p-8 md:p-10">
        {/* Light overlay glow effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_4s_infinite]" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Basic Programming ม.5
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 tracking-tight">
            ยินดีต้อนรับ, <span className="text-yellow-200">{playerName}</span> 🤖✨
          </h2>
          <p className="text-base md:text-lg text-purple-50 mt-3 leading-relaxed">
            มาร่วมเป็นส่วนหนึ่งของกิจกรรมการเรียนรู้ <strong className="text-white font-semibold">"หุ่นยนต์เก็บขยะ"</strong> ร่วมฝึกทักษะการคิดเชิงคำนวณ การวางแผนลำดับขั้นตอน และการแก้ปัญหาอย่างเป็นระบบผ่านเกมควบคุมหุ่นยนต์สุดสนุก!
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              id="start-game-btn"
              onClick={() => onNavigate('game')}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-bold rounded-2xl shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              เริ่มเล่นเกมเลย!
            </button>
            <button
              id="read-rules-btn"
              onClick={() => onNavigate('rules')}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-2xl border border-white/30 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              ศึกษากติกาเกม
            </button>
          </div>
        </div>

        {/* Big floaty background emoji representing a happy robot */}
        <div className="absolute right-6 bottom-4 md:right-12 md:bottom-2 text-[100px] md:text-[140px] opacity-20 pointer-events-none select-none animate-bounce" style={{ animationDuration: '3s' }}>
          🤖
        </div>
      </div>

      {/* Overview of Learning Objective and Mission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg flex items-start gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-base">ภารกิจรักษ์โลก</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              พาหุ่นยนต์อัจฉริยะเดินทางเก็บขยะเป้าหมายให้ครบ <strong className="text-emerald-600">4 จุด</strong> ในแผนที่ แล้วนำทางกลับสู่ <strong className="text-indigo-600">ฐานทัพ (H1)</strong> อย่างปลอดภัย
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg flex items-start gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-base">เงื่อนไขและสิ่งกีดขวาง</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              หลีกเลี่ยงอุปสรรคต่าง ๆ เช่น บ่อน้ำ 💧 ต้นไม้ 🌳 และก้อนหิน 🪨 ห้ามเดินออกนอกขอบตาราง และใช้คำสั่งสูงสุดไม่เกิน <strong className="text-red-500 font-semibold">30 คำสั่ง</strong>
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg flex items-start gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-base">ดัชนีวัดความสามารถ</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ผู้ที่ใช้จำนวนก้าวน้อยที่สุดและปลอดภัยที่สุด (ไม่เกิน <strong className="text-purple-600">23 ก้าว</strong>) จะได้รับยศ <strong className="text-purple-600 font-semibold">"นักวางแผนยอดเยี่ยม"</strong> ประดับในทำเนียบเกียรติยศ!
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          id="nav-card-game"
          onClick={() => onNavigate('game')}
          className="group relative cursor-pointer overflow-hidden bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Play className="w-6 h-6" />
            </div>
            <span className="text-3xl">🤖</span>
          </div>
          <h4 className="text-lg font-bold text-gray-800">เข้าสู่ห้องควบคุมหุ่นยนต์</h4>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            เริ่มต้นควบคุมหุ่นยนต์ด้วยชุดคำสั่ง ขึ้น, ลง, ซ้าย, ขวา เพื่อทำภารกิจและท้าทายตนเอง
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            เริ่มภารกิจด่วนที่สุด &rarr;
          </div>
        </div>

        <div
          id="nav-card-rules"
          onClick={() => onNavigate('rules')}
          className="group relative cursor-pointer overflow-hidden bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-3xl">📖</span>
          </div>
          <h4 className="text-lg font-bold text-gray-800">ทบทวนกติกาการจัดลำดับ</h4>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            เข้าใจพฤติกรรม สัญลักษณ์ แผนผังพิกัดของเมือง ตลอดจนเงื่อนไขคะแนนเพื่อผลลัพธ์ที่ดีที่สุด
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
            อ่านกติกาโดยละเอียด &rarr;
          </div>
        </div>

        <div
          id="nav-card-scores"
          onClick={onScrollToLeaderboard}
          className="group relative cursor-pointer overflow-hidden bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-3xl">👑</span>
          </div>
          <h4 className="text-lg font-bold text-gray-800">วิเคราะห์อันดับปัจจุบัน</h4>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            เปรียบเทียบแนวทางและสถิติกับเพื่อน ๆ เพื่อค้นหาลำดับการเคลื่อนที่ที่ประหยัดพลังงานที่สุด
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
            เปิดดูอันดับทำเนียบสถิติ &rarr;
          </div>
        </div>
      </div>
    </div>
  );
}
