import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { FasilitasKomputasi } from '../types';
import { useToast } from '../components/ui/Toast';

export function useFasilitas() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ['fasilitas-komputasi'],
    queryFn: () => api.get<{ success: boolean; data: FasilitasKomputasi[] }>('/fasilitas-komputasi'),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (newData: Omit<FasilitasKomputasi, 'id'>) =>
      api.post('/fasilitas-komputasi', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas-komputasi'] });
      toast.success('Fasilitas komputasi berhasil ditambahkan.');
    },
    onError: () => toast.error('Gagal menambahkan fasilitas.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FasilitasKomputasi> }) =>
      api.patch(`/fasilitas-komputasi/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas-komputasi'] });
      toast.success('Fasilitas komputasi berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui fasilitas.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/fasilitas-komputasi/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas-komputasi'] });
      toast.success('Fasilitas komputasi berhasil dihapus.');
    },
    onError: () => toast.error('Gagal menghapus fasilitas.')
  });

  return {
    fasilitas: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addFasilitas: (data: Omit<FasilitasKomputasi, 'id'>, options?: any) => createMutation.mutate(data, options),
    updateFasilitas: (id: string, data: Partial<FasilitasKomputasi>, options?: any) => updateMutation.mutate({ id, data }, options),
    deleteFasilitas: (id: string, options?: any) => deleteMutation.mutate(id, options),
    isAdding: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
