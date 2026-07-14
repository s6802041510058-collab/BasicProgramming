import React from 'react';
import { PlayerRecord } from '../types';
import { Award, Trophy, RotateCcw, Home, CloudLightning, Calendar, Eye, HelpCircle, Footprints, Trash2 } from 'lucide-react';

interface ResultsPanelProps {
  lastResult: PlayerRecord;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onManualSave: () => void;
  isSaving: boolean;
}

export default function ResultsPanel({
  lastResult,
  onPlayAgain,
  onGoHome,
  onManualSave,
  isSaving
}: ResultsPanelProps) {
  const { FullName, Score, Steps, TrashCollected, HintUsed, MissionStatus, PerformanceLevel, CompletedAt } = lastResult;

  // Decide encouraging feedback message
  let feedbackMessage = '';
  let feedbackColor = '';
  if (Score >= 80) {
    feedbackMessage = 'ยอดเยี่ยมมาก! คุณวางแผนเลือกเส้นทางคดเคี้ยวได้อย่างสมบูรณ์แบบ หลบสิ่งกีดขวางได้อย่างชาญฉลาด!';
    feedbackColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  } else if (Score >= 50) {
    feedbackMessage = 'เก่งมาก! วางแผนสำเร็จลุล่วงด้วยดี ลองพยายามปรับลดขั้นตอนหรือหลีกเลี่ยงการใช้คำใบ้เพื่อคะแนนที่สูงขึ้นนะ';
    feedbackColor = 'text-teal-700 bg-teal-50 border-teal-200';
  } else {
    feedbackMessage = 'ไม่เป็นไรนะ! การเรียนรู้เกิดจากการทดลองและปรับปรุง ลองกดเล่นใหม่อีกครั้งเพื่อค้นหาเส้นทางที่ดีกว่าเดิมกันเถอะ!';
    feedbackColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  return (
    <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl shadow-xl p-8 relative overflow-hidden transition-all duration-300">
      {/* Visual background celebration decorations */}
      <div className="absolute -right-12 -top-12 text-9xl text-yellow-300/15 select-none pointer-events-none animate-spin" style={{ animationDuration: '15s' }}>
        👑
      </div>

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-extrabold px-3 py-1 rounded-full border border-yellow-200">
          <Trophy className="w-3.5 h-3.5 fill-current" />
          สรุปผลการประเมินการเรียนรู้
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mt-3">
          ผลงานระดับกิตติมศักดิ์ของ <span className="text-purple-600 font-bold">{FullName}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          ทำเสร็จสิ้น ณ วันที่: {CompletedAt}
        </p>
      </div>

      {/* Main stats layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Score Ring */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-2">คะแนนที่ได้</span>
          <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-inner border border-purple-100">
            <span className="text-3xl font-black text-purple-600">{Score}</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-2">จากคะแนนเต็ม 100</span>
        </div>

        {/* Steps Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Footprints className="w-4 h-4 text-emerald-600" />
            จำนวนก้าวเดิน
          </span>
          <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-inner border border-emerald-100">
            <span className="text-3xl font-black text-emerald-600">{Steps}</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-2">เกณฑ์ดีเยี่ยม: ≤23 ก้าว</span>
        </div>

        {/* Trash Collected */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Trash2 className="w-4 h-4 text-amber-600" />
            เก็บขยะสำเร็จ
          </span>
          <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-inner border border-amber-100">
            <span className="text-3xl font-black text-amber-600">{TrashCollected}/4</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-2">พิกัดขยะเป้าหมายครบถ้วน</span>
        </div>

        {/* Hints used */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-5 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs text-pink-700 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle className="w-4.5 h-4.5 text-pink-600" />
            ใช้คำใบ้
          </span>
          <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-inner border border-pink-100">
            <span className="text-3xl font-black text-pink-600">{HintUsed}/2</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-2">หัก 10 คะแนนต่อการขอคำใบ้</span>
        </div>
      </div>

      {/* Evaluation & Feedback Block */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/80 border border-purple-100/50 rounded-2xl shadow-sm gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">ระดับความสามารถในการวางแผน</h4>
              <p className="text-[10px] text-gray-400">ประเมินอ้างอิงตามทักษะวิทยาการคำนวณ</p>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-xs font-extrabold border border-purple-500 shadow-sm">
            {PerformanceLevel}
          </span>
        </div>

        {/* Mission status info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/80 border border-purple-100/50 rounded-2xl shadow-sm gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">สถานะภารกิจรักษ์โลก</h4>
              <p className="text-[10px] text-gray-400">ความปลอดภัยและการเก็บกู้เป้าหมาย</p>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm
            ${MissionStatus === 'สำเร็จ' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500'}
          `}>
            {MissionStatus}
          </span>
        </div>

        {/* Coaching dynamic box */}
        <div className={`p-4 rounded-2xl border text-sm font-semibold leading-relaxed ${feedbackColor}`}>
          {feedbackMessage}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          เล่นเกมใหม่อีกครั้ง
        </button>

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-2xl shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          กลับสู่หน้าต้อนรับ
        </button>

        <button
          disabled={isSaving}
          onClick={onManualSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-100 hover:bg-yellow-200 text-amber-800 font-extrabold rounded-2xl border border-yellow-200 hover:-translate-y-0.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          title="หากข้อมูลไม่ขึ้นในตาราง สามารถสั่งบันทึกซ้ำเข้าสู่ Google Sheets ได้อีกครั้ง"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-amber-700" />
              <span>ส่งผลการเล่นใหม่</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
