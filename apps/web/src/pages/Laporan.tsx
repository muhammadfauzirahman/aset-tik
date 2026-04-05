import * as XLSX from 'xlsx';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';

// Hooks
import { useHardware } from '../hooks/useHardware';
import { useLayananDigital } from '../hooks/useLayananDigital';
import { useFasilitas } from '../hooks/useFasilitas';
import { useKonektivitas } from '../hooks/useKonektivitas';

// Formatters
import { formatRupiah, formatDate } from '../lib/formatters';

export function Laporan() {
  const { hardware, isLoading: isHwLoading } = useHardware();
  const { layananDigital: softwareAll, isLoading: isSwLoading } = useLayananDigital();
  const { fasilitas, isLoading: isFasLoading } = useFasilitas();
  const { konektivitas, isLoading: isKonLoading } = useKonektivitas();

  const isLoading = isHwLoading || isSwLoading || isFasLoading || isKonLoading;

  const cloud = useMemo(() => softwareAll.filter(s => s.kategori === 'Cloud'), [softwareAll]);
  const platform = useMemo(() => softwareAll.filter(s => s.kategori === 'Platform'), [softwareAll]);

  const exportToExcel = () => {
    if (isLoading) return;
    try {
      const wb = XLSX.utils.book_new();

      // 1. Komputasi Awan
      const cloudData = cloud.map(item => ({
        'Nama Government Cloud': item.namaLayanan,
        'Deskripsi Government Cloud': item.deskripsi || '-',
        'Nama Pemilik': item.pemilik,
        'Biaya Layanan': formatRupiah(item.biayaLayanan || 0),
        'Tipe Goverment Cloud': item.tipeCloud,
        'Status Kepemilikkan': item.statusKepemilikan,
        'Unit Pengembang': item.unitPengembangCloud || '-',
        'Unit Operasional': item.unitOperasionalCloud || '-',
        'Edukasi Keamanan': item.edukasiKeamananDependency || '-',
        'Jangka Waktu': item.jangkaWaktu === 'Seumur Hidup' ? 'Seumur Hidup' : (formatDate(item.jangkaWaktu || '')),
        'Sistem Penghubung': item.splpDependency || '-',
        'Jaringan Intra': item.jaringanDependency || '-'
      }));
      const wsCloud = XLSX.utils.json_to_sheet(cloudData);
      XLSX.utils.book_append_sheet(wb, wsCloud, 'Komputasi Awan');

      // 2. Perangkat Lunak Platform
      const softwareData = platform.map(item => ({
        'Nama Perangkat Lunak': item.namaLayanan,
        'Deskripsi': item.deskripsi || '-',
        'Nama Pemilik Lisensi': item.pemilik,
        'Validitas Lisensi': item.validitasLisensi === 'Seumur Hidup' ? 'Seumur Hidup' : (formatDate(item.validitasLisensi || '')),
        'Tipe Software': item.tipeSoftware,
        'Jenis Lisensi': item.jenisLisensi,
        'Detail Kategori': item.tipeSoftware === 'Sistem Operasi' ? item.jenisOS : (item.tipeSoftware === 'Sistem Database' ? item.jenisDatabase : item.jenisUtilitas)
      }));
      const wsSoftware = XLSX.utils.json_to_sheet(softwareData);
      XLSX.utils.book_append_sheet(wb, wsSoftware, 'Perangkat Lunak Platform');

      // 3. Perangkat Keras
      const hardwareData = hardware.map(item => ({
        'ID Aset': item.kodeAset,
        'Nama Perangkat': item.namaPerangkat,
        'Deskripsi': item.deskripsi || '-',
        'Kategori': item.kategori,
        'Pemilik': item.pemilik,
        'Status Kepemilikan': item.statusKepemilikan,
        'Pengelola': item.unitPengelola,
        'CPU': item.teknologiProsesor || '-',
        'RAM': item.kapasitasMemori || '-',
        'Storage': item.kapasitasPenyimpanan || '-'
      }));
      const wsHardware = XLSX.utils.json_to_sheet(hardwareData);
      XLSX.utils.book_append_sheet(wb, wsHardware, 'Perangkat Keras');

      // 4. Jaringan Intra & SPLP
      const networkData = konektivitas.map(item => ({
        'Nama': item.namaJaringan,
        'Kategori': item.kategori,
        'Pemilik': item.pemilik,
        'Status': item.statusKepemilikan,
        'Bandwidth': item.bandwidth || '-',
        'Media': item.tipeMedia || '-'
      }));
      const wsNetwork = XLSX.utils.json_to_sheet(networkData);
      XLSX.utils.book_append_sheet(wb, wsNetwork, 'Jaringan & SPLP');

      // 5. Fasilitas Komputasi
      const fasilitasData = fasilitas.map(item => ({
        'Nama Fasilitas': item.namaFasilitas,
        'Kode': item.kodeFasilitas,
        'Tipe': item.jenisFasilitas,
        'Lokasi': item.lokasiFisik,
        'Tier': item.klasifikasiTier,
        'Status': item.status
      }));
      const wsFasilitas = XLSX.utils.json_to_sheet(fasilitasData);
      XLSX.utils.book_append_sheet(wb, wsFasilitas, 'Fasilitas Komputasi');

      XLSX.writeFile(wb, `Audit_Aset_TIK_AS_IS_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengekspor laporan. Pastikan data sudah terisi dengan benar.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Pusat Laporan" 
        subtitle="Ekspor daftar aset TIK (AS IS) dalam format Excel untuk kebutuhan audit dan pelaporan SPBE." 
        icon="description" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="p-8 border-4 border-black shadow-[12px_12px_0px_0px_#1A1A1A] flex flex-col items-center text-center space-y-6 bg-[#FFD600]">
          <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1A]">
            <span className="material-symbols-outlined text-5xl font-black">{isLoading ? 'sync' : 'table_view'}</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-mono-bold text-2xl uppercase italic">Daftar Aset (AS IS)</h3>
            <p className="font-body text-sm opacity-80 decoration-black">
              Format Excel mencakup seluruh kategori: Komputasi Awan, Software, Hardware, dan Jaringan Intra.
            </p>
          </div>
          <Button 
            onClick={exportToExcel}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-gray-800 transition-all py-4 text-lg border-2 border-black shadow-[4px_4px_0_0_#999] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isLoading ? 'MENYIAPKAN DATA...' : 'UNDUH LAPORAN EXCEL'}
          </Button>
        </Card>

        <Card className="p-8 border-4 border-black shadow-[12px_12px_0px_0px_#1A1A1A] flex flex-col items-center text-center space-y-6 bg-[#00E5FF] opacity-60">
          <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1A]">
            <span className="material-symbols-outlined text-5xl font-black">analytics</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-mono-bold text-2xl uppercase italic">Statistik Lanjut</h3>
            <p className="font-body text-sm opacity-80 underline italic">
              Coming Soon: Visualisasi distribusi aset per-SKPD dan Tren Biaya.
            </p>
          </div>
          <Button disabled className="w-full grayscale cursor-not-allowed py-4 border-2 border-black">
            BELUM TERSEDIA
          </Button>
        </Card>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
