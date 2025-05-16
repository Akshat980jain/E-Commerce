import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Get port from environment variable (Render sets this)
const PORT = process.env.PORT || 3000;

// Create express app
const app = express();

// Log information about the current environment
console.log('Current directory:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Checking if dist directory exists...');

const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.resolve(distPath, 'index.html');

try {
  if (fs.existsSync(distPath)) {
    console.log('dist directory exists');
    if (fs.existsSync(indexPath)) {
      console.log('index.html exists');
    } else {
      console.log('index.html does NOT exist in the dist directory');
      // List files in the dist directory to debug
      console.log('Files in dist directory:', fs.readdirSync(distPath));
    }
  } else {
    console.log('dist directory does NOT exist');
    console.log('Files in current directory:', fs.readdirSync(__dirname));
  }
} catch (err) {
  console.error('Error checking files:', err);
}

// In production, serve the built files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  
  // Handle all routes by serving index.html
  app.get('*', (req, res) => {
    const indexFilePath = path.resolve(__dirname, 'dist', 'index.html');
    
    // Check if the file exists before trying to serve it
    if (fs.existsSync(indexFilePath)) {
      res.sendFile(indexFilePath);
    } else {
      res.status(404).send('Build files not found. The application may not have been built correctly.');
    }
  });
}

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Start the server and bind to 0.0.0.0 (all network interfaces)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down server');
  server.close(() => {
    console.log('Server closed');
  });
});

// Log any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
}); 