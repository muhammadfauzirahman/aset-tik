import { create } from 'zustand';
import type { PerangkatKeras } from '../types';

interface HardwareState {
  hardware: PerangkatKeras[];
  addHardware: (data: Omit<PerangkatKeras, 'id'>) => void;
  updateHardware: (id: string, data: Partial<PerangkatKeras>) => void;
  deleteHardware: (id: string) => void;
}

export const useHardwareStore = create<HardwareState>((set) => ({
  hardware: [
    {
      id: 'hw1',
      kategori: 'Server',
      kodeAset: 'SRV-DL380-01',
      namaPerangkat: 'ProLiant DL380P Gen8',
      deskripsi: 'Server Untuk Aplikasi Utama',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Bidang TIK',
      statusKepemilikan: 'Sendiri',
      kapasitasMemori: '64 Gb',
      kapasitasPenyimpanan: '1 Tb',
      teknologiProsesor: 'Low End',
      teknikPenyimpanan: 'Raid 0',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw2',
      kategori: 'Server',
      kodeAset: 'SRV-DL180-01',
      namaPerangkat: 'ProLiant DL180 Gen9',
      deskripsi: 'Server Untuk Stream CCTV Publik',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Bidang TIK',
      statusKepemilikan: 'Sendiri',
      kapasitasMemori: '8 Gb',
      kapasitasPenyimpanan: '1 Tb',
      teknologiProsesor: 'Low End',
      teknikPenyimpanan: 'Raid 0',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw3',
      kategori: 'Keamanan',
      kodeAset: 'SEC-FW-01',
      namaPerangkat: 'Firewall (Fortinet 200E)',
      deskripsi: 'FortiGate 200E adalah Next-Generation Firewall (NGFW) serbaguna dari Fortinet, dirancang untuk memberikan perlindungan keamanan siber yang komprehensif...',
      pemilik: 'Dinas Komunikasi Informatika dan Statsistik',
      unitPengelola: 'Dinas Komunikasi Informatika dan Statsistik',
      statusKepemilikan: 'Sendiri',
      tipePerangkat: 'Firewall',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw10',
      kategori: 'Keamanan',
      kodeAset: 'SEC-FW-02',
      namaPerangkat: 'Firewall Fortinet 600F NGFW (IPS + IDS)',
      deskripsi: 'Next-Generation Firewall (NGFW) yang dirancang untuk kebutuhan keamanan jaringan skala menengah hingga besar. Mencakup IPS + IDS terintegrasi.',
      pemilik: 'Lintasarta',
      unitPengelola: 'Dinas Komunikasi Informatika dan Statsistik dan Lintasarta',
      statusKepemilikan: 'Milik Pihak Ketiga',
      tipePerangkat: 'Firewall',
      fasilitasId: 'fas1',
      perangkatJaringanId: 'hw8', // Linked to Mikrotik CCR 1036
    },
    {
      id: 'hw4',
      kategori: 'Jaringan',
      kodeAset: 'NET-AP-01',
      namaPerangkat: 'Akses Point Ruijie AP 820L V3',
      deskripsi: 'Perangkat Akses Point Untuk SKPD, Kecamatan, Kelurahan, Puskesmas, UPTD',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Diskominfotik Kota Banjarmasin',
      statusKepemilikan: 'Sendiri',
      tipePerangkat: 'Wireless Equipment',
      fasilitasId: 'fas2',
    },
    {
      id: 'hw6',
      kategori: 'Jaringan',
      kodeAset: 'NET-SW-01',
      namaPerangkat: 'Ruijie Switch ES205GC-P',
      deskripsi: 'Perangkat Switch Untuk SKPD, Kecamatan, Kelurahan, Puskesmas, UPTD',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Diskominfotik Kota Banjarmasin',
      statusKepemilikan: 'Sendiri',
      tipePerangkat: 'Multilayer Switch',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw7',
      kategori: 'Jaringan',
      kodeAset: 'NET-RTR-01',
      namaPerangkat: 'Mikrotik - RB L009 & RB 2011',
      deskripsi: 'Perangkat Router Untuk SKPD, Kecamatan, Kelurahan, Puskesmas, UPTD',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Diskominfotik Kota Banjarmasin',
      statusKepemilikan: 'Sendiri',
      tipePerangkat: 'Router',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw8',
      kategori: 'Jaringan',
      kodeAset: 'NET-RTR-02',
      namaPerangkat: 'Mikrotik CCR 1036',
      deskripsi: 'Perangkat Utama Jaringan di Ruang Server Diskominfotik Kota Banjarmasin',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Diskominfotik Kota Banjarmasin',
      statusKepemilikan: 'Sendiri',
      tipePerangkat: 'Router',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw9',
      kategori: 'Jaringan',
      kodeAset: 'NET-RTR-03',
      namaPerangkat: 'Zyxcel',
      deskripsi: 'Perangkat Utama Metronet di Ruang Server Diskominfotik Kota Banjarmasin',
      pemilik: 'PT. Indonesian Comnets Plus',
      unitPengelola: 'PT. Indonesian Comnets Plus',
      statusKepemilikan: 'BUMN',
      tipePerangkat: 'Router',
      fasilitasId: 'fas1',
    },
    {
      id: 'hw5',
      kategori: 'Penyimpanan',
      kodeAset: 'STO-NAS-01',
      namaPerangkat: 'NAS Synology',
      deskripsi: 'Untuk Penyimpanan data aplikasi, Backup VM, dan database kependudukan',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      unitPengelola: 'Diskominfotik Kota Banjarmasin',
      statusKepemilikan: 'Sendiri',
      kapasitasPenyimpanan: 'Tidak ditentukan',
      metodeAkses: 'Network Attached Storage',
      lokasiPenempatan: 'Jakarta',
      fasilitasId: 'fas2',
      perangkatServerId: 'hw1', // Linked to ProLiant DL380P
      softwareId: 'sw3',        // Linked to PostgreSQL (placeholder for Linux Synology)
      dataInfoDependency: 'Backup VM, dan database kependudukan',
    }
  ],

  addHardware: (data) =>
    set((state) => ({
      hardware: [...state.hardware, { id: Date.now().toString(), ...data }],
    })),
    
  updateHardware: (id, data) =>
    set((state) => ({
      hardware: state.hardware.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
    
  deleteHardware: (id) =>
    set((state) => ({
      hardware: state.hardware.filter((item) => item.id !== id),
    })),
}));
