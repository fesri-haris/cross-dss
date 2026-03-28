import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard GIS', path: '/', icon: '🗺️', desc: 'Peta Interaktif RS TNI' },
  { id: 'monitoring', label: 'RS Monitoring', path: '/monitoring', icon: '🏥', desc: 'Status Seluruh RS' },
  { id: 'rfid', label: 'RFID Tracking', path: '/rfid', icon: '📡', desc: 'Pelacakan Aset & Pasien' },
  { id: 'analysis', label: 'Data Analysis', path: '/analysis', icon: '📊', desc: '15 Parameter Kinerja' },
  { id: 'news', label: 'News & Reports', path: '/news', icon: '📰', desc: 'Berita & Laporan DSS' },
  { id: 'admin', label: 'Admin Settings', path: '/admin', icon: '⚙️', desc: 'Pengaturan Sistem' },
];

const initialNotifications = [
  { id: 1, type: 'critical', icon: '🔴', title: 'RSPPN Cold Storage Alert', detail: 'Suhu Cold Storage Darah Unit B melebihi batas: 5.2°C (maks 4°C). Risiko kerusakan 4 unit PRC Gol.O-. Tim logistik sudah dinotifikasi.', time: '2 menit lalu', ts: Date.now() - 120000, read: false, rs: 'RSPPN' },
  { id: 2, type: 'critical', icon: '🚨', title: 'Evakuasi Udara Aktif', detail: 'Helikopter Bell 412 mendarat di Helipad RSPPN — 1 prajurit Yonif 315 dengan luka tembak latihan tempur. IGD sudah standby.', time: '8 menit lalu', ts: Date.now() - 480000, read: false, rs: 'RSPPN' },
  { id: 3, type: 'warning', icon: '🟡', title: 'ICU BOR Kritis: 91%', detail: 'Kapasitas ICU/ICCU RSPPN mencapai 91% (82/90 bed). Hanya 8 bed tersedia. Koordinasi dengan RSPAD untuk backup rujukan.', time: '14 menit lalu', ts: Date.now() - 840000, read: false, rs: 'RSPPN' },
  { id: 4, type: 'warning', icon: '⚠️', title: 'Stok Darah O- Rendah', detail: 'Stok darah Gol.O- hanya tersisa 4 unit di bank darah RSPPN. Permintaan resupply ke PMI sudah dikirim, ETA 14:00 WIB.', time: '22 menit lalu', ts: Date.now() - 1320000, read: false, rs: 'RSPPN' },
  { id: 5, type: 'info', icon: '🟢', title: 'Sinkronisasi SIMRS Selesai', detail: 'E-Medical Record 17 RS TNI telah tersinkronisasi 100% via Secure LAN. 148.920 rekam medis terverifikasi. Zero error log.', time: '45 menit lalu', ts: Date.now() - 2700000, read: false, rs: 'Nasional' },
  { id: 6, type: 'info', icon: '✅', title: 'MRI 3T Kalibrasi Selesai', detail: 'MRI Siemens MAGNETOM Vida 3T (SN: SMV-2025-001) kalibrasi tahunan selesai. Uptime: 99.2%. Siap operasional.', time: '1 jam lalu', ts: Date.now() - 3600000, read: false, rs: 'RSPPN' },
  { id: 7, type: 'system', icon: '⚙️', title: 'Maintenance Ventilator V-0012', detail: 'Algoritma prediktif mendeteksi anomali pola tekanan pada Ventilator Hamilton #ICU-V-12 (RSPAD). Dialihkan ke idle untuk inspeksi.', time: '2 jam lalu', ts: Date.now() - 7200000, read: true, rs: 'RSPAD' },
  { id: 8, type: 'system', icon: '🛡️', title: 'Firewall Threat Report', detail: 'FortiGate 3700F memblokir 847 ancaman dalam 24 jam terakhir. 12 percobaan brute-force SSH, 3 DDoS attempt. Status: SECURED.', time: '3 jam lalu', ts: Date.now() - 10800000, read: true, rs: 'RSPPN' },
  { id: 9, type: 'info', icon: '📊', title: 'Laporan DSS Auto-Generated', detail: 'Laporan Kesiapan Operasional RS TNI periode Maret 2026 telah di-generate otomatis. Skor: 87/100. Tersedia di modul Reports.', time: '4 jam lalu', ts: Date.now() - 14400000, read: true, rs: 'Nasional' },
  { id: 10, type: 'critical', icon: '🔴', title: 'RSAD Dustira: Kebocoran O2', detail: '[RESOLVED] Kebocoran O2 manifold lantai 2 RSAD Dustira. Diperbaiki dalam 4 jam. Pasien telah dievakuasi sementara. Status: HIJAU.', time: '6 jam lalu', ts: Date.now() - 21600000, read: true, rs: 'RSAD Dustira' },
  { id: 11, type: 'warning', icon: '🔶', title: 'Distribusi Obat Terlambat', detail: 'Pengiriman obat esensial ke RSAD Wirasakti terlambat 2 hari. Stok analgesik tinggal 30%. Jalur logistik alternatif diaktifkan.', time: '8 jam lalu', ts: Date.now() - 28800000, read: true, rs: 'RSAD Wirasakti' },
  { id: 12, type: 'system', icon: '🔄', title: 'SIMRS v4.2 Patch Update', detail: 'Patch keamanan SIMRS v4.2.1 berhasil dideploy ke 12 RS. Perbaikan: XSS vulnerability, session timeout fix, EMR search optimization.', time: '12 jam lalu', ts: Date.now() - 43200000, read: true, rs: 'Nasional' },
];

const typeConfig = {
  critical: { label: 'Kritis', color: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
  warning: { label: 'Peringatan', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  info: { label: 'Info', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  system: { label: 'Sistem', color: '#64748b', glow: 'rgba(100,116,139,0.3)' },
};

const filterTabs = [
  { key: 'all', label: 'Semua', icon: '📋' },
  { key: 'critical', label: 'Kritis', icon: '🔴' },
  { key: 'warning', label: 'Peringatan', icon: '🟡' },
  { key: 'info', label: 'Info', icon: '🟢' },
  { key: 'system', label: 'Sistem', icon: '⚙️' },
];

export default function Header({ user, onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);
  const [notifFilter, setNotifFilter] = useState('all');
  const [dismissing, setDismissing] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

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
    system: notifs.filter(n => n.type === 'system' && !n.read).length,
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 44 44" width="40" height="40">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#f0d65b" />
                    <stop offset="100%" stopColor="#c9a02e" />
                  </linearGradient>
                  <filter id="logoGlow"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <circle cx="22" cy="22" r="20" fill="none" stroke="url(#goldGrad)" strokeWidth="1.8" filter="url(#logoGlow)" opacity="0.9" />
                <circle cx="22" cy="22" r="17" fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.4" />
                <path d="M22 6 L24.5 15.5 L34 15.5 L26.5 21.5 L29 31 L22 26 L15 31 L17.5 21.5 L10 15.5 L19.5 15.5 Z" fill="url(#goldGrad)" filter="url(#logoGlow)" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">Integrated KEMHAN Health Intelligence System</span>
              <span className="brand-sub">Dashboard Smart AI Monitoring & Analysis</span>
            </div>
          </div>
        </div>
        <div className="header-info">
          <div className="header-status-group">
            <div className="header-secure"><span className="secure-dot"></span>Secure LAN</div>
            <div className="header-datacenter"><span className="dc-dot"></span>Data Center OK</div>
          </div>
          <div className="header-user">
            <div className="user-avatar">{user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'KI'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Kolonel Fulan'}</span>
              <span className="user-role">{user?.role || 'Super Admin'}</span>
            </div>
          </div>

          {/* ═══ MODERN NOTIFICATION SYSTEM ═══ */}
          <div className="header-notification" ref={notifRef} onClick={() => setNotifOpen(!notifOpen)}>
            <div className={`notif-bell-wrap ${unreadCount > 0 ? 'has-unread' : ''}`}>
              <span className="notif-bell">🔔</span>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              {unreadCount > 0 && <span className="notif-bell-glow"></span>}
            </div>
            {notifOpen && (
              <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
                <div className="notif-header">
                  <div className="notif-header-left">
                    <span className="nht-icon">🛰️</span>
                    <span className="notif-header-title">IKHI SYSTEM ALERT</span>
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
                      <p>Tidak ada notifikasi {notifFilter !== 'all' ? `tipe ${filterTabs.find(f => f.key === notifFilter)?.label}` : ''}</p>
                    </div>
                  )}
                  {filteredNotifs.map((n, i) => {
                    const cfg = typeConfig[n.type] || typeConfig.info;
                    const isDismissing = dismissing.has(n.id);
                    return (
                      <div key={n.id}
                        className={`notif-item ${n.read ? 'read' : ''} ${n.type} ${isDismissing ? 'dismissing' : ''}`}
                        style={{ '--notif-delay': `${i * 40}ms`, '--type-color': cfg.color, '--type-glow': cfg.glow }}
                        onClick={() => markRead(n.id)}>
                        <div className="notif-item-stripe" style={{ background: cfg.color }}></div>
                        <div className={`notif-item-icon ${n.type}`}>{n.icon}</div>
                        <div className="notif-item-content">
                          <div className="notif-item-top">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-item-time">{n.time}</span>
                          </div>
                          <span className="notif-item-detail">{n.detail}</span>
                          <div className="notif-item-footer">
                            <span className="notif-item-rs" style={{ color: cfg.color }}>{n.rs}</span>
                            <span className={`notif-type-badge ${n.type}`}>{cfg.label}</span>
                          </div>
                        </div>
                        {!n.read && <span className={`notif-dot ${n.type}`}></span>}
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
          <div className="header-datetime">
            <span className="hd-time">{currentTime}</span>
            <span className="hd-date">{currentDate}</span>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}>
            <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
          </button>
          <button className="header-logout" title="Logout" onClick={onLogout}><span>⏻</span></button>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} title="Menu">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {navItems.map(item => (
          <NavLink key={item.id} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={item.path === '/'}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
