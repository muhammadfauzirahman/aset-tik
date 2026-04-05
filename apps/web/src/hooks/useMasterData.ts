import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Rai, Instansi, Lokasi } from '../types';
import { useToast } from '../components/ui/Toast';

export function useMasterData() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const raiQuery = useQuery({
    queryKey: ['rai'],
    queryFn: () => api.get<{ success: boolean; data: Rai[] }>('/rai'),
    select: (response) => response.data,
  });

  const instansiQuery = useQuery({
    queryKey: ['instansi'],
    queryFn: () => api.get<{ success: boolean; data: Instansi[] }>('/instansi'),
    select: (response) => response.data,
  });

  const lokasiQuery = useQuery({
    queryKey: ['lokasi'],
    queryFn: () => api.get<{ success: boolean; data: Lokasi[] }>('/lokasi'),
    select: (response) => response.data,
  });

  // RAI Mutations
  const addRaiMutation = useMutation({
    mutationFn: (data: Omit<Rai, 'id'>) => api.post('/rai', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rai'] });
      toast.success('Pusat RAI berhasil ditambahkan.');
    },
    onError: () => toast.error('Gagal menambahkan RAI.')
  });

  const updateRaiMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Rai> }) => api.patch(`/rai/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rai'] });
      toast.success('Pusat RAI berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui RAI.')
  });

  const deleteRaiMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/rai/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rai'] });
      toast.success('Referensi RAI berhasil dihapus.');
    },
    onError: () => toast.error('Gagal menghapus RAI.')
  });

  // Instansi Mutations
  const addInstansiMutation = useMutation({
    mutationFn: (data: Omit<Instansi, 'id'>) => api.post('/instansi', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instansi'] });
      toast.success('Instansi berhasil ditambahkan.');
    },
    onError: () => toast.error('Gagal menambahkan instansi.')
  });

  const updateInstansiMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Instansi> }) => api.patch(`/instansi/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instansi'] });
      toast.success('Instansi berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui instansi.')
  });

  const deleteInstansiMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/instansi/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instansi'] });
      toast.success('Instansi berhasil dihapus.');
    },
    onError: () => toast.error('Gagal menghapus instansi.')
  });

  // Lokasi Mutations
  const addLokasiMutation = useMutation({
    mutationFn: (data: Omit<Lokasi, 'id'>) => api.post('/lokasi', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lokasi'] });
      toast.success('Lokasi berhasil ditambahkan.');
    },
    onError: () => toast.error('Gagal menambahkan lokasi.')
  });

  const updateLokasiMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lokasi> }) => api.patch(`/lokasi/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lokasi'] });
      toast.success('Lokasi berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui lokasi.')
  });

  const deleteLokasiMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/lokasi/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lokasi'] });
      toast.success('Lokasi berhasil dihapus.');
    },
    onError: () => toast.error('Gagal menghapus lokasi.')
  });

  return {
    rai: raiQuery.data || [],
    instansi: instansiQuery.data || [],
    lokasi: lokasiQuery.data || [],
    isLoading: raiQuery.isLoading || instansiQuery.isLoading || lokasiQuery.isLoading,
    error: raiQuery.error || instansiQuery.error || lokasiQuery.error,
    
    // RAI API
    addRai: (data: Omit<Rai, 'id'>, options?: any) => addRaiMutation.mutate(data, options),
    updateRai: (id: string, data: Partial<Rai>, options?: any) => updateRaiMutation.mutate({ id, data }, options),
    deleteRai: (id: string, options?: any) => deleteRaiMutation.mutate(id, options),
    isAddingRai: addRaiMutation.isPending,
    isUpdatingRai: updateRaiMutation.isPending,
    isDeletingRai: deleteRaiMutation.isPending,
    
    // Instansi API
    addInstansi: (data: Omit<Instansi, 'id'>, options?: any) => addInstansiMutation.mutate(data, options),
    updateInstansi: (id: string, data: Partial<Instansi>, options?: any) => updateInstansiMutation.mutate({ id, data }, options),
    deleteInstansi: (id: string, options?: any) => deleteInstansiMutation.mutate(id, options),
    isAddingInstansi: addInstansiMutation.isPending,
    isUpdatingInstansi: updateInstansiMutation.isPending,
    isDeletingInstansi: deleteInstansiMutation.isPending,

    // Lokasi API
    addLokasi: (data: Omit<Lokasi, 'id'>, options?: any) => addLokasiMutation.mutate(data, options),
    updateLokasi: (id: string, data: Partial<Lokasi>, options?: any) => updateLokasiMutation.mutate({ id, data }, options),
    deleteLokasi: (id: string, options?: any) => deleteLokasiMutation.mutate(id, options),
    isAddingLokasi: addLokasiMutation.isPending,
    isUpdatingLokasi: updateLokasiMutation.isPending,
    isDeletingLokasi: deleteLokasiMutation.isPending,
  };
}
