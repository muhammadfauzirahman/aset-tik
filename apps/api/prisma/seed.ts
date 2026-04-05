import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── RAI ──────────────────────────────────────────
  const raiData = [
    { kodeRai: "RAI.01", namaPusat: "Pusat Data Nasional" },
    { kodeRai: "RAI.02", namaPusat: "Pusat Komputasi Instansi" },
    { kodeRai: "RAI.03", namaPusat: "Pusat Kendali / Command Center" },
  ];

  for (const rai of raiData) {
    await prisma.rai.upsert({
      where: { kodeRai: rai.kodeRai },
      update: {},
      create: rai,
    });
  }
  console.log(`  ✓ RAI: ${raiData.length} records`);

  // ── Instansi ─────────────────────────────────────
  const instansiData = [
    {
      namaInstansi: "Kementerian Komunikasi dan Informatika",
      singkatan: "KOMINFO",
    },
    {
      namaInstansi: "Pemerintah Provinsi Jawa Timur",
      singkatan: "PEMPROV JATIM",
    },
  ];

  const instansiRecords: { id: number; singkatan: string }[] = [];
  for (const inst of instansiData) {
    const record = await prisma.instansi.upsert({
      where: { singkatan: inst.singkatan },
      update: {},
      create: inst,
    });
    instansiRecords.push({ id: record.id, singkatan: record.singkatan });
  }
  console.log(`  ✓ Instansi: ${instansiData.length} records`);

  const pemprovId =
    instansiRecords.find((i) => i.singkatan === "PEMPROV JATIM")?.id || 1;
  const kominfoId =
    instansiRecords.find((i) => i.singkatan === "KOMINFO")?.id || 2;

  // ── Lokasi ───────────────────────────────────────
  const lokasiData = [
    {
      namaLokasi: "PDN Cikarang",
      tipeLokasi: "Pusat Data",
      alamat: "Cikarang, Bekasi",
    },
    {
      namaLokasi: "Telkom Serpong",
      tipeLokasi: "Vendor Cloud",
      alamat: "Serpong, Banten",
    },
    {
      namaLokasi: "Gedung A Pemprov",
      tipeLokasi: "Pusat Data",
      alamat: "Jl. Pemuda No.1",
    },
  ];

  for (const lok of lokasiData) {
    const existing = await prisma.lokasi.findFirst({
      where: { namaLokasi: lok.namaLokasi },
    });
    if (!existing) {
      await prisma.lokasi.create({ data: lok });
    }
  }
  console.log(`  ✓ Lokasi: ${lokasiData.length} records`);

  // ── Fasilitas Komputasi ──────────────────────────
  const fasilitasData = [
    {
      kodeFasilitas: "DC-JTM-01",
      namaFasilitas: "Data Center Utama Jatim",
      jenisFasilitas: "Pusat Data",
      bandwidthIntranet: 10000,
      bandwidthInternet: 2000,
      lokasiFisik: "Gedung Diskominfo Prov Jatim",
      klasifikasiTier: "Tier 3",
      kepemilikan: "Sendiri",
      sistemPengamanan: "Biometric, CCTV 24/7, FM200 Fire Suppression",
      instansiId: pemprovId,
      status: "Aktif",
    },
    {
      kodeFasilitas: "CC-JTM-01",
      namaFasilitas: "Command Center Jatim",
      jenisFasilitas: "Pusat Kendali",
      bandwidthIntranet: 1000,
      bandwidthInternet: 500,
      lokasiFisik: "Gedung Negara Grahadi",
      klasifikasiTier: null,
      kepemilikan: "Sendiri",
      sistemPengamanan: "Access Card, Security Guard",
      instansiId: pemprovId,
      status: "Aktif",
    },
    {
      kodeFasilitas: "DC-TLKM-01",
      namaFasilitas: "Cloud Backup Telkom",
      jenisFasilitas: "Pusat Data",
      bandwidthIntranet: 0,
      bandwidthInternet: 5000,
      lokasiFisik: "Telkom Sigma Rungkut",
      klasifikasiTier: "Tier 4",
      kepemilikan: "Pihak Ketiga",
      sistemPengamanan: "Enterprise Grade",
      instansiId: kominfoId,
      status: "Aktif",
    },
  ];

  for (const fas of fasilitasData) {
    await prisma.fasilitasKomputasi.upsert({
      where: { kodeFasilitas: fas.kodeFasilitas },
      update: {},
      create: fas,
    });
  }
  console.log(`  ✓ Fasilitas Komputasi: ${fasilitasData.length} records`);

  const dcJtmId = (await prisma.fasilitasKomputasi.findUnique({ where: { kodeFasilitas: "DC-JTM-01" } }))?.id || 1;
  const ccJtmId = (await prisma.fasilitasKomputasi.findUnique({ where: { kodeFasilitas: "CC-JTM-01" } }))?.id || 2;

  // ── Perangkat Keras ──────────────────────────────
  const hardwareData = [
    {
      kategori: "Server",
      kodeAset: "SRV-DL380-01",
      namaPerangkat: "HP ProLiant DL380P Gen8",
      deskripsi: "Server Untuk Aplikasi Utama e-Kinerja",
      pemilik: "Pemprov Jatim",
      unitPengelola: "Bidang TIK",
      statusKepemilikan: "Sendiri",
      kapasitasMemori: "64 GB",
      kapasitasPenyimpanan: "1 TB",
      teknologiProsesor: "Intel Xeon",
      teknikPenyimpanan: "RAID 1",
      fasilitasId: dcJtmId,
      instansiId: pemprovId,
    },
    {
      kategori: "Jaringan",
      kodeAset: "NET-SW-01",
      namaPerangkat: "Cisco Catalyst 2960",
      deskripsi: "Switch Distribusi Lantai 2",
      pemilik: "Pemprov Jatim",
      unitPengelola: "Bidang TIK",
      statusKepemilikan: "Sendiri",
      tipePerangkat: "Switch",
      fasilitasId: dcJtmId,
      instansiId: pemprovId,
    },
    {
      kategori: "Keamanan",
      kodeAset: "SEC-FW-01",
      namaPerangkat: "FortiGate 200E",
      deskripsi: "Firewall Utama DC",
      pemilik: "Pemprov Jatim",
      unitPengelola: "Bidang TIK",
      statusKepemilikan: "Sendiri",
      tipePerangkat: "Firewall",
      fasilitasId: dcJtmId,
      instansiId: pemprovId,
    }
  ];

  for (const hw of hardwareData) {
    await prisma.perangkatKeras.upsert({
      where: { kodeAset: hw.kodeAset },
      update: {},
      create: hw,
    });
  }
  console.log(`  ✓ Perangkat Keras: ${hardwareData.length} records`);

  // ── Layanan Digital ──────────────────────────────
  const layananData = [
    {
      kategori: "Cloud",
      kodeAset: "CLD-AWS-01",
      namaLayanan: "AWS EC2 Production",
      deskripsi: "Hosting Aplikasi Mobile",
      pemilik: "Amazon Inc",
      pengelola: "Bidang TIK",
      statusKepemilikan: "Sewa",
      biayaLayanan: 15000000,
      jangkaWaktu: "Bulanan",
      fasilitasId: dcJtmId,
    },
    {
      kategori: "Software",
      kodeAset: "SW-ORA-01",
      namaLayanan: "Oracle Database Enterprise",
      deskripsi: "Lisensi Database Keuangan",
      pemilik: "Oracle Corp",
      pengelola: "Bidang TIK",
      statusKepemilikan: "Lisensi",
      jenisLisensi: "Tahunan",
      tipeSoftware: "Database",
      fasilitasId: dcJtmId,
    }
  ];

  for (const lay of layananData) {
    await prisma.layananDigital.upsert({
      where: { kodeAset: lay.kodeAset },
      update: {},
      create: lay,
    });
  }
  console.log(`  ✓ Layanan Digital: ${layananData.length} records`);

  // ── Konektivitas ─────────────────────────────────
  const konektivitasData = [
    {
      kategori: "Jaringan Intra",
      kodeAset: "NET-INTRA-01",
      namaJaringan: "Internet Fiber 1 Gbps",
      deskripsi: "Main ISP Telkom",
      pemilik: "Telkom",
      statusKepemilikan: "Sewa",
      jenisJaringan: "Dedicated",
      bandwidth: "1 Gbps",
      tipeMedia: "Fiber Optic",
      fasilitasId: dcJtmId,
    },
    {
      kategori: "SPLP",
      kodeAset: "NET-SPLP-01",
      namaJaringan: "VPN SKPD",
      deskripsi: "Konektivitas antar SKPD",
      pemilik: "Pemprov Jatim",
      statusKepemilikan: "Sendiri",
      tipeMedia: "Intranet",
      fasilitasId: dcJtmId,
    }
  ];

  for (const kon of konektivitasData) {
    await prisma.konektivitas.upsert({
      where: { kodeAset: kon.kodeAset },
      update: {},
      create: kon,
    });
  }
  console.log(`  ✓ Konektivitas: ${konektivitasData.length} records`);

  console.log("\n✅ Seeding complete!");
  console.log("\n📝 Note: Register an admin user via POST /api/auth/sign-up/email,");
  console.log("   then use Prisma Studio to set their role to 'admin'.");
  console.log("   Or run: npx prisma studio");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
