# Altius Chat Widget - Refactored Version

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
- `addRippleEffect(button)` - Tambah efek ripple
- `formatTime(date)` - Format waktu
- `scrollToBottom(element)` - Scroll ke bawah
- `resetAnimation(element)` - Reset animasi
- `addEventListenerSafe(element, event, handler)` - Event listener dengan error handling
- `debounce(func, wait)` - Debounce function
- `throttle(func, limit)` - Throttle function
- `isMobileDevice()` - Deteksi device mobile
- `isTouchDevice()` - Deteksi device touch

## Responsive Design

Widget mendukung berbagai ukuran layar:

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px
- **Extra Small**: < 320px

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Optimizations

- **Debouncing**: Input events di-debounce untuk performa
- **Throttling**: Scroll events di-throttle
- **Lazy Loading**: Komponen dimuat saat diperlukan
- **Event Delegation**: Event handling yang efisien
- **CSS Animations**: Animasi menggunakan CSS untuk performa optimal

## Error Handling

- **API Errors**: Penanganan error API yang robust
- **Network Errors**: Fallback untuk masalah jaringan
- **DOM Errors**: Error handling untuk operasi DOM
- **Validation**: Validasi input dan data

## Development

### Menambah Fitur Baru

1. Buat file baru di direktori yang sesuai
2. Export fungsi/class yang diperlukan
3. Import di file yang membutuhkan
4. Update dokumentasi

### Modifikasi Tema

1. Edit file `config/theme.js`
2. Update CSS di `styles/chatWidget.css` jika diperlukan
3. Test di berbagai device

### Testing

```javascript
// Test widget
const widget = new ChatWidget();
await widget.init();

// Test API service
const apiService = new ChatAPIService();
const result = await apiService.initialize();
```

## Troubleshooting

### Widget tidak muncul

- Pastikan `window.chat_api_key` sudah diset
- Cek console untuk error
- Pastikan file CSS sudah di-inject

### API tidak berfungsi

- Cek network tab di browser
- Pastikan endpoint API benar
- Verifikasi token dan tenant

### Styling tidak sesuai

- Cek file `styles/chatWidget.css`
- Pastikan CSS tidak di-override
- Test di browser yang berbeda

## Changelog

### v1.0.0 (Refactored)

- Refactor struktur kode menjadi modular
- Pemisahan logic dan styling
- Penambahan error handling
- Optimasi performa
- Dokumentasi yang lebih lengkap

## License

MIT License

# Altius Chat Widget Preview

## Cara Melihat Preview Widget

### 1. Buka File Preview

Buka file `preview.html` di browser Anda. Anda bisa:

- Double-click file `preview.html`
- Atau drag file ke browser
- Atau buka melalui local server

### 2. Widget akan Otomatis Muncul

Setelah halaman dimuat, widget chat akan muncul di pojok kanan bawah halaman dengan:

- 🟢 Tombol chat berwarna merah
- 💬 Icon chat yang bisa diklik
- 🎨 Desain modern dengan animasi

### 3. Konfigurasi yang Diperlukan

Untuk widget berfungsi penuh, Anda perlu mengatur variabel berikut di **Console Browser** (F12):

```javascript
// API Configuration
window.chat_api_key = 'YOUR_ACTUAL_API_KEY';
window.chat_api_tenant = 'YOUR_ACTUAL_TENANT_ID';

// User Data
window.personal_data = {
  name: 'Nama Pengguna',
  email: 'user@example.com',
  phone: '+6281234567890',
};
```

### 4. Fitur Widget yang Bisa Dicoba

#### 🎯 Interaksi Dasar

- **Klik tombol chat** - Buka/m tutup popup chat
- **Ketik pesan** - Masukkan pesan di input field
- **Tekan Enter** - Kirim pesan
- **Klik tombol kirim** - Kirim pesan dengan animasi ripple

#### 🎨 Animasi & Efek

- **Hover effects** - Tombol berubah warna saat di-hover
- **Smooth transitions** - Animasi buka/tutup popup
- **Typing indicator** - Titik-titik animasi saat bot mengetik
- **Message animations** - Pesan muncul dengan slide effect

#### 📱 Responsive Design

- **Desktop** - Widget ukuran normal (360px width)
- **Mobile** - Widget menyesuaikan ukuran layar
- **Touch friendly** - Optimized untuk perangkat touch

### 5. Troubleshooting

#### Widget Tidak Muncul?

1. Pastikan file `altius-chat-widget.min.js` ada di folder yang sama
2. Buka Developer Tools (F12) dan lihat tab Console untuk error
3. Pastikan JavaScript diaktifkan di browser

#### API Error?

1. Periksa konfigurasi API key dan tenant di console
2. Pastikan endpoint API bisa diakses
3. Lihat error di tab Network di Developer Tools

#### Styling Issues?

1. Widget menggunakan CSS yang di-inject secara otomatis
2. Pastikan tidak ada CSS yang konflik
3. Coba refresh halaman

### 6. Kustomisasi

#### Mengubah Warna

Edit file `altius-chat-widget.min.js` dan cari bagian `theme.colors`:

```javascript
colors: {
    primary: "#1EC0AA",        // Warna utama
    primaryDark: "#179e8c",    // Warna utama gelap
    secondary: "#10b981",      // Warna sekunder
    // ... lainnya
}
```

#### Mengubah Posisi

Widget default di pojok kanan bawah. Untuk mengubah, edit CSS class `.ai-altius-altius-chat-widget`:

```css
.ai-altius-altius-chat-widget {
  position: fixed;
  bottom: 20px; /* Jarak dari bawah */
  right: 20px; /* Jarak dari kanan */
  /* Ubah ke left: 20px untuk pojok kiri */
}
```

### 7. Integrasi ke Website

Untuk menggunakan widget di website Anda:

1. **Upload file** `altius-chat-widget.min.js` ke server
2. **Include script** di HTML:

```html
<script src="path/to/altius-chat-widget.min.js"></script>
```

3. **Set konfigurasi** sebelum script:

```html
<script>
  window.chat_api_key = 'YOUR_API_KEY';
  window.chat_api_tenant = 'YOUR_TENANT_ID';
  window.personal_data = {
    name: 'User Name',
    email: 'user@example.com',
  };
</script>
```

### 8. Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

---

**Note**: Widget ini menggunakan ES6 modules dan modern JavaScript features. Pastikan browser Anda mendukung fitur tersebut.
