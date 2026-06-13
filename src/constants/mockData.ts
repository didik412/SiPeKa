/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, ClassGroup, AttendanceRecord } from '../types';

export const INITIAL_CLASSES: ClassGroup[] = [
  { id: 'c1', name: 'X-MIPA 1', waliKelas: 'Dra. Endang Sulastri' },
  { id: 'c2', name: 'X-MIPA 2', waliKelas: 'Suhartono, S.Pd.' },
  { id: 'c3', name: 'XI-MIPA 1', waliKelas: 'Rahmat Hidayat, S.Pd.' },
  { id: 'c4', name: 'XI-IPS 1', waliKelas: 'Nurul Hidayati, S.Ag.' },
  { id: 'c5', name: 'XII-MIPA 1', waliKelas: 'Bambang Hermawan, M.Pd.' },
  { id: 'c6', name: 'XII-IPS 1', waliKelas: 'Siti Maemunah, S.Pd.' },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: '1001', nis: '1001', name: 'Ahmad Fauzi', classId: 'c1', barcode: '1001', gender: 'L', createdAt: '2026-01-10T08:00:00Z' },
  { id: '1002', nis: '1002', name: 'Siti Aminah', classId: 'c1', barcode: '1002', gender: 'P', createdAt: '2026-01-10T08:00:00Z' },
  { id: '1003', nis: '1003', name: 'Budi Santoso', classId: 'c1', barcode: '1003', gender: 'L', createdAt: '2026-01-10T08:00:00Z' },
  { id: '1004', nis: '1004', name: 'Dewi Lestari', classId: 'c2', barcode: '1004', gender: 'P', createdAt: '2026-01-10T08:00:00Z' },
  { id: '1005', nis: '1005', name: 'Eko Prasetyo', classId: 'c2', barcode: '1005', gender: 'L', createdAt: '2026-01-10T08:00:00Z' },
  { id: '1006', nis: '1006', name: 'Fitri Rahmawati', classId: 'c3', barcode: '1006', gender: 'P', createdAt: '2026-01-11T08:00:00Z' },
  { id: '1007', nis: '1007', name: 'Guntur Wibowo', classId: 'c3', barcode: '1007', gender: 'L', createdAt: '2026-01-11T08:00:00Z' },
  { id: '1008', nis: '1008', name: 'Indah Permatasari', classId: 'c4', barcode: '1008', gender: 'P', createdAt: '2026-01-11T08:00:00Z' },
  { id: '1009', nis: '1009', name: 'Joko Susilo', classId: 'c4', barcode: '1009', gender: 'L', createdAt: '2026-01-11T08:00:00Z' },
  { id: '1010', nis: '1010', name: 'Kartika Sari', classId: 'c5', barcode: '1010', gender: 'P', createdAt: '2026-01-12T08:00:00Z' },
  { id: '1011', nis: '1011', name: 'Lukman Hakim', classId: 'c5', barcode: '1011', gender: 'L', createdAt: '2026-01-12T08:00:00Z' },
  { id: '1012', nis: '1012', name: 'Megawati Putri', classId: 'c6', barcode: '1012', gender: 'P', createdAt: '2026-01-12T08:00:00Z' },
  { id: '1013', nis: '1013', name: 'Nur Hasanah', classId: 'c6', barcode: '1013', gender: 'P', createdAt: '2026-01-12T08:00:00Z' },
  { id: '1014', nis: '1014', name: 'Rizky Pratama', classId: 'c1', barcode: '1014', gender: 'L', createdAt: '2026-01-12T08:00:00Z' },
  { id: '1015', nis: '1015', name: 'Tri Utami', classId: 'c2', barcode: '1015', gender: 'P', createdAt: '2026-01-12T08:00:00Z' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // June 8, 2026 - Sholat Dhuha
  { id: 'att-1', studentId: '1001', date: '2026-06-08', time: '07:15:22', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-2', studentId: '1002', date: '2026-06-08', time: '07:18:45', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-3', studentId: '1003', date: '2026-06-08', time: '07:22:10', activity: 'Sholat Dhuha', status: 'Sakit', scanned: false, inputBy: 'Dra. Endang Sulastri' },
  { id: 'att-4', studentId: '1004', date: '2026-06-08', time: '07:10:05', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-5', studentId: '1005', date: '2026-06-08', time: '07:25:00', activity: 'Sholat Dhuha', status: 'Izin', scanned: false, inputBy: 'Suhartono, S.Pd.' },
  { id: 'att-6', studentId: '1006', date: '2026-06-08', time: '07:12:14', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-7', studentId: '1007', date: '2026-06-08', time: '07:14:35', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-8', studentId: '1008', date: '2026-06-08', time: '07:19:11', activity: 'Sholat Dhuha', status: 'Alfa', scanned: false, inputBy: 'Sistem' },

  // June 8, 2026 - Sholat Dhuhur
  { id: 'att-9', studentId: '1001', date: '2026-06-08', time: '12:15:30', activity: 'Sholat Dhuhur', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-10', studentId: '1002', date: '2026-06-08', time: '12:16:11', activity: 'Sholat Dhuhur', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-11', studentId: '1004', date: '2026-06-08', time: '12:18:44', activity: 'Sholat Dhuhur', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-12', studentId: '1006', date: '2026-06-08', time: '12:20:01', activity: 'Sholat Dhuhur', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-13', studentId: '1007', date: '2026-06-08', time: '12:21:40', activity: 'Sholat Dhuhur', status: 'Hadir', scanned: true, inputBy: 'Sistem' },

  // June 9, 2026 - Sholat Dhuha
  { id: 'att-14', studentId: '1001', date: '2026-06-09', time: '07:12:44', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-15', studentId: '1002', date: '2026-06-09', time: '07:14:02', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-16', studentId: '1003', date: '2026-06-09', time: '07:16:55', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-17', studentId: '1004', date: '2026-06-09', time: '07:11:30', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-18', studentId: '1005', date: '2026-06-09', time: '07:22:15', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-19', studentId: '1006', date: '2026-06-09', time: '07:13:58', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-20', studentId: '1007', date: '2026-06-09', time: '07:14:12', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-21', studentId: '1008', date: '2026-06-09', time: '07:20:00', activity: 'Sholat Dhuha', status: 'Izin', scanned: false, inputBy: 'Nurul Hidayati, S.Ag.' },

  // June 10, 2026 - Sholat Dhuha
  { id: 'att-22', studentId: '1001', date: '2026-06-10', time: '07:13:11', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-23', studentId: '1002', date: '2026-06-10', time: '07:15:20', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-24', studentId: '1003', date: '2026-06-10', time: '07:17:33', activity: 'Sholat Dhuha', status: 'Sakit', scanned: false, inputBy: 'Dra. Endang Sulastri' },
  { id: 'att-25', studentId: '1004', date: '2026-06-10', time: '07:10:45', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-26', studentId: '1005', date: '2026-06-10', time: '07:21:40', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-27', studentId: '1006', date: '2026-06-10', time: '07:12:12', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-28', studentId: '1007', date: '2026-06-10', time: '07:11:05', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-29', studentId: '1008', date: '2026-06-10', time: '07:19:55', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-30', studentId: '1009', date: '2026-06-10', time: '07:23:44', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },

  // June 11, 2026 - Sholat Dhuha
  { id: 'att-31', studentId: '1001', date: '2026-06-11', time: '07:11:32', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-32', studentId: '1002', date: '2026-06-11', time: '07:14:15', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-33', studentId: '1003', date: '2026-06-11', time: '07:18:22', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-34', studentId: '1004', date: '2026-06-11', time: '07:11:00', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-35', studentId: '1005', date: '2026-06-11', time: '07:19:30', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-36', studentId: '1006', date: '2026-06-11', time: '07:12:44', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-37', studentId: '1007', date: '2026-06-11', time: '07:14:10', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-38', studentId: '1008', date: '2026-06-11', time: '07:17:11', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-39', studentId: '1009', date: '2026-06-11', time: '07:22:11', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-40', studentId: '1010', date: '2026-06-11', time: '07:10:02', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-41', studentId: '1011', date: '2026-06-11', time: '07:16:30', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },

  // June 12, 2026 - Today - Sholat Dhuha
  { id: 'att-42', studentId: '1001', date: '2026-06-12', time: '07:10:15', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-43', studentId: '1002', date: '2026-06-12', time: '07:12:33', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-44', studentId: '1003', date: '2026-06-12', time: '07:15:58', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-45', studentId: '1004', date: '2026-06-12', time: '07:11:12', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-46', studentId: '1005', date: '2026-06-12', time: '07:24:00', activity: 'Sholat Dhuha', status: 'Sakit', scanned: false, inputBy: 'Suhartono, S.Pd.' },
  { id: 'att-47', studentId: '1006', date: '2026-06-12', time: '07:13:00', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-48', studentId: '1007', date: '2026-06-12', time: '07:14:40', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-49', studentId: '1008', date: '2026-06-12', time: '07:18:15', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-50', studentId: '1010', date: '2026-06-12', time: '07:10:45', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-51', studentId: '1011', date: '2026-06-12', time: '07:14:50', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
  { id: 'att-52', studentId: '1012', date: '2026-06-12', time: '07:11:58', activity: 'Sholat Dhuha', status: 'Hadir', scanned: true, inputBy: 'Sistem' },
];
