-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT DEFAULT 'viewer',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "idToken" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rai" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kodeRai" TEXT NOT NULL,
    "namaPusat" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Instansi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaInstansi" TEXT NOT NULL,
    "singkatan" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lokasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaLokasi" TEXT NOT NULL,
    "tipeLokasi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FasilitasKomputasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kodeFasilitas" TEXT NOT NULL,
    "namaFasilitas" TEXT NOT NULL,
    "jenisFasilitas" TEXT NOT NULL,
    "bandwidthIntranet" INTEGER NOT NULL DEFAULT 0,
    "bandwidthInternet" INTEGER NOT NULL DEFAULT 0,
    "lokasiFisik" TEXT NOT NULL,
    "klasifikasiTier" TEXT,
    "kepemilikan" TEXT NOT NULL,
    "sistemPengamanan" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "instansiId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FasilitasKomputasi_instansiId_fkey" FOREIGN KEY ("instansiId") REFERENCES "Instansi" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PerangkatKeras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kategori" TEXT NOT NULL,
    "kodeAset" TEXT NOT NULL,
    "namaPerangkat" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "pemilik" TEXT NOT NULL,
    "unitPengelola" TEXT NOT NULL,
    "statusKepemilikan" TEXT NOT NULL,
    "kapasitasMemori" TEXT,
    "kapasitasPenyimpanan" TEXT,
    "teknologiProsesor" TEXT,
    "teknikPenyimpanan" TEXT,
    "tipePerangkat" TEXT,
    "metodeAkses" TEXT,
    "lokasiPenempatan" TEXT,
    "fasilitasId" INTEGER,
    "instansiId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PerangkatKeras_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES "FasilitasKomputasi" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PerangkatKeras_instansiId_fkey" FOREIGN KEY ("instansiId") REFERENCES "Instansi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LayananDigital" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kategori" TEXT NOT NULL,
    "kodeAset" TEXT NOT NULL,
    "namaLayanan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "pemilik" TEXT NOT NULL,
    "pengelola" TEXT NOT NULL,
    "statusKepemilikan" TEXT NOT NULL,
    "biayaLayanan" REAL,
    "jangkaWaktu" TEXT,
    "jenisLisensi" TEXT,
    "validitasLisensi" TEXT,
    "tipeSoftware" TEXT,
    "fasilitasId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LayananDigital_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES "FasilitasKomputasi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Konektivitas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kategori" TEXT NOT NULL,
    "kodeAset" TEXT NOT NULL,
    "namaJaringan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "pemilik" TEXT NOT NULL,
    "statusKepemilikan" TEXT NOT NULL,
    "jenisJaringan" TEXT,
    "bandwidth" INTEGER,
    "tipeMedia" TEXT,
    "fasilitasId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Konektivitas_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES "FasilitasKomputasi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Rai_kodeRai_key" ON "Rai"("kodeRai");

-- CreateIndex
CREATE UNIQUE INDEX "Instansi_singkatan_key" ON "Instansi"("singkatan");

-- CreateIndex
CREATE UNIQUE INDEX "FasilitasKomputasi_kodeFasilitas_key" ON "FasilitasKomputasi"("kodeFasilitas");

-- CreateIndex
CREATE UNIQUE INDEX "PerangkatKeras_kodeAset_key" ON "PerangkatKeras"("kodeAset");

-- CreateIndex
CREATE UNIQUE INDEX "LayananDigital_kodeAset_key" ON "LayananDigital"("kodeAset");

-- CreateIndex
CREATE UNIQUE INDEX "Konektivitas_kodeAset_key" ON "Konektivitas"("kodeAset");
