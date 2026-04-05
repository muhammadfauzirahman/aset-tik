import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Konektivitas } from '../types';
import { useToast } from '../components/ui/Toast';

export function useKonektivitas() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ['konektivitas'],
    queryFn: () => api.get<{ success: boolean; data: Konektivitas[] }>('/konektivitas'),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (newData: Omit<Konektivitas, 'id'>) =>
      api.post('/konektivitas', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['konektivitas'] });
      toast.success('Aset konektivitas berhasil ditambahkan.');
    },
    onError: () => toast.error('Gagal menambahkan konektivitas.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Konektivitas> }) =>
      api.patch(`/konektivitas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['konektivitas'] });
      toast.success('Aset konektivitas berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui konektivitas.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/konektivitas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['konektivitas'] });
      toast.success('Aset konektivitas berhasil dihapus.');
    },
    onError: () => toast.error('Gagal menghapus konektivitas.')
  });

  return {
    konektivitas: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addKonektivitas: (data: Omit<Konektivitas, 'id'>, options?: any) => createMutation.mutate(data, options),
    updateKonektivitas: (id: string, data: Partial<Konektivitas>, options?: any) => updateMutation.mutate({ id, data }, options),
    deleteKonektivitas: (id: string, options?: any) => deleteMutation.mutate(id, options),
    isAdding: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
