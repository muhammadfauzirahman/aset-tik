import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Master Data', icon: 'database', path: '/master-data' },
    { name: 'Fasilitas Komputasi', icon: 'domain', path: '/fasilitas-komputasi' },
    { name: 'Sistem Integrasi', icon: 'hub', path: '/sistem-integrasi' },
    { name: 'Hardware', icon: 'developer_board', path: '/hardware' },
    { name: 'Platform & Cloud', icon: 'cloud', path: '/platform' },
    { name: 'Peta Arsitektur', icon: 'hub', path: '/arsitektur' },
    { name: 'Laporan', icon: 'description', path: '/laporan' },
  ];

  return (
    <aside className={`
      fixed left-0 top-0 h-full w-64 bg-white border-r-[3px] border-[#1A1A1A] 
      flex flex-col pt-16 z-40 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 md:flex
    `}>
      <div className="p-6 border-b-2 border-black flex-shrink-0 bg-[#FFD600] md:bg-white transition-colors">
        <div className="flex justify-between items-center md:block">
          <div>
            <h2 className="font-mono font-black text-2xl">ASETI-TIK</h2>
            <p className="font-mono text-[10px] text-[#1A1A1A] opacity-70">SISTEM PENCATATAN ASET TIK</p>
          </div>
          <button onClick={onClose} className="md:hidden text-[#1A1A1A] hover:bg-black/10 p-1">
            <span className="material-symbols-outlined font-black">close</span>
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) onClose();
            }}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 font-mono font-bold text-[13px] uppercase transition-none ${
                isActive
                  ? 'bg-[#FFD600] text-[#1A1A1A] border-l-[6px] border-l-black border-y-2 border-y-black'
                  : 'text-[#1A1A1A] border-b-2 border-black hover:bg-[#00E5FF]'
              }`
            }
          >
            <span className="material-symbols-outlined mr-3" data-icon={item.icon}>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
