import { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Reusable Components
import { PageHeader } from '../components/layout/PageHeader';
import { FilterTabs } from '../components/ui/FilterTabs';
import { SummaryGrid } from '../components/ui/SummaryGrid';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { DetailField } from '../components/ui/DetailField';
import { ConfirmModal } from '../components/ui/ConfirmModal';

// Hooks & Stores
import { useAssetCRUD } from '../hooks/useAssetCRUD';
import { useFasilitas } from '../hooks/useFasilitas';
import { useMasterData } from '../hooks/useMasterData';
import { useHardware } from '../hooks/useHardware';
import { useLayananDigital } from '../hooks/useLayananDigital';
import { useLoadingProgress } from '../hooks/useLoadingProgress';
import type { FasilitasKomputasi, JenisFasilitas, KlasifikasiTier, KepemilikanFasilitas, StatusFasilitas } from '../types';

export function FasilitasKomputasiPage() {
  const {
    fasilitas,
    isLoading: isFasilitasLoading,
    error: fasilitasError,
    addFasilitas,
    updateFasilitas,
    deleteFasilitas,
    isAdding,
    isUpdating
  } = useFasilitas();

  const { isSaving, progress, startSaving, notifyMutationFinished, reset: resetLoading } = useLoadingProgress();
  const { instansi, isLoading: isMasterLoading } = useMasterData();
  const { hardware } = useHardware();
  const { layananDigital: software } = useLayananDigital();

  // Form State
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState<JenisFasilitas>('Pusat Data');
  const [bwIntra, setBwIntra] = useState<number>(0);
  const [bwInter, setBwInter] = useState<number>(0);
  const [lokasi, setLokasi] = useState('');
  const [tier, setTier] = useState<KlasifikasiTier>('Non-Tier');
  const [kepemilikan, setKepemilikan] = useState<KepemilikanFasilitas>('Sendiri');
  const [pengamanan, setPengamanan] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [status, setStatus] = useState<StatusFasilitas>('Aktif');

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
    setKode(''); setNama(''); setJenis('Pusat Data'); setBwIntra(0); setBwInter(0);
    setLokasi(''); setTier('Non-Tier'); setKepemilikan('Sendiri'); setPengamanan('');
    setInstansiId(instansi[0]?.id || ''); setStatus('Aktif');
  };

  const {
    openAddModal, openEditModal, openDetailModal, closeModals,
    isAddModalOpen, isEditModalOpen, isDetailModalOpen, editingItem, detailItem
  } = useAssetCRUD<FasilitasKomputasi>();

  const handleAdd = () => { resetForm(); openAddModal(); };

  const handleEdit = (item: FasilitasKomputasi) => {
    setKode(item.kodeFasilitas); setNama(item.namaFasilitas); setJenis(item.jenisFasilitas);
    setBwIntra(item.bandwidthIntranet); setBwInter(item.bandwidthInternet); setLokasi(item.lokasiFisik);
    setTier(item.klasifikasiTier || 'Non-Tier'); setKepemilikan(item.kepemilikan);
    setPengamanan(item.sistemPengamanan); setInstansiId(item.instansiId); setStatus(item.status);
    openEditModal(item);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startSaving();
    const payload: Omit<FasilitasKomputasi, 'id' | 'childAssetsCount'> = {
      kodeFasilitas: kode, namaFasilitas: nama, jenisFasilitas: jenis,
      bandwidthIntranet: bwIntra, bandwidthInternet: bwInter, lokasiFisik: lokasi,
      klasifikasiTier: jenis === 'Pusat Data' ? tier : null, kepemilikan,
      sistemPengamanan: pengamanan, instansiId, status
    };
    const options = {
      onSuccess: () => notifyMutationFinished(closeModals),
      onError: resetLoading
    };
    if (isEditModalOpen && editingItem) {
      updateFasilitas(editingItem.id, payload, options);
    } else {
      addFasilitas(payload, options);
    }
  };

  const [activeTab, setActiveTab] = useState<'Semua' | JenisFasilitas>('Semua');

  const filteredData = activeTab === 'Semua' ? fasilitas : fasilitas.filter(f => f.jenisFasilitas === activeTab);

  const attachedHardware = useMemo(() =>
    detailItem ? hardware.filter(h => h.fasilitasId === detailItem.id) : [],
    [detailItem, hardware]);

  const attachedSoftware = useMemo(() =>
    detailItem ? software.filter(s => s.fasilitasId === detailItem.id) : [],
    [detailItem, software]);

  if (isFasilitasLoading || isMasterLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl font-black uppercase animate-pulse italic">Memuat Data Fasilitas...</div>
      </div>
    );
  }

  if (fasilitasError) {
    return (
      <div className="p-6 bg-red-100 border-4 border-red-600 text-red-600 font-bold">
        Gagal memuat data: {(fasilitasError as any).message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Fasilitas Komputasi"
        subtitle="Pusat Data, Komputasi, dan Kendali yang menjadi fondasi penempatan aset infrastruktur TIK SPBE."
        onAdd={handleAdd}
        addLabel="Tambah Fasilitas"
        icon="domain_add"
      />

      <SummaryGrid items={[
        { label: 'Total Fasilitas', value: fasilitas.length, color: 'yellow' },
        { label: 'Kapasitas Internet', value: `${fasilitas.reduce((a, c) => a + c.bandwidthInternet, 0)} Mbps`, color: 'green' },
        { label: 'Aset Taut', value: hardware.length + software.length, color: 'blue' },
      ]} />

      <FilterTabs tabs={['Semua', 'Pusat Data', 'Pusat Komputasi', 'Pusat Kendali']} activeTab={activeTab} onTabChange={setActiveTab} />

      <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
        <Table>
          <TableHead>
            <TableHeader>Kode</TableHeader>
            <TableHeader>Nama & Jenis</TableHeader>
            <TableHeader>Instansi / Lokasi</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Aksi</TableHeader>
          </TableHead>
          <TableBody>
            {filteredData.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-mono-bold opacity-60 text-xs">{f.kodeFasilitas}</TableCell>
                <TableCell>
                  <div className="font-bold text-sm">{f.namaFasilitas}</div>
                  <StatusBadge status={f.jenisFasilitas} className="mt-1" />
                </TableCell>
                <TableCell>
                  <div className="text-xs font-bold">{instansi.find(i => i.id === f.instansiId)?.singkatan || '-'}</div>
                  <div className="text-[10px] opacity-70 truncate max-w-[200px]">{f.lokasiFisik}</div>
                </TableCell>
                <TableCell><StatusBadge status={f.status} /></TableCell>
                <TableCell className="text-right">
                  <ActionButtons
                    onDetail={() => openDetailModal(f)}
                    onEdit={() => handleEdit(f)}
                    onDelete={() => triggerConfirm(
                      'Hapus Fasilitas?',
                      `Apakah Anda yakin ingin menghapus "${f.namaFasilitas}"? Seluruh perangkat yang terhubung mungkin akan kehilangan referensi lokasi.`,
                      () => {
                        setConfirmConfig(prev => ({ ...prev, isLoading: true }));
                        deleteFasilitas(f.id, {
                          onSuccess: closeConfirm,
                          onError: () => setConfirmConfig(prev => ({ ...prev, isLoading: false }))
                        });
                      }
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isAddModalOpen || isEditModalOpen} onClose={closeModals} title={isEditModalOpen ? "Edit Data Fasilitas" : "Tambah Data Fasilitas"} size="lg" closeOnOverlayClick={false}>
        <form onSubmit={handleSave} className="space-y-6 px-1 pb-4">
          <fieldset disabled={isAdding || isUpdating}>
            <section className="space-y-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#B9FF66] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                1. Profil & Klasifikasi
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Kode Fasilitas" value={kode} onChange={(e) => setKode(e.target.value)} required />
                <Select label="Jenis Fasilitas" value={jenis} onChange={(e) => setJenis(e.target.value as any)}
                  options={[{ label: 'Pusat Data', value: 'Pusat Data' }, { label: 'Pusat Komputasi', value: 'Pusat Komputasi' }, { label: 'Pusat Kendali', value: 'Pusat Kendali' }]}
                />
              </div>
              <Input label="Nama Fasilitas" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </section>

            <section className="space-y-4 p-4 bg-gray-50 border-2 border-black border-dashed mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                2. Kapasitas & Tiering
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Bandwidth Internet (Mbps)" type="number" value={bwInter.toString()} onChange={(e) => setBwInter(Number(e.target.value))} />
                <Input label="Bandwidth Intranet (Mbps)" type="number" value={bwIntra.toString()} onChange={(e) => setBwIntra(Number(e.target.value))} />
                <Select label="Status Tier" value={tier || 'Non-Tier'} onChange={(e) => setTier(e.target.value as any)} disabled={jenis !== 'Pusat Data'}
                  options={[{ label: 'Non-Tier', value: 'Non-Tier' }, { label: 'Tier 3', value: 'Tier 3' }, { label: 'Tier 4', value: 'Tier 4' }]}
                />
                <Select label="Kepemilikan" value={kepemilikan} onChange={(e) => setKepemilikan(e.target.value as any)}
                  options={['Sendiri', 'Instansi Pemerintah Lain', 'BUMN', 'Swasta Dalam Negeri', 'Swasta Luar Negeri'].map(v => ({label:v, value:v}))}
                />
              </div>
            </section>

            <section className="space-y-4 mt-4">
              <h4 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
                3. Lokasi & Keamanan
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Lokasi Fisik / Gedung" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                <Select label="Penanggung Jawab" value={instansiId} onChange={(e) => setInstansiId(e.target.value)} options={instansi.map(i => ({ label: i.namaInstansi, value: i.id }))} />
              </div>
              <Textarea label="Sistem Pengamanan" value={pengamanan} onChange={(e) => setPengamanan(e.target.value)} rows={2} />
              <Select label="Status Operasional" value={status} onChange={(e) => setStatus(e.target.value as any)}
                options={[{ label: 'Aktif Beroperasi', value: 'Aktif' }, { label: 'Perbaikan', value: 'Perbaikan' }, { label: 'Non-Aktif', value: 'Non-Aktif' }]}
              />
            </section>
          </fieldset>

          <div className="flex gap-3 pt-6 border-t-4 border-black bg-white pb-2 mt-6">
            <button type="button" onClick={closeModals} className="flex-1 py-3 font-black uppercase italic border-2 border-black hover:bg-gray-100 transition-all" disabled={isSaving}>
              Batal
            </button>
            <Button type="submit" className="flex-[2] py-3" isLoading={isSaving} progress={progress}>
              SIMPAN DATA FASILITAS
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="Detail Fasilitas Komputasi" size="xl">
        {detailItem && (
          <div className="space-y-8 py-4 px-2">
            <div className="border-l-8 border-[#FFD600] pl-6 py-2">
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">{detailItem.kodeFasilitas}</div>
              <h2 className="text-4xl font-black uppercase leading-none mb-3">{detailItem.namaFasilitas}</h2>
              <div className="flex gap-2">
                <StatusBadge status={detailItem.jenisFasilitas} />
                <StatusBadge status={detailItem.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-black text-white px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#999]">
                    Informasi & Profil
                  </h3>
                  <div className="space-y-1">
                    <DetailField label="Kode Fasilitas" value={detailItem.kodeFasilitas} icon="fingerprint" />
                    <DetailField label="Nama Fasilitas" value={detailItem.namaFasilitas} icon="apartment" />
                    <DetailField label="Penanggung Jawab" value={instansi.find(i => i.id === detailItem.instansiId)?.namaInstansi} icon="corporate_fare" />
                    <DetailField label="Status Kepemilikan" value={detailItem.kepemilikan} icon="inventory_2" />
                    <DetailField label="Lokasi Fisik" value={detailItem.lokasiFisik} icon="location_on" />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#FFD600] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Kapasitas & Keamanan
                  </h3>
                  <div className="space-y-1 bg-gray-50 p-4 border-2 border-dashed border-black">
                    <DetailField label="Klasifikasi Tier" value={detailItem.klasifikasiTier} icon="layers" />
                    <DetailField label="Bandwidth Internet" value={`${detailItem.bandwidthInternet} Mbps`} icon="speed" />
                    <DetailField label="Bandwidth Intranet" value={`${detailItem.bandwidthIntranet} Mbps`} icon="lan" />
                    <DetailField label="Sistem Pengamanan" value={detailItem.sistemPengamanan} icon="security" fullWidth />
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Inventaris Aset Terhubung (Audit)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-6 text-white shadow-[4px_4px_0_0_#888]">
                      <div className="text-[10px] font-mono-bold uppercase opacity-50 mb-2">Hardware</div>
                      <div className="text-4xl font-black">{attachedHardware.length}</div>
                      <div className="text-[9px] font-mono mt-1 opacity-40">Unit Terpasang</div>
                    </div>
                    <div className="bg-[#B9FF66] p-6 text-black border-2 border-black shadow-[4px_4px_0_0_#000]">
                      <div className="text-[10px] font-mono-bold uppercase opacity-50 mb-2">Platform / Cloud</div>
                      <div className="text-4xl font-black">{attachedSoftware.length}</div>
                      <div className="text-[9px] font-mono mt-1 opacity-40">Layanan Aktif</div>
                    </div>
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
