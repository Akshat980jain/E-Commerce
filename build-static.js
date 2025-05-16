import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting static build process...');

// Run the Vite build
try {
  console.log('Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Vite build completed successfully.');
} catch (error) {
  console.error('Error during Vite build:', error);
  process.exit(1);
}

// Verify the dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Check if index.html exists in the dist directory
const indexPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.log('Index file not found, creating a minimal index.html...');
  
  // Create a minimal index.html file
  const minimalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickKart</title>
</head>
<body>
  <div id="root">
    <h1>QuickKart API Server</h1>
    <p>This is the QuickKart API server. The API is available at <a href="/api">/api</a>.</p>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(indexPath, minimalHtml);
  console.log('Created minimal index.html file.');
}

// Create a CSS file if it doesn't exist
const cssDir = path.join(distDir, 'assets');
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

// List the contents of the dist directory
console.log('Contents of dist directory:');
const distContents = fs.readdirSync(distDir, { withFileTypes: true });
distContents.forEach(item => {
  const itemType = item.isDirectory() ? 'directory' : 'file';
  console.log(`- ${item.name} (${itemType})`);
  
  // If it's a directory, list its contents too
  if (item.isDirectory()) {
    const subDir = path.join(distDir, item.name);
    const subContents = fs.readdirSync(subDir);
    subContents.forEach(subItem => {
      console.log(`  - ${subItem}`);
    });
  }
});

console.log('Static build process completed successfully.'); 