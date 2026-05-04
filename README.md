# Altius Chat Widget 💬

Ini adalah repositori untuk Altius Chat Widget. Tersedia dokumentasi singkat dan langkah-langkah untuk mempermudah Anda dalam tahap *development*, melakukan *build*, maupun integrasi ke dalam website.

---

## 🛠 Struktur Direktori

Struktur proyek saat ini sangat sederhana dan fokus pada performa:

```text
altius-chat-widget/
├── index.js             # 🚀 Core logic widget & shadow DOM (File utama)
├── styles/
│   └── chat-widget.css  # 🎨 Tampilan dan styling antarmuka
├── build.js             # 📦 Script untuk membungkus index.js & CSS menjadi bundle/minified
├── unbuild.js           # 🔙 Script pembantu untuk mengekstrak kembali JS & CSS dari file minified
├── dev-server.js        # 🖥️ Local server untuk development test
├── package.json         # 📜 Konfigurasi package, dependencies, dan npm scripts
└── README.md            # 📖 Dokumentasi proyek
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

Bagi pengembang (Developer) yang ingin langsung mencoba memodifikasi sistem ini, berikut adalah siklus (*workflow*) kerjanya.

### 1. Memulai Environment Lokal
Pertama, pastikan semua dependencies NPM sudah terinstal (terutama untuk terser, prettier, dll).
```bash
npm install
```

### 2. Mengedit Kode
Lakukan perubahan langsung ke dalam `index.js` (logic) atau di `styles/chat-widget.css` (tampilan).

### 3. Menguji secara Lokal
Jika Anda hanya ingin mencoba tampilan pada *local browser*, kami memiliki development script:
```bash
npm run dev
```
Ini akan menjalankan *local server* (menggunakan `http-server`) di folder yang bersangkutan sehingga Anda dapat melakukan debug melalui browser dengan membuka localhost sesuai port yang tersedia. 

### 4. Melakukan Build & Minify ke Production
Bila kode telah dirasa pas dan final, Anda harus menggabungkan (`bundle`) dan melakukan kompresi (`minify`):

```bash
npm run build:prod
```
Perintah ini akan menjalankan 2 proses di balik layar:
1. `node build.js` : Mengambil CSS di `styles/chat-widget.css`, menyuntikkannya ke dalam tag `styleSheet.textContent` milik `index.js`, lalu di-output sebagai `altius-chat-widget.bundle.js` beserta bentuk dasarnya `altius-chat-widget.min.js`.
2. `terser` : Mengoptimalkan secara maksimal ukuran file `altius-chat-widget.min.js` dengan variable *mangling* agar load dari browser lebih cepat.

> Selalu gunakan versi akhir `altius-chat-widget.min.js` untuk environment Production.

---

## 🔄 Unbuild & Ekstraksi (Penting!)
Jika Anda secara tidak sengaja hanya mendapatkan versi **minified/bundled** dari orang lain atau tertimpa kode lama dan perlu memisahkan file utuhnya kembali menjadi `index.js` dan `chat-widget.css`, Anda bisa menggunakan script unbuild yang disediakan:

```bash
node unbuild.js altius-chat-widget.min.js
```
*Script ini akan mencari tag backticks inline CSS, memisahkannya kembali menjadi raw CSS, dan mengembalikan load import ke versi development. Hasil dump ini tidak me-replace langsung kode utama melainkan akan memberikan output berupa `extracted-index.js` dan directory `extracted-styles/chat-widget.css`.*

---

## 📝 Ringkasan NPM Scripts (`package.json`)

Berikut rangkuman perintah (command scripts) yang telah didefinisikan secara khusus untuk *developer*:

| Perintah (`npm run ...`) | Deskripsi Singkat |
| ----------- | ----------- |
| `dev` | Menjalankan *dev-server.js* untuk preview |
| `build` | Hanya mem-build versi non-optimized minifier |
| `minify` | Murni melakukan file mangle (terser compression) |
| `build:prod` | **[UTAMA]** Menjalankan build lengkap dan terkompresi sekaligus |
| `format` | Merapikan (Prettier) seluruh sintaks/kerapihan file konfigurasi |
| `lint` | Mencari warning / bug standard Javascript dengan ESLint |
| `watch` | Opsi auto-build (menunggu perubahan code `.js` dan `.css`) |

---
**Tips:** Jika dalam tahap development (*live preview*) di HTML tester Anda tidak ingin mem-build setiap kali ada perubahan, *arahkah script HTML* anda langsung ke:
`<script src="index.js" type="module"></script>`*(Lalu pastikan CSS path-nya sesuai relative directory nya)*.
