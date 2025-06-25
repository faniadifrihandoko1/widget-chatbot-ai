// Deployment script untuk Altius Chat Widget
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk membuat direktori jika tidak ada
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Fungsi untuk copy file
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`✅ Copied: ${source} → ${destination}`);
  } catch (error) {
    console.error(`❌ Error copying ${source}:`, error.message);
  }
}

// Fungsi untuk membaca dan menggabungkan file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return '';
  }
}

// Fungsi untuk menulis file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Written: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
  }
}

// Fungsi untuk build dan deploy
function deploy() {
  console.log('🚀 Starting deployment...');
  
  // Buat direktori dist
  const distDir = path.join(__dirname, 'dist');
  ensureDir(distDir);
  
  // Copy file-file yang diperlukan
  const filesToCopy = [
    'example.html',
    'README.md',
    'package.json',
    'styles/chatWidget.css'
  ];
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
      // Buat direktori tujuan jika diperlukan
      const destDir = path.dirname(destPath);
      ensureDir(destDir);
      
      copyFile(sourcePath, destPath);
    }
  });
  
  // Build bundled JavaScript
  console.log('📦 Building bundled JavaScript...');
  
  const filesToBundle = [
    'config/theme.js',
    'config/constants.js',
    'services/api.js',
    'utils/helpers.js',
    'components/ChatWidget.js',
    'index.js'
  ];
  
  let bundledContent = `// Altius Chat Widget - Bundled Version
// Generated on: ${new Date().toISOString()}
// This file is auto-generated. Do not edit directly.

`;
  
  filesToBundle.forEach(file => {
    const filePath = path.join(__dirname, file);
    const content = readFile(filePath);
    if (content) {
      bundledContent += `\n// ${file}\n${content}\n`;
    }
  });
  
  // Tulis file bundled
  const bundledPath = path.join(distDir, 'altius-chat-widget.bundle.js');
  writeFile(bundledPath, bundledContent);
  
  // Buat file minified sederhana
  const minifiedContent = bundledContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\/\/.*$/gm, '') // Remove single line comments
    .replace(/\s+/g, ' ') // Replace multiple spaces
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .trim();
  
  const minifiedPath = path.join(distDir, 'altius-chat-widget.min.js');
  writeFile(minifiedPath, minifiedContent);
  
  // Buat file test sederhana
  const testHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Altius Chat Widget - Test Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1EC0AA;
            text-align: center;
        }
        .info {
            background: #e6faf8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #1EC0AA;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Altius Chat Widget Test</h1>
        
        <div class="info">
            <h3>Setup Instructions:</h3>
            <p>1. Open browser console (F12)</p>
            <p>2. Set your API credentials:</p>
            <pre>window.chat_api_key = "your-api-key";
window.chat_api_tenant = "your-tenant";</pre>
            <p>3. Refresh the page</p>
            <p>4. Widget should appear in bottom-right corner</p>
        </div>
        
        <p>This is a test page for the Altius Chat Widget. The widget should appear in the bottom-right corner of the screen.</p>
        
        <p>If you don't see the widget, check the browser console for any error messages.</p>
    </div>

    <!-- Setup demo credentials -->
    <script>
        // Demo credentials (replace with real ones)
        window.chat_api_key = "demo-api-key";
        window.chat_api_tenant = "demo-tenant";
        window.personal_data = {
            name: "Demo User",
            email: "demo@example.com"
        };
    </script>

    <!-- Include widget -->
    <script src="altius-chat-widget.min.js"></script>
</body>
</html>`;
  
  const testPath = path.join(distDir, 'test.html');
  writeFile(testPath, testHtml);
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log('📁 Files created in dist/ directory:');
  console.log('   - altius-chat-widget.bundle.js (development)');
  console.log('   - altius-chat-widget.min.js (production)');
  console.log('   - test.html (test page)');
  console.log('   - example.html (example page)');
  console.log('\n🌐 To test locally:');
  console.log('   1. cd dist');
  console.log('   2. python -m http.server 8000');
  console.log('   3. Open http://localhost:8000/test.html');
}

// Jalankan deployment
deploy(); 