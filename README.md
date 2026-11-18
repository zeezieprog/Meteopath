# Meteopath v6 — Career Explorer

Website independen mahasiswa untuk mengeksplorasi karier Meteorologi ITB. https://zeezieprog.github.io/Meteopath/

## Fitur
- 8 spesialisasi Kurikulum 2024; 75 kemunculan dari 31 mata kuliah unik.
- Perbandingan 2–3 spesialisasi, simulator pemilihan 12 SKS, jalur karier, dan 16 proyek portofolio.
- 33 profil karier dengan keterangan pendidikan; bukan semua terverifikasi alumni S1 Meteorologi.
- 29 organisasi unik (50 hubungan lintas spesialisasi), dengan sumber dan jenis bukti.
- Career Planner: rencana tersimpan di localStorage, ekspor teks, tanpa akun.
- Tema gelap, animasi atmosfer, aksesibilitas keyboard, dan metodologi data.

## Berkas
index.html (halaman), style.css (tema + animasi), script.js (katalog), v6.js (fitur interaktif), data.js (data ternormalisasi), curriculum.js (mata kuliah), atmospheric-motion-v1.js (kontrol animasi), favicon.svg.

## Catatan
Sumber kurikulum: https://meteo.itb.ac.id/?page_id=2621&lang=id . Data perusahaan adalah kecocokan sektor, bukan lowongan aktif. Data alumni dikelompokkan berdasarkan pengalaman karier, bukan bukti paket spesialisasi akademik. Pemilihan IRS harus dikonfirmasi dengan dosen wali. Revisi data 18 November 2026 tidak berarti semua profil dan tautan diverifikasi ulang. Koreksi: GitHub Issues.

Bukan website resmi ITB.

## Panduan karier dan proyek yang lebih rinci

Halaman `karier.html` memuat panduan untuk 8 spesialisasi dan 16 proyek dengan aktivitas profesi, jenjang contoh, persiapan akademik, perangkat, tahap belajar, durasi perkiraan, sumber data, langkah pengerjaan, evaluasi, serta keluaran portofolio. Konten disimpan pada `career-content-v8.js`, gaya visual pada `career-explorer-v8.css`, dan tampilan dinamis pada `meteopath-enhancements-v2-20261118.js`.

Syarat kerja bervariasi dan proyek ini bukan sumber lowongan aktif atau panduan akademik resmi.

## Future Planner v10

Halaman `rencana.html` kini menggunakan planner interaktif dengan beberapa rencana tersimpan, tanggal target, spesialisasi, jenis tujuan, prioritas kemampuan, serta alokasi waktu mingguan. Setiap rencana dimulai dengan 12 tugas contoh yang dapat diedit atau dihapus. Pengguna dapat menambah tugas dan tenggat, mencentang penyelesaian, melihat progres, memfilter tugas mendatang dan terlambat, serta menyimpan refleksi berkala.

Tidak ada fitur download, ekspor, atau penyalinan rencana pada halaman ini. Seluruh data planner disimpan secara lokal pada browser (`localStorage`), bukan di server. Data dapat hilang jika penyimpanan browser dibersihkan, dan tidak tersinkron antarperangkat. Kode planner terpisah dalam `future-planner-v10.js` dan `future-planner-v10.css`.

`scroll-bubbles-v10.js` dan `scroll-bubbles-v10.css` memberikan efek kemunculan saat scroll pada tujuh halaman utama, dengan dukungan `prefers-reduced-motion`. Animasi tidak menyembunyikan konten jika JavaScript atau IntersectionObserver tidak tersedia.
