export interface Rai {
  id: string;
  kodeRai: string;
  namaPusat: string;
}

export interface Instansi {
  id: string;
  namaInstansi: string;
  singkatan: string;
}

export interface Lokasi {
  id: string;
  namaLokasi: string;
  tipeLokasi: 'Pusat Data' | 'Command Center' | 'Sirkuit/Jaringan' | 'Vendor Cloud';
  alamat: string;
}

export type JenisFasilitas = 'Pusat Data' | 'Pusat Komputasi' | 'Pusat Kendali';
export type KlasifikasiTier = 'Tier 3' | 'Tier 4' | 'Non-Tier' | null;
export type KepemilikanFasilitas = 'Sendiri' | 'BUMN' | 'Pihak Ketiga' | 'Swasta';
export type StatusFasilitas = 'Aktif' | 'Non-Aktif' | 'Perbaikan';

export interface FasilitasKomputasi {
  id: string;
  jenisFasilitas: JenisFasilitas;
  namaFasilitas: string;
  kodeFasilitas: string;
  bandwidthIntranet: number; // in Mbps
  bandwidthInternet: number; // in Mbps
  lokasiFisik: string;
  klasifikasiTier: KlasifikasiTier;
  kepemilikan: KepemilikanFasilitas;
  sistemPengamanan: string;
  instansiId: string;
  status: StatusFasilitas;
  childAssetsCount?: number; // purely for mock/UI representation of cascade rules
}
