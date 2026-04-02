# Struktur Data & Sampel Aset Infrastruktur TIK (SPBE)

Dokumen ini berfungsi sebagai **context file** yang dapat Anda *mention* di IDE (seperti Cursor, Copilot, atau Antigravity) untuk memberikan pemahaman menyeluruh kepada AI mengenai struktur tabel, nama kolom, relasi, dan sampel data nyata dari sistem manajemen aset TIK yang akan dibangun.

---

## 🗄️ Tabel / Entitas: Komputasi Awan

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Komputasi Awan.csv`

### 📝 Struktur Kolom
- `Nama Government Cloud`
- `Deskripsi Government Cloud`
- `Nama Pemilik`
- `Biaya Layanan`
- `Tipe Goverment Cloud`
- `Status Kepemilikkan`
- `Unit Pengembang Government Cloud`
- `→ Unit Operasional Government Cloud (Dependency)`
- `→ Edukasi Kesadaran Keamanan SPBE (Dependency)`
- `Jangka Waktu Pelayanan`
- `← Aplikasi (Dependency)`
- `← Data dan Informasi  (Dependency)`
- `→ Sistem Penghubung Layanan (Dependency)`
- `← Fasilitas Komputasi (Dependency)`
- `→ Jaringan Intra Pemerintah (Dependency)`

### 📊 Sampel Data
| Nama Government Cloud        | Deskripsi Government Cloud                                                                    | Nama Pemilik             |   Biaya Layanan | Tipe Goverment Cloud   | Status Kepemilikkan   |   Unit Pengembang Government Cloud |   → Unit Operasional Government Cloud (Dependency) |   → Edukasi Kesadaran Keamanan SPBE (Dependency) |   Jangka Waktu Pelayanan |   ← Aplikasi (Dependency) |   ← Data dan Informasi  (Dependency) |   → Sistem Penghubung Layanan (Dependency) |   ← Fasilitas Komputasi (Dependency) |   → Jaringan Intra Pemerintah (Dependency) |
|:-----------------------------|:----------------------------------------------------------------------------------------------|:-------------------------|----------------:|:-----------------------|:----------------------|-----------------------------------:|---------------------------------------------------:|-------------------------------------------------:|-------------------------:|--------------------------:|-------------------------------------:|-------------------------------------------:|-------------------------------------:|-------------------------------------------:|
| Aplikasi Video Konferensi    | komunikasi visual dan audio real-time untuk rapat, kolaborasi, atau interaksi jarak jauh      | Zoom Communications, Inc |        41170000 | SaaS                   | Swasta Luar Negeri    |                                nan |                                                nan |                                              nan |                      nan |                       nan |                                  nan |                                        nan |                                  nan |                                        nan |
| Control Panel                | Antarmuka terpusat untuk mengelola, mengkonfigurasi, dan memantau sistem atau layanan.        | JBMC Software            |         6300000 | SaaS                   | Swasta Luar Negeri    |                                nan |                                                nan |                                              nan |                      nan |                       nan |                                  nan |                                        nan |                                  nan |                                        nan |
| Platform Distribusi Aplikasi | Ekosistem untuk menyebarkan dan mengunduh aplikasi, menghubungkan pengembang dengan pengguna. | Apple Inc                |         2490000 | SaaS                   | Swasta Luar Negeri    |                                nan |                                                nan |                                              nan |                      nan |                       nan |                                  nan |                                        nan |                                  nan |                                        nan |

---

## 🗄️ Tabel / Entitas: Perangkat Lunak Platform

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Perangkat Lunak Platform.csv`

### 📝 Struktur Kolom
- `Nama Perangkat Lunak`
- `Deskripsi Perangkat Lunak`
- `Jenis Sistem Database (diisi jika tipe perangkat lunak adalah sistem database)`
- `Jenis Sistem Utilitas (diisi jika tipe perangkat lunak adalah sistem utilitas)`
- `Nama Pemilik Lisensi`
- `Validitas Lisensi Perangkat Lunak`
- `Jenis Sistem Operasi (diisi jika tipe perangkat lunak adalah sistem operasi)`
- `Jenis Lisensi`
- `Tipe Perangkat Lunak`
- `→ Komputasi Awan (Dependency)`
- `→ Fasilitas Komputasi (Dependency)`

### 📊 Sampel Data
| Nama Perangkat Lunak                     | Deskripsi Perangkat Lunak                                                                                                                                                                                                                                                                                                                                                                  |   Jenis Sistem Database (diisi jika tipe perangkat lunak adalah sistem database) | Jenis Sistem Utilitas (diisi jika tipe perangkat lunak adalah sistem utilitas)                                                                                                                  | Nama Pemilik Lisensi           | Validitas Lisensi Perangkat Lunak   |   Jenis Sistem Operasi (diisi jika tipe perangkat lunak adalah sistem operasi) | Jenis Lisensi   | Tipe Perangkat Lunak   |   → Komputasi Awan (Dependency) |   → Fasilitas Komputasi (Dependency) |
|:-----------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------|:------------------------------------|-------------------------------------------------------------------------------:|:----------------|:-----------------------|--------------------------------:|-------------------------------------:|
| WAF by cPGuard (Web Aplication Firewall) | WAF (Web Application Firewall) by cPGuard adalah sistem keamanan yang dirancang khusus untuk melindungi aplikasi web (seperti situs web yang berjalan di Apache, Nginx, atau Litespeed) dari berbagai serangan siber. WAF ini bekerja di lapisan aplikasi (Layer 7) dan umumnya didasarkan pada kumpulan aturan ModSecurity yang canggih, ditambah dengan aturan internal cPGuard sendiri. |                                                                              nan | Web Application Firewall yang dirancang khusus untuk melindungi aplikasi web dari berbagai serangan berbasis web seperti SQL Injection, Cross-Site Scripting (XSS), Brute Force, dan lain-lain. | Diskominfotik Kota Banjarmasin | Aktif (hingga 01 Nopember 2025)     |                                                                            nan | Periodik        | Sistem Utilitas        |                             nan |                                  nan |

---

## 🗄️ Tabel / Entitas: Perangkat Keras Server

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Perangkat Keras Server.csv`

### 📝 Struktur Kolom
- `Nama Server`
- `Deskripsi Server`
- `Nama Pemilik`
- `Kapasitas Memori`
- `Jumlah Kapasitas Penyimpanan`
- `Jenis Penggunaan Server`
- `Status Kepemilikkan`
- `Jenis Teknologi Prosesor`
- `Unit Pengelola Server`
- `Lokasi Perangkat Lunak Server`
- `→ Perangkat Lunak Platform (Dependency)`
- `Teknik Penyimpanan`
- `→ Workflow - Proses Bisnis (Dependency)`
- `← Fasilitas Komputasi (Dependency)`

### 📊 Sampel Data
| Nama Server          | Deskripsi Server                | Nama Pemilik                   | Kapasitas Memori   | Jumlah Kapasitas Penyimpanan   | Jenis Penggunaan Server   | Status Kepemilikkan   | Jenis Teknologi Prosesor   | Unit Pengelola Server          | Lokasi Perangkat Lunak Server   | → Perangkat Lunak Platform (Dependency)   | Teknik Penyimpanan   |   → Workflow - Proses Bisnis (Dependency) |   ← Fasilitas Komputasi (Dependency) |
|:---------------------|:--------------------------------|:-------------------------------|:-------------------|:-------------------------------|:--------------------------|:----------------------|:---------------------------|:-------------------------------|:--------------------------------|:------------------------------------------|:---------------------|------------------------------------------:|-------------------------------------:|
| ProLiant DL380P Gen8 | Server Untuk Aplikasi           | Diskominfotik Kota Banjarmasin | 64 Gb              | 1 Tb                           | Server Aplikasi           | Sendiri               | Low End                    | Diskominfotik Kota Banjarmasin | Banjaramsin                     | Linux OS                                  | Raid 0               |                                       nan |                                  nan |
| ProLiant DL380P Gen8 | Server Untuk Aplikasi           | Diskominfotik Kota Banjarmasin | 16 Gb              | 320 Gb                         | Server Aplikasi           | Sendiri               | Low End                    | Diskominfotik Kota Banjarmasin | Banjaramsin                     | Linux OS                                  | Raid 0               |                                       nan |                                  nan |
| ProLiant DL180 Gen9  | Server Untuk Stream CCTV Publik | Diskominfotik Kota Banjarmasin | 8 Gb               | 1 Tb                           | Server Aplikasi           | Sendiri               | Low End                    | Diskominfotik Kota Banjarmasin | Banjaramsin                     | Linux OS                                  | Raid 0               |                                       nan |                                  nan |

---

## 🗄️ Tabel / Entitas: Perangkat Keras Periferal

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Perangkat Keras Periferal.csv`

### 📝 Struktur Kolom
- `Nama Perangkat Periferal`
- `Deskripsi Periferal`
- `Tipe Periferal`
- `Lokasi Penempatan Periferal`
- `Unit Pengelola Perangkat Periferal`
- `→ Fasilitas Komputasi (Dependency)`
- `→ Perangkat Keras Media Penyimpan (Dependency)`
- `→ Perangkat Keras Server (Dependency)`
- `→ Perangkat Lunak Platform (Dependency)`

### 📊 Sampel Data
| Nama Perangkat Periferal   | Deskripsi Periferal                | Tipe Periferal   | Lokasi Penempatan Periferal   | Unit Pengelola Perangkat Periferal   |   → Fasilitas Komputasi (Dependency) |   → Perangkat Keras Media Penyimpan (Dependency) |   → Perangkat Keras Server (Dependency) |   → Perangkat Lunak Platform (Dependency) |
|:---------------------------|:-----------------------------------|:-----------------|:------------------------------|:-------------------------------------|-------------------------------------:|-------------------------------------------------:|----------------------------------------:|------------------------------------------:|
| Videowall Processor        | menampilkan untuk video conference | Input/Output     | Command Center                | Diskominfotik Kota Banjarmasin       |                                  nan |                                              nan |                                     nan |                                       nan |

---

## 🗄️ Tabel / Entitas: Perangkat Keras Media Penyimpan

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Perangkat Keras Media Penyimpan.csv`

### 📝 Struktur Kolom
- `Nama Data Storage`
- `Deskripsi Data Storage`
- `Nama Pemilik`
- `Kapasitas Penyimpanan`
- `Status Kepemilikan`
- `Metode Akses Data Sharing`
- `← Data dan Informasi  (Dependency)`
- `Unit Pengelola Data Storage`
- `Lokasi Data Storage`
- `← Perangkat Lunak Platform (Dependency)`
- `← Perangkat Keras Server (Dependency)`
- `→ Fasilitas Komputasi (Dependency)`

### 📊 Sampel Data
| Nama Data Storage   | Deskripsi Data Storage          | Nama Pemilik                   |   Kapasitas Penyimpanan | Status Kepemilikan   | Metode Akses Data Sharing      | ← Data dan Informasi  (Dependency)   | Unit Pengelola Data Storage    | Lokasi Data Storage   | ← Perangkat Lunak Platform (Dependency)   | ← Perangkat Keras Server (Dependency)   |   → Fasilitas Komputasi (Dependency) |
|:--------------------|:--------------------------------|:-------------------------------|------------------------:|:---------------------|:-------------------------------|:-------------------------------------|:-------------------------------|:----------------------|:------------------------------------------|:----------------------------------------|-------------------------------------:|
| NAS                 | Untuk Pneyimpanan data aplikasi | Diskominfotik Kota Banjaramsin |                     nan | Sendiri              | Network Attached Storage (NAS) | Backup VM, dan database kependudukan | Diskominfotik Kota Banjaramsin | Jakarta               | Linux (Synologi)                          | Synology                                |                                  nan |

---

## 🗄️ Tabel / Entitas: Perangkat Keras Keamanan

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Perangkat Keras Keamanan.csv`

### 📝 Struktur Kolom
- `Nama Perangkat Keamanan`
- `Deskripsi Security Device`
- `Nama Pemilik`
- `Tipe Security Device`
- `Status Kepemilikan`
- `Unit Pengelola Security Device`
- `→ Fasilitas Komputasi (Dependency)`
- `→ Perangkat Keras Jaringan (Dependency)`

### 📊 Sampel Data
| Nama Perangkat Keamanan                 | Deskripsi Security Device                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Nama Pemilik                                | Tipe Security Device   | Status Kepemilikan   | Unit Pengelola Security Device                             |   → Fasilitas Komputasi (Dependency) | → Perangkat Keras Jaringan (Dependency)   |
|:----------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------|:-----------------------|:---------------------|:-----------------------------------------------------------|-------------------------------------:|:------------------------------------------|
| Firewall (Fortinet 200E)                | FortiGate 200E adalah Next-Generation Firewall (NGFW) serbaguna dari Fortinet, dirancang untuk memberikan perlindungan keamanan siber yang komprehensif bagi instansi pemerintahan skala menengah kebawah (kantor cabang). Perangkat ini menggabungkan kemampuan firewall tradisional dengan fitur-fitur keamanan canggih seperti sistem pencegahan intrusi (IPS), kontrol aplikasi, dan inspeksi mendalam terhadap lalu lintas terenkripsi maupun tidak terenkripsi. Semua ini didukung oleh hardware khusus untuk performa optimal. Dengan kata lain, FortiGate 200E adalah solusi keamanan terpadu yang membantu melindungi infrastruktur jaringan pemerintahan dari berbagai ancaman siber modern tanpa mengorbankan kecepatan.                                                                                                                                                                                                                                                                                                                                                                                                            | Dinas Komunikasi Informatika dan Statsistik | Firewall               | Sendiri              | Dinas Komunikasi Informatika dan Statsistik                |                                  nan | nan                                       |
| Firewall Fortinet 600F NGFW (IPS + IDS) | Next-Generation Firewall (NGFW) yang dirancang untuk kebutuhan keamanan jaringan skala menengah hingga besar. Perangkat ini menggabungkan fitur firewall tradisional dengan kemampuan keamanan canggih khas NGFW, didukung oleh prosesor khusus Fortinet untuk kinerja tinggi. Fitur utamanya meliputi: Inspeksi Paket Mendalam (DPI): Menganalisis lalu lintas hingga level aplikasi untuk mendeteksi ancaman tersembunyi. Intrusion Prevention System (IPS) Terintegrasi: Mencegah serangan secara proaktif dan real-time. Kontrol Aplikasi: Memungkinkan kontrol detail atas penggunaan ribuan aplikasi di jaringan. Perlindungan Ancaman Komprehensif: Melindungi dari ransomware, serangan command-and-control, dan situs web berbahaya, termasuk dalam lalu lintas terenkripsi (SSL/TLS inspection). Intelijen Ancaman AI: Mendapatkan pembaruan ancaman terbaru dari FortiGuard Labs untuk melawan serangan zero-day. Secure SD-WAN: Menyediakan konektivitas jaringan yang aman dan efisien untuk lingkungan terdistribusi. Dengan performa tinggi, FortiGate 600F memberikan perlindungan kuat tanpa mengorbankan kecepatan jaringan. | Lintasarta                                  | Firewall               | Milik Pihak Ketiga   | Dinas Komunikasi Informatika dan Statsistik dan Lintasarta |                                  nan | Mikrotik CCR 1036                         |

---

## 🗄️ Tabel / Entitas: Perangkat Keras Jaringan

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Perangkat Keras Jaringan.csv`

### 📝 Struktur Kolom
- `Nama Network/Communication Device`
- `Deskripsi Network/Communication Device`
- `Nama Pemilik`
- `Tipe Network/Communication Device`
- `Status Kepemilikan`
- `Unit Pengelola Network/Communication Device`
- `→ Fasilitas Komputasi (Dependency)`
- `→ Perangkat Lunak Platform (Dependency)`
- `→ Perangkat Keras Server (Dependency)`
- `→ Perangkat Keras Media Penyimpan (Dependency)`
- `→ Instansi (Dependency)`

### 📊 Sampel Data
| Nama Network/Communication Device   | Deskripsi Network/Communication Device                                  | Nama Pemilik                   | Tipe Network/Communication Device   | Status Kepemilikan   | Unit Pengelola Network/Communication Device   |   → Fasilitas Komputasi (Dependency) |   → Perangkat Lunak Platform (Dependency) |   → Perangkat Keras Server (Dependency) |   → Perangkat Keras Media Penyimpan (Dependency) |   → Instansi (Dependency) |
|:------------------------------------|:------------------------------------------------------------------------|:-------------------------------|:------------------------------------|:---------------------|:----------------------------------------------|-------------------------------------:|------------------------------------------:|----------------------------------------:|-------------------------------------------------:|--------------------------:|
| Akses Point Ruijie AP 820L V3       | Perangkat Akses Point Untuk SKPD, Kecamatan, Kelurahan, Puskesmas, UPTD | Diskominfotik Kota Banjarmasin | Wireless Equipment                  | Sendiri              | Diskominfotik Kota Banjarmasin                |                                  nan |                                       nan |                                     nan |                                              nan |                       nan |
| Ruijie Switch ES205GC-P             | Perangkat Switch Untuk SKPD, Kecamatan, Kelurahan, Puskesmas, UPTD      | Diskominfotik Kota Banjarmasin | Multilayer Switch                   | Sendiri              | Diskominfotik Kota Banjarmasin                |                                  nan |                                       nan |                                     nan |                                              nan |                       nan |
| Mikrotik - RB L009 & RB 2011        | Perangkat Router Untuk SKPD, Kecamatan, Kelurahan, Puskesmas, UPTD      | Diskominfotik Kota Banjarmasin | Router                              | Sendiri              | Diskominfotik Kota Banjarmasin                |                                  nan |                                       nan |                                     nan |                                              nan |                       nan |

---

## 🗄️ Tabel / Entitas: SPLP

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - SPLP.csv`

### 📝 Struktur Kolom
- `Nama Sistem Penghubung Layanan Pemerintah`
- `Deskripsi Sistem Penghubung`
- `Nama Pemilik`
- `Jenis Sistem Penghubung`
- `Status Kepemilikan`
- `→ Jaringan Intra Pemerintah (Dependency)`
- `← Aplikasi (Dependency)`

### 📊 Sampel Data
| Nama Sistem Penghubung Layanan Pemerintah   | Deskripsi Sistem Penghubung   | Nama Pemilik   | Jenis Sistem Penghubung   | Status Kepemilikan   | → Jaringan Intra Pemerintah (Dependency)   | ← Aplikasi (Dependency)   |
|---------------------------------------------|-------------------------------|----------------|---------------------------|----------------------|--------------------------------------------|---------------------------|

---

## 🗄️ Tabel / Entitas: Jaringan Intra

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Jaringan Intra.csv`

### 📝 Struktur Kolom
- `Nama Jaringan Intra Pemerintah`
- `Deskripsi Jaringan`
- `Jenis Jaringan`
- `Nama Pemilik`
- `Bandwidth`
- `Media Lainnya`
- `Kepemilikan`
- `Tipe Media Jaringan`

### 📊 Sampel Data
| Nama Jaringan Intra Pemerintah   | Deskripsi Jaringan   | Jenis Jaringan         | Nama Pemilik                      | Bandwidth   | Media Lainnya   | Kepemilikan   | Tipe Media Jaringan   |
|:---------------------------------|:---------------------|:-----------------------|:----------------------------------|:------------|:----------------|:--------------|:----------------------|
| Internet Pemko Banjarmasin       | Intranet             | IP Transit             | PT. Telekomunikasi Indonesia, Tbk | 3 Gbps      | nan             | BUMN          | Fiber Optic           |
| Internet Pemko Banjarmasin       | Intranet             | IP Transit             | PT. Indonesian Comnets Plus       | 200 Mbps    | Metronet        | BUMN          | Fiber Optic           |
| Internet Pemko Banjarmasin       | Intranet             | Bandwitdh Simetris 1:1 | PT. Starlink Network Digital      | 14 Gbps     | nan             | Pihak Ketiga  | Fiber Optic           |

---

## 🗄️ Tabel / Entitas: Pusat Kendali

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Pusat Kendali.csv`

### 📝 Struktur Kolom
- `Nama Pusat Kendali`
- `Bandwidth Intranet`
- `Bandwidth Internet`
- `Lokasi`
- `Klasifikasi Tier Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan`
- `Kepemilikan(Information)`
- `Sistem Pengamanan Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan`
- `Unit Kerja Penanggung Jawab - Merupakan unit kerja pengelola yang bertanggung jawab atas operasional fasilitas`

### 📊 Sampel Data
| Nama Pusat Kendali   | Bandwidth Intranet   | Bandwidth Internet   | Lokasi   | Klasifikasi Tier Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan   | Kepemilikan(Information)   | Sistem Pengamanan Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan   | Unit Kerja Penanggung Jawab - Merupakan unit kerja pengelola yang bertanggung jawab atas operasional fasilitas   |
|----------------------|----------------------|----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|

---

## 🗄️ Tabel / Entitas: Pusat Komputasi

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Pusat Komputasi.csv`

### 📝 Struktur Kolom
- `Nama Pusat Komputasi`
- `Bandwidth Intranet`
- `Bandwidth Internet`
- `Lokasi`
- `Klasifikasi Tier Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan`
- `Kepemilikan(Information)`
- `Sistem Pengamanan Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan`
- `Unit Kerja Penanggung Jawab - Merupakan unit kerja pengelola yang bertanggung jawab atas operasional fasilitas`

### 📊 Sampel Data
| Nama Pusat Komputasi        | Bandwidth Intranet   | Bandwidth Internet   | Lokasi                              | Klasifikasi Tier Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan   | Kepemilikan(Information)   | Sistem Pengamanan Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan   | Unit Kerja Penanggung Jawab - Merupakan unit kerja pengelola yang bertanggung jawab atas operasional fasilitas   |
|:----------------------------|:---------------------|:---------------------|:------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------|:---------------------------|:---------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------|
| NAS SERVER (Storage)        | -                    | 200 Mbps             | Jakarta (PT. Optimus Teknologi Pro) | Tier 3                                                                                                                                | Swasta Dalam Negeri        | Non Biometrik                                                                                                                          | Diskominfotik Kota Banjarmasin                                                                                   |
| Server Dedicated (Aplikasi) | nan                  | 200 Mbps             | Jakarta (PT. Optimus Teknologi Pro) | Tier 3                                                                                                                                | Swasta Dalam Negeri        | Non Biometrik                                                                                                                          | Diskominfotik Kota Banjarmasin                                                                                   |
| Server Dedicated (Aplikasi) | nan                  | 200 Mbps             | Jakarta (PT. Optimus Teknologi Pro) | Tier 3                                                                                                                                | Swasta Dalam Negeri        | Non Biometrik                                                                                                                          | Diskominfotik Kota Banjarmasin                                                                                   |

---

## 🗄️ Tabel / Entitas: Pusat Data

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Pusat Data.csv`

### 📝 Struktur Kolom
- `Nama Pusat Data`
- `Bandwidth Intranet`
- `Bandwidth Internet`
- `Lokasi`
- `Klasifikasi Tier Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan`
- `Kepemilikan(Information)`
- `Sistem Pengamanan Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan`
- `Unit Kerja Penanggung Jawab - Merupakan unit kerja pengelola yang bertanggung jawab atas operasional fasilitas`

### 📊 Sampel Data
| Nama Pusat Data                                | Bandwidth Intranet   | Bandwidth Internet   | Lokasi     | Klasifikasi Tier Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan   | Kepemilikan(Information)   |   Sistem Pengamanan Fasilitas - Jika menggunakan fasilitas instansi lain/pihak ketiga, diisi sesuai pengetahuan atau dapat dikosongkan | Unit Kerja Penanggung Jawab - Merupakan unit kerja pengelola yang bertanggung jawab atas operasional fasilitas   |
|:-----------------------------------------------|:---------------------|:---------------------|:-----------|:--------------------------------------------------------------------------------------------------------------------------------------|:---------------------------|---------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------|
| PDNS                                           | -                    | 1 Gbps               | PDNS Pusat | Tier 4                                                                                                                                | Instansi Pemerintah Lain   |                                                                                                                                    nan | Diskominfotik Kota Banjarmasin                                                                                   |
| PT. Optimus Teknologi Pro                      | -                    | 200 Mbps             | Jakarta    | Tier 3                                                                                                                                | Swasta Dalam Negeri        |                                                                                                                                    nan | Diskominfotik Kota Banjarmasin                                                                                   |
| PT. Telekomunikasi Indonesia, Tbk (NeuCentrix) | -                    | 200 Mbps             | Yogyakarta | Tier 3                                                                                                                                | BUMN                       |                                                                                                                                    nan | Diskominfotik Kota Banjarmasin                                                                                   |

---

## 🗄️ Tabel / Entitas: Referensi Arsitektur Infrastruk

**Sumber File:** `Domain Arsitektur Infrastruktur - AS IS (1).xlsx - Referensi Arsitektur Infrastruk.csv`

### 📝 Struktur Kolom
- `PC, Laptop, printer tidak perlu di masukan ke manajemen aset tik`

### 📊 Sampel Data
| PC, Laptop, printer tidak perlu di masukan ke manajemen aset tik   |
|--------------------------------------------------------------------|

---

