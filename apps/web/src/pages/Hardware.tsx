import { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

// Reusable Components
import { PageHeader } from '../components/layout/PageHeader';
import { FilterTabs } from '../components/ui/FilterTabs';
import { SummaryGrid } from '../components/ui/SummaryGrid';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { DetailField } from '../components/ui/DetailField';

// Stores & Hooks
import { useHardwareStore } from '../store/useHardwareStore';
import { useFasilitasStore } from '../store/useFasilitasStore';
import { useSoftwareStore } from '../store/useSoftwareStore';
import { useMasterData } from '../store/useMasterData';
import { useAssetCRUD } from '../hooks/useAssetCRUD';
import type { PerangkatKeras, HardwareKategori } from '../types';

export function Hardware() {
  const { hardware, addHardware, updateHardware, deleteHardware } = useHardwareStore();
  const { fasilitas } = useFasilitasStore();
  const { software } = useSoftwareStore();
  const { instansi } = useMasterData();

  const [activeFilter, setActiveFilter] = useState<'Semua' | HardwareKategori>('Semua');

  // Form State
  const [kategori, setKategori] = useState<HardwareKategori>('Server');
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [statusKepemilikan, setStatusKepemilikan] = useState('Sendiri');
  const [memori, setMemori] = useState('');
  const [penyimpanan, setPenyimpanan] = useState('');
  const [prosesor, setProsesor] = useState('');
  const [teknikSimpan, setTeknikSimpan] = useState('');
  const [tipe, setTipe] = useState('');
  const [metodeAkses, setMetodeAkses] = useState('');
  const [lokasiDetil, setLokasiDetil] = useState('');
  const [penggunaan, setPenggunaan] = useState('');
  const [fasilitasId, setFasilitasId] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [perangkatJaringanId, setPerangkatJaringanId] = useState('');
  const [perangkatServerId, setPerangkatServerId] = useState('');
  const [softwareId, setSoftwareId] = useState('');
  const [dataInfoDependency, setDataInfoDependency] = useState('');

  const resetForm = () => {
    setKategori('Server');
    setKode('');
    setNama('');
    setDeskripsi('');
    setPemilik('');
    setStatusKepemilikan('Sendiri');
    setInstansiId(instansi[0]?.id || '');
    setMemori('');
    setPenyimpanan('');
    setProsesor('');
    setTeknikSimpan('');
    setTipe('');
    setMetodeAkses('');
    setLokasiDetil('');
    setPenggunaan('');
    setFasilitasId('');
    setPerangkatJaringanId('');
    setPerangkatServerId('');
    setSoftwareId('');
    setDataInfoDependency('');
  };

  const {
    openAddModal,
    openEditModal,
    openDetailModal,
    closeModals,
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    editingItem,
    detailItem
  } = useAssetCRUD<PerangkatKeras>();

  const handleAdd = () => {
    resetForm();
    openAddModal();
  };

  const handleEdit = (item: PerangkatKeras) => {
    setKategori(item.kategori);
    setKode(item.kodeAset);
    setNama(item.namaPerangkat);
    setDeskripsi(item.deskripsi);
    setPemilik(item.pemilik);
    setStatusKepemilikan(item.statusKepemilikan);
    setInstansiId(item.instansiId || '');
    setMemori(item.kapasitasMemori || '');
    setPenyimpanan(item.kapasitasPenyimpanan || '');
    setProsesor(item.teknologiProsesor || '');
    setTeknikSimpan(item.teknikPenyimpanan || '');
    setTipe(item.tipePerangkat || '');
    setMetodeAkses(item.metodeAkses || '');
    setLokasiDetil(item.lokasiPenempatan || '');
    setPenggunaan(item.jenisPenggunaanServer || '');
    setFasilitasId(item.fasilitasId || '');
    setPerangkatJaringanId(item.perangkatJaringanId || '');
    setPerangkatServerId(item.perangkatServerId || '');
    setSoftwareId(item.softwareId || '');
    setDataInfoDependency(item.dataInfoDependency || '');
    openEditModal(item);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<PerangkatKeras, 'id'> = {
      kategori,
      kodeAset: kode,
      namaPerangkat: nama,
      deskripsi,
      pemilik,
      unitPengelola: instansi.find(i => i.id === instansiId)?.namaInstansi || '',
      statusKepemilikan,
      instansiId,
      kapasitasMemori: kategori === 'Server' ? memori : undefined,
      kapasitasPenyimpanan: (kategori === 'Server' || kategori === 'Penyimpanan') ? penyimpanan : undefined,
      teknologiProsesor: kategori === 'Server' ? prosesor : undefined,
      teknikPenyimpanan: (kategori === 'Server' || kategori === 'Penyimpanan') ? teknikSimpan : undefined,
      tipePerangkat: (kategori !== 'Server' && kategori !== 'Penyimpanan') ? tipe : undefined,
      metodeAkses: kategori === 'Penyimpanan' ? metodeAkses : undefined,
      lokasiPenempatan: lokasiDetil,
      jenisPenggunaanServer: kategori === 'Server' ? penggunaan : undefined,
      fasilitasId: (kategori === 'Keamanan' || kategori === 'Server' || kategori === 'Jaringan') ? fasilitasId : undefined,
      perangkatJaringanId: (kategori === 'Keamanan' || kategori === 'Jaringan' || kategori === 'Server') ? perangkatJaringanId : undefined,
      perangkatServerId: (kategori === 'Penyimpanan') ? perangkatServerId : undefined,
      softwareId: (kategori === 'Penyimpanan' || kategori === 'Server') ? softwareId : undefined,
      dataInfoDependency: kategori === 'Penyimpanan' ? dataInfoDependency : undefined,
    };

    if (isEditModalOpen && editingItem) {
      updateHardware(editingItem.id, payload);
    } else {
      addHardware(payload);
    }
    closeModals();
  };

  const filteredHardware = activeFilter === 'Semua' 
    ? hardware 
    : hardware.filter(h => h.kategori === activeFilter);

  const summaryItems = [
    { label: 'Server', value: hardware.filter(h => h.kategori === 'Server').length, color: 'green' as const },
    { label: 'Jaringan', value: hardware.filter(h => h.kategori === 'Jaringan').length, color: 'yellow' as const },
    { label: 'Keamanan', value: hardware.filter(h => h.kategori === 'Keamanan').length, color: 'blue' as const },
    { label: 'Lainnya', value: hardware.filter(h => h.kategori === 'Penyimpanan' || h.kategori === 'Periferal').length, color: 'white' as const },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Manajemen Hardware"
        subtitle="Pengelolaan aset fisik infrastruktur TIK (Server, Jaringan, dan Keamanan) dalam ekosistem SPBE."
        onAdd={handleAdd}
        addLabel="Tambah Hardware"
        icon="dns"
      />

      <SummaryGrid items={summaryItems} />

      <FilterTabs 
        tabs={['Semua', 'Server', 'Jaringan', 'Keamanan', 'Penyimpanan', 'Periferal']}
        activeTab={activeFilter}
        onTabChange={(f) => setActiveFilter(f as any)}
      />

      <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
        <Table>
          <TableHead>
            <TableHeader>Aset & Kategori</TableHeader>
            <TableHeader>Pengelola & Lokasi</TableHeader>
            <TableHeader>Kepemilikan</TableHeader>
            <TableHeader className="text-right">Aksi</TableHeader>
          </TableHead>
          <TableBody>
            {filteredHardware.map((h) => (
              <TableRow key={h.id}>
                <TableCell>
                  <div className="font-mono-bold text-xs mb-1 uppercase opacity-60">{h.kodeAset}</div>
                  <div className="font-bold text-sm">{h.namaPerangkat}</div>
                  <StatusBadge status={h.kategori} className="mt-1" />
                </TableCell>
                <TableCell>
                  <div className="text-xs font-bold">{h.unitPengelola}</div>
                  <div className="text-[10px] opacity-70">Loc: {h.lokasiPenempatan || '-'}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={h.statusKepemilikan} />
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons 
                    onDetail={() => openDetailModal(h)}
                    onEdit={() => handleEdit(h)}
                    onDelete={() => { if(confirm('Hapus aset ini?')) deleteHardware(h.id) }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal 
        isOpen={isAddModalOpen || isEditModalOpen} 
        onClose={closeModals} 
        title={isEditModalOpen ? "Edit Aset Hardware" : "Tambah Aset Hardware"}
        size="lg"
        closeOnOverlayClick={false}
      >
        <form onSubmit={handleSave} className="space-y-6 px-1 pb-4">
          {/* Section 1: Identitas */}
          <section className="space-y-4">
            <h4 className="text-xs font-mono-bold uppercase bg-[#B9FF66] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              1. Identitas Perangkat
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value as HardwareKategori)}
                options={['Server', 'Jaringan', 'Keamanan', 'Penyimpanan', 'Periferal'].map(c => ({ label: `Perangkat Keras ${c}`, value: c }))}
              />
              <Input label="Kode Aset" value={kode} onChange={(e) => setKode(e.target.value)} required placeholder="e.g. SRV-001" />
            </div>
            <Input 
              label={kategori === 'Server' ? "Nama Server" : kategori === 'Jaringan' ? "Nama Network/Communication Device" : kategori === 'Keamanan' ? "Nama Perangkat Keamanan" : kategori === 'Penyimpanan' ? "Nama Data Storage" : "Nama Perangkat Periferal"} 
              value={nama} onChange={(e) => setNama(e.target.value)} required placeholder="Sesuai Nama Perangkat" 
            />
            <Textarea 
              label={kategori === 'Server' ? "Deskripsi Server" : kategori === 'Jaringan' ? "Deskripsi Network/Communication Device" : kategori === 'Keamanan' ? "Deskripsi Security Device" : kategori === 'Penyimpanan' ? "Deskripsi Data Storage" : "Deskripsi Periferal"} 
              value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Tuliskan deskripsi perangkat secara detail..." rows={3} 
            />
          </section>
          
          {/* Section 2: Spesifikasi Teknis */}
          <section className="space-y-4 p-4 bg-gray-50 border-2 border-black border-dashed">
            <h4 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              2. Spesifikasi Teknis
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {(kategori === 'Server' || kategori === 'Jaringan') && (
                <Input label={kategori === 'Server' ? "Kapasitas Memori" : "Tipe Memori/Bandwidth"} placeholder="e.g. 64 GB" value={memori} onChange={(e) => setMemori(e.target.value)} />
              )}
              {(kategori === 'Server' || kategori === 'Penyimpanan') && (
                <Input label={kategori === 'Server' ? "Jumlah Kapasitas Penyimpanan" : "Kapasitas Penyimpanan"} placeholder="e.g. 1.2 TB SAS" value={penyimpanan} onChange={(e) => setPenyimpanan(e.target.value)} />
              )}
              {kategori === 'Server' && (
                <>
                  <Select label="Jenis Penggunaan Server" value={penggunaan} onChange={(e) => setPenggunaan(e.target.value)}
                    options={['Server Aplikasi', 'Server Database', 'File Server', 'Web Server', 'Mail Server', 'Active Directory', 'DNS', 'Proxy'].map(v => ({ label: v, value: v }))}
                  />
                  <Select label="Jenis Teknologi Prosesor" value={prosesor} onChange={(e) => setProsesor(e.target.value)}
                    options={['High End', 'Mid End', 'Low End'].map(v => ({ label: v, value: v }))}
                  />
                  <Input label="Teknik Penyimpanan" value={teknikSimpan} onChange={(e) => setTeknikSimpan(e.target.value)} placeholder="e.g. RAID 0, RAID 5" />
                  <Input label="Lokasi Perangkat Lunak Server" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} placeholder="Lokasi OS/SW" />
                </>
              )}
              {kategori === 'Jaringan' && (
                <Select label="Tipe Network/Communication Device" value={tipe} onChange={(e) => setTipe(e.target.value)}
                  options={['Router', 'Multilayer Switch', 'Core Switch', 'Access Point', 'Gateway'].map(v => ({ label: v, value: v }))}
                />
              )}
              {kategori === 'Keamanan' && (
                <Select label="Tipe Security Device" value={tipe} onChange={(e) => setTipe(e.target.value)}
                  options={['Firewall Hardware', 'WAF', 'IPS/IDS', 'VPN Gateway', 'HSM'].map(v => ({ label: v, value: v }))}
                />
              )}
              {kategori === 'Penyimpanan' && (
                <>
                  <Select label="Metode Akses Data Sharing" value={metodeAkses} onChange={(e) => setMetodeAkses(e.target.value)}
                    options={['NAS', 'SAN', 'Object Storage (S3)', 'Direct Attached'].map(v => ({ label: v, value: v }))}
                  />
                  <Input label="Lokasi Data Storage" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} placeholder="e.g. Rack A-12" />
                </>
              )}
              {kategori === 'Periferal' && (
                <>
                  <Input label="Tipe Periferal" value={tipe} onChange={(e) => setTipe(e.target.value)} placeholder="e.g. Scanner High Volume, Printer Plotter" />
                  <Input label="Lokasi Penempatan Periferal" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} placeholder="e.g. Ruang Arsip Lt.1" />
                </>
              )}
            </div>
          </section>

          {/* Section 3: Pengelola & Kepemilikkan */}
          <section className="space-y-4">
            <h4 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              3. Pengelola & Kepemilikkan
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nama Pemilik" value={pemilik} onChange={(e) => setPemilik(e.target.value)} required placeholder="Instansi/Bagian Pemilik" />
              <Select label={
                kategori === 'Server' ? "Unit Pengelola Server" : 
                kategori === 'Jaringan' ? "Unit Pengelola Network Device" : 
                kategori === 'Keamanan' ? "Unit Pengelola Security Device" : 
                kategori === 'Penyimpanan' ? "Unit Pengelola Data Storage" : 
                "Unit Pengelola Perangkat Periferal"
              } value={instansiId} onChange={(e) => setInstansiId(e.target.value)}
                options={instansi.map(i => ({ label: i.namaInstansi, value: i.id }))}
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Status Kepemilikkan" value={statusKepemilikan} onChange={(e) => setStatusKepemilikan(e.target.value)}
                options={['Sendiri', 'Sewa', 'Hibah', 'BUMN/Pihak Ketiga'].map(v => ({ label: v, value: v }))}
                required 
              />
            </div>
          </section>

          {/* Section 4: Relasi Dependensi */}
          <section className="space-y-4">
            <h4 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              4. Relasi Dependensi Arsitektur
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="→ Fasilitas Komputasi (Dependency)" value={fasilitasId} onChange={(e) => setFasilitasId(e.target.value)}
                options={[{label: 'Pilih Fasilitas', value: ''}, ...fasilitas.map(f => ({ label: f.namaFasilitas, value: f.id }))]}
              />
              <Select label="→ Perangkat Jaringan (Dependency)" value={perangkatJaringanId} onChange={(e) => setPerangkatJaringanId(e.target.value)}
                options={[{label: 'Tanpa Koneksi', value: ''}, ...hardware.filter(h => h.kategori === 'Jaringan').map(h => ({ label: h.namaPerangkat, value: h.id }))]}
              />
              {(kategori === 'Server' || kategori === 'Penyimpanan') && (
                <Select label={kategori === 'Server' ? "→ Perangkat Lunak Platform (Dependency)" : "← Perangkat Lunak Platform (Dependency)"} value={softwareId} onChange={(e) => setSoftwareId(e.target.value)}
                  options={[{label: 'None / Bare Metal', value: ''}, ...software.map(s => ({ label: s.namaLayanan, value: s.id }))]}
                />
              )}
              {kategori === 'Penyimpanan' && (
                <Select label="← Perangkat Keras Server (Dependency)" value={perangkatServerId} onChange={(e) => setPerangkatServerId(e.target.value)}
                  options={[{label: 'Bukan Node/Host', value: ''}, ...hardware.filter(h => h.kategori === 'Server').map(h => ({ label: h.namaPerangkat, value: h.id }))]}
                />
              )}
            </div>
            {kategori === 'Penyimpanan' && (
              <Textarea label="← Data dan Informasi (Dependency)" value={dataInfoDependency} onChange={(e) => setDataInfoDependency(e.target.value)} rows={2} placeholder="Sebutkan relasi data..." />
            )}
          </section>

          <div className="flex gap-3 pt-6 border-t-4 border-black bg-white pb-2">
            <button type="button" onClick={closeModals} className="flex-1 py-3 font-black uppercase italic border-2 border-black hover:bg-gray-100 transition-all">
              Batal
            </button>
            <button type="submit" className="flex-[2] py-3 bg-black text-white font-black uppercase italic border-2 border-black shadow-[4px_4px_0_0_#666] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              SIMPAN DATA HARDWARE
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="Detail Aset Hardware" size="xl">
        {detailItem && (
          <div className="space-y-8 py-4 px-2">
            {/* Header Section */}
            <div className="border-l-8 border-black pl-6 py-2">
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">{detailItem.kodeAset}</div>
              <h2 className="text-4xl font-black uppercase leading-none mb-3">{detailItem.namaPerangkat}</h2>
              <div className="flex gap-2">
                <StatusBadge status={detailItem.kategori} />
                <StatusBadge status={detailItem.statusKepemilikan} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: General & Specs */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-black text-white px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#999]">
                    Informasi Umum & Identitas
                  </h3>
                  <div className="space-y-1">
                    <DetailField label="Kode Aset" value={detailItem.kodeAset} icon="qr_code" />
                    <DetailField 
                      label={detailItem.kategori === 'Server' ? "Nama Server" : detailItem.kategori === 'Jaringan' ? "Nama Network/Device" : detailItem.kategori === 'Keamanan' ? "Nama Perangkat Keamanan" : detailItem.kategori === 'Penyimpanan' ? "Nama Data Storage" : "Nama Perangkat Periferal"} 
                      value={detailItem.namaPerangkat} icon="inventory" 
                    />
                    <DetailField label="Kategori Aset" value={`Perangkat Keras ${detailItem.kategori}`} icon="category" />
                    <DetailField 
                      label={detailItem.kategori === 'Server' ? "Deskripsi Server" : detailItem.kategori === 'Jaringan' ? "Deskripsi Network/Device" : detailItem.kategori === 'Keamanan' ? "Deskripsi Security Device" : detailItem.kategori === 'Penyimpanan' ? "Deskripsi Data Storage" : "Deskripsi Periferal"} 
                      value={detailItem.deskripsi} icon="description" fullWidth 
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Spesifikasi Teknis & Kapasitas
                  </h3>
                  <div className="space-y-1 bg-gray-50 p-4 border-2 border-dashed border-black">
                    {detailItem.kategori === 'Server' && (
                      <>
                        <DetailField label="Kapasitas Memori" value={detailItem.kapasitasMemori} icon="memory" />
                        <DetailField label="Jumlah Kapasitas Penyimpanan" value={detailItem.kapasitasPenyimpanan} icon="storage" />
                        <DetailField label="Jenis Penggunaan Server" value={detailItem.jenisPenggunaanServer} icon="terminal" />
                        <DetailField label="Jenis Teknologi Prosesor" value={detailItem.teknologiProsesor} icon="processor" />
                        <DetailField label="Teknik Penyimpanan" value={detailItem.teknikPenyimpanan} icon="settings" />
                        <DetailField label="Lokasi Perangkat Lunak Server" value={detailItem.lokasiPenempatan} icon="location_on" />
                      </>
                    )}
                    {detailItem.kategori === 'Jaringan' && (
                      <DetailField label="Tipe Network/Communication Device" value={detailItem.tipePerangkat} icon="alt_route" />
                    )}
                    {detailItem.kategori === 'Keamanan' && (
                      <DetailField label="Tipe Security Device" value={detailItem.tipePerangkat} icon="security" />
                    )}
                    {detailItem.kategori === 'Penyimpanan' && (
                      <>
                        <DetailField label="Kapasitas Penyimpanan" value={detailItem.kapasitasPenyimpanan} icon="storage" />
                        <DetailField label="Metode Akses Data Sharing" value={detailItem.metodeAkses} icon="key" />
                        <DetailField label="Lokasi Data Storage" value={detailItem.lokasiPenempatan} icon="location_on" />
                      </>
                    )}
                    {detailItem.kategori === 'Periferal' && (
                      <>
                        <DetailField label="Tipe Periferal" value={detailItem.tipePerangkat} icon="devices_other" />
                        <DetailField label="Lokasi Penempatan Periferal" value={detailItem.lokasiPenempatan} icon="location_on" />
                      </>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Location & Dependencies */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Pengelola & Kepemilikan
                  </h3>
                  <div className="space-y-1">
                    <DetailField label="Nama Pemilik" value={detailItem.pemilik} icon="person" />
                    <DetailField label="Status Kepemilikkan" value={detailItem.statusKepemilikan} icon="verified_user" />
                    <DetailField 
                      label={
                        detailItem.kategori === 'Server' ? "Unit Pengelola Server" : 
                        detailItem.kategori === 'Jaringan' ? "Unit Pengelola Network Device" : 
                        detailItem.kategori === 'Keamanan' ? "Unit Pengelola Security Device" : 
                        detailItem.kategori === 'Penyimpanan' ? "Unit Pengelola Data Storage" : 
                        "Unit Pengelola Perangkat Periferal"
                      } 
                      value={detailItem.unitPengelola} icon="account_balance" 
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Relasi & Dependensi Arsitektur
                  </h3>
                  <div className="space-y-1">
                    <DetailField label="→ Fasilitas Komputasi (Dependency)" value={fasilitas.find(f => f.id === detailItem.fasilitasId)?.namaFasilitas || 'Unknown Facility'} icon="apartment" />
                    {detailItem.kategori === 'Keamanan' && (
                      <DetailField label="→ Perangkat Keras Jaringan (Dependency)" value={hardware.find(h => h.id === detailItem.perangkatJaringanId)?.namaPerangkat || 'None'} icon="lan" />
                    )}
                    {detailItem.kategori === 'Penyimpanan' && (
                      <>
                        <DetailField label="← Perangkat Lunak Platform (Dependency)" value={software.find(s => s.id === detailItem.softwareId)?.namaLayanan || 'None'} icon="layers" />
                        <DetailField label="← Perangkat Keras Server (Dependency)" value={hardware.find(h => h.id === detailItem.perangkatServerId)?.namaPerangkat || 'None'} icon="dns" />
                        <DetailField label="← Data dan Informasi (Dependency)" value={detailItem.dataInfoDependency} icon="link" fullWidth />
                      </>
                    )}
                    {detailItem.kategori === 'Server' && (
                      <DetailField label="→ Perangkat Lunak Platform (Dependency)" value={software.find(s => s.id === detailItem.softwareId)?.namaLayanan || 'None'} icon="layers" />
                    )}
                  </div>
                </section>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button 
                onClick={closeModals}
                className="bg-black text-white hover:bg-gray-800 px-10 py-3 rounded-none border-4 border-black shadow-[4px_4px_0_0_#999] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase font-black italic tracking-widest"
              >
                Tutup Detail
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
