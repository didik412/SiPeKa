/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Keyboard, 
  Calendar, 
  Plus, 
  CheckCircle, 
  ListTodo, 
  Trash2, 
  Search, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Student, ClassGroup, AttendanceRecord, AttendanceStatus, AttendanceActivity } from '../types';

interface ManualInputProps {
  students: Student[];
  classes: ClassGroup[];
  attendance: AttendanceRecord[];
  onAddManualAttendance: (
    studentId: string, 
    activity: string, 
    status: AttendanceStatus, 
    date: string, 
    time: string,
    scanned: boolean
  ) => void;
  onDeleteAttendance: (id: string) => void;
}

export default function ManualInput({ 
  students, 
  classes, 
  attendance, 
  onAddManualAttendance, 
  onDeleteAttendance 
}: ManualInputProps) {
  // Form States
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('Sholat Dhuha');
  const [customActivity, setCustomActivity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('Hadir');
  const [selectedDate, setSelectedDate] = useState('2026-06-12'); // Fixed target date
  const [selectedTime, setSelectedTime] = useState('08:00');

  // Filter states for historic list
  const [historyClassId, setHistoryClassId] = useState('');
  const [searchHistoryName, setSearchHistoryName] = useState('');

  // Feedbacks
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filter student list by selected class
  const filteredStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Handle submissions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedClassId) {
      setErrorMessage('Silakan pilih kelas terlebih dahulu.');
      return;
    }
    if (!selectedStudentId) {
      setErrorMessage('Silakan pilih nama siswa.');
      return;
    }

    const finalActivity = selectedActivity === 'Kegiatan Tambahan' ? (customActivity.trim() || 'Kegiatan Tambahan') : selectedActivity;

    // Check if attendance already exists for this student on the same date + activity
    const isDuplicate = attendance.some(
      r => r.studentId === selectedStudentId && 
           r.date === selectedDate && 
           r.activity === finalActivity
    );

    if (isDuplicate) {
      const matchStud = students.find(s => s.id === selectedStudentId);
      setErrorMessage(`Data presensi "${finalActivity}" untuk siswa "${matchStud?.name}" pada tanggal ${selectedDate} sudah tercatat.`);
      return;
    }

    // Auto append seconds for standard HH:mm:ss format
    const formattedTime = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;

    onAddManualAttendance(
      selectedStudentId,
      finalActivity,
      selectedStatus,
      selectedDate,
      formattedTime,
      false // manual entry
    );

    const studentRecord = students.find(s => s.id === selectedStudentId);
    setSuccessMessage(`Berhasil mencatatkan presensi manual (${selectedStatus}) untuk ${studentRecord?.name}.`);
    
    // Reset form selectively (keep class and activity selected for speed)
    setSelectedStudentId('');
    if (selectedActivity === 'Kegiatan Tambahan') {
      setCustomActivity('');
    }

    // Clear alert after 4s
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // Prepare manual attendance history list for tabular preview
  const manualRecords = useMemo(() => {
    // Sort reverse chronological
    return [...attendance]
      .filter(r => !r.scanned) // only manual entries
      .map(rec => {
        const studentObj = students.find(s => s.id === rec.studentId);
        const classObj = studentObj ? classes.find(c => c.id === studentObj.classId) : null;
        return {
          ...rec,
          studentName: studentObj ? studentObj.name : 'Unknown Siswa',
          nis: studentObj ? studentObj.nis : '-',
          className: classObj ? classObj.name : '-',
          classId: studentObj ? studentObj.classId : ''
        };
      })
      .filter(rec => {
        const matchClass = !historyClassId || rec.classId === historyClassId;
        const matchName = !searchHistoryName || rec.studentName.toLowerCase().includes(searchHistoryName.toLowerCase()) || rec.nis.includes(searchHistoryName);
        return matchClass && matchName;
      })
      .sort((a, b) => {
        const timeA = `${a.date}T${a.time}`;
        const timeB = `${b.date}T${b.time}`;
        return timeB.localeCompare(timeA);
      });
  }, [attendance, students, classes, historyClassId, searchHistoryName]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Input Form Panel (1 cols) */}
      <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Keyboard className="text-emerald-700" size={18} />
            Input Presensi Manual
          </h2>
          <p className="text-xs text-gray-500">
            Gunakan form ini untuk mencatatkan kehadiran siswa secara manual jika berhalangan scan barcode.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2 font-semibold">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2 font-semibold animate-pulse">
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Filter Kelas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">1. Pilih Kelas:</label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedStudentId('');
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium"
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map(cl => (
                <option key={cl.id} value={cl.id}>{cl.name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Pilih Siswa */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">2. Pilih Siswa:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              disabled={!selectedClassId}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none disabled:opacity-55 disabled:cursor-not-allowed font-medium"
            >
              <option value="">-- Pilih Nama Siswa --</option>
              {filteredStudents.map(st => (
                <option key={st.id} value={st.id}>{st.name} ({st.nis})</option>
              ))}
            </select>
          </div>

          {/* Step 3: Jenis Kegiatan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">3. Jenis Kegiatan:</label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium"
            >
              <option value="Sholat Dhuha">Sholat Dhuha</option>
              <option value="Sholat Dhuhur">Sholat Dhuhur</option>
              <option value="Kegiatan Tambahan">Kegiatan Tambahan (Tulis Manual)</option>
            </select>

            {selectedActivity === 'Kegiatan Tambahan' && (
              <input
                type="text"
                placeholder="Tulis kegiatan tambahan, misal: Kultum Al-Kahfi..."
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-medium placeholder:text-gray-400 mt-2"
                required
              />
            )}
          </div>

          {/* Step 4: Status Kehadiran */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">4. Status Presensi:</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Hadir', 'Izin', 'Sakit', 'Alfa'] as AttendanceStatus[]).map((status) => {
                const statusStyles = {
                  Hadir: {
                    active: 'bg-emerald-600 border-emerald-600 text-white',
                    inactive: 'bg-white border-gray-200 text-emerald-800 hover:bg-emerald-50/50'
                  },
                  Izin: {
                    active: 'bg-amber-500 border-amber-500 text-white',
                    inactive: 'bg-white border-gray-200 text-amber-700 hover:bg-amber-50/50'
                  },
                  Sakit: {
                    active: 'bg-blue-600 border-blue-600 text-white',
                    inactive: 'bg-white border-gray-200 text-blue-700 hover:bg-blue-50/50'
                  },
                  Alfa: {
                    active: 'bg-rose-600 border-rose-600 text-white',
                    inactive: 'bg-white border-gray-200 text-rose-700 hover:bg-rose-50/50'
                  }
                };

                const currentStyle = selectedStatus === status ? statusStyles[status].active : statusStyles[status].inactive;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`border rounded-xl py-2.5 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${currentStyle}`}
                  >
                    {selectedStatus === status && <Check size={14} />}
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Tanggal & Jam */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-650">Tanggal:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-650">Jam Baku:</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition duration-200 shadow flex items-center justify-center gap-1.5 pt-3.5 cursor-pointer"
          >
            <Plus size={16} />
            SIMPAN PRESENSI MANUAL
          </button>
        </form>
      </div>

      {/* Right Table Panel: Filterable Manuel Records Log History (2 cols) */}
      <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ListTodo size={18} className="text-emerald-700" />
              Histori Pencatatan Manual
            </h3>
            <p className="text-xs text-gray-500">Menampilkan daftar presensi manual wali kelas / guru bimbingan siswa.</p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <select
              value={historyClassId}
              onChange={(e) => setHistoryClassId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium h-8"
            >
              <option value="">Semua Kelas</option>
              {classes.map(cl => (
                <option key={cl.id} value={cl.id}>{cl.name}</option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-2.5 top-1.5 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Cari nama/NIS..."
                value={searchHistoryName}
                onChange={(e) => setSearchHistoryName(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium h-8"
              />
            </div>
          </div>
        </div>

        {/* Desktop and Mobile Friendly Table logs */}
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                <th className="p-3">Siswa</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Kegiatan</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Waktu Log</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {manualRecords.length > 0 ? (
                manualRecords.map((rec) => {
                  const statusColors = {
                    Hadir: 'bg-emerald-50 text-emerald-800 border-emerald-100',
                    Izin: 'bg-amber-50 text-amber-800 border-amber-100',
                    Sakit: 'bg-blue-50 text-blue-800 border-blue-100',
                    Alfa: 'bg-rose-50 text-rose-800 border-rose-100'
                  };

                  return (
                    <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 font-semibold text-gray-900">
                        <div>{rec.studentName}</div>
                        <div className="text-[10px] text-gray-400 font-medium font-mono">NIS {rec.nis}</div>
                      </td>
                      <td className="p-3 text-gray-600 font-medium">{rec.className}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">{rec.activity}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusColors[rec.status]}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-500">
                        <div className="font-medium">{rec.date}</div>
                        <div className="text-[10px] font-mono">{rec.time}</div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus catatan manual kegiatan "${rec.activity}" untuk "${rec.studentName}"?`)) {
                              onDeleteAttendance(rec.id);
                            }
                          }}
                          className="p-1 px-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Hapus Log"
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 font-semibold bg-gray-50/20">
                    Tidak ditemukan data pencatatan presensi manual yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
