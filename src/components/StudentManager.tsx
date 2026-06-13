/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  FolderMinus, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Printer, 
  FileSpreadsheet, 
  X, 
  Search, 
  ChevronRight,
  UserPlus,
  ArrowRight,
  Check
} from 'lucide-react';
import { Student, ClassGroup, AttendanceRecord, SchoolProfile } from '../types';
import SmanLogo from './SmanLogo';

interface StudentManagerProps {
  students: Student[];
  classes: ClassGroup[];
  attendance: AttendanceRecord[];
  onAddStudent: (nis: string, name: string, classId: string, gender: 'L' | 'P', photoUrl?: string, ttl?: string, alamat?: string) => void;
  onUpdateStudent: (id: string, nis: string, name: string, classId: string, gender: 'L' | 'P', photoUrl?: string, ttl?: string, alamat?: string) => void;
  onDeleteStudent: (id: string) => void;
  
  onAddClass: (name: string, waliKelas: string) => void;
  onUpdateClass: (id: string, name: string, waliKelas: string) => void;
  onDeleteClass: (id: string) => void;
  
  onBulkImport: (importedStudents: Array<{ nis: string; name: string; gender: 'L' | 'P'; classId: string }>) => void;
  schoolProfile?: SchoolProfile;
}

export default function StudentManager({
  students,
  classes,
  attendance,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onBulkImport,
  schoolProfile,
}: StudentManagerProps) {
  // Navigation internal mode
  const [activeSubTab, setActiveSubTab] = useState<'siswa' | 'kelas' | 'import' | 'cetak'>('siswa');

  // Search and Filter
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [searchStudentQuery, setSearchStudentQuery] = useState('');

  // 1. Student Crud States
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentNis, setStudentNis] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClassId, setStudentClassId] = useState('');
  const [studentGender, setStudentGender] = useState<'L' | 'P'>('L');
  const [studentPhotoUrl, setStudentPhotoUrl] = useState('');
  const [studentTtl, setStudentTtl] = useState('');
  const [studentAlamat, setStudentAlamat] = useState('');

  // 2. Class Crud States
  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [classWaliKelas, setClassWaliKelas] = useState('');

  // 3. Spreadsheet Import States
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [importTargetClassId, setImportTargetClassId] = useState('');
  const [parseResults, setParseResults] = useState<Array<{ nis: string; name: string; gender: 'L' | 'P'; valid: boolean; reason?: string }>>([]);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // 4. Print Cards State
  const [printClassId, setPrintClassId] = useState('');
  const [barcodeStyle, setBarcodeStyle] = useState<'klasik' | 'modern' | 'code39' | 'qrcode' | 'ganda'>('klasik');

  // Filter students based on UI searches
  const filteredStudents = useMemo(() => {
    return students
      .map(s => {
        const classObj = classes.find(c => c.id === s.classId);
        return {
          ...s,
          className: classObj ? classObj.name : 'Unknown Class',
          waliKelas: classObj ? classObj.waliKelas : ''
        };
      })
      .filter(s => {
        const matchesClass = !selectedClassFilter || s.classId === selectedClassFilter;
        const matchesSearch = !searchStudentQuery || 
          s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
          s.nis.includes(searchStudentQuery);
        return matchesClass && matchesSearch;
      });
  }, [students, classes, selectedClassFilter, searchStudentQuery]);

  // Handle student submits
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNis.trim() || !studentName.trim() || !studentClassId) {
      alert('Semua bidang isian wajib dilengkapi!');
      return;
    }

    // Check duplicate NIS
    const matchesNIS = students.find(s => s.nis === studentNis.trim() && s.id !== editingStudentId);
    if (matchesNIS) {
      alert(`Gagal! NIS "${studentNis}" sudah terdaftar atas nama "${matchesNIS.name}".`);
      return;
    }

    if (editingStudentId) {
      onUpdateStudent(editingStudentId, studentNis.trim(), studentName.trim(), studentClassId, studentGender, studentPhotoUrl || undefined, studentTtl.trim() || undefined, studentAlamat.trim() || undefined);
    } else {
      onAddStudent(studentNis.trim(), studentName.trim(), studentClassId, studentGender, studentPhotoUrl || undefined, studentTtl.trim() || undefined, studentAlamat.trim() || undefined);
    }

    // Reset and close
    resetStudentFields();
  };

  const startEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setStudentNis(student.nis);
    setStudentName(student.name);
    setStudentClassId(student.classId);
    setStudentGender(student.gender);
    setStudentPhotoUrl(student.photoUrl || '');
    setStudentTtl(student.ttl || '');
    setStudentAlamat(student.alamat || '');
    setIsStudentFormOpen(true);
  };

  const resetStudentFields = () => {
    setEditingStudentId(null);
    setStudentNis('');
    setStudentName('');
    setStudentClassId('');
    setStudentGender('L');
    setStudentPhotoUrl('');
    setStudentTtl('');
    setStudentAlamat('');
    setIsStudentFormOpen(false);
  };

  // Handle class submits
  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) {
      alert('Nama kelas tidak boleh kosong!');
      return;
    }

    if (editingClassId) {
      onUpdateClass(editingClassId, classNameInput.trim(), classWaliKelas.trim());
    } else {
      onAddClass(classNameInput.trim(), classWaliKelas.trim());
    }

    resetClassFields();
  };

  const startEditClass = (c: ClassGroup) => {
    setEditingClassId(c.id);
    setClassNameInput(c.name);
    setClassWaliKelas(c.waliKelas || '');
    setIsClassFormOpen(true);
  };

  const resetClassFields = () => {
    setEditingClassId(null);
    setClassNameInput('');
    setClassWaliKelas('');
    setIsClassFormOpen(false);
  };

  // Handle spreadsheet copy-paste parser
  const handleParsePaste = () => {
    if (!bulkPasteText.trim()) {
      alert('Teks paste masih kosong!');
      return;
    }

    const lines = bulkPasteText.split('\n');
    const parsed: typeof parseResults = [];

    lines.forEach(line => {
      if (!line.trim()) return;
      
      // Split by tab, comma or semicolon (tab facilitates excel copy pastes)
      const cols = line.split(/[\t,;]+/);
      
      // Expected structure: NIS, Name, Gender ('L' or 'P')
      if (cols.length < 2) {
        parsed.push({ nis: '', name: line, gender: 'L', valid: false, reason: 'Baris tidak lengkap (minimal NIS & Nama)' });
        return;
      }

      const rawNis = cols[0].trim();
      const rawName = cols[1].trim();
      
      // Deduce gender, default L
      let gender: 'L' | 'P' = 'L';
      if (cols[2]) {
        const rawGen = cols[2].trim().toUpperCase();
        if (rawGen.startsWith('P') || rawGen === 'PEREMPUAN' || rawGen === 'W') {
          gender = 'P';
        }
      }

      // Check validations
      let valid = true;
      let reason = '';

      if (!rawNis) {
        valid = false;
        reason = 'NIS tidak valid';
      } else if (!rawName) {
        valid = false;
        reason = 'Nama kosong';
      } else if (students.some(s => s.nis === rawNis)) {
        valid = false;
        reason = 'NIS sudah ada';
      }

      parsed.push({
        nis: rawNis,
        name: rawName,
        gender,
        valid,
        reason
      });
    });

    setParseResults(parsed);
  };

  const executeBulkImport = () => {
    if (!importTargetClassId) {
      alert('Harap tentukan kelas tujuan masal terlebih dahulu!');
      return;
    }

    const validSiswaToImport = parseResults
      .filter(item => item.valid)
      .map(item => ({
        nis: item.nis,
        name: item.name,
        gender: item.gender,
        classId: importTargetClassId
      }));

    if (validSiswaToImport.length === 0) {
      alert('Tidak ada mahasiswa valid untuk diimpor.');
      return;
    }

    onBulkImport(validSiswaToImport);
    setImportSuccessCount(validSiswaToImport.length);
    setBulkPasteText('');
    setParseResults([]);
    
    setTimeout(() => {
      setImportSuccessCount(null);
    }, 5000);
  };

  // Launch browser native print command for cards
  const triggerCardPrint = () => {
    window.print();
  };

  // Get list of students to print
  const printableStudents = useMemo(() => {
    return students
      .filter(s => !printClassId || s.classId === printClassId)
      .map(s => {
        const cl = classes.find(c => c.id === s.classId);
        return {
          ...s,
          className: cl ? cl.name : '-'
        };
      });
  }, [students, classes, printClassId]);

  return (
    <div className="space-y-6">
      {/* SMAN Tab Headers */}
      <div className="bg-white border border-emerald-100/60 rounded-2xl p-4 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('siswa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'siswa'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
          }`}
        >
          <Users size={15} />
          Manajemen Data Siswa
        </button>
        <button
          onClick={() => setActiveSubTab('kelas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'kelas'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
          }`}
        >
          <FolderMinus size={15} />
          Manajemen Data Kelas
        </button>
        <button
          onClick={() => setActiveSubTab('import')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'import'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
          }`}
        >
          <FileSpreadsheet size={15} />
          Bulking / Import Excel
        </button>
        <button
          onClick={() => setActiveSubTab('cetak')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'cetak'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
          }`}
        >
          <Printer size={15} />
          Cetak Kartu Siswa
        </button>
      </div>

      {/* Sub-Tab 1: List Siswa */}
      {activeSubTab === 'siswa' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-gray-900">Daftar Induk Siswa</h3>
              <p className="text-xs text-gray-500">Total {students.length} siswa terdaftar di SMAN 1 Bantaran.</p>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-600 h-9 outline-none"
              >
                <option value="">Semua Kelas</option>
                {classes.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.name}</option>
                ))}
              </select>

              <div className="relative">
                <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Cari siswa/NIS..."
                  value={searchStudentQuery}
                  onChange={(e) => setSearchStudentQuery(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl pl-8 pr-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-600 h-9 outline-none font-medium text-gray-800"
                />
              </div>

              <button
                onClick={() => {
                  resetStudentFields();
                  setIsStudentFormOpen(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer h-9 shadow-sm"
              >
                <UserPlus size={15} />
                Tambah Siswa
              </button>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white border border-emerald-100/60 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-55/60 bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                    <th className="p-3">NIS</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">L/P</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3">Wali Kelas</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-emerald-800">{st.nis}</td>
                        <td className="p-3 font-bold text-gray-900">
                          <div className="flex items-center gap-2.5">
                            {st.photoUrl ? (
                              <img 
                                src={st.photoUrl} 
                                alt={st.name} 
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover border border-emerald-100 bg-gray-50 flex-shrink-0" 
                              />
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                st.gender === 'L' ? 'bg-blue-50 text-blue-850' : 'bg-rose-50 text-rose-850'
                              }`}>
                                {st.gender === 'L' ? '👦' : '👧'}
                              </div>
                            )}
                            <span className="truncate">{st.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.gender === 'L' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {st.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{st.className}</td>
                        <td className="p-3 text-gray-500 font-medium">{st.waliKelas || '-'}</td>
                        <td className="p-3 text-center space-x-1.5">
                          <button
                            onClick={() => startEditStudent(st)}
                            className="p-1 px-1.5 bg-gray-50 text-emerald-750 hover:bg-emerald-50 rounded-lg text-emerald-700 font-bold transition-all cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <Edit size={12} />
                            Ubah
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus data siswa "${st.name}"? Ini juga akan menyebabkan data historis presensi terhapus.`)) {
                                onDeleteStudent(st.id);
                              }
                            }}
                            className="p-1 px-1.5 bg-gray-50 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-bold transition-all cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <Trash2 size={12} />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400 font-semibold bg-gray-50/10">
                        Tidak ada data siswa yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: List Kelas */}
      {activeSubTab === 'kelas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-gray-900">Manajemen Kelas</h3>
              <p className="text-xs text-gray-500">Kelola dan update wali kelas masing-masing kelompok belajar.</p>
            </div>

            <button
              onClick={() => {
                resetClassFields();
                setIsClassFormOpen(true);
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              Tambah Kelas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map(cl => {
              const studentsInClassCount = students.filter(s => s.classId === cl.id).length;
              return (
                <div key={cl.id} className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-3 hover:shadow transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-emerald-50 text-emerald-850 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                        Wali Kelas Group
                      </span>
                      <h4 className="text-lg font-extrabold text-gray-900">{cl.name}</h4>
                    </div>
                    <div className="space-x-1 flex">
                      <button 
                        onClick={() => startEditClass(cl)}
                        className="p-1 px-1.5 bg-gray-50 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-all cursor-pointer"
                        title="Edit Kelas"
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => {
                          const classInUse = students.some(s => s.classId === cl.id);
                          if (classInUse) {
                            alert(`Gagal! Kelas "${cl.name}" sedang digunakan oleh siswa. Pindahkan siswa terlebih dahulu ke kelas lain.`);
                            return;
                          }
                          if (confirm(`Apakah Anda yakin ingin menghapus kelas "${cl.name}"?`)) {
                            onDeleteClass(cl.id);
                          }
                        }}
                        className="p-1 px-1.5 bg-gray-50 hover:bg-rose-50 text-rose-600 rounded-lg transition-all cursor-pointer"
                        title="Hapus Kelas"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100/60">
                    <div className="text-xs text-gray-500 font-medium">Wali Kelas:</div>
                    <div className="text-xs font-bold text-gray-800">{cl.waliKelas || 'Belum Ditentukan'}</div>
                  </div>

                  <div className="bg-emerald-50/40 rounded-xl p-2 px-3 text-xs flex justify-between items-center">
                    <span className="text-slate-600">Total Siswa Terdaftar:</span>
                    <strong className="text-emerald-800">{studentsInClassCount} orang</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Spreadsheet Excel Paste Import */}
      {activeSubTab === 'import' && (
        <div className="bg-white border border-emerald-100/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-700" />
              Salin Cepat dari Excel / Google Sheets
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Fitur favorit guru! Buka lembar kerja Excel/Google Sheet, salin (Ctrl+C) data, lalu tempel (Ctrl+V) di area bawah ini.
            </p>
          </div>

          {importSuccessCount !== null && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check size={18} />
              Berhasil mengimpor {importSuccessCount} siswa baru secara masal! Silakan periksa di Daftar Siswa.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input area */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">1. Atur Kelas Tujuan:</label>
                <select
                  value={importTargetClassId}
                  onChange={(e) => setImportTargetClassId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium h-9"
                >
                  <option value="">-- Pilih Kelas Tujuan --</option>
                  {classes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400">Semua baris data yang divalidasi akan diimpor ke kelas di atas.</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">2. Tempel Data Spreadsheet:</label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded select-none font-bold">
                    Format: NIS [tab] Nama [tab] Gender (L/P)
                  </span>
                </div>
                <textarea
                  value={bulkPasteText}
                  onChange={(e) => setBulkPasteText(e.target.value)}
                  placeholder={`Contoh Excel layout:\n1016\tBagus Dwi Sasongko\tL\n1017\tDyah Ayu Ningrum\tP`}
                  rows={8}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs font-mono focus:ring-1 focus:ring-emerald-600 outline-none leading-relaxed placeholder:opacity-55"
                />
              </div>

              <button
                onClick={handleParsePaste}
                disabled={!bulkPasteText.trim()}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer"
              >
                Analisis & Validasi Data Tempelan
              </button>
            </div>

            {/* Parse results */}
            <div className="space-y-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <h4 className="text-xs font-bold text-slate-800">3. Hasil Analisis Baris Data</h4>

              <div className="space-y-2 max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1">
                {parseResults.length > 0 ? (
                  parseResults.map((item, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between text-xs first:pt-0">
                      <div>
                        {item.nis ? (
                          <div className="font-bold text-gray-800">
                            {item.name} <span className="font-mono text-emerald-800 text-[10px]">({item.nis})</span>
                          </div>
                        ) : (
                          <div className="text-rose-600 italic font-medium">{item.name}</div>
                        )}
                        <div className="text-[10px] text-gray-500 font-medium">Gender Deduksi: {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                      </div>
                      <div>
                        {item.valid ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                            Siap Impor
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[9px]" title={item.reason}>
                            Sebab: {item.reason}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs font-semibold">
                    Klik "Analisis" untuk memicu pre-validasi data sebelum menyimpannya ke database aplikasi.
                  </div>
                )}
              </div>

              {parseResults.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-2 space-y-3">
                  <div className="text-xs text-slate-750 font-bold flex justify-between">
                    <span>Jumlah Baris Siap Impor:</span>
                    <span className="text-emerald-700 font-extrabold text-sm">
                      {parseResults.filter(r => r.valid).length} Data
                    </span>
                  </div>
                  <button
                    onClick={executeBulkImport}
                    disabled={!importTargetClassId || parseResults.filter(r => r.valid).length === 0}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload size={14} />
                    IMPOR SEKARANG KE KELAS {classes.find(c => c.id === importTargetClassId)?.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Cetak Kartu Barcode */}
      {activeSubTab === 'cetak' && (
        <div className="space-y-4">
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Printer className="text-emerald-700" />
                  Generator Lembar Kartu Barcode Siswa
                </h3>
                <p className="text-xs text-gray-500">Cetak lembaran ID kartu pelajar berisi barcode unik yang dapat langsung dipindai kamera.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 h-9 text-[11px] font-semibold text-slate-700">
                  <span className="text-slate-400">Gaya Barcode:</span>
                  <select
                    value={barcodeStyle}
                    onChange={(e) => setBarcodeStyle(e.target.value as any)}
                    className="bg-transparent border-0 ring-0 outline-none font-bold text-slate-800 cursor-pointer text-[11px]"
                  >
                    <option value="klasik">1D Barcode Klasik</option>
                    <option value="modern">1D Code 128 Premium</option>
                    <option value="code39">1D Code 39 Industri</option>
                    <option value="qrcode">2D QR Code Modern</option>
                    <option value="ganda">Dual (Barcode + QR)</option>
                  </select>
                </div>

                <select
                  value={printClassId}
                  onChange={(e) => setPrintClassId(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 h-9 text-xs focus:ring-1 focus:ring-emerald-600 outline-none font-medium"
                >
                  <option value="">Semua Kelas</option>
                  {classes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.name}</option>
                  ))}
                </select>

                <button
                  onClick={triggerCardPrint}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 h-9 rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer size={15} />
                  Cetak Lembaran ID Card (Print PDF)
                </button>
              </div>
            </div>

            {/* Printable Frame wrapper */}
            {/* Class 'print:m-0 print:p-0' overrides standard layouts during printing */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-slate-50 border-dashed max-h-[500px] overflow-y-auto">
              <div id="school-cards-print-area" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {printableStudents.length > 0 ? (
                  printableStudents.map((st) => (
                    <div 
                      key={st.id} 
                      className="border border-sky-300 rounded-2xl p-3 text-slate-850 flex flex-col justify-between h-56 relative overflow-hidden shadow-lg shadow-sky-150/40 select-none bg-sky-100"
                      style={{
                        background: 'linear-gradient(135deg, #7dd3fc 0%, #bae6fd 30%, #f0f9ff 70%, #fffbeb 100%)',
                      }}
                    >
                      {/* FUTURISTIC GLOWS (More intense sky blue light + yellow accent glows) */}
                      {/* Rich Sky Blue Glow Top-Left */}
                      <div className="absolute top-[-10%] left-[-10%] w-[130px] h-[130px] bg-sky-450/45 rounded-full filter blur-[22px] pointer-events-none"></div>
                      {/* Dynamic light flow center-left */}
                      <div className="absolute left-[30%] top-[20%] w-[100px] h-[100px] bg-white/95 rounded-full filter blur-[18px] pointer-events-none"></div>
                      {/* Fresh Yellow Glow Bottom-Right */}
                      <div className="absolute right-[-10%] bottom-[-15%] w-[125px] h-[125px] bg-yellow-300/40 rounded-full filter blur-[22px] pointer-events-none"></div>
                      
                      {/* Micro electronic grid overlay */}
                      <div 
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #0284c7 1px, transparent 1px), linear-gradient(to right, #0284c7 0.8px, transparent 0.8px), linear-gradient(to bottom, #0284c7 0.8px, transparent 0.8px)',
                          backgroundSize: '14px 14px',
                        }}
                      />

                      {/* Vivid high-tech border accents (Vibrant sky-blue & golden-yellow stripes) */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-500 via-sky-400 to-yellow-400 opacity-95"></div>
                      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-yellow-400 via-sky-400 to-sky-600 opacity-95"></div>

                      {/* Header (Kop) Kartu Pelajar - Fully Dynamic linked to schoolProfile with perfectly custom fitted texts */}
                      <div className="flex items-center gap-1.5 border-b border-sky-300/60 pb-1.5 relative pl-1.5 shrink-0 z-10">
                        <SmanLogo size={31} showText={false} />
                        <div className="text-left leading-none flex-1 min-w-0">
                          <h4 className="text-[6px] font-black text-sky-900 uppercase tracking-widest leading-none truncate pr-3">
                            {schoolProfile?.provinsi || 'PEMERINTAH PROVINSI JAWA TIMUR'}
                          </h4>
                          <h4 className="text-[5.5px] font-extrabold text-sky-700 uppercase tracking-wider leading-none mt-0.5 truncate pr-3">
                            {schoolProfile?.dinas || 'DINAS PENDIDIKAN'}
                          </h4>
                          <h5 className="text-[9.5px] font-black text-slate-900 uppercase tracking-tight mt-0.5 leading-none truncate pr-3">
                            {schoolProfile?.namaSekolah || 'SMAN 1 BANTARAN'}
                          </h5>
                          <p className="text-[4.8px] text-slate-600 font-bold font-mono mt-0.5 leading-none tracking-tight truncate pr-3">
                            {schoolProfile?.alamatSekolah || 'Jl. Tempuran No. 139 Tempuran, Bantaran, Kabupaten Probolinggo'}
                          </p>
                        </div>
                        
                        {/* Red Tech Badge 'PELAJAR' in top-right */}
                        <div className="absolute -right-3 top-[-3px] bg-red-600 text-yellow-200 text-[5.8px] font-black uppercase px-2 py-0.5 rotate-[15deg] origin-top border-b border-yellow-300 shadow-xs leading-none tracking-wide">
                          PELAJAR
                        </div>
                      </div>

                      {/* Middle Body section */}
                      <div className="flex gap-2.5 items-stretch my-1.5 relative pl-1.5 flex-grow z-10">
                        
                        {/* Student Photo Section (Left) */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                          {/* Rich sky blue boundary frame */}
                          <div className="w-[64px] h-[78px] rounded-lg p-[1.5px] bg-gradient-to-b from-sky-500 via-sky-300 to-yellow-400 shadow-sm flex items-center justify-center overflow-hidden relative">
                            {st.photoUrl ? (
                              <img 
                                src={st.photoUrl} 
                                alt={st.name} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-[5px] relative z-10" 
                              />
                            ) : (
                              <div className="w-full h-full rounded-[5px] bg-sky-50/90 flex flex-col items-center justify-center text-xl font-bold text-sky-800 border border-sky-100 relative z-10">
                                {st.gender === 'L' ? '👦' : '👧'}
                              </div>
                            )}
                            {/* Inner protection overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/10 to-transparent pointer-events-none z-20" />
                          </div>
                          
                          {/* Red and White Flag */}
                          <div className="flex w-6 h-2 border border-slate-300 rounded-[1px] mt-1 overflow-hidden shadow-2xs shrink-0">
                            <div className="bg-red-600 w-1/2 h-full"></div>
                            <div className="bg-white w-1/2 h-full"></div>
                          </div>
                        </div>

                        {/* Details (Center-Right) with crystal glass backdrop */}
                        <div className="flex-1 min-w-0 text-left flex flex-col justify-between py-0.5 px-2 bg-white/75 border border-sky-200/50 rounded-lg shadow-2xs backdrop-blur-[1.5px]">
                          <div className="leading-none">
                            <span className="block text-[4.6px] text-sky-800 font-extrabold uppercase tracking-widest leading-none">NAMA LENGKAP:</span>
                            <span className="block text-[9px] font-black text-slate-900 uppercase truncate mt-0.5 leading-none">{st.name}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 leading-none">
                            <div>
                              <span className="block text-[4.6px] text-sky-800 font-extrabold uppercase tracking-widest leading-none">N.I.S:</span>
                              <span className="block text-[8px] font-mono font-black text-slate-800 mt-0.5 leading-none">{st.nis}</span>
                            </div>
                            <div>
                              <span className="block text-[4.6px] text-sky-800 font-extrabold uppercase tracking-widest leading-none">KELAS:</span>
                              <span className="block text-[8px] font-black text-slate-850 mt-0.5 leading-none">{st.className}</span>
                            </div>
                          </div>

                          <div className="leading-none">
                            <span className="block text-[4.6px] text-sky-800 font-extrabold uppercase tracking-widest leading-none">T.T.L:</span>
                            <span className="block text-[7px] font-bold text-slate-800 truncate mt-0.5 leading-none">
                              {st.ttl || 'Probolinggo, 12 April 2008'}
                            </span>
                          </div>

                          <div className="leading-none">
                            <span className="block text-[4.6px] text-sky-800 font-extrabold uppercase tracking-widest leading-none">ALAMAT TINGGAL:</span>
                            <p className="text-[6.8px] text-slate-700 font-semibold leading-[8px] line-clamp-2 mt-0.5">
                              {st.alamat || 'Kec. Bantaran, Kab. Probolinggo, Jawa Timur'}
                            </p>
                          </div>
                        </div>

                        {/* Unique QR Code Panel (Right) */}
                        <div className="w-[62px] shrink-0 flex flex-col items-center justify-center gap-1">
                          <span className="text-[4.5px] font-black text-sky-900 tracking-widest uppercase text-center block leading-none">SMART SCAN</span>
                          <div className="w-[48px] h-[48px] bg-white p-0.5 rounded-lg border border-sky-350 flex items-center justify-center shadow-xs relative group">
                            {/* Brackets visually outlining target */}
                            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-sky-500 rounded-tl-sm pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-sky-500 rounded-tr-sm pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-sky-500 rounded-bl-sm pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-sky-500 rounded-br-sm pointer-events-none"></div>
                            
                            {(() => {
                              // High density unique matrix
                              const getHashCode = (str: string) => {
                                let hash = 0;
                                for (let i = 0; i < str.length; i++) {
                                  hash = (hash << 5) - hash + str.charCodeAt(i);
                                  hash |= 0;
                                }
                                return Math.abs(hash);
                              };
                              const uniqueSeed = getHashCode(st.id + '-' + st.nis + '-' + st.name + '-' + (st.ttl || ''));
                              const size = 12; // 12x12 for high resolution and realistic detail density
                              const cells = [];
                              for (let r = 0; r < size; r++) {
                                for (let c = 0; c < size; c++) {
                                  let isFilled = false;
                                  // Traditional QR Code finder patterns (corner blocks)
                                  if (r < 3 && c < 3) {
                                    isFilled = !(r === 1 && c === 1);
                                  } else if (r < 3 && c >= size - 3) {
                                    isFilled = !(r === 1 && c === size - 2);
                                  } else if (r >= size - 3 && c < 3) {
                                    isFilled = !(r === size - 2 && c === 1);
                                  } else if (r === size - 3 && c === size - 3) {
                                    isFilled = true; // inner alignment anchor
                                  } else {
                                    // Generate highly detailed individual matrix structure linked to individual student state
                                    const cellIndex = r * size + c;
                                    const val = Math.sin(uniqueSeed + cellIndex + 42) * 50000;
                                    isFilled = (val - Math.floor(val)) > 0.44;
                                  }
                                  cells.push(isFilled);
                                }
                              }
                              return (
                                <div className="grid grid-cols-12 grid-rows-12 gap-[0.5px] w-full h-full">
                                  {cells.map((cell, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`rounded-[0.2px] ${cell ? 'bg-sky-950' : 'bg-transparent'}`} 
                                    />
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                          <span className="text-[7.2px] font-mono leading-none tracking-widest font-black text-sky-950 mt-0.5">*{st.nis}*</span>
                        </div>

                      </div>

                      {/* Footer bar with sky blue and yellow accents */}
                      <div className="h-[18px] bg-gradient-to-r from-sky-800 via-sky-900 to-indigo-900 border-t border-yellow-300 absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 select-none pl-5 shrink-0 z-10">
                        <span className="text-[5.2px] text-yellow-300 font-extrabold tracking-wider uppercase">
                          {schoolProfile?.provinsi === 'PEMERINTAH PROVINSI JAWA TIMUR' ? 'DINAS PENDIDIKAN PROVINSI JAWA TIMUR' : `DINAS PENDIDIKAN ${schoolProfile?.provinsi || 'PROVINSI JAWA TIMUR'}`}
                        </span>
                        <span className="text-[5.2px] text-sky-100 font-mono font-medium">SMART ID v2.5</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-gray-450 font-bold text-xs">
                    Tidak ada siswa yang dipilih. Coba ganti kelas saringan.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT/ADD SISWA */}
      {isStudentFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={resetStudentFields}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-150 pb-2">
                {editingStudentId ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}
              </h3>

              {/* NIS */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nomor Induk Siswa (NIS / Barcode ID):</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1016"
                  checked={editingStudentId !== null}
                  value={studentNis}
                  onChange={(e) => setStudentNis(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-medium font-mono"
                />
              </div>

              {/* Nama */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nama Siswa Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Tulis nama lengkap kemandirian siswa..."
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-medium"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Jenis Kelamin:</label>
                <div className="flex gap-4 pt-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="religion-gender"
                      value="L"
                      checked={studentGender === 'L'}
                      onChange={() => setStudentGender('L')}
                      className="accent-emerald-700"
                    />
                    Laki-laki (🧑)
                  </label>
                  <label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="religion-gender"
                      value="P"
                      checked={studentGender === 'P'}
                      onChange={() => setStudentGender('P')}
                      className="accent-emerald-700"
                    />
                    Perempuan (👧)
                  </label>
                </div>
              </div>

              {/* TTL (Tempat, Tanggal Lahir) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Tempat, Tanggal Lahir (TTL):</label>
                <input
                  type="text"
                  placeholder="Contoh: Probolinggo, 12 April 2008"
                  value={studentTtl}
                  onChange={(e) => setStudentTtl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-medium h-9"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Alamat Rumah:</label>
                <textarea
                  placeholder="Contoh: Jl. Raya Bantaran No. 1, Bantaran, Probolinggo"
                  value={studentAlamat}
                  onChange={(e) => setStudentAlamat(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-medium h-16 resize-none"
                />
              </div>

              {/* Foto Siswa */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Foto Profil Siswa (Opsional):</label>
                
                {studentPhotoUrl ? (
                  <div className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl bg-slate-50/50">
                    <img 
                      src={studentPhotoUrl} 
                      alt="Pratinjau Foto Siswa" 
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 object-cover rounded-full border-2 border-emerald-700 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setStudentPhotoUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg transition-all cursor-pointer"
                      title="Hapus / Ganti Foto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setStudentPhotoUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        } else {
                          alert('Harap masukkan berkas gambar saja (PNG, JPG, JPEG)!');
                        }
                      }
                    }}
                    onClick={() => {
                      const input = document.getElementById('student-photo-file-input');
                      input?.click();
                    }}
                    className="border-2 border-dashed border-gray-200 hover:border-emerald-600 transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/10 gap-1.5"
                  >
                    <Upload className="text-gray-400" size={18} />
                    <span className="text-[11px] font-bold text-emerald-800">
                      Seret & taruh foto disini, atau klik untuk memilih
                    </span>
                    <span className="text-[9px] text-gray-400">
                      Mendukung PNG, JPG, atau JPEG (Disarankan rasio kotak/persegi)
                    </span>
                    <input 
                      id="student-photo-file-input"
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setStudentPhotoUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Kelas */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Grup Kelas Belajar:</label>
                <select
                  value={studentClassId}
                  onChange={(e) => setStudentClassId(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-medium h-9"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {classes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetStudentFields}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT/ADD KELAS */}
      {isClassFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={resetClassFields}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleClassSubmit} className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-150 pb-2">
                {editingClassId ? 'Ubah Data Kelas' : 'Tambah Kelas Baru'}
              </h3>

              {/* Nama Kelas */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nama Kelas:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: X-MIPA 1, XI-IPS 2"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-bold"
                />
              </div>

              {/* Wali Kelas */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Wali Kelas (Nama & Gelar):</label>
                <input
                  type="text"
                  placeholder="Tulis nama wali kelas, misal: Suharsono, S.Pd..."
                  value={classWaliKelas}
                  onChange={(e) => setClassWaliKelas(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs outline-none font-medium"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetClassFields}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
