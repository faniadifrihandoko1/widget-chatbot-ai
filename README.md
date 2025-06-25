# Altius Chat Widget - Refactored Version

## 🚀 Workflow Pengembangan & Deploy (Langkah Mudah)

Berikut langkah-langkah mudah untuk mengembangkan, preview, minify, dan deploy widget ini:

### 1. Edit Kode

- Edit file yang ingin diubah (misal: `index.js`, file komponen, CSS, dsb).

### 2. Build & Minify (Terser)

- Jalankan perintah berikut di terminal:
  ```bash
  npm run build:prod
  ```
  Ini akan:
  - Build file baru (`altius-chat-widget.bundle.js`)
  - Minify dengan Terser (`altius-chat-widget.min.js`)

### 3. Preview/Test di Lokal

- Jalankan server lokal di folder `dist`:
  ```bash
  cd dist
  npm install   # (hanya pertama kali, opsional)
  npm start
  ```
- Buka browser ke:
  - `http://localhost:8000/dev-test.html` (untuk development)
  - `http://localhost:8000/test-bundle.html` (untuk test bundle)
- Cek apakah widget muncul dan berfungsi.

### 4. Perbaiki Jika Ada Bug

- Jika ada yang kurang, ulangi langkah 1-3 sampai hasilnya sesuai.

### 5. Commit & Push ke GitHub

- Setelah yakin hasil sudah benar:
  ```bash
  git add .
  git commit -m "Deskripsi perubahan"
  git push origin <nama-branch-anda>
  ```
- Pastikan branch yang di-push adalah branch yang di-link ke Netlify.

### 6. Netlify Auto-Deploy

- Netlify akan otomatis build & deploy dari GitHub.
- Tunggu beberapa menit, lalu cek website Netlify Anda (misal: `https://altius-chat-bot.netlify.app`).

### 7. Test di Production

- Buka website Netlify Anda.
- Cek widget di halaman yang menggunakan:
  ```html
  <script src="https://altius-chat-bot.netlify.app/altius-chat-widget.min.js"></script>
  ```
- Pastikan widget tampil dan berfungsi.

---

**Tips:**

- Untuk preview cepat, cukup edit lalu `npm run build:prod` dan refresh browser di `localhost:8000`.
- Untuk production, selalu gunakan file `.min.js` hasil minify.
- Jika ada error di production, cek Console dan ulangi proses di atas.

---

Widget chat yang telah direfactor dengan struktur yang lebih modular dan maintainable.

## Struktur File

```
altius-chat-widget/
├── config/
│   ├── theme.js          # Konfigurasi tema dan styling
│   └── constants.js      # Konstanta dan data default
├── services/
│   └── api.js           # Service untuk komunikasi API
├── utils/
│   └── helpers.js       # Fungsi-fungsi helper
├── components/
│   └── ChatWidget.js    # Komponen utama widget
├── styles/
│   └── chatWidget.css   # File CSS terpisah
├── index.js             # File utama untuk inisialisasi
└── README.md           # Dokumentasi
```

## Fitur

- **Modular Architecture**: Kode dipisah menjadi modul-modul yang terorganisir
- **Service Layer**: Pemisahan logic API ke service terpisah
- **Theme System**: Konfigurasi tema yang fleksibel
- **Helper Functions**: Fungsi-fungsi utilitas yang reusable
- **Component-based**: Struktur komponen yang mudah di-maintain
- **Responsive Design**: Mendukung berbagai ukuran layar
- **Error Handling**: Penanganan error yang lebih baik

## Cara Penggunaan

### 1. Setup Dependencies

Pastikan file-file berikut sudah ada di window object:

```javascript
window.chat_api_key = 'your-api-key';
window.chat_api_tenant = 'your-tenant';
window.personal_data = {}; // Optional
```

### 2. Import dan Inisialisasi

```javascript
// Import widget
import './altius-chat-widget/index.js';

// Widget akan auto-initialize
// Atau bisa juga manual:
window.AltiusChatWidget.init();
```

### 3. Konfigurasi Tema

```javascript
// Akses konfigurasi tema
const theme = window.AltiusChatWidget.config;

// Modifikasi tema jika diperlukan
theme.colors.primary = '#your-color';
```

## API Reference

### ChatWidget Class

#### Methods

- `init()` - Inisialisasi widget
- `toggleChat()` - Toggle buka/tutup chat
- `sendMessage()` - Kirim pesan
- `renderMessage(content, isUser, customTime)` - Render pesan
- `showTypingIndicator()` - Tampilkan indikator typing
- `hideTypingIndicator()` - Sembunyikan indikator typing
- `updateHeaderElements()` - Update elemen header
- `destroy()` - Hapus widget dari DOM

### ChatAPIService Class

#### Methods

- `initialize()` - Inisialisasi service (session + user agent)
- `createSession()` - Buat session baru
- `fetchUserAgentDetails()` - Ambil detail user agent
- `sendMessage(prompt, chatHistory)` - Kirim pesan ke API
- `getToken()` - Ambil token dari window
- `getTenant()` - Ambil tenant dari window

## Konfigurasi

### Theme Configuration

File `config/theme.js` berisi semua konfigurasi visual:

```javascript
export const theme = {
  colors: {
    primary: '#1EC0AA',
    // ... more colors
  },
  spacing: {
    xs: '4px',
    // ... more spacing
  },
  // ... more configurations
};
```

### Constants

File `config/constants.js` berisi konstanta dan data default:

```javascript
export const API_ENDPOINTS = {
  CREATE_SESSION: '...',
  CHAT: '...',
  USER_AGENT_DETAILS: '...',
};

export const DEFAULT_USER_AGENT_DATA = {
  useragent_name: 'Altius People',
  bot_name: 'Altius Assistant',
  // ...
};
```

## Helper Functions

File `utils/helpers.js` berisi fungsi-fungsi utilitas:

- `injectStyles(styles)` - Inject CSS ke head
- `createElement(className, innerHTML)` - Buat elemen DOM
- `
