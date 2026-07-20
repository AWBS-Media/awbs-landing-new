# AWBS Landing Page

Landing page statis untuk **AWBS Network** (awbs.io) — perusahaan jasa ad-tech yang membantu publisher media mengoptimasi monetisasi iklan. Dibangun dengan **HTML + CSS + JavaScript vanilla**, tanpa framework dan tanpa build step.

## Cara Menjalankan

Cara paling sederhana — cukup buka `index.html` di browser:

```bash
open index.html        # macOS
```

Atau jalankan lewat server statis lokal (disarankan agar path & perilaku sama seperti produksi):

```bash
npx serve .
# atau
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` (atau URL yang ditampilkan `npx serve`).

## Struktur Folder

```
awbs-landing-site2/
├── index.html            # halaman utama (semua section)
├── css/
│   └── style.css         # seluruh style + design tokens + responsive
├── js/
│   ├── i18n.js           # kamus teks ID/EN + logika toggle bahasa
│   ├── main.js           # sticky header, mobile nav, smooth scroll, reveal
│   └── form.js           # validasi form lead
├── assets/
│   └── logo.png          # logo AWBS asli (dari root proyek)
├── lang/
│   ├── id.json           # referensi teks ID (sumber aktif ada di i18n.js)
│   └── en.json           # referensi teks EN
└── README.md
```

## Section Halaman

Header → Hero → Trust strip → Problem → How it works → Services → Why AWBS → Proof → Final CTA (form) → Footer. Setiap section punya `id` untuk anchor/smooth-scroll, dan semua CTA mengarah ke `#contact`.

## Bahasa (ID / EN)

- **Default: Bahasa Indonesia.** Toggle **ID / EN** ada di pojok kanan header.
- Teks yang bisa diterjemahkan ditandai atribut `data-i18n="key"` di HTML.
- Pilihan bahasa disimpan di `localStorage` (`awbs-lang`) sehingga persist saat reload.

### Cara mengedit / menambah teks

1. Buka [`js/i18n.js`](js/i18n.js) — ini **sumber kebenaran** teks yang dipakai halaman (ditanam sebagai objek agar tetap jalan saat dibuka via `file://`).
2. Tambah/ubah pasangan `"key": "teks"` di objek `I18N.id` **dan** `I18N.en`.
3. Di HTML, beri elemen atribut `data-i18n="key"` yang sama.
4. File di `lang/*.json` hanya referensi ringkas — sinkronkan bila perlu.

## Palet & Design Tokens

Diturunkan dari logo, didefinisikan sebagai CSS variables di `css/style.css`:

- Primary (biru): `#1C50A1`
- Accent (merah): `#EC1230`
- Spacing memakai grid 8pt (`--space-1` … `--space-7`).

## Form Lead

Form di section `#contact` memvalidasi nama, email, dan URL website di sisi klien. Saat ini submit **disimulasikan** (menampilkan pesan sukses). Untuk menghubungkan ke backend, lihat komentar:

```js
// TODO: hubungkan ke endpoint nyata ...
```

di [`js/form.js`](js/form.js).

## Catatan

- **Proof points (angka & testimoni) adalah data placeholder/dummy** dari brief — ganti dengan data terverifikasi sebelum launch.
- Font memakai *Plus Jakarta Sans* via Google Fonts (`<link>` di `index.html`).
