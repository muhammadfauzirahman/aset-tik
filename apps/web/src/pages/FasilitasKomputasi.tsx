import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useFasilitasStore } from '../store/useFasilitasStore';
import { useMasterData } from '../store/useMasterData';
import type { FasilitasKomputasi, JenisFasilitas, KlasifikasiTier, KepemilikanFasilitas, StatusFasilitas } from '../types';

// Helper for bandwidth
const formatBandwidth = (mbps: number) => {
  if (!mbps) return '0 Mbps';
  if (mbps >= 1000 && mbps % 1000 === 0) return `${mbps / 1000} Gbps`;
  return `${mbps} Mbps`;
};

// Error Alert Component for Brutalist style
const Alert = ({ message, type = 'error', onClose }: { message: string, type?: 'error' | 'success', onClose?: () => void }) => {
  if (!message) return null;
  return (
    <div className={`p-4 mb-4 border-[3px] border-[#1A1A1A] flex justify-between items-start shadow-[4px_4px_0px_0px_#1A1A1A] ${
      type === 'error' ? 'bg-[#FF3366] text-white' : 'bg-[#00E5FF] text-[#1A1A1A]'
    }`}>
      <div className="flex gap-3">
        <span className="material-symbols-outlined mt-0.5">{type === 'error' ? 'warning' : 'check_circle'}</span>
        <p className="font-mono font-bold leading-tight">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
};

export function FasilitasKomputasiPage() {
  const { fasilitas, addFasilitas, updateFasilitas, deleteFasilitas } = useFasilitasStore();
  const { instansi } = useMasterData();

  const [activeFilter, setActiveFilter] = useState<'Semua' | JenisFasilitas>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FasilitasKomputasi | null>(null);
  const [alertMsg, setAlertMsg] = useState('');

  // Form State
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState<JenisFasilitas>('Pusat Data');
  
  // Bandwidth State (UI fields: number + unit)
  const [bwIntra, setBwIntra] = useState<number>(0);
  const [unitIntra, setUnitIntra] = useState<'Kbps'|'Mbps'|'Gbps'>('Mbps');
  const [bwInter, setBwInter] = useState<number>(0);
  const [unitInter, setUnitInter] = useState<'Kbps'|'Mbps'|'Gbps'>('Mbps');

  const [lokasi, setLokasi] = useState('');
  const [tier, setTier] = useState<KlasifikasiTier>('Non-Tier');
  const [kepemilikan, setKepemilikan] = useState<KepemilikanFasilitas>('Sendiri');
  const [pengamanan, setPengamanan] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [status, setStatus] = useState<StatusFasilitas>('Aktif');

  // Convert Gbps/Kbps to Mbps for saving
  const toMbps = (val: number, unit: 'Kbps'|'Mbps'|'Gbps') => {
    if (unit === 'Gbps') return val * 1000;
    if (unit === 'Kbps') return Math.floor(val / 1000); // simplify
    return val;
  };

  // Convert Mbps to optimal display unit for editing
  const getOptimalUnit = (mbps: number): { val: number, unit: 'Kbps'|'Mbps'|'Gbps'} => {
    if (mbps >= 1000 && mbps % 1000 === 0) return { val: mbps / 1000, unit: 'Gbps' };
    return { val: mbps, unit: 'Mbps' }; // omitting Kbps edit logic for simplicity unless < 1 mbps needed
  };

  const resetForm = () => {
    setEditingItem(null);
    setKode('');
    setNama('');
    setJenis('Pusat Data');
    setBwIntra(0); setUnitIntra('Mbps');
    setBwInter(0); setUnitInter('Mbps');
    setLokasi('');
    setTier('Non-Tier');
    setKepemilikan('Sendiri');
    setPengamanan('');
    setInstansiId(instansi[0]?.id || '');
    setStatus('Aktif');
    setAlertMsg('');
  };

  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (item: FasilitasKomputasi) => {
    resetForm();
    setEditingItem(item);
    setKode(item.kodeFasilitas);
    setNama(item.namaFasilitas);
    setJenis(item.jenisFasilitas);
    
    const intraOpt = getOptimalUnit(item.bandwidthIntranet);
    setBwIntra(intraOpt.val); setUnitIntra(intraOpt.unit);
    
    const interOpt = getOptimalUnit(item.bandwidthInternet);
    setBwInter(interOpt.val); setUnitInter(interOpt.unit);

    setLokasi(item.lokasiFisik);
    setTier(item.klasifikasiTier || 'Non-Tier');
    setKepemilikan(item.kepemilikan);
    setPengamanan(item.sistemPengamanan);
    setInstansiId(item.instansiId);
    setStatus(item.status);

    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteFasilitas(id);
      setAlertMsg('');
    } catch (err: any) {
      setAlertMsg(err.message);
      // Scroll to top to see alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg('');

    // Validation
    if (jenis === 'Pusat Data' && (!tier || tier === 'Non-Tier')) {
      alert("Klasifikasi Tier wajib diisi untuk Pusat Data (Minimal Tier 3).");
      return;
    }
    
    if (kepemilikan !== 'Sendiri' && lokasi.trim() === '') {
      alert("Lokasi fisik/Vendor wajib diisi jika kepemilikan bukan Sendiri.");
      return;
    }

    const payload: Omit<FasilitasKomputasi, 'id' | 'childAssetsCount'> = {
      kodeFasilitas: kode,
      namaFasilitas: nama,
      jenisFasilitas: jenis,
      bandwidthIntranet: toMbps(bwIntra, unitIntra),
      bandwidthInternet: toMbps(bwInter, unitInter),
      lokasiFisik: lokasi,
      klasifikasiTier: jenis === 'Pusat Data' ? tier : null, // Nullable logic
      kepemilikan,
      sistemPengamanan: pengamanan,
      instansiId,
      status
    };

    if (editingItem) {
      updateFasilitas(editingItem.id, payload);
    } else {
      addFasilitas(payload);
    }
    setIsModalOpen(false);
  };

  const filteredData = activeFilter === 'Semua' 
    ? fasilitas 
    : fasilitas.filter(f => f.jenisFasilitas === activeFilter);

  // Summary Cards Data
  const totalFasilitas = fasilitas.length;
  const totalBwInternet = fasilitas.reduce((acc, curr) => acc + curr.bandwidthInternet, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-mono font-black uppercase tracking-tight">Fasilitas Komputasi</h1>
          <p className="font-body opacity-80 mt-1 max-w-2xl">
            Pusat Data, Komputasi, dan Kendali yang menjadi fondasi penempatan aset infrastruktur (Server, Jaringan, dan Keamanan).
          </p>
        </div>
        <Button onClick={openAdd} size="lg">
          <span className="material-symbols-outlined mr-2">domain_add</span>
          Tambah Fasilitas
        </Button>
      </div>

      <Alert message={alertMsg} onClose={() => setAlertMsg('')} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFD600] border-[3px] border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
          <h3 className="font-mono font-bold uppercase text-sm mb-2 opacity-80">Total Fasilitas</h3>
          <p className="font-mono font-black text-4xl">{totalFasilitas}</p>
        </div>
        <div className="bg-[#B9FF66] border-[3px] border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
          <h3 className="font-mono font-bold uppercase text-sm mb-2 opacity-80">Total Kapasitas Internet</h3>
          <p className="font-mono font-black text-4xl">{formatBandwidth(totalBwInternet)}</p>
        </div>
        <div className="bg-white border-[3px] border-[#1A1A1A] p-5 shadow-[6px_6px_0px_0px_#1A1A1A]">
          <h3 className="font-mono font-bold uppercase text-sm mb-2 opacity-80">Aset Taut (Child Assets)</h3>
          <p className="font-mono font-black text-4xl">
            {fasilitas.reduce((acc, curr) => acc + (curr.childAssetsCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mt-8">
        {(['Semua', 'Pusat Data', 'Pusat Komputasi', 'Pusat Kendali'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-5 py-2 font-mono font-bold text-sm uppercase transition-all border-[3px] border-[#1A1A1A] ${
              activeFilter === tab 
              ? 'bg-[#1A1A1A] text-white shadow-[4px_4px_0px_0px_#FFD600] translate-y-0' 
              : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E8] shadow-[4px_4px_0px_0px_#1A1A1A] hover:-translate-y-1'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Data */}
      <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
        <Table>
          <TableHead>
            <TableHeader>Kode</TableHeader>
            <TableHeader>Nama & Jenis</TableHeader>
            <TableHeader>Kapasitas (Internet/Intra)</TableHeader>
            <TableHeader>Instansi / Lokasi</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Aksi</TableHeader>
          </TableHead>
          <TableBody>
            {filteredData.map((f) => {
              const instansiName = instansi.find(i => i.id === f.instansiId)?.singkatan || 'Unknown';
              return (
                <TableRow key={f.id}>
                  <TableCell className="font-mono-bold max-w-[100px] truncate" title={f.kodeFasilitas}>{f.kodeFasilitas}</TableCell>
                  <TableCell>
                    <div className="font-bold text-[#1A1A1A] mb-1">{f.namaFasilitas}</div>
                    <div className="flex gap-2 items-center">
                      <Badge color={f.jenisFasilitas === 'Pusat Data' ? 'primary' : f.jenisFasilitas === 'Pusat Kendali' ? 'danger' : 'success'}>
                        {f.jenisFasilitas}
                      </Badge>
                      {f.klasifikasiTier && f.klasifikasiTier !== 'Non-Tier' && (
                         <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-[#FFD600] px-1.5 py-0.5 uppercase">
                          {f.klasifikasiTier}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="opacity-70 inline-block w-12">Inet:</span> 
                      <strong className="font-mono">{formatBandwidth(f.bandwidthInternet)}</strong>
                    </div>
                    <div className="text-sm">
                      <span className="opacity-70 inline-block w-12">Intra:</span> 
                      <strong className="font-mono">{formatBandwidth(f.bandwidthIntranet)}</strong>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold mb-1">{instansiName}</div>
                    <div className="text-xs opacity-80 max-w-[200px] truncate">{f.lokasiFisik} ({f.kepemilikan})</div>
                  </TableCell>
                  <TableCell>
                    <Badge color={f.status === 'Aktif' ? 'success' : f.status === 'Perbaikan' ? 'secondary' : 'danger'}>
                      {f.status}
                    </Badge>
                    {(f.childAssetsCount || 0) > 0 && (
                      <div className="text-[10px] mt-1 font-mono hover:underline cursor-help" title="Cascade Restrict: Memiliki aset terikat">
                        {f.childAssetsCount} Aset Terikat
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(f)}>
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(f.id)}>
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center opacity-70 p-12 font-mono italic">
                  Belum ada data Fasilitas Komputasi terdaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Fasilitas Komputasi" : "Tambah Fasilitas Komputasi"}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {alertMsg && <Alert message={alertMsg} type="error" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Kode Fasilitas" 
              placeholder="Contoh: DC-01" 
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
            />
            <Select 
              label="Jenis Fasilitas"
              value={jenis}
              onChange={(e) => {
                const newJenis = e.target.value as JenisFasilitas;
                setJenis(newJenis);
                if (newJenis !== 'Pusat Data') setTier('Non-Tier');
              }}
              options={[
                { label: 'Pusat Data', value: 'Pusat Data' },
                { label: 'Pusat Komputasi', value: 'Pusat Komputasi' },
                { label: 'Pusat Kendali', value: 'Pusat Kendali' },
              ]}
            />
          </div>

          <Input 
            label="Nama Fasilitas" 
            placeholder="Contoh: Data Center Nasional Cikarang" 
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            autoFocus
          />

          <div className="space-y-2 p-3 bg-gray-50 border-2 border-black border-dashed">
            <label className="block text-sm font-mono font-bold uppercase truncate">Kapasitas Bandwidth (Internet)</label>
            <div className="flex gap-2">
              <Input 
                label="" 
                type="number"
                min="0"
                containerClassName="flex-1"
                placeholder="0"
                value={bwInter.toString()}
                onChange={(e) => setBwInter(Number(e.target.value))}
              />
              <Select 
                label=""
                containerClassName="w-32"
                value={unitInter}
                onChange={(e) => setUnitInter(e.target.value as any)}
                options={[
                  { label: 'Kbps', value: 'Kbps' },
                  { label: 'Mbps', value: 'Mbps' },
                  { label: 'Gbps', value: 'Gbps' },
                ]}
              />
            </div>
            
            <label className="block text-sm font-mono font-bold uppercase truncate mt-2">Kapasitas Bandwidth (Intranet)</label>
            <div className="flex gap-2">
              <Input 
                label="" 
                type="number"
                min="0"
                containerClassName="flex-1"
                placeholder="0"
                value={bwIntra.toString()}
                onChange={(e) => setBwIntra(Number(e.target.value))}
              />
              <Select 
                label=""
                containerClassName="w-32"
                value={unitIntra}
                onChange={(e) => setUnitIntra(e.target.value as any)}
                options={[
                  { label: 'Kbps', value: 'Kbps' },
                  { label: 'Mbps', value: 'Mbps' },
                  { label: 'Gbps', value: 'Gbps' },
                ]}
              />
            </div>
            <p className="text-xs font-mono opacity-70 italic">*Data akan tersimpan secara terpusat dalam format Mbps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Klasifikasi Tier"
              value={tier || 'Non-Tier'}
              onChange={(e) => setTier(e.target.value as KlasifikasiTier)}
              disabled={jenis !== 'Pusat Data'}
              options={[
                { label: 'Non-Tier', value: 'Non-Tier' },
                { label: 'Tier 3 (TCDD)', value: 'Tier 3' },
                { label: 'Tier 4 (TCDD)', value: 'Tier 4' },
              ]}
            />
             <Select 
              label="Kepemilikan"
              value={kepemilikan}
              onChange={(e) => setKepemilikan(e.target.value as KepemilikanFasilitas)}
              options={[
                { label: 'Sendiri (Pusat milik instansi)', value: 'Sendiri' },
                { label: 'BUMN / Layanan Publik', value: 'BUMN' },
                { label: 'Swasta / Enterprise', value: 'Swasta' },
                { label: 'Pihak Ketiga (Sewa)', value: 'Pihak Ketiga' },
              ]}
            />
          </div>

          <Input 
            label="Lokasi Fisik / Gedung / Vendor" 
            placeholder="Alamat atau Nama Vendor Cloud..." 
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
          />

          <Select 
            label="Unit Kerja Penanggung Jawab (Instansi)"
            value={instansiId}
            onChange={(e) => setInstansiId(e.target.value)}
            options={instansi.map(i => ({ label: `${i.singkatan} - ${i.namaInstansi}`, value: i.id }))}
          />

          <Input 
            label="Deskripsi Sistem Pengamanan (Opsional)" 
            placeholder="CCTV, Fingerprint, Fire Suppression..." 
            value={pengamanan}
            onChange={(e) => setPengamanan(e.target.value)}
          />

          <Select 
            label="Status Operasional"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFasilitas)}
            options={[
              { label: 'Aktif Beroperasi', value: 'Aktif' },
              { label: 'Dalam Perbaikan', value: 'Perbaikan' },
              { label: 'Non-Aktif / Ditutup', value: 'Non-Aktif' },
            ]}
          />

          <div className="flex gap-3 pt-6 border-t-4 border-[#1A1A1A] mt-8 sticky bottom-0 bg-white pb-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="flex-[2] shadow-[4px_4px_0_0_#1A1A1A]">
              {editingItem ? "SIMPAN PERUBAHAN" : "TAMBAH FASILITAS"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
