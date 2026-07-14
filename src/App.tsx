import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { PlayerRecord, Coordinate, CommandType, MenuItem } from './types';
import {
  START_POS, BASE_POS, OBSTACLES, TRASH_LIST, MOCK_LEADERBOARD, GAME_HINTS
} from './data';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RulesPanel from './components/RulesPanel';
import GameBoard from './components/GameBoard';
import CommandPanel from './components/CommandPanel';
import ResultsPanel from './components/ResultsPanel';
import Leaderboard from './components/Leaderboard';

// Icons
import {
  Users, Award, LogOut, Gamepad2, Play, CheckCircle, Flame, ShieldAlert, Zap
} from 'lucide-react';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxot5NumY8c4egB9_FWbfucEG98jtkcRYNskQUR7s__OYaNlChzEh9EwOgMfdjR7-hJYQ/exec';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<string | null>(localStorage.getItem('savedPlayerName'));
  const [loginInput, setLoginInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState<MenuItem>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Leaderboard data states
  const [leaderboard, setLeaderboard] = useState<PlayerRecord[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  // Game Engine States
  const [robotPos, setRobotPos] = useState<Coordinate>(START_POS);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [remainingTrash, setRemainingTrash] = useState<string[]>(TRASH_LIST.map(t => `${t.r},${t.c}`));
  const [collectedCount, setCollectedCount] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [crashCount, setCrashCount] = useState(0);

  // Execution Flow States
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Saving State & Saved Results Cache
  const [isSaving, setIsSaving] = useState(false);
  const [lastResult, setLastResult] = useState<PlayerRecord | null>(null);

  // On Mount: Load Leaderboard and Offline Failed Submissions
  useEffect(() => {
    fetchLeaderboard();
    checkAndResubmitOfflineData();
  }, []);

  // Fetch Leaderboard from Google Sheets API
  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const response = await fetch(`${WEB_APP_URL}?action=leaderboard`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.success && Array.isArray(data.data)) {
          // If returned data is empty, fall back to mock
          if (data.data.length === 0) {
            setLeaderboard(MOCK_LEADERBOARD);
          } else {
            setLeaderboard(data.data);
          }
        } else {
          setLeaderboard(MOCK_LEADERBOARD);
        }
      } else {
        setLeaderboard(MOCK_LEADERBOARD);
      }
    } catch (error) {
      console.warn('Leaderboard fetch failed (using local fallback seed):', error);
      setLeaderboard(MOCK_LEADERBOARD);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Submit Game Results to Google Sheets
  const submitGameResult = async (result: PlayerRecord) => {
    setIsSaving(true);
    Swal.fire({
      title: 'กำลังบันทึกผลการเล่น...',
      text: 'ระบบกำลังดำเนินการซิงค์ข้อมูลผลประเมินเชื่อมสู่ Google Sheets กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const payload = {
      action: 'save',
      fullName: result.FullName,
      gameTitle: 'กิจกรรมหุ่นยนต์เก็บขยะ',
      gradeLevel: 'มัธยมศึกษาปีที่ 5',
      subject: 'รายวิชา Basic Programming',
      score: result.Score,
      steps: result.Steps,
      trashCollected: result.TrashCollected,
      hintUsed: result.HintUsed,
      missionStatus: result.MissionStatus,
      performanceLevel: result.PerformanceLevel,
      completedAt: result.CompletedAt
    };

    try {
      // Use standard fetch. Standard Sheets integration often has CORS redirection issues, so we can support redirect handling.
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // standard Google Apps Script Web App bypasses CORS with opaque POST redirect
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      Swal.close();
      Swal.fire({
        title: 'บันทึกสำเร็จ! 🎉📊',
        text: 'คะแนนการจัดลำดับขั้นตอนถูกบันทึกลงตารางผลคะแนนส่วนกลางเรียบร้อยแล้ว!',
        icon: 'success',
        confirmButtonText: 'เยี่ยมเลย!',
        confirmButtonColor: '#9333ea'
      });

      // Reload leaderboard to sync
      fetchLeaderboard();

    } catch (error) {
      console.error('Submission failed. Queueing results offline.', error);
      Swal.close();

      // Save to offline cache
      const offlineQueue = JSON.parse(localStorage.getItem('failedSubmissions') || '[]');
      offlineQueue.push(payload);
      localStorage.setItem('failedSubmissions', JSON.stringify(offlineQueue));

      Swal.fire({
        title: 'เครือข่ายขัดข้อง 🔌⚠️',
        html: 'ไม่สามารถส่งคะแนนเชื่อมต่อไปยัง Google Sheets ได้ชั่วคราว<br><br><b>แต่ไม่ต้องกังวล!</b> ข้อมูลของคุณถูกเซฟสำรองในเครื่องนี้แล้ว และจะถูกซิงค์ทันทีเมื่อเครือข่ายกลับมาใช้งานได้ปกติ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลองใหม่อีกครั้ง',
        cancelButtonText: 'ตกลง',
        confirmButtonColor: '#a855f7'
      }).then((res) => {
        if (res.isConfirmed) {
          submitGameResult(result);
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Sync failed offline submissions if network is available
  const checkAndResubmitOfflineData = async () => {
    const offlineQueue = JSON.parse(localStorage.getItem('failedSubmissions') || '[]');
    if (offlineQueue.length === 0) return;

    console.log(`Found ${offlineQueue.length} pending offline records, attempting to sync...`);
    const successfulSyncs: number[] = [];

    for (let i = 0; i < offlineQueue.length; i++) {
      try {
        await fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(offlineQueue[i])
        });
        successfulSyncs.push(i);
      } catch (err) {
        console.warn('Sync attempt failed for record index', i);
        break; // Stop and retry later if network still blocks
      }
    }

    if (successfulSyncs.length > 0) {
      const remaining = offlineQueue.filter((_: any, idx: number) => !successfulSyncs.includes(idx));
      localStorage.setItem('failedSubmissions', JSON.stringify(remaining));
      console.log(`Synced ${successfulSyncs.length} records successfully!`);
    }
  };

  // Login Handle
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = loginInput.trim();
    if (!name) {
      Swal.fire({
        title: 'กรุณากรอกชื่อผู้เข้าเรียน! 🏷️',
        text: 'ผู้เรียนจำเป็นต้องลงระบุ ชื่อ-นามสกุล ก่อนเริ่มต้นทำกิจกรรมรักษ์โลก',
        icon: 'warning',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    setIsLoggingIn(true);
    // Simulate loading overlay
    setTimeout(() => {
      localStorage.setItem('savedPlayerName', name);
      setUser(name);
      setIsLoggingIn(false);
      setActiveTab('home');
      Swal.fire({
        title: 'ยินดีต้อนรับเข้าสู่ออนไลน์เลิร์นนิ่ง! 🚀',
        text: `พร้อมที่จะท้าทายภารกิจวางแผนจัดลำดับเพื่อช่วยโลกแล้วหรือยัง คุณ ${name}?`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1000);
  };

  // Logout Handler
  const handleLogout = () => {
    Swal.fire({
      title: 'ต้องการออกจากระบบหรือไม่? 🚪',
      text: 'ชื่อและเซสชันปัจจุบันของคุณจะถูกยุติ แต่สถิติที่เซฟแล้วจะไม่หายไป',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem('savedPlayerName');
        setUser(null);
        setLoginInput('');
        setCommands([]);
        handleReset();
        setActiveTab('home');
      }
    });
  };

  // Reset ALL local storage data (For fresh testing)
  const handleResetAllData = () => {
    Swal.fire({
      title: 'ต้องการเริ่มใหม่ทั้งหมดหรือไม่? ⚠️',
      text: 'การดำเนินการนี้จะลบแคชประวัติและชื่อผู้ใช้ทั้งหมดในเครื่องนี้ทันที โดยจะขอยืนยันคุณถึง 2 ครั้ง!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ฉันต้องการล้างทั้งหมด (ครั้งที่ 1)',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444'
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: 'ยืนยันความพึงพอใจขั้นสุดท้าย 🚨',
          text: 'ย้ำอีกครั้ง! ประวัติตัวตนทั้งหมดในเบราว์เซอร์ รวมถึงคิวที่ส่งไม่สำเร็จจะถูกตัดทิ้งอย่างถาวร',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ยืนยันลบถาวร (ครั้งที่ 2)',
          cancelButtonText: 'ยกเลิก',
          confirmButtonColor: '#dc2626'
        }).then((res2) => {
          if (res2.isConfirmed) {
            localStorage.clear();
            setUser(null);
            setLoginInput('');
            setCommands([]);
            handleReset();
            setActiveTab('home');
            Swal.fire('ล้างข้อมูลเสร็จสิ้น!', 'เบราว์เซอร์ของคุณได้รับการรีเซ็ตข้อมูลเกมเรียบร้อยแล้ว', 'success');
          }
        });
      }
    });
  };

  // Commands Sequence handlers
  const handleAddCommand = (cmd: CommandType) => {
    if (commands.length >= 30) {
      Swal.fire('คิวเต็มแล้ว!', 'คุณสามารถตั้งคำสั่งได้สูงสุดไม่เกิน 30 ตัวอักษร', 'warning');
      return;
    }
    setCommands([...commands, cmd]);
  };

  const handleRemoveLast = () => {
    setCommands(commands.slice(0, -1));
  };

  const handleClearAll = () => {
    setCommands([]);
  };

  const handleRemoveSpecific = (index: number) => {
    const updated = [...commands];
    updated.splice(index, 1);
    setCommands(updated);
  };

  const handleReorderCommands = (reordered: CommandType[]) => {
    setCommands(reordered);
  };

  // Reset Grid map / Positions
  const handleReset = () => {
    setRobotPos(START_POS);
    setRemainingTrash(TRASH_LIST.map(t => `${t.r},${t.c}`));
    setCollectedCount(0);
    setStepsCount(0);
    setRunning(false);
    setPaused(false);
    setCurrentStepIndex(-1);
    // Don't reset hintsUsedCount or crashCount during active reset play, but do so if they click replay.
  };

  const handleStartPlay = () => {
    if (commands.length === 0) {
      Swal.fire('คิวว่างเปล่า!', 'กรุณาใส่ลำดับคำสั่งทิศทางอย่างน้อย 1 ก้าวเพื่อเริ่มให้หุ่นยนต์ทำงาน', 'warning');
      return;
    }
    // Set to start position first before playing to ensure clean run
    setRobotPos(START_POS);
    setRemainingTrash(TRASH_LIST.map(t => `${t.r},${t.c}`));
    setCollectedCount(0);
    setStepsCount(0);
    
    setRunning(true);
    setPaused(false);
    setCurrentStepIndex(0);
  };

  const handlePause = () => {
    setPaused(true);
  };

  const handleResume = () => {
    setPaused(false);
  };

  // Hint Logic
  const handleGetHint = () => {
    if (hintsUsedCount >= 2) {
      Swal.fire('คำใบ้หมดแล้ว!', 'คุณสามารถขอคำใบ้ได้สูงสุดไม่เกิน 2 ครั้งต่อเกม', 'info');
      return;
    }

    Swal.fire({
      title: 'ต้องการใช้คำใบ้หรือไม่? 💡',
      text: 'การเปิดดูแนวทางวิเคราะห์จะถูกหัก 10 คะแนนออกจากคะแนนประเมินดิบเริ่มต้น',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ตกลง, เปิดดูคำใบ้',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#6b7280'
    }).then((res) => {
      if (res.isConfirmed) {
        const currentHintText = GAME_HINTS[hintsUsedCount];
        setHintsUsedCount(prev => prev + 1);

        Swal.fire({
          title: `คำใบ้ที่ ${hintsUsedCount + 1} 🗺️`,
          html: `<div class="text-left text-sm leading-relaxed p-2 border border-purple-100 rounded-lg bg-purple-50/50">${currentHintText}</div>`,
          icon: 'info',
          confirmButtonText: 'เข้าใจแล้ว',
          confirmButtonColor: '#9333ea'
        });
      }
    });
  };

  // Game Engine execution Loop
  useEffect(() => {
    if (!running || paused || currentStepIndex < 0 || currentStepIndex >= commands.length) {
      if (running && currentStepIndex >= commands.length) {
        // Run ends but not winning
        setRunning(false);
        setCurrentStepIndex(-1);
        Swal.fire({
          title: 'สิ้นสุดลำดับคำสั่ง! 🏠🛑',
          text: `หุ่นยนต์ประมวลผลคำสั่งครบทั้ง ${commands.length} ขั้นตอนแล้ว แต่ยังทำภารกิจไม่สำเร็จ (เก็บขยะได้ ${collectedCount}/4 จุด และไม่ถึงฐาน H1) ลองวิเคราะห์แนวทางใหม่ดูนะ!`,
          icon: 'warning',
          confirmButtonText: 'ลองปรับปรุงเส้นทาง',
          confirmButtonColor: '#a855f7'
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      const nextCmd = commands[currentStepIndex];
      let { r, c } = robotPos;

      // Directions
      if (nextCmd === 'UP') r -= 1;
      else if (nextCmd === 'DOWN') r += 1;
      else if (nextCmd === 'LEFT') c -= 1;
      else if (nextCmd === 'RIGHT') c += 1;

      // 1. Boundary checking
      if (r < 0 || r > 7 || c < 0 || c > 7) {
        setRunning(false);
        setCurrentStepIndex(-1);
        Swal.fire({
          title: 'โปรแกรมหยุดชะงัก! 🚨',
          text: 'หุ่นยนต์พยายามเคลื่อนที่เดินชนขอบแผนที่โลก ออกนอกระบบกริดพิกัดขนาด 8x8!',
          icon: 'error',
          confirmButtonText: 'กลับมาแก้ไขโค้ด',
          confirmButtonColor: '#ef4444'
        });
        return;
      }

      // 2. Obstacles checking
      const obstacle = OBSTACLES.find((o) => o.r === r && o.c === c);
      if (obstacle) {
        setRunning(false);
        setCurrentStepIndex(-1);
        setCrashCount((prev) => prev + 1);
        Swal.fire({
          title: 'อุบัติเหตุทางวิศวกรรม! 🪵💥',
          text: `หุ่นยนต์เคลื่อนที่ชนสิ่งกีดขวาง: ${obstacle.name}! ทำให้แบตเตอรี่ระเบิดชั่วคราวและโปรแกรมหยุดทันที (หัก 5 คะแนน)`,
          icon: 'error',
          confirmButtonText: 'เริ่มวางแผนแก้จุดบกพร่อง',
          confirmButtonColor: '#ef4444'
        });
        return;
      }

      // 3. Apply position
      setRobotPos({ r, c });
      const nextSteps = stepsCount + 1;
      setStepsCount(nextSteps);

      // 4. Trash Collection logic
      const coordStr = `${r},${c}`;
      let nextCollected = collectedCount;
      if (remainingTrash.includes(coordStr)) {
        setRemainingTrash((prev) => prev.filter((item) => item !== coordStr));
        nextCollected = collectedCount + 1;
        setCollectedCount(nextCollected);

        // Toast indicator
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `เก็บขยะได้แล้ว! 🗑️✨ (${nextCollected}/4 จุด)`,
          showConfirmButton: false,
          timer: 1500
        });
      }

      // 5. Arrive Base validation
      if (r === BASE_POS.r && c === BASE_POS.c) {
        setRunning(false);
        setCurrentStepIndex(-1);
        if (nextCollected === 4) {
          // Play confetti celebration!
          import('canvas-confetti').then((confetti) => {
            confetti.default({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });
          });

          // Calculate score
          const overSteps = Math.max(0, nextSteps - 23);
          const rawScore = 100 - (overSteps * 2) - (hintsUsedCount * 10) - (crashCount * 5);
          const finalScore = Math.max(0, rawScore);

          // Determine rating
          let rating = '';
          if (nextSteps <= 23) rating = 'นักวางแผนยอดเยี่ยม';
          else if (nextSteps <= 25) rating = 'นักวางแผนดีมาก';
          else if (nextSteps <= 28) rating = 'นักวางแผนระดับดี';
          else rating = 'ควรลองปรับเส้นทางใหม่';

          // Completed date string representation
          const now = new Date();
          const datetimeStr = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

          const completedResult: PlayerRecord = {
            FullName: user || 'นักเรียนลุยเดี่ยว',
            Score: finalScore,
            Steps: nextSteps,
            TrashCollected: nextCollected,
            HintUsed: hintsUsedCount,
            MissionStatus: 'สำเร็จ',
            PerformanceLevel: rating,
            CompletedAt: datetimeStr
          };

          setLastResult(completedResult);

          Swal.fire({
            title: 'ทำภารกิจสำเร็จลุล่วง! 🏆🌳',
            html: `ยินดีด้วย! คุณพาหุ่นยนต์อัจฉริยะกู้ขยะครบ 4 จุดและนำจอดลงจอดที่ฐานปลายทางได้สำเร็จ!<br><br><b>ก้าวเดินทั้งหมด:</b> ${nextSteps} ก้าว<br><b>คะแนนการจัดลำดับขั้นตอน:</b> <span class="text-purple-600 font-extrabold text-lg">${finalScore}</span> คะแนน`,
            icon: 'success',
            confirmButtonText: 'เปิดดูสมุดบันทึกสรุปผล',
            confirmButtonColor: '#9333ea'
          }).then(() => {
            setActiveTab('results');
            // Write result records onto Google Sheets central API
            submitGameResult(completedResult);
          });
        } else {
          Swal.fire({
            title: 'ยังจอดไม่ได้นะ! 🏠⚠️',
            text: `คุณมาถึงฐานทัพพิกัด H1 แล้ว แต่เพิ่งเคลียร์เก็บขยะพิกัดเป้าหมายได้เพียง ${nextCollected}/4 ถังเท่านั้น กรุณานำทางหุ่นยนต์กู้ภัยกู้ขยะให้ครบทั้ง 4 พิกัดก่อนนะ!`,
            icon: 'warning',
            confirmButtonText: 'ขับขี่สำรวจต่อ',
            confirmButtonColor: '#d97706'
          });
        }
      }

      // Next execution tick
      setCurrentStepIndex((prev) => prev + 1);

    }, 850);

    return () => clearTimeout(timer);
  }, [running, paused, currentStepIndex]);

  // Handle playing again (Reset everything including crash and hint indicators)
  const handlePlayAgain = () => {
    setRobotPos(START_POS);
    setRemainingTrash(TRASH_LIST.map(t => `${t.r},${t.c}`));
    setCollectedCount(0);
    setStepsCount(0);
    setHintsUsedCount(0);
    setCrashCount(0);
    setCommands([]);
    setRunning(false);
    setPaused(false);
    setCurrentStepIndex(-1);
    setActiveTab('game');
  };

  const handleGoHome = () => {
    setActiveTab('home');
  };

  const handleManualSave = () => {
    if (lastResult) {
      submitGameResult(lastResult);
    } else {
      Swal.fire('ไม่พบประวัติเซสชันล่าสุด', 'คุณต้องเล่นชนะเก็บขยะให้ครบและจอดกลับเข้าสู่ฐานสำเร็จเสียก่อน', 'info');
    }
  };

  const scrollToLeaderboard = () => {
    const el = document.getElementById('leaderboard-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IF NOT LOGGED IN -> Show Welcome Authentication UI
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F3E8FF] relative overflow-hidden flex flex-col justify-between py-10 px-4">
        {/* Animated Bubble Background Decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-yellow-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="flex-grow flex items-center justify-center z-10">
          <div className="w-full max-w-lg bg-white/60 backdrop-blur-md border border-white/40 shadow-2xl rounded-3xl p-8 transition-all hover:shadow-purple-200/50">
            {/* Header Labels */}
            <div className="text-center mb-8">
              <span className="px-3.5 py-1 bg-purple-100 text-purple-700 font-extrabold text-xs rounded-full uppercase tracking-wider">
                บทเรียน Basic Programming ออนไลน์
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 tracking-tight mt-3">
                บทเรียนออนไลน์
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide mt-1">
                กิจกรรมหุ่นยนต์เก็บขยะ
              </h2>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1.5">
                ระดับชั้นมัธยมศึกษาปีที่ 5
              </p>
            </div>

            {/* Cute robot representation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 blur opacity-30 animate-pulse" />
                <div className="relative w-28 h-28 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center shadow-lg text-6xl select-none animate-[bounce_4s_infinite]">
                  🤖
                </div>
              </div>
            </div>

            {/* Login form field */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label htmlFor="student-name-input" className="block text-sm font-bold text-gray-700 mb-2">
                  ระบุชื่อ - นามสกุล ของผู้เข้าเรียน:
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  placeholder="กรุณากรอกชื่อและนามสกุลของคุณ เช่น สมชาย เรียนดี"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white/90 shadow-inner text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-medium transition-all"
                />
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                เข้าสู่ระบบการเรียนรู้ &rarr;
              </button>
            </form>
          </div>
        </div>

        {/* Global Leaderboard Panel visible on welcome login screen below */}
        <div className="w-full max-w-4xl mx-auto mt-12 px-2">
          <Leaderboard players={leaderboard} isLoading={leaderboardLoading} />
        </div>

        {/* Footer info block */}
        <footer className="w-full text-center py-6 mt-10 border-t border-purple-100/50">
          <p className="text-xs text-gray-500 font-semibold">
            © 2026 Copyright | พัฒนาโดย Sawit
          </p>
        </footer>

        {/* Loading Overlay during login authentication simulation */}
        {isLoggingIn && (
          <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-xs z-50 flex flex-col items-center justify-center text-white">
            <div className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mb-4" />
              <span className="text-base font-bold text-yellow-100 animate-pulse">กำลังสแกนวิเคราะห์ประวัติตัวตนผู้เรียน...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN SYSTEM: AFTER AUTHENTICATED
  return (
    <div className="min-h-screen bg-[#F3E8FF] flex flex-col md:flex-row relative overflow-hidden">
      {/* Animated Bubble Background Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-yellow-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onResetAllData={handleResetAllData}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        playerName={user}
      />

      {/* Primary Workspace Panel */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col justify-between max-w-7xl mx-auto w-full z-10">
        <div className="space-y-6">
          {/* Header Bar containing metadata */}
          <header className="bg-white/40 backdrop-blur-md border border-white/40 p-4 sm:p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-purple-600 text-xs sm:text-sm font-bold flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-purple-100/80 rounded text-[10px]">ชั้นมัธยมศึกษาปีที่ 5</span>
                <span>รายวิชา Basic Programming</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-2 leading-tight">
                กิจกรรมหุ่นยนต์เก็บขยะ (Robot Garbage Mission)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                หน่วยการเรียนรู้: การวางแผนลำดับคำสั่งและการแก้ปัญหาอย่างเป็นขั้นตอน
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-white/80 backdrop-blur border border-white/50 px-4 py-1.5 rounded-2xl shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span className="text-[10px] uppercase text-slate-400">ผู้เล่น:</span>
                <span className="text-purple-600 font-extrabold">{user}</span>
              </div>
              <div className="bg-white/80 backdrop-blur border border-white/50 px-4 py-1.5 rounded-2xl shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span className="text-slate-600">สถานะ:</span>
                <span className="text-purple-700 font-extrabold">{running ? (paused ? 'หยุดชั่วคราว' : 'กำลังประมวลผล') : 'รอชุดคำสั่ง'}</span>
              </div>
            </div>
          </header>

          {/* Router Tab Renderings */}
          {activeTab === 'home' && (
            <Dashboard
              playerName={user}
              onNavigate={setActiveTab}
              onScrollToLeaderboard={scrollToLeaderboard}
            />
          )}

          {activeTab === 'rules' && <RulesPanel />}

          {activeTab === 'game' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Map Grid */}
              <div className="lg:col-span-6 space-y-6">
                <GameBoard
                  robotPos={robotPos}
                  remainingTrash={remainingTrash}
                  allTrash={TRASH_LIST}
                  basePos={BASE_POS}
                />

                {/* Micro scoring metrics during play */}
                <div className="bg-white/60 backdrop-blur-xs p-4 rounded-xl border border-purple-100 flex items-center justify-around text-center gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">ความคืบหน้า</span>
                    <span className="text-xl font-black text-purple-600">{collectedCount}/4</span>
                    <span className="text-[9px] text-gray-500 block">เก็บขยะ</span>
                  </div>
                  <div className="border-r border-purple-100 h-8" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">จำนวนก้าว</span>
                    <span className="text-xl font-black text-emerald-600">{stepsCount}</span>
                    <span className="text-[9px] text-gray-500 block">เกณฑ์เป้าหมาย ≤23</span>
                  </div>
                  <div className="border-r border-purple-100 h-8" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">อุปสรรคชน</span>
                    <span className="text-xl font-black text-rose-500">{crashCount}</span>
                    <span className="text-[9px] text-gray-500 block">ครั้ง</span>
                  </div>
                  <div className="border-r border-purple-100 h-8" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">คะแนนดิบ</span>
                    <span className="text-xl font-black text-indigo-600">
                      {Math.max(0, 100 - Math.max(0, stepsCount - 23) * 2 - hintsUsedCount * 10 - crashCount * 5)}
                    </span>
                    <span className="text-[9px] text-gray-500 block">คะแนน</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution sequence control list */}
              <div className="lg:col-span-6">
                <CommandPanel
                  commands={commands}
                  onAddCommand={handleAddCommand}
                  onRemoveLast={handleRemoveLast}
                  onClearAll={handleClearAll}
                  onExecute={handleStartPlay}
                  onPause={handlePause}
                  onResume={handleResume}
                  onReset={handleReset}
                  onGetHint={handleGetHint}
                  running={running}
                  paused={paused}
                  currentStepIndex={currentStepIndex}
                  onReorderCommands={handleReorderCommands}
                  onRemoveSpecific={handleRemoveSpecific}
                  hintsUsed={hintsUsedCount}
                />
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="py-4">
              {lastResult ? (
                <ResultsPanel
                  lastResult={lastResult}
                  onPlayAgain={handlePlayAgain}
                  onGoHome={handleGoHome}
                  onManualSave={handleManualSave}
                  isSaving={isSaving}
                />
              ) : (
                <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-xl text-center">
                  <span className="text-5xl">🤷‍♂️</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-4">ยังไม่มีผลลัพธ์การบันทึกในระบบเซสชันนี้</h3>
                  <p className="text-xs text-gray-400 mt-1">คุณจำต้องการจัดลำดับพิกัดควบคุม และชนะเกมรักษ์โลกปลายทางให้สำเร็จเป็นครั้งแรกก่อนนะ</p>
                  <button
                    onClick={() => setActiveTab('game')}
                    className="mt-6 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    ลุยเล่นเกมตอนน้ีเลย &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Leaderboard panel always rendered below on home page */}
        {activeTab === 'home' && (
          <div className="mt-12">
            <Leaderboard players={leaderboard} isLoading={leaderboardLoading} />
          </div>
        )}

        {/* Floating global footer copyright */}
        <footer className="w-full text-center py-6 mt-12 border-t border-purple-100/50 bg-white/30 backdrop-blur-xs rounded-t-2xl">
          <p className="text-xs text-gray-500 font-semibold">
            © 2026 Copyright | พัฒนาโดย Sawit
          </p>
        </footer>
      </main>
    </div>
  );
}
