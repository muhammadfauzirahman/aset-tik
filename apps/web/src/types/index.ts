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
export type KepemilikanFasilitas = 'Sendiri' | 'Instansi Pemerintah Lain' | 'BUMN' | 'Swasta Dalam Negeri' | 'Swasta Luar Negeri';
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

export type KonektivitasKategori = 'Jaringan Intra' | 'SPLP';
export type KepemilikanKonektivitas = 'Pusat' | 'BUMN' | 'Pihak Ketiga' | 'Swasta';

export interface Konektivitas {
  id: string;
  kategori: KonektivitasKategori;
  kodeAset: string;
  namaJaringan: string;
  deskripsi: string;
  pemilik: string;
  statusKepemilikan: KepemilikanKonektivitas;
  jenisJaringan?: string; // 'IP Transit', 'Bandwidth Simetris', etc.
  bandwidth?: string; // e.g., '10 Gbps'
  tipeMedia?: string; // 'Fiber Optic', 'Wireless', etc.
  mediaLainnya?: string; // e.g., 'Metronet'
  fasilitasId?: string;
}

export type HardwareKategori = 'Server' | 'Jaringan' | 'Keamanan' | 'Penyimpanan' | 'Periferal';

export interface PerangkatKeras {
  id: string;
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

  fasilitasId?: string;
  instansiId?: string;

  // Dependency fields
  perangkatJaringanId?: string;   // For security/other hardware
  perangkatServerId?: string;     // For storage/software
  softwareId?: string;            // For storage/other hardware
  dataInfoDependency?: string;    // Text notes: "Backup VM, etc"
}

export type SoftwareKategori = 'Cloud' | 'Platform' | 'Software';

export interface LayananDigital {
  id: string;
  kategori: SoftwareKategori;
  kodeAset: string;
  namaLayanan: string;
  deskripsi: string;
  pemilik: string;
  pengelola: string;
  statusKepemilikan: string;

  instansiId?: string; // Unit Pengelola (from Master Data)

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

  fasilitasId?: string;
  hardwareServerId?: string;      // The physical/virtual host server
  cloudDependencyId?: string;     // If platform software runs on a cloud service

  // Cloud specific dependencies (SPBE)
  aplikasiDependency?: string;    // Notes/Placeholder for now
  dataInfoDependency?: string;    // Notes
  splpDependency?: string;        // Link to Konektivitas (SPLP)
  jaringanDependency?: string;    // Link to Konektivitas (Jaringan Intra)
}
