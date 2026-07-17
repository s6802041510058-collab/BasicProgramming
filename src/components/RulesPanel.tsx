import React from 'react';
import { BookOpen, CheckCircle, ShieldAlert, Award, Grid3X3, HelpCircle } from 'lucide-react';

export default function RulesPanel() {
  const rules = [
    { text: 'หุ่นยนต์เดินได้ครั้งละ 1 ช่อง ตามลำดับที่วางแผนไว้', icon: CheckCircle, color: 'text-emerald-500' },
    { text: 'เดินได้ 4 ทิศทางอิสระ คือ ขึ้น ลง ซ้าย ขวา', icon: CheckCircle, color: 'text-emerald-500' },
    { text: 'ห้ามเดินผ่านสิ่งกีดขวาง หากพยายามชน เกมจะแจ้งอุบัติเหตุทันที', icon: ShieldAlert, color: 'text-rose-500' },
    { text: 'ต้องนำทางหุ่นยนต์ไปเก็บขยะให้ครบทั้ง 4 จุดในแผนที่', icon: CheckCircle, color: 'text-emerald-500' },
    { text: 'เมื่อเก็บขยะครบทั้ง 4 จุดแล้ว จึงจะสามารถเคลื่อนเข้าสู่ฐานปลายทางได้', icon: CheckCircle, color: 'text-emerald-500' },
    { text: 'ห้ามเดินออกนอกขอบเขตตารางขนาด 8 × 8 ช่อง', icon: ShieldAlert, color: 'text-rose-500' },
    { text: 'พยายามใช้จำนวนก้าวให้น้อยที่สุดเพื่อประหยัดพลังงานหุ่นยนต์', icon: Award, color: 'text-amber-500' },
    { text: 'จำกัดจำนวนช่องใส่คำสั่งในคิวสูงสุด 30 คำสั่งเท่านั้น', icon: ShieldAlert, color: 'text-rose-500' },
    { text: 'สามารถกดใช้คำใบ้ได้ไม่เกิน 2 ครั้ง โดยจะมีการตัดทอนคะแนนสะสม', icon: HelpCircle, color: 'text-blue-500' },
    { text: 'หากหุ่นยนต์เดินชนสิ่งกีดขวาง การทำงานของโปรแกรมจะสิ้นสุดทันที', icon: ShieldAlert, color: 'text-rose-500' },
  ];

  const symbols = [
    { char: '🤖', name: 'หุ่นยนต์ (Robot)', desc: 'หุ่นยนต์เก็บขยะอัจฉริยะ เริ่มต้นที่พิกัด A1' },
    { char: '🏠', name: 'ฐานปลายทาง (Base)', desc: 'จุดหมายปลายทางพิกัด H1 ต้องกลับมาที่นี่เมื่อภารกิจสำเร็จ' },
    { char: '🗑️', name: 'จุดเก็บขยะ (Trash Point)', desc: 'ขยะเป้าหมายจำนวน 4 จุด อยู่ที่พิกัด A7, C5, E2, G5' },
    { char: '🌳', name: 'ต้นไม้ (Tree Obstacle)', desc: 'สิ่งกีดขวางธรรมชาติ อยู่ที่พิกัด B6, D4, F7' },
    { char: '⛰️', name: 'ก้อนหิน (Rock Obstacle)', desc: 'สิ่งกีดขวางธรรมชาติ อยู่ที่พิกัด C2, D7, F3' },
    { char: '💧', name: 'บ่อน้ำ (Pond Obstacle)', desc: 'แหล่งน้ำห้ามผ่าน อยู่ที่พิกัด B3, E6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Rules list */}
      <div className="lg:col-span-7 bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-100 text-purple-600 rounded-2xl">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">กฎกติกาการควบคุมหุ่นยนต์</h3>
            <p className="text-xs text-slate-500">กรุณาศึกษากติกาและเงื่อนไขเพื่อการวางแผนที่สมบูรณ์แบบ</p>
          </div>
        </div>

        <div className="space-y-4">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className="flex items-start gap-3 bg-purple-50/20 p-3 rounded-2xl border border-purple-100/30 hover:bg-white/40 transition-colors">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${rule.color}`} />
                <span className="text-sm text-slate-700 font-medium">
                  {idx + 1}. {rule.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symbols legend */}
      <div className="lg:col-span-5 bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl">
              <Grid3X3 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">คำอธิบายสัญลักษณ์ (Symbols Legend)</h3>
              <p className="text-xs text-slate-500">ความหมายขององค์ประกอบแต่ละจุดบนบอร์ดแผนที่</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {symbols.map((sym, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/60 p-3 rounded-2xl border border-blue-100 hover:shadow-sm transition-shadow">
                <div className="text-3xl p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shrink-0 select-none">
                  {sym.char}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{sym.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{sym.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-2xl border border-purple-200">
          <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">เคล็ดลับการจัดก้าว</h4>
          <p className="text-xs text-purple-900 mt-1 leading-relaxed">
            ลำดับคำสั่งที่ยอดเยี่ยมจะต้องคำนึงถึงระยะทางรวม ควรวางแผนเดินวนเป็นวงกลมรอบแผนที่แทนการเดินย้อนกลับไปกลับมา!
          </p>
        </div>
      </div>
    </div>
  );
}
