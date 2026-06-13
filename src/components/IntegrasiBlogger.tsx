/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  HelpCircle, 
  Layout, 
  Smartphone, 
  Monitor, 
  Sparkles,
  Info
} from 'lucide-react';

export default function IntegrasiBlogger() {
  const [copiedCodeCode, setCopiedCode] = useState(false);

  // Retrieve current app domain, fallback gracefully to preview/production URL if hosted
  const currentAppUrl = window.location.href.split('?')[0];

  const iframeEmbedCode = `<!-- EMBED SISTEM INTEGRASI SMAN 1 BANTARAN IN BLOGGER -->
<div style="width: 100%; max-width: 1200px; margin: 0 auto; overflow: hidden; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; background-color: #ffffff;">
  <div style="background: #064e3b; padding: 12px 20px; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
    <span>🏫 Sistem Absensi Karakter - SMAN 1 Bantaran</span>
    <span style="font-size: 10px; background: #f59e0b; color: #064e3b; padding: 3px 8px; border-radius: 4px; font-weight: 800;">ONLINE (REAL-TIME)</span>
  </div>
  <iframe 
    src="${currentAppUrl}" 
    style="width: 100%; height: 750px; border: none; display: block;" 
    allow="camera; microphone; geolocation" 
    referrerpolicy="no-referrer">
  </iframe>
</div>`;

  const copyIframeCode = () => {
    navigator.clipboard.writeText(iframeEmbedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="bg-white border border-emerald-110/60 border-emerald-100/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="text-emerald-750 text-emerald-700" />
              Integrasi Embedding Google Blogger
            </h2>
            <p className="text-xs text-gray-500 leading-normal">
              Aplikasi ini sepenuhnya responsif dan dirancang untuk disematkan (embedded) langsung ke Blogger sekolah menggunakan widget HTML standard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Step Guide (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-2.5 uppercase tracking-wide flex items-center gap-2">
              <Layout size={16} className="text-emerald-700" />
              Panduan Memasang di Blogger
            </h3>

            <div className="space-y-4 text-xs text-slate-700 leading-normal">
              
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold text-gray-900">Masuk ke Dashboard Blogger:</p>
                  <p className="text-gray-505">Buka akun blogger anda di <a href="https://blogger.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">blogger.com</a> dan buka blog SMAN 1 Bantaran.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold text-gray-900">Tentukan Posisi Embed:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1 mt-1 text-slate-650">
                    <li><strong>Pilihan A (Halaman Khusus):</strong> Buat halaman baru bertajuk "Presensi Karakter".</li>
                    <li><strong>Pilihan B (Tata Letak / Sidebar Widget):</strong> Pergi ke tab <strong>Tata Letak (Layout)</strong>, klik "Tambah Gadget" &gt; pilih "HTML/JavaScript".</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold text-gray-900">Tempel Kode Embed:</p>
                  <p>Salin kode HTML iframe dari panel kanan, lalu tempelkan. Jika membuat Halaman/Postingan Baru, pastikan beralih dari mode <strong>"Tampilan Menulis"</strong> ke <strong>"Tampilan HTML (&lt;&gt;)"</strong> terlebih dahulu sebelum menempel.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <p className="font-bold text-gray-900">Simpan dan Publikasikan:</p>
                  <p>Klik tombol simpan / simpan susunan tata letak. Selamat! Portal pembinaan karakter sekolah kini Online dan terintegrasi di Blogger.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Integration Checklist Note */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-3.5">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
              <Info size={16} />
              Bagaimana jika scan kamera tidak muncul di blogger?
            </h4>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              Agar Blogger mengizinkan widget visual mengakses kamera HP/Laptop guru pembimbing Anda, pastikan atribut <strong className="font-mono">allow="camera"</strong> terpasang pada tag iframe (sudah disertakan secara baku pada kode salinan di kanan). Platform Chrome dan Safari mensyaratkan protokol SSL HTTPS pada domain Blogger Anda agar kamera berfungsi aman.
            </p>
          </div>
        </div>

        {/* Right Side: Copy Code Block (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl">
              <span className="text-xs font-bold text-gray-900">Kode Iframe HTML</span>
              <button
                onClick={copyIframeCode}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold p-1 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition shadow"
              >
                {copiedCodeCode ? <Check size={14} /> : <Copy size={13} />}
                {copiedCodeCode ? 'Tersalin' : 'Salin Kode'}
              </button>
            </div>

            <textarea
              readOnly
              value={iframeEmbedCode}
              rows={11}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-xl outline-none border border-slate-850 leading-relaxed select-all"
            />

            <div className="space-y-2 text-xs pt-1 border-t border-gray-100 select-none">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500 animate-spin" />
                Kelebihan Semat Responsif:
              </span>
              <ul className="list-disc list-inside text-gray-500 space-y-1 pl-1 text-[11px] leading-relaxed">
                <li>Sistem otomatis menyesuaikan lebar layar HP (Fluid layout).</li>
                <li>Hadir dengan header SMAN berwarna hijau religius.</li>
                <li>Iframe sandbox diisolasi secara aman.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
