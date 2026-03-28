import { useState, useEffect, useRef, useCallback } from 'react';
import { systemSettings } from '../data/hospitalData';
import {
  architectureTiers, connectionProtocols, securityLayers,
  apiEndpoints, wsChannels, integrationSteps,
  dataStandards, rsRequirements,
} from '../data/integrationData';

const roleColors = { 'Super Admin':'#D4AF37', 'Admin RS':'#3b82f6', 'IT Admin':'#10b981', 'Viewer':'#8b5cf6', 'Operator':'#06b6d4' };
const roleIcons = { 'Super Admin':'🎖️', 'Admin RS':'🏥', 'IT Admin':'💻', 'Viewer':'👁️', 'Operator':'⚙️' };

const securityMetrics = [
  { label:'Network Uptime', value:'99.97%', icon:'🌐', status:'optimal', progress:99.97, color:'#10b981' },
  { label:'Firewall Status', value:'Active', icon:'🛡️', status:'protected', progress:100, color:'#3b82f6' },
  { label:'Threat Detection', value:'0 Threats', icon:'🔍', status:'secure', progress:100, color:'#10b981' },
  { label:'Encryption', value:'AES-256', icon:'🔐', status:'encrypted', progress:100, color:'#D4AF37' },
  { label:'SSL Certificate', value:'Valid', icon:'📜', status:'valid until Dec 2027', progress:85, color:'#8b5cf6' },
  { label:'Last Vulnerability Scan', value:'0 Found', icon:'🐛', status:'06:00 WIB today', progress:100, color:'#10b981' },
];

const systemCards = [
  { title:'Data Center', icon:'🏢', items:[['Type','Type A (Tier 4)'],['Location','Jakarta, Indonesia'],['Backup','Real-time Replication'],['Storage','2.4 PB / 5 PB (48%)'],['Availability','99.99% SLA'],['Cooling','N+1 Redundancy']], color:'#3b82f6' },
  { title:'SIMRS Integration', icon:'💊', items:[['Version','v4.2.1'],['Connected RS','17 / 17 ✅'],['Sync Interval','5 menit'],['Last Sync','07:25 WIB'],['Protocol','HL7 FHIR R4'],['Data Points','2.4M records']], color:'#10b981' },
  { title:'RFID System', icon:'📡', items:[['Sensors Active','248 / 256 (97%)'],['Tags Tracked','1,847'],['Update Rate','2.5 detik'],['Range','50 meter'],['Frequency','915 MHz UHF'],['Battery Avg','87% remaining']], color:'#f59e0b' },
  { title:'News Crawler', icon:'🤖', items:[['Sources','24 feeds aktif'],['Crawl Rate','Setiap 15 menit'],['Total Articles','12,847'],['AI Filter','Aktif (98% accuracy)'],['Sentiment Engine','NLP v3.2'],['Languages','ID, EN']], color:'#8b5cf6' },
  { title:'Command Center', icon:'🎖️', items:[['Status','Operational ✅'],['Active Sessions','12'],['API Calls/min','340'],['Response Time','45ms avg'],['Bandwidth','1.2 Gbps'],['Modules','6 active']], color:'#D4AF37' },
  { title:'Disaster Recovery', icon:'🔄', items:[['DR Site','Surabaya'],['RPO','< 5 menit'],['RTO','< 30 menit'],['Last DR Test','15 Mar 2026 ✅'],['Failover Mode','Automatic'],['Replication','Synchronous']], color:'#ef4444' },
];

const methodColors = { GET:'#10b981', POST:'#3b82f6', PUT:'#f59e0b', DELETE:'#ef4444', WS:'#8b5cf6' };

// ═══ PDF GENERATOR ═══
function generatePDF() {
  const win = window.open('', '_blank');
  const archSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520" style="width:100%;max-width:760px;height:auto;margin:16px auto;display:block">
  <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D4AF37"/><stop offset="100%" stop-color="#f0d65b"/></linearGradient></defs>
  <rect width="760" height="520" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="380" y="28" text-anchor="middle" font-size="12" font-weight="800" fill="#0c1425" font-family="Segoe UI,sans-serif">ARSITEKTUR INTEGRASI IKHIS COMMAND CENTER</text>
  <!-- Tier 1: Command Center -->
  <rect x="220" y="42" width="320" height="54" rx="8" fill="#fffbeb" stroke="#D4AF37" stroke-width="1.5"/>
  <text x="240" y="60" font-size="14">🎖️</text><text x="260" y="62" font-size="10" font-weight="700" fill="#92400e" font-family="Segoe UI">IKHIS Command Center</text>
  <text x="260" y="76" font-size="7.5" fill="#78716c" font-family="Segoe UI">Dashboard GIS • RS Monitoring • RFID Tracking • Data Analysis • News & Reports • Admin</text>
  <text x="260" y="88" font-size="7" fill="#a3a3a3" font-family="Segoe UI">Central Intelligence Platform — Data Center Pusat Kemhan</text>
  <!-- Arrow 1 -->
  <line x1="380" y1="96" x2="380" y2="124" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polygon points="375,122 380,130 385,122" fill="#3b82f6"/>
  <rect x="330" y="104" width="100" height="16" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="0.8"/><text x="380" y="115" text-anchor="middle" font-size="7" font-weight="700" fill="#2563eb">gRPC + REST API</text>
  <!-- Tier 2: Middleware -->
  <rect x="40" y="132" width="680" height="64" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="60" y="152" font-size="9" font-weight="700" fill="#1e40af" font-family="Segoe UI">⚡ Middleware & Integration Layer</text>
  <text x="60" y="164" font-size="7" fill="#6b7280" font-family="Segoe UI">API Gateway, Message Broker, Data Processing</text>
  <g font-size="7.5" font-family="Segoe UI">
    <rect x="55" y="170" width="140" height="20" rx="4" fill="#fff" stroke="#93c5fd"/><text x="70" y="183" font-weight="600" fill="#1e3a5f">🌐 API Gateway</text><text x="133" y="183" fill="#6b7280" font-size="6">HTTPS/TLS 1.3</text>
    <rect x="205" y="170" width="140" height="20" rx="4" fill="#fff" stroke="#93c5fd"/><text x="220" y="183" font-weight="600" fill="#1e3a5f">🔌 WebSocket</text><text x="285" y="183" fill="#6b7280" font-size="6">WSS Secure</text>
    <rect x="355" y="170" width="140" height="20" rx="4" fill="#fff" stroke="#93c5fd"/><text x="370" y="183" font-weight="600" fill="#1e3a5f">📨 Kafka Queue</text><text x="442" y="183" fill="#6b7280" font-size="6">AMQP</text>
    <rect x="505" y="170" width="140" height="20" rx="4" fill="#fff" stroke="#93c5fd"/><text x="520" y="183" font-weight="600" fill="#1e3a5f">💾 Data Lake</text><text x="590" y="183" fill="#6b7280" font-size="6">PostgreSQL/Redis</text>
  </g>
  <!-- Arrow 2 -->
  <line x1="380" y1="196" x2="380" y2="224" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polygon points="375,222 380,230 385,222" fill="#10b981"/>
  <rect x="325" y="204" width="110" height="16" rx="4" fill="#ecfdf5" stroke="#6ee7b7" stroke-width="0.8"/><text x="380" y="215" text-anchor="middle" font-size="7" font-weight="700" fill="#059669">IPSec VPN • AES-256</text>
  <!-- Tier 3: Data Center -->
  <rect x="80" y="232" width="600" height="64" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="100" y="252" font-size="9" font-weight="700" fill="#065f46" font-family="Segoe UI">🏢 Data Center Regional (RS Type A)</text>
  <text x="100" y="264" font-size="7" fill="#6b7280" font-family="Segoe UI">Hub konsolidasi data per wilayah — VPN / MPLS</text>
  <g font-size="7.5" font-family="Segoe UI">
    <rect x="95" y="270" width="130" height="20" rx="4" fill="#fff" stroke="#6ee7b7"/><text x="110" y="283" font-weight="600" fill="#1e3a5f">🏥 DC RSPPN PB Soedirman</text>
    <rect x="235" y="270" width="130" height="20" rx="4" fill="#fff" stroke="#6ee7b7"/><text x="250" y="283" font-weight="600" fill="#1e3a5f">🏥 DC RSPAD Gatot S.</text>
    <rect x="375" y="270" width="130" height="20" rx="4" fill="#fff" stroke="#6ee7b7"/><text x="390" y="283" font-weight="600" fill="#1e3a5f">🏥 DC RSAL Mintohardjo</text>
    <rect x="515" y="270" width="150" height="20" rx="4" fill="#fff" stroke="#6ee7b7"/><text x="530" y="283" font-weight="600" fill="#1e3a5f">🏥 DC RSAU Esnawan A.</text>
  </g>
  <!-- Arrow 3 -->
  <line x1="380" y1="296" x2="380" y2="324" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polygon points="375,322 380,330 385,322" fill="#f59e0b"/>
  <rect x="325" y="304" width="110" height="16" rx="4" fill="#fef3c7" stroke="#fcd34d" stroke-width="0.8"/><text x="380" y="315" text-anchor="middle" font-size="7" font-weight="700" fill="#b45309">HTTPS + WSS + RFID</text>
  <!-- Tier 4: RS Kemhan -->
  <rect x="20" y="332" width="720" height="170" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="40" y="352" font-size="9" font-weight="700" fill="#92400e" font-family="Segoe UI">🏥 17 RS Kemhan (Sistem Informasi Manajemen RS) — Sumber Data Primer</text>
  <!-- AD -->
  <rect x="35" y="362" width="228" height="130" rx="6" fill="#fff" stroke="#10b981" stroke-width="1"/><text x="50" y="378" font-size="8" font-weight="800" fill="#10b981" font-family="Segoe UI">🪖 TNI AD — 8 RS</text>
  <g font-size="7" fill="#334155" font-family="Segoe UI">
    <text x="50" y="394">• RSPPN PB Soedirman (Type A)</text><text x="50" y="406">• RSPAD Gatot Soebroto (Type A)</text>
    <text x="50" y="418">• RSAD Dustira (Type B)</text><text x="50" y="430">• RSAD Udayana (Type B)</text>
    <text x="50" y="442">• RSAD dr. Soedjono (Type C)</text><text x="50" y="454">• RSAD dr. R. Hardjanto (Type C)</text>
    <text x="50" y="466">• RSAD dr. Soepraoen (Type B)</text><text x="50" y="478">• RSAD dr. Reksodiwiryo (Type C)</text>
  </g>
  <!-- AL -->
  <rect x="273" y="362" width="220" height="130" rx="6" fill="#fff" stroke="#3b82f6" stroke-width="1"/><text x="288" y="378" font-size="8" font-weight="800" fill="#3b82f6" font-family="Segoe UI">⚓ TNI AL — 3 RS</text>
  <g font-size="7" fill="#334155" font-family="Segoe UI">
    <text x="288" y="394">• RSAL dr. Mintohardjo (Type A)</text><text x="288" y="406">• RSAL dr. Ramelan (Type B)</text>
    <text x="288" y="418">• RSAL dr. Oepomo (Type C)</text>
  </g>
  <!-- AU -->
  <rect x="503" y="362" width="225" height="130" rx="6" fill="#fff" stroke="#f97316" stroke-width="1"/><text x="518" y="378" font-size="8" font-weight="800" fill="#f97316" font-family="Segoe UI">✈️ TNI AU — 6 RS</text>
  <g font-size="7" fill="#334155" font-family="Segoe UI">
    <text x="518" y="394">• RSAU dr. Esnawan Antariksa (Type A)</text><text x="518" y="406">• RSAU dr. M. Salamun (Type B)</text>
    <text x="518" y="418">• RSAU dr. Sutoyo (Type C)</text><text x="518" y="430">• RSAU dr. Norman T. Lubis (Type C)</text>
    <text x="518" y="442">• RSAU dr. Djamil (Type D)</text><text x="518" y="454">• RSAU dr. Suryadi (Type C)</text>
  </g>
  <text x="380" y="515" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="Segoe UI">© 2026 IKHIS Command Center — Kementerian Pertahanan RI • HL7 FHIR R4 • OAuth 2.0 + JWT • AES-256-GCM</text>
  </svg>`;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>IKHIS System Integration Documentation</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Tahoma,sans-serif;color:#1e293b;padding:40px;line-height:1.6;max-width:900px;margin:0 auto}
  h1{font-size:28px;color:#0c1425;border-bottom:3px solid #D4AF37;padding-bottom:12px;margin-bottom:24px}
  h2{font-size:20px;color:#1e3a5f;margin:30px 0 12px;padding-left:12px;border-left:4px solid #3b82f6}
  h3{font-size:15px;color:#334155;margin:16px 0 8px}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;color:#fff;margin-right:6px}
  .badge.post{background:#3b82f6}.badge.get{background:#10b981}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
  th{background:#f1f5f9;padding:8px 12px;text-align:left;font-weight:700;border-bottom:2px solid #e2e8f0}
  td{padding:8px 12px;border-bottom:1px solid #e2e8f0}
  pre{background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;font-size:11px;overflow-x:auto;margin:8px 0;white-space:pre-wrap}
  .step{display:flex;gap:12px;margin:12px 0;padding:12px;background:#f8fafc;border-radius:8px;border-left:3px solid #3b82f6}
  .step-num{background:#3b82f6;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
  .header{text-align:center;margin-bottom:30px}
  .header img{width:60px;margin-bottom:8px}
  .header p{color:#64748b;font-size:12px}
  .footer{margin-top:40px;padding-top:16px;border-top:2px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center}
  .arch-caption{text-align:center;font-size:11px;color:#64748b;margin-top:8px;font-style:italic}
  @media print{body{padding:20px}pre{font-size:9px}h1{font-size:22px}svg{max-width:100%!important;page-break-inside:avoid}}
</style></head><body>
<div class="header">
  <h1>📋 IKHIS — System Integration Documentation</h1>
  <p>Integrated Kemhan Health Intelligence System — Standar Baku Integrasi Data RS Kemhan</p>
  <p>Versi 1.0 — ${new Date().toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric' })}</p>
</div>

<h2>1. Pendahuluan</h2>
<p>Dokumen ini merupakan panduan standar baku integrasi data antara Sistem Informasi Manajemen (SIM) masing-masing RS Kemhan dengan platform IKHIS Command Center. Seluruh 17 RS Kemhan wajib mengikuti standar, format, dan aturan yang ditetapkan dalam dokumen ini.</p>

<h2>2. Arsitektur Sistem</h2>
<p>IKHIS menggunakan arsitektur 4-tier:</p>
<table>
<tr><th>Tier</th><th>Komponen</th><th>Fungsi</th></tr>
<tr><td>1. Command Center</td><td>IKHIS Platform</td><td>Dashboard monitoring, analisis, DSS report</td></tr>
<tr><td>2. Middleware</td><td>API Gateway, WebSocket, Kafka, Data Lake</td><td>Routing, autentikasi, message queue, storage</td></tr>
<tr><td>3. Data Center</td><td>4 DC di RS Type A</td><td>Hub konsolidasi regional, VPN endpoint</td></tr>
<tr><td>4. RS Kemhan</td><td>17 SIM RS + Adapter</td><td>Sumber data primer, RFID sensor</td></tr>
</table>
<p style="margin-top:12px;font-weight:600;font-size:13px">Diagram Arsitektur Integrasi:</p>
${archSvg}
<p class="arch-caption">Gambar 2.1 — Topologi Arsitektur Integrasi IKHIS Command Center dengan 17 RS Kemhan</p>

<h2>3. Standar & Format Data</h2>
<table>
<tr><th>Parameter</th><th>Standar</th></tr>
${dataStandards.map(s => `<tr><td>${s.icon} ${s.label}</td><td>${s.value}</td></tr>`).join('')}
</table>

<h2>4. REST API Endpoints</h2>
${apiEndpoints.map(mod => `
<h3>${mod.icon} ${mod.module}</h3>
<p>${mod.description}</p>
${mod.endpoints.map(ep => `
<p><span class="badge ${ep.method.toLowerCase()}">${ep.method}</span> <code>${ep.path}</code></p>
<p style="font-size:12px;color:#475569">${ep.desc} — Frekuensi: ${ep.frequency}</p>
${ep.payload ? `<pre>${ep.payload}</pre>` : ''}
`).join('')}
`).join('')}

<h2>5. WebSocket Channels</h2>
${wsChannels.map(ch => `
<h3>${ch.icon} ${ch.label} (${ch.direction})</h3>
<p style="font-size:12px"><code>${ch.channel}</code></p>
<p style="font-size:12px;color:#475569">${ch.desc}</p>
<pre>${ch.payload}</pre>
`).join('')}

<h2>6. Prosedur Integrasi</h2>
${integrationSteps.map(s => `
<div class="step">
  <div class="step-num">${s.step}</div>
  <div>
    <strong>${s.title}</strong>
    <ul style="font-size:12px;margin-top:4px">${s.details.map(d => `<li>${d}</li>`).join('')}</ul>
  </div>
</div>
`).join('')}

<h2>7. Kebutuhan RS</h2>
${rsRequirements.map(r => `
<h3>${r.icon} ${r.category}</h3>
<ul style="font-size:12px">${r.items.map(i => `<li>${i}</li>`).join('')}</ul>
`).join('')}

<h2>8. Keamanan</h2>
<table>
<tr><th>Layer</th><th>Deskripsi</th></tr>
${securityLayers.map(s => `<tr><td>${s.icon} ${s.label}</td><td>${s.desc}</td></tr>`).join('')}
</table>

<div class="footer">
  <p>© 2026 IKHIS Command Center — Kementerian Pertahanan Republik Indonesia</p>
  <p>Dokumen ini bersifat RAHASIA dan hanya untuk kalangan terbatas</p>
</div>
</body></html>`;

  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.print(); }, 500);
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('security');
  const [searchUser, setSearchUser] = useState('');
  const [filterAudit, setFilterAudit] = useState('all');
  const [animProg, setAnimProg] = useState(false);
  const [expandedApi, setExpandedApi] = useState(null);
  const [intSubTab, setIntSubTab] = useState('architecture');

  useEffect(() => { setAnimProg(false); requestAnimationFrame(() => setAnimProg(true)); }, [activeTab]);

  const tabs = [
    { id:'security', icon:'🛡️', label:'Security & Network' },
    { id:'users', icon:'👥', label:'User Management' },
    { id:'audit', icon:'📋', label:'Audit Log' },
    { id:'system', icon:'⚙️', label:'System Configuration' },
    { id:'integration', icon:'🔗', label:'System Integration' },
  ];

  const filteredUsers = systemSettings.users.filter(u =>
    !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredLogs = filterAudit === 'all'
    ? systemSettings.auditLog
    : systemSettings.auditLog.filter(l => l.user.toLowerCase().includes(filterAudit.toLowerCase()));

  return (
    <div className="page-container adm-page">
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Settings</h1>
        <p className="page-subtitle">Pengaturan sistem, keamanan jaringan, manajemen pengguna, dan integrasi data IKHIS Command Center</p>
      </div>

      {/* Tab Navigation */}
      <div className="adm-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`adm-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span className="adm-tab-icon">{t.icon}</span>
            <span className="adm-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ SECURITY TAB ═══ */}
      {activeTab === 'security' && (
        <div className="adm-section" key="sec">
          <div className="adm-sec-grid">
            {securityMetrics.map((m, i) => (
              <div key={i} className="adm-sec-card" style={{ '--asc-color':m.color, '--delay':`${i*0.08}s` }}>
                <div className="adm-sec-top">
                  <span className="adm-sec-icon">{m.icon}</span>
                  <div className="adm-sec-info">
                    <span className="adm-sec-label">{m.label}</span>
                    <span className="adm-sec-value">{m.value}</span>
                  </div>
                </div>
                <div className="adm-sec-bar-track">
                  <div className="adm-sec-bar-fill" style={{ width: animProg ? `${m.progress}%` : '0%', background:m.color }} />
                </div>
                <span className="adm-sec-status">{m.status}</span>
              </div>
            ))}
          </div>
          <div className="adm-network-topo">
            <h3 className="adm-section-title">🌐 Network Topology Overview</h3>
            <div className="adm-topo-svg-wrap">
              <svg viewBox="0 0 900 560" className="adm-topo-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ntGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#f0d65b"/></linearGradient>
                  <linearGradient id="ntBlue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#60a5fa"/></linearGradient>
                  <linearGradient id="ntGreen" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
                  <linearGradient id="ntOrange" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
                  <linearGradient id="ntRed" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#f87171"/></linearGradient>
                  <linearGradient id="ntPurple" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
                  <linearGradient id="ntCyan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient>
                  <filter id="ntGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <filter id="ntShadow"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5"/></filter>
                </defs>
                {/* Connection Lines */}
                <g opacity="0.5" strokeDasharray="6,4">
                  <line x1="450" y1="280" x2="150" y2="80" stroke="#D4AF37" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="450" y2="80" stroke="#3b82f6" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="750" y2="80" stroke="#10b981" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="100" y2="280" stroke="#f59e0b" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="800" y2="280" stroke="#ef4444" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="100" y2="480" stroke="#8b5cf6" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="310" y2="480" stroke="#06b6d4" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="590" y2="480" stroke="#3b82f6" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <line x1="450" y1="280" x2="800" y2="480" stroke="#10b981" strokeWidth="1.5"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                </g>
                {/* Protocol Labels */}
                <g fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif">
                  <rect x="260" y="165" width="60" height="16" rx="4" fill="rgba(212,175,55,0.2)" stroke="#D4AF37" strokeWidth="0.5"/><text x="290" y="177" fill="#D4AF37" textAnchor="middle">HTTPS</text>
                  <rect x="420" y="165" width="60" height="16" rx="4" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="0.5"/><text x="450" y="177" fill="#60a5fa" textAnchor="middle">gRPC</text>
                  <rect x="600" y="165" width="60" height="16" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="0.5"/><text x="630" y="177" fill="#34d399" textAnchor="middle">VPN/MPLS</text>
                  <rect x="220" y="272" width="48" height="16" rx="4" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="0.5"/><text x="244" y="284" fill="#fbbf24" textAnchor="middle">WSS</text>
                  <rect x="640" y="272" width="48" height="16" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="0.5"/><text x="664" y="284" fill="#f87171" textAnchor="middle">WAF</text>
                  <rect x="230" y="400" width="58" height="16" rx="4" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="0.5"/><text x="259" y="412" fill="#a78bfa" textAnchor="middle">AMQP</text>
                  <rect x="350" y="400" width="58" height="16" rx="4" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="0.5"/><text x="379" y="412" fill="#22d3ee" textAnchor="middle">HL7 FHIR</text>
                  <rect x="500" y="400" width="58" height="16" rx="4" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="0.5"/><text x="529" y="412" fill="#60a5fa" textAnchor="middle">SQL/gRPC</text>
                  <rect x="640" y="400" width="58" height="16" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="0.5"/><text x="669" y="412" fill="#34d399" textAnchor="middle">UHF 915</text>
                </g>
                {/* Center: Command Center */}
                <g filter="url(#ntShadow)">
                  <circle cx="450" cy="280" r="52" fill="rgba(12,20,40,0.9)" stroke="url(#ntGold)" strokeWidth="2.5"/>
                  <circle cx="450" cy="280" r="44" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" strokeDasharray="3,3"><animateTransform attributeName="transform" type="rotate" values="0 450 280;360 450 280" dur="30s" repeatCount="indefinite"/></circle>
                  <text x="450" y="272" textAnchor="middle" fontSize="24">🎖️</text>
                  <text x="450" y="292" textAnchor="middle" fontSize="9" fill="#D4AF37" fontWeight="800" fontFamily="Outfit,sans-serif">COMMAND</text>
                  <text x="450" y="303" textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="600" fontFamily="Inter,sans-serif">CENTER</text>
                </g>
                {/* Top Row Nodes */}
                {[
                  { x:150, y:80, icon:'🏥', label:'17 RS Kemhan', sub:'SIM RS + RFID', grad:'ntGold', stroke:'#D4AF37' },
                  { x:450, y:80, icon:'🌐', label:'API Gateway', sub:'REST + Auth + Rate Limit', grad:'ntBlue', stroke:'#3b82f6' },
                  { x:750, y:80, icon:'🏢', label:'4 Data Center', sub:'DC Type A Regional', grad:'ntGreen', stroke:'#10b981' },
                ].map((n, i) => (
                  <g key={`top-${i}`} filter="url(#ntShadow)">
                    <rect x={n.x-60} y={n.y-28} width="120" height="56" rx="10" fill="rgba(12,20,40,0.85)" stroke={n.stroke} strokeWidth="1.5"/>
                    <text x={n.x} y={n.y-4} textAnchor="middle" fontSize="18">{n.icon}</text>
                    <text x={n.x} y={n.y+14} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="700" fontFamily="Outfit,sans-serif">{n.label}</text>
                    <text x={n.x} y={n.y+24} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="Inter,sans-serif">{n.sub}</text>
                  </g>
                ))}
                {/* Middle Row Nodes (left/right) */}
                {[
                  { x:100, y:280, icon:'📡', label:'RFID System', sub:'248 Sensors • UHF 915MHz', stroke:'#f59e0b' },
                  { x:800, y:280, icon:'🛡️', label:'Firewall + WAF', sub:'FortiGate 3700F • DDoS', stroke:'#ef4444' },
                ].map((n, i) => (
                  <g key={`mid-${i}`} filter="url(#ntShadow)">
                    <rect x={n.x-65} y={n.y-28} width="130" height="56" rx="10" fill="rgba(12,20,40,0.85)" stroke={n.stroke} strokeWidth="1.5"/>
                    <text x={n.x} y={n.y-4} textAnchor="middle" fontSize="18">{n.icon}</text>
                    <text x={n.x} y={n.y+14} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="700" fontFamily="Outfit,sans-serif">{n.label}</text>
                    <text x={n.x} y={n.y+24} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="Inter,sans-serif">{n.sub}</text>
                  </g>
                ))}
                {/* Bottom Row Nodes */}
                {[
                  { x:100, y:480, icon:'📨', label:'Kafka Queue', sub:'Event Stream • Pub/Sub', stroke:'#8b5cf6' },
                  { x:310, y:480, icon:'💊', label:'SIMRS v4.2', sub:'HL7 FHIR R4 • 17 RS', stroke:'#06b6d4' },
                  { x:590, y:480, icon:'💾', label:'Data Lake', sub:'PostgreSQL • Redis • TSdb', stroke:'#3b82f6' },
                  { x:800, y:480, icon:'🤖', label:'News Crawler', sub:'24 Feeds • AI NLP v3.2', stroke:'#10b981' },
                ].map((n, i) => (
                  <g key={`bot-${i}`} filter="url(#ntShadow)">
                    <rect x={n.x-65} y={n.y-28} width="130" height="56" rx="10" fill="rgba(12,20,40,0.85)" stroke={n.stroke} strokeWidth="1.5"/>
                    <text x={n.x} y={n.y-4} textAnchor="middle" fontSize="18">{n.icon}</text>
                    <text x={n.x} y={n.y+14} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="700" fontFamily="Outfit,sans-serif">{n.label}</text>
                    <text x={n.x} y={n.y+24} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="Inter,sans-serif">{n.sub}</text>
                  </g>
                ))}
                {/* Pulse animation on center */}
                <circle cx="450" cy="280" r="52" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="52;68;52" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
                </circle>
                {/* Legend */}
                <g transform="translate(20,520)">
                  <text x="0" y="0" fontSize="8" fill="#64748b" fontWeight="700" fontFamily="Inter,sans-serif">NETWORK STATUS: </text>
                  <circle cx="100" cy="-3" r="4" fill="#10b981"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle>
                  <text x="108" y="0" fontSize="8" fill="#10b981" fontWeight="700" fontFamily="Inter,sans-serif">ALL SYSTEMS OPERATIONAL</text>
                  <text x="260" y="0" fontSize="7" fill="#64748b" fontFamily="Inter,sans-serif">• Uptime 99.97% • Encryption AES-256 • TLS 1.3</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ═══ USERS TAB ═══ */}
      {activeTab === 'users' && (
        <div className="adm-section" key="usr">
          <div className="adm-usr-controls">
            <div className="adm-usr-search">
              <span>🔍</span>
              <input type="text" placeholder="Cari user..." value={searchUser} onChange={e => setSearchUser(e.target.value)} />
            </div>
            <div className="adm-usr-stats">
              <span className="adm-usr-stat online">🟢 {systemSettings.users.filter(u=>u.status==='Online').length} Online</span>
              <span className="adm-usr-stat">📊 {systemSettings.users.length} Total</span>
            </div>
          </div>
          <div className="adm-usr-grid">
            {filteredUsers.map(u => (
              <div key={u.id} className="adm-usr-card" style={{ '--usr-color':roleColors[u.role] || '#94a3b8' }}>
                <div className="adm-usr-top">
                  <div className="adm-usr-avatar" style={{ background:`linear-gradient(135deg,${roleColors[u.role]},${roleColors[u.role]}88)` }}>
                    {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className={`adm-usr-status-dot ${u.status === 'Online' ? 'online' : 'offline'}`} />
                </div>
                <h4 className="adm-usr-name">{u.name}</h4>
                <div className="adm-usr-role">
                  <span className="adm-usr-role-icon">{roleIcons[u.role] || '👤'}</span>
                  <span>{u.role}</span>
                </div>
                <div className="adm-usr-meta">
                  <div className="adm-usr-meta-item"><span>🕐</span>{u.lastLogin}</div>
                  <div className="adm-usr-meta-item"><span>🔑</span>{u.access}</div>
                </div>
                <div className="adm-usr-actions">
                  <button className="adm-usr-btn edit">✏️ Edit</button>
                  <button className="adm-usr-btn">🔒 Reset</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ AUDIT LOG TAB ═══ */}
      {activeTab === 'audit' && (
        <div className="adm-section" key="aud">
          <div className="adm-audit-controls">
            <h3 className="adm-section-title">📋 Audit Log — 25 Maret 2026</h3>
            <div className="adm-audit-filters">
              {['all', ...new Set(systemSettings.auditLog.map(l => l.user))].map(f => (
                <button key={f} className={`adm-af-btn ${filterAudit === f ? 'active' : ''}`} onClick={() => setFilterAudit(f)}>
                  {f === 'all' ? '📋 Semua' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="adm-audit-timeline">
            {filteredLogs.map((log, i) => (
              <div key={i} className="adm-audit-item" style={{ '--delay':`${i*0.06}s` }}>
                <div className="adm-ai-time">{log.time} WIB</div>
                <div className="adm-ai-dot" />
                <div className="adm-ai-content">
                  <div className="adm-ai-header">
                    <span className="adm-ai-user">{log.user}</span>
                    <span className={`adm-ai-status ${log.status.includes('Success') || log.status.includes('0 Threats') ? 'success' : 'info'}`}>{log.status}</span>
                  </div>
                  <p className="adm-ai-action">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SYSTEM CONFIG TAB ═══ */}
      {activeTab === 'system' && (
        <div className="adm-section" key="sys">
          <div className="adm-sys-grid">
            {systemCards.map((c, i) => (
              <div key={i} className="adm-sys-card" style={{ '--sys-color':c.color, '--delay':`${i*0.06}s` }}>
                <div className="adm-sys-header">
                  <span className="adm-sys-icon">{c.icon}</span>
                  <h3 className="adm-sys-title">{c.title}</h3>
                  <span className="adm-sys-dot" style={{ background:c.color }} />
                </div>
                <div className="adm-sys-items">
                  {c.items.map(([k, v], j) => (
                    <div key={j} className="adm-sys-item">
                      <span className="adm-sys-key">{k}</span>
                      <span className="adm-sys-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SYSTEM INTEGRATION TAB ═══ */}
      {activeTab === 'integration' && (
        <div className="adm-section adm-int" key="int">
          {/* Sub-tabs */}
          <div className="adm-int-header">
            <div className="adm-int-title-area">
              <span className="adm-int-badge">v1.0</span>
              <h3 className="adm-section-title">🔗 System Integration Documentation</h3>
              <p className="adm-int-subtitle">Standar baku integrasi data SIM RS Kemhan → IKHIS Command Center</p>
            </div>
            <button className="adm-int-pdf-btn" onClick={generatePDF}>
              <span>📥</span> Unduh Dokumentasi PDF
            </button>
          </div>

          <div className="adm-int-subtabs">
            {[
              { id:'architecture', icon:'🏗️', label:'Arsitektur' },
              { id:'api', icon:'🌐', label:'REST API' },
              { id:'websocket', icon:'🔌', label:'WebSocket' },
              { id:'guide', icon:'📋', label:'Panduan Integrasi' },
              { id:'standards', icon:'📐', label:'Standar & Format' },
            ].map(st => (
              <button key={st.id} className={`adm-int-subtab ${intSubTab===st.id?'active':''}`} onClick={()=>setIntSubTab(st.id)}>
                <span>{st.icon}</span><span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* ── ARCHITECTURE ── */}
          {intSubTab === 'architecture' && (
            <div className="adm-int-content" key="arch">
              {/* Architecture SVG Diagram */}
              <div className="adm-topo-svg-wrap">
                <svg viewBox="0 0 920 680" className="adm-topo-svg adm-arch-svg" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="archShadow"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/></filter>
                    <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#f0d65b"/></linearGradient>
                    <linearGradient id="archBlue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#60a5fa"/></linearGradient>
                    <linearGradient id="archGreen" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
                    <linearGradient id="archAmber" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
                  </defs>
                  {/* Background grid */}
                  <pattern id="archGrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/></pattern>
                  <rect width="920" height="680" fill="url(#archGrid)"/>
                  
                  {/* TIER 1: IKHIS Command Center */}
                  <g filter="url(#archShadow)">
                    <rect x="200" y="20" width="520" height="72" rx="12" fill="rgba(212,175,55,0.08)" stroke="#D4AF37" strokeWidth="2"/>
                    <rect x="200" y="20" width="520" height="3" rx="1" fill="url(#archGold)"/>
                    <text x="230" y="48" fontSize="22">🎖️</text>
                    <text x="260" y="48" fontSize="14" fill="#D4AF37" fontWeight="800" fontFamily="Outfit,sans-serif">IKHIS Command Center</text>
                    <text x="260" y="64" fontSize="9" fill="#94a3b8" fontFamily="Inter,sans-serif">Central Intelligence Platform — Data Center Pusat Kemhan</text>
                  </g>
                  {/* CC Modules */}
                  {[
                    {x:218,icon:'🗺️',label:'GIS'},{x:310,icon:'📊',label:'Monitoring'},{x:402,icon:'📡',label:'RFID'},
                    {x:494,icon:'🧠',label:'DSS'},{x:586,icon:'📰',label:'News'},{x:660,icon:'🔒',label:'Admin'}
                  ].map((m,i)=>(
                    <g key={`cc-${i}`}><rect x={m.x} y="72" width="74" height="16" rx="4" fill="rgba(212,175,55,0.06)" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5"/><text x={m.x+6} y="83" fontSize="10">{m.icon}</text><text x={m.x+22} y="84" fontSize="7.5" fill="#D4AF37" fontWeight="700" fontFamily="Inter,sans-serif">{m.label}</text></g>
                  ))}
                  
                  {/* CONNECTOR 1 */}
                  <line x1="460" y1="92" x2="460" y2="128" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <polygon points="455,126 460,134 465,126" fill="#3b82f6"/>
                  <rect x="400" y="104" width="120" height="18" rx="5" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8"/>
                  <text x="460" y="117" textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="700" fontFamily="Inter,sans-serif">gRPC + REST API</text>

                  {/* TIER 2: Middleware */}
                  <g filter="url(#archShadow)">
                    <rect x="40" y="136" width="840" height="90" rx="12" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="2"/>
                    <rect x="40" y="136" width="840" height="3" rx="1" fill="url(#archBlue)"/>
                    <text x="70" y="160" fontSize="18">⚡</text>
                    <text x="95" y="162" fontSize="13" fill="#3b82f6" fontWeight="800" fontFamily="Outfit,sans-serif">Middleware & Integration Layer</text>
                    <text x="340" y="162" fontSize="9" fill="#64748b" fontFamily="Inter,sans-serif">API Gateway, Message Broker, Data Processing</text>
                  </g>
                  {[
                    {x:60,w:185,icon:'🌐',label:'API Gateway',sub:'REST API, Auth, Rate Limiting',proto:'HTTPS/TLS 1.3'},
                    {x:260,w:185,icon:'🔌',label:'WebSocket Server',sub:'Real-time Events, Pub/Sub',proto:'WSS (Secure)'},
                    {x:460,w:185,icon:'📨',label:'Message Queue',sub:'Apache Kafka, Event Stream',proto:'AMQP / Kafka'},
                    {x:660,w:200,icon:'💾',label:'Data Lake',sub:'PostgreSQL, Redis, TimescaleDB',proto:'SQL / gRPC'},
                  ].map((n,i)=>(
                    <g key={`mw-${i}`}>
                      <rect x={n.x} y="172" width={n.w} height="46" rx="8" fill="rgba(12,20,40,0.6)" stroke="rgba(59,130,246,0.3)" strokeWidth="1"/>
                      <text x={n.x+10} y="190" fontSize="14">{n.icon}</text>
                      <text x={n.x+30} y="190" fontSize="10" fill="#e2e8f0" fontWeight="700" fontFamily="Outfit,sans-serif">{n.label}</text>
                      <text x={n.x+10} y="202" fontSize="7.5" fill="#64748b" fontFamily="Inter,sans-serif">{n.sub}</text>
                      <rect x={n.x+10} y="206" width="auto" height="0" rx="0" fill="none"/>
                      <text x={n.x+10} y="214" fontSize="7" fill="#3b82f6" fontWeight="700" fontFamily="Inter,sans-serif">{n.proto}</text>
                    </g>
                  ))}

                  {/* CONNECTOR 2 */}
                  <line x1="460" y1="226" x2="460" y2="262" stroke="#10b981" strokeWidth="2" strokeDasharray="6,4"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <polygon points="455,260 460,268 465,260" fill="#10b981"/>
                  <rect x="390" y="238" width="140" height="18" rx="5" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8"/>
                  <text x="460" y="251" textAnchor="middle" fontSize="8" fill="#34d399" fontWeight="700" fontFamily="Inter,sans-serif">IPSec VPN • AES-256 • MPLS</text>

                  {/* TIER 3: Data Center */}
                  <g filter="url(#archShadow)">
                    <rect x="80" y="270" width="760" height="88" rx="12" fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="2"/>
                    <rect x="80" y="270" width="760" height="3" rx="1" fill="url(#archGreen)"/>
                    <text x="110" y="294" fontSize="18">🏢</text>
                    <text x="138" y="296" fontSize="13" fill="#10b981" fontWeight="800" fontFamily="Outfit,sans-serif">Data Center Regional (RS Type A)</text>
                    <text x="420" y="296" fontSize="9" fill="#64748b" fontFamily="Inter,sans-serif">Hub konsolidasi data per wilayah — VPN / MPLS</text>
                  </g>
                  {[
                    {x:100,label:'DC RSPPN PB Soedirman',loc:'Jakarta',force:'AD'},
                    {x:300,label:'DC RSPAD Gatot Soebroto',loc:'Jakarta',force:'AD'},
                    {x:500,label:'DC RSAL dr. Mintohardjo',loc:'Jakarta',force:'AL'},
                    {x:680,label:'DC RSAU dr. Esnawan A.',loc:'Jakarta',force:'AU'},
                  ].map((dc,i)=>(
                    <g key={`dc-${i}`}>
                      <rect x={dc.x} y="306" width="175" height="42" rx="8" fill="rgba(12,20,40,0.6)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
                      <text x={dc.x+10} y="322" fontSize="12">🏥</text>
                      <text x={dc.x+28} y="323" fontSize="9" fill="#e2e8f0" fontWeight="700" fontFamily="Inter,sans-serif">{dc.label}</text>
                      <text x={dc.x+28} y="337" fontSize="7.5" fill="#64748b" fontFamily="Inter,sans-serif">{dc.loc} • TNI {dc.force}</text>
                    </g>
                  ))}

                  {/* CONNECTOR 3 */}
                  <line x1="460" y1="358" x2="460" y2="394" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4"><animate attributeName="strokeDashoffset" from="20" to="0" dur="2s" repeatCount="indefinite"/></line>
                  <polygon points="455,392 460,400 465,392" fill="#f59e0b"/>
                  <rect x="390" y="370" width="140" height="18" rx="5" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.8"/>
                  <text x="460" y="383" textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="700" fontFamily="Inter,sans-serif">HTTPS + WSS + HL7 FHIR</text>

                  {/* TIER 4: 17 RS Kemhan */}
                  <g filter="url(#archShadow)">
                    <rect x="20" y="402" width="880" height="260" rx="12" fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="2"/>
                    <rect x="20" y="402" width="880" height="3" rx="1" fill="url(#archAmber)"/>
                    <text x="50" y="426" fontSize="18">🏥</text>
                    <text x="78" y="426" fontSize="13" fill="#f59e0b" fontWeight="800" fontFamily="Outfit,sans-serif">17 RS Kemhan (SIM RS)</text>
                    <text x="280" y="426" fontSize="9" fill="#64748b" fontFamily="Inter,sans-serif">Sistem Informasi Manajemen RS — Sumber Data Primer + RFID Sensor</text>
                  </g>
                  
                  {/* TNI AD Group */}
                  <rect x="35" y="438" width="280" height="210" rx="8" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
                  <text x="55" y="456" fontSize="10" fill="#10b981" fontWeight="800" fontFamily="Outfit,sans-serif">🪖 TNI AD — 8 RS</text>
                  {[
                    'RSPPN PB Soedirman (Type A)','RSPAD Gatot Soebroto (Type A)','RSAD Dustira (Type B)','RSAD Udayana (Type B)',
                    'RSAD dr. Soedjono (Type C)','RSAD dr. R. Hardjanto (Type C)','RSAD dr. Soepraoen (Type B)','RSAD dr. Reksodiwiryo (Type C)'
                  ].map((rs,i)=>(
                    <g key={`ad-${i}`}>
                      <rect x="45" y={464+i*24} width="260" height="20" rx="4" fill="rgba(12,20,40,0.4)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5"/>
                      <text x="55" y={478+i*24} fontSize="8" fill="#10b981">●</text>
                      <text x="67" y={478+i*24} fontSize="8.5" fill="#cbd5e1" fontFamily="Inter,sans-serif">{rs}</text>
                    </g>
                  ))}
                  
                  {/* TNI AL Group */}
                  <rect x="330" y="438" width="260" height="210" rx="8" fill="rgba(59,130,246,0.05)" stroke="rgba(59,130,246,0.3)" strokeWidth="1"/>
                  <text x="350" y="456" fontSize="10" fill="#3b82f6" fontWeight="800" fontFamily="Outfit,sans-serif">⚓ TNI AL — 3 RS</text>
                  {[
                    'RSAL dr. Mintohardjo (Type A)','RSAL dr. Ramelan (Type B)','RSAL dr. Oepomo (Type C)'
                  ].map((rs,i)=>(
                    <g key={`al-${i}`}>
                      <rect x="340" y={464+i*24} width="240" height="20" rx="4" fill="rgba(12,20,40,0.4)" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5"/>
                      <text x="350" y={478+i*24} fontSize="8" fill="#3b82f6">●</text>
                      <text x="362" y={478+i*24} fontSize="8.5" fill="#cbd5e1" fontFamily="Inter,sans-serif">{rs}</text>
                    </g>
                  ))}

                  {/* TNI AU Group */}
                  <rect x="605" y="438" width="280" height="210" rx="8" fill="rgba(249,115,22,0.05)" stroke="rgba(249,115,22,0.3)" strokeWidth="1"/>
                  <text x="625" y="456" fontSize="10" fill="#f97316" fontWeight="800" fontFamily="Outfit,sans-serif">✈️ TNI AU — 6 RS</text>
                  {[
                    'RSAU dr. Esnawan Antariksa (Type A)','RSAU dr. M. Salamun (Type B)','RSAU dr. Sutoyo (Type C)',
                    'RSAU dr. Norman T. Lubis (Type C)','RSAU dr. Djamil (Type D)','RSAU dr. Suryadi (Type C)'
                  ].map((rs,i)=>(
                    <g key={`au-${i}`}>
                      <rect x="615" y={464+i*24} width="260" height="20" rx="4" fill="rgba(12,20,40,0.4)" stroke="rgba(249,115,22,0.15)" strokeWidth="0.5"/>
                      <text x="625" y={478+i*24} fontSize="8" fill="#f97316">●</text>
                      <text x="637" y={478+i*24} fontSize="8.5" fill="#cbd5e1" fontFamily="Inter,sans-serif">{rs}</text>
                    </g>
                  ))}

                  {/* Footer */}
                  <text x="460" y="672" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="Inter,sans-serif">© 2026 IKHIS Command Center — Kementerian Pertahanan RI • HL7 FHIR R4 • OAuth 2.0 + JWT • AES-256-GCM • TLS 1.3</text>
                </svg>
              </div>

              {/* Security Layers */}
              <div className="adm-int-section-title">🛡️ Security Layers</div>
              <div className="adm-arch-security">
                {securityLayers.map((s, i) => (
                  <div key={i} className="adm-arch-sec-card" style={{'--delay':`${i*0.08}s`}}>
                    <span className="adm-arch-sec-icon">{s.icon}</span>
                    <div>
                      <div className="adm-arch-sec-title">{s.label}</div>
                      <div className="adm-arch-sec-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REST API ── */}
          {intSubTab === 'api' && (
            <div className="adm-int-content" key="api">
              <div className="adm-api-modules">
                {apiEndpoints.map((mod, mi) => (
                  <div key={mi} className="adm-api-module" style={{'--delay':`${mi*0.08}s`}}>
                    <div className="adm-api-module-header" onClick={() => setExpandedApi(expandedApi === mi ? null : mi)}>
                      <div className="adm-api-module-left">
                        <span className="adm-api-module-icon" style={{background:`${mod.color}15`,borderColor:`${mod.color}30`}}>{mod.icon}</span>
                        <div>
                          <div className="adm-api-module-name">{mod.module}</div>
                          <div className="adm-api-module-desc">{mod.description}</div>
                        </div>
                      </div>
                      <div className="adm-api-module-right">
                        <span className="adm-api-ep-count">{mod.endpoints.length} endpoint{mod.endpoints.length>1?'s':''}</span>
                        <span className={`adm-api-expand ${expandedApi===mi?'open':''}`}>▼</span>
                      </div>
                    </div>
                    {expandedApi === mi && (
                      <div className="adm-api-endpoints">
                        {mod.endpoints.map((ep, ei) => (
                          <div key={ei} className="adm-api-endpoint">
                            <div className="adm-api-ep-header">
                              <span className="adm-api-method" style={{background:methodColors[ep.method]}}>{ep.method}</span>
                              <code className="adm-api-path">{ep.path}</code>
                              {ep.required && <span className="adm-api-required">WAJIB</span>}
                            </div>
                            <div className="adm-api-ep-desc">{ep.desc}</div>
                            <div className="adm-api-ep-freq">⏱️ Frekuensi: {ep.frequency}</div>
                            {ep.payload && (
                              <pre className="adm-api-payload"><code>{ep.payload}</code></pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WEBSOCKET ── */}
          {intSubTab === 'websocket' && (
            <div className="adm-int-content" key="ws">
              <div className="adm-ws-channels">
                {wsChannels.map((ch, i) => (
                  <div key={i} className="adm-ws-card" style={{'--wsc':ch.color, '--delay':`${i*0.1}s`}}>
                    <div className="adm-ws-header">
                      <span className="adm-ws-icon">{ch.icon}</span>
                      <div>
                        <div className="adm-ws-label">{ch.label}</div>
                        <div className="adm-ws-dir">{ch.direction}</div>
                      </div>
                      <span className="adm-ws-live-dot" style={{background:ch.color}} />
                    </div>
                    <code className="adm-ws-channel">{ch.channel}</code>
                    <p className="adm-ws-desc">{ch.desc}</p>
                    <pre className="adm-api-payload"><code>{ch.payload}</code></pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INTEGRATION GUIDE ── */}
          {intSubTab === 'guide' && (
            <div className="adm-int-content" key="guide">
              {/* Steps */}
              <div className="adm-int-section-title">📋 Prosedur Integrasi RS</div>
              <div className="adm-guide-steps">
                {integrationSteps.map((s, i) => (
                  <div key={i} className="adm-guide-step" style={{'--delay':`${i*0.1}s`}}>
                    <div className="adm-guide-step-num">{s.step}</div>
                    <div className="adm-guide-step-content">
                      <div className="adm-guide-step-title">{s.icon} {s.title}</div>
                      <ul className="adm-guide-step-details">
                        {s.details.map((d, di) => <li key={di}>{d}</li>)}
                      </ul>
                    </div>
                    {i < integrationSteps.length -1 && <div className="adm-guide-step-line" />}
                  </div>
                ))}
              </div>

              {/* RS Requirements */}
              <div className="adm-int-section-title" style={{marginTop:24}}>🏥 Kebutuhan Setiap RS</div>
              <div className="adm-req-grid">
                {rsRequirements.map((r, i) => (
                  <div key={i} className="adm-req-card" style={{'--delay':`${i*0.08}s`}}>
                    <div className="adm-req-header">
                      <span className="adm-req-icon">{r.icon}</span>
                      <span className="adm-req-title">{r.category}</span>
                    </div>
                    <ul className="adm-req-items">
                      {r.items.map((item, ii) => <li key={ii}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STANDARDS ── */}
          {intSubTab === 'standards' && (
            <div className="adm-int-content" key="std">
              <div className="adm-int-section-title">📐 Standar Baku Komunikasi Data</div>
              <div className="adm-std-grid">
                {dataStandards.map((s, i) => (
                  <div key={i} className="adm-std-card" style={{'--delay':`${i*0.06}s`}}>
                    <span className="adm-std-icon">{s.icon}</span>
                    <div>
                      <div className="adm-std-label">{s.label}</div>
                      <div className="adm-std-value">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="adm-int-section-title" style={{marginTop:24}}>⚠️ Aturan Penting</div>
              <div className="adm-rules-list">
                {[
                  'Seluruh data WAJIB dikirim dalam format JSON dengan encoding UTF-8',
                  'Timestamp WAJIB menggunakan format ISO 8601 dengan timezone WIB (UTC+7)',
                  'Setiap request WAJIB menyertakan header Authorization: Bearer {token}',
                  'rs_id WAJIB sesuai dengan ID yang terdaftar di IKHIS (format: RSPPN-001)',
                  'Payload maksimum per request: 10 MB',
                  'Jika terjadi error 429 (Rate Limit), gunakan exponential backoff',
                  'WebSocket WAJIB maintain heartbeat setiap 30 detik untuk menjaga koneksi',
                  'Data medis sensitif WAJIB dienkripsi end-to-end (field-level encryption)',
                  'Setiap RS WAJIB menjalankan HL7 FHIR Adapter yang disediakan IKHIS',
                  'Perubahan schema/format akan dikomunikasikan 30 hari sebelum implementasi',
                ].map((rule, i) => (
                  <div key={i} className="adm-rule-item" style={{'--delay':`${i*0.05}s`}}>
                    <span className="adm-rule-num">{i+1}</span>
                    <span className="adm-rule-text">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
