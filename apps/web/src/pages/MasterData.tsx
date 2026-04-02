import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { useMasterData } from '../store/useMasterData';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import type { Rai, Instansi, Lokasi } from '../types';

export function MasterData() {
  const [activeTab, setActiveTab] = useState<'rai' | 'instansi' | 'lokasi'>('instansi');
  
  const { 
    rai, 
    addRai,
    updateRai,
    deleteRai,
    instansi, 
    lokasi, 
    addInstansi, 
    updateInstansi, 
    deleteInstansi, 
    addLokasi, 
    updateLokasi, 
    deleteLokasi 
  } = useMasterData();

  // Modal States
  const [isRaiModalOpen, setRaiModalOpen] = useState(false);
  const [isInstansiModalOpen, setInstansiModalOpen] = useState(false);
  const [isLokasiModalOpen, setLokasiModalOpen] = useState(false);
  
  // Edit States
  const [editingRai, setEditingRai] = useState<Rai | null>(null);
  const [editingInstansi, setEditingInstansi] = useState<Instansi | null>(null);
  const [editingLokasi, setEditingLokasi] = useState<Lokasi | null>(null);

  // RAI Form State
  const [raiKode, setRaiKode] = useState('');
  const [raiNama, setRaiNama] = useState('');

  // Instansi Form State
  const [instNama, setInstNama] = useState('');
  const [instSingkatan, setInstSingkatan] = useState('');

  // Lokasi Form State
  const [lokNama, setLokNama] = useState('');
  const [lokTipe, setLokTipe] = useState<'Pusat Data' | 'Command Center' | 'Sirkuit/Jaringan' | 'Vendor Cloud'>('Pusat Data');
  const [lokAlamat, setLokAlamat] = useState('');

  // --- Handlers ---

  const openAddRai = () => {
    setEditingRai(null);
    setRaiKode('');
    setRaiNama('');
    setRaiModalOpen(true);
  };

  const openEditRai = (item: Rai) => {
    setEditingRai(item);
    setRaiKode(item.kodeRai);
    setRaiNama(item.namaPusat);
    setRaiModalOpen(true);
  };

  const handleSaveRai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raiKode || !raiNama) return;

    if (editingRai) {
      updateRai(editingRai.id, { kodeRai: raiKode, namaPusat: raiNama });
    } else {
      addRai({ kodeRai: raiKode, namaPusat: raiNama });
    }
    setRaiModalOpen(false);
  };

  const openAddInstansi = () => {
    setEditingInstansi(null);
    setInstNama('');
    setInstSingkatan('');
    setInstansiModalOpen(true);
  };

  const openEditInstansi = (item: Instansi) => {
    setEditingInstansi(item);
    setInstNama(item.namaInstansi);
    setInstSingkatan(item.singkatan);
    setInstansiModalOpen(true);
  };

  const handleSaveInstansi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instNama || !instSingkatan) return;

    if (editingInstansi) {
      updateInstansi(editingInstansi.id, { namaInstansi: instNama, singkatan: instSingkatan });
    } else {
      addInstansi({ namaInstansi: instNama, singkatan: instSingkatan });
    }
    setInstansiModalOpen(false);
  };

  const openAddLokasi = () => {
    setEditingLokasi(null);
    setLokNama('');
    setLokAlamat('');
    setLokTipe('Pusat Data');
    setLokasiModalOpen(true);
  };

  const openEditLokasi = (item: Lokasi) => {
    setEditingLokasi(item);
    setLokNama(item.namaLokasi);
    setLokTipe(item.tipeLokasi);
    setLokAlamat(item.alamat);
    setLokasiModalOpen(true);
  };

  const handleSaveLokasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokNama || !lokAlamat) return;

    if (editingLokasi) {
      updateLokasi(editingLokasi.id, { namaLokasi: lokNama, tipeLokasi: lokTipe, alamat: lokAlamat });
    } else {
      addLokasi({ namaLokasi: lokNama, tipeLokasi: lokTipe, alamat: lokAlamat });
    }
    setLokasiModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-mono font-black uppercase">Master Data</h1>
          <p className="font-body opacity-80 mt-1">Kelola data dasar infrastruktur SPBE Anda secara terstruktur.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1">
        {(['rai', 'instansi', 'lokasi'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-mono font-bold uppercase transition-all border-[3px] border-[#1A1A1A] mr-[-3px] relative ${
              activeTab === tab 
              ? 'bg-[#1A1A1A] text-white z-10 shadow-[4px_4px_0px_0px_#FFD600]' 
              : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E8] shadow-none'
            }`}
          >
            {tab === 'rai' ? '1. Referensi (RAI)' : tab === 'instansi' ? '2. Instansi' : '3. Lokasi Fisik'}
          </button>
        ))}
      </div>

      {/* --- Tab Content: RAI --- */}
      {activeTab === 'rai' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A]">
            <h2 className="font-mono font-black uppercase text-lg">Referensi Arsitektur Infrastruktur (Standar SPBE)</h2>
            <Button onClick={openAddRai} size="md">
              <span className="material-symbols-outlined mr-2">add</span>
              Tambah Referensi
            </Button>
          </div>

          <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
            <Table>
              <TableHead>
                <TableHeader>Kode RAI</TableHeader>
                <TableHeader>Nama Kategori / Pusat</TableHeader>
                <TableHeader className="text-right">Aksi</TableHeader>
              </TableHead>
              <TableBody>
                {rai.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono-bold w-40">{r.kodeRai}</TableCell>
                    <TableCell>{r.namaPusat}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditRai(r)}>
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteRai(r.id)}>
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rai.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center opacity-70 p-12 font-mono italic">Belum ada data referensi terdaftar.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* --- Tab Content: Instansi --- */}
      {activeTab === 'instansi' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A]">
            <h2 className="font-mono font-black uppercase text-lg">Daftar Instansi & Unit Pengelola</h2>
            <Button onClick={openAddInstansi} size="md">
              <span className="material-symbols-outlined mr-2">add</span>
              Tambah Instansi
            </Button>
          </div>
          
          <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
            <Table>
              <TableHead>
                <TableHeader>Singkatan</TableHeader>
                <TableHeader>Nama Lengkap</TableHeader>
                <TableHeader className="text-right">Aksi</TableHeader>
              </TableHead>
              <TableBody>
                {instansi.map((inst) => (
                  <TableRow key={inst.id}>
                    <TableCell className="font-mono-bold w-48">{inst.singkatan}</TableCell>
                    <TableCell>{inst.namaInstansi}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditInstansi(inst)}>
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteInstansi(inst.id)}>
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {instansi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center opacity-70 p-12 font-mono italic">Belum ada data instansi terdaftar.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* --- Tab Content: Lokasi --- */}
      {activeTab === 'lokasi' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A]">
            <h2 className="font-mono font-black uppercase text-lg">Daftar Lokasi Infrastruktur Fisik</h2>
            <Button onClick={openAddLokasi} size="md" variant="secondary">
              <span className="material-symbols-outlined mr-2">add_location</span>
              Tambah Lokasi
            </Button>
          </div>

          <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
            <Table>
              <TableHead>
                <TableHeader>Nama Lokasi</TableHeader>
                <TableHeader>Tipe</TableHeader>
                <TableHeader>Alamat</TableHeader>
                <TableHeader className="text-right">Aksi</TableHeader>
              </TableHead>
              <TableBody>
                {lokasi.map((lok) => (
                  <TableRow key={lok.id}>
                    <TableCell className="font-mono-bold w-56">{lok.namaLokasi}</TableCell>
                    <TableCell>
                      <Badge color={lok.tipeLokasi === 'Vendor Cloud' ? 'primary' : 'success'}>
                        {lok.tipeLokasi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs">{lok.alamat}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditLokasi(lok)}>
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteLokasi(lok.id)}>
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {lokasi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center opacity-70 p-12 font-mono italic">Belum ada data lokasi terdaftar.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* --- MODALS --- */}

      <Modal 
        isOpen={isRaiModalOpen} 
        onClose={() => setRaiModalOpen(false)}
        title={editingRai ? "Edit Referensi RAI" : "Tambah Referensi RAI"}
      >
        <form onSubmit={handleSaveRai} className="space-y-5">
          <Input 
            label="Kode Referensi (RAI)" 
            placeholder="Contoh: RAI.01.01" 
            value={raiKode}
            onChange={(e) => setRaiKode(e.target.value)}
            required
            autoFocus
          />
          <Input 
            label="Nama Kategori / Fasilitas" 
            placeholder="Contoh: Pusat Data Nasional (PDN)" 
            value={raiNama}
            onChange={(e) => setRaiNama(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-4 border-t-2 border-[#EAE7E7]">
            <Button type="submit" className="flex-1">
              {editingRai ? "Simpan Perubahan" : "Simpan Referensi"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setRaiModalOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isInstansiModalOpen} 
        onClose={() => setInstansiModalOpen(false)}
        title={editingInstansi ? "Edit Instansi" : "Tambah Instansi"}
      >
        <form onSubmit={handleSaveInstansi} className="space-y-5">
          <Input 
            label="Nama Instansi" 
            placeholder="Contoh: Dinas Komunikasi dan Informatika" 
            value={instNama}
            onChange={(e) => setInstNama(e.target.value)}
            required
            autoFocus
          />
          <Input 
            label="Singkatan / Kode" 
            placeholder="Contoh: DISKOMINFO" 
            value={instSingkatan}
            onChange={(e) => setInstSingkatan(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-4 border-t-2 border-[#EAE7E7]">
            <Button type="submit" className="flex-1">
              {editingInstansi ? "Simpan Perubahan" : "Simpan Instansi"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setInstansiModalOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isLokasiModalOpen} 
        onClose={() => setLokasiModalOpen(false)}
        title={editingLokasi ? "Edit Lokasi" : "Tambah Lokasi"}
      >
        <form onSubmit={handleSaveLokasi} className="space-y-5">
          <Input 
            label="Nama Lokasi / Site" 
            placeholder="Contoh: Data Center Gd. A" 
            value={lokNama}
            onChange={(e) => setLokNama(e.target.value)}
            required
            autoFocus
          />
          <Select 
            label="Tipe Lokasi"
            value={lokTipe}
            onChange={(e) => setLokTipe(e.target.value as any)}
            options={[
              { label: 'Pusat Data (DC)', value: 'Pusat Data' },
              { label: 'Command Center (CC)', value: 'Command Center' },
              { label: 'Sirkuit/Jaringan', value: 'Sirkuit/Jaringan' },
              { label: 'Vendor Cloud', value: 'Vendor Cloud' },
            ]}
          />
          <Input 
            label="Alamat Detail" 
            placeholder="Contoh: Jl. Diponegoro No. 22, Lt. 4" 
            value={lokAlamat}
            onChange={(e) => setLokAlamat(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-4 border-t-2 border-[#EAE7E7]">
            <Button type="submit" className="flex-1" variant="secondary">
              {editingLokasi ? "Simpan Perubahan" : "Simpan Lokasi"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setLokasiModalOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
