import { NavLink } from 'react-router-dom';

export function Sidebar() {
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
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r-[3px] border-[#1A1A1A] flex-col pt-16 z-40 hidden md:flex">
      <div className="p-6 border-b-2 border-black flex-shrink-0">
        <h2 className="font-mono font-black text-2xl">ASETI-TIK</h2>
        <p className="font-mono text-[10px] text-[#1A1A1A] opacity-70">SISTEM PENCATATAN ASET TIK</p>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
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
