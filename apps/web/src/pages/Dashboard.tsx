import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Alert Banner */}
      <div className="bg-[#FF3366] border-[3px] border-[#1A1A1A] p-4 flex items-center justify-center shadow-[6px_6px_0px_0px_#1A1A1A]">
        <h3 className="font-mono font-bold text-white uppercase text-center text-lg">
          ⚠ 3 LISENSI AKAN BERAKHIR DALAM 30 HARI
        </h3>
      </div>
      
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card color="primary" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">PUSAT DATA AKTIF</p>
            <h2 className="text-4xl font-mono-bold mt-2">3 UNIT</h2>
            <div className="absolute top-4 right-4 text-[#FFD600]">
              <span className="material-symbols-outlined text-4xl" data-icon="apartment">apartment</span>
            </div>
          </CardContent>
        </Card>
        
        <Card color="secondary" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">SERVER & STORAGE</p>
            <h2 className="text-4xl font-mono-bold mt-2">78% <span className="text-xl">UTILISASI</span></h2>
            <div className="absolute top-4 right-4 text-[#00E5FF]">
              <span className="material-symbols-outlined text-4xl" data-icon="storage">storage</span>
            </div>
          </CardContent>
        </Card>
        
        <Card color="danger" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">LISENSI EXPIRING</p>
            <h2 className="text-4xl font-mono-bold mt-2">12 <span className="text-xl">LISENSI</span></h2>
            <div className="absolute top-4 right-4 text-[#FF3366]">
              <span className="material-symbols-outlined text-4xl" data-icon="verified">verified</span>
            </div>
          </CardContent>
        </Card>
        
        <Card color="accent" className="relative">
          <CardContent>
            <p className="font-mono font-bold text-xs uppercase opacity-60">BUDGET CLOUD</p>
            <h2 className="text-3xl font-mono-bold mt-2">Rp 1.2B</h2>
            <div className="absolute top-4 right-4 text-[#B388FF]">
              <span className="material-symbols-outlined text-4xl" data-icon="account_balance_wallet">account_balance_wallet</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Capacity Bar Charts */}
        <div className="lg:col-span-8 bg-white border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-col">
          <div className="bg-[#1A1A1A] p-3 border-b-[3px] border-[#1A1A1A]">
            <h4 className="text-white font-mono font-bold uppercase text-sm">Resource Allocation Index</h4>
          </div>
          <div className="p-8 space-y-8 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono font-bold uppercase text-sm">Storage Capacity</span>
                <span className="font-mono font-bold text-lg">820 TB / 1 PB</span>
              </div>
              <div className="h-10 w-full bg-[#EAE7E7] border-2 border-[#1A1A1A]">
                <div className="h-full bg-[#FFD600] diagonal-pattern border-r-2 border-[#1A1A1A]" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono font-bold uppercase text-sm">Compute Memory</span>
                <span className="font-mono font-bold text-lg">6.4 TB / 8 TB</span>
              </div>
              <div className="h-10 w-full bg-[#EAE7E7] border-2 border-[#1A1A1A]">
                <div className="h-full bg-[#00E5FF] diagonal-pattern border-r-2 border-[#1A1A1A]" style={{ width: '74%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono font-bold uppercase text-sm">Network Bandwidth</span>
                <span className="font-mono font-bold text-lg">8.2 Gbps / 10 Gbps</span>
              </div>
              <div className="h-10 w-full bg-[#EAE7E7] border-2 border-[#1A1A1A]">
                <div className="h-full bg-[#B388FF] diagonal-pattern border-r-2 border-[#1A1A1A]" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Layer Summary */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#FFD600] border-[3px] border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-xs uppercase bg-[#1A1A1A] text-white px-2 py-0.5">LAYER 01</span>
              <h3 className="font-mono font-black text-2xl mt-2">PHYSICAL INFRA</h3>
            </div>
            <div className="text-5xl font-mono font-black">242 <span className="text-xl">ASSETS</span></div>
          </div>
          <div className="bg-[#00E5FF] border-[3px] border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-xs uppercase bg-[#1A1A1A] text-white px-2 py-0.5">LAYER 02</span>
              <h3 className="font-mono font-black text-2xl mt-2">VIRTUALIZATION</h3>
            </div>
            <div className="text-5xl font-mono font-black">1.1K <span className="text-xl">NODES</span></div>
          </div>
          <div className="bg-[#B388FF] border-[3px] border-[#1A1A1A] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono font-bold text-xs uppercase bg-[#1A1A1A] text-white px-2 py-0.5">LAYER 03</span>
              <h3 className="font-mono font-black text-2xl mt-2">APPLICATION STACK</h3>
            </div>
            <div className="text-5xl font-mono font-black">56 <span className="text-xl">SERVICES</span></div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <Card>
        <div className="bg-[#1A1A1A] p-4 border-b-[3px] border-[#1A1A1A] flex justify-between items-center">
          <h4 className="text-white font-mono font-bold uppercase text-sm">Recent Asset Activities</h4>
          <Button size="sm">View All</Button>
        </div>
        <Table>
          <TableHead>
            <TableHeader>Asset ID</TableHeader>
            <TableHeader>Action</TableHeader>
            <TableHeader>Operator</TableHeader>
            <TableHeader className="text-right">Time</TableHeader>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono-bold">SRV-DC1-092</TableCell>
              <TableCell><Badge color="success">Maintenance Complete</Badge></TableCell>
              <TableCell>Admin TIK A</TableCell>
              <TableCell className="font-mono text-right text-sm">14:20:05</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono-bold">LCS-MSFT-E5-01</TableCell>
              <TableCell><Badge color="primary">Renewal Requested</Badge></TableCell>
              <TableCell>Procurement Dept</TableCell>
              <TableCell className="font-mono text-right text-sm">13:45:12</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono-bold">STG-NETAPP-A4</TableCell>
              <TableCell><Badge color="danger">Capacity Alert</Badge></TableCell>
              <TableCell>System Automated</TableCell>
              <TableCell className="font-mono text-right text-sm">12:10:30</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono-bold">VM-PROD-WEB-04</TableCell>
              <TableCell><Badge color="black">Reboot Successful</Badge></TableCell>
              <TableCell>Admin TIK B</TableCell>
              <TableCell className="font-mono text-right text-sm">11:55:00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
