import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LayananDigital } from '../types';
import { useToast } from '../components/ui/Toast';

export function useLayananDigital() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ['layanan-digital'],
    queryFn: () => api.get<{ success: boolean; data: LayananDigital[] }>('/layanan-digital'),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (newData: Omit<LayananDigital, 'id'>) =>
      api.post('/layanan-digital', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layanan-digital'] });
      toast.success('Layanan digital/cloud berhasil ditambahkan.');
    },
    onError: (error: any) => toast.error(error.message || 'Gagal menambahkan layanan digital.')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LayananDigital> }) =>
      api.patch(`/layanan-digital/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layanan-digital'] });
      toast.success('Layanan digital/cloud berhasil diperbarui.');
    },
    onError: (error: any) => toast.error(error.message || 'Gagal memperbarui layanan digital.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/layanan-digital/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layanan-digital'] });
      toast.success('Layanan digital/cloud berhasil dihapus.');
    },
    onError: (error: any) => toast.error(error.message || 'Gagal menghapus layanan digital.')
  });

  return {
    layananDigital: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addLayananDigital: (data: Omit<LayananDigital, 'id'>, options?: any) => createMutation.mutate(data, options),
    updateLayananDigital: (id: string, data: Partial<LayananDigital>, options?: any) => updateMutation.mutate({ id, data }, options),
    deleteLayananDigital: (id: string, options?: any) => deleteMutation.mutate(id, options),
    isAdding: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
