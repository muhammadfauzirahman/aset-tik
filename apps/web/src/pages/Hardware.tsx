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
  const [lokasiGedung, setLokasiGedung] = useState(() => getInitial('lokasiGedung', ''));
  const [ruangan, setRuangan] = useState(() => getInitial('ruangan', ''));
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
        kategori, kode, nama, namaPerangkat, lokasiGedung, ruangan, deskripsi, pemilik, statusKepemilikan,
        memori, penyimpanan, prosesor, teknikSimpan, tipe, metodeAkses, lokasiDetil, penggunaan,
        instansiId, fasilitasId, perangkatJaringanId, perangkatServerId, softwareId, dataInfoDependency
      }));
    }
  }, [
    kategori, kode, nama, namaPerangkat, lokasiGedung, ruangan, deskripsi, pemilik, statusKepemilikan,
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
      : hardware.filter(h => h.kategori === activeFilter);
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
    setKategori(item.kategori); setKode(item.kodeAset); setNama(item.namaPerangkat); setNamaPerangkat(item.namaPerangkat);
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
      kategori, kodeAset: kode, namaPerangkat: namaPerangkat, deskripsi, pemilik,
      unitPengelola: instansi.find((i: Instansi) => i.id === Number(instansiId))?.namaInstansi || '',
      statusKepemilikan, instansiId: Number(instansiId),
      kapasitasMemori: kategori === 'Server' ? memori : undefined,
      kapasitasPenyimpanan: (kategori === 'Server' || kategori === 'Penyimpanan') ? penyimpanan : undefined,
      teknologiProsesor: kategori === 'Server' ? prosesor : undefined,
      teknikPenyimpanan: (kategori === 'Server' || kategori === 'Penyimpanan') ? teknikSimpan : undefined,
      tipePerangkat: (kategori !== 'Server' && kategori !== 'Penyimpanan') ? tipe : undefined,
      metodeAkses: kategori === 'Penyimpanan' ? metodeAkses : undefined,
      lokasiPenempatan: lokasiDetil,
      jenisPenggunaanServer: kategori === 'Server' ? penggunaan : undefined,
      fasilitasId: (kategori === 'Keamanan' || kategori === 'Server' || kategori === 'Jaringan') ? (fasilitasId ? Number(fasilitasId) : undefined) : undefined,
      perangkatJaringanId: (kategori === 'Keamanan' || kategori === 'Jaringan' || kategori === 'Server') ? (perangkatJaringanId ? Number(perangkatJaringanId) : undefined) : undefined,
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
    'Server': hardware.filter(h => h.kategori === 'Server').length,
    'Jaringan': hardware.filter(h => h.kategori === 'Jaringan').length,
    'Keamanan': hardware.filter(h => h.kategori === 'Keamanan').length,
    'Penyimpanan': hardware.filter(h => h.kategori === 'Penyimpanan').length,
    'Periferal': hardware.filter(h => h.kategori === 'Periferal').length,
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
                  options={['Server', 'Jaringan', 'Keamanan', 'Penyimpanan', 'Periferal'].map(c => ({ label: `Perangkat Keras ${c}`, value: c }))}
                />
                <Input label="Nama PerangkatKeras" value={namaPerangkat} onChange={(e) => setNamaPerangkat(e.target.value)} required placeholder="e.g. Server Produksi" />
              </div>
              <Input 
                label={kategori === 'Server' ? "Nama Server" : kategori === 'Jaringan' ? "Nama Network" : kategori === 'Keamanan' ? "Nama Perangkat Keamanan" : kategori === 'Penyimpanan' ? "Nama Data Storage" : "Nama Perangkat Periferal"} 
                value={nama} onChange={(e) => setNama(e.target.value)} required placeholder="Sesuai Nama Perangkat" 
              />
              <Textarea label="Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Tuliskan deskripsi perangkat..." rows={3} />
            </section>
            
            <section className="space-y-4 p-4 bg-gray-50 border-2 border-black border-dashed mt-10">
              <h4 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                2. Spesifikasi Teknis
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {(kategori === 'Server' || kategori === 'Jaringan') && (
                  <Input label={kategori === 'Server' ? "Kapasitas Memori" : "Tipe Memori/Bandwidth"} value={memori} onChange={(e) => setMemori(e.target.value)} />
                )}
                {(kategori === 'Server' || kategori === 'Penyimpanan') && (
                  <Input label={kategori === 'Server' ? "Jumlah Kapasitas Penyimpanan" : "Kapasitas Penyimpanan"} value={penyimpanan} onChange={(e) => setPenyimpanan(e.target.value)} />
                )}
                {kategori === 'Server' && (
                  <>
                    <Select label="Jenis Penggunaan" value={penggunaan} onChange={(e) => setPenggunaan(e.target.value)}
                      options={['Server Aplikasi', 'Server Database', 'File Server', 'Web Server', 'Mail Server', 'Active Directory', 'DNS', 'Proxy'].map(v => ({ label: v, value: v }))}
                    />
                    <Select label="Lokasi Gedung" value={lokasiGedung} onChange={(e) => setLokasiGedung(e.target.value)}
                      options={['Gedung A', 'Gedung B', 'Gedung C', 'Gedung D'].map(v => ({ label: v, value: v }))}
                    />
                    <Select label="Ruangan" value={ruangan} onChange={(e) => setRuangan(e.target.value)}
                      options={['Ruang Server 1', 'Ruang Server 2', 'Data Center 主'].map(v => ({ label: v, value: v }))}
                    />
                    <Input label="Lokasi Perangkat Lunak Server" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} />
                  </>
                )}
                {kategori === 'Jaringan' && (
                  <Select label="Tipe Network Device" value={tipe} onChange={(e) => setTipe(e.target.value)}
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
                    <Select label="Metode Akses Data" value={metodeAkses} onChange={(e) => setMetodeAkses(e.target.value)}
                      options={['NAS', 'SAN', 'Object Storage (S3)', 'Direct Attached'].map(v => ({ label: v, value: v }))}
                    />
                    <Input label="Lokasi Data Storage" value={lokasiDetil} onChange={(e) => setLokasiDetil(e.target.value)} />
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
                <Select label="Unit Pengelola" value={instansiId.toString()} onChange={(e) => setInstansiId(Number(e.target.value))}
                  options={instansi.map(i => ({ label: i.singkatan, value: i.id.toString() }))} required 
                />
                <Select label="Status Kepemilikkan" value={statusKepemilikan} onChange={(e) => setStatusKepemilikan(e.target.value)}
                  options={['Sendiri', 'Sewa', 'Hibah', 'BUMN/Pihak Ketiga'].map(v => ({ label: v, value: v }))} required 
                />
              </div>
            </section>

            <section className="space-y-4 mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                4. Relasi Dependensi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="→ Fasilitas" value={fasilitasId?.toString()} onChange={(e) => setFasilitasId(e.target.value === '' ? '' : Number(e.target.value))}
                  options={[{label: 'Pilih Fasilitas', value: ''}, ...fasilitas.map((f: FasilitasKomputasi) => ({ label: f.namaFasilitas, value: f.id.toString() }))]}
                />
                <Select label="→ Perangkat Jaringan" value={perangkatJaringanId?.toString()} onChange={(e) => setPerangkatJaringanId(e.target.value === '' ? '' : Number(e.target.value))}
                  options={[{label: 'Tanpa Koneksi', value: ''}, ...hardware.filter(h => h.kategori === 'Jaringan').map(h => ({ label: h.namaPerangkat, value: h.id.toString() }))]}
                />
                {(kategori === 'Server' || kategori === 'Penyimpanan') && (
                  <Select label="→ Software Platform" value={softwareId?.toString()} onChange={(e) => setSoftwareId(e.target.value === '' ? '' : Number(e.target.value))}
                    options={[{label: 'None / Bare Metal', value: ''}, ...software.map((s: LayananDigital) => ({ label: s.namaLayanan, value: s.id.toString() }))]}
                  />
                )}
                {kategori === 'Penyimpanan' && (
                  <Select label="← Host Server" value={perangkatServerId?.toString()} onChange={(e) => setPerangkatServerId(e.target.value === '' ? '' : Number(e.target.value))}
                    options={[{label: 'Bukan Node/Host', value: ''}, ...hardware.filter(h => h.kategori === 'Server').map(h => ({ label: h.namaPerangkat, value: h.id.toString() }))]}
                  />
                )}
              </div>
            </section>
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
                    <DetailField label="Nama Perangkat" value={detailItem.namaPerangkat} icon="inventory" />
                    <DetailField label="Kategori" value={detailItem.kategori} icon="category" />
                    <DetailField label="Deskripsi" value={detailItem.deskripsi} icon="description" fullWidth />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">Spesifikasi Teknis</h3>
                  <div className="space-y-1 bg-gray-50 p-4 border-2 border-dashed border-black">
                    {detailItem.kategori === 'Server' && (
                      <>
                        <DetailField label="Memori" value={detailItem.kapasitasMemori} icon="memory" />
                        <DetailField label="Penyimpanan" value={detailItem.kapasitasPenyimpanan} icon="storage" />
                        <DetailField label="Penggunaan" value={detailItem.jenisPenggunaanServer} icon="terminal" />
                        <DetailField label="Prosesor" value={detailItem.teknologiProsesor} icon="processor" />
                      </>
                    )}
                    <DetailField label="Lokasi Detil" value={detailItem.lokasiPenempatan} icon="location_on" />
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">Pengelola</h3>
                  <div className="space-y-1">
                    <DetailField label="Pemilik" value={detailItem.pemilik} icon="person" />
                    <DetailField label="Unit Pengelola" value={detailItem.unitPengelola} icon="account_balance" />
                    <DetailField label="Status Kepemilikan" value={detailItem.statusKepemilikan} icon="verified_user" />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">Relasi</h3>
                  <div className="space-y-1">
                    <DetailField label="Fasilitas" value={fasilitas.find((f: FasilitasKomputasi) => f.id === detailItem.fasilitasId)?.namaFasilitas || '-'} icon="apartment" />
                    <DetailField label="Jaringan" value={hardware.find(h => h.id === detailItem.perangkatJaringanId)?.namaPerangkat || '-'} icon="lan" />
                    <DetailField label="Software" value={software.find((s: LayananDigital) => s.id === detailItem.softwareId)?.namaLayanan || '-'} icon="layers" />
                  </div>
                </section>
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
