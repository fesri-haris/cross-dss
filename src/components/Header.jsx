import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Peta Utama', icon: '🗺️' },
  { path: '/komoditas', label: 'Komoditas', icon: '📊' },
  { path: '/overlap', label: 'Tumpang Tindih', icon: '⚠️' },
  { path: '/dss', label: 'AI/DSS', icon: '🤖' },
  { path: '/surveillance', label: 'Surveillance', icon: '📰' },
  { path: '/laporan', label: 'Laporan', icon: '📄' },
  { path: '/konfigurasi', label: 'Konfigurasi', icon: '⚙️' },
];

const notifications = [
  { id: 1, type: 'critical', title: 'Hotspot Baru Terdeteksi', message: 'VIIRS mendeteksi 3 titik panas baru di konsesi PT. Korindo', time: '5 menit lalu', read: false },
  { id: 2, type: 'warning', title: 'Overlap Teridentifikasi', message: 'Konflik baru HGU vs IUP di Merauke area seluas 450 ha', time: '1 jam lalu', read: false },
  { id: 3, type: 'info', title: 'Sync Data ESDM Selesai', message: 'Data IUP Minerba berhasil diperbarui dari server ESDM', time: '3 jam lalu', read: true },
  { id: 4, type: 'warning', title: 'Sensor Gambut Kritis', message: 'Water table Animha turun di bawah -40cm. Rawan kebakaran.', time: '6 jam lalu', read: false },
  { id: 5, type: 'info', title: 'Berita Baru Diproses', message: '3 artikel baru tentang konflik agraria Merauke telah dianalisis NLP', time: '12 jam lalu', read: true },
];

const typeConfig = {
  critical: { label: 'Kritis', color: '#FF2E93', glow: 'rgba(255,46,147,0.3)', icon: '🔴' },
  warning: { label: 'Peringatan', color: '#FFB800', glow: 'rgba(255,184,0,0.3)', icon: '🟡' },
  info: { label: 'Info', color: '#00FF88', glow: 'rgba(0,255,136,0.3)', icon: '🟢' },
};

const filterTabs = [
  { key: 'all', label: 'Semua', icon: '📋' },
  { key: 'critical', label: 'Kritis', icon: '🔴' },
  { key: 'warning', label: 'Peringatan', icon: '🟡' },
  { key: 'info', label: 'Info', icon: '🟢' },
];

export default function Header({ user, onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const [notifFilter, setNotifFilter] = useState('all');
  const [dismissing, setDismissing] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' }) + ' WIB');
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close notif
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotif = useCallback((id, e) => {
    e.stopPropagation();
    setDismissing(prev => new Set([...prev, id]));
    setTimeout(() => {
      setNotifs(prev => prev.filter(n => n.id !== id));
      setDismissing(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 350);
  }, []);

  const filteredNotifs = notifFilter === 'all' ? notifs : notifs.filter(n => n.type === notifFilter);

  const countByType = {
    critical: notifs.filter(n => n.type === 'critical' && !n.read).length,
    warning: notifs.filter(n => n.type === 'warning' && !n.read).length,
    info: notifs.filter(n => n.type === 'info' && !n.read).length,
  };

  const userInitials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || user?.avatar || 'U';

  return (
    <header className="header">
      <div className="header-top">
        {/* Brand / Logo */}
        <div className="header-brand">
          <div className="header-logo-container">
            <div className="header-logo-icon">
              <svg viewBox="0 0 36 36" width="32" height="32">
                <defs>
                  <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#7B61FF" />
                  </linearGradient>
                  <filter id="headerGlow"><feGaussianBlur stdDeviation="1" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <path d="M18 3 L30 10 L30 22 C30 28 24 33 18 35 C12 33 6 28 6 22 L6 10 Z" fill="none" stroke="url(#headerGrad)" strokeWidth="1.5" filter="url(#headerGlow)" />
                <rect x="12" y="13" width="12" height="9" rx="1.5" fill="none" stroke="url(#headerGrad)" strokeWidth="0.8" opacity="0.8" />
                <line x1="18" y1="12" x2="18" y2="23" stroke="#00D4FF" strokeWidth="0.4" opacity="0.4" />
                <line x1="11" y1="17.5" x2="25" y2="17.5" stroke="#00D4FF" strokeWidth="0.4" opacity="0.4" />
                <circle cx="15" cy="15.5" r="1.2" fill="#00D4FF" opacity="0.7" />
                <circle cx="21" cy="19.5" r="0.9" fill="#7B61FF" opacity="0.7" />
              </svg>
            </div>
            <div className="header-brand-text">
              <span className="header-brand-title">CROSS-DSS</span>
              <span className="header-brand-sub">Decision Support System</span>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="header-controls">
          {/* Status indicators */}
          <div className="header-status-group">
            <div className="header-secure"><span className="header-secure-dot" />Secure</div>
            <div className="header-datacenter"><span className="header-dc-dot" />Online</div>
          </div>

          {/* Date/Time */}
          <div className="header-datetime">
            <span className="header-time">{currentTime}</span>
            <span className="header-date">{currentDate}</span>
          </div>

          {/* Notification Bell */}
          <div className="notif-wrapper" ref={notifRef}>
            <button className={`notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`} onClick={() => setNotifOpen(!notifOpen)} title="Notifikasi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              {unreadCount > 0 && <span className="notif-bell-glow" />}
            </button>

            {notifOpen && (
              <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
                <div className="notif-header">
                  <div className="notif-header-left">
                    <span className="notif-header-icon">🛰️</span>
                    <span className="notif-header-title">CROSS-DSS ALERTS</span>
                  </div>
                  <div className="notif-header-right">
                    {unreadCount > 0 && (
                      <button className="notif-clear" onClick={markAllRead}>
                        ✓ Tandai semua dibaca
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="notif-filter-tabs">
                  {filterTabs.map(ft => (
                    <button key={ft.key} className={`notif-ft ${notifFilter === ft.key ? 'active' : ''}`}
                      onClick={() => setNotifFilter(ft.key)}>
                      <span>{ft.icon}</span>
                      <span>{ft.label}</span>
                      {ft.key !== 'all' && countByType[ft.key] > 0 && (
                        <span className="notif-ft-count">{countByType[ft.key]}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="notif-body">
                  {filteredNotifs.length === 0 && (
                    <div className="notif-empty">
                      <span>📭</span>
                      <p>Tidak ada notifikasi{notifFilter !== 'all' ? ` tipe ${filterTabs.find(f => f.key === notifFilter)?.label}` : ''}</p>
                    </div>
                  )}
                  {filteredNotifs.map((n, i) => {
                    const cfg = typeConfig[n.type] || typeConfig.info;
                    const isDismissAnim = dismissing.has(n.id);
                    return (
                      <div key={n.id}
                        className={`notif-item ${n.read ? 'read' : ''} ${n.type} ${isDismissAnim ? 'dismissing' : ''}`}
                        style={{ '--notif-delay': `${i * 40}ms`, '--type-color': cfg.color, '--type-glow': cfg.glow }}
                        onClick={() => markRead(n.id)}>
                        <div className="notif-item-stripe" style={{ background: cfg.color }} />
                        <div className={`notif-item-icon ${n.type}`}>{cfg.icon}</div>
                        <div className="notif-item-content">
                          <div className="notif-item-top">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-item-time">{n.time}</span>
                          </div>
                          <span className="notif-item-detail">{n.message}</span>
                          <div className="notif-item-footer">
                            <span className={`notif-type-badge ${n.type}`}>{cfg.label}</span>
                          </div>
                        </div>
                        {!n.read && <span className={`notif-dot ${n.type}`} />}
                        <button className="notif-dismiss-btn" onClick={(e) => dismissNotif(n.id, e)} title="Hapus">✕</button>
                      </div>
                    );
                  })}
                </div>

                <div className="notif-footer">
                  <div className="notif-footer-stats">
                    <span>📊 {notifs.length} total</span>
                    <span>🔴 {countByType.critical} kritis</span>
                    <span>🟡 {countByType.warning} peringatan</span>
                  </div>
                  <button className="notif-all-btn">Lihat Semua Log Aktivitas →</button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button className="header-theme-toggle" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}>
            <span className="header-theme-icon">{isDark ? '☀️' : '🌙'}</span>
          </button>

          {/* User profile */}
          <div className="header-user">
            <div className="header-user-avatar">{userInitials}</div>
            <div className="header-user-info">
              <span className="header-user-name">{user?.name || 'User'}</span>
              <span className="header-user-role">{user?.role || 'Viewer'}</span>
            </div>
          </div>

          {/* Logout */}
          <button className="header-logout" title="Logout" onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>

          {/* Mobile menu toggle */}
          <button className="header-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} title="Menu">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`header-nav ${mobileMenuOpen ? 'nav-mobile-open' : ''}`}>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={item.path === '/'}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
