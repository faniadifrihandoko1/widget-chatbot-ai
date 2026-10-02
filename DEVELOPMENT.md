# 🛠️ Panduan Pengembangan (Developer Guide)
### Altius Chat Widget

Dokumen ini menjelaskan alur kerja (*workflow*) lengkap bagi pengembang (developer) saat melakukan modifikasi kode, menguji perubahan secara langsung (*live preview* tanpa build), melakukan proses build ke folder `output-build/`, serta memverifikasi hasil akhir.

---

## 📂 1. Lokasi File Source yang Diedit

Saat mengembangkan atau memodifikasi widget, **jangan mengedit file di folder `output-build/` secara langsung**. Lakukan perubahan pada source files berikut:

### A. Versi Web (Desktop)
* **Logika JS & DOM**: [`index.js`](file:///d:/chat-widget/chat-widget/altius-chat-widget/index.js)  
  *Mengatur lifecycle chat, inisialisasi Shadow DOM, pemanggilan API AI, manajemen sesi, dan event handling.*
* **Styling CSS**: [`styles/chat-widget.css`](file:///d:/chat-widget/chat-widget/altius-chat-widget/styles/chat-widget.css)  
  *Mengatur tema warna, tata letak bubble chat, header, animasi mascot, sidebar riwayat, dan markdown formatting.*

### B. Versi Mobile
* **Logika JS & DOM**: [`index-mobile.js`](file:///d:/chat-widget/chat-widget/altius-chat-widget/index-mobile.js)  
  *Mengatur alur khusus perangkat mobile, layar penuh, navigasi sentuh, dan upload.*
* **Styling CSS**: [`styles/chat-widget-mobile.css`](file:///d:/chat-widget/chat-widget/altius-chat-widget/styles/chat-widget-mobile.css)  
  *Mengatur tampilan responsif optimal untuk layar smartphone.*

---

## 🔍 2. Cara Melihat Perubahan Sebelum di-Build (Live Preview)

Anda **tidak perlu melakukan build setiap kali mengubah baris kode atau CSS**. Anda dapat langsung melihat perubahannya melalui:

### 👉 Buka: [`preview.html`](file:///d:/chat-widget/chat-widget/altius-chat-widget/preview.html)

Cukup double-click file [`preview.html`](file:///d:/chat-widget/chat-widget/altius-chat-widget/preview.html) atau buka via live server / browser.

### Langkah-langkah Testing Source:
1. Di panel kiri **Target Widget**, pilih:
   * **`🖥️ Desktop (Web)`** untuk menguji `index.js`
   * **`📱 Mobile`** untuk menguji `index-mobile.js`
2. Pada dropdown **"Versi Script Build"**, pilih:
   * 👉 **`🛠️ Source (.js) - Pengembangan`**
3. Sekarang widget di dalam kanvas preview akan **langsung membaca source file `index.js` atau `index-mobile.js` beserta file CSS di `styles/`**.
4. Lakukan perubahan pada file `.js` atau `.css` di editor Anda, lalu:
   * Klik tombol **"Reload Widget"** (di kanan atas / panel kiri), atau
   * Cukup refresh halaman `preview.html`.
5. Perubahan Anda langsung terlihat seketika tanpa proses kompilasi!

> [!TIP]
> Saat memilih target **Mobile**, Anda dapat menggunakan tombol simulator di toolbar atas (**iPhone 14/15**, **Android Galaxy**, atau **Tablet**) untuk melihat bagaimana widget tampil di dalam frame smartphone sungguhan.

---

## 📦 3. Melakukan Build ke `output-build/`

Setelah perubahan selesai dikembangkan, diuji, dan dipastikan berjalan dengan baik, lakukan proses bundling dan minifikasi.

Buka terminal di folder `altius-chat-widget` dan jalankan:

```bash
# Opsi 1: Build Web & Mobile sekaligus (Direkomendasikan)
npm run build:all

# Opsi 2: Build Web saja
npm run build:web

# Opsi 3: Build Mobile saja
npm run build:mobile
```

### Apa yang Dilakukan oleh Script Build?
Script [`build.js`](file:///d:/chat-widget/chat-widget/altius-chat-widget/build.js) akan:
1. Membaca source JS (`index.js` / `index-mobile.js`) dan CSS terkait di folder `styles/`.
2. Menyuntikkan (*inline*) CSS langsung ke fungsi `loadCSS()` sehingga file JS hasil build dapat berdiri sendiri tanpa file CSS terpisah.
3. Menghasilkan file readable bundle (`.bundle.js`).
4. Mengompresi & meminifikasi kode menggunakan **Terser** (`.min.js`).
5. Menyuntikkan recovery payload ke file `.min.js` (untuk keperluan unbuild darurat).
6. Menyimpan seluruh output ke dalam folder **`output-build/`**.

### Hasil File di `output-build/`:
| File | Deskripsi | Kegunaan |
|------|-----------|----------|
| `output-build/altius-chat-widget.min.js` | Web Widget (Minified + CSS Inline) | **Produksi** (Siap dideploy) |
| `output-build/altius-chat-widget.bundle.js` | Web Widget (Readable Bundle + CSS Inline) | Debugging / Inspeksi bundle |
| `output-build/altius-chat-widget-mobile.min.js` | Mobile Widget (Minified + CSS Inline) | **Produksi Mobile** |
| `output-build/altius-chat-widget-mobile.bundle.js` | Mobile Widget (Readable Bundle) | Debugging Mobile |

---

## ✅ 4. Memverifikasi Hasil Build

Setelah proses build selesai, pastikan hasil kompilasi berjalan normal:

1. Buka kembali [`preview.html`](file:///d:/chat-widget/chat-widget/altius-chat-widget/preview.html).
2. Di dropdown **"Versi Script Build"**, pilih:
   * **`⚡ Minified (.min.js) - output-build`**
3. Klik tombol **"Buka Chat"** atau klik maskot chat di kanan bawah kanvas.
4. Lakukan tes pengiriman pesan, upload berkas, atau menu navigasi untuk memastikan hasil kompresi tidak merusak fungsionalitas.
5. Anda juga bisa membuka [`index.html`](file:///d:/chat-widget/chat-widget/altius-chat-widget/index.html) yang membaca file `output-build/altius-chat-widget.min.js` secara langsung.

---

## 📋 5. Ringkasan Siklus Kerja (Workflow Summary)

```text
[ 1. Edit Kode ]
   ├── index.js / index-mobile.js
   └── styles/chat-widget.css / styles/chat-widget-mobile.css
           │
           ▼
[ 2. Live Preview & Debug ]
   └── Buka preview.html ──► Pilih Versi "Source (.js)"
           │
           ▼
[ 3. Build ke Production ]
   └── Jalankan: npm run build:all
           │
           ▼ (Output tersimpan di folder output-build/)
[ 4. Verifikasi Build ]
   └── Buka preview.html ──► Pilih Versi "Minified (.min.js)"
           │
           ▼
[ 5. Deploy / Integrasi ]
   └── Gunakan output-build/altius-chat-widget.min.js di website target
```

---

## 🔧 6. Perintah NPM Tambahan

| Perintah | Fungsi |
|----------|--------|
| `npm run build:all` | Mem-build target Web dan Mobile ke folder `output-build/` |
| `npm run build:web` | Mem-build target Web saja |
| `npm run build:mobile` | Mem-build target Mobile saja |
| `npm run unbuild:web` | Mengekstrak kembali `index.js` dan CSS dari `output-build/altius-chat-widget.min.js` |
| `npm run unbuild:mobile` | Mengekstrak kembali `index-mobile.js` dan CSS dari versi mobile |
| `npm run format` | Memformat kode dengan Prettier |
| `npm run lint` | Menjalankan linter ESLint |
