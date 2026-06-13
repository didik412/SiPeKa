/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  Users, 
  CheckCircle, 
  Award, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Clock, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { Student, ClassGroup, AttendanceRecord } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  students: Student[];
  classes: ClassGroup[];
  attendance: AttendanceRecord[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ students, classes, attendance, onNavigate }: DashboardProps) {
  // Current date for comparison (e.g., 2026-06-12)
  const todayStr = '2026-06-12';

  // Stats calculation
  const totalStudents = students.length;
  const totalClasses = classes.length;

  // Today's attendance count (Hadir)
  const todayRecords = useMemo(() => {
    return attendance.filter(r => r.date === todayStr);
  }, [attendance, todayStr]);

  const todayDhuhaHadir = useMemo(() => {
    return todayRecords.filter(r => r.activity === 'Sholat Dhuha' && r.status === 'Hadir').length;
  }, [todayRecords]);

  const todayDhuhurHadir = useMemo(() => {
    return todayRecords.filter(r => r.activity === 'Sholat Dhuhur' && r.status === 'Hadir').length;
  }, [todayRecords]);

  const dhuhaPercentage = useMemo(() => {
    if (totalStudents === 0) return 0;
    return Math.round((todayDhuhaHadir / totalStudents) * 100);
  }, [todayDhuhaHadir, totalStudents]);

  const dhuhurPercentage = useMemo(() => {
    if (totalStudents === 0) return 0;
    return Math.round((todayDhuhurHadir / totalStudents) * 100);
  }, [todayDhuhurHadir, totalStudents]);

  // Overall attendance trend (last 5 active days)
  const last5Days = ['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12'];
  const dailyTrends = useMemo(() => {
    return last5Days.map(date => {
      const records = attendance.filter(r => r.date === date && r.status === 'Hadir');
      const dhuha = records.filter(r => r.activity === 'Sholat Dhuha').length;
      const dhuhur = records.filter(r => r.activity === 'Sholat Dhuhur').length;
      const formattedDate = new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return {
        dateStr: formattedDate,
        'Sholat Dhuha': dhuha,
        'Sholat Dhuhur': dhuhur,
        total: dhuha + dhuhur,
      };
    });
  }, [attendance]);

  // Calculate top 5 disciplined students (Discipline Ranking)
  const topStudents = useMemo(() => {
    // Total potential sessions: 2 activities per day for 5 days = 10 potential sessions (from Jun 8 to Jun 12)
    // Let's count how many times each student attended
    const studentAttendanceCounts = students.map(student => {
      const parentClass = classes.find(c => c.id === student.classId);
      const studentRecords = attendance.filter(r => r.studentId === student.id && r.status === 'Hadir');
      
      // Attendance percentage calculation: standard total of active attends
      // Total possible attends: let's assume 10 sessions (Dhuha and Dhuhur for 5 days)
      const count = studentRecords.length;
      const percentage = Math.round((count / 10) * 100);

      return {
        ...student,
        className: parentClass ? parentClass.name : '-',
        attendedCount: count,
        percentage: Math.min(percentage, 100) // Caps at 100%
      };
    });

    // Sort by percentage descending
    return studentAttendanceCounts
      .sort((a, b) => b.percentage - a.percentage || b.name.localeCompare(a.name))
      .slice(0, 5);
  }, [students, attendance, classes]);

  // Get active feed: last 4 records entered
  const recentActivities = useMemo(() => {
    return [...attendance]
      .sort((a, b) => {
        const timeA = `${a.date}T${a.time}`;
        const timeB = `${b.date}T${b.time}`;
        return timeB.localeCompare(timeA);
      })
      .slice(0, 4);
  }, [attendance]);

  // Find students' details for recent feeds
  const recentActivitiesWithDetails = useMemo(() => {
    return recentActivities.map(record => {
      const student = students.find(s => s.id === record.studentId);
      const studentClass = student ? classes.find(c => c.id === student.classId) : null;
      return {
        ...record,
        studentName: student ? student.name : 'Siswa Terhapus',
        className: studentClass ? studentClass.name : '-',
        nis: student ? student.nis : '-',
      };
    });
  }, [recentActivities, students, classes]);

  // Max attendance value for chart scaling
  const maxChartValue = useMemo(() => {
    const vals = dailyTrends.flatMap(d => [d['Sholat Dhuha'], d['Sholat Dhuhur']]);
    return Math.max(...vals, 15);
  }, [dailyTrends]);

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            📊 Ringkasan Dasbor Karakter SMAN 1 Bantaran
          </h2>
          <p className="text-xs text-slate-500 font-medium font-sans">
            Real-time monitoring pembentukan disiplin & karakter spiritual siswa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right bg-emerald-50/80 border border-emerald-100 p-2 py-1.5 px-4 rounded-xl">
            <p className="text-[9px] text-slate-550 uppercase font-black tracking-widest text-[#064e3b]">
              Jumat Tracker
            </p>
            <p className="text-xs font-bold text-emerald-800">12 Juni 2026</p>
          </div>
          <button 
            onClick={() => onNavigate('scan')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <Activity size={14} className="animate-pulse" />
            + Mulai Presensi Scan
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* STATS 1: Total Siswa */}
        <motion.div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 flex items-center gap-4 animate-in fade-in duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="w-12 h-12 bg-emerald-100 text-[#064e3b] rounded-xl flex items-center justify-center text-xl font-bold italic font-mono shrink-0">
            Σ
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Siswa</p>
            <p className="text-xl font-black text-slate-950">{totalStudents}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{totalClasses} Kelas Aktif</p>
          </div>
        </motion.div>

        {/* STATS 2: Sholat Dhuha */}
        <motion.div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 flex items-center gap-4 animate-in fade-in duration-300 delay-75"
          whileHover={{ y: -2 }}
        >
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            ☀️
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hadir Dhuha</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-600">{todayDhuhaHadir}</span>
              <span className="text-[10px] font-bold text-slate-400">({dhuhaPercentage}%)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Sudah Scan Masuk</p>
          </div>
        </motion.div>

        {/* STATS 3: Sholat Dhuhur */}
        <motion.div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 flex items-center gap-4 animate-in fade-in duration-300 delay-150"
          whileHover={{ y: -2 }}
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            🕌
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hadir Dhuhur</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-950">{todayDhuhurHadir}</span>
              <span className="text-[10px] font-bold text-slate-400">({dhuhurPercentage}%)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Presensi Dzuhur</p>
          </div>
        </motion.div>

        {/* STATS 4: Target Kedisiplinan */}
        <motion.div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#064e3b] p-5 rounded-2xl shadow-sm border border-emerald-900 flex items-center justify-center text-white text-center animate-in fade-in duration-300 delay-200"
          whileHover={{ y: -2 }}
        >
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Target Kedisiplinan</p>
            <p className="text-2xl font-black">95%</p>
            <p className="text-[9px] text-[#22c55e] font-bold uppercase tracking-wide mt-1">Sistem Persis Baku</p>
          </div>
        </motion.div>

        {/* LARGE BENTO 1: Siswa Disiplin Teratas (Leaderboard) with mini charts inside */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-105 border-slate-100 overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
              <Award className="text-amber-500" size={15} />
              Siswa Disiplin Teratas
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">Mingguan</span>
          </div>
          
          <div className="p-5 flex-1 space-y-4">
            {topStudents.map((student, idx) => {
              const placeColors = [
                'bg-amber-550 bg-amber-500 text-white',
                'bg-slate-300 text-slate-800',
                'bg-amber-700 text-white',
                'bg-emerald-50 text-emerald-800',
                'bg-emerald-50 text-emerald-800'
              ];
              return (
                <div key={student.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-xs font-bold shrink-0 ${placeColors[idx] || 'bg-slate-50'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
                    <p className="text-[9px] text-slate-550 text-slate-500">{student.className}</p>
                  </div>
                  <div className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded shrink-0">
                    {student.percentage}%
                  </div>
                </div>
              );
            })}

            {/* Embedded Custom Monthly Chart matching the bento design mockup */}
            <div className="mt-5 p-4 bg-emerald-50/80 rounded-xl border border-emerald-100">
              <p className="text-[9px] text-emerald-850 font-extrabold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                📊 Grafik Kehadiran Bulanan
              </p>
              <div className="flex items-end gap-1 px-1 h-20">
                <div className="bg-emerald-250 bg-emerald-200 w-full rounded-t-sm h-[40%] hover:bg-emerald-300 transition" title="Senin"></div>
                <div className="bg-emerald-300 w-full rounded-t-sm h-[60%] hover:bg-emerald-450 transition" title="Selasa"></div>
                <div className="bg-emerald-350 bg-emerald-400 w-full rounded-t-sm h-[80%] hover:bg-emerald-500 transition" title="Rabu"></div>
                <div className="bg-emerald-500 w-full rounded-t-sm h-[95%] hover:bg-emerald-600 transition" title="Kamis"></div>
                <div className="bg-emerald-600 w-full rounded-t-sm h-[70%] hover:bg-emerald-700 transition" title="Jumat"></div>
                <div className="bg-emerald-750 bg-emerald-750 bg-emerald-700 w-full rounded-t-sm h-[85%] hover:bg-emerald-800 transition" title="Sabtu"></div>
              </div>
            </div>
          </div>
        </div>

        {/* LARGE BENTO 2: Analytical Daily Chart (Sholat Dhuha vs Dhuhur) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700 flex items-center gap-1.5">
                <Activity size={15} className="text-emerald-700" />
                Grafik Perkembangan Pembinaan Karakter
              </h3>
              <p className="text-[11px] text-gray-500 font-sans">Jumlah kehadiran Sholat Dhuha & Dhuhur (5 Hari Terakhir)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
                <span>Dhuha</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                <span>Dhuhur</span>
              </div>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-6 border-b border-gray-100 pb-1 px-4 relative">
            <div className="absolute inset-x-0 top-6 bottom-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-t border-dashed border-gray-150 w-full h-0"></div>
              <div className="border-t border-dashed border-gray-150 w-full h-0"></div>
              <div className="border-t border-dashed border-gray-150 w-full h-0"></div>
              <div className="border-t border-dashed border-gray-150 w-full h-0"></div>
            </div>

            {dailyTrends.map((d, idx) => {
              const dhuhaPct = Math.round((d['Sholat Dhuha'] / maxChartValue) * 100);
              const dhuhurPct = Math.round((d['Sholat Dhuhur'] / maxChartValue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                  <div className="flex justify-center items-end gap-2 w-full h-5/6">
                    <div className="w-6 sm:w-8 relative flex justify-center">
                      <motion.div
                        className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-t-lg shadow-sm transition-all relative group-hover:opacity-90"
                        style={{ height: `${dhuhaPct}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${dhuhaPct}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                      />
                      <span className="absolute -top-7 bg-emerald-950 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 font-medium shadow-md">
                        Dhuha: {d['Sholat Dhuha']}
                      </span>
                    </div>

                    <div className="w-6 sm:w-8 relative flex justify-center">
                      <motion.div
                        className="w-full bg-amber-500 hover:bg-amber-600 rounded-t-lg shadow-sm transition-all relative group-hover:opacity-90"
                        style={{ height: `${dhuhurPct}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${dhuhurPct}%` }}
                        transition={{ duration: 0.6, delay: (idx + 1) * 0.05 }}
                      />
                      <span className="absolute -top-7 bg-amber-950 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 font-medium shadow-md">
                        Dhuhur: {d['Sholat Dhuhur']}
                      </span>
                    </div>
                  </div>
                  <span className="text-between mt-3 text-[10px] font-black text-gray-400 tracking-wider text-center uppercase">
                    {d.dateStr}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 rounded-xl p-3 px-4 text-xs text-slate-600 font-medium border border-gray-150">
            <span className="flex items-center gap-1.5 leading-relaxed">
              <TrendingUp size={14} className="text-emerald-700 shrink-0" />
              Kehadiran Dhuha mengalami peningkatan paling stabil minggu ini.
            </span>
            <button 
              onClick={() => onNavigate('laporan')}
              className="text-emerald-750 hover:text-emerald-850 font-black flex items-center gap-0.5 cursor-pointer whitespace-nowrap ml-auto sm:ml-0"
            >
              Ubah Filter Rekap
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* LARGE BENTO 3: Active Live Absensi Logs Table structure for high aesthetic */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
               <Clock size={15} className="text-emerald-700" />
               Log Absensi Terbaru
             </h3>
             <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-amber-55 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold italic uppercase">
                  Sholat Dhuha
                </span>
             </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-slate-50/55 bg-slate-50 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-extrabold">Nama Siswa</th>
                  <th className="px-5 py-3 font-extrabold">Kelas</th>
                  <th className="px-5 py-3 font-extrabold">Waktu</th>
                  <th className="px-5 py-3 font-extrabold">Metode</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {recentActivitiesWithDetails.length > 0 ? (
                  recentActivitiesWithDetails.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-50">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{activity.studentName}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {activity.className} <span className="text-[10px] text-slate-400 font-mono ml-1">({activity.nis})</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{activity.time}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] leading-none px-2 py-1 rounded font-bold ${
                          activity.scanned 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                          {activity.id && (activity.scanned ? 'Barcode' : 'Manual')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-xs text-slate-400 font-medium">
                      Belum ada data presensi hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LARGE BENTO 4: Custom Action Scanning Mode Promo banner */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-emerald-600 rounded-2xl shadow-lg border border-emerald-700 p-5 flex text-white overflow-hidden relative justify-between">
          <div className="flex-1 z-10 flex flex-col justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Scanning Mode</p>
              <h4 className="text-lg font-bold mb-3">Ready to Scan Student Card</h4>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center border border-white/30 backdrop-blur-md">
                   <span className="text-xl">📷</span>
                </div>
                <div className="text-xs leading-tight">
                   <p className="font-semibold">Arahkan Barcode ke Kamera</p>
                   <p className="opacity-70 mt-1">Auto-detect NIS & Nama</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => onNavigate('scan')}
                className="bg-white text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition hover:bg-emerald-50 cursor-pointer"
              >
                Buka Scan Kamera
              </button>
              <button 
                onClick={() => onNavigate('manual')}
                className="bg-emerald-850 hover:bg-emerald-900 border border-emerald-800 text-white px-3 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Sebut Nama Manual
              </button>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center bg-black/10 rounded-lg border border-white/10 w-24 h-full">
            {/* Mock QR Code element */}
            <div className="w-16 h-16 bg-white p-1">
              <div className="w-full h-full border-2 border-slate-900 grid grid-cols-4 grid-rows-4 gap-0.5">
                <div className="bg-slate-900"></div><div></div><div className="bg-slate-900"></div><div className="bg-slate-900"></div>
                <div></div><div className="bg-slate-900"></div><div></div><div></div>
                <div className="bg-slate-900"></div><div></div><div className="bg-slate-900"></div><div></div>
                <div className="bg-slate-900"></div><div className="bg-slate-900"></div><div></div><div className="bg-slate-900"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* LARGE BENTO 5: Active Scheduled Activities List */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wide mb-1 text-slate-400">Aktivitas Terjadwal</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex gap-3">
              <div className="w-1 bg-amber-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase">Sholat Dhuha</p>
                <p className="text-[10px] text-slate-400">07:00 - 08:30 WIB</p>
              </div>
              <div className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded self-center">AKTIF</div>
            </div>

            <div className="flex gap-3">
              <div className="w-1 bg-blue-400 rounded-full opacity-30"></div>
              <div className="flex-1 opacity-50">
                <p className="text-xs font-bold uppercase animate-fade-in">Sholat Dhuhur</p>
                <p className="text-[10px] text-slate-400">12:00 - 13:30 WIB</p>
              </div>
              <div className="text-[9px] bg-slate-100 text-slate-400 font-bold px-2 py-1 rounded self-center">NANTI</div>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border border-emerald-100 text-[11px] leading-relaxed text-emerald-950 font-medium">
             💡 Tips: Gunakan sistem link Google Sheets di menu integrasi untuk menyinkronkan data presensi secara real-time.
          </div>
        </div>

      </div>
    </div>
  );
}
