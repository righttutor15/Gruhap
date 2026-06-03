import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

// Global fetch interceptor to inject Admin JWT and handle expirations (RBAC / Auth protection)
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
  try {
    const saved = localStorage.getItem('adminUser');
    const token = saved ? JSON.parse(saved)?.token : null;

    if (token && url.toString().includes('/api/admin') && !url.toString().includes('/api/admin/auth')) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  } catch (e) {
    console.error('Error in fetch interceptor:', e);
  }

  const response = await originalFetch(url, options);

  if ((response.status === 401 || response.status === 403) && !url.toString().includes('/api/admin/auth')) {
    localStorage.removeItem('adminUser');
    window.location.href = '/auth';
  }

  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

