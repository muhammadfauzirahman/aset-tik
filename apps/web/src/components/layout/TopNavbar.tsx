import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { Button } from '../ui/Button';

export function TopNavbar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    console.log('Attempting to logout...');
    
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
             console.log('Logout successful');
             setIsLoggingOut(false);
             window.location.href = '/dashboard';
          },
          onError: (ctx) => {
             console.error('Logout error context:', ctx);
             setIsLoggingOut(false);
          }
        }
      });
    } catch (error) {
      console.error('Logout failed Exception:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 flex justify-between items-center w-full px-6 h-16 z-50 bg-[#1A1A1A] border-b-[3px] border-[#FFD600] shadow-[6px_6px_0px_0px_#1A1A1A]">
      <div className="px-4 py-1 bg-[#1A1A1A] text-white font-mono font-bold text-xl uppercase border-2 border-white">
        ASETI-TIK
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `font-mono text-sm uppercase transition-none ${isActive ? 'text-[#FFD600] font-bold underline decoration-[3px]' : 'text-white hover:bg-[#FFD600] hover:text-[#1A1A1A]'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/master-data" 
            className={({ isActive }) => 
              `font-mono text-sm uppercase transition-none ${isActive ? 'text-[#FFD600] font-bold underline decoration-[3px]' : 'text-white hover:bg-[#FFD600] hover:text-[#1A1A1A]'}`
            }
          >
            Master Data
          </NavLink>
          <a className="text-white uppercase font-mono text-sm hover:bg-[#FFD600] hover:text-[#1A1A1A] transition-none" href="#">Infrastruktur</a>
        </div>
        <div className="flex items-center gap-4 border-l-2 border-white pl-6">
          <span className="material-symbols-outlined text-[#FFD600] cursor-pointer" data-icon="notifications">notifications</span>
          <div className="w-8 h-8 bg-[#FFD600] border-2 border-white flex items-center justify-center font-mono font-bold text-[#1A1A1A]">
            TIK
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[#FFD600] font-mono text-[10px] uppercase font-bold">
              {isPending ? 'Loading...' : session?.user ? session.user.email : 'No Active Session'}
            </span>
          </div>

          {session?.user && (
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="uppercase font-mono font-bold text-[10px] py-1 h-auto disabled:opacity-50"
            >
              {isLoggingOut ? '...' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
