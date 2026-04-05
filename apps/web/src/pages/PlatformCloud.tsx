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
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { TableControls, Pagination } from '../components/ui/TableControls';

// Formatters
import { formatRupiah, parseRupiah, formatDate } from '../lib/formatters';

// Stores & Hooks
import { useLayananDigital } from '../hooks/useLayananDigital';
import { useTable } from '../hooks/useTable';
import { useMasterData } from '../hooks/useMasterData';
import { useHardware } from '../hooks/useHardware';
import { useKonektivitas } from '../hooks/useKonektivitas';
import { useAssetCRUD } from '../hooks/useAssetCRUD';
import { useLoadingProgress } from '../hooks/useLoadingProgress';
import type { LayananDigital, SoftwareKategori } from '../types';

export function PlatformCloud() {
  const { 
    layananDigital: software, 
    isLoading: isSoftwareLoading,
    error: softwareError,
    addLayananDigital: addSoftware, 
    updateLayananDigital: updateSoftware, 
    deleteLayananDigital: deleteSoftware,
  } = useLayananDigital();

  const { isSaving, progress, startSaving, notifyMutationFinished, reset: resetLoading } = useLoadingProgress();
  
  const { instansi, isLoading: isMasterLoading } = useMasterData();
  const { hardware } = useHardware();
  const { konektivitas } = useKonektivitas();

  const [activeFilter, setActiveFilter] = useState<'Semua' | SoftwareKategori>('Semua');

  const filteredSoftwareRaw = useMemo(() => {
    return activeFilter === 'Semua' ? software : software.filter(s => s.kategori === activeFilter);
  }, [software, activeFilter]);

  const { 
    paginatedData, sortConfig, requestSort, searchQuery, setSearchQuery, 
    pageSize, setPageSize, currentPage, setCurrentPage, totalPages, exportToCSV
  } = useTable({ data: filteredSoftwareRaw });

  const handleTabChange = (tab: any) => {
    setActiveFilter(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Form State
  const [kategori, setKategori] = useState<SoftwareKategori>('Cloud');
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [statusKepemilikan, setStatusKepemilikan] = useState('Sendiri');
  const [tipeCloud, setTipeCloud] = useState<'SaaS' | 'PaaS' | 'IaaS' | 'BDaaS' | 'SecaaS'>('SaaS');
  const [biaya, setBiaya] = useState(0);
  const [jenisLisensi, setJenisLisensi] = useState('');
  const [tipeSoftware, setTipeSoftware] = useState<'Sistem Operasi' | 'Sistem Database' | 'Sistem Utilitas'>('Sistem Operasi');
  const [jenisDatabase, setJenisDatabase] = useState('');
  const [jenisUtilitas, setJenisUtilitas] = useState('');
  const [jenisOS, setJenisOS] = useState('');
  const [fasilitasId, setFasilitasId] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [hardwareServerId, setHardwareServerId] = useState('');
  const [cloudDependencyId, setCloudDependencyId] = useState('');
  const [aplikasiDependency, setAplikasiDependency] = useState('');
  const [dataInfoDependency, setDataInfoDependency] = useState('');
  const [splpDependency, setSplpDependency] = useState('');
  const [jaringanDependency, setJaringanDependency] = useState('');
  const [unitOpsCloud, setUnitOpsCloud] = useState('');
  const [edukasiKeamanan, setEdukasiKeamanan] = useState('');

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
    onConfirm: () => {}
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ isOpen: true, title, message, isLoading: false, onConfirm });
  };

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false, isLoading: false }));

  const [isPermanen, setIsPermanen] = useState(false);
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');

  const resetForm = () => {
    setKategori('Cloud'); setKode(''); setNama(''); setDeskripsi(''); setPemilik(''); setStatusKepemilikan('Sendiri');
    setBiaya(0); setTipeCloud('SaaS'); setJenisLisensi('Seumur Hidup');
    setTipeSoftware('Sistem Operasi'); setJenisDatabase(''); setJenisUtilitas(''); setJenisOS('Windows');
    setFasilitasId(''); setInstansiId(''); setHardwareServerId(''); setCloudDependencyId('');
    setAplikasiDependency(''); setDataInfoDependency(''); setSplpDependency(''); setJaringanDependency('');
    setUnitOpsCloud(''); setEdukasiKeamanan('');
    setIsPermanen(true); setTanggalBerakhir('');
  };

  const {
    isAddModalOpen, isEditModalOpen, isDetailModalOpen, editingItem, detailItem,
    openAddModal, openEditModal, openDetailModal, closeModals
  } = useAssetCRUD<LayananDigital>();

  const handleAdd = () => { resetForm(); openAddModal(); };

  const handleEdit = (item: LayananDigital) => {
    setKategori(item.kategori); setKode(item.kodeAset); setNama(item.namaLayanan); setDeskripsi(item.deskripsi);
    setPemilik(item.pemilik); setStatusKepemilikan(item.statusKepemilikan); setBiaya(item.biayaLayanan || 0);
    setTipeCloud(item.tipeCloud || 'SaaS'); setJenisLisensi(item.jenisLisensi || '');
    setTipeSoftware(item.tipeSoftware || 'Sistem Operasi');
    setJenisDatabase(item.jenisDatabase || ''); setJenisUtilitas(item.jenisUtilitas || ''); setJenisOS(item.jenisOS || '');
    setFasilitasId(item.fasilitasId || ''); setInstansiId(item.instansiId || ''); setHardwareServerId(item.hardwareServerId || '');
    setCloudDependencyId(item.cloudDependencyId || ''); setAplikasiDependency(item.aplikasiDependency || '');
    setDataInfoDependency(item.dataInfoDependency || ''); setSplpDependency(item.splpDependency || '');
    setJaringanDependency(item.jaringanDependency || '');
    setUnitOpsCloud(item.unitOperasionalCloud || '');
    setEdukasiKeamanan(item.edukasiKeamananDependency || '');
    
    const val = item.kategori === 'Cloud' ? item.jangkaWaktu : item.validitasLisensi;
    if (val === 'Seumur Hidup' || val === 'Permanen') {
      setIsPermanen(true);
      setTanggalBerakhir('');
    } else {
      setIsPermanen(false);
      const dateMatch = val?.match(/\d{4}-\d{2}-\d{2}/);
      setTanggalBerakhir(dateMatch ? dateMatch[0] : '');
    }
    openEditModal(item);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startSaving();
    const finalValidity = isPermanen ? 'Seumur Hidup' : (tanggalBerakhir ? tanggalBerakhir : 'Periodik');

    const payload: Omit<LayananDigital, 'id'> = {
      kategori, kodeAset: kode, namaLayanan: nama, deskripsi, pemilik, pengelola: instansi.find(i => i.id === instansiId)?.namaInstansi || 'Unknown',
      instansiId, statusKepemilikan, biayaLayanan: kategori === 'Cloud' ? biaya : undefined,
      jangkaWaktu: kategori === 'Cloud' ? finalValidity : undefined, tipeCloud: kategori === 'Cloud' ? tipeCloud : undefined,
      jenisLisensi: kategori === 'Platform' ? jenisLisensi : undefined, validitasLisensi: kategori === 'Platform' ? finalValidity : undefined,
      tipeSoftware: kategori === 'Platform' ? tipeSoftware : undefined,
      jenisDatabase: (kategori === 'Platform' && tipeSoftware === 'Sistem Database') ? jenisDatabase : undefined,
      jenisUtilitas: (kategori === 'Platform' && tipeSoftware === 'Sistem Utilitas') ? jenisUtilitas : undefined,
      jenisOS: (kategori === 'Platform' && tipeSoftware === 'Sistem Operasi') ? jenisOS : undefined,
      unitPengembangCloud: kategori === 'Cloud' ? instansi.find(i => i.id === instansiId)?.namaInstansi : undefined,
      unitOperasionalCloud: kategori === 'Cloud' ? unitOpsCloud : undefined,
      edukasiKeamananDependency: kategori === 'Cloud' ? edukasiKeamanan : undefined,
      fasilitasId,
      hardwareServerId: kategori === 'Platform' ? hardwareServerId : undefined,
      cloudDependencyId: kategori === 'Platform' ? cloudDependencyId : undefined,
      aplikasiDependency: kategori === 'Cloud' ? aplikasiDependency : undefined,
      dataInfoDependency: kategori === 'Cloud' ? dataInfoDependency : undefined,
      splpDependency: kategori === 'Cloud' ? splpDependency : undefined,
      jaringanDependency: kategori === 'Cloud' ? jaringanDependency : undefined,
    };

    const options = {
      onSuccess: () => notifyMutationFinished(closeModals),
      onError: resetLoading
    };

    if (isEditModalOpen && editingItem) {
      updateSoftware(editingItem.id, payload, options);
    } else {
      addSoftware(payload, options);
    }
  };

  if (isSoftwareLoading || isMasterLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl font-black uppercase animate-pulse italic">Memuat Data Platform & Cloud...</div>
      </div>
    );
  }

  if (softwareError) {
    return (
      <div className="p-6 bg-red-100 border-4 border-red-600 text-red-600 font-bold">
        Gagal memuat data: {(softwareError as any).message}
      </div>
    );
  }

  const summaryItems = [
    { label: 'Cloud Services', value: software.filter(s => s.kategori === 'Cloud').length, color: 'yellow' as const },
    { label: 'Software Platform', value: software.filter(s => s.kategori === 'Platform').length, color: 'green' as const },
    { label: 'Estimasi Biaya', value: formatRupiah(software.reduce((a, c) => a + (c.biayaLayanan || 0), 0)), color: 'blue' as const },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Platform & Cloud" 
        subtitle="Manajemen Perangkat Lunak Platform dan Layanan Komputasi Awan (Cloud Computing) SPBE." 
        onAdd={handleAdd} 
        addLabel="Tambah Aset" 
        icon="cloud_segment" 
      />
      
      <SummaryGrid items={summaryItems} />
      
       <FilterTabs 
        tabs={['Semua', 'Platform', 'Cloud']} 
        activeTab={activeFilter} 
        onTabChange={handleTabChange} 
        getLabel={(tab) => tab === 'Platform' ? 'Software Platform' : tab === 'Cloud' ? 'Komputasi Awan' : 'Semua'}
      />

      <TableControls 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onExport={() => exportToCSV(`platform-cloud-${activeFilter.toLowerCase()}.csv`)}
      />

      <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
        <Table>
          <TableHead>
            <TableHeader sortKey="namaLayanan" onSort={requestSort} activeSortConfig={sortConfig}>Layanan & Kode</TableHeader>
            <TableHeader sortKey="kategori" onSort={requestSort} activeSortConfig={sortConfig}>Kategori</TableHeader>
            <TableHeader sortKey="pemilik" onSort={requestSort} activeSortConfig={sortConfig}>Pemilik / Pengelola</TableHeader>
            <TableHeader className="text-right">Aksi</TableHeader>
          </TableHead>
          <TableBody>
            {paginatedData.map((s: LayananDigital) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="font-mono-bold text-[10px] opacity-60 uppercase">{s.kodeAset}</div>
                  <div className="font-bold text-sm">{s.namaLayanan}</div>
                </TableCell>
                <TableCell><StatusBadge status={s.kategori} /></TableCell>
                <TableCell>
                  <div className="text-xs font-bold uppercase tracking-tight">{s.pemilik}</div>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons 
                    onDetail={() => openDetailModal(s)}
                    onEdit={() => handleEdit(s)}
                    onDelete={() => triggerConfirm(
                      'Hapus Aset Digital?',
                      `Apakah Anda yakin ingin menghapus "${s.namaLayanan}"? Data pendukung atau aplikasi yang bergantung mungkin akan terganggu.`,
                      () => {
                        setConfirmConfig(prev => ({ ...prev, isLoading: true }));
                        deleteSoftware(s.id, { 
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
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>

      <Modal isOpen={isAddModalOpen || isEditModalOpen} onClose={closeModals} title={isEditModalOpen ? "Edit Aset Digital" : "Tambah Aset Digital"} size="lg" closeOnOverlayClick={false}>
        <form onSubmit={handleSave} className="space-y-6 px-1 pb-4">
          <fieldset disabled={isSaving}>
            <section className="space-y-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#B9FF66] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                1. Identitas & Profil Layanan
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value as SoftwareKategori)} 
                  options={[{ label: 'Komputasi Awan (Cloud)', value: 'Cloud' }, { label: 'Perangkat Lunak Platform', value: 'Platform' }]} 
                />
                <Input label="Kode Aset" value={kode} onChange={(e) => setKode(e.target.value)} required placeholder="e.g. CLD-001" />
              </div>
              <Input 
                label={kategori === 'Cloud' ? "Nama Government Cloud" : "Nama Perangkat Lunak"} 
                value={nama} onChange={(e) => setNama(e.target.value)} required 
                placeholder={kategori === 'Cloud' ? "e.g. PDN, AWS GovCloud" : "e.g. Oracle DB, Ubuntu Pro"} 
              />
              <Textarea label="Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3} placeholder="Detail spesifikasi..." />
            </section>

            <section className="space-y-4 p-4 bg-gray-50 border-2 border-black border-dashed mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                2. Konfigurasi & Lisensi
              </h4>
              {kategori === 'Cloud' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Tipe Model" value={tipeCloud} onChange={(e) => setTipeCloud(e.target.value as any)} 
                    options={[{label:'SaaS', value:'SaaS'}, {label:'PaaS', value:'PaaS'}, {label:'IaaS', value:'IaaS'}, {label:'BDaaS', value:'BDaaS'}, {label:'SecaaS', value:'SecaaS'}]} 
                  />
                  <Input label="Biaya Layanan (Rp)" value={formatRupiah(biaya)} onChange={(e) => setBiaya(parseRupiah(e.target.value))} placeholder="e.g. 50.000" />
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <Select label="Masa Berlaku" value={isPermanen ? 'Permanen' : 'Berjangka'} onChange={(e) => setIsPermanen(e.target.value === 'Permanen')}
                      options={[{label:'Seumur Hidup / Permanen', value:'Permanen'}, {label:'Berjangka / Periodik', value:'Berjangka'}]}
                    />
                    {!isPermanen && <Input label="Detail Tanggal" type="date" value={tanggalBerakhir} onChange={(e) => setTanggalBerakhir(e.target.value)} />}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Tipe Perangkat Lunak" value={tipeSoftware} onChange={(e) => setTipeSoftware(e.target.value as any)}
                      options={[{label:'Sistem Operasi', value:'Sistem Operasi'}, {label:'Sistem Database', value:'Sistem Database'}, {label:'Sistem Utilitas', value:'Sistem Utilitas'}]}
                    />
                     <Select label="Jenis Lisensi" value={jenisLisensi} onChange={(e) => setJenisLisensi(e.target.value)}
                      options={['Seumur Hidup', 'Periodik', 'Kode Sumber Terbuka'].map(v => ({ label: v, value: v }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Validitas Lisensi" value={isPermanen ? 'Permanen' : 'Berjangka'} onChange={(e) => setIsPermanen(e.target.value === 'Permanen')}
                      options={[{label:'Permanen / Seumur Hidup', value:'Permanen'}, {label:'Berjangka / Periodik', value:'Berjangka'}]}
                    />
                    {!isPermanen && <Input label="Hingga Tanggal" type="date" value={tanggalBerakhir} onChange={(e) => setTanggalBerakhir(e.target.value)} />}
                  </div>

                  {tipeSoftware === 'Sistem Operasi' && (
                    <Select label="Jenis OS" value={jenisOS} onChange={(e) => setJenisOS(e.target.value)} 
                      options={['Dos', 'Unix', 'MacOS', 'Windows', 'Networking OS', 'Lainnya'].map(v => ({ label: v, value: v }))}
                    />
                  )}
                  {tipeSoftware === 'Sistem Database' && <Input label="Jenis Database" value={jenisDatabase} onChange={(e) => setJenisDatabase(e.target.value)} placeholder="e.g. PostgreSQL, Oracle" />}
                  {tipeSoftware === 'Sistem Utilitas' && <Input label="Jenis Utilitas" value={jenisUtilitas} onChange={(e) => setJenisUtilitas(e.target.value)} placeholder="e.g. Backup Tool, Security Agent" />}
                </div>
              )}
            </section>

            <section className="space-y-4 mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                3. Pengelola & Status
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label={kategori === 'Cloud' ? "Nama Pemilik" : "Nama Pemilik Lisensi"} value={pemilik} onChange={(e) => setPemilik(e.target.value)} required />
                <Select label="Status Kepemilikkan" value={statusKepemilikan} onChange={(e) => setStatusKepemilikan(e.target.value)}
                  options={['Sendiri', 'Instansi Pemerintah Lain', 'BUMN', 'Swasta Dalam Negeri', 'Swasta Luar Negeri'].map(v => ({ label: v, value: v }))}
                />
                <Select label={kategori === 'Cloud' ? "Unit Pengembang Government Cloud" : "Unit Pengelola"} value={instansiId} onChange={(e) => setInstansiId(e.target.value)} options={instansi.map(i => ({ label: i.namaInstansi, value: i.id }))} />
                {kategori === 'Cloud' && (
                  <>
                    <Select label="→ Unit Operasional (Dependency)" value={unitOpsCloud} onChange={(e) => setUnitOpsCloud(e.target.value)} options={instansi.map(i => ({ label: i.namaInstansi, value: i.namaInstansi }))} />
                    <Input label="→ Edukasi Keamanan (Dependency)" value={edukasiKeamanan} onChange={(e) => setEdukasiKeamanan(e.target.value)} placeholder="e.g. Sertifikasi Keamanan" />
                  </>
                )}
              </div>
            </section>

            <section className="space-y-4 mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                4. Relasi Dependensi Arsitektur
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label={kategori === 'Cloud' ? "← Fasilitas Komputasi (Dependency)" : "→ Fasilitas Komputasi (Dependency)"} value={fasilitasId} onChange={(e) => setFasilitasId(e.target.value)}
                  options={[{label: 'Pilih Fasilitas', value: ''}, ...hardware.filter(h => h.kategori === 'Server').map(h => ({ label: h.namaPerangkat, value: h.id }))]} 
                />
                {kategori === 'Platform' && (
                  <Select label="→ Komputasi Awan (Dependency)" value={cloudDependencyId} onChange={(e) => setCloudDependencyId(e.target.value)}
                    options={[{label: 'None / On-Premise', value: ''}, ...software.filter(s => s.kategori === 'Cloud').map(s => ({ label: s.namaLayanan, value: s.id }))]}
                  />
                )}
                {kategori === 'Cloud' && (
                  <>
                    <Input label="← Aplikasi (Dependency)" value={aplikasiDependency} onChange={(e) => setAplikasiDependency(e.target.value)} />
                    <Input label="← Data dan Informasi (Dependency)" value={dataInfoDependency} onChange={(e) => setDataInfoDependency(e.target.value)} />
                    <Select label="→ Sistem Penghubung Layanan (Dependency)" value={splpDependency} onChange={(e) => setSplpDependency(e.target.value)}
                      options={[{label:'None', value:''}, ...konektivitas.filter(k => k.kategori === 'SPLP').map(k => ({label: k.namaJaringan, value: k.id}))]}
                    />
                     <Select label="→ Jaringan Intra Pemerintah (Dependency)" value={jaringanDependency} onChange={(e) => setJaringanDependency(e.target.value)}
                      options={[{label:'None', value:''}, ...konektivitas.filter(k => k.kategori === 'Jaringan Intra').map(k => ({label: k.namaJaringan, value: k.id}))]}
                    />
                  </>
                )}
              </div>
            </section>
          </fieldset>

          <div className="flex gap-3 pt-6 border-t-4 border-black bg-white pb-2 mt-6">
            <button type="button" onClick={closeModals} className="flex-1 py-3 font-black uppercase italic border-2 border-black hover:bg-gray-100 transition-all" disabled={isSaving}>
              Batal
            </button>
            <Button type="submit" className="flex-[2] py-3" isLoading={isSaving} progress={progress}>
              SIMPAN DATA DIGITAL
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="Detail Platform & Cloud" size="xl">
        {detailItem && (
          <div className="space-y-8 py-4 px-2">
            <div className={`border-l-8 ${detailItem.kategori === 'Cloud' ? 'border-[#FFD700]' : 'border-[#00E5FF]'} pl-6 py-2`}>
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">{detailItem.kodeAset}</div>
              <h2 className="text-4xl font-black uppercase leading-none mb-3">{detailItem.namaLayanan}</h2>
              <div className="flex gap-2">
                <StatusBadge status={detailItem.kategori} />
                <StatusBadge status={detailItem.statusKepemilikan} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-black text-white px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#666]">
                    Informasi & Profil Layanan
                  </h3>
                  <div className="space-y-1">
                    <DetailField label="Kode Layanan" value={detailItem.kodeAset} icon="fingerprint" />
                    <DetailField label={detailItem.kategori === 'Cloud' ? "Nama Government Cloud" : "Nama Perangkat Lunak"}  value={detailItem.namaLayanan} icon="cloud_queue" />
                    <DetailField label={detailItem.kategori === 'Cloud' ? "Nama Pemilik" : "Nama Pemilik Lisensi"} value={detailItem.pemilik} icon="person" />
                    <DetailField label={detailItem.kategori === 'Cloud' ? "Unit Pengembang Government Cloud" : "Unit Pengelola"} value={detailItem.pengelola} icon="account_balance" />
                    <DetailField label="Deskripsi Detail" value={detailItem.deskripsi} icon="description" fullWidth />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Konfigurasi & Spesifikasi
                  </h3>
                  <div className="space-y-1 bg-gray-50 p-4 border-2 border-dashed border-black">
                    {detailItem.kategori === 'Cloud' ? (
                      <>
                        <DetailField label="Tipe Model Cloud" value={detailItem.tipeCloud} icon="cloud_circle" />
                        <DetailField label="Unit Operasional" value={detailItem.unitOperasionalCloud} icon="settings_input_component" />
                      </>
                    ) : (
                      <>
                        <DetailField label="Tipe Perangkat Lunak" value={detailItem.tipeSoftware} icon="category" />
                        <DetailField label="Jenis Sistem Operasi" value={detailItem.jenisOS} icon="desktop_windows" />
                        <DetailField label="Jenis Sistem Database" value={detailItem.jenisDatabase} icon="database" />
                        <DetailField label="Jenis Sistem Utilitas" value={detailItem.jenisUtilitas} icon="construction" />
                      </>
                    )}
                    <DetailField label="Jenis Lisensi" value={detailItem.jenisLisensi} icon="verified" />
                    <DetailField label="Validitas / Masa Berlaku" value={detailItem.validitasLisensi === 'Seumur Hidup' ? 'Seumur Hidup' : formatDate(detailItem.validitasLisensi || detailItem.jangkaWaktu || '')} icon="event_available" />
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Biaya & Keamanan
                  </h3>
                  <div className="space-y-1">
                    <DetailField 
                      label="Biaya Layanan" 
                      value={detailItem.biayaLayanan ? `Rp ${detailItem.biayaLayanan.toLocaleString('id-ID')}` : 'N/A'} 
                      icon="payments" 
                    />
                    {detailItem.kategori === 'Cloud' && <DetailField label="Edukasi Keamanan" value={detailItem.edukasiKeamananDependency} icon="security" />}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FF4D4D] text-white border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Relasi Arsitektur TIK
                  </h3>
                  <div className="space-y-1 p-4 border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
                    <DetailField label="Host / Fasilitas Komputasi" value={hardware.find(h => h.id === detailItem.fasilitasId)?.namaPerangkat || 'N/A'} icon="dns" />
                    {detailItem.kategori === 'Platform' && <DetailField label="Komputasi Awan" value={software.find(s => s.id === detailItem.cloudDependencyId)?.namaLayanan || 'On-Premise'} icon="cloud" />}
                    {detailItem.kategori === 'Cloud' && (
                      <>
                        <DetailField label="Aplikasi" value={detailItem.aplikasiDependency} icon="apps" />
                        <DetailField label="Data dan Informasi" value={detailItem.dataInfoDependency} icon="storage" />
                        <DetailField label="Sistem Penghubung (SPLP)" value={konektivitas.find(k => k.id === detailItem.splpDependency)?.namaJaringan || 'N/A'} icon="hub" />
                        <DetailField label="Jaringan Intra" value={konektivitas.find(k => k.id === detailItem.jaringanDependency)?.namaJaringan || 'N/A'} icon="network_ping" />
                      </>
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
                Tutup Dokumen
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Global Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isLoading={confirmConfig.isLoading}
        onClose={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
        confirmLabel="Hapus Sekarang"
        cancelLabel="Batal"
        type="danger"
      />
    </div>
  );
}
