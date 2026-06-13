/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Filter, 
  Calendar, 
  Users, 
  FileCheck,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Student, ClassGroup, AttendanceRecord, SchoolProfile } from '../types';
import SmanLogo from './SmanLogo';

interface ReportViewerProps {
  students: Student[];
  classes: ClassGroup[];
  attendance: AttendanceRecord[];
  schoolProfile?: SchoolProfile;
}

export default function ReportViewer({ students, classes, attendance, schoolProfile }: ReportViewerProps) {
  // Filters
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState('06'); // June defaults
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected class details
  const activeClass = useMemo(() => {
    return classes.find(c => c.id === selectedClassId);
  }, [classes, selectedClassId]);

  // Aggregate student attendance details for selected class, month, and year
  const studentReports = useMemo(() => {
    if (!selectedClassId) return [];

    // Filter students by class
    const classStudents = students.filter(s => s.classId === selectedClassId);

    // Filter records for the chosen month and year
    const monthPrefix = `${selectedYear}-${selectedMonth}`;
    const monthlyAttendance = attendance.filter(r => r.date.startsWith(monthPrefix));

    // For simplicity, let's assume there are 5 active instruction days in this month sample (e.g. June 8 to June 12)
    // with 2 core activities per day (Dhuha and Dhuhur), resulting in 10 potential sessions.
    const maxPossibleSessions = 10;

    return classStudents
      .map(student => {
        // Find attendance for this student
        const studentRecords = monthlyAttendance.filter(r => r.studentId === student.id);
        const hadirRecords = studentRecords.filter(r => r.status === 'Hadir');

        const dhuhaCount = hadirRecords.filter(r => r.activity === 'Sholat Dhuha').length;
        const dhuhurCount = hadirRecords.filter(r => r.activity === 'Sholat Dhuhur').length;
        const extraCount = hadirRecords.filter(r => r.activity !== 'Sholat Dhuha' && r.activity !== 'Sholat Dhuhur').length;

        // Status breakdowns
        const izinCount = studentRecords.filter(r => r.status === 'Izin').length;
        const sakitCount = studentRecords.filter(r => r.status === 'Sakit').length;
        const alfaCount = studentRecords.filter(r => r.status === 'Alfa').length;

        const totalHadir = dhuhaCount + dhuhurCount + extraCount;
        
        // Attendance Rate
        const rate = Math.round((totalHadir / maxPossibleSessions) * 100);

        return {
          ...student,
          dhuhaCount,
          dhuhurCount,
          extraCount,
          izinCount,
          sakitCount,
          alfaCount,
          totalHadir,
          attendanceRate: Math.min(rate, 100), // Caps at 100
        };
      })
      .filter(st => {
        return !searchQuery || st.name.toLowerCase().includes(searchQuery.toLowerCase()) || st.nis.includes(searchQuery);
      });
  }, [students, attendance, selectedClassId, selectedMonth, selectedYear, searchQuery]);

  // General class stats summaries
  const statsSummary = useMemo(() => {
    if (studentReports.length === 0) return { avgRate: 0, dhuhaTotal: 0, dhuhurTotal: 0 };
    const totalRate = studentReports.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    const dhuha = studentReports.reduce((acc, curr) => acc + curr.dhuhaCount, 0);
    const dhuhur = studentReports.reduce((acc, curr) => acc + curr.dhuhurCount, 0);
    return {
      avgRate: Math.round(totalRate / studentReports.length),
      dhuhaTotal: dhuha,
      dhuhurTotal: dhuhur
    };
  }, [studentReports]);

  // Execute print
  const handlePrint = () => {
    window.print();
  };

  const getMonthName = (num: string) => {
    const months: Record<string, string> = {
      '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
      '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
      '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };
    return months[num] || 'Sandi';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Filter size={16} />
            Filter Laporan Presensi
          </h2>
          <button
            onClick={handlePrint}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
          >
            <Printer size={15} />
            Cetak PDF / Print Laporan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          {/* Class Filter */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-750">Filter Kelas:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium h-9"
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map(cl => (
                <option key={cl.id} value={cl.id}>{cl.name}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-750">Pilih Bulan:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium h-9"
            >
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-750">Pilih Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium h-9"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {/* Search bar */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-750">Cari Nama / NIS:</label>
            <input
              type="text"
              placeholder="Ketik kata kunci pencarian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs h-9 font-medium outline-none text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Overview stats of selected filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Rata Kehadiran Kelas</span>
            <div className="text-xl font-extrabold text-emerald-950">{statsSummary.avgRate}%</div>
          </div>
          <CheckCircle size={20} className="text-emerald-700" />
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Total Dhuha Terlaksana</span>
            <div className="text-xl font-extrabold text-emerald-950">{statsSummary.dhuhaTotal} <span className="text-xs font-normal">Sesi</span></div>
          </div>
          <FileCheck size={20} className="text-emerald-700" />
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Total Dhuhur Terlaksana</span>
            <div className="text-xl font-extrabold text-emerald-950">{statsSummary.dhuhurTotal} <span className="text-xs font-normal">Sesi</span></div>
          </div>
          <FileCheck size={20} className="text-emerald-700" />
        </div>
      </div>

      {/* printable: true class custom CSS allows perfect PDF styling on screen print triggers */}
      {/* SMAN OFFICIAL REPORT DOCUMENT CONTAINER */}
      <div className="bg-white border border-gray-250/55 rounded-2xl shadow-lg p-8 sm:p-12 space-y-8 max-w-[800px] mx-auto overflow-hidden text-gray-900 border-dashed" id="sman-report-paper">
        
        {/* Document Header (Kop Surat) */}
        <div className="flex items-center gap-4 border-b-4 border-double border-emerald-900 pb-4 relative select-none">
          <SmanLogo size={70} />
          <div className="text-center flex-1 pr-6">
            <h1 className="text-emerald-950 font-black tracking-wider text-[13px] sm:text-[15px] uppercase leading-snug">
              {schoolProfile?.provinsi || 'PEMERINTAH PROVINSI JAWA TIMUR'}
            </h1>
            <h2 className="text-emerald-900 font-bold text-[12px] sm:text-[13px] uppercase tracking-wide leading-snug">
              {schoolProfile?.dinas || 'DINAS PENDIDIKAN'}
            </h2>
            <h3 className="text-emerald-950 text-base sm:text-lg font-black uppercase tracking-wide leading-snug">
              {schoolProfile?.namaSekolah || 'SMAN 1 BANTARAN'}
            </h3>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1 italic">
              {schoolProfile?.alamatSekolah || 'Jl. Tempuran No. 139 Tempuran, Bantaran, Kabupaten Probolinggo'}
              {schoolProfile?.emailSekolah && ` • Email: ${schoolProfile.emailSekolah}`}
              {schoolProfile?.websiteSekolah && ` • Website: ${schoolProfile.websiteSekolah}`}
            </p>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center space-y-1 pt-2">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#0c220f] underline">
            Laporan Bulanan Pembinaan Karakter Siswa
          </h3>
          <p className="text-xs text-gray-500 font-semibold uppercase">
            Bulan: {getMonthName(selectedMonth)} {selectedYear} • Kelas: {activeClass ? activeClass.name : '-'}
          </p>
        </div>

        {/* Student Details / Meta tables */}
        <div className="grid grid-cols-2 gap-4 text-xs font-serif">
          <div className="space-y-1 font-medium text-slate-705 font-sans">
            <div><span className="font-semibold text-gray-700">Satuan Pendidikan :</span> {schoolProfile?.namaSekolah || 'SMAN 1 Bantaran'}</div>
            <div><span className="font-semibold text-gray-700">Kabupaten/Kota :</span> Probolinggo, Jawa Timur</div>
          </div>
          <div className="space-y-1 font-medium text-slate-750 text-right font-sans">
            <div><span className="font-semibold text-gray-700">Periode Laporan :</span> Bulanan</div>
            <div><span className="font-semibold text-gray-700">Wali Kelas :</span> {activeClass?.waliKelas || '-'}</div>
          </div>
        </div>

        {/* Main Grid Table Results */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left border-collapse border border-gray-400">
            <thead>
              <tr className="bg-emerald-50 text-emerald-950 font-bold border-b border-gray-400 text-center uppercase">
                <th rowSpan={2} className="p-2 border border-gray-400 text-left">NIS</th>
                <th rowSpan={2} className="p-2 border border-gray-400 text-left">Nama Siswa</th>
                <th rowSpan={2} className="p-2 border border-gray-400">L/P</th>
                <th colSpan={3} className="p-1 border border-gray-400">Jumlah Hadir Sesi</th>
                <th colSpan={3} className="p-1 border border-gray-400">Ket. Absen</th>
                <th rowSpan={2} className="p-2 border border-gray-400">% Kehadiran</th>
              </tr>
              <tr className="bg-emerald-50 text-emerald-950 font-extrabold border-b border-gray-400 text-center">
                <th className="p-1 border border-gray-400 text-[10px]">Dhuha</th>
                <th className="p-1 border border-gray-400 text-[10px]">Dhuhur</th>
                <th className="p-1 border border-gray-400 text-[10px]">Lain</th>
                <th className="p-1 border border-gray-400 text-[10px]">Izin</th>
                <th className="p-1 border border-gray-400 text-[10px]">Sakit</th>
                <th className="p-1 border border-gray-400 text-[10px]">Alfa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 font-medium">
              {studentReports.length > 0 ? (
                studentReports.map((st, idx) => (
                  <tr key={st.id} className="text-gray-900 odd:bg-gray-50/50">
                    <td className="p-2 border border-gray-400 font-mono text-center font-bold">{st.nis}</td>
                    <td className="p-2 border border-gray-400 font-bold">{st.name}</td>
                    <td className="p-2 border border-gray-400 text-center font-bold">{st.gender}</td>
                    
                    {/* Hadir counts */}
                    <td className="p-2 border border-gray-400 text-center font-bold text-emerald-850">{st.dhuhaCount}</td>
                    <td className="p-2 border border-gray-400 text-center font-bold text-emerald-850">{st.dhuhurCount}</td>
                    <td className="p-2 border border-gray-400 text-center text-gray-500">{st.extraCount}</td>
                    
                    {/* Absen counts */}
                    <td className="p-2 border border-gray-400 text-center text-amber-700">{st.izinCount || '-'}</td>
                    <td className="p-2 border border-gray-400 text-center text-blue-700">{st.sakitCount || '-'}</td>
                    <td className="p-2 border border-gray-400 text-center text-rose-750 font-bold">{st.alfaCount || '-'}</td>
                    
                    {/* \% Rate */}
                    <td className="p-2 border border-gray-400 text-right font-extrabold text-emerald-950 text-xs">
                      {st.attendanceRate}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400 font-bold border border-gray-400">
                    Tidak ada siswa terdaftar pada filter kelas yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footnote / Note */}
        <div className="text-[10px] text-gray-500 leading-normal italic pt-2 border-t border-gray-150 select-none">
          * Catatan: Persentase kehadiran dihitung berdasarkan keikutsertaan aktif pada kegiatan harian wajib (Sholat Dhuha jam 07.15 WIB & Sholat Dhuhur berjamaah jam 12.15 WIB). Penghitungan dilakukan otomatis oleh Sistem Pembinaan Karakter SMAN 1 Bantaran.
        </div>

        {/* Signature Columns Block (Tanda Tangan) */}
        <div className="grid grid-cols-2 gap-8 text-xs pt-8 select-none">
          {/* Wali Kelas Signature Column */}
          <div className="space-y-16 text-center">
            <div className="space-y-1">
              <p className="text-gray-500 font-semibold mb-0.5">Mengetahui,</p>
              <h4 className="font-bold text-gray-950 uppercase">Wali Kelas {activeClass ? activeClass.name : ''}</h4>
            </div>
            
            <div className="space-y-0.5">
              <p className="font-black text-gray-900 border-b border-gray-900 max-w-[190px] mx-auto pb-1">
                {activeClass?.waliKelas || '🧑 (Belum Ditentukan)'}
              </p>
              <p className="text-[10px] text-gray-500">NIP. 19780521 200501 2 003</p>
            </div>
          </div>

          {/* Kepala Sekolah Signature Column */}
          <div className="space-y-16 text-center">
            <div className="space-y-1">
              <p className="text-gray-500 font-semibold mb-0.5">Mengesahkan,</p>
              <h4 className="font-bold text-gray-950 uppercase">Kepala {schoolProfile?.namaSekolah || 'SMAN 1 BANTARAN'}</h4>
            </div>

            <div className="space-y-0.5">
              <p className="font-black text-gray-900 border-b border-gray-900 max-w-[210px] mx-auto pb-1 truncate px-1">
                {schoolProfile?.kepalaSekolah || 'Drs. H. Wardoyo, M.Pd.'}
              </p>
              <p className="text-[10px] text-gray-500 font-sans">NIP. {schoolProfile?.nipKepalaSekolah || '19670412 199403 1 008'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Small Print Stamp */}
        <div className="flex justify-between items-center text-[8px] text-gray-400 font-bold select-none pt-4 border-t border-gray-100">
          <span>Dicetak melalui: Sistem Pembinaan Karakter SMAN 1 Bantaran</span>
          <span>Waktu Cetak: {new Date().toLocaleString('id-ID')}</span>
        </div>

      </div>
    </div>
  );
}
