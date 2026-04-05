import { useState, useMemo } from 'react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface UseTableOptions<T> {
  data: T[];
  initialPageSize?: number;
  searchFields?: (keyof T)[];
}

export function useTable<T extends Record<string, any>>({ 
  data, 
  initialPageSize = 10,
  searchFields 
}: UseTableOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. Filter Data (Search)
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(item => {
      // If searchFields are provided, only search those
      const fieldsToSearch = searchFields || (Object.keys(item) as (keyof T)[]);
      
      return fieldsToSearch.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    const items = [...filteredData];
    if (sortConfig !== null) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [filteredData, sortConfig]);

  // 3. Paginate Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handlers
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const exportToCSV = (filename: string = 'export.csv') => {
    if (sortedData.length === 0) return;

    // Get headers from the first item
    const headers = Object.keys(sortedData[0]).filter(k => k !== 'id').join(',');
    const rows = sortedData.map(item => {
      return Object.entries(item)
        .filter(([key]) => key !== 'id')
        .map(([, value]) => {
          // Escape quotes and wrap in quotes if contains comma
          const strValue = String(value ?? '').replace(/"/g, '""');
          return strValue.includes(',') ? `"${strValue}"` : strValue;
        })
        .join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    // Data
    paginatedData,
    fullSortedData: sortedData,
    
    // Search
    searchQuery,
    setSearchQuery: handleSearch,
    
    // Sort
    sortConfig,
    requestSort,
    
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems: sortedData.length,
    
    // Actions
    exportToCSV
  };
}
