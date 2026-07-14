import React from 'react';
import { MenuItem } from '../types';
import {
  Home, BookOpen, Gamepad2, Award, LogOut, Menu, X, Trash2, ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  activeTab: MenuItem;
  onTabChange: (tab: MenuItem) => void;
  onLogout: () => void;
  onResetAllData: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  playerName: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  onResetAllData,
  isOpen,
  setIsOpen,
  playerName
}: SidebarProps) {
  const menuItems = [
    { id: 'home' as MenuItem, label: 'หน้าหลัก', icon: <Home className="w-5 h-5" />, desc: 'หน้าต้อนรับและภาพรวมภารกิจ' },
    { id: 'rules' as MenuItem, label: 'กติกาเกม', icon: <BookOpen className="w-5 h-5" />, desc: 'กฎระเบียบและสัญลักษณ์บอร์ด' },
    { id: 'game' as MenuItem, label: 'เกมหุ่นยนต์เก็บขยะ', icon: <Gamepad2 className="w-5 h-5" />, desc: 'ห้องทดลองควบคุมหุ่นยนต์' },
    { id: 'results' as MenuItem, label: 'ผลการเล่น', icon: <Award className="w-5 h-5" />, desc: 'สรุปผลลัพธ์และคะแนนล่าสุด' },
  ];

  return (
    <>
      {/* Mobile Hamburger Header (Visible only on mobile screen widths) */}
      <div className="md:hidden w-full bg-white/80 backdrop-blur-md border-b border-purple-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-[spin_10s_infinite]">🤖</span>
          <div>
            <h1 className="text-sm font-bold text-gray-800">บทเรียนออนไลน์</h1>
            <p className="text-[10px] text-purple-600 font-bold">หุ่นยนต์เก็บขยะ ม.5</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-100 transition-colors"
          title="สลับการแสดงผลเมนู"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile menu drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-purple-950/20 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Main Sidebar Drawer Container */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white/40 backdrop-blur-xl border-r border-white/40 shadow-lg p-5 flex flex-col justify-between transition-transform duration-300 z-50 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          {/* Brand Identity / Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-purple-100/60 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-indigo-500 text-white rounded-2xl shadow-md flex items-center justify-center select-none animate-[bounce_3s_infinite]">
              <span className="text-2xl font-bold">🤖</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-800 tracking-tight">บทเรียนออนไลน์</h2>
              <p className="text-xs text-purple-600 font-semibold leading-none mt-1">มัธยมศึกษาปีที่ 5</p>
            </div>
          </div>

          {/* User info inside Sidebar (quick glance) */}
          <div className="bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm mb-6">
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">ผู้ลุยภารกิจปัจจุบัน</span>
            <span className="text-sm font-bold text-purple-950 truncate block mt-0.5" title={playerName}>
              {playerName || 'ยังไม่ได้เข้าสู่ระบบ'}
            </span>
          </div>

          {/* Main Navigation Tab List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 transform hover:-translate-y-0.5 group cursor-pointer
                    ${isActive
                      ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-200'
                      : 'text-slate-600 hover:bg-white/50'
                    }
                  `}
                >
                  <div className={`transition-transform duration-300 group-hover:scale-110
                    ${isActive ? 'text-yellow-300' : 'text-slate-400 group-hover:text-purple-600'}
                  `}>
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-sm block">{item.label}</span>
                    <span className={`text-[9px] font-normal block mt-0.5
                      ${isActive ? 'text-purple-100' : 'text-slate-400'}
                    `}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar Actions (Logout & Total Reset) */}
        <div className="space-y-2 pt-6 border-t border-purple-100/60">
          {/* Logout Menu */}
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-left text-rose-600 hover:bg-rose-50 hover:border-rose-100 border border-transparent transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">ออกจากระบบ</span>
          </button>

          {/* Reset All Data (for testing / clear browser cache) */}
          <button
            onClick={() => {
              onResetAllData();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-left text-gray-400 hover:bg-white/40 hover:text-gray-600 hover:border-gray-100 border border-transparent transition-all duration-200 text-xs cursor-pointer"
            title="ล้างข้อมูลทั้งหมดในเครื่องใหม่ (สำหรับการเริ่มใหม่ตั้งแต่ต้น)"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>เริ่มใหม่ทั้งหมด</span>
          </button>
        </div>
      </div>
    </>
  );
}
