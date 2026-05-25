import { useState, useMemo } from 'react';

const systemUsers = [
  { id: 1, name: 'Admin Utama', email: 'admin@cross-dss.id', role: 'Administrator', status: 'Aktif', lastLogin: '2026-05-25 09:15' },
  { id: 2, name: 'Analis ATR/BPN', email: 'analis.atr@bpn.go.id', role: 'Analis Spasial', status: 'Aktif', lastLogin: '2026-05-24 14:30' },
  { id: 3, name: 'Operator ESDM', email: 'operator@esdm.go.id', role: 'Operator Data', status: 'Aktif', lastLogin: '2026-05-23 10:00' },
  { id: 4, name: 'Pengamat KLHK', email: 'pengamat@klhk.go.id', role: 'Viewer', status: 'Aktif', lastLogin: '2026-05-22 16:45' },
  { id: 5, name: 'Konsultan Kementan', email: 'konsultan@kementan.go.id', role: 'Analis', status: 'Nonaktif', lastLogin: '2026-04-15 08:20' },
];

const dataSources = [
  { id: 1, name: 'MOMI Minerba ESDM', url: 'https://momi.minerba.esdm.go.id/gisserver/rest/services/', type: 'ArcGIS REST', status: 'online', lastSync: '2026-05-25 08:00', layers: 'WIUP_Publish, WIUP_Terminasi' },
  { id: 2, name: 'Geoportal ESDM (GIS4)', url: 'https://geoportal.esdm.go.id/gis4/rest/services/', type: 'ArcGIS REST', status: 'online', lastSync: '2026-05-25 07:30', layers: 'Minerba MapServer' },
  { id: 3, name: 'BIG Geoservices', url: 'https://geoservices.big.go.id/arcgis/rest/services/', type: 'ArcGIS REST', status: 'online', lastSync: '2026-05-25 06:00', layers: 'PERENCANAAN_RUANG' },
  { id: 4, name: 'BIG PITTI (WMS)', url: 'https://geoservices.big.go.id/arcgis/services/PUBLIK/PERENCANAAN_RUANG/MapServer/WMSServer', type: 'WMS 1.3.0', status: 'warning', lastSync: '2026-05-24 22:00', layers: 'Layer 100 (PITTI)' },
  { id: 5, name: 'KLHK Geoportal', url: 'https://geoportal.menlhk.go.id/arcgis/rest/services/', type: 'ArcGIS REST', status: 'offline', lastSync: '2026-05-20 14:00', layers: 'PIPPIB, Kawasan Hutan' },
  { id: 6, name: 'NASA FIRMS (VIIRS)', url: 'https://firms.modaps.eosdis.nasa.gov/api/', type: 'REST API', status: 'online', lastSync: '2026-05-25 03:00', layers: 'Hotspot VIIRS/MODIS' },
];

const auditLogs = [
  { id: 1, timestamp: '2026-05-25 09:15:22', type: 'login', user: 'Admin Utama', message: 'Login berhasil dari IP 103.28.xx.xx', level: 'info' },
  { id: 2, timestamp: '2026-05-25 08:00:01', type: 'data_sync', user: 'System', message: 'Sinkronisasi IUP ESDM Minerba selesai — 8.247 records diperbarui', level: 'info' },
  { id: 3, timestamp: '2026-05-25 07:30:15', type: 'data_sync', user: 'System', message: 'Sinkronisasi HGU BIG OneMap selesai — 2.784 records', level: 'info' },
  { id: 4, timestamp: '2026-05-25 06:00:33', type: 'data_sync', user: 'System', message: 'PITTI BIG diperbarui — 4.256 overlap records', level: 'info' },
  { id: 5, timestamp: '2026-05-25 03:12:45', type: 'data_sync', user: 'System', message: 'Hotspot FIRMS diperbarui — 8 titik panas baru terdeteksi', level: 'warning' },
  { id: 6, timestamp: '2026-05-24 22:00:00', type: 'error', user: 'System', message: 'Koneksi ke KLHK Geoportal timeout setelah 5000ms — menggunakan cache lokal', level: 'error' },
  { id: 7, timestamp: '2026-05-24 16:45:18', type: 'export', user: 'Analis ATR/BPN', message: 'Ekspor laporan PDF "Audit Tumpang Tindih Papua Selatan" berhasil', level: 'info' },
  { id: 8, timestamp: '2026-05-24 14:30:05', type: 'login', user: 'Analis ATR/BPN', message: 'Login berhasil dari IP 180.244.xx.xx', level: 'info' },
  { id: 9, timestamp: '2026-05-24 10:22:33', type: 'data_sync', user: 'System', message: 'NLP Crawling selesai — 3 berita baru dianalisis, 2 sentimen negatif', level: 'warning' },
  { id: 10, timestamp: '2026-05-23 18:00:00', type: 'error', user: 'System', message: 'Rate limit API ESDM tercapai — retry dalam 60 detik', level: 'error' },
  { id: 11, timestamp: '2026-05-23 10:00:12', type: 'login', user: 'Operator ESDM', message: 'Login berhasil dari IP 114.125.xx.xx', level: 'info' },
  { id: 12, timestamp: '2026-05-22 20:15:00', type: 'data_sync', user: 'System', message: 'Cache GeoJSON Papua Selatan diperbarui — 15.2 MB total', level: 'info' },
];

const tabs = [
  { id: 'demo', label: 'Demo Mode', icon: '🎮' },
  { id: 'sources', label: 'Sumber Data', icon: '🔗' },
  { id: 'users', label: 'Pengguna', icon: '👥' },
  { id: 'audit', label: 'Audit Log', icon: '📋' },
];

export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState('demo');
  const [demoMode, setDemoMode] = useState(true);
  const [auditFilter, setAuditFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const filteredLogs = useMemo(() => {
    if (auditFilter === 'all') return auditLogs;
    return auditLogs.filter(l => l.type === auditFilter);
  }, [auditFilter]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return systemUsers;
    return systemUsers.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  }, [userSearch]);

  const renderDemoMode = () => (
    <div>
      <div className="sc-toggle-row">
        <div className="sc-toggle-info">
          <div className="sc-toggle-label">Mode Sumber Data</div>
          <div className="sc-toggle-desc">{demoMode ? '🔴 Offline Cache — Menggunakan dataset lokal Papua Selatan' : '🟢 Live API — Terhubung ke server ESDM, BIG, dan KLHK'}</div>
        </div>
        <button className={`sc-switch ${demoMode ? 'active' : ''}`} onClick={() => setDemoMode(!demoMode)} aria-label="Toggle demo mode" />
      </div>

      <h3 style={{ fontSize: '0.95rem', marginBottom: 12, marginTop: 20 }}>Status Koneksi Server</h3>
      <div className="sc-status-grid">
        {dataSources.slice(0, 6).map(src => (
          <div key={src.id} className="sc-status-card">
            <div className={`sc-status-dot ${demoMode ? 'offline' : src.status}`} />
            <div className="sc-status-info">
              <div className="sc-status-name">{src.name}</div>
              <div className="sc-status-url">{src.type}</div>
              <div className="sc-status-time">Sync: {src.lastSync}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>📦 Cache Offline Dataset</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { name: 'IUP Minerba', size: '4.8 MB', records: '8,247', updated: '2026-05-25' },
            { name: 'HGU Kelapa Sawit', size: '6.2 MB', records: '2,784', updated: '2026-05-25' },
            { name: 'PITTI Overlap', size: '2.1 MB', records: '4,256', updated: '2026-05-24' },
            { name: 'PSN Papua Selatan', size: '1.5 MB', records: '24', updated: '2026-05-25' },
            { name: 'Hotspot FIRMS', size: '0.3 MB', records: '8', updated: '2026-05-25' },
            { name: 'Social Incidents', size: '0.8 MB', records: '12', updated: '2026-05-22' },
          ].map((cache, i) => (
            <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{cache.name}</div>
              <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{cache.records} records</span><span>{cache.size}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: 2 }}>Updated: {cache.updated}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: 12 }}>🔄 Refresh Semua Cache</button>
      </div>
    </div>
  );

  const renderDataSources = () => (
    <div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sumber</th>
              <th>URL Endpoint</th>
              <th>Tipe</th>
              <th>Status</th>
              <th>Last Sync</th>
              <th>Layers</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.map(src => (
              <tr key={src.id}>
                <td style={{ fontWeight: 600 }}>{src.name}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.url}</td>
                <td><span className="badge badge-info">{src.type}</span></td>
                <td>
                  <span className={`badge ${src.status === 'online' ? 'badge-low' : src.status === 'warning' ? 'badge-medium' : 'badge-high'}`}>
                    {src.status === 'online' ? '● Online' : src.status === 'warning' ? '● Lambat' : '● Offline'}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{src.lastSync}</td>
                <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{src.layers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <button className="btn-primary">🔄 Test Semua Koneksi</button>
        <button className="btn-secondary">📋 Salin Konfigurasi</button>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <div className="filter-bar">
        <input className="filter-input" placeholder="🔍 Cari pengguna..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
        <button className="btn-primary">+ Tambah Pengguna</button>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Login Terakhir</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{user.email}</td>
                <td><span className="badge badge-info">{user.role}</span></td>
                <td>
                  <span className={`badge ${user.status === 'Aktif' ? 'badge-low' : 'badge-high'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>Edit</button>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem', color: 'var(--alert-danger)' }}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditLog = () => (
    <div>
      <div className="filter-bar">
        <div className="filter-pills">
          {['all', 'login', 'data_sync', 'export', 'error'].map(type => (
            <button key={type} className={`filter-pill ${auditFilter === type ? 'active' : ''}`} onClick={() => setAuditFilter(type)}>
              {type === 'all' ? '📋 Semua' : type === 'login' ? '🔐 Login' : type === 'data_sync' ? '🔄 Sync' : type === 'export' ? '📄 Export' : '❌ Error'}
            </button>
          ))}
        </div>
      </div>
      <div className="sc-audit-timeline">
        {filteredLogs.map(log => (
          <div key={log.id} className="sc-audit-item">
            <div className="sc-audit-time">{log.timestamp.split(' ')[1]}</div>
            <div className="sc-audit-type">
              <span className={`badge ${log.level === 'error' ? 'badge-high' : log.level === 'warning' ? 'badge-medium' : 'badge-info'}`}>
                {log.type}
              </span>
            </div>
            <div className="sc-audit-message">
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.user}</span>
              {' — '}{log.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚙️ Konfigurasi Sistem</h1>
        <p className="page-subtitle">Pengaturan demo mode, sumber data, pengguna, dan audit log Cross-DSS</p>
      </div>

      <div className="page-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`page-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'demo' && renderDemoMode()}
      {activeTab === 'sources' && renderDataSources()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'audit' && renderAuditLog()}
    </div>
  );
}
