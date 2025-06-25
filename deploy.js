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

// Fungsi untuk membaca file
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
    'preview.html',
    'test-bundle.html',
  ];

  filesToCopy.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);

    if (fs.existsSync(sourcePath)) {
      copyFile(sourcePath, destPath);
    }
  });

  // Copy file hasil build yang sudah diperbaiki
  const buildFiles = [
    'altius-chat-widget.bundle.js',
    'altius-chat-widget.min.js',
  ];

  buildFiles.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);

    if (fs.existsSync(sourcePath)) {
      copyFile(sourcePath, destPath);
    }
  });

  // Buat file development test dengan konfigurasi yang benar
  const devTestHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Altius Chat Widget - Development Test</title>
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
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        pre {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Altius Chat Widget - Development Test</h1>
        
        <div class="success">
            <strong>✅ Widget Status:</strong> Ready for testing
        </div>
        
        <div class="info">
            <h3>📋 Setup Instructions:</h3>
            <p>1. Open browser console (F12)</p>
            <p>2. Set your API credentials:</p>
            <pre>window.chat_api_key = "your-api-key";
window.chat_api_tenant = "your-tenant";
window.personal_data = "your-data";</pre>
            <p>3. Refresh the page</p>
            <p>4. Widget should appear in bottom-right corner</p>
        </div>
        
        <div class="warning">
            <strong>⚠️ Note:</strong> This is a development version. For production, use the minified version.
        </div>
        
        <h3>🔧 Available Files:</h3>
        <ul>
            <li><strong>altius-chat-widget.bundle.js</strong> - Development version (readable)</li>
            <li><strong>altius-chat-widget.min.js</strong> - Production version (minified)</li>
            <li><strong>test-bundle.html</strong> - Test page with bundle version</li>
            <li><strong>preview.html</strong> - Preview page with original index.js</li>
        </ul>
        
        <h3>🌐 Testing URLs:</h3>
        <ul>
            <li><a href="test-bundle.html">Test Bundle Version</a></li>
            <li><a href="preview.html">Preview Original Version</a></li>
            <li><a href="example.html">Example Implementation</a></li>
        </ul>
    </div>

    <!-- Setup demo credentials -->
    <script>
        // Demo credentials (replace with real ones for testing)
        window.session_id = '';
        window.chat_api_key = "demo-api-key";
        window.chat_api_tenant = "demo-tenant";
        window.personal_data = "Demo User Data";
    </script>

    <!-- Include widget (using bundle version) -->
    <script src="altius-chat-widget.bundle.js"></script>
</body>
</html>`;

  const devTestPath = path.join(distDir, 'dev-test.html');
  writeFile(devTestPath, devTestHtml);

  // Buat file package.json untuk development
  const devPackageJson = {
    name: 'altius-chat-widget-dev',
    version: '1.0.0',
    description: 'Development version of Altius Chat Widget',
    scripts: {
      start: 'python -m http.server 8000',
      serve: 'npx http-server -p 8000',
      test: "echo 'Open http://localhost:8000/dev-test.html'",
    },
    devDependencies: {
      'http-server': '^14.1.1',
    },
  };

  const devPackagePath = path.join(distDir, 'package.json');
  writeFile(devPackagePath, JSON.stringify(devPackageJson, null, 2));

  console.log('\n🎉 Deployment completed successfully!');
  console.log('📁 Files created in dist/ directory:');
  console.log('   - altius-chat-widget.bundle.js (development)');
  console.log('   - altius-chat-widget.min.js (production)');
  console.log('   - dev-test.html (development test page)');
  console.log('   - test-bundle.html (bundle test page)');
  console.log('   - preview.html (original preview)');
  console.log('   - example.html (example implementation)');
  console.log('\n🌐 To start development server:');
  console.log('   1. cd dist');
  console.log('   2. npm install (optional)');
  console.log('   3. npm start');
  console.log('   4. Open http://localhost:8000/dev-test.html');
  console.log('\n📦 For production deployment:');
  console.log('   - Use altius-chat-widget.min.js');
  console.log('   - Include in your website');
}

// Jalankan deployment
deploy();
