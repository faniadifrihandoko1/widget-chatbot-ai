// Build script untuk Altius Chat Widget
// Usage:
//   node build.js                  → build web (default)
//   node build.js --target=web     → build web
//   node build.js --target=mobile  → build mobile
//   node build.js --all            → build web + mobile
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Parse CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const buildAll = args.includes('--all');
const targetArg = args.find((a) => a.startsWith('--target='));
const target = buildAll ? 'all' : (targetArg ? targetArg.split('=')[1] : 'web');

// ── Config per-target ──────────────────────────────────────────────────────
const TARGETS = {
  web: {
    label: 'Web',
    jsFile: 'index.js',
    cssFile: 'styles/chat-widget.css',
    bundleOut: 'altius-chat-widget.bundle.js',
    minOut: 'altius-chat-widget.min.js',
  },
  mobile: {
    label: 'Mobile',
    jsFile: 'index-mobile.js',
    cssFile: 'styles/chat-widget-mobile.css',
    bundleOut: 'altius-chat-widget-mobile.bundle.js',
    minOut: 'altius-chat-widget-mobile.min.js',
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return '';
  }
}

function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Built: ${path.relative(__dirname, filePath)}`);
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
  }
}

// ── Build satu target ──────────────────────────────────────────────────────
function buildTarget(cfg) {
  console.log(`\n🚀 Building Altius Chat Widget [${cfg.label}]...`);

  // Baca source files
  const main = readFile(path.join(__dirname, cfg.jsFile));
  const css = readFile(path.join(__dirname, cfg.cssFile));

  if (!main || !css) {
    console.error(`❌ Gagal membaca source files untuk target "${cfg.label}". Build dibatalkan.`);
    return;
  }

  // Inline CSS ke dalam fungsi loadCSS()
  let modifiedMain = main.replace(
    /function loadCSS\(\)\s*\{[\s\S]*?document\.head\.appendChild\(link\);\s*\}/,
    `function loadCSS() {\n    const style = document.createElement('style');\n    style.textContent = \`${css.replace(/`/g, '\\`')}\`;\n    document.head.appendChild(style);\n  }`
  );

  // Bundle header
  const bundled = `// Altius Chat Widget [${cfg.label}] - Bundled Version
// Generated on: ${new Date().toISOString()}
// Source: ${cfg.jsFile} + ${cfg.cssFile}

${modifiedMain}`.trim();

  const bundlePath = path.join(__dirname, cfg.bundleOut);
  const minPath = path.join(__dirname, cfg.minOut);

  // Tulis bundle (readable)
  writeFile(bundlePath, bundled);

  // Step 1: Minify dengan Terser
  console.log(`🔧 Minifying ${cfg.bundleOut} → ${cfg.minOut}...`);
  try {
    execSync(
      `npx.cmd terser "${cfg.bundleOut}" -o "${cfg.minOut}" --compress`,
      { cwd: __dirname, stdio: 'pipe' }
    );
  } catch {
    execSync(
      `node_modules/.bin/terser "${cfg.bundleOut}" -o "${cfg.minOut}" --compress`,
      { cwd: __dirname, stdio: 'pipe' }
    );
  }

  // Step 2: Inject recovery payload ke .min.js
  console.log(`💉 Injecting recovery payload ke ${cfg.minOut}...`);
  const minifiedContent = readFile(minPath);

  const recoveryPayload = {
    jsFile: cfg.jsFile,
    cssFile: cfg.cssFile,
    [cfg.jsFile]: Buffer.from(main).toString('base64'),
    [cfg.cssFile]: Buffer.from(css).toString('base64'),
  };

  const payloadJson = encodeURIComponent(JSON.stringify(recoveryPayload));
  const recoveryLine = `\nvar __ALTIUS_SRC__=JSON.parse(decodeURIComponent("${payloadJson}"));`;

  writeFile(minPath, minifiedContent + recoveryLine);

  console.log(`\n🎉 [${cfg.label}] Build selesai!`);
  console.log(`   📄 ${cfg.bundleOut}  (development, readable)`);
  console.log(`   📦 ${cfg.minOut}  (production, dengan embedded recovery)`);
}

// ── Entry point ────────────────────────────────────────────────────────────
if (target === 'all') {
  buildTarget(TARGETS.web);
  buildTarget(TARGETS.mobile);
} else if (TARGETS[target]) {
  buildTarget(TARGETS[target]);
} else {
  console.error(`❌ Target tidak dikenal: "${target}"`);
  console.error('   Gunakan: --target=web | --target=mobile | --all');
  process.exit(1);
}
