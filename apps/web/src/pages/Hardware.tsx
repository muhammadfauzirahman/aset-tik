import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

// Reusable Components
import { PageHeader } from '../components/layout/PageHeader';
import { FilterTabs } from '../components/ui/FilterTabs';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { DetailField } from '../components/ui/DetailField';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { TableControls, Pagination } from '../components/ui/TableControls';

// Stores & Hooks
import { useHardware } from '../hooks/useHardware';
import { useTable } from '../hooks/useTable';
import { useFasilitas } from '../hooks/useFasilitas';
import { useLayananDigital } from '../hooks/useLayananDigital';
import { useMasterData } from '../hooks/useMasterData';
import { useAssetCRUD } from '../hooks/useAssetCRUD';
import { useLoadingProgress } from '../hooks/useLoadingProgress';
import type { PerangkatKeras, HardwareKategori, FasilitasKomputasi, LayananDigital, Instansi } from '../types';

export function Hardware() {
  const { 
    hardware, 
    isLoading, 
    error, 
    addHardware, 
    updateHardware, 
    deleteHardware,
  } = useHardware();

  const { isSaving, progress, startSaving, notifyMutationFinished, reset: resetLoading } = useLoadingProgress();
  
  const {
    isAddModalOpen, isEditModalOpen, isDetailModalOpen, editingItem, detailItem,
    openAddModal, openEditModal, openDetailModal, closeModals
  } = useAssetCRUD<PerangkatKeras>('hardware');

  // Form State Persistence Key
  const CACHE_KEY = 'hardware_form_cache';

  // Helper to get initial state from cache or default
  const getInitial = (key: string, defaultValue: any) => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return defaultValue;
    try {
      const parsed = JSON.parse(cached);
      return parsed[key] !== undefined ? parsed[key] : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [kategori, setKategori] = useState<HardwareKategori>(() => getInitial('kategori', 'Server'));
  const [kode, setKode] = useState(() => getInitial('kode', ''));
  const [nama, setNama] = useState(() => getInitial('nama', ''));
  const [namaPerangkat, setNamaPerangkat] = useState(() => getInitial('namaPerangkat', ''));
  const [deskripsi, setDeskripsi] = useState(() => getInitial('deskripsi', ''));
  const [pemilik, setPemilik] = useState(() => getInitial('pemilik', ''));
  const [statusKepemilikan, setStatusKepemilikan] = useState(() => getInitial('statusKepemilikan', 'Sendiri'));
  const [memori, setMemori] = useState(() => getInitial('memori', ''));
  const [penyimpanan, setPenyimpanan] = useState(() => getInitial('penyimpanan', ''));
  const [prosesor, setProsesor] = useState(() => getInitial('prosesor', ''));
  const [teknikSimpan, setTeknikSimpan] = useState(() => getInitial('teknikSimpan', ''));
  const [tipe, setTipe] = useState(() => getInitial('tipe', ''));
  const [metodeAkses, setMetodeAkses] = useState(() => getInitial('metodeAkses', ''));
  const [lokasiDetil, setLokasiDetil] = useState(() => getInitial('lokasiDetil', ''));
  const [penggunaan, setPenggunaan] = useState(() => getInitial('penggunaan', ''));
  const [instansiId, setInstansiId] = useState<number | ''>(() => getInitial('instansiId', ''));
  const [fasilitasId, setFasilitasId] = useState<number | ''>(() => getInitial('fasilitasId', ''));
  const [perangkatJaringanId, setPerangkatJaringanId] = useState<number | ''>(() => getInitial('perangkatJaringanId', ''));
  const [perangkatServerId, setPerangkatServerId] = useState<number | ''>(() => getInitial('perangkatServerId', ''));
  const [softwareId, setSoftwareId] = useState<number | ''>(() => getInitial('softwareId', ''));
  const [dataInfoDependency, setDataInfoDependency] = useState(() => getInitial('dataInfoDependency', ''));

  // Sync Form to LocalStorage
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        kategori, kode, nama, namaPerangkat, deskripsi, pemilik, statusKepemilikan,
        memori, penyimpanan, prosesor, teknikSimpan, tipe, metodeAkses, lokasiDetil, penggunaan,
        instansiId, fasilitasId, perangkatJaringanId, perangkatServerId, softwareId, dataInfoDependency
      }));
    }
  }, [
    kategori, kode, nama, namaPerangkat, deskripsi, pemilik, statusKepemilikan,
    memori, penyimpanan, prosesor, teknikSimpan, tipe, metodeAkses, lokasiDetil, penggunaan,
    instansiId, fasilitasId, perangkatJaringanId, perangkatServerId, softwareId, dataInfoDependency,
    isAddModalOpen, isEditModalOpen
  ]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
  }, []);

  const { fasilitas } = useFasilitas();
  const { layananDigital: software } = useLayananDigital();
  const { instansi } = useMasterData();

  const [activeFilter, setActiveFilter] = useState<'Semua' | HardwareKategori>('Semua');

  const filteredHardwareRaw = useMemo(() => {
    return activeFilter === 'Semua' 
      ? hardware 
      : hardware.filter(h => h.kategori.toUpperCase() === activeFilter.toUpperCase());
  }, [hardware, activeFilter]);

  const { 
    paginatedData, sortConfig, requestSort, searchQuery, setSearchQuery, 
    pageSize, setPageSize, currentPage, setCurrentPage, totalPages, exportToCSV
  } = useTable({ data: filteredHardwareRaw });

  const handleFilterChange = (f: any) => {
    setActiveFilter(f);
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isLoading: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isLoading: false,
    onConfirm: () => { }
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ isOpen: true, title, message, isLoading: false, onConfirm });
  };

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false, isLoading: false }));

  const resetForm = () => {
    setKategori('Server'); setKode(''); setNama(''); setNamaPerangkat(''); setDeskripsi(''); setPemilik(''); setStatusKepemilikan('Sendiri');
    setInstansiId(instansi[0]?.id || ''); setMemori(''); setPenyimpanan(''); setProsesor(''); setTeknikSimpan(''); setTipe('');
    setMetodeAkses(''); setLokasiDetil(''); setPenggunaan(''); setFasilitasId(''); setPerangkatJaringanId('');
    setPerangkatServerId(''); setSoftwareId(''); setDataInfoDependency('');
    clearCache();
  };

  const handleAdd = () => { resetForm(); openAddModal(); };

  const handleEdit = useCallback((item: PerangkatKeras) => {
    // Normalize category for frontend state
    let normalized = item.kategori as any;
    if (normalized === 'SERVER') normalized = 'Server';
    else if (normalized === 'JARINGAN') normalized = 'Jaringan';
    else if (normalized === 'KEAMANAN') normalized = 'Keamanan';
    else if (normalized === 'PENYIMPANAN') normalized = 'Penyimpanan';
    else if (normalized === 'PERIFERAL') normalized = 'Periferal';
    
    setKategori(normalized as HardwareKategori); 
    setKode(item.kodeAset); setNamaPerangkat(item.namaPerangkat);
    setDeskripsi(item.deskripsi); setPemilik(item.pemilik); setStatusKepemilikan(item.statusKepemilikan);
    setInstansiId(item.instansiId || ''); setMemori(item.kapasitasMemori || ''); setPenyimpanan(item.kapasitasPenyimpanan || '');
    setProsesor(item.teknologiProsesor || ''); setTeknikSimpan(item.teknikPenyimpanan || ''); setTipe(item.tipePerangkat || '');
    setMetodeAkses(item.metodeAkses || ''); setLokasiDetil(item.lokasiPenempatan || ''); setPenggunaan(item.jenisPenggunaanServer || '');
    setFasilitasId(item.fasilitasId || ''); setPerangkatJaringanId(item.perangkatJaringanId || '');
    setPerangkatServerId(item.perangkatServerId || ''); setSoftwareId(item.softwareId || '');
    setDataInfoDependency(item.dataInfoDependency || '');
    openEditModal(item);
  }, [openEditModal]);

  // Sticky Focus Persistence
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (isEditModalOpen && editingItem && !cached) {
      handleEdit(editingItem);
    }
  }, [isEditModalOpen, editingItem, handleEdit]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startSaving();
    
    const payload: Omit<PerangkatKeras, 'id'> = {
      kategori: kategori.toUpperCase() as any,
      kodeAset: kode,
      namaPerangkat: namaPerangkat,
      deskripsi,
      pemilik,
      unitPengelola: instansi.find((i: Instansi) => i.id === Number(instansiId))?.namaInstansi || '',
      statusKepemilikan,
      instansiId: Number(instansiId),
      kapasitasMemori: kategori === 'Server' ? memori : undefined,
      kapasitasPenyimpanan: (kategori === 'Server' || kategori === 'Penyimpanan') ? penyimpanan : undefined,
      teknologiProsesor: kategori === 'Server' ? prosesor : undefined,
      teknikPenyimpanan: (kategori === 'Server' || kategori === 'Penyimpanan') ? teknikSimpan : undefined,
      tipePerangkat: (kategori !== 'Server' && kategori !== 'Penyimpanan') ? tipe : undefined,
      metodeAkses: kategori === 'Penyimpanan' ? metodeAkses : undefined,
      lokasiPenempatan: lokasiDetil,
      jenisPenggunaanServer: kategori === 'Server' ? penggunaan : undefined,
      fasilitasId: kategori !== 'Jaringan' ? (fasilitasId ? Number(fasilitasId) : undefined) : undefined,
      perangkatJaringanId: kategori !== 'Jaringan' ? (perangkatJaringanId ? Number(perangkatJaringanId) : undefined) : undefined,
      perangkatServerId: (kategori === 'Penyimpanan') ? (perangkatServerId === '' ? undefined : Number(perangkatServerId)) : undefined,
      softwareId: (kategori === 'Penyimpanan' || kategori === 'Server') ? (softwareId === '' ? undefined : Number(softwareId)) : undefined,
      dataInfoDependency: kategori === 'Penyimpanan' ? dataInfoDependency : undefined,
    };

    const options = { 
      onSuccess: () => {
        clearCache();
        notifyMutationFinished(closeModals);
      },
      onError: resetLoading
    };

    if (isEditModalOpen && editingItem) {
      updateHardware(String(editingItem.id), payload, options);
    } else {
      addHardware(payload, options);
    }
  };

  const isInitialLoading = isLoading && hardware.length === 0;

  if (error) {
    return (
      <div className="p-6 bg-red-100 border-4 border-red-600 text-red-600 font-bold">
        Gagal memuat data: {(error as any).message}
      </div>
    );
  }

  const counts = {
    'Semua': hardware.length,
    'Server': hardware.filter(h => h.kategori.toUpperCase() === 'SERVER').length,
    'Jaringan': hardware.filter(h => h.kategori.toUpperCase() === 'JARINGAN').length,
    'Keamanan': hardware.filter(h => h.kategori.toUpperCase() === 'KEAMANAN').length,
    'Penyimpanan': hardware.filter(h => h.kategori.toUpperCase() === 'PENYIMPANAN').length,
    'Periferal': hardware.filter(h => h.kategori.toUpperCase() === 'PERIFERAL').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Hardware & Perangkat" 
        subtitle="Daftar infrastruktur fisik mulai dari server, perangkat jaringan, hingga perangkat periferal."
        onAdd={handleAdd} addLabel="Tambah Perangkat" icon="computer"
      />
      
      {isInitialLoading ? (
        <div className="flex items-center justify-center h-[50vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_#1A1A1A]">
          <div className="text-2xl font-black uppercase animate-pulse italic">Memuat Data Hardware...</div>
        </div>
      ) : (
        <>
          <FilterTabs 
            tabs={['Semua', 'Server', 'Jaringan', 'Keamanan', 'Penyimpanan', 'Periferal']} 
            activeTab={activeFilter} onTabChange={handleFilterChange} counts={counts}
          />

          <TableControls 
            searchQuery={searchQuery} onSearch={setSearchQuery} pageSize={pageSize}
            onPageSizeChange={setPageSize} onExport={() => exportToCSV(`hardware-${activeFilter.toLowerCase()}.csv`)}
          />

          <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
            <Table>
              <TableHead>
                <TableHeader sortKey="namaPerangkat" onSort={requestSort} activeSortConfig={sortConfig}>Aset & Kategori</TableHeader>
                <TableHeader sortKey="unitPengelola" onSort={requestSort} activeSortConfig={sortConfig}>Pengelola & Lokasi</TableHeader>
                <TableHeader sortKey="statusKepemilikan" onSort={requestSort} activeSortConfig={sortConfig}>Kepemilikan</TableHeader>
                <TableHeader className="text-right">Aksi</TableHeader>
              </TableHead>
              <TableBody>
                {paginatedData.map((h: PerangkatKeras) => (
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
                    <TableCell><StatusBadge status={h.statusKepemilikan} /></TableCell>
                    <TableCell className="text-right">
                      <ActionButtons 
                        onDetail={() => openDetailModal(h)} onEdit={() => handleEdit(h)}
                        onDelete={() => triggerConfirm(
                          'Hapus Aset Hardware?',
                          `Apakah Anda yakin ingin menghapus "${h.namaPerangkat}"? Data pendukung lainnya mungkin akan terpengaruh.`,
                          () => {
                            setConfirmConfig(prev => ({ ...prev, isLoading: true }));
                            deleteHardware(String(h.id), { 
                                onSuccess: closeConfirm,
                                onError: () => setConfirmConfig(prev => ({ ...prev, isLoading: false }))
                            });
                          }
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center opacity-40">
                        <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                        <p className="font-mono text-sm uppercase italic">Data tidak ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </Card>
        </>
      )}

      {/* MODALS OUTSIDE FOR PERSISTENCE */}
      <Modal isOpen={isAddModalOpen || isEditModalOpen} onClose={closeModals} title={isEditModalOpen ? "Edit Aset Hardware" : "Tambah Aset Hardware"} size="lg">
        <form onSubmit={handleSave} className="space-y-6 px-1 pb-4">
          <fieldset disabled={isSaving}>
            <section className="space-y-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#B9FF66] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                1. Identitas Perangkat
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value as HardwareKategori)}
                  options={[
                    { label: 'Perangkat Keras Server', value: 'Server' },
                    { label: 'Perangkat Keras Jaringan', value: 'Jaringan' },
                    { label: 'Perangkat Keras Keamanan', value: 'Keamanan' },
                    { label: 'Perangkat Keras Penyimpanan', value: 'Penyimpanan' },
                    { label: 'Perangkat Keras Periferal', value: 'Periferal' }
                  ]}
                />
                <Input label="Kode Aset" value={kode} onChange={(e) => setKode(e.target.value)} required placeholder="e.g. SRV-001" />
              </div>
              <Input 
                label={kategori === 'Server' ? "Nama Server" : kategori === 'Jaringan' ? "Nama Network/Communication Device" : kategori === 'Keamanan' ? "Nama Perangkat Keamanan" : kategori === 'Penyimpanan' ? "Nama Data Storage" : "Nama Perangkat Periferal"} 
                value={namaPerangkat} onChange={(e) => setNamaPerangkat(e.target.value)} required placeholder="Sesuai Nama Perangkat" 
              />
               <Textarea 
                label={kategori === 'Server' ? "Deskripsi Server" : kategori === 'Jaringan' ? "Deskripsi Network/Communication Device" : kategori === 'Keamanan' ? "Deskripsi Perangkat Keamanan" : kategori === 'Penyimpanan' ? "Deskripsi Data Storage" : "Deskripsi Perangkat"} 
                value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} 
                placeholder="Tuliskan deskripsi perangkat..." rows={3} 
              />
            </section>
            
            <section className="space-y-4 p-4 bg-gray-50 border-2 border-black border-dashed mt-10">
              <h4 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                2. Spesifikasi Teknis
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {kategori === 'Server' && (
                  <>
                    <Input label="Kapasitas Memori (GB)" type="number" value={memori} onChange={(e) => setMemori(e.target.value)} placeholder="e.g. 16" />
                    <Input label="Jumlah Kapasitas Penyimpanan (GB)" type="number" value={penyimpanan} onChange={(e) => setPenyimpanan(e.target.value)} placeholder="e.g. 1000" />
                    <Select label="Jenis Penggunaan Server" value={penggunaan} onChange={(e) => setPenggunaan(e.target.value)}
                      options={['Server Aplikasi', 'Server Database', 'File Server', 'Web Server', 'Mail Server', 'Active Directory', 'DNS', 'Proxy'].map(v => ({ label: v, value: v }))}
                    />
                    <Select label="Jenis Teknologi Prosesor" value={prosesor} onChange={(e) => setProsesor(e.target.value)}
                      options={['High End', 'Mid End', 'Low End'].map(v => ({ label: v, value: v }))}
                    />
                    <Select label="Teknik Penyimpanan" value={teknikSimpan} onChange={(e) => setTeknikSimpan(e.target.value)}
                      options={['Non Raid', 'Raid 0', 'Raid 1', 'Raid 3', 'Raid 5'].map(v => ({ label: v, value: v }))}
                    />
                    <Input label="Lokasi Perangkat Lunak Server" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} />
                  </>
                )}
                {kategori === 'Jaringan' && (
                  <Select label="Tipe Network/Communication Device" value={tipe} onChange={(e) => setTipe(e.target.value)}
                    options={['Switch L2', 'Switch L3', 'Switch L4', 'Switch L7', 'Multiplayer Switch', 'Router', 'Wireless Equipment', 'Transmission Equipment'].map(v => ({ label: v, value: v }))}
                  />
                )}
                {kategori === 'Keamanan' && (
                  <Select label="Tipe Security Device" value={tipe} onChange={(e) => setTipe(e.target.value)}
                    options={['Firewall', 'Intrusion Detection System', 'Intrusion Prevention System', 'Proxy', 'Load Balancer', 'Wireless Intrusion Prevention and Detection System', 'Unified Threat Management', 'Network Access Control'].map(v => ({ label: v, value: v }))}
                  />
                )}
                {kategori === 'Penyimpanan' && (
                  <>
                    <Input label="Kapasitas Penyimpanan" value={penyimpanan} onChange={(e) => setPenyimpanan(e.target.value)} placeholder="e.g. 10 TB" />
                    <Select label="Metode Akses Data Sharing" value={metodeAkses} onChange={(e) => setMetodeAkses(e.target.value)}
                      options={['Direct Attached Storage (DAS)', 'Network Attached Storage (NAS)'].map(v => ({ label: v, value: v }))}
                    />
                    <Input label="Lokasi Data Storage" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} containerClassName="col-span-2" />
                  </>
                )}
                {kategori === 'Periferal' && (
                  <>
                    <Input label="Tipe Periferal" value={tipe} onChange={(e) => setTipe(e.target.value)} />
                    <Input label="Lokasi Penempatan" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} />
                  </>
                )}
              </div>
            </section>

            <section className="space-y-4 mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                3. Pengelola & Kepemilikkan
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nama Pemilik" value={pemilik} onChange={(e) => setPemilik(e.target.value)} required />
                <Select label={kategori === 'Jaringan' ? "Unit Pengelola Network/Communication Device" : kategori === 'Penyimpanan' ? "Unit Pengelola Data Storage" : kategori === 'Server' ? "Unit Pengelola Server" : "Unit Pengelola"} value={instansiId.toString()} onChange={(e) => setInstansiId(Number(e.target.value))}
                  options={instansi.map(i => ({ label: i.singkatan, value: i.id.toString() }))} required 
                />
                <Select label="Status Kepemilikkan" value={statusKepemilikan} onChange={(e) => setStatusKepemilikan(e.target.value)}
                  options={(['Server', 'Jaringan', 'Keamanan', 'Penyimpanan'].includes(kategori) ? ['Sendiri', 'Instansi Pemerintah Lain', 'BUMN', 'Pihak Ketiga'] : ['Sendiri', 'Sewa', 'Hibah', 'BUMN/Pihak Ketiga']).map(v => ({ label: v, value: v }))} required 
                />
              </div>
            </section>

            {kategori !== 'Jaringan' && (
              <section className="space-y-4 mt-4">
                <h4 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                  4. Relasi Dependensi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kategori !== 'Penyimpanan' && kategori !== 'Server' && (
                    <>
                      <Select label="→ Fasilitas" value={fasilitasId?.toString()} onChange={(e) => setFasilitasId(e.target.value === '' ? '' : Number(e.target.value))}
                        options={[{label: 'Pilih Fasilitas', value: ''}, ...fasilitas.map((f: FasilitasKomputasi) => ({ label: f.namaFasilitas, value: f.id.toString() }))]}
                      />
                      <Select label="→ Perangkat Jaringan" value={perangkatJaringanId?.toString()} onChange={(e) => setPerangkatJaringanId(e.target.value === '' ? '' : Number(e.target.value))}
                        options={[{label: 'Tanpa Koneksi', value: ''}, ...hardware.filter(h => h.kategori.toUpperCase() === 'JARINGAN').map(h => ({ label: h.namaPerangkat, value: h.id.toString() }))]}
                      />
                    </>
                  )}
                  {(kategori === 'Server' || kategori === 'Penyimpanan') && (
                    <Select label={kategori === 'Penyimpanan' ? "← Perangkat Lunak Platform (Dependency)" : "→ Software Platform"} value={softwareId?.toString()} onChange={(e) => setSoftwareId(e.target.value === '' ? '' : Number(e.target.value))}
                      options={[{label: 'None / Bare Metal', value: ''}, ...software.map((s: LayananDigital) => ({ label: s.namaLayanan, value: s.id.toString() }))]}
                    />
                  )}
                  {kategori === 'Penyimpanan' && (
                    <>
                      <Select label="← Perangkat Keras Server (Dependency)" value={perangkatServerId?.toString()} onChange={(e) => setPerangkatServerId(e.target.value === '' ? '' : Number(e.target.value))}
                        options={[{label: 'Tanpa Host Server', value: ''}, ...hardware.filter(h => h.kategori.toUpperCase() === 'SERVER').map(h => ({ label: h.namaPerangkat, value: h.id.toString() }))]}
                      />
                      <div className="col-span-1 md:col-span-2 space-y-4">
                        <Select 
                          label="← Data dan Informasi (Dependency)" 
                          value={!dataInfoDependency || ['Tanpa Data dan Informasi', 'Database Sektoral', 'File Backup', 'Data SPBE'].includes(dataInfoDependency) ? dataInfoDependency || 'Tanpa Data dan Informasi' : 'Lainnya'} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Lainnya') {
                              setDataInfoDependency('__CUSTOM__'); 
                            } else {
                              setDataInfoDependency(val);
                            }
                          }}
                          options={[
                            { label: 'Tanpa Data dan Informasi', value: 'Tanpa Data dan Informasi' },
                            { label: 'Database Sektoral', value: 'Database Sektoral' },
                            { label: 'File Backup', value: 'File Backup' },
                            { label: 'Data SPBE', value: 'Data SPBE' },
                            { label: 'Lainnya (Isi Manual)', value: 'Lainnya' }
                          ]}
                        />
                        {(dataInfoDependency === '__CUSTOM__' || (dataInfoDependency && !['Tanpa Data dan Informasi', 'Database Sektoral', 'File Backup', 'Data SPBE'].includes(dataInfoDependency))) && (
                          <Input 
                            label="Detail Data dan Informasi (Manual)" 
                            value={dataInfoDependency === '__CUSTOM__' ? '' : dataInfoDependency} 
                            onChange={(e) => setDataInfoDependency(e.target.value)} 
                            placeholder="Sebutkan data/informasi yang disimpan..." 
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}
          </fieldset>

          <div className="flex gap-3 pt-6 border-t-4 border-black bg-white pb-2 mt-6">
            <button type="button" onClick={closeModals} className="flex-1 py-3 font-black uppercase italic border-2 border-black hover:bg-gray-100 transition-all" disabled={isSaving}>
              Batal
            </button>
            <Button type="submit" className="flex-[2] py-3" isLoading={isSaving} progress={progress}>
              SIMPAN DATA HARDWARE
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="Detail Aset Hardware" size="xl">
        {detailItem && (
          <div className="space-y-8 py-4 px-2">
            <div className="border-l-8 border-black pl-6 py-2">
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">{detailItem.kodeAset}</div>
              <h2 className="text-4xl font-black uppercase leading-none mb-3">{detailItem.namaPerangkat}</h2>
              <div className="flex gap-2"><StatusBadge status={detailItem.kategori} /><StatusBadge status={detailItem.statusKepemilikan} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-black text-white px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#999]">Informasi Umum</h3>
                  <div className="space-y-1">
                    <DetailField label="Kode Aset" value={detailItem.kodeAset} icon="qr_code" />
                    <DetailField label={detailItem.kategori.toUpperCase() === 'JARINGAN' ? "Nama Network/Communication Device" : detailItem.kategori.toUpperCase() === 'PENYIMPANAN' ? "Nama Data Storage" : "Nama Perangkat"} value={detailItem.namaPerangkat} icon="inventory" />
                    <DetailField label="Kategori" value={detailItem.kategori} icon="category" />
                    <DetailField label={detailItem.kategori.toUpperCase() === 'JARINGAN' ? "Deskripsi Network/Communication Device" : detailItem.kategori.toUpperCase() === 'PENYIMPANAN' ? "Deskripsi Data Storage" : "Deskripsi"} value={detailItem.deskripsi} icon="description" fullWidth />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">Spesifikasi Teknis</h3>
                  <div className="space-y-1 bg-gray-50 p-4 border-2 border-dashed border-black">
                    {detailItem.kategori.toUpperCase() === 'SERVER' && (
                      <>
                        <DetailField label="Kapasitas Memori" value={`${detailItem.kapasitasMemori} GB`} icon="memory" />
                        <DetailField label="Jumlah Kapasitas Penyimpanan" value={`${detailItem.kapasitasPenyimpanan} GB`} icon="storage" />
                        <DetailField label="Jenis Penggunaan Server" value={detailItem.jenisPenggunaanServer} icon="terminal" />
                        <DetailField label="Jenis Teknologi Prosesor" value={detailItem.teknologiProsesor} icon="processor" />
                        <DetailField label="Teknik Penyimpanan" value={detailItem.teknikPenyimpanan} icon="layers" />
                      </>
                    )}
                    {detailItem.kategori.toUpperCase() !== 'SERVER' && detailItem.kategori.toUpperCase() !== 'PENYIMPANAN' && (
                      <DetailField label={detailItem.kategori.toUpperCase() === 'JARINGAN' ? "Tipe Network/Communication Device" : "Tipe Perangkat"} value={detailItem.tipePerangkat} icon="settings" />
                    )}
                    {detailItem.kategori.toUpperCase() === 'PENYIMPANAN' && (
                       <>
                         <DetailField label="Kapasitas Penyimpanan" value={detailItem.kapasitasPenyimpanan} icon="storage" />
                         <DetailField label="Metode Akses Data Sharing" value={detailItem.metodeAkses} icon="dns" />
                       </>
                    )}
                    <DetailField label={detailItem.kategori.toUpperCase() === 'PENYIMPANAN' ? "Lokasi Data Storage" : detailItem.kategori.toUpperCase() === 'SERVER' ? "Lokasi Perangkat Lunak Server" : "Lokasi Detil"} value={detailItem.lokasiPenempatan} icon="location_on" />
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">Pengelola</h3>
                  <div className="space-y-1">
                    <DetailField label="Nama Pemilik" value={detailItem.pemilik} icon="person" />
                    <DetailField label={detailItem.kategori.toUpperCase() === 'JARINGAN' ? "Unit Pengelola Network/Communication Device" : detailItem.kategori.toUpperCase() === 'PENYIMPANAN' ? "Unit Pengelola Data Storage" : detailItem.kategori.toUpperCase() === 'SERVER' ? "Unit Pengelola Server" : "Unit Pengelola"} value={detailItem.unitPengelola} icon="account_balance" />
                    <DetailField label="Status Kepemilikkan" value={detailItem.statusKepemilikan} icon="verified_user" />
                  </div>
                </section>

                {detailItem.kategori.toUpperCase() !== 'JARINGAN' && (
                  <section>
                    <h3 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">Relasi</h3>
                    <div className="space-y-1">
                      {detailItem.kategori.toUpperCase() !== 'PENYIMPANAN' && detailItem.kategori.toUpperCase() !== 'SERVER' && (
                        <>
                          <DetailField label="Fasilitas" value={fasilitas.find((f: FasilitasKomputasi) => f.id === detailItem.fasilitasId)?.namaFasilitas || '-'} icon="apartment" />
                          <DetailField label="Jaringan" value={hardware.find(h => h.id === detailItem.perangkatJaringanId)?.namaPerangkat || '-'} icon="lan" />
                        </>
                      )}
                      {detailItem.kategori.toUpperCase() === 'PENYIMPANAN' && (
                        <>
                          <DetailField label="← Server Host" value={hardware.find(h => h.id === detailItem.perangkatServerId)?.namaPerangkat || '-'} icon="dns" />
                          <DetailField label="← Data dan Informasi" value={detailItem.dataInfoDependency || 'Tanpa Data dan Informasi'} icon="info" />
                        </>
                      )}
                      <DetailField label={detailItem.kategori.toUpperCase() === 'PENYIMPANAN' ? "← Perangkat Lunak Platform" : "Software"} value={software.find((s: LayananDigital) => s.id === detailItem.softwareId)?.namaLayanan || '-'} icon="layers" />
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button onClick={closeModals} className="bg-black text-white px-10 py-3 rounded-none border-4 border-black shadow-[4px_4px_0_0_#999] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase font-black italic tracking-widest">
                Tutup Detail
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal 
        isOpen={confirmConfig.isOpen} title={confirmConfig.title} message={confirmConfig.message} isLoading={confirmConfig.isLoading}
        onClose={closeConfirm} onConfirm={confirmConfig.onConfirm} confirmLabel="Hapus Sekarang" cancelLabel="Batal" type="danger"
      />
    </div>
  );
}
