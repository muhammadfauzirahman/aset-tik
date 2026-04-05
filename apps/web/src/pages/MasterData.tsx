import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/layout/PageHeader';
import { SummaryGrid } from '../components/ui/SummaryGrid';
import { FilterTabs } from '../components/ui/FilterTabs';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { ConfirmModal } from '../components/ui/ConfirmModal';

// Hooks
import { useMasterData } from '../hooks/useMasterData';
import { useLoadingProgress } from '../hooks/useLoadingProgress';
import type { Rai, Instansi, Lokasi } from '../types';

type MasterTab = 'instansi' | 'lokasi' | 'rai';

export function MasterData() {
  const [activeTab, setActiveTab] = useState<MasterTab>('instansi');
  const { 
    instansi, 
    lokasi, 
    rai, 
    isLoading, 
    error,
    addRai, updateRai, deleteRai,
    addInstansi, updateInstansi, deleteInstansi,
    addLokasi, updateLokasi, deleteLokasi
  } = useMasterData();

  const { isSaving, progress, startSaving, notifyMutationFinished, reset: resetLoading } = useLoadingProgress();

  const [isRaiModalOpen, setRaiModalOpen] = useState(false);
  const [isInstansiModalOpen, setInstansiModalOpen] = useState(false);
  const [isLokasiModalOpen, setLokasiModalOpen] = useState(false);
  
  const [editingRai, setEditingRai] = useState<Rai | null>(null);
  const [editingInstansi, setEditingInstansi] = useState<Instansi | null>(null);
  const [editingLokasi, setEditingLokasi] = useState<Lokasi | null>(null);

  // Form states
  const [raiKode, setRaiKode] = useState(''); 
  const [raiNama, setRaiNama] = useState('');
  const [instNama, setInstNama] = useState(''); 
  const [instSingkatan, setInstSingkatan] = useState('');
  const [lokNama, setLokNama] = useState(''); 
  const [lokAlamat, setLokAlamat] = useState('');
  const [lokTipe, setLokTipe] = useState<Lokasi['tipeLokasi']>('Pusat Data');

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

  const closeAllModals = () => {
    setRaiModalOpen(false);
    setInstansiModalOpen(false);
    setLokasiModalOpen(false);
    resetLoading();
  };

  // RAI Handlers
  const openAddRai = () => { setEditingRai(null); setRaiKode(''); setRaiNama(''); setRaiModalOpen(true); };
  const openEditRai = (item: Rai) => { setEditingRai(item); setRaiKode(item.kodeRai); setRaiNama(item.namaPusat); setRaiModalOpen(true); };
  const handleSaveRai = (e: React.FormEvent) => { 
    e.preventDefault(); 
    startSaving();
    if (editingRai) updateRai(editingRai.id, { kodeRai: raiKode, namaPusat: raiNama }, { onSuccess: () => notifyMutationFinished(closeAllModals), onError: resetLoading }); 
    else addRai({ kodeRai: raiKode, namaPusat: raiNama }, { onSuccess: () => notifyMutationFinished(closeAllModals), onError: resetLoading }); 
  };

  // Instansi Handlers
  const openAddInstansi = () => { setEditingInstansi(null); setInstNama(''); setInstSingkatan(''); setInstansiModalOpen(true); };
  const openEditInstansi = (item: Instansi) => { setEditingInstansi(item); setInstNama(item.namaInstansi); setInstSingkatan(item.singkatan); setInstansiModalOpen(true); };
  const handleSaveInstansi = (e: React.FormEvent) => { 
    e.preventDefault(); 
    startSaving();
    if (editingInstansi) updateInstansi(editingInstansi.id, { namaInstansi: instNama, singkatan: instSingkatan }, { onSuccess: () => notifyMutationFinished(closeAllModals), onError: resetLoading }); 
    else addInstansi({ namaInstansi: instNama, singkatan: instSingkatan }, { onSuccess: () => notifyMutationFinished(closeAllModals), onError: resetLoading }); 
  };

  // Lokasi Handlers
  const openAddLokasi = () => { setEditingLokasi(null); setLokNama(''); setLokAlamat(''); setLokTipe('Pusat Data'); setLokasiModalOpen(true); };
  const openEditLokasi = (item: Lokasi) => { setEditingLokasi(item); setLokNama(item.namaLokasi); setLokTipe(item.tipeLokasi); setLokAlamat(item.alamat); setLokasiModalOpen(true); };
  const handleSaveLokasi = (e: React.FormEvent) => { 
    e.preventDefault(); 
    startSaving();
    if (editingLokasi) updateLokasi(editingLokasi.id, { namaLokasi: lokNama, tipeLokasi: lokTipe, alamat: lokAlamat }, { onSuccess: () => notifyMutationFinished(closeAllModals), onError: resetLoading }); 
    else addLokasi({ namaLokasi: lokNama, tipeLokasi: lokTipe, alamat: lokAlamat }, { onSuccess: () => notifyMutationFinished(closeAllModals), onError: resetLoading }); 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl font-black uppercase animate-pulse italic">Memuat Master Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border-4 border-red-600 text-red-600 font-bold">
        Gagal memuat data: {(error as any).message}
      </div>
    );
  }

  const summaryItems = [
    { label: 'Total Instansi', value: instansi.length, color: 'blue' as const },
    { label: 'Lokasi Fisik', value: lokasi.length, color: 'yellow' as const },
    { label: 'Ref. Arsitektur', value: rai.length, color: 'green' as const },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Master Data" 
        subtitle="Kelola entitas dasar, referensi arsitektur, dan lokasi strategis aset TIK." 
        icon="database" 
      />
      
      <SummaryGrid items={summaryItems} />
      
      <FilterTabs<MasterTab>
        tabs={['instansi', 'lokasi', 'rai']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        getLabel={(tab) => {
          if (tab === 'rai') return 'Referensi Arsitektur';
          if (tab === 'instansi') return 'Instansi';
          if (tab === 'lokasi') return 'Lokasi';
          return tab;
        }}
      />

      {activeTab === 'rai' && (
        <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-white">
            <h2 className="font-mono-bold uppercase text-sm">Referensi Arsitektur (RAI)</h2>
            <Button onClick={openAddRai} size="sm">Tambah RAI</Button>
          </div>
          <Table>
            <TableHead>
              <TableHeader>Kode</TableHeader>
              <TableHeader>Kategori</TableHeader>
              <TableHeader className="text-right">Aksi</TableHeader>
            </TableHead>
            <TableBody>
              {rai.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono font-bold text-xs">{r.kodeRai}</TableCell>
                  <TableCell className="text-sm">{r.namaPusat}</TableCell>
                  <TableCell className="text-right">
                    <ActionButtons 
                      onEdit={() => openEditRai(r)}
                      onDelete={() => triggerConfirm(
                        'Hapus RAI?', 
                        `Apakah Anda yakin ingin menghapus referensi arsitektur "${r.namaPusat}"? Tindakan ini tidak dapat dibatalkan.`,
                        () => {
                          setConfirmConfig(prev => ({ ...prev, isLoading: true }));
                          deleteRai(r.id, { 
                            onSuccess: closeConfirm,
                            onError: () => setConfirmConfig(prev => ({ ...prev, isLoading: false }))
                          });
                        }
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {rai.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 opacity-50 italic">Tidak ada data RAI</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'instansi' && (
        <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-white">
            <h2 className="font-mono-bold uppercase text-sm">Daftar Instansi</h2>
            <Button onClick={openAddInstansi} size="sm">Tambah Instansi</Button>
          </div>
          <Table>
            <TableHead>
              <TableHeader>Singkatan</TableHeader>
              <TableHeader>Nama Lengkap</TableHeader>
              <TableHeader className="text-right">Aksi</TableHeader>
            </TableHead>
            <TableBody>
              {instansi.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono font-bold text-xs">{i.singkatan}</TableCell>
                  <TableCell className="text-sm">{i.namaInstansi}</TableCell>
                  <TableCell className="text-right">
                    <ActionButtons 
                      onEdit={() => openEditInstansi(i)}
                      onDelete={() => triggerConfirm(
                        'Hapus Instansi?', 
                        `Apakah Anda yakin ingin menghapus "${i.namaInstansi}"? Seluruh relasi aset mungkin akan terpengaruh.`,
                        () => {
                          setConfirmConfig(prev => ({ ...prev, isLoading: true }));
                          deleteInstansi(i.id, { 
                            onSuccess: closeConfirm,
                            onError: () => setConfirmConfig(prev => ({ ...prev, isLoading: false }))
                          });
                        }
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {instansi.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 opacity-50 italic">Tidak ada data instansi</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'lokasi' && (
        <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-white">
            <h2 className="font-mono-bold uppercase text-sm">Lokasi Fisik</h2>
            <Button onClick={openAddLokasi} size="sm">Tambah Lokasi</Button>
          </div>
          <Table>
            <TableHead>
              <TableHeader>Nama Lokasi</TableHeader>
              <TableHeader>Tipe</TableHeader>
              <TableHeader className="text-right">Aksi</TableHeader>
            </TableHead>
            <TableBody>
              {lokasi.map(l => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="font-bold text-sm">{l.namaLokasi}</div>
                    <div className="text-[10px] opacity-60 truncate max-w-[200px]">{l.alamat}</div>
                  </TableCell>
                  <TableCell><StatusBadge status={l.tipeLokasi} /></TableCell>
                  <TableCell className="text-right">
                    <ActionButtons 
                      onEdit={() => openEditLokasi(l)}
                      onDelete={() => triggerConfirm(
                        'Hapus Lokasi?', 
                        `Apakah Anda yakin ingin menghapus lokasi "${l.namaLokasi}"?`,
                        () => {
                          setConfirmConfig(prev => ({ ...prev, isLoading: true }));
                          deleteLokasi(l.id, { 
                            onSuccess: closeConfirm,
                            onError: () => setConfirmConfig(prev => ({ ...prev, isLoading: false }))
                          });
                        }
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {lokasi.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 opacity-50 italic">Tidak ada data lokasi</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* RAI Modal */}
      <Modal isOpen={isRaiModalOpen} onClose={closeAllModals} title={editingRai ? "Edit RAI" : "Tambah RAI"} size="xs">
        <form onSubmit={handleSaveRai} className="space-y-4">
          <Input label="Kode Referensi" value={raiKode} onChange={e => setRaiKode(e.target.value)} required placeholder="e.g. RAI.01" disabled={isSaving} />
          <Input label="Nama Kategori" value={raiNama} onChange={e => setRaiNama(e.target.value)} required placeholder="e.g. Pusat Data Nasional" disabled={isSaving} />
          <Button type="submit" className="w-full" isLoading={isSaving} progress={progress}>Simpan</Button>
        </form>
      </Modal>

      {/* Instansi Modal */}
      <Modal isOpen={isInstansiModalOpen} onClose={closeAllModals} title={editingInstansi ? "Edit Instansi" : "Tambah Instansi"} size="xs">
        <form onSubmit={handleSaveInstansi} className="space-y-4">
          <Input label="Nama Lengkap" value={instNama} onChange={e => setInstNama(e.target.value)} required placeholder="e.g. Kementerian Kominfo" disabled={isSaving} />
          <Input label="Singkatan" value={instSingkatan} onChange={e => setInstSingkatan(e.target.value)} required placeholder="e.g. KOMINFO" disabled={isSaving} />
          <Button type="submit" className="w-full" isLoading={isSaving} progress={progress}>Simpan</Button>
        </form>
      </Modal>

      {/* Lokasi Modal */}
      <Modal isOpen={isLokasiModalOpen} onClose={closeAllModals} title={editingLokasi ? "Edit Lokasi" : "Tambah Lokasi"} size="xs">
        <form onSubmit={handleSaveLokasi} className="space-y-4">
          <Input label="Nama Lokasi" value={lokNama} onChange={e => setLokNama(e.target.value)} required placeholder="e.g. PDN Cikarang" disabled={isSaving} />
          <Select 
            label="Tipe" 
            value={lokTipe} 
            onChange={e => setLokTipe(e.target.value as any)} 
            disabled={isSaving}
            options={[
              {label: 'Pusat Data', value: 'Pusat Data'},
              {label: 'Command Center', value: 'Command Center'},
              {label: 'Sirkuit/Jaringan', value: 'Sirkuit/Jaringan'},
              {label: 'Vendor Cloud', value: 'Vendor Cloud'}
            ]} 
          />
          <Input label="Alamat" value={lokAlamat} onChange={e => setLokAlamat(e.target.value)} required placeholder="e.g. Jl. Raya Cikarang No. 1" disabled={isSaving} />
          <Button type="submit" className="w-full" isLoading={isSaving} progress={progress}>Simpan</Button>
        </form>
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
