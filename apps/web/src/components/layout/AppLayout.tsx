import { Outlet } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from "./Sidebar";
import { authClient } from "../../lib/auth-client";

// Memoize the UI tree to prevent re-renders unless essential props change
const MainContent = React.memo(({ toggleSidebar, isSidebarOpen, setIsSidebarOpen }: any) => {
  return (
    <div className="text-[#1A1A1A] font-body bg-[#F5F0E8] min-h-screen overflow-x-hidden">
      <TopNavbar onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[35] md:hidden transition-opacity cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="md:ml-64 pt-16 min-h-screen flex flex-col transition-all duration-300">
        <div className="flex-1 p-4 md:p-8">
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
});

export function AppLayout() {
  const { data: realSession, isPending } = authClient.useSession();
  const [hasVerifiedSession, setHasVerifiedSession] = useState(false);

  useEffect(() => {
    // HARD LOCK: Once session is verified, we NEVER go back to isPending state for the UI tree.
    if (!isPending && realSession) {
      setHasVerifiedSession(true);
    }
  }, [isPending, realSession]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Lock scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        const hasActiveModals = document.querySelectorAll('.modal-root').length > 0;
        if (!hasActiveModals) {
          document.body.style.overflow = '';
        }
      }, 0);
    }
  }, [isSidebarOpen]);

  // Modal Stability: Prevent unmounting while session re-validates in background.
  if (isPending && !hasVerifiedSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="font-mono font-bold text-2xl animate-pulse text-[#1A1A1A] p-4 border-[4px] border-[#1A1A1A] bg-[#FFD600] shadow-[8px_8px_0px_0px_#1A1A1A]">
          MEMUAT SESI...
        </div>
      </div>
    );
  }

  return (
    <MainContent 
      toggleSidebar={toggleSidebar} 
      isSidebarOpen={isSidebarOpen} 
      setIsSidebarOpen={setIsSidebarOpen} 
    />
  );
}

