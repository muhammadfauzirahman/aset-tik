import { create } from 'zustand';
import type { Konektivitas } from '../types';

interface KonektivitasState {
  konektivitas: Konektivitas[];
  addKonektivitas: (data: Omit<Konektivitas, 'id'>) => void;
  updateKonektivitas: (id: string, data: Partial<Konektivitas>) => void;
  deleteKonektivitas: (id: string) => void;
}

export const useKonektivitasStore = create<KonektivitasState>((set) => ({
  konektivitas: [
    {
      id: 'kon1',
      kategori: 'Jaringan Intra',
      kodeAset: 'NET-BJM-01',
      namaJaringan: 'Internet Pemko Banjarmasin (Telkom)',
      deskripsi: 'Intranet',
      pemilik: 'PT. Telekomunikasi Indonesia, Tbk',
      statusKepemilikan: 'BUMN',
      jenisJaringan: 'IP Transit',
      bandwidth: '3 Gbps',
      tipeMedia: 'Fiber Optic',
    },
    {
      id: 'kon2',
      kategori: 'Jaringan Intra',
      kodeAset: 'NET-BJM-02',
      namaJaringan: 'Internet Pemko Banjarmasin (Icon+)',
      deskripsi: 'Intranet',
      pemilik: 'PT. Indonesian Comnets Plus',
      statusKepemilikan: 'BUMN',
      jenisJaringan: 'IP Transit',
      bandwidth: '200 Mbps',
      mediaLainnya: 'Metronet',
      tipeMedia: 'Fiber Optic',
    },
    {
      id: 'kon3',
      kategori: 'Jaringan Intra',
      kodeAset: 'NET-BJM-03',
      namaJaringan: 'Internet Pemko Banjarmasin (Starlink)',
      deskripsi: 'Intranet',
      pemilik: 'PT. Starlink Network Digital',
      statusKepemilikan: 'Pihak Ketiga',
      jenisJaringan: 'Bandwitdh Simetris 1:1',
      bandwidth: '14 Gbps',
      tipeMedia: 'Fiber Optic',
    },
    {
      id: 'kon4',
      kategori: 'SPLP',
      kodeAset: 'SPLP-BJM-01',
      namaJaringan: 'Sistem Penghubung Layanan Pemerintah',
      deskripsi: 'Layanan integrasi dan pertukaran data',
      pemilik: 'Diskominfotik Kota Banjarmasin',
      statusKepemilikan: 'Pusat',
    }
  ],

  addKonektivitas: (data) =>
    set((state) => ({
      konektivitas: [...state.konektivitas, { id: Date.now().toString(), ...data }],
    })),
    
  updateKonektivitas: (id, data) =>
    set((state) => ({
      konektivitas: state.konektivitas.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
    
  deleteKonektivitas: (id) =>
    set((state) => ({
      konektivitas: state.konektivitas.filter((item) => item.id !== id),
    })),
}));
