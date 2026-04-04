import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MasterData } from './pages/MasterData';
import { FasilitasKomputasiPage } from './pages/FasilitasKomputasi';
import { Login } from './pages/Login';
import { SistemIntegrasi } from './pages/SistemIntegrasi';
import { Hardware } from './pages/Hardware';
import { PlatformCloud } from './pages/PlatformCloud';
import { Laporan } from './pages/Laporan';
import { PetaArsitektur } from './pages/PetaArsitektur';

function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
      <h1 className="text-8xl font-mono font-black animate-pulse text-[#FFD600] drop-shadow-[4px_4px_0px_#1A1A1A] border-4 border-[#1A1A1A] bg-white p-4">
        404 / WIP
      </h1>
      <p className="text-2xl font-mono font-bold uppercase bg-[#FF3366] text-white p-2 border-2 border-[#1A1A1A] shadow-[4px_4px_0_0_#1A1A1A]">
        Halaman Belum Tersedia
      </p>
      <p className="font-body opacity-80 max-w-md">
        Modul ini sedang dalam tahap konstruksi dan belum diimplementasikan pada sprint ini.
      </p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="master-data" element={<MasterData />} />
        <Route path="fasilitas-komputasi" element={<FasilitasKomputasiPage />} />
        <Route path="sistem-integrasi" element={<SistemIntegrasi />} />
        <Route path="hardware" element={<Hardware />} />
        <Route path="platform" element={<PlatformCloud />} />
        <Route path="laporan" element={<Laporan />} />
        <Route path="arsitektur" element={<PetaArsitektur />} />
        <Route path="*" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
}

export default App;
