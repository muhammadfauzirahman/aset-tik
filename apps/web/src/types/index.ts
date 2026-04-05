export interface Rai {
  id: number;
  kodeRai: string;
  namaPusat: string;
}

export interface Instansi {
  id: number;
  namaInstansi: string;
  singkatan: string;
}

export interface Lokasi {
  id: number;
  namaLokasi: string;
  tipeLokasi: 'Pusat Data' | 'Command Center' | 'Sirkuit/Jaringan' | 'Vendor Cloud';
  alamat: string;
}

export type JenisFasilitas = 'Pusat Data' | 'Pusat Komputasi' | 'Pusat Kendali';
export type KlasifikasiTier = 'Tier 3' | 'Tier 4' | 'Non-Tier' | null;
export type KepemilikanFasilitas = 'Sendiri' | 'Instansi Pemerintah Lain' | 'BUMN' | 'Swasta Dalam Negeri' | 'Swasta Luar Negeri';
export type StatusFasilitas = 'Aktif' | 'Non-Aktif' | 'Perbaikan';

export interface FasilitasKomputasi {
  id: number;
  jenisFasilitas: JenisFasilitas;
  namaFasilitas: string;
  kodeFasilitas: string;
  bandwidthIntranet: number; // in Mbps
  bandwidthInternet: number; // in Mbps
  lokasiFisik: string;
  klasifikasiTier: KlasifikasiTier;
  kepemilikan: KepemilikanFasilitas;
  sistemPengamanan: string;
  instansiId: number;
  status: StatusFasilitas;
  childAssetsCount?: number; // purely for mock/UI representation of cascade rules
}

export type KonektivitasKategori = 'Jaringan Intra' | 'SPLP';
export type KepemilikanKonektivitas = 'Sendiri' | 'Instansi Pemerintah Lain' | 'BUMN' | 'Pihak Ketiga';

export interface Konektivitas {
  id: number;
  kategori: KonektivitasKategori;
  kodeAset: string;
  namaJaringan: string;
  deskripsi: string;
  pemilik: string;
  statusKepemilikan: KepemilikanKonektivitas;
  jenisJaringan?: string; // 'IP Transit', 'Bandwidth Simetris', etc.
  bandwidth?: number; // in Mbps
  tipeMedia?: string; // 'Fiber Optic', 'Wireless', etc.
  mediaLainnya?: string; // e.g., 'Metronet'
  fasilitasId?: number;
}

export type HardwareKategori = 'Server' | 'Jaringan' | 'Keamanan' | 'Penyimpanan' | 'Periferal';

export interface PerangkatKeras {
  id: number;
  kategori: HardwareKategori;
  kodeAset: string;
  namaPerangkat: string;
  deskripsi: string;
  pemilik: string;
  unitPengelola: string;
  statusKepemilikan: string;

  // Specific fields
  kapasitasMemori?: string; // e.g., "64 GB"
  kapasitasPenyimpanan?: string; // e.g., "1 TB"
  teknologiProsesor?: string; // e.g., "Low End"
  teknikPenyimpanan?: string; // e.g., "RAID 0"
  tipePerangkat?: string; // e.g., "Firewall", "Router"
  metodeAkses?: string; // e.g., "NAS"
  lokasiPenempatan?: string;
  jenisPenggunaanServer?: string; // e.g., "Server Aplikasi"

  fasilitasId?: number;
  instansiId?: number;

  // Dependency fields
  perangkatJaringanId?: number;   // For security/other hardware
  perangkatServerId?: number;     // For storage/software
  softwareId?: number;            // For storage/other hardware
  dataInfoDependency?: string;    // Text notes: "Backup VM, etc"
}

export type SoftwareKategori = 'Cloud' | 'Platform' | 'Software';

export interface LayananDigital {
  id: number;
  kategori: SoftwareKategori;
  kodeAset: string;
  namaLayanan: string;
  deskripsi: string;
  pemilik: string;
  pengelola: string;
  statusKepemilikan: string;

  instansiId?: number; // Unit Pengelola (from Master Data)

  // Specific fields
  biayaLayanan?: number;
  jangkaWaktu?: string;
  tipeCloud?: 'SaaS' | 'PaaS' | 'IaaS' | 'BDaaS' | 'SecaaS';

  // Platform specific
  jenisLisensi?: string;
  validitasLisensi?: string;
  tipeSoftware?: 'Sistem Operasi' | 'Sistem Database' | 'Sistem Utilitas';
  jenisDatabase?: string;
  jenisUtilitas?: string;
  jenisOS?: string;

  // SPBE Specific Cloud Fields
  unitPengembangCloud?: string;
  unitOperasionalCloud?: string;
  edukasiKeamananDependency?: string;

  fasilitasId?: number;
  hardwareServerId?: number;      // The physical/virtual host server
  cloudDependencyId?: number;     // If platform software runs on a cloud service

  // Cloud specific dependencies (SPBE)
  aplikasiDependency?: string;    // Notes/Placeholder for now
  dataInfoDependency?: string;    // Notes
  splpDependency?: string;        // Link to Konektivitas (SPLP)
  jaringanDependency?: string;    // Link to Konektivitas (Jaringan Intra)
}
