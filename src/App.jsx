import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardGIS from './pages/DashboardGIS';
import KomoditasMonitoring from './pages/KomoditasMonitoring';
import OverlapAnalysis from './pages/OverlapAnalysis';
import DSSEngine from './pages/DSSEngine';
import SocialSurveillance from './pages/SocialSurveillance';
import ReportBuilder from './pages/ReportBuilder';
import SystemConfig from './pages/SystemConfig';
import './index.css';

function App() {
  const [authUser, setAuthUser] = useState(() => {
    const saved = sessionStorage.getItem('cross-dss-user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user) => {
    setAuthUser(user);
    sessionStorage.setItem('cross-dss-user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthUser(null);
    sessionStorage.removeItem('cross-dss-user');
  };

  if (!authUser) {
    return <ThemeProvider><LoginPage onLogin={handleLogin} /></ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Header user={authUser} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardGIS />} />
              <Route path="/komoditas" element={<KomoditasMonitoring />} />
              <Route path="/overlap" element={<OverlapAnalysis />} />
              <Route path="/dss" element={<DSSEngine />} />
              <Route path="/surveillance" element={<SocialSurveillance />} />
              <Route path="/laporan" element={<ReportBuilder />} />
              <Route path="/konfigurasi" element={<SystemConfig />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
