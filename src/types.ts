/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string; // Unique ID (often same as NIS)
  nis: string; // Nomor Induk Siswa
  name: string; // Nama Siswa
  classId: string; // ID Kelas
  barcode: string; // Barcode value (defaults to NIS)
  gender: 'L' | 'P'; // Laki-laki / Perempuan
  photoUrl?: string; // Optional student photo data or URL (Base64)
  ttl?: string; // Tempat, Tanggal Lahir
  alamat?: string; // Alamat tempat tinggal
  createdAt: string;
}

export interface ClassGroup {
  id: string; // Unique Class ID
  name: string; // e.g., "X-MIPA 1", "XI-IPS 2"
  waliKelas?: string; // Wali kelas name
}

export type AttendanceActivity = 'Sholat Dhuha' | 'Sholat Dhuhur' | 'Kegiatan Tambahan';

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';

export interface AttendanceRecord {
  id: string; // Unique record ID
  studentId: string; // Regs to Student id
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm:ss
  activity: string; // Sholat Dhuha, Sholat Dhuhur, or custom
  status: AttendanceStatus;
  scanned: boolean; // scanned via barcode vs manual entry
  inputBy: string; // "Admin" or name
}

export interface UserSession {
  username: string;
  role: 'admin' | 'guru';
  name: string;
  classPermit?: string; // If role is guru, we can specify a classId they manage
}

export interface SyncSettings {
  googleSheetUrl: string;
  isEnabled: boolean;
  lastSyncedAt?: string;
}

export interface SchoolProfile {
  provinsi: string;
  dinas: string;
  namaSekolah: string;
  alamatSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  websiteSekolah: string;
  emailSekolah: string;
}
