import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useKonektivitasStore } from '../store/useKonektivitasStore';
import { useAssetCRUD } from '../hooks/useAssetCRUD';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterTabs } from '../components/ui/FilterTabs';
import { SummaryGrid } from '../components/ui/SummaryGrid';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButtons } from '../components/ui/ActionButtons';
import { DetailField } from '../components/ui/DetailField';
import type { Konektivitas, KonektivitasKategori } from '../types';

export function SistemIntegrasi() {
  const { konektivitas, addKonektivitas, updateKonektivitas, deleteKonektivitas } = useKonektivitasStore();
  
  const {
    isAddModalOpen, isEditModalOpen, isDetailModalOpen, editingItem, detailItem,
    openAddModal, openEditModal, openDetailModal, closeModals,
  } = useAssetCRUD<Konektivitas>();

  const [activeFilter, setActiveFilter] = useState<'Semua' | KonektivitasKategori>('Semua');

  // Form State
  const [formData, setFormData] = useState<Partial<Konektivitas>>({
    kategori: 'Jaringan Intra',
    statusKepemilikan: 'Pusat',
    tipeMedia: 'Fiber Optic'
  });

  const handleEdit = (item: Konektivitas) => {
    setFormData(item);
    openEditModal(item);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formData as Omit<Konektivitas, 'id'>;
    if (isEditModalOpen && editingItem) updateKonektivitas(editingItem.id, payload);
    else addKonektivitas(payload);
    closeModals();
    setFormData({ kategori: 'Jaringan Intra', statusKepemilikan: 'Pusat', tipeMedia: 'Fiber Optic' });
  };

  const filteredData = activeFilter === 'Semua' ? konektivitas : konektivitas.filter(k => k.kategori === activeFilter);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Sistem Integrasi" 
        subtitle="Layanan Jaringan Intra Pemerintah dan Sistem Penghubung Layanan Pemerintah (SPLP)."
        onAdd={openAddModal}
        addLabel="Tambah Koneksi"
        icon="hub"
      />

      <SummaryGrid items={[
        { label: 'Jaringan Intra', value: konektivitas.filter(k => k.kategori === 'Jaringan Intra').length, color: 'green' },
        { label: 'Sistem Penghubung (SPLP)', value: konektivitas.filter(k => k.kategori === 'SPLP').length, color: 'yellow' },
        { label: 'Total Konektivitas', value: konektivitas.length, color: 'blue' },
      ]} />

      <FilterTabs activeTab={activeFilter} onTabChange={(f) => setActiveFilter(f as any)} tabs={['Semua', 'Jaringan Intra', 'SPLP']} />

      <Card className="shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
        <Table>
          <TableHead>
            <TableHeader>Kode & Kategori</TableHeader>
            <TableHeader>Layanan / Jaringan</TableHeader>
            <TableHeader>Pemilik</TableHeader>
            <TableHeader className="text-right">Aksi</TableHeader>
          </TableHead>
          <TableBody>
            {filteredData.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="w-48">
                  <div className="font-mono-bold text-sm mb-1">{k.kodeAset}</div>
                  <StatusBadge status={k.kategori} />
                </TableCell>
                <TableCell>
                  <div className="font-bold text-[#1A1A1A]">{k.namaJaringan}</div>
                  <div className="text-xs opacity-70 mt-1 max-w-xs truncate">{k.deskripsi}</div>
                </TableCell>
                <TableCell><div className="font-bold text-sm">{k.pemilik}</div></TableCell>
                <TableCell className="text-right">
                  <ActionButtons 
                    onDetail={() => openDetailModal(k)}
                    onEdit={() => handleEdit(k)}
                    onDelete={() => { if(confirm('Hapus data?')) deleteKonektivitas(k.id) }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isAddModalOpen || isEditModalOpen} onClose={closeModals} title={isEditModalOpen ? "Edit Konektivitas" : "Tambah Konektivitas"} size="lg">
        <form onSubmit={handleSave} className="space-y-6 px-1 pb-4">
          <section className="space-y-4">
            <h4 className="text-xs font-mono-bold uppercase bg-[#B9FF66] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              1. Identitas & Klasifikasi
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Kategori" value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value as any})}
                options={[{ label: 'Jaringan Intra Pemerintah', value: 'Jaringan Intra' }, { label: 'SPLP', value: 'SPLP' }]} required />
              <Input label="Kode Aset" value={formData.kodeAset || ''} onChange={(e) => setFormData({...formData, kodeAset: e.target.value})} required />
            </div>
            <Input label="Nama Layanan/Jaringan" value={formData.namaJaringan || ''} onChange={(e) => setFormData({...formData, namaJaringan: e.target.value})} required />
            <Textarea label="Deskripsi" value={formData.deskripsi || ''} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} rows={3} />
          </section>

          <section className="space-y-4 p-4 bg-gray-50 border-2 border-black border-dashed">
            <h4 className="text-xs font-mono-bold uppercase bg-[#FFD700] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              2. Spesifikasi Teknis
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Bandwidth" value={formData.bandwidth || ''} onChange={(e) => setFormData({...formData, bandwidth: e.target.value})} />
              <Select label="Tipe Media" value={formData.tipeMedia} onChange={(e) => setFormData({...formData, tipeMedia: e.target.value})}
                options={['Fiber Optic', 'Radio', 'VSAT', 'UTP', 'Lainnya'].map(v => ({label:v, value:v}))} />
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-mono-bold uppercase bg-[#00E5FF] border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0_0_#000]">
              3. Pengelola & Status
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nama Pemilik" value={formData.pemilik || ''} onChange={(e) => setFormData({...formData, pemilik: e.target.value})} required />
              <Select label="Status Kepemilikan" value={formData.statusKepemilikan} onChange={(e) => setFormData({...formData, statusKepemilikan: e.target.value as any})}
                options={['Pusat', 'BUMN', 'Swasta', 'Pihak Ketiga'].map(v => ({label:v, value:v}))} required />
            </div>
          </section>

          <div className="flex gap-3 pt-6 border-t-4 border-black bg-white pb-2">
            <button type="button" onClick={closeModals} className="flex-1 py-3 font-black uppercase italic border-2 border-black hover:bg-gray-100 transition-all">Batal</button>
            <button type="submit" className="flex-[2] py-3 bg-black text-white font-black uppercase italic border-2 border-black shadow-[4px_4px_0_0_#666] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">SIMPAN DATA</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="Detail Sistem Integrasi" size="xl">
        {detailItem && (
          <div className="space-y-8 py-4 px-2">
            <div className={`border-l-8 ${detailItem.kategori === 'SPLP' ? 'border-[#FFD700]' : 'border-[#B9FF66]'} pl-6 py-2`}>
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">{detailItem.kodeAset}</div>
              <h2 className="text-4xl font-black uppercase leading-none mb-3">{detailItem.namaJaringan}</h2>
              <div className="flex gap-2">
                <StatusBadge status={detailItem.kategori} />
                <StatusBadge status={detailItem.statusKepemilikan} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-black text-white px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#999]">
                    Informasi & Identitas
                  </h3>
                  <div className="space-y-1">
                    <DetailField label="Kode Koneksi" value={detailItem.kodeAset} icon="fingerprint" />
                    <DetailField label="Nama Layanan" value={detailItem.namaJaringan} icon="hub" />
                    <DetailField label="Pemilik" value={detailItem.pemilik} icon="corporate_fare" />
                    <DetailField label="Status Kepemilikan" value={detailItem.statusKepemilikan} icon="inventory_2" />
                    <DetailField label="Deskripsi" value={detailItem.deskripsi} icon="description" fullWidth />
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-mono-bold uppercase bg-[#B9FF66] border-2 border-black px-3 py-1 inline-block mb-4 shadow-[3px_3px_0_0_#000]">
                    Spesifikasi Teknis
                  </h3>
                  <div className="space-y-1 bg-gray-50 p-4 border-2 border-dashed border-black">
                    <DetailField label="Media Transmisi" value={detailItem.tipeMedia} icon="settings_input_component" />
                    <DetailField label="Bandwidth" value={detailItem.bandwidth} icon="speed" />
                  </div>
                </section>
                {detailItem.kategori === 'SPLP' && (
                  <section className="bg-yellow-50 p-6 border-2 border-black shadow-[4px_4px_0_0_#FFD600]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-yellow-600 font-black">verified_user</span>
                      <h4 className="text-xs font-mono-bold uppercase">Sistem Penghubung Layanan Pemerintah (SPLP)</h4>
                    </div>
                    <p className="text-xs">Berfungsi sebagai node interoperabilitas data antar instansi terpusat/nasional.</p>
                  </section>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button onClick={closeModals} className="bg-black text-white hover:bg-gray-800 px-12 py-3 rounded-none border-4 border-black shadow-[4px_4px_0_0_#999] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase font-black italic tracking-widest">
                Tutup Dokumen
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
