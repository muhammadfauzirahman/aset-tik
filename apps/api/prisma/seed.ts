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
