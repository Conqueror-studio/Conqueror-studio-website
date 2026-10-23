# Website Sales-Ready Release Candidate

## Penetapan

- ID: WEB-RC-2026-10-22
- Ditetapkan oleh user dalam percakapan pada 17 Oktober 2026.
- Target review kandidat rilis: 22 Oktober 2026, Asia/Jakarta.
- Status: milestone sprint ditetapkan; Definition of Done belum terpenuhi.
- Tujuan: website siap mendukung penawaran layanan dan masuknya calon klien pertama.
- Estimasi awal: 20–28 jam kerja teknis, di luar waktu menunggu keputusan/aset.
- Target bersyarat: keputusan konten/aset pada 19–20 Oktober, tanpa redesign besar atau perluasan scope billing.
- Penetapan lokal ini bukan deployment, persetujuan desain CEO, atau pembaruan milestone di Multica/GitHub.

## Baseline terverifikasi

- Branch: `agent/upgrade-v1.1`.
- HEAD saat audit: `46554a03dbda44e507db76db0e310420e15fc8d6`.
- Perubahan preview masih di working tree, belum di-commit/push.
- Audit sebelumnya pada 17 Oktober: 14 tes lulus, lint dan production build lulus; diff whitespace check lulus.
- QA lokal: desktop/mobile simulasi, navigasi, scroll, keyboard, pause, dan pemeriksaan tautan kontak. Penerimaan pesan WhatsApp/email belum diuji sampai selesai.
- Audit dependency produksi: 1 critical dan 3 high; belum diperbaiki. Tidak sama dengan bukti eksploitasi.
- Desain belum direview CEO, dua hero masih sementara, dan gambar portofolio asli belum tersedia.

## Definition of Done

- [ ] WhatsApp membuka tujuan yang benar dan user/owner mengonfirmasi penerimaan pesan uji.
- [ ] Email membuka penerima yang benar dan user/owner mengonfirmasi penerimaan email uji. Tidak menganggap `mailto:` sebagai layanan pengiriman email server.
- [ ] QA desktop/mobile pada kandidat final selesai; ukuran, perangkat/browser, hasil, dan keterbatasan tercatat.
- [ ] Test, lint, dan build dijalankan pada kandidat final; hasil serta kegagalan bila ada dicatat untuk keputusan rilis.
- [ ] Temuan keamanan critical/high yang relevan ditangani dan audit/regresi diulang sebelum rilis publik.
- [ ] CEO/owner meninjau layanan, copy, kontak, portofolio, hero, dan hak penggunaan aset. Aset sementara tidak otomatis disetujui untuk publikasi.
- [ ] Domain/hosting dan URL produksi ditetapkan; metadata/sitemap tidak mengarah ke localhost pada deployment rilis.
- [ ] Paket bukti tersedia: identitas kandidat/commit setelah diizinkan, hasil command, screenshot QA, daftar hambatan, dan keputusan go/no-go.

## Urutan kerja yang direncanakan

1. Keamanan dan regresi dependency (6–10 jam).
2. Finalisasi konten/aset serta konfigurasi rilis (4–6 jam).
3. QA kontak, desktop/mobile dan koreksi (6–8 jam).
4. Bukti pengujian dan paket review (4 jam).

Review aset dapat berlangsung paralel dengan perbaikan teknis setelah implementasinya diotorisasi. Jika approval/aset terlambat atau migrasi keamanan membesar, laporkan perubahan estimasi; jangan menyatakan milestone selesai hanya karena tanggal target tercapai.

## Batas scope dan otorisasi

- Tidak menambah animasi/dekorasi atau fitur yang tidak mendukung penjualan, delivery, keamanan, atau fondasi website.
- Tidak menambah backend billing, schema produksi, payment gateway, portal client, integrasi PT. SSS, atau automation billing dalam milestone ini.
- Website-first menjadi prioritas sprint sekarang; urutan lama dalam PRD billing tidak mengubah prioritas ini. Detail domain/keputusan lama billing tidak dibatalkan oleh dokumen ini.
- Tidak melakukan push atau deployment tanpa otorisasi user. Dokumen milestone tidak mengirim pesan kepada CEO atau tim lain.
- Penetapan milestone belum berarti pekerjaan keamanan selesai atau keputusan rilis telah diberikan.

## Hubungan desain website dan billing

Status sekarang: website marketing dan rancangan Billing Core terpisah. Belum ada sinkronisasi API/data billing yang terverifikasi di website ini; koneksi Conqueror gagal 429 pada audit terakhir.

Arah kompatibilitas untuk dibahas pada milestone billing, bukan scope implementasi sprint ini:

- Gunakan identitas visual yang konsisten: logo SVG transparan, warna, tipografi, tombol dan pola navigasi. Token warna dan font lokal saat ini dapat menjadi bahan dasar bersama setelah review CEO; belum ada library UI lintas repository.
- Sesuaikan portal billing untuk tabel, invoice, formulir dan status yang mudah dibaca. Jangan memaksakan animasi marketing pada layar transaksi.
- Hubungkan website ke portal melalui entry point yang disepakati setelah portal tersedia. Jangan menambahkan tombol login/checkout tanpa tujuan yang berfungsi.
- Tentukan kontrak data/API, autentikasi dan otorisasi sebelum integrasi. Service/Package di website dan billing perlu mapping yang disetujui; teks marketing sekarang belum otomatis tersinkron dengan katalog billing.
- Pisahkan status subscription dari status invoice/payment. Subscription Active bukan bukti pembayaran. Status pembayaran berhasil harus berdasarkan verifikasi transaksi di backend, bukan tampilan UI atau redirect browser.
- Billing tetap sumber kebenaran subscription/entitlement sesuai rancangan; sistem client tetap memiliki data dan enforcement-nya sendiri. Perubahan desain tidak boleh mengubah kebijakan pembayaran/entitlement.

Konsistensi desain memungkinkan integrasi bertahap, tetapi tidak membuktikan kesiapan backend, keamanan integrasi, atau sinkronisasi yang sudah berjalan.

## Bukti dan konteks

- `docs/design/motion-preview.md`: riwayat perubahan visual dan QA sebelumnya (jumlah tes historis 13; audit terbaru 14).
- `tests/smoke.test.mjs`, `tests/logo.test.mjs`, `tests/motion.test.mjs`: cakupan tes website saat ini.
- Dokumen billing di folder induk: `CONQUEROR_STUDIO_SESSION_HANDOFF.md`, `CONQUEROR_BILLING_MVP_FINAL_HANDOFF_PRD.md`, `CONQUEROR_BILLING_CORE_BUILD_BRIEF_MVP.md`.

Implementasi billing eksternal yang lebih baru harus diverifikasi sebelum melaporkan persentase progres atau kesiapan integrasinya.
