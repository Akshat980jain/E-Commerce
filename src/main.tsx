import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './services/db';
import { ThemeProvider } from './context/ThemeContext';
import PaymentProvider from './context/PaymentProvider';

// Create root element for the error message
const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Function to render the main app
const renderApp = (useMockDb = false) => {
  root.render(
    <StrictMode>
      <ThemeProvider>
        <PaymentProvider>
          {useMockDb && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 mx-auto max-w-7xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Using mock data. MongoDB connection failed. The app is running with sample data.
                  </p>
                </div>
              </div>
            </div>
          )}
          <App />
        </PaymentProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

// Function to render error message
const renderError = (message: string) => {
  root.render(
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '500px',
      margin: '100px auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      backgroundColor: '#FEF2F2',
      border: '1px solid #F87171',
      color: '#7F1D1D'
    }}>
      <h2 style={{ marginTop: 0 }}>Database Connection Error</h2>
      <p>{message}</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Troubleshooting Steps:</h3>
        <ol style={{ lineHeight: '1.5', paddingLeft: '20px' }}>
          <li>Make sure MongoDB is installed on your system</li>
          <li>Check if MongoDB service is running:
            <ul>
              <li>Windows: <code>net start MongoDB</code></li>
              <li>Mac/Linux: <code>sudo systemctl status mongod</code></li>
            </ul>
          </li>
          <li>Verify the MongoDB connection port (27017) is not blocked by a firewall</li>
          <li>Refresh the page after fixing the issue</li>
        </ol>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            backgroundColor: '#0369A1',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry Connection
        </button>
        <button 
          onClick={() => renderApp(true)} 
          style={{
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Continue with Mock Data
        </button>
      </div>
    </div>
  );
};

// Initialize database and seed data if needed
console.log('Initializing database...');
initializeDatabase().then((success) => {
  if (!success) {
    console.error('Failed to initialize database - MongoDB connection failed');
    renderError('Failed to connect to MongoDB. Database connection error occurred.');
    return;
  }
  
  console.log('Database initialized successfully, rendering app');
  renderApp();
})
.catch((error) => {
  console.error('Database initialization error:', error);
  renderError(`Error connecting to database: ${error.message}`);
});