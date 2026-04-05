import { useMemo } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

// Hooks
import { useHardware } from '../hooks/useHardware';
import { useFasilitas } from '../hooks/useFasilitas';
import { useLayananDigital } from '../hooks/useLayananDigital';
import { useKonektivitas } from '../hooks/useKonektivitas';
import { formatRupiah } from '../lib/formatters';

export function Dashboard() {
  const { hardware, isLoading: isHardwareLoading } = useHardware();
  const { fasilitas, isLoading: isFasilitasLoading } = useFasilitas();
  const { layananDigital, isLoading: isLayananLoading } = useLayananDigital();
  const { konektivitas, isLoading: isKonektivitasLoading } = useKonektivitas();

  const isLoading = isHardwareLoading || isFasilitasLoading || isLayananLoading || isKonektivitasLoading;

  const stats = useMemo(() => {
    const activeDataCenters = fasilitas.filter(f => f.jenisFasilitas === 'Pusat Data').length;
    const totalHardware = hardware.length;
    const totalServices = layananDigital.length;
    const totalBudget = layananDigital.reduce((acc, curr) => acc + (curr.biayaLayanan || 0), 0);
    
    // License expiry mockup logic (future: compare dates)
    const expiringLicenses = layananDigital.filter(s => s.validitasLisensi && s.validitasLisensi !== 'Seumur Hidup').length;

    return {
      activeDataCenters,
      totalHardware,
      totalServices,
      totalBudget,
      expiringLicenses
    };
  }, [fasilitas, hardware, layananDigital]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl font-black uppercase animate-pulse italic">Mempersiapkan Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Alert Banner */}
      {stats.expiringLicenses > 0 && (
        <div className="bg-[#FF3366] border-[3px] border-[#1A1A1A] p-4 flex items-center justify-center shadow-[6px_6px_0px_0px_#1A1A1A]">
          <h3 className="font-mono font-bold text-white uppercase text-center text-lg">
            ⚠ {stats.expiringLicenses} LISENSI/KONTRAK BERAKHIR ATAU PERLU PERPANJANGAN
          </h3>
        </div>
      )}
      
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card color="primary" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">PUSAT DATA</p>
            <h2 className="text-4xl font-mono-bold mt-2">{stats.activeDataCenters} <span className="text-xl">UNIT</span></h2>
            <div className="absolute top-4 right-4 text-[#FFD600]">
              <span className="material-symbols-outlined text-4xl" data-icon="apartment">apartment</span>
            </div>
          </CardContent>
        </Card>
        
        <Card color="secondary" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">PERANGKAT KERAS</p>
            <h2 className="text-4xl font-mono-bold mt-2">{stats.totalHardware} <span className="text-xl">UNIT</span></h2>
            <div className="absolute top-4 right-4 text-[#00E5FF]">
              <span className="material-symbols-outlined text-4xl" data-icon="storage">storage</span>
            </div>
          </CardContent>
        </Card>
        
        <Card color="danger" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">LAYANAN DIGITAL</p>
            <h2 className="text-4xl font-mono-bold mt-2">{stats.totalServices} <span className="text-xl">LAYANAN</span></h2>
            <div className="absolute top-4 right-4 text-[#FF3366]">
              <span className="material-symbols-outlined text-4xl" data-icon="verified">verified</span>
            </div>
          </CardContent>
        </Card>
        
        <Card color="accent" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">TOTAL BIAYA CLOUD</p>
            <h2 className="text-2xl font-mono-bold mt-2">{formatRupiah(stats.totalBudget)}</h2>
            <div className="absolute top-4 right-4 text-[#B388FF]">
              <span className="material-symbols-outlined text-4xl" data-icon="account_balance_wallet">account_balance_wallet</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Capacity Bar Charts (Using Real Data where possible) */}
        <div className="lg:col-span-8 bg-white border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-col">
          <div className="bg-[#1A1A1A] p-3 border-b-[3px] border-[#1A1A1A]">
            <h4 className="text-white font-mono font-bold uppercase text-sm">Resource Management Status</h4>
          </div>
          <div className="p-8 space-y-8 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono font-bold uppercase text-sm">Konektivitas Jaringan</span>
                <span className="font-mono font-bold text-lg">{konektivitas.filter(k => k.kategori === 'Jaringan Intra').length} Nodes Aktif</span>
              </div>
              <div className="h-10 w-full bg-[#EAE7E7] border-2 border-[#1A1A1A]">
                <div className="h-full bg-[#FFD600] diagonal-pattern border-r-2 border-[#1A1A1A]" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono font-bold uppercase text-sm">Sistem Penghubung (SPLP)</span>
                <span className="font-mono font-bold text-lg">{konektivitas.filter(k => k.kategori === 'SPLP').length} Hubs</span>
              </div>
              <div className="h-10 w-full bg-[#EAE7E7] border-2 border-[#1A1A1A]">
                <div className="h-full bg-[#00E5FF] diagonal-pattern border-r-2 border-[#1A1A1A]" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono font-bold uppercase text-sm">Rasio Layanan per Fasilitas</span>
                <span className="font-mono font-bold text-lg">{(layananDigital.length / (fasilitas.length || 1)).toFixed(1)} Avg</span>
              </div>
              <div className="h-10 w-full bg-[#EAE7E7] border-2 border-[#1A1A1A]">
                <div className="h-full bg-[#B388FF] diagonal-pattern border-r-2 border-[#1A1A1A]" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Layer Summary */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#FFD600] border-[3px] border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-xs uppercase bg-[#1A1A1A] text-white px-2 py-0.5">LAYER 01</span>
              <h3 className="font-mono font-black text-2xl mt-2">PHYSICAL INFRA</h3>
            </div>
            <div className="text-5xl font-mono font-black">{stats.totalHardware} <span className="text-xl">ASSETS</span></div>
          </div>
          <div className="bg-[#00E5FF] border-[3px] border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-xs uppercase bg-[#1A1A1A] text-white px-2 py-0.5">LAYER 02</span>
              <h3 className="font-mono font-black text-2xl mt-2">DIGITAL PLATFORM</h3>
            </div>
            <div className="text-5xl font-mono font-black">{layananDigital.filter(s => s.kategori === 'Platform').length} <span className="text-xl">SYSTEMS</span></div>
          </div>
          <div className="bg-[#B388FF] border-[3px] border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-xs uppercase bg-[#1A1A1A] text-white px-2 py-0.5">LAYER 03</span>
              <h3 className="font-mono font-black text-2xl mt-2">CLOUD SERVICES</h3>
            </div>
            <div className="text-5xl font-mono font-black">{layananDigital.filter(s => s.kategori === 'Cloud').length} <span className="text-xl">SERVICES</span></div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table (Static for now, will keep basic layout) */}
      <Card>
        <div className="bg-[#1A1A1A] p-4 border-b-[3px] border-[#1A1A1A] flex justify-between items-center">
          <h4 className="text-white font-mono font-bold uppercase text-sm">Recent Asset Synchronized</h4>
        </div>
        <Table>
          <TableHead>
            <TableHeader>Asset Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableHead>
          <TableBody>
            {hardware.slice(0, 4).map(h => (
              <TableRow key={h.id}>
                <TableCell className="font-mono-bold">{h.namaPerangkat}</TableCell>
                <TableCell>{h.kategori}</TableCell>
                <TableCell><StatusBadge status="Synchronized" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
