import { Button } from './Button';

interface TableControlsProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onExport: () => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function TableControls({ 
  onSearch, 
  searchQuery, 
  onExport, 
  pageSize, 
  onPageSizeChange 
}: TableControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">
      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1A1A1A] opacity-40">
            search
          </span>
          <input
            type="text"
            placeholder="Cari data..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F0E8] border-[3px] border-[#1A1A1A] font-mono font-bold text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFD600]/30 transition-all placeholder:italic"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="font-mono text-xs font-black uppercase whitespace-nowrap">Tampilkan:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-white border-[3px] border-[#1A1A1A] font-mono font-bold text-xs p-1 px-2 focus:ring-4 focus:ring-[#FFD600]/30 outline-none cursor-pointer"
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>{size} Baris</option>
          ))}
        </select>

        <div className="h-8 w-[2px] bg-[#1A1A1A] mx-1 hidden sm:block"></div>

        <Button 
          onClick={onExport} 
          variant="secondary" 
          size="sm" 
          className="font-mono font-black italic text-[10px] uppercase border-[#1A1A1A] bg-[#B9FF66] text-[#1A1A1A] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-px"
        >
          <span className="material-symbols-outlined text-sm mr-1">download</span>
          Ekspor CSV
        </Button>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 p-4 bg-white border-[4px] border-[#1A1A1A]">
      <div className="font-mono text-xs font-black uppercase text-[#1A1A1A]">
        Halaman <span className="text-[#007AFF] bg-[#007AFF]/10 px-2 border-2 border-[#007AFF]">{currentPage}</span> Dari <span className="bg-[#1A1A1A]/5 px-2 border-2 border-[#1A1A1A]">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 border-[3px] border-[#1A1A1A] bg-white hover:bg-[#FFD600] disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined font-black">chevron_left</span>
        </button>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 border-[3px] border-[#1A1A1A] bg-white hover:bg-[#FFD600] disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined font-black">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
