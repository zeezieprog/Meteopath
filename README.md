# METEOPATH

Atlas karier independen untuk mahasiswa Meteorologi ITB. [Buka METEOPATH](https://zeezieprog.github.io/Meteopath/).

## Isi atlas

| Halaman | Fitur |
| --- | --- |
| Beranda | Ringkasan isi atlas, pintu masuk ke lima bagian, dan informasi platform |
| Spesialisasi | Delapan paket Kurikulum 2024, filter kategori, pencarian mata kuliah, detail bidang, dan simulasi 12 SKS |
| Komparasi | Perbandingan dua atau tiga spesialisasi berdasarkan enam aspek |
| Alumni | 33 profil profesional dengan riwayat pendidikan dan dasar klasifikasi |
| Perusahaan | 29 organisasi, 50 keterkaitan bidang, contoh peran, kualifikasi, dan sumber |
| Karier | Delapan panduan profesi dan 16 proyek portofolio dengan perangkat, sumber data, langkah kerja, dan evaluasi |

## Menjalankan situs

GitHub Pages menyajikan berkas statis dari akar repositori. Untuk pratinjau lokal, jalankan `python -m http.server 8000` dari direktori ini dan buka `http://localhost:8000/`. Situs memakai HTML, CSS, dan JavaScript tanpa langkah build. Gambar, ikon, dan fon disajikan dari direktori `assets/`.

## Mengelola isi

- `data.js` menyimpan spesialisasi, profil profesional, relasi organisasi, dan katalog proyek.
- `curriculum.js` memuat 75 entri pada delapan paket, setara dengan 31 kode mata kuliah unik. Acuannya adalah [Skema Pembelajaran dalam Program](https://meteo.itb.ac.id/?lang=id&page_id=2621).
- `career-content-v8.js` memuat panduan karier, proyek, dan dokumentasi sumber.
- Halaman HTML memuat konten dan navigasi masing-masing. `assets/atlas.css` dan `assets/atlas.js` menangani gaya serta navigasi bersama. Modul di `assets/` menangani interaksi khusus per halaman.
- Tautan lama seperti `#spesialisasi`, `#proyek`, dan `#detail?track=perubahan-iklim` tetap mengarah ke halaman yang sesuai. Simulasi mata kuliah memakai kunci penyimpanan peramban `meteopath-courses`.

Dasar klasifikasi alumni adalah riwayat studi dan pekerjaan yang tercantum di profil publik. Status pendidikan ditampilkan per profil. Keterkaitan organisasi menunjukkan relevansi sektor, peran, atau contoh rekrutmen terdokumentasi. Status lowongan dan kualifikasi perlu diperiksa pada sumber terkait. Konfirmasikan pengisian IRS dengan dosen wali.

Pemeriksaan 20 November 2026 mencakup 75 entri kurikulum dan dua label sumber organisasi. Laman layanan [StormGeo](https://stormgeo.com/weather) serta profil profesi di [Meteomatics Careers](https://www.meteomatics.com/en/careers/) diklasifikasikan sesuai isi halaman. Tanggal pemeriksaan profil profesional individual masih mengikuti data masing-masing. [Ajukan koreksi data](https://github.com/zeezieprog/Meteopath/issues/new).

Ilustrasi awan pada beranda dibuat untuk METEOPATH dengan bantuan AI. Ilustrasi globe memakai garis pantai [Natural Earth](https://www.naturalearthdata.com/). DM Sans dan Instrument Serif disertakan beserta lisensi SIL Open Font License di `assets/fonts/`.

## Arsip fitur Rencana

Fitur perencanaan karier sementara disembunyikan dari versi utama Meteopath atas permintaan pengelola proyek. Halaman, navigasi, roadmap umum, dan komponen planner tidak lagi diterbitkan di branch `main`.

**Cadangan utuh** tersedia pada branch `archive/future-planner-v10`:
https://github.com/zeezieprog/Meteopath/tree/archive/future-planner-v10

Cadangan tersebut berisi `rencana.html`, `future-planner-v10.js`, `future-planner-v10.css`, template 12 tugas awal, fitur timeline/milestone, pelacakan progres, review, serta animasi scroll. Untuk mengaktifkan kembali, integrasikan kembali halaman dan aset dari branch tersebut dan tambahkan lagi navigasi ke halaman Rencana.

Data pengguna yang pernah diisi tidak tersimpan di repositori. Versi planner memakai `localStorage` dengan kunci `meteopath-future-planner-v10` dan `meteopath-plan`. Pembaruan ini tidak memanggil penghapusan browser storage; data dapat tetap tersedia jika pemilik perangkat tidak menghapus data situs.
