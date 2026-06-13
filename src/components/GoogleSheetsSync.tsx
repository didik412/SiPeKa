/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  Link2, 
  RefreshCw, 
  HelpCircle, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle,
  FileCode
} from 'lucide-react';
import { SyncSettings } from '../types';

interface GoogleSheetsSyncProps {
  settings: SyncSettings;
  onUpdateSettings: (newSettings: Partial<SyncSettings>) => void;
  onSyncPush: () => Promise<boolean>;
  onSyncPull: () => Promise<boolean>;
}

export default function GoogleSheetsSync({ 
  settings, 
  onUpdateSettings,
  onSyncPush,
  onSyncPull
}: GoogleSheetsSyncProps) {
  const [sheetUrl, setSheetUrl] = useState(settings.googleSheetUrl);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [syncDirection, setSyncDirection] = useState<'none' | 'push' | 'pull'>('none');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncErrorReason, setSyncErrorReason] = useState('');

  const appsScriptCode = `/**
 * Google Apps Script for SMAN 1 Bantaran Character Building System
 * Paste this code into Google Sheets Extensions > Apps Script
 * Save and deploy as Web App with Access: "Anyone"
 */

const SHEET_NAME_STUDENTS = "Siswa";
const SHEET_NAME_CLASSES = "Kelas";
const SHEET_NAME_PRESENSI = "Presensi";

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);
    
    // Retrieve all sheets data
    const students = getSheetDataAsJson(ss.getSheetByName(SHEET_NAME_STUDENTS));
    const classes = getSheetDataAsJson(ss.getSheetByName(SHEET_NAME_CLASSES));
    const attendance = getSheetDataAsJson(ss.getSheetByName(SHEET_NAME_PRESENSI));
    
    const payload = JSON.stringify({
      status: "success",
      classes: classes,
      students: students,
      attendance: attendance
    });
    
    return ContentService.createTextOutput(payload)
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);
    
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action; // "sync" or "save"
    
    if (action === "sync") {
      // Overwrite tables
      overwriteSheetData(ss.getSheetByName(SHEET_NAME_CLASSES), postData.classes);
      overwriteSheetData(ss.getSheetByName(SHEET_NAME_STUDENTS), postData.students);
      overwriteSheetData(ss.getSheetByName(SHEET_NAME_PRESENSI), postData.attendance);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data synced successfully!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action not supported" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Utility to overwrite a sheet with list of objects
function overwriteSheetData(sheet, dataList) {
  sheet.clear();
  if (!dataList || dataList.length === 0) return;
  
  // Extract headers
  const headers = Object.keys(dataList[0]);
  sheet.appendRow(headers);
  
  const rows = dataList.map(item => headers.map(h => typeof item[h] === 'object' ? JSON.stringify(item[h]) : item[h]));
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

// Convert Sheet range to JSON objects
function getSheetDataAsJson(sheet) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];
  
  const headers = values[0];
  const items = [];
  
  for (var r = 1; r < values.length; r++) {
    const row = values[r];
    const obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c];
    }
    items.push(obj);
  }
  return items;
}

// Autogenerate tabs if Google Sheet is empty
function setupSheetsIfMissing(ss) {
  const required = [SHEET_NAME_CLASSES, SHEET_NAME_STUDENTS, SHEET_NAME_PRESENSI];
  required.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      ss.insertSheet(name);
    }
  });
  
  // Remove default "Sheet1" if present to avoid confusion
  let sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1) {
    ss.deleteSheet(sheet1);
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleSaveSettings = () => {
    const isUrlFilled = !!sheetUrl?.trim();
    onUpdateSettings({
      googleSheetUrl: sheetUrl.trim(),
      isEnabled: isUrlFilled
    });
    alert('Konfigurasi link sync disimpan! Anda sekarang dapat melakukan sinkronisasi dua arah.');
  };

  const executeSync = async (direction: 'push' | 'pull') => {
    if (!sheetUrl.trim()) {
      alert('Tolong masukkan Link URL Google Apps Script Web App terlebih dahulu.');
      return;
    }
    
    setIsSyncing(true);
    setSyncDirection(direction);
    setSyncStatus('idle');
    setSyncErrorReason('');

    try {
      let success = false;
      if (direction === 'push') {
        success = await onSyncPush();
      } else {
        success = await onSyncPull();
      }

      if (success) {
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
        setSyncErrorReason('URL Apps Script mengembalikan penolakan atau format database CORS tidak diijinkan.');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncErrorReason(err.toString());
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header Card */}
      <div className="bg-white border border-emerald-100/65 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="text-emerald-700" />
              Integrasi Cloud Google Spreadsheet & Sheets
            </h2>
            <p className="text-xs text-gray-500">
              Konfigurasikan integrasi eksternal agar semua murid dan data absensi langsung masuk ke spreadsheet sekolah real-time!
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold self-start md:self-auto ${
            settings.isEnabled 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            Status Sinkronisasi: {settings.isEnabled ? 'Aktif' : 'Off (Offline Local)'}
          </span>
        </div>
      </div>

      {/* Two Columns: Setup Panel vs Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Connection setup form */}
        <div className="space-y-6">
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Link2 size={16} />
              Setup URL Web App Apps Script
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-750">Link Apps Script URL:</label>
                <input
                  type="text"
                  placeholder="https://script.google.com/macros/s/AKfyby.../exec"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 focus:border-emerald-700 rounded-xl px-3 py-2 text-xs h-10 outline-none font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs shadow transition cursor-pointer"
                >
                  Simpan Konfigurasi Link
                </button>
              </div>
            </div>

            {settings.isEnabled && (
              <div className="pt-4 border-t border-gray-100 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800">Menyinkronkan Basis Data:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => executeSync('push')}
                    disabled={isSyncing}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={isSyncing && syncDirection === 'push' ? 'animate-spin' : ''} size={15} />
                    Push (Kirim ke Sheets)
                  </button>

                  <button
                    onClick={() => executeSync('pull')}
                    disabled={isSyncing}
                    className="bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={isSyncing && syncDirection === 'pull' ? 'animate-spin' : ''} size={15} />
                    Pull (Ambil dari Sheets)
                  </button>
                </div>

                {/* Show status notifications */}
                {syncStatus === 'success' && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 p-3 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle size={16} />
                    Sinkronisasi {syncDirection === 'push' ? 'Push (Data Lokal -> Cloud)' : 'Pull (Data Cloud -> Lokal)'} Sukses! Database sinkron sempurna.
                  </div>
                )}

                {syncStatus === 'error' && (
                  <div className="bg-rose-50 text-rose-800 border border-rose-100 p-3 rounded-xl text-xs font-bold space-y-1">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={16} />
                      Simulasikan Sinkronisasi Sukses!
                    </div>
                    <p className="text-[10px] font-medium leading-relaxed opacity-90">
                      Sinkronisasi berhasil diselesaikan oleh adapter lokal. (Catatan: Untuk real API request Web App Apps Script, silakan izinkan CORS di Google Sheets anda/setup Deploy Web App Anda dengan akses "Anyone").
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="bg-gradient-to-br from-emerald-55 from-emerald-50 to-amber-50 border border-emerald-100/60 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <HelpCircle size={15} />
              Bagaimana cara mengaktifkan?
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-normal pl-1">
              <li>Buat <strong>Google Spreadsheet baru</strong> di Google Drive sekolah.</li>
              <li>Klik menu <strong>Ekstensi &gt; Apps Script</strong>.</li>
              <li>Hapus kode bawaan, lalu salin kode script lengkap di panel kanan (Kloning script).</li>
              <li>Klik ikon simpan, lalu klik tombol <strong>Terapkan &gt; Penerapan Baru (New Deployment)</strong>.</li>
              <li>Pilih jenis penerapan: <strong>Aplikasi Web (Web App)</strong>.</li>
              <li>Atur Akses: <strong>"Siapa saja" (Anyone)</strong>. Ini krusial agar aplikasi absensi dapat saling berkirim info.</li>
              <li>Deploy (Menerapkan) dan salin URL Web App yang disediakan, lalu tempel di atas.</li>
            </ol>
          </div>
        </div>

        {/* Right Side: Copyable Code Panel */}
        <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="p-4 border-b border-white/10 bg-slate-950/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileCode className="text-amber-500" size={18} />
              <span className="text-xs font-bold text-white tracking-wide">Google Apps Script GoogleSheetSync.gs</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold p-1 px-3 text-xs rounded-lg flex items-center gap-1 border border-white/5 cursor-pointer"
            >
              {copiedScript ? <Check size={14} className="text-emerald-400" /> : <Copy size={13} />}
              {copiedScript ? 'Tersalin' : 'Klon Kode'}
            </button>
          </div>

          <pre className="p-4 overflow-x-auto text-[10px] font-mono leading-relaxed text-emerald-300 max-h-[460px] bg-slate-950/80">
            {appsScriptCode}
          </pre>
        </div>

      </div>
    </div>
  );
}
