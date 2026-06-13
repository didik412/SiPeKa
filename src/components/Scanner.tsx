/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  CameraOff, 
  Keyboard, 
  UserCheck, 
  AlertCircle, 
  BookOpen, 
  ListRestart, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Users
} from 'lucide-react';
import { Student, ClassGroup, AttendanceRecord, AttendanceActivity } from '../types';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  students: Student[];
  classes: ClassGroup[];
  onAddAttendance: (studentId: string, activity: string, status: 'Hadir', scanned: boolean) => void;
  attendanceToday: AttendanceRecord[];
}

export default function Scanner({ students, classes, onAddAttendance, attendanceToday }: ScannerProps) {
  const [selectedActivity, setSelectedActivity] = useState<AttendanceActivity>('Sholat Dhuha');
  const [scanMethod, setScanMethod] = useState<'camera' | 'usb' | 'simulation'>('simulation');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Scanning State Feedbacks
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [scanSuccessMessage, setScanSuccessMessage] = useState('');
  const [scanErrorMessage, setScanErrorMessage] = useState('');
  
  // Simulation Student ID selector
  const [simStudentId, setSimStudentId] = useState('');

  // Camera element reference
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerId = "html5-qr-reader";

  // Synthetic Audio Beep
  const playBeep = (freq = 880, duration = 0.12) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback not supported or interaction deferred: ", e);
    }
  };

  // Sound effects based on state
  const playSuccessSound = () => {
    playBeep(880, 0.15); // standard quick beep
  };

  const playErrorSound = () => {
    playBeep(320, 0.3); // low error beep
  };

  // Helper to find student details
  const getStudentDetails = (query: string) => {
    // Search by NIS or Barcode or ID
    const trimmed = query.trim().toLowerCase();
    return students.find(
      s => s.nis.toLowerCase() === trimmed || 
           s.barcode.toLowerCase() === trimmed || 
           s.id.toLowerCase() === trimmed
    );
  };

  // Handle successful match
  const processSuccessfulScan = (student: Student) => {
    // Check if already present in today's list for the same activity
    const todayStr = '2026-06-12';
    const isAlreadyPresent = attendanceToday.some(
      r => r.studentId === student.id && 
           r.date === todayStr && 
           r.activity === selectedActivity &&
           r.status === 'Hadir'
    );

    if (isAlreadyPresent) {
      playErrorSound();
      setScanErrorMessage(`Siswa "${student.name}" sudah mengisi presensi ${selectedActivity} hari ini.`);
      setScanSuccessMessage('');
      setScannedStudent(student);
      
      // Auto-clear notification after 4 seconds
      const timer = setTimeout(() => {
        setScanErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Call state update
    onAddAttendance(student.id, selectedActivity, 'Hadir', true);
    
    // Set feedback states
    playSuccessSound();
    setScannedStudent(student);
    setScanSuccessMessage(`SUKSES! Presensi ${selectedActivity} tercatat untuk ${student.name}.`);
    setScanErrorMessage('');

    // Clear barcode input if in manual USB mode
    setBarcodeInput('');

    // Auto-clear notification details after 5 seconds to stand by for next
    const timer = setTimeout(() => {
      setScanSuccessMessage('');
      setScannedStudent(null);
    }, 5000);

    return () => clearTimeout(timer);
  };

  // 1. Camera QR Scanner Setup
  useEffect(() => {
    if (scanMethod === 'camera') {
      try {
        // Initialize HTML5 QR Code Scanner
        const qrScanner = new Html5QrcodeScanner(
          scannerContainerId,
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true
          },
          /* verbose= */ false
        );

        const onScanSuccess = (decodedText: string) => {
          const matchStudent = getStudentDetails(decodedText);
          if (matchStudent) {
            processSuccessfulScan(matchStudent);
          } else {
            playErrorSound();
            setScanErrorMessage(`Barcode "${decodedText}" tidak terdaftar di sistem.`);
            setScanSuccessMessage('');
            setScannedStudent(null);
          }
        };

        const onScanFailure = (error: any) => {
          // Silent failure - QR scanner produces errors for almost every frame with no match
        };

        qrScanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = qrScanner;
      } catch (err) {
        console.error("Camera scan initialisation failure:", err);
      }
    } else {
      // Cleanup camera if tab changes
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.warn("Error clearing scanner on state change:", err);
        });
        scannerRef.current = null;
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.warn("Error clearing scanner during unmount:", err);
        });
        scannerRef.current = null;
      }
    };
  }, [scanMethod, selectedActivity]);

  // 2. Global USB Scanner Listener
  useEffect(() => {
    // Standard barcode guns typingly emit keys very quickly and terminate with 'Enter' key
    // We can intercept keys when focus is general or when they use the quick input form.
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (scanMethod !== 'usb') return;
      
      // Let standard inputs function normally
      if (document.activeElement?.tagName === 'INPUT' && document.activeElement !== document.getElementById('usb-focus-input')) {
        return;
      }

      if (e.key === 'Enter') {
        if (barcodeInput.trim()) {
          const studentFound = getStudentDetails(barcodeInput);
          if (studentFound) {
            processSuccessfulScan(studentFound);
          } else {
            playErrorSound();
            setScanErrorMessage(`Nomor Barcode/NIS "${barcodeInput}" tidak terdaftar.`);
            setScanSuccessMessage('');
          }
          setBarcodeInput('');
        }
      }
    };

    window.addEventListener('keypress', handleGlobalKeyPress);
    return () => {
      window.removeEventListener('keypress', handleGlobalKeyPress);
    };
  }, [barcodeInput, scanMethod, selectedActivity]);

  // Handle USB submit button also
  const handleUsbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const studentFound = getStudentDetails(barcodeInput);
    if (studentFound) {
      processSuccessfulScan(studentFound);
    } else {
      playErrorSound();
      setScanErrorMessage(`Nomor Barcode/NIS "${barcodeInput}" tidak terdaftar.`);
      setScanSuccessMessage('');
    }
  };

  // 3. Simulated Barcode Trigger
  const handleSimulateBtn = () => {
    if (!simStudentId) {
      playErrorSound();
      setScanErrorMessage('Harap pilih siswa simulasi terlebih dahulu!');
      return;
    }

    const matchedSiswa = students.find(s => s.id === simStudentId);
    if (matchedSiswa) {
      processSuccessfulScan(matchedSiswa);
    }
  };

  // Find class details for displaying scanned info
  const scannedStudentClass = scannedStudent 
    ? classes.find(c => c.id === scannedStudent.classId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Scan className="text-emerald-700" />
              Sistem Absensi Otomatis Barcode
            </h2>
            <p className="text-xs text-gray-500">
              Pindai barcode kartu pelajar siswa atau simulasikan pemindaian untuk mencatat kehadiran kegiatan ibadah.
            </p>
          </div>

          {/* Activity Selector Block */}
          <div className="flex flex-wrap items-center gap-2 bg-emerald-50 p-1.5 rounded-xl border border-emerald-100 self-start md:self-auto">
            <button
              onClick={() => setSelectedActivity('Sholat Dhuha')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedActivity === 'Sholat Dhuha'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-800 hover:bg-emerald-100/60'
              }`}
            >
              Sholat Dhuha
            </button>
            <button
              onClick={() => setSelectedActivity('Sholat Dhuhur')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedActivity === 'Sholat Dhuhur'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-800 hover:bg-emerald-100/60'
              }`}
            >
              Sholat Dhuhur
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Scan Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-emerald-100/60 rounded-2xl overflow-hidden shadow-sm">
            {/* Nav Methods Tabs */}
            <div className="flex border-b border-gray-150 bg-gray-50/50">
              <button
                onClick={() => setScanMethod('simulation')}
                className={`flex-1 py-3 px-4 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scanMethod === 'simulation'
                    ? 'border-emerald-700 text-emerald-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Users size={16} />
                Simulasi Kartu Siswa
              </button>
              <button
                onClick={() => setScanMethod('camera')}
                className={`flex-1 py-3 px-4 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scanMethod === 'camera'
                    ? 'border-emerald-700 text-emerald-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Camera size={16} />
                Scan Kamera HP/Laptop
              </button>
              <button
                onClick={() => setScanMethod('usb')}
                className={`flex-1 py-3 px-4 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  scanMethod === 'usb'
                    ? 'border-emerald-700 text-emerald-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Keyboard size={16} />
                USB Barcode Gun
              </button>
            </div>

            {/* Methods Interfaces */}
            <div className="p-6">
              {/* Option A: Scanner Card Simulator */}
              {scanMethod === 'simulation' && (
                <div className="space-y-6 max-w-md mx-auto text-center">
                  <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-5 space-y-3">
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      <strong>💡 Mode Demo Instan:</strong> Karena keterbatasan akses kamera web di lingkungan sandbox iframe atau Blogger, gunakan simulator cerdas ini untuk menyeleksi siswa dan merepresentasikan suara beep pemindai secara nyata.
                    </p>
                    <div className="text-left space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Pilih Siswa untuk Simulasi Scan:</label>
                      <select 
                        value={simStudentId}
                        onChange={(e) => setSimStudentId(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none"
                      >
                        <option value="">-- Pilih Siswa --</option>
                        {classes.map(cl => (
                          <optgroup key={cl.id} label={`Kelas ${cl.name}`}>
                            {students
                              .filter(st => st.classId === cl.id)
                              .map(st => (
                                <option key={st.id} value={st.id}>
                                  {st.name} ({st.nis})
                                </option>
                              ))
                            }
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Simulation Virtual Student ID Card */}
                  <AnimatePresence mode="wait">
                    {simStudentId ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gradient-to-tr from-emerald-800 to-emerald-950 border border-emerald-700 text-white rounded-2xl p-5 shadow-lg relative text-left overflow-hidden w-full max-w-sm mx-auto"
                      >
                        {/* Design accents */}
                        <div className="absolute right-0 top-0 opacity-10 font-bold text-9xl tracking-tighter transform translate-x-4 -translate-y-8 select-none">
                          SMAN1
                        </div>
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-start border-b border-white/20 pb-2">
                            <div>
                              <h4 className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">Kartu Karakter Siswa</h4>
                              <p className="text-[9px] text-emerald-300">SMAN 1 Bantaran Probolinggo</p>
                            </div>
                            <span className="text-[10px] bg-amber-500 px-2 py-0.5 rounded text-emerald-950 font-extrabold shadow-sm">
                              ID: {simStudentId}
                            </span>
                          </div>

                          {(() => {
                            const selectedS = students.find(s => s.id === simStudentId);
                            const classS = selectedS ? classes.find(c => c.id === selectedS.classId) : null;
                            return (
                              <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800 font-black text-lg shadow-inner">
                                  {selectedS?.gender === 'L' ? '👦' : '👧'}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-white leading-tight">{selectedS?.name}</div>
                                  <p className="text-xs text-emerald-200">NIS: {selectedS?.nis}</p>
                                  <p className="text-xs text-yellow-400 font-semibold">{classS?.name}</p>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Decorative Barcode Render */}
                          <div className="bg-white p-2 rounded-lg flex flex-col items-center gap-1">
                            <div className="flex gap-0.5 h-7 w-full justify-center">
                              {/* Procedural barcode generator with standard lines */}
                              {Array.from({ length: 24 }).map((_, i) => {
                                const widths = [1, 2, 3, 1, 4, 2, 1, 3];
                                const width = widths[i % widths.length];
                                return (
                                  <div 
                                    key={i} 
                                    className="bg-black h-full" 
                                    style={{ width: `${width}px`, opacity: i % 3 === 0 ? 0.15 : 1 }} 
                                  />
                                );
                              })}
                            </div>
                            <div className="text-[9px] font-mono font-black text-gray-800">
                              *{students.find(s => s.id === simStudentId)?.barcode || simStudentId}*
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-gray-400 flex flex-col items-center gap-2">
                        <UserCheck size={36} className="opacity-40 animate-pulse text-emerald-605" />
                        <span className="text-xs font-semibold">Pilih siswa di atas untuk melihat preview kartu pelajar</span>
                      </div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={handleSimulateBtn}
                    disabled={!simStudentId}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Scan size={16} />
                    SIMULASIKAN PEMINDAIAN BARCODE
                  </button>
                </div>
              )}

              {/* Option B: Real Webcam Camera Scanner */}
              {scanMethod === 'camera' && (
                <div className="space-y-4 max-w-sm mx-auto text-center">
                  <div id={scannerContainerId} className="overflow-hidden border border-gray-200 rounded-2xl bg-black">
                    {/* HTML5QrcodeScanner will render here */}
                  </div>
                  <div className="flex gap-2 items-center justify-center text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Pastikan izin akses kamera telah diaktifkan di peramban Anda.</span>
                  </div>
                </div>
              )}

              {/* Option C: USB Barcode Gun Hardware */}
              {scanMethod === 'usb' && (
                <div className="space-y-6 max-w-md mx-auto py-4">
                  <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <Keyboard size={36} className="text-emerald-700 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-emerald-950">Hardware Barcode Scanner Gun</h4>
                      <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                        Sambungkan alat barcode scanner (tipe pistol USB / Bluetooth emulasi keyboard) ke laptop Anda. Arahkan kursor pada kotak input di bawah dan lakukan tes scan fisik.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUsbSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Scan Input Field (Standby):</label>
                      <input
                        id="usb-focus-input"
                        type="text"
                        placeholder="Klik di sini sebelum melakukan scan gun..."
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-emerald-700/30 focus:border-emerald-700 rounded-xl px-4 py-3 text-sm focus:ring-0 outline-none text-center font-mono placeholder:text-gray-400 font-bold"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow cursor-pointer"
                    >
                      Daftar Kehadiran Siswa
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Scan Feedback Details & Today's Attendance Quick Count */}
        <div className="space-y-6">
          {/* Dynamic Popup Scan Results */}
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm min-h-48 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Hasil Pemindaian</h3>

            <div className="flex-1 flex flex-col justify-center">
              {scannedStudent ? (
                <div className="space-y-3.5 text-center py-2">
                  <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-700">
                    <UserCheck size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{scannedStudent.name}</h4>
                    <p className="text-xs text-gray-500">
                      NIS {scannedStudent.nis} • Kelas {(classes.find(c => c.id === scannedStudent.classId))?.name}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 inline-block px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Aktivitas: {selectedActivity}
                    </p>
                  </div>

                  {scanSuccessMessage && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl p-3 text-xs leading-normal font-semibold">
                      {scanSuccessMessage}
                    </div>
                  )}

                  {scanErrorMessage && (
                    <div className="bg-rose-50 text-rose-800 border border-rose-100/80 rounded-xl p-3 text-xs leading-normal font-semibold">
                      {scanErrorMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  {scanErrorMessage ? (
                    <div className="space-y-3 text-center">
                      <div className="mx-auto w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                        <AlertCircle size={20} />
                      </div>
                      <div className="bg-rose-50 text-rose-800 border border-rose-100 rounded-xl p-3 text-xs font-semibold">
                        {scanErrorMessage}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 space-y-2">
                      <Scan size={30} className="mx-auto opacity-35 animate-bounce" />
                      <p className="text-xs font-medium">Menanti pemindaian barcode pertama...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Today's Stats Attendance Quick List */}
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Histori Scan Hari Ini</h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {attendanceToday.length} Data
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-gray-50 pr-1">
              {attendanceToday.length > 0 ? (
                attendanceToday.map((record) => {
                  const s = students.find(student => student.id === record.studentId);
                  const cl = s ? classes.find(c => c.id === s.classId) : null;
                  return (
                    <div key={record.id} className="pt-2 flex items-center justify-between text-xs first:pt-0">
                      <div>
                        <div className="font-bold text-gray-800 truncate max-w-[150px]">{s ? s.name : 'Unknown'}</div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {cl ? cl.name : '-'} • {record.activity}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-gray-400 font-bold">{record.time}</span>
                        <div className="text-[10px] text-emerald-700 font-bold">Hadir</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 font-medium">
                  Belum ada siswa melakukan scan barcode hari ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
