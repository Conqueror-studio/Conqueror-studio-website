# Conqueror Studio Website — Dependency Security Report

Tanggal: 18 Oktober 2026, 19:06 WIB. Scope: checkout lokal website saja; tidak ada commit, push, atau deployment.

## Executive summary

Audit produksi awal mengonfirmasi **1 critical dan 3 high** pada dependency website. Setelah pembaruan patch Next.js/React, perbaikan dependency transitif, dan override PostCSS yang terarah, `npm audit --omit=dev` selesai dengan **0 vulnerabilities** (exit 0). Ini adalah hasil audit dependency lokal, **bukan** bukti bahwa seluruh aplikasi atau deployment telah aman.

Audit seluruh dependency masih menghasilkan **5 high** (exit 1). Kelimanya merupakan hitungan paket pada satu rantai development/lint: `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces@3.0.3`. Paket `braces` belum mempunyai rilis perbaikan untuk [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Jangan jalankan `npm audit fix --force` tanpa evaluasi migrasi, karena saran otomatis menurunkan `eslint-config-next` ke 14.2.35 dan dapat memutus konfigurasi lint saat ini.

## Repository dan perubahan lokal

- Repository: `D:\File Syahdan\Area 666 Conqueror Studio\Web Conqueror\website-repo`
- Branch: `agent/upgrade-v1.1`; HEAD: `46554a03dbda44e507db76db0e310420e15fc8d6`.
- Working tree masih dirty; perubahan sesi ini **belum di-commit**. File dependency yang diubah: `package.json`, `package-lock.json`. Perubahan perilaku header pada `src/components/studio-navigation.tsx` dan `src/app/globals.css` tetap lokal.
- Tidak ada perubahan pada Billing Core, Supabase, Vercel, atau GitHub remote.

## Temuan dan remediasi

| Kondisi awal | Tindakan | Kondisi setelah audit ulang |
| --- | --- | --- |
| `next@15.5.0` memicu critical pada [GHSA-9qr9-h5gf-34mp](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp), bersama advisory lainnya | Naik patch dalam jalur 15.5 ke `next@15.5.28`; `react` dan `react-dom` ke `19.1.2` | Temuan critical hilang dari audit produksi |
| `sharp` dan `source-map-js` terdeteksi high melalui rantai produksi | `npm audit fix` tanpa `--force` memperbarui ke `sharp@0.35.5` dan `source-map-js@1.2.2` | Tidak muncul lagi pada audit produksi |
| Next.js 15.5.28 masih mematok `postcss@8.4.31`; versi tersebut terdeteksi high pada [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) dan advisory terkait | Override **hanya** dependency PostCSS milik Next.js ke `8.5.23`, lalu regenerasi lockfile dan jalankan regresi | `postcss@8.5.23 overridden`; audit produksi 0 |
| Beberapa dependency development lain (termasuk `brace-expansion`, `js-yaml`) terdeteksi high | `npm audit fix` tanpa `--force` | Tidak muncul lagi; sisa hanya rantai `braces` |

Override PostCSS adalah deviasi sadar dari versi yang dipatok Next.js 15.5.28. Build lokal lulus, tetapi tetap perlu diawasi ketika Next.js berikutnya diperbarui. [Maintainer Next.js menyatakan paket PostCSS bawaan mereka berjalan pada waktu build](https://github.com/vercel/next.js/issues/93234); itu membantu menilai exposure, bukan alasan untuk mengabaikan hasil audit.

## Bukti verifikasi (dijalankan pada checkout setelah perubahan)

| Pemeriksaan | Hasil |
| --- | --- |
| `npm ls next react react-dom postcss sharp source-map-js --depth=2` | `next@15.5.28`, `react/react-dom@19.1.2`, `postcss@8.5.23 overridden`, `sharp@0.35.5`, `source-map-js@1.2.2` |
| `npm audit --omit=dev` | **PASS**, exit 0, `found 0 vulnerabilities` |
| `npm audit` | **FAIL**, exit 1, 5 high pada rantai development/lint `braces` |
| `npm test` | **PASS**, exit 0, 14/14 tests |
| `npm run lint` | **PASS**, exit 0, tanpa warning/error |
| `npm run build` | **PASS**, exit 0; static routes `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml` dihasilkan |
| Preview lokal `http://localhost:3001/` | **PASS terbatas**: pada viewport browser sekitar 822 px, header tersembunyi saat area penutup/footer di atas dan muncul kembali di hero; belum merupakan QA semua breakpoint/perangkat. Screenshot LOCAL ONLY: `docs/header-hidden-2026-10-18.png` |

Selama instalasi npm pada Windows, ada peringatan `EPERM` saat membersihkan direktori backup binary lama yang sedang dipakai preview, tetapi instalasi utama selesai exit 0. `npm` juga memberi peringatan bahwa install script `unrs-resolver` belum termasuk `allowScripts`; hal itu belum diverifikasi sebagai kegagalan runtime. Tidak ada percobaan menghapus backup directory secara manual.

## Risiko tersisa dan keputusan yang dibutuhkan

1. **Residual tooling risk:** audit penuh tetap 5 high karena `braces@3.0.3` di jalur ESLint. Versi patched belum tersedia menurut advisory dan pemeriksaan registry pada 18 Oktober. Ini tidak muncul dalam audit produksi (`--omit=dev`), tetapi lingkungan development/CI tetap harus diperlakukan sebagai area risiko, terutama jika menerima glob/pattern tak tepercaya. Keputusan owner/CTO: terima sementara dengan pemantauan upstream untuk Release Candidate, atau izinkan pekerjaan terpisah untuk mengganti/mengisolasi rantai lint. Jangan menandai audit penuh sebagai PASS.
2. **Override compatibility:** setiap kenaikan Next.js berikutnya perlu audit ulang dan uji build; override dapat dilepas jika Next.js sudah membawa PostCSS aman secara native.
3. **Release readiness terpisah:** tidak ada deployment atau pengujian penerimaan pesan WhatsApp/email. Pemeriksaan visual desktop lebar dan mobile sempit pada dependency candidate ini belum dijalankan. Keputusan aset/konten CEO masih tertunda; hasil audit 0 produksi sendiri tidak memenuhi semua Definition of Done Website Sales-Ready RC.

## Exact next action

Owner/CTO meninjau laporan dan memutuskan perlakuan terhadap residual advisory development `braces` sebelum keputusan rilis. Setelah itu jalankan QA kandidat final pada desktop/mobile dan verifikasi kanal kontak; jangan push atau deploy tanpa izin eksplisit.
