# Meteopath v6 — Career Explorer

Website independen mahasiswa untuk mengeksplorasi karier Meteorologi ITB. https://zeezieprog.github.io/Meteopath/

## Fitur
- 8 spesialisasi Kurikulum 2024; 75 kemunculan dari 31 mata kuliah unik.
- Perbandingan 2–3 spesialisasi, simulator pemilihan 12 SKS, jalur karier, dan 16 proyek portofolio.
- 33 profil karier dengan keterangan pendidikan; bukan semua terverifikasi alumni S1 Meteorologi.
- 29 organisasi unik (50 hubungan lintas spesialisasi), dengan sumber dan jenis bukti.
- Tema gelap, animasi atmosfer, aksesibilitas keyboard, dan metodologi data.

## Berkas
index.html (halaman), style.css (tema + animasi), script.js (katalog), v6.js (fitur interaktif), data.js (data ternormalisasi), curriculum.js (mata kuliah), atmospheric-motion-v1.js (kontrol animasi), favicon.svg.

## Catatan
Sumber kurikulum: https://meteo.itb.ac.id/?page_id=2621&lang=id . Data perusahaan adalah kecocokan sektor, bukan lowongan aktif. Data alumni dikelompokkan berdasarkan pengalaman karier, bukan bukti paket spesialisasi akademik. Pemilihan IRS harus dikonfirmasi dengan dosen wali. Revisi data 18 November 2026 tidak berarti semua profil dan tautan diverifikasi ulang. Koreksi: GitHub Issues.

Bukan website resmi ITB.

## Panduan karier dan proyek yang lebih rinci

Halaman `karier.html` memuat panduan untuk 8 spesialisasi dan 16 proyek dengan aktivitas profesi, jenjang contoh, persiapan akademik, perangkat, tahap belajar, durasi perkiraan, sumber data, langkah pengerjaan, evaluasi, serta keluaran portofolio. Konten disimpan pada `career-content-v8.js`, gaya visual pada `career-explorer-v8.css`, dan tampilan dinamis pada `meteopath-enhancements-v2-20261118.js`.

Syarat kerja bervariasi dan proyek ini bukan sumber lowongan aktif atau panduan akademik resmi.

## Arsip fitur Rencana

Fitur perencanaan karier sementara disembunyikan dari versi utama Meteopath atas permintaan pengelola proyek. Halaman, navigasi, roadmap umum, dan komponen planner tidak lagi diterbitkan di branch `main`.

**Cadangan utuh** tersedia pada branch `archive/future-planner-v10`:
https://github.com/zeezieprog/Meteopath/tree/archive/future-planner-v10

Cadangan tersebut berisi `rencana.html`, `future-planner-v10.js`, `future-planner-v10.css`, template 12 tugas awal, fitur timeline/milestone, pelacakan progres, review, serta animasi scroll. Untuk mengaktifkan kembali, integrasikan kembali halaman dan aset dari branch tersebut dan tambahkan lagi navigasi ke halaman Rencana.

Data pengguna yang pernah diisi tidak tersimpan di repositori. Versi planner memakai `localStorage` dengan kunci `meteopath-future-planner-v10` dan `meteopath-plan`. Pembaruan ini tidak memanggil penghapusan browser storage; data dapat tetap tersedia jika pemilik perangkat tidak menghapus data situs.
