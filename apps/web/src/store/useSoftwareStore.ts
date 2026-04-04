import { create } from 'zustand';
import type { LayananDigital } from '../types';

interface SoftwareState {
  software: LayananDigital[];
  addSoftware: (data: Omit<LayananDigital, 'id'>) => void;
  updateSoftware: (id: string, data: Partial<LayananDigital>) => void;
  deleteSoftware: (id: string) => void;
}

export const useSoftwareStore = create<SoftwareState>((set) => ({
  software: [
    {
      id: 'sw1',
      kategori: 'Cloud',
      kodeAset: 'CLD-VC-01',
      namaLayanan: 'Aplikasi Video Konferensi (Zoom)',
      deskripsi: 'Komunikasi visual dan audio real-time untuk rapat, kolaborasi, atau interaksi jarak jauh.',
      pemilik: 'Zoom Communications, Inc',
      pengelola: 'Dinas Komunikasi Informatika dan Statsistik',
      instansiId: 'inst1',
      statusKepemilikan: 'Swasta Luar Negeri',
      biayaLayanan: 41170000,
      jangkaWaktu: 'Tahunan',
      tipeCloud: 'SaaS',
      fasilitasId: 'fas2',
      jaringanDependency: 'kon1', // Internet Pemko
    },
    {
      id: 'sw2',
      kategori: 'Platform',
      kodeAset: 'PLT-WAF-01',
      namaLayanan: 'WAF by cPGuard',
      deskripsi: 'Web Application Firewall yang dirancang khusus untuk melindungi aplikasi web dari berbagai serangan berbasis web.',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      pengelola: 'Sekretariat Bidang Keamanan Informasi',
      instansiId: 'inst1',
      statusKepemilikan: 'Sendiri',
      jenisLisensi: 'Periodik',
      validitasLisensi: 'Aktif (hingga 01 Nopember 2025)',
      tipeSoftware: 'Sistem Utilitas',
      jenisUtilitas: 'Firewall Lapisan Aplikasi (Layer 7)',
      fasilitasId: 'fas1',
      cloudDependencyId: 'sw1',
    },
    {
      id: 'sw3',
      kategori: 'Platform',
      kodeAset: 'PLT-DB-01',
      namaLayanan: 'PostgreSQL Database Server',
      deskripsi: 'Sistem manajemen database relasional open-source.',
      pemilik: 'Open Source',
      pengelola: 'Dinas Komunikasi Informatika dan Statsistik',
      instansiId: 'inst1',
      statusKepemilikan: 'Sendiri',
      jenisLisensi: 'Permanen / Open Source',
      tipeSoftware: 'Sistem Database',
      jenisDatabase: 'Relational Database Management System',
      hardwareServerId: 'hw1', // HP ProLiant
      fasilitasId: 'fas1',
    }
  ],

  addSoftware: (data) =>
    set((state) => ({
      software: [...state.software, { id: Date.now().toString(), ...data }],
    })),
    
  updateSoftware: (id, data) =>
    set((state) => ({
      software: state.software.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
    
  deleteSoftware: (id) =>
    set((state) => ({
      software: state.software.filter((item) => item.id !== id),
    })),
}));
