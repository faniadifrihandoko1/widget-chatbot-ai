# Altius Chat Widget 💬

Ini adalah repositori untuk Altius Chat Widget. Tersedia dokumentasi singkat dan langkah-langkah untuk mempermudah Anda dalam tahap *development*, melakukan *build*, maupun integrasi ke dalam website.

---

## 🛠 Struktur Direktori

Struktur proyek saat ini sangat sederhana dan fokus pada performa:

```text
altius-chat-widget/
├── index.js             # 🚀 Core logic widget Web (Desktop)
├── index-mobile.js      # 📱 Core logic widget Mobile
├── styles/
│   ├── chat-widget.css        # 🎨 Tampilan dan styling Web
│   └── chat-widget-mobile.css # 🎨 Tampilan dan styling Mobile
├── preview.html         # 🧪 Testing Lab & Live Preview (tanpa build)
├── index.html           # 🖥️ Halaman demo mandiri
├── build.js             # 📦 Script build (output ke folder output-build/)
├── output-build/        # 📁 Folder hasil build (.min.js & .bundle.js)
├── unbuild.js           # 🔙 Script recovery/ekstraksi kode
├── package.json         # 📜 Script npm & dependencies
├── DEVELOPMENT.md       # 📖 Panduan lengkap developer
└── README.md            # 📖 Dokumentasi umum
```

---

## 💻 Panduan Instalasi & Inisialisasi

Untuk memasang widget ini pada website Anda, yang perlu Anda lakukan hanyalah menambahkan variabel konfigurasi global di objek `window`, dan memanggil script `altius-chat-widget.min.js`.

Tambahkan *snippet* berikut di bagian tag `<body>` terbawah atau `<head>` pada website Anda:

```html
<!-- 1. Konfigurasi Widget -->
<script>
  window.session_id = ""; // (Opsional) Biarkan kosong jika tidak ada session ter-simpan
  window.chat_api_key = "KODE_API_KEY_ANDA"; // (Wajib)
  window.chat_api_tenant = "KODE_TENANT_ANDA"; // (Wajib)
  window.personal_data = "Data Personal JSON / Teks"; // (Wajib) Profile spesifik untuk bot
  
  // Custom API URL (Opsional)
  // window.ALTIUS_API_BASE_URL = "https://...";
</script>

<!-- 2. Panggil Script Widget -->
<script src="path/to/altius-chat-widget.min.js"></script>
```

---

## 👨‍💻 Workflow Development Terpadu

Panduan lengkap dapat dibaca di: **[`DEVELOPMENT.md`](DEVELOPMENT.md)**.

Berikut rangkuman alur kerjanya:

### 1. Mengedit Kode
Lakukan perubahan pada file source:
* **Web (Desktop)**: `index.js` (logika) & `styles/chat-widget.css` (tampilan)
* **Mobile**: `index-mobile.js` (logika) & `styles/chat-widget-mobile.css` (tampilan)

### 2. Live Preview Sebelum Build (Tanpa Perlu Build)
Untuk melihat perubahan langsung tanpa harus mem-build setiap kali:
1. Buka file **`preview.html`** di browser.
2. Pada dropdown **Versi Script Build**, pilih **`🛠️ Source (.js) - Pengembangan`**.
3. Pilih target **`🖥️ Desktop (Web)`** atau **`📱 Mobile`**.
4. Klik **"Reload Widget"** untuk melihat perubahan kode secara instan.

### 3. Melakukan Build ke `output-build/`
Setelah kode selesai diuji dan siap dirilis:
```bash
# Build Web & Mobile sekaligus
npm run build:all

# Atau build per target
npm run build:web
npm run build:mobile
```
Seluruh file hasil kompresi dan inlining CSS akan masuk ke folder **`output-build/`**:
* `output-build/altius-chat-widget.min.js` (Produksi Web)
* `output-build/altius-chat-widget-mobile.min.js` (Produksi Mobile)

### 4. Memverifikasi Hasil Build
Di `preview.html`, ganti versi ke **`⚡ Minified (.min.js) - output-build`** atau buka `index.html` untuk memverifikasi performa build final.

---

## 🔄 Unbuild & Pemulihan Darurat
Jika Anda memerlukan ekstraksi kembali kode source dari file minified:
```bash
npm run unbuild:web
npm run unbuild:mobile
```

---

## 📝 Ringkasan NPM Scripts (`package.json`)

| Perintah | Deskripsi |
|----------|-----------|
| `npm run build:all` | **[UTAMA]** Build Web & Mobile sekaligus ke `output-build/` |
| `npm run build:web` | Build versi Web saja |
| `npm run build:mobile` | Build versi Mobile saja |
| `npm run unbuild:web` | Ekstrak kembali source Web dari `output-build/` |
| `npm run unbuild:mobile` | Ekstrak kembali source Mobile dari `output-build/` |
| `npm run format` | Merapikan kode dengan Prettier |
| `npm run lint` | Menjalankan linter ESLint |
