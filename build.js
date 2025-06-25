// Build script untuk Altius Chat Widget
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk membaca file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

// Fungsi untuk menulis file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Built: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Fungsi untuk menggabungkan file
function bundleFiles() {
  console.log('🚀 Building Altius Chat Widget...');

  // Baca semua file yang diperlukan
  const main = readFile(path.join(__dirname, 'index.js'));
  const css = readFile(path.join(__dirname, 'styles/chat-widget.css'));

  // Buat CSS style tag
  const cssStyle = `
// Inject CSS styles
(function() {
  const style = document.createElement('style');
  style.textContent = \`${css}\`;
  document.head.appendChild(style);
})();

`;

  // Modifikasi main code untuk bundle version
  let modifiedMain = main
    // Hapus fungsi loadCSS() karena CSS sudah di-inject
    .replace(
      /\/\/ Load CSS[\s\S]*?function loadCSS\(\)[\s\S]*?}/,
      '// CSS loaded via bundle'
    )
    // Hapus pemanggilan loadCSS() di fungsi init
    .replace(/\/\/ Load CSS[\s\S]*?loadCSS\(\);/g, '// CSS already loaded');

  // Gabungkan semua file
  const bundled = `
// Altius Chat Widget - Bundled Version
// Generated on: ${new Date().toISOString()}

${cssStyle}
${modifiedMain}
  `.trim();

  // Tulis file bundled
  writeFile(path.join(__dirname, 'altius-chat-widget.bundle.js'), bundled);

  // Tulis file minified (basic minification)
  const minified = bundled
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\/\/.*$/gm, '') // Remove single line comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*{\s*/g, '{') // Remove spaces around braces
    .replace(/\s*}\s*/g, '}') // Remove spaces around braces
    .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
    .replace(/\s*,\s*/g, ',') // Remove spaces around commas
    .replace(/\s*:\s*/g, ':') // Remove spaces around colons
    .trim();

  writeFile(path.join(__dirname, 'altius-chat-widget.min.js'), minified);

  console.log('🎉 Build completed successfully!');
  console.log('📁 Files generated:');
  console.log('   - altius-chat-widget.bundle.js (development)');
  console.log('   - altius-chat-widget.min.js (production)');
}

// Jalankan build
bundleFiles();
