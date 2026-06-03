import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import UserDetails from './pages/UserDetails';
import AllUsersPage from './pages/AllUsersPage';
import Inquiries from './pages/Inquiries';
import AllInquiriesPage from './pages/AllInquiriesPage';
import Revenue from './pages/Revenue';
import AllTransactionsPage from './pages/AllTransactionsPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < 1024);
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setAuthUser(null);
    navigate('/auth');
  };

  if (!authUser) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth setAuthUser={setAuthUser} />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        handleLogout={handleLogout} 
        authUser={authUser}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main className={`flex-1 w-full max-w-full min-h-screen flex flex-col overflow-x-hidden transition-all duration-300 ${isCollapsed ? 'ml-0 lg:ml-20' : 'ml-0 lg:ml-64'}`}>
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          handleLogout={handleLogout} 
          authUser={authUser}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {/* User Management — nested */}
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/all" element={<AllUsersPage />} />
            <Route path="/users/:userId" element={<UserDetails />} />

            {/* Inquiries — nested */}
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/inquiries/all" element={<AllInquiriesPage />} />

            {/* Revenue — nested */}
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/revenue/all-transactions" element={<AllTransactionsPage />} />

            {/* <Route path="/analytics" element={<Analytics />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
