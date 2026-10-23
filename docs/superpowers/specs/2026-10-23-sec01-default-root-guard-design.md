# SEC-01 — Rancangan Default-Root Guard untuk Toolchain Conqueror

> Follow-up23 Oktober2026: CTO kemudian menyetujui implementasi lokal pilihanA. Gate lokal kini PASS, tetapi CI/sync/release tetap terpisah. [Hasil implementasi dan bukti](../../SEC01_IMPLEMENTATION_HANDOFF_2026-10-23.md). Isi draft di bawah dipertahankan sebagai catatan keputusan sebelum implementasi, bukan status terbaru.

**Tanggal:** 23 Oktober 2026, Asia/Jakarta. **Status: DRAFT UNTUK REVIEW CTO — BELUM DIIMPLEMENTASIKAN.**

Dokumen ini merupakan hasil izin menyusun rancangan pengganti khusus. Izin tersebut bukan persetujuan memasang rancangan ini, menerima risiko tersisa, membuat commit/push, deployment, perubahan database, atau mengirim laporan kepada CEO.

## 1. Ringkasan keputusan yang diajukan

**Website tidak dibuat ulang.** Usulan hanya mengganti satu dependency pendukung lint dengan modul lokal kecil yang menolak operasi glob. Seluruh aturan Next.js, React, Hooks, TypeScript dan aksesibilitas yang sekarang aktif tetap dipertahankan. Desain, animasi, aset, kontak, portfolio, harga, Next.js/React runtime, billing, dan integrasi PT. SSS tidak disentuh.

Kontrak yang diajukan: **lint Conqueror hanya mendukung default root proyek; `settings.next.rootDir` harus tidak didefinisikan.** Jika seseorang mencoba memakai custom root, lint harus gagal dengan pesan jelas, bukan melewati pemeriksaan. Kemampuan multi-root/glob opsional tidak disediakan. Ini sengaja **BUKAN pengganti fast-glob yang kompatibel penuh**, bukan patch resmi braces, dan bukan fork seluruh ESLint atau website.

CTO diminta menyetujui secara spesifik: kontrak default-root-only, kepemilikan modul lokal, batas file di bagian 5, serta verifikasi/pembatalan di bagian 6–8. Audit bersih adalah target yang masih harus dibuktikan, bukan hasil yang sudah dicapai.

## 2. Kondisi aktual dan bukti dasar

- Repository: `D:\File Syahdan\Area 666 Conqueror Studio\Web Conqueror\website-repo`.
- Branch `agent/upgrade-v1.1`; HEAD `46554a03dbda44e507db76db0e310420e15fc8d6`, dirty working tree dengan pekerjaan sebelumnya; index kosong.
- Toolchain yang dipertahankan: ESLint 9.39.5, eslint-config-next / Next lint plugin 16.3.1. Runtime Next 15.5.28 dan React/react-dom 19.1.2 tidak diganti.
- Probe lint/config **baru pada tahap desain** mencakup **31 file**, nol error/warning. Semua memakai default root dan **22 aturan Next aktif**. Dua profil konfigurasi mempunyai **82** dan **86** aturan aktif secara keseluruhan. [Baseline aturan/file](../../audit/2026-10-23-sec01-design/current-lint-contract.json) dan [metadata serializable konfigurasi TS/JS](../../audit/2026-10-23-sec01-design/current-config-metadata.json) memuat parser/options, settings, linter options, identitas plugin dan globals; ignore set tetap dibaca dari konfigurasi sumber yang hash-nya direkam.
- Helper terpasang `@next/eslint-plugin-next/dist/utils/get-root-dirs.js` mengembalikan `context.cwd` jika custom root tidak didefinisikan. Cabang string/array memanggil fast-glob. Dalam lingkup `dist` plugin yang dibaca/ditelusuri, import fast-glob ditemukan pada helper tersebut; aturan `no-html-link-for-pages` memanggil helper. Ini temuan bounded-source, bukan jaminan untuk versi plugin lain.
- [Evaluasi sebelumnya](../../CTO_ENGINEERING_HANDOFF_2026-10-23.md) menolak downgrade dan alias langsung. Audit proyek terakhir saat evaluasi: produksi 0; lengkap 5 high/0 critical. Tes 35/35, lint/typecheck/build lulus **pada sesi evaluasi sebelumnya**; bukan hasil pengujian rancangan yang belum dipasang.
- Graph MCP gagal `Transport closed`, sehingga sumber/config terpasang dibaca langsung. Multica context read gagal HTTP 429. Tidak ada issue/Notion mapping baru yang dapat diklaim terverifikasi.

## 3. Pilihan dan trade-off

| Pilihan | Manfaat | Konsekuensi / keputusan |
| --- | --- | --- |
| **A. Default-root guard lokal — direkomendasikan untuk dibuktikan** | Perubahan kecil; tidak perlu parser glob, library pengganti, atau mengurangi aturan lint untuk proyek sekarang | Custom root/monorepo tidak didukung; modul/policy menjadi tanggung jawab engineering Conqueror; instalasi dan audit masih harus dibuktikan |
| B. Adapter/fork yang kompatibel penuh | Berusaha mempertahankan semua pola, termasuk brace range | Perlu implementasi dan verifikasi parser/semantik yang jauh lebih luas; risiko maintenance baru; tidak direkomendasikan dalam scope kesiapan komersial saat ini |
| C. Tetap dengan mitigasi dan tunggu patch resmi | Tidak menambah modul lokal atau kontrak baru | SEC-01 tetap OPEN dan audit lengkap tetap gagal; tidak sama dengan perbaikan final |

Pilihan A berbeda dari alias tinyglobby yang ditolak: tidak mencoba meniru hasil glob yang terbukti berbeda. Ia menghapus kebutuhan menjalankan parser tersebut **untuk kontrak proyek yang dibatasi dan disetujui**, lalu menolak konfigurasi yang melampaui kontrak. Pembatasan ini harus terlihat dalam dokumentasi dan pengujian, bukan disembunyikan agar audit terlihat hijau.

## 4. Arsitektur usulan dan kontrak kegagalan

### 4.1 Modul lokal tanpa dependency

Rencana identitas paket privat: `@conqueror/next-root-guard@0.1.0`, ditempatkan di `tooling/next-root-guard/`. Tidak ada dependency, lifecycle script, parser pattern, operasi filesystem/network, evaluasi kode, subprocess, atau publikasi registry. Nama/versinya harus jujur sebagai paket Conqueror, tidak menyamar sebagai braces/fast-glob versi aman yang tidak ada.

Modul CommonJS menyediakan entry point `globSync` dan `sync` yang selalu melempar error tetap **`CONQUEROR_GLOB_UNSUPPORTED`**. Tidak mengembalikan array kosong, tidak mengabaikan error, tidak memuat fast-glob lama sebagai fallback, dan tidak mencetak isi pattern. Default root dipilih oleh helper Next yang tetap asli; guard tidak perlu memilih/menebak folder sendiri. API glob lain tidak dijanjikan.

Penggantian dependency diusulkan **hanya** di bawah `@next/eslint-plugin-next@16.3.1`, memakai root npm override `file:./tooling/next-root-guard`. Override PostCSS yang sudah ada harus dipertahankan. Tidak ada override global fast-glob/braces atau downgrade plugin/framework. npm mendokumentasikan override berscope dan target paket/file lokal; bentuk lockfile dan instalasinya tetap merupakan gate teknis yang belum diuji untuk rancangan ini. [Dokumentasi npm](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides).

### 4.2 Policy lint aktif, bukan hanya test-only sentinel

Tambahkan satu aturan lokal **`conqueror-security/default-next-root-only`** pada severity error, tanpa mengubah nilai severity/options aturan lama. Saat rule dibuat, jika effective `settings.next` mempunyai properti bernama `rootDir` (milik sendiri maupun inherited), lint gagal dengan error tetap **`CONQUEROR_NEXT_ROOT_POLICY`**. Tolak juga empty array, empty string, `undefined` eksplisit, null, dan nilai non-string pada rootDir; settings.next yang bukan objek konfigurasi juga ditolak. Tidak adanya settings.next atau nilainya null boleh dinormalisasi sebagai konfigurasi kosong, mengikuti default helper asli. Ini mencegah nilai yang tidak memanggil glob justru melewati pemeriksaan root/link secara senyap.

Jika rootDir tidak ada, policy tidak mengubah AST, root, hasil rule, ataupun daftar file. Script lint tetap menjalankan ESLint dengan zero-warning gate. Aturan tambahan ini wajib aktif pada seluruh file yang dilint, termasuk file tooling baru. Perubahan yang mematikannya harus gagal di tes kontrak.

| Kondisi | Perilaku yang wajib dibuktikan |
| --- | --- |
| Lint normal dari repository, rootDir tidak ada | Helper Next asli memilih cwd; semua aturan lama tetap berjalan; guard tidak melakukan pencarian folder |
| rootDir muncul pada konfigurasi efektif, termasuk nilai kosong/tidak valid | Policy menghentikan lint dengan error; tidak dianggap PASS atau mengembalikan hasil kosong |
| Entry point glob dipanggil langsung/tak terduga | Modul menolak dengan error tetap sebelum pemrosesan pattern |
| Versi/caller plugin berubah atau ada pemanggil lain | Kontrak/integrity check gagal; tinjau ulang, jangan memperluas override/fallback otomatis |

Kontrak berlaku untuk perintah proyek dengan cwd repository. Menambahkan workspace, lint dari cwd lain, atau custom root merupakan perubahan kebutuhan yang harus direview dahulu.

### 4.3 Supply-chain dan batas klaim keamanan

Targetnya mengeluarkan kode/rantai rentan dari dependency graph yang benar-benar dipasang, **bukan sekadar mengganti label advisory**. Gate harus memeriksa identitas/path/package lokal hasil resolusi dari plugin, lockfile portabel, daftar dependency terpasang, tidak adanya rantai braces/micromatch/fast-glob asli pada graph yang diaudit, serta audit mentah. Nama edge/folder hasil override boleh tetap fast-glob; yang harus dibuktikan adalah identitas dan kode paket yang benar-benar di-resolve, bukan hanya nama folder.

Tidak cukup jika audit menjadi nol tetapi paket asli masih dipakai, aturan lama berkurang, helper mengembalikan folder salah, atau warning/failure disembunyikan. Audit nol juga tidak membuktikan keamanan website/billing secara menyeluruh. Local source/contract inspection dan perilaku negatif tetap diperlukan karena modul privat tidak otomatis mempunyai metadata advisory publik.

## 5. Batas file untuk implementasi setelah persetujuan

Semua berikut **rencana**, belum dibuat/diubah pada tahap ini:

| File | Perubahan yang diizinkan oleh rancangan |
| --- | --- |
| `tooling/next-root-guard/package.json` | Paket privat lokal, versi/entry point jelas, tanpa dependency/scripts |
| `tooling/next-root-guard/index.cjs` | Penolakan entry point glob dengan error tetap |
| `tooling/next-root-guard/policy.mjs` | Aturan lokal default-root-only; tidak mengubah rule Next |
| `tooling/next-root-guard/README.md` | Alasan, kontrak terbatas, owner, kompatibilitas dan syarat pelepasan guard |
| `package.json`, `package-lock.json` | Satu override exact-parent dan hasil resolusi yang ditinjau; versi/dependency lain tetap |
| `eslint.config.mjs` | Registrasi satu policy tambahan; preset/ignore/aturan existing dipertahankan |
| `tests/toolchain-security.test.mjs` | Adaptasi empat tes ke penolakan aktual, mempertahankan maksud uji default/override/config/CI; tidak menghapus kegagalan untuk membuat hijau |
| `tests/next-root-guard.test.mjs`, `tests/fixtures/sec01-lint-contract.json` | Tes kontrak/modul dan baseline seluruh aturan lama; fixture tidak menjadi file implementasi website |
| Docs/evidence checkpoint terkait | Bukti sebelum/sesudah dan keterbatasan |

**Dilarang dalam scope ini:** perubahan `src/`, `public/`, desain/billing, versi runtime, refactor umum, Node/npm major migration, konfigurasi secret/hosting, `.npmrc`, perubahan CI untuk menonaktifkan gate, atau perubahan Git/GitHub/Vercel/Supabase. Workflow 15/5 menit, Node 22, pinned actions dan full audit tetap. Jika file/flag tambahan seperti `install-links` diperlukan, hentikan dan ajukan revisi desain dahulu; jangan menambah diam-diam.

## 6. Verifikasi wajib setelah persetujuan implementasi

Mulai dari pilot terisolasi yang menyertakan local package/config dan lockfile, tanpa mengganggu preview utama. Tidak ada PoC DoS atau pattern berbahaya yang diperlukan.

1. **Resolusi/instalasi:** uji install dan install bersih `npm ci` dengan opsi default yang sama; identitas package guard tepat, tidak ada symlink absolut ke komputer pengembang, tidak perlu `--force`/`--legacy-peer-deps` atau konfigurasi tersembunyi. Periksa graph/lockfile aktual, bukan manifest saja. [Semantik npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).
2. **Modul:** `globSync`/`sync` selalu menolak input benign, termasuk string literal, glob, array dan pemanggilan tanpa argumen; error teridentifikasi, tanpa interpretasi pattern atau fallback. Tidak memodifikasi installed node_modules.
3. **Policy:** rootDir tidak ada diperbolehkan; setiap rootDir eksplisit atau inherited ditolak, termasuk `[]`, `''`, undefined, null, angka, string/array. Uji juga malformed settings.next. Jalankan konfigurasi yang dapat direpresentasikan melalui ESLint sungguhan; inherited/malformed yang ditolak oleh serializer/config validator diuji langsung pada policy juga, bukan hanya pencarian teks pada source.
4. **Kontrak konfigurasi:** semua 31 file lama tetap tercakup, file baru ikut diperiksa. Bandingkan setiap aturan lama beserta severity/options, parser, language settings, plugin lama dan ignore set dengan baseline; hanya tambahan policy keamanan yang diperbolehkan. Semua 22 aturan Next harus tetap aktif; snapshot tidak boleh ditulis ulang hanya untuk menerima pengurangan pemeriksaan.
5. **Perilaku lint negatif:** virtual fixture `<a href="/">` harus tetap memicu `@next/next/no-html-link-for-pages` terhadap root aplikasi yang diketahui. Tambahkan fixture yang membuktikan `react/jsx-key`, `react-hooks/rules-of-hooks`, `@typescript-eslint/no-explicit-any`, dan `jsx-a11y/alt-text` masih mendeteksi pelanggaran. Fixture valid tidak menghasilkan error/warning. Identifikasi rule ID, bukan menghitung sembarang error sebagai bukti.
6. **Kegagalan drift:** penonaktifan policy, custom root override, salah target/versi paket, hilangnya local package atau kembalinya dependency asli harus menyebabkan test/lint/instalasi/audit gagal. Jangan memasukkan pattern DoS sebagai tes.
7. **Quality dan audit:** jalankan seluruh tes lama+baru, lint, typecheck, build, audit produksi dan audit lengkap. Kelima target finding tidak muncul, tidak ada high/critical baru; produksi tetap nol. Raw audit tidak diberi suppression/continue-on-error.
8. **Platform/runtime:** validasi Windows dengan runtime lokal serta Node 22/Linux yang dipakai CI. Remote GitHub CI tetap NOT RUN sampai ada izin push terpisah; jangan menyamakan hasil Windows dengan CI. Smoke preview desktop/mobile dan link kontak tanpa mengirim pesan, serta pastikan source/aset/UI tidak berubah. Deployment/proteksi/recipient receipt tidak boleh disimpulkan dari smoke lokal.

Gate lokal dan gate rilis dicatat terpisah. Pilot audit bersih bukan bukti sukses instalasi di checkout utama, Linux, atau hosting. Rilis produksi tetap memerlukan gate RC/otorisasi yang sudah ada.

## 7. Definition of Done dan status saat ini

**DoD desain:** dokumen review ini menjelaskan kontrak, file, risiko, verifikasi, owner/rollback; baseline terbaca; tidak ada perubahan code/toolchain. **Belum berarti CTO menyetujui pilihan A.**

**DoD implementasi lokal yang diusulkan:** paket lokal benar-benar terpasang secara reproducible; semua aturan lama/fixture perilaku lulus; seluruh quality gate lulus; graph/audit membuktikan lima finding target hilang tanpa menutup-nutupi; source/aset website sama; bukti dapat ditinjau. Tidak boleh ditandai DONE hanya karena paket minimal audit nol.

**DoD penutupan engineering penuh:** gate platform yang berlaku selesai dan checkpoint/issue terbaca lintas sesi, dengan keterbatasan yang tetap dilaporkan. Release GO, publikasi, penutupan risiko aksesibilitas, billing dan business acceptance tetap terpisah.

**Saat dokumen ini dibuat:** hanya probe baseline lint/config di bagian 2 yang baru dijalankan. Implementasi guard/policy, install bersih, tes rancangan, audit rancangan dan runtime/CI/deployment semuanya **NOT RUN / NOT VERIFIED karena belum ada izin implementasi desain spesifik ini**. SEC-01 tetap OPEN; audit 5 high adalah hasil terakhir yang diketahui, bukan audit ulang pada tahap desain.

## 8. Risiko, kepemilikan, estimasi dan rollback

- Risiko utama: kontrak sengaja membatasi custom root; upgrade Next/plugin bisa menambah caller/API; resolusi file lokal/lockfile bisa berbeda lintas platform; mutu rule bisa tampak aktif tetapi perilakunya hilang jika tidak diuji. Semua merupakan gate, bukan asumsi aman.
- Kepemilikan yang diajukan: engineering Conqueror merawat modul, dokumentasi dan tes; CTO memutuskan perubahan kontrak/upstream release/publikasi. Persetujuan peran ini termasuk keputusan yang diminta, belum diambil otomatis.
- Estimasi awal **2–4 jam untuk pilot implementasi terisolasi**, kemudian **hingga 1 hari kerja untuk integrasi/verifikasi dan laporan**, tergantung hasil resolusi paket serta akses platform. Ini estimasi rancangan, bukan janji hasil audit nol atau jadwal mulai. Waktu tunggu keputusan/izin remote CI tidak termasuk.
- Rollback menggunakan snapshot **kondisi dirty yang benar sebelum implementasi**, bukan HEAD lama: pulihkan hanya hunk manifest/config/guard yang ditambahkan dan lockfile snapshot yang cocok; arsipkan file tooling/tes baru tanpa menghapus evidence. Jalankan kembali quality/audit dan catat bahwa lima finding dapat kembali muncul. Jangan memakai reset/checkout massal, menghapus seluruh repo, atau menimpa perubahan user yang muncul bersamaan.
- Jika aturan lama berkurang, ada hasil lint senyap/beda root, resolusi tidak reproducible, atau audit masih memuat target finding: jangan adopsi pilot. Pertahankan mitigasi semula, simpan hasil gagal, minta revisi scope; jangan lanjut ke desain website/fork besar secara otomatis.
- Lepas guard hanya setelah ada pengganti resmi/terverifikasi dan persetujuan CTO. Menghapusnya atau memperbolehkan custom root adalah perubahan kontrak baru, bukan housekeeping.

## 9. Keputusan yang diminta dan langkah berikutnya

**Tinjau pilihan A:** apakah CTO menyetujui implementasi lokal default-root-only dengan modul guard tanpa dependency, satu policy lint tambahan, batas file bagian 5 dan gate bagian 6? Ini bukan persetujuan menerima kompatibilitas glob penuh, migrasi website, risk waiver, push, deployment atau perubahan database.

Jika disetujui, langkah berikutnya menyusun rencana implementasi terperinci berdasarkan desain yang sudah direview, lalu menjalankan pilot sesuai gate. Jika kontrak ini tidak diterima, gunakan pilihan C atau ajukan desain B dengan scope/biaya maintenance terpisah. Tidak ada kode guard/policy yang dibuat pada sesi desain ini.

## CONQUEROR ENGINEERING CHECKPOINT

- Timestamp (Asia/Jakarta): 2026-10-23 18:13.
- Project: Website Conqueror Studio; Billing Core/PT. SSS tidak diubah.
- Milestone / Task: rancangan SEC-01 default-root-only untuk review CTO.
- Multica Issue ID: NOT VERIFIED.
- Repository / Branch / Commit: lokasi bagian 2; `agent/upgrade-v1.1` / `46554a03dbda44e507db76db0e310420e15fc8d6`.
- Working Tree Status: dirty pekerjaan sebelumnya, index kosong; tahap ini hanya docs/evidence.
- Current Status: **IN PROGRESS — desain DRAFT siap direview; implementasi NOT STARTED; SEC-01 OPEN.**

**Completed Work:** rancangan terbatas, pilihan/trade-off, file scope, fail-closed policy, gate kualitas dan rollback; baseline aktual 31 file/two profiles direkam.

**Technical Evidence:** dokumen ini; [baseline lint/config](../../audit/2026-10-23-sec01-design/current-lint-contract.json); [metadata config](../../audit/2026-10-23-sec01-design/current-config-metadata.json); [hash sebelum](../../audit/2026-10-23-sec01-design/source-before.json); [pembandingan sesudah](../../audit/2026-10-23-sec01-design/source-after-check.json), 32/32 sama; [ringkasan verifikasi](../../audit/2026-10-23-sec01-design/verification-summary.json). Evaluasi sebelumnya tetap historis.

**Verification Results:** probe baseline lint aktual exit 0, nol error/warning, 22 rule Next per profil. Test/typecheck/build/audit ulang NOT RUN karena tidak ada perubahan toolchain; tes rancangan/instalasi baru/CI/runtime NOT RUN. Hasil evaluasi sebelumnya tidak dilabeli sebagai hasil rancangan.

**Blockers & Risks:** kontrak/paket/policy belum disetujui/diuji; custom-root tidak didukung oleh usulan; issue/Notion mapping belum terverifikasi; konektor tidak tersedia.

**Decisions & Approvals:** CTO menyetujui penyusunan rancangan, bukan implementasi rancangan spesifik ini, penerimaan risiko, publikasi atau pesan kepada CEO.

**Sprint Task Mapping:** gate keamanan Website Sales-Ready RC masih IN PROGRESS; target Sprint 02 22 Oktober tidak dianggap tercapai oleh dokumen ini. Exact Notion task IDs NOT VERIFIED; checklist tidak diubah.

**Exact Next Action:** CTO review dan setujui/tolak pilihan A beserta pembatasan default-root sebelum rencana implementasi/pilot.

**Checkpoint Updated:** dokumen/evidence lokal tersimpan. Upaya resmi `project_checkpoint_save` **GAGAL HTTP 429 / UNAVAILABLE**, [bukti kegagalan](../../audit/2026-10-23-sec01-design/multica-sync-result.json). Tidak ada upload/attachment issue, successful readback atau update `06_SESSION_HANDOFF.md` / `07_CHECKPOINT_LOG.md` yang terverifikasi. Bukti tetap **LOCAL ONLY**. Untuk dibagikan sekarang, lampirkan dokumen ini bersama folder evidence terkait pada sesi CTO; saat konektor tersedia, ulangi mekanisme resmi dan verifikasi readback sebelum mengklaim sinkronisasi.

**Ready for Notion Verification: NO** — LOCAL ONLY; issue/task mapping dan connector readback belum terverifikasi.
