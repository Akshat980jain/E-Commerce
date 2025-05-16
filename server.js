import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Get port from environment variable (Render sets this)
const PORT = process.env.PORT || 3000;

// Create express app
const app = express();

// In production, serve the built files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  
  // Handle all routes by serving index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
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