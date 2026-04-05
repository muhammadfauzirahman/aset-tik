import { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';

// Hooks
import { useHardware } from '../hooks/useHardware';
import { useLayananDigital } from '../hooks/useLayananDigital';
import { useFasilitas } from '../hooks/useFasilitas';
import { useKonektivitas } from '../hooks/useKonektivitas';

// ─── Types ──────────────────────────────────────────
interface MapNode {
  id: string;
  label: string;
  type: string;
  icon: string;
  tier: 'upstream' | 'center' | 'downstream';
  color: string;
}

// ─── Brutalist Node Component ───────────────────────
function BrutalNode({ node, isCenter }: { node: MapNode; isCenter?: boolean }) {
  return (
    <div
      className={`px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[160px] max-w-[220px] ${node.color} ${isCenter ? 'ring-4 ring-[#FFD600] scale-105' : ''}`}
    >
      <div className="flex items-center space-x-2">
        <span className="material-symbols-outlined text-xl text-black font-black">{node.icon}</span>
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[9px] uppercase opacity-60 leading-none tracking-widest text-black">{node.type}</span>
          <span className="font-mono font-bold text-xs uppercase truncate text-black">{node.label}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────
export function PetaArsitektur() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { hardware, isLoading: isHwLoading } = useHardware();
  const { layananDigital: software, isLoading: isSwLoading } = useLayananDigital();
  const { fasilitas, isLoading: isFasLoading } = useFasilitas();
  const { konektivitas, isLoading: isKonLoading } = useKonektivitas();

  const isLoading = isHwLoading || isSwLoading || isFasLoading || isKonLoading;

  // Combine all assets for selection
  const allAssets = useMemo(() => [
    ...hardware.map(h => ({ id: h.id, label: h.namaPerangkat, type: 'Hardware', icon: 'developer_board' })),
    ...software.map(s => ({ id: s.id, label: s.namaLayanan, type: s.kategori, icon: s.kategori === 'Cloud' ? 'cloud' : 'hub' })),
    ...konektivitas.map(k => ({ id: k.id, label: k.namaJaringan, type: k.kategori, icon: 'settings_input_component' })),
  ], [hardware, software, konektivitas]);

  // Build 3-tier map
  const { upstreamNodes, centerNode, downstreamNodes } = useMemo(() => {
    if (!selectedId) return { upstreamNodes: [] as MapNode[], centerNode: null as MapNode | null, downstreamNodes: [] as MapNode[] };

    const center = allAssets.find(a => a.id === selectedId);
    if (!center) return { upstreamNodes: [] as MapNode[], centerNode: null as MapNode | null, downstreamNodes: [] as MapNode[] };

    const cNode: MapNode = {
      id: center.id, label: center.label, type: center.type,
      icon: center.icon, tier: 'center', color: 'bg-[#FFD600]'
    };

    const upstream: MapNode[] = [];
    const downstream: MapNode[] = [];

    const centerHw = hardware.find(h => h.id === selectedId);
    const centerSw = software.find(s => s.id === selectedId);

    // TIER 1 — Upstream: Fasilitas
    const fasId = centerHw?.fasilitasId || centerSw?.fasilitasId;
    if (fasId) {
      const fas = fasilitas.find(f => f.id === fasId);
      if (fas) upstream.push({ id: fas.id, label: fas.namaFasilitas, type: 'Fasilitas (Host)', icon: 'domain', tier: 'upstream', color: 'bg-[#00E5FF]' });
    }

    // Upstream: Cloud dependency (for Platform software)
    if (centerSw?.cloudDependencyId) {
      const cld = software.find(s => s.id === centerSw.cloudDependencyId);
      if (cld) upstream.push({ id: cld.id, label: cld.namaLayanan, type: 'Cloud Provider', icon: 'cloud', tier: 'upstream', color: 'bg-[#A8FF00]' });
    }

    // Upstream: Network device (for hardware)
    if (centerHw?.perangkatJaringanId) {
      const net = hardware.find(h => h.id === centerHw.perangkatJaringanId);
      if (net) upstream.push({ id: net.id, label: net.namaPerangkat, type: 'Network Device', icon: 'router', tier: 'upstream', color: 'bg-[#A8FF00]' });
    }

    // TIER 3 — Downstream: Software that depends on this
    software.forEach(s => {
      if (s.id === selectedId) return;
      if (s.cloudDependencyId === selectedId || s.hardwareServerId === selectedId) {
        downstream.push({ id: s.id, label: s.namaLayanan, type: 'Software Layer', icon: 'apps', tier: 'downstream', color: 'bg-[#FF5252] text-white' });
      }
    });

    // Downstream: Hardware that depends on this (as network switch)
    hardware.forEach(h => {
      if (h.id === selectedId) return;
      if (h.perangkatJaringanId === selectedId) {
        downstream.push({ id: h.id, label: h.namaPerangkat, type: 'HW Dependent', icon: 'settings_input_hdmi', tier: 'downstream', color: 'bg-white' });
      }
    });

    return { upstreamNodes: upstream, centerNode: cNode, downstreamNodes: downstream };
  }, [selectedId, hardware, software, fasilitas, allAssets]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl font-black uppercase animate-pulse italic">Membangun Peta Arsitektur...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="p-6 pb-0">
        <PageHeader
          title="Peta Arsitektur"
          subtitle="Visualisasi keterhubungan antar aset infrastruktur TIK (Dependency Map)."
          icon="hub"
        />
      </div>

      <div className="flex-1 p-6 gap-6 grid grid-cols-4 min-h-0">
        {/* Sidebar Selector */}
        <Card className="col-span-1 border-4 border-black shadow-[8px_8px_0px_0px_#1A1A1A] bg-white overflow-hidden flex flex-col">
          <div className="p-4 bg-black text-white font-mono font-bold text-xs uppercase text-center">
            Pilih Aset Utama
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50">
            {allAssets.length === 0 && (
              <p className="text-xs font-mono text-center py-8 opacity-50 italic">Belum ada data aset.</p>
            )}
            {allAssets.map(asset => (
              <button
                key={asset.id}
                onClick={() => setSelectedId(asset.id)}
                className={`w-full text-left px-3 py-2 border-2 border-black font-mono text-[11px] uppercase transition-all ${
                  selectedId === asset.id
                    ? 'bg-[#FFD600] translate-x-1 shadow-[2px_2px_0px_0px_#000] font-black'
                    : 'bg-white hover:bg-[#00E5FF] hover:translate-x-1'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-sm font-black">{asset.icon}</span>
                  <span className="truncate">{asset.label}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Viewport — 3 Tier Map */}
        <Card className="col-span-3 border-4 border-black shadow-[12px_12px_0px_0px_#1A1A1A] bg-[#F5F5F0] relative overflow-auto pattern-grid">
          {!selectedId ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <span className="material-symbols-outlined text-8xl opacity-20 animate-bounce">account_tree</span>
              <div>
                <h3 className="font-mono font-black text-2xl uppercase italic">Silakan Pilih Aset</h3>
                <p className="font-mono text-sm opacity-60">Pilih salah satu aset di samping untuk melihat garis keterhubungan infrastrukturnya.</p>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-0 min-h-full flex flex-col items-center relative z-10">
              {/* TIER LABEL: Upstream */}
              {upstreamNodes.length > 0 && (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#00E5FF] border-2 border-black px-2 py-0.5 font-mono font-bold text-[10px] uppercase shadow-[2px_2px_0_0_#000]">
                      TIER 1 — Fasilitas & Host
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-black" />
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {upstreamNodes.map(node => (
                      <BrutalNode key={node.id} node={node} />
                    ))}
                  </div>
                </div>
              )}

              {/* CONNECTOR LINES */}
              {upstreamNodes.length > 0 && (
                <div className="flex flex-col items-center py-2">
                  <div className="w-1 h-6 bg-black" />
                  <div className="w-4 h-4 border-4 border-black bg-[#FFD600] rotate-45" />
                  <div className="w-1 h-6 bg-black" />
                </div>
              )}

              {/* TIER LABEL: Center */}
              {centerNode && (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#FFD600] border-2 border-black px-2 py-0.5 font-mono font-bold text-[10px] uppercase shadow-[2px_2px_0_0_#000]">
                      TIER 2 — Aset Utama (Fokus)
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-black" />
                  </div>
                  <div className="flex justify-center">
                    <BrutalNode node={centerNode} isCenter />
                  </div>
                </div>
              )}

              {/* CONNECTOR LINES */}
              {downstreamNodes.length > 0 && (
                <div className="flex flex-col items-center py-2">
                  <div className="w-1 h-6 bg-black" />
                  <div className="w-4 h-4 border-4 border-black bg-[#FF5252] rotate-45" />
                  <div className="w-1 h-6 bg-black" />
                </div>
              )}

              {/* TIER LABEL: Downstream */}
              {downstreamNodes.length > 0 && (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#FF5252] text-white border-2 border-black px-2 py-0.5 font-mono font-bold text-[10px] uppercase shadow-[2px_2px_0_0_#000]">
                      TIER 3 — Dependensi & Sistem
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-black" />
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {downstreamNodes.map(node => (
                      <BrutalNode key={node.id} node={node} />
                    ))}
                  </div>
                </div>
              )}

              {/* No connections message */}
              {upstreamNodes.length === 0 && downstreamNodes.length === 0 && (
                <div className="mt-8 border-4 border-black p-8 text-center bg-white shadow-[6px_6px_0_0_#000]">
                  <span className="material-symbols-outlined text-4xl opacity-30 text-black font-black">link_off</span>
                  <p className="font-mono text-sm uppercase mt-2 font-black italic">
                    Aset ini belum memiliki relasi dependensi yang tercatat.
                  </p>
                </div>
              )}

              {/* Legend */}
              <div className="mt-12 w-full border-t-4 border-black pt-6 bg-white p-4 border-2 shadow-[4px_4px_0_0_#000]">
                <h4 className="font-mono font-black text-xs uppercase mb-3 text-black italic">Legenda Peta Arsitektur</h4>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#00E5FF] border-2 border-black" /><span className="font-mono text-[10px] uppercase font-bold">Fasilitas/Host</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#A8FF00] border-2 border-black" /><span className="font-mono text-[10px] uppercase font-bold">Cloud/Network</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#FFD600] border-2 border-black" /><span className="font-mono text-[10px] uppercase font-bold">Aset Fokus</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#FF5252] border-2 border-black" /><span className="font-mono text-[10px] uppercase font-bold">Software Layer</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border-2 border-black" /><span className="font-mono text-[10px] uppercase font-bold">HW Dependent</span></div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
