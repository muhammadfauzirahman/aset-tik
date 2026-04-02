import { Outlet, Navigate } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { authClient } from '../../lib/auth-client';

export function AppLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="font-mono font-bold text-2xl animate-pulse text-[#1A1A1A] p-4 border-[4px] border-[#1A1A1A] bg-[#FFD600] shadow-[8px_8px_0px_0px_#1A1A1A]">
          MEMUAT SESI...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="text-[#1A1A1A] font-body bg-[#F5F0E8] min-h-screen">
      <TopNavbar />
      <Sidebar />
      <main className="md:ml-64 pt-16 min-h-screen flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        {/* Footer */}
        <footer className="w-full py-4 px-8 flex justify-between items-center bg-[#F5F0E8] border-t-[3px] border-[#1A1A1A] mt-12">
          <div className="font-mono font-bold text-xs text-[#1A1A1A]">POWERED BY KERANGKA SPBE</div>
          <div className="flex gap-6">
            <a className="text-[#1A1A1A] font-body text-xs hover:underline decoration-2" href="#">Documentation</a>
            <a className="text-[#1A1A1A] font-body text-xs hover:underline decoration-2" href="#">System Status</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

