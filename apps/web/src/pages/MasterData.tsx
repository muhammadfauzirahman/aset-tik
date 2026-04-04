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
import { useMasterData } from '../store/useMasterData';
import type { Rai, Instansi, Lokasi } from '../types';

type MasterTab = 'instansi' | 'lokasi' | 'rai';

export function MasterData() {
  const [activeTab, setActiveTab] = useState<MasterTab>('instansi');
  const masterData = useMasterData();
  
  // Defensive checks to ensure data is always an array
  const instansi = masterData?.instansi || [];
  const lokasi = masterData?.lokasi || [];
  const rai = masterData?.rai || [];

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

  // RAI Handlers
  const openAddRai = () => { setEditingRai(null); setRaiKode(''); setRaiNama(''); setRaiModalOpen(true); };
  const openEditRai = (item: Rai) => { setEditingRai(item); setRaiKode(item.kodeRai); setRaiNama(item.namaPusat); setRaiModalOpen(true); };
  const handleSaveRai = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (editingRai) masterData.updateRai(editingRai.id, { kodeRai: raiKode, namaPusat: raiNama }); 
    else masterData.addRai({ kodeRai: raiKode, namaPusat: raiNama }); 
    setRaiModalOpen(false); 
  };

  // Instansi Handlers
  const openAddInstansi = () => { setEditingInstansi(null); setInstNama(''); setInstSingkatan(''); setInstansiModalOpen(true); };
  const openEditInstansi = (item: Instansi) => { setEditingInstansi(item); setInstNama(item.namaInstansi); setInstSingkatan(item.singkatan); setInstansiModalOpen(true); };
  const handleSaveInstansi = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (editingInstansi) masterData.updateInstansi(editingInstansi.id, { namaInstansi: instNama, singkatan: instSingkatan }); 
    else masterData.addInstansi({ namaInstansi: instNama, singkatan: instSingkatan }); 
    setInstansiModalOpen(false); 
  };

  // Lokasi Handlers
  const openAddLokasi = () => { setEditingLokasi(null); setLokNama(''); setLokAlamat(''); setLokTipe('Pusat Data'); setLokasiModalOpen(true); };
  const openEditLokasi = (item: Lokasi) => { setEditingLokasi(item); setLokNama(item.namaLokasi); setLokTipe(item.tipeLokasi); setLokAlamat(item.alamat); setLokasiModalOpen(true); };
  const handleSaveLokasi = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (editingLokasi) masterData.updateLokasi(editingLokasi.id, { namaLokasi: lokNama, tipeLokasi: lokTipe, alamat: lokAlamat }); 
    else masterData.addLokasi({ namaLokasi: lokNama, tipeLokasi: lokTipe, alamat: lokAlamat }); 
    setLokasiModalOpen(false); 
  };

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
                      onDelete={() => { if(confirm('Hapus RAI?')) masterData.deleteRai(r.id) }}
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
                      onDelete={() => { if(confirm('Hapus instansi?')) masterData.deleteInstansi(i.id) }}
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
                      onDelete={() => { if(confirm('Hapus lokasi?')) masterData.deleteLokasi(l.id) }}
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
      <Modal isOpen={isRaiModalOpen} onClose={() => setRaiModalOpen(false)} title={editingRai ? "Edit RAI" : "Tambah RAI"} size="xs">
        <form onSubmit={handleSaveRai} className="space-y-4">
          <Input label="Kode Referensi" value={raiKode} onChange={e => setRaiKode(e.target.value)} required placeholder="e.g. RAI.01" />
          <Input label="Nama Kategori" value={raiNama} onChange={e => setRaiNama(e.target.value)} required placeholder="e.g. Pusat Data Nasional" />
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </Modal>

      {/* Instansi Modal */}
      <Modal isOpen={isInstansiModalOpen} onClose={() => setInstansiModalOpen(false)} title={editingInstansi ? "Edit Instansi" : "Tambah Instansi"} size="xs">
        <form onSubmit={handleSaveInstansi} className="space-y-4">
          <Input label="Nama Lengkap" value={instNama} onChange={e => setInstNama(e.target.value)} required placeholder="e.g. Kementerian Kominfo" />
          <Input label="Singkatan" value={instSingkatan} onChange={e => setInstSingkatan(e.target.value)} required placeholder="e.g. KOMINFO" />
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </Modal>

      {/* Lokasi Modal */}
      <Modal isOpen={isLokasiModalOpen} onClose={() => setLokasiModalOpen(false)} title={editingLokasi ? "Edit Lokasi" : "Tambah Lokasi"} size="xs">
        <form onSubmit={handleSaveLokasi} className="space-y-4">
          <Input label="Nama Lokasi" value={lokNama} onChange={e => setLokNama(e.target.value)} required placeholder="e.g. PDN Cikarang" />
          <Select 
            label="Tipe" 
            value={lokTipe} 
            onChange={e => setLokTipe(e.target.value as any)} 
            options={[
              {label: 'Pusat Data', value: 'Pusat Data'},
              {label: 'Command Center', value: 'Command Center'},
              {label: 'Sirkuit/Jaringan', value: 'Sirkuit/Jaringan'},
              {label: 'Vendor Cloud', value: 'Vendor Cloud'}
            ]} 
          />
          <Input label="Alamat" value={lokAlamat} onChange={e => setLokAlamat(e.target.value)} required placeholder="e.g. Jl. Raya Cikarang No. 1" />
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </Modal>
    </div>
  );
}
