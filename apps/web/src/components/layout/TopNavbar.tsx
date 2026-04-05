import { authClient } from '../../lib/auth-client';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function TopNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: realSession, isPending } = authClient.useSession();
  
  // ... existing mock session ...
  const mockSession = {
    user: {
      id: 'mock-user-id',
      email: 'admin@aseti-tik.local',
      name: 'Administrator (Mock)',
      role: 'admin',
    },
    session: {
      id: 'mock-session-id',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      token: 'mock-token',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'mock-user-id',
    }
  };

  const session = realSession || mockSession;
  // Use session for logging or debugging if needed
  console.log('Current user:', session.user.name);

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
    <nav className="fixed top-0 left-0 flex justify-between items-center w-full px-4 md:px-6 h-16 z-50 bg-[#1A1A1A] border-b-[3px] border-[#FFD600] shadow-[0px_4px_10px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center w-10 h-10 text-[#FFD600] hover:bg-white/10 active:bg-white/20 transition-all rounded-none border-2 border-[#FFD600] shadow-[2px_2px_0_0_#000]"
        >
          <span className="material-symbols-outlined font-black">menu</span>
        </button>
        <div className="px-3 md:px-4 py-1 bg-[#1A1A1A] text-white font-mono font-bold text-lg md:text-xl uppercase border-2 border-white">
          ASETI-TIK
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-4 border-l-2 border-white pl-4 md:pl-6">
          <span className="material-symbols-outlined text-[#FFD600] cursor-pointer hidden sm:block" data-icon="notifications">notifications</span>
          <div className="w-8 h-8 bg-[#FFD600] border-2 border-white flex items-center justify-center font-mono font-bold text-[#1A1A1A] text-xs">
            TIK
          </div>
          
          <div className="hidden sm:flex flex-col items-end">
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
              className="uppercase font-mono font-bold text-[9px] md:text-[10px] py-1 h-auto disabled:opacity-50 border-2 border-white"
            >
              {isLoggingOut ? '...' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
