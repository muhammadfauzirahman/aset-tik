import { useState, useCallback } from 'react';

/**
 * A reusable hook for managing CRUD modal states and form lifecycle.
 * @template T The type of the asset being managed.
 * @returns An object containing modal states and handlers.
 */
export function useAssetCRUD<T extends { id: string }>() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [detailItem, setDetailItem] = useState<T | null>(null);

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: T) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  }, []);

  const openDetailModal = useCallback((item: T) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setEditingItem(null);
    setDetailItem(null);
  }, []);

  return {
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    editingItem,
    detailItem,
    openAddModal,
    openEditModal,
    openDetailModal,
    closeModals,
    // Direct setters if needed for edge cases
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDetailModalOpen,
  };
}
