import { create } from 'zustand';
import type { FasilitasKomputasi } from '../types';

interface FasilitasState {
  fasilitas: FasilitasKomputasi[];
  addFasilitas: (data: Omit<FasilitasKomputasi, 'id' | 'childAssetsCount'>) => void;
  updateFasilitas: (id: string, data: Partial<FasilitasKomputasi>) => void;
  deleteFasilitas: (id: string) => void;
}

export const useFasilitasStore = create<FasilitasState>((set) => ({
  fasilitas: [
    {
      id: 'fas1',
      jenisFasilitas: 'Pusat Data',
      namaFasilitas: 'Data Center Utama Jatim',
      kodeFasilitas: 'DC-JTM-01',
      bandwidthIntranet: 10000, // 10 Gbps
      bandwidthInternet: 2000,  // 2 Gbps
      lokasiFisik: 'Gedung Diskominfo Prov Jatim',
      klasifikasiTier: 'Tier 3',
      kepemilikan: 'Sendiri',
      sistemPengamanan: 'Biometric, CCTV 24/7, FM200 Fire Suppression',
      instansiId: 'inst2', // Linked to PEMPROV JATIM
      status: 'Aktif',
      childAssetsCount: 45, // Simulation: can't delete
    },
    {
      id: 'fas2',
      jenisFasilitas: 'Pusat Kendali',
      namaFasilitas: 'Command Center Jatim',
      kodeFasilitas: 'CC-JTM-01',
      bandwidthIntranet: 1000, // 1 Gbps
      bandwidthInternet: 500,  // 500 Mbps
      lokasiFisik: 'Gedung Negara Grahadi',
      klasifikasiTier: 'Non-Tier',
      kepemilikan: 'Sendiri',
      sistemPengamanan: 'Access Card, Security Guard',
      instansiId: 'inst2',
      status: 'Aktif',
      childAssetsCount: 0, // Simulation: can delete
    },
    {
      id: 'fas3',
      jenisFasilitas: 'Pusat Data',
      namaFasilitas: 'Cloud Backup Telkom',
      kodeFasilitas: 'DC-TLKM-01',
      bandwidthIntranet: 0,
      bandwidthInternet: 5000, // 5 Gbps
      lokasiFisik: 'Telkom Sigma Rungkut',
      klasifikasiTier: 'Tier 4',
      kepemilikan: 'Pihak Ketiga',
      sistemPengamanan: 'Enterprise Grade',
      instansiId: 'inst1', // Linked to KOMINFO
      status: 'Aktif',
      childAssetsCount: 12,
    }
  ],

  addFasilitas: (data) =>
    set((state) => ({
      fasilitas: [...state.fasilitas, { id: Date.now().toString(), childAssetsCount: 0, ...data }],
    })),
    
  updateFasilitas: (id, data) =>
    set((state) => ({
      fasilitas: state.fasilitas.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
    
  deleteFasilitas: (id) =>
    set((state) => {
      const itemToDelete = state.fasilitas.find(f => f.id === id);
      if (itemToDelete && (itemToDelete.childAssetsCount || 0) > 0) {
        // Ini adalah simulasi Restrict, dalam realita ini ditangani oleh backend
        throw new Error(`Fasilitas tidak dapat dinonaktifkan/dihapus karena masih memiliki ${itemToDelete.childAssetsCount} aset terikat. Mohon pindahkan aset terlebih dahulu.`);
      }
      return {
        fasilitas: state.fasilitas.filter((item) => item.id !== id),
      };
    }),
}));
