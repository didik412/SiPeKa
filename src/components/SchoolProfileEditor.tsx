/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProfile } from '../types';
import { ShieldCheck, Save, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SchoolProfileEditorProps {
  profile: SchoolProfile;
  onUpdateProfile: (newProfile: SchoolProfile) => void;
}

export default function SchoolProfileEditor({ profile, onUpdateProfile }: SchoolProfileEditorProps) {
  const [formData, setFormData] = useState<SchoolProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang profil sekolah ke setelan baku SMAN 1 Bantaran?')) {
      const defaultProfile: SchoolProfile = {
        provinsi: 'PEMERINTAH PROVINSI JAWA TIMUR',
        dinas: 'DINAS PENDIDIKAN',
        namaSekolah: 'SMAN 1 BANTARAN',
        alamatSekolah: 'Jl. Tempuran No. 139 Tempuran, Bantaran, Kabupaten Probolinggo',
        kepalaSekolah: 'Drs. H. Wardoyo, M.Pd.',
        nipKepalaSekolah: '19670412 199403 1 008',
        websiteSekolah: 'sman1bantaran.sch.id',
        emailSekolah: 'sman1_bantaran@yahoo.co.id'
      };
      setFormData(defaultProfile);
      onUpdateProfile(defaultProfile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🏫 Pengaturan Profil & Kop Sekolah
          </h2>
          <p className="text-xs text-slate-550 text-slate-500 font-medium">
            Atur data instansi, kop surat rekapitulasi laporan, dan informasi tanda tangan Kepala Sekolah
          </p>
        </div>
      </header>

      {isSaved && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold shadow-sm"
        >
          <CheckCircle2 size={16} className="text-emerald-600 animate-bounce" />
          <span>Profil Sekolah berhasil disimpan! Seluruh kop surat laporan dan cetakan PDF sekarang diperbarui secara otomatis.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="text-emerald-700" size={18} />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Formulir Sunting Profil</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">Instansi Tingkat I (Provinsi):</label>
                <input
                  type="text"
                  name="provinsi"
                  required
                  value={formData.provinsi}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium text-gray-800"
                  placeholder="Contoh: PEMERINTAH PROVINSI JAWA TIMUR"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">Dinas / Instansi Menengah:</label>
                <input
                  type="text"
                  name="dinas"
                  required
                  value={formData.dinas}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium text-gray-800"
                  placeholder="Contoh: DINAS PENDIDIKAN"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-750">Nama Sekolah:</label>
              <input
                type="text"
                name="namaSekolah"
                required
                value={formData.namaSekolah}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-extrabold text-gray-900"
                placeholder="Contoh: SMAN 1 BANTARAN"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-750">Alamat Sekolah:</label>
              <textarea
                name="alamatSekolah"
                required
                rows={2}
                value={formData.alamatSekolah}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium text-gray-805"
                placeholder="Contoh: jl. Tempuran No. 139 Tempuran, Bantaran, Kabupaten Probolinggo"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">Kepala Sekolah:</label>
                <input
                  type="text"
                  name="kepalaSekolah"
                  required
                  value={formData.kepalaSekolah}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-semibold text-gray-800"
                  placeholder="Nama Kepala Sekolah beserta gelar"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">NIP Kepala Sekolah:</label>
                <input
                  type="text"
                  name="nipKepalaSekolah"
                  required
                  value={formData.nipKepalaSekolah}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono font-medium text-gray-800"
                  placeholder="Nomor Induk Pegawai"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">Situs Web Sekolah:</label>
                <input
                  type="text"
                  name="websiteSekolah"
                  value={formData.websiteSekolah}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium text-gray-800"
                  placeholder="sman1bantaran.sch.id"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">Email Sekolah:</label>
                <input
                  type="email"
                  name="emailSekolah"
                  value={formData.emailSekolah}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium text-gray-800"
                  placeholder="sman1_bantaran@yahoo.co.id"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer ml-auto"
              >
                <Save size={15} />
                Simpan Profil Sekolah
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 hover:bg-slate-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Setel Ulang ke Default
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
            <FileText className="text-slate-600" size={18} />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Preview Kop Resmi</span>
          </div>

          <div className="bg-white border border-gray-200/60 p-4 py-6 rounded-xl space-y-4 text-center select-none shadow-xs text-xs font-serif leading-tight">
            <div className="text-gray-900 border-b-2 border-double border-slate-800 pb-3">
              <p className="font-extrabold text-[10px] uppercase leading-none text-slate-600">{formData.provinsi || '-'}</p>
              <p className="font-bold text-[11px] uppercase leading-none mt-1 text-slate-705">{formData.dinas || '-'}</p>
              <p className="font-black text-xs uppercase leading-none mt-1 text-slate-900">{formData.namaSekolah || '-'}</p>
              <p className="text-[8px] font-sans text-slate-500 font-medium leading-normal mt-1 italic">
                {formData.alamatSekolah || '-'}
                {formData.emailSekolah && ` • Email: ${formData.emailSekolah}`}
                {formData.websiteSekolah && ` • Web: ${formData.websiteSekolah}`}
              </p>
            </div>
            
            <div className="pt-2 text-[9px] text-left space-y-1 max-w-[200px] mx-auto">
              <p className="font-sans font-bold text-slate-400 capitalize">Tanda Tangan Pengesahan:</p>
              <div className="h-10 border-b border-dashed border-slate-200 my-1"></div>
              <p className="font-bold text-slate-900 underline text-center">{formData.kepalaSekolah || '-'}</p>
              <p className="font-sans text-slate-500 font-medium text-center">NIP. {formData.nipKepalaSekolah || '-'}</p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl text-[10.5px] leading-relaxed border border-emerald-100">
            💡 <strong>Sistem Terintegrasi:</strong> Seluruh perubahan di halaman ini akan langsung disinkronkan ke dalam cetakan rekapitulasi laporan presensi wali kelas dan pihak humas sekolah.
          </div>
        </div>
      </div>
    </div>
  );
}
