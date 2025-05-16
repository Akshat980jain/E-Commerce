import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

async function createServer() {
  const app = express();
  
  // In production, serve the built files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // Handle all routes by serving index.html
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, create a Vite dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
  }
  
  // Start the server and listen on the specified port
  // Bind to 0.0.0.0 to listen on all available network interfaces (required for Render)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Error starting server:', err);
}); 