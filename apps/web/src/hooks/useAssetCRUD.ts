import { useState, useCallback, useEffect } from 'react';

/**
 * A reusable hook for managing CRUD modal states and form lifecycle.
 * Uses LocalStorage to persist modal state across focus/auth resets.
 * @template T The type of the asset being managed.
 * @returns An object containing modal states and handlers.
 */
export function useAssetCRUD<T extends { id: string | number }>(persistenceKey?: string) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(() => {
    if (!persistenceKey) return false;
    return localStorage.getItem(`${persistenceKey}_add_open`) === 'true';
  });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(() => {
    if (!persistenceKey) return false;
    return localStorage.getItem(`${persistenceKey}_edit_open`) === 'true';
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(() => {
    if (!persistenceKey) return null;
    const saved = localStorage.getItem(`${persistenceKey}_editing_item`);
    return saved ? JSON.parse(saved) : null;
  });

  const [detailItem, setDetailItem] = useState<T | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (persistenceKey) {
      localStorage.setItem(`${persistenceKey}_add_open`, isAddModalOpen.toString());
      localStorage.setItem(`${persistenceKey}_edit_open`, isEditModalOpen.toString());
      localStorage.setItem(`${persistenceKey}_editing_item`, editingItem ? JSON.stringify(editingItem) : '');
    }
  }, [isAddModalOpen, isEditModalOpen, editingItem, persistenceKey]);

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
    if (persistenceKey) {
      localStorage.removeItem(`${persistenceKey}_add_open`);
      localStorage.removeItem(`${persistenceKey}_edit_open`);
      localStorage.removeItem(`${persistenceKey}_editing_item`);
    }
  }, [persistenceKey]);

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
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDetailModalOpen,
  };
}
