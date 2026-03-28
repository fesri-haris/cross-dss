import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardGIS from './pages/DashboardGIS';
import RSMonitoring from './pages/RSMonitoring';
import RFIDTracking from './pages/RFIDTracking';
import DataAnalysis from './pages/DataAnalysis';
import NewsReports from './pages/NewsReports';
import AdminSettings from './pages/AdminSettings';
import './index.css';

function App() {
  const [authUser, setAuthUser] = useState(() => {
    const saved = sessionStorage.getItem('ikhi-user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user) => {
    setAuthUser(user);
    sessionStorage.setItem('ikhi-user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthUser(null);
    sessionStorage.removeItem('ikhi-user');
  };

  if (!authUser) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Header user={authUser} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardGIS />} />
              <Route path="/monitoring" element={<RSMonitoring />} />
              <Route path="/rfid" element={<RFIDTracking />} />
              <Route path="/analysis" element={<DataAnalysis />} />
              <Route path="/news" element={<NewsReports />} />
              <Route path="/admin" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
