// Unbuild script untuk Altius Chat Widget
// Usage:
//   node unbuild.js                                   → extract dari altius-chat-widget.min.js (web)
//   node unbuild.js altius-chat-widget.min.js         → explicit web
//   node unbuild.js altius-chat-widget-mobile.min.js  → extract mobile
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Helper ─────────────────────────────────────────────────────────────────
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Extracted: ${path.relative(__dirname, filePath)}`);
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
  }
}

// ── Deteksi target dari nama file ─────────────────────────────────────────
function detectTarget(sourceFile) {
  if (sourceFile.includes('mobile')) return 'mobile';
  return 'web';
}

// ── Default fallback CSS key per-target ───────────────────────────────────
const FALLBACK_CSS_KEY = {
  web: 'styles/chat-widget.css',
  mobile: 'styles/chat-widget-mobile.css',
};
const FALLBACK_JS_KEY = {
  web: 'index.js',
  mobile: 'index-mobile.js',
};

// ── Fungsi utama ───────────────────────────────────────────────────────────
function extractFiles() {
  const sourceFile = process.argv[2] || 'altius-chat-widget.min.js';
  const sourcePath = path.join(__dirname, sourceFile);
  const target = detectTarget(sourceFile);

  console.log(`🔄 Extracting from: ${sourceFile}  (target: ${target})`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ File '${sourceFile}' tidak ditemukan!`);
    process.exit(1);
  }

  const content = fs.readFileSync(sourcePath, 'utf8');

  // ── METODE 1: Recovery dari payload __ALTIUS_SRC__ ──────────────────────
  const recoveryMatch = content.match(
    /var __ALTIUS_SRC__\s*=\s*JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/
  );

  if (recoveryMatch && recoveryMatch[1]) {
    console.log('🔑 Ditemukan embedded recovery payload!');
    try {
      const payload = JSON.parse(decodeURIComponent(recoveryMatch[1]));

      // Ambil key dari payload itu sendiri (tersimpan saat build)
      const jsKey  = payload.jsFile  || FALLBACK_JS_KEY[target];
      const cssKey = payload.cssFile || FALLBACK_CSS_KEY[target];

      const jsContent  = Buffer.from(payload[jsKey],  'base64').toString('utf8');
      const cssContent = Buffer.from(payload[cssKey], 'base64').toString('utf8');

      // Output ke folder extracted-<target>/ agar tidak tumpang tindih
      const outDir = `extracted-${target}`;
      const jsOutName  = jsKey.replace('index', 'extracted-index'); // extracted-index.js / extracted-index-mobile.js
      const cssOutName = cssKey; // styles/chat-widget.css atau styles/chat-widget-mobile.css

      writeFile(path.join(__dirname, outDir, jsOutName),  jsContent);
      writeFile(path.join(__dirname, outDir, cssOutName), cssContent);

      console.log(`\n📊 Verifikasi:`);
      console.log(`   ${jsKey}  : ${Buffer.byteLength(jsContent, 'utf8')} bytes`);
      console.log(`   ${cssKey} : ${Buffer.byteLength(cssContent, 'utf8')} bytes`);

      console.log(`\n🎉 Unbuild [${target}] BERHASIL 100% byte-for-byte!`);
      console.log(`📁 Files generated in "${outDir}/":`);
      console.log(`   - ${jsOutName}  ← identik dengan ${jsKey}`);
      console.log(`   - ${cssOutName} ← identik dengan ${cssKey}`);
      return;
    } catch (err) {
      console.error('⚠️ Gagal decode payload:', err.message);
      console.log('🔁 Mencoba metode fallback...');
    }
  } else {
    console.log('⚠️ Recovery payload tidak ditemukan. Mencoba metode fallback...');
  }

  // ── METODE 2: Fallback – extract CSS yang di-inline ──────────────────────
  const jsKey  = FALLBACK_JS_KEY[target];
  const cssKey = FALLBACK_CSS_KEY[target];
  const outDir = `extracted-${target}`;

  let cssContent = '';
  let indexJsContent = content;

  // Cari: style.textContent = `...`;
  const cssMatch = content.match(/style\.textContent\s*=\s*`([\s\S]*?)`;/);
  if (cssMatch && cssMatch[1]) {
    cssContent = cssMatch[1].replace(/\\`/g, '`');
    // Kembalikan loadCSS() ke bentuk <link> tag
    indexJsContent = content.replace(
      /function loadCSS\(\)\s*\{[\s\S]*?document\.head\.appendChild\(style\);\s*\}/,
      `function loadCSS() {\n    const link = document.createElement('link');\n    link.rel = 'stylesheet';\n    link.type = 'text/css';\n    link.href = '${cssKey}';\n    document.head.appendChild(link);\n  }`
    );
    console.log('✅ CSS berhasil diekstrak dari inline style!');
  }

  // Format lama: styleSheet.textContent
  if (!cssContent) {
    const cssMatch2 = content.match(/styleSheet\.textContent\s*=\s*`([\s\S]*?)`;/);
    if (cssMatch2 && cssMatch2[1]) {
      cssContent = cssMatch2[1].replace(/\\`/g, '`');
      console.log('✅ CSS berhasil diekstrak dari styleSheet.textContent!');
    }
  }

  // Bersihkan recovery payload dari output
  indexJsContent = indexJsContent.replace(
    /\nvar __ALTIUS_SRC__=JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/,
    ''
  );

  const jsOutName = jsKey.replace('index', 'extracted-index');
  writeFile(path.join(__dirname, outDir, jsOutName), indexJsContent);
  if (cssContent) {
    writeFile(path.join(__dirname, outDir, cssKey), cssContent);
  }

  console.log(`\n⚠️  Unbuild [${target}] selesai dengan mode FALLBACK.`);
  console.log('   Kode mungkin tidak identik 100% karena recovery payload tidak tersedia.');
  console.log('   Untuk hasil 100% identik: build ulang dari source dengan "npm run build".');
}

extractFiles();
