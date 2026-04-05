import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { PerangkatKeras } from '../types';
import { useToast } from '../components/ui/Toast';

export function useHardware() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ['hardware'],
    queryFn: () => api.get<{ success: boolean; data: PerangkatKeras[] }>('/perangkat-keras'),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (newHardware: Omit<PerangkatKeras, 'id'>) =>
      api.post('/perangkat-keras', newHardware),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hardware'] });
      toast.success('Aset perangkat keras berhasil ditambahkan.');
    },
    onError: (error: any) => toast.error(error.message || 'Gagal menambahkan perangkat keras.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PerangkatKeras> }) =>
      api.patch(`/perangkat-keras/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hardware'] });
      toast.success('Aset perangkat keras berhasil diperbarui.');
    },
    onError: (error: any) => toast.error(error.message || 'Gagal memperbarui perangkat keras.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/perangkat-keras/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hardware'] });
      toast.success('Aset perangkat keras berhasil dihapus.');
    },
    onError: (error: any) => toast.error(error.message || 'Gagal menghapus perangkat keras.')
  });

  return {
    hardware: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addHardware: (data: Omit<PerangkatKeras, 'id'>, options?: any) => createMutation.mutate(data, options),
    updateHardware: (id: string, data: Partial<PerangkatKeras>, options?: any) => updateMutation.mutate({ id, data }, options),
    deleteHardware: (id: string, options?: any) => deleteMutation.mutate(id, options),
    isAdding: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
