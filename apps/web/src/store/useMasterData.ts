import { create } from 'zustand';
import type { Rai, Instansi, Lokasi } from '../types';

interface MasterDataState {
  rai: Rai[];
  instansi: Instansi[];
  lokasi: Lokasi[];
  addRai: (data: Omit<Rai, 'id'>) => void;
  updateRai: (id: string, data: Partial<Rai>) => void;
  deleteRai: (id: string) => void;
  addInstansi: (data: Omit<Instansi, 'id'>) => void;
  updateInstansi: (id: string, data: Partial<Instansi>) => void;
  deleteInstansi: (id: string) => void;
  addLokasi: (data: Omit<Lokasi, 'id'>) => void;
  updateLokasi: (id: string, data: Partial<Lokasi>) => void;
  deleteLokasi: (id: string) => void;
}

export const useMasterData = create<MasterDataState>((set) => ({
  rai: [
    { id: 'rai1', kodeRai: 'RAI.01', namaPusat: 'Pusat Data Nasional' },
    { id: 'rai2', kodeRai: 'RAI.02', namaPusat: 'Pusat Komputasi Instansi' },
    { id: 'rai3', kodeRai: 'RAI.03', namaPusat: 'Pusat Kendali / Command Center' },
  ],
  instansi: [
    { id: 'inst1', namaInstansi: 'Kementerian Komunikasi dan Informatika', singkatan: 'KOMINFO' },
    { id: 'inst2', namaInstansi: 'Pemerintah Provinsi Jawa Timur', singkatan: 'PEMPROV JATIM' },
  ],
  lokasi: [
    { id: 'lok1', namaLokasi: 'PDN Cikarang', tipeLokasi: 'Pusat Data', alamat: 'Cikarang, Bekasi' },
    { id: 'lok2', namaLokasi: 'Telkom Serpong', tipeLokasi: 'Vendor Cloud', alamat: 'Serpong, Banten' },
    { id: 'lok3', namaLokasi: 'Gedung A Pemprov', tipeLokasi: 'Pusat Data', alamat: 'Jl. Pemuda No.1' },
  ],

  addRai: (data) =>
    set((state) => ({
      rai: [...state.rai, { id: Date.now().toString(), ...data }],
    })),
  updateRai: (id, data) =>
    set((state) => ({
      rai: state.rai.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
  deleteRai: (id) =>
    set((state) => ({
      rai: state.rai.filter((item) => item.id !== id),
    })),

  addInstansi: (data) =>
    set((state) => ({
      instansi: [...state.instansi, { id: Date.now().toString(), ...data }],
    })),
  updateInstansi: (id, data) =>
    set((state) => ({
      instansi: state.instansi.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
  deleteInstansi: (id) =>
    set((state) => ({
      instansi: state.instansi.filter((item) => item.id !== id),
    })),

  addLokasi: (data) =>
    set((state) => ({
      lokasi: [...state.lokasi, { id: Date.now().toString(), ...data }],
    })),
  updateLokasi: (id, data) =>
    set((state) => ({
      lokasi: state.lokasi.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
  deleteLokasi: (id) =>
    set((state) => ({
      lokasi: state.lokasi.filter((item) => item.id !== id),
    })),
}));
