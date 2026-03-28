// ═══════════════════════════════════════════════════════════════
// IKHIS System Integration - API/Socket Documentation Data
// ═══════════════════════════════════════════════════════════════
// Comprehensive documentation for RS Kemhan → IKHIS data flow

// ═══ ARCHITECTURE TOPOLOGY ═══
export const architectureTiers = [
  {
    id: 'command',
    label: 'IKHIS Command Center',
    subtitle: 'Central Intelligence Platform — Data Center Pusat Kemhan',
    icon: '🎖️',
    color: '#D4AF37',
    nodes: [
      { label: 'Dashboard GIS', icon: '🗺️' },
      { label: 'RS Monitoring', icon: '📊' },
      { label: 'RFID Tracking', icon: '📡' },
      { label: 'Data Analysis & DSS', icon: '🧠' },
      { label: 'News & Reports', icon: '📰' },
      { label: 'Admin & Security', icon: '🔒' },
    ],
  },
  {
    id: 'middleware',
    label: 'Middleware & Integration Layer',
    subtitle: 'API Gateway, Message Broker, Data Processing',
    icon: '⚡',
    color: '#3b82f6',
    nodes: [
      { label: 'API Gateway', desc: 'REST API, Auth, Rate Limiting', icon: '🌐', protocol: 'HTTPS/TLS 1.3' },
      { label: 'WebSocket Server', desc: 'Real-time Events, Pub/Sub', icon: '🔌', protocol: 'WSS (Secure)' },
      { label: 'Message Queue', desc: 'Apache Kafka, Event Stream', icon: '📨', protocol: 'AMQP / Kafka' },
      { label: 'Data Lake', desc: 'PostgreSQL, Redis, TimescaleDB', icon: '💾', protocol: 'SQL / gRPC' },
    ],
  },
  {
    id: 'datacenter',
    label: 'Data Center Regional (RS Type A)',
    subtitle: 'Hub konsolidasi data per wilayah — VPN / MPLS',
    icon: '🏢',
    color: '#10b981',
    nodes: [
      { label: 'DC RSPPN P.B. Soedirman', loc: 'Jakarta', force: 'AD' },
      { label: 'DC RSPAD Gatot Soebroto', loc: 'Jakarta', force: 'AD' },
      { label: 'DC RSAL dr. Mintohardjo', loc: 'Jakarta', force: 'AL' },
      { label: 'DC RSAU dr. Esnawan A.', loc: 'Jakarta', force: 'AU' },
    ],
  },
  {
    id: 'hospital',
    label: '17 RS Kemhan (SIM RS)',
    subtitle: 'Sistem Informasi Manajemen RS — Sumber Data Primer',
    icon: '🏥',
    color: '#f59e0b',
    groups: [
      { force: 'AD', label: 'TNI AD', color: '#10b981', count: 8 },
      { force: 'AL', label: 'TNI AL', color: '#3b82f6', count: 3 },
      { force: 'AU', label: 'TNI AU', color: '#f97316', count: 6 },
    ],
  },
];

export const connectionProtocols = [
  { from: 'command', to: 'middleware', label: 'Internal API', protocol: 'gRPC + REST', color: '#D4AF37' },
  { from: 'middleware', to: 'datacenter', label: 'VPN Tunnel / MPLS', protocol: 'IPSec VPN, AES-256', color: '#3b82f6' },
  { from: 'datacenter', to: 'hospital', label: 'REST API + WebSocket', protocol: 'HTTPS + WSS', color: '#10b981' },
];

export const securityLayers = [
  { icon: '🛡️', label: 'Firewall + WAF', desc: 'Next-Gen Firewall, Web Application Firewall, DDoS Protection' },
  { icon: '🔐', label: 'End-to-End Encryption', desc: 'TLS 1.3, AES-256-GCM, RSA-4096 Key Exchange' },
  { icon: '🔑', label: 'Authentication', desc: 'OAuth 2.0 + JWT Token, MFA, API Key per RS' },
  { icon: '📋', label: 'Audit Trail', desc: 'Logging seluruh request/response, 90 hari retention' },
];

// ═══ REST API DOCUMENTATION ═══
export const apiEndpoints = [
  {
    module: 'Hospital Data',
    icon: '🏥',
    color: '#3b82f6',
    description: 'Data profil, kapasitas, status operasional, dan akreditasi RS',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/hospitals/{rs_id}/status',
        desc: 'Kirim update status operasional RS (BOR, bed availability, nakes aktif)',
        frequency: 'Setiap 5 menit',
        payload: `{
  "rs_id": "RSPPN-001",
  "timestamp": "2026-03-27T19:00:00+07:00",
  "bor": 78.5,
  "beds_total": 850,
  "beds_available": 183,
  "beds_occupied": 667,
  "icu_total": 24,
  "icu_available": 6,
  "nakes_active": 527,
  "emergency_active": true,
  "status": "normal"
}`,
        required: true,
      },
      {
        method: 'POST',
        path: '/api/v1/hospitals/{rs_id}/capacity',
        desc: 'Update detail kapasitas per bangsal/unit',
        frequency: 'Setiap 15 menit',
        payload: `{
  "rs_id": "RSPPN-001",
  "units": [
    {
      "unit_code": "ICU-01",
      "unit_name": "ICU Utama",
      "total_beds": 12,
      "occupied": 9,
      "ventilators": { "total": 8, "in_use": 5 }
    }
  ]
}`,
        required: true,
      },
      {
        method: 'POST',
        path: '/api/v1/hospitals/{rs_id}/profile',
        desc: 'Update profil RS (direktur, akreditasi, spesialisasi, kontak)',
        frequency: 'On-change / bulanan',
        payload: `{
  "rs_id": "RSPPN-001",
  "name": "RSPPN Panglima Besar Soedirman",
  "type": "Type A",
  "force": "AD",
  "accreditation": "Paripurna",
  "director": "Mayjen TNI dr. Ahmad...",
  "address": "Jl. Abdul Muis No.40...",
  "phone": "(021) 3441008",
  "specialties": ["Bedah Jantung", "Onkologi", "Neurologi"],
  "coordinates": { "lat": -6.1745, "lng": 106.8227 }
}`,
        required: true,
      },
      {
        method: 'GET',
        path: '/api/v1/hospitals',
        desc: 'Ambil daftar seluruh RS dan status terkini (digunakan oleh IKHIS)',
        frequency: 'On-demand',
        payload: null,
        required: false,
      },
    ],
  },
  {
    module: 'RFID Tracking',
    icon: '📡',
    color: '#f59e0b',
    description: 'Data real-time posisi pasien, nakes, dan alat medis via RFID tag',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/rfid/{rs_id}/entities',
        desc: 'Batch update posisi entity (pasien/nakes/alat) dari RFID sensor',
        frequency: 'Setiap 3 detik (via WebSocket preferred)',
        payload: `{
  "rs_id": "RSPPN-001",
  "timestamp": "2026-03-27T19:00:00.123+07:00",
  "entities": [
    {
      "tag_id": "RFID-P-001",
      "type": "pasien",
      "name": "Pratu Dimas Prabowo",
      "status": "aktif",
      "floor": "L1",
      "room": "IGD",
      "position": { "x": 45.2, "y": 78.3 },
      "building": "Gedung Utama",
      "vital_signs": { "heart_rate": 78, "spo2": 98 }
    }
  ]
}`,
        required: true,
      },
      {
        method: 'POST',
        path: '/api/v1/rfid/{rs_id}/sensors',
        desc: 'Kirim status sensor RFID (online/offline, battery, range)',
        frequency: 'Setiap 5 menit',
        payload: `{
  "rs_id": "RSPPN-001",
  "sensors": [
    {
      "sensor_id": "SNSR-001",
      "location": "IGD Lt.1",
      "status": "online",
      "battery": 85,
      "tags_detected": 23
    }
  ]
}`,
        required: true,
      },
    ],
  },
  {
    module: 'SIMRS Integration',
    icon: '💊',
    color: '#10b981',
    description: 'Data rekam medis elektronik, rawat inap/jalan, farmasi, laboratorium',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/simrs/{rs_id}/patients/summary',
        desc: 'Ringkasan data pasien harian (total kunjungan, rawat inap, rawat jalan)',
        frequency: 'Setiap 30 menit',
        payload: `{
  "rs_id": "RSPPN-001",
  "date": "2026-03-27",
  "inpatient_count": 667,
  "outpatient_count": 342,
  "emergency_count": 28,
  "surgery_count": 12,
  "discharge_count": 15,
  "admission_count": 18,
  "referral_in": 5,
  "referral_out": 3
}`,
        required: true,
      },
      {
        method: 'POST',
        path: '/api/v1/simrs/{rs_id}/alkes',
        desc: 'Status kesiapan alat kesehatan utama',
        frequency: 'Setiap 1 jam',
        payload: `{
  "rs_id": "RSPPN-001",
  "alkes": [
    {
      "category": "ventilator",
      "total": 35,
      "operational": 33,
      "maintenance": 2,
      "readiness_pct": 94.3
    },
    {
      "category": "ct_scan",
      "total": 3,
      "operational": 3,
      "maintenance": 0,
      "readiness_pct": 100
    }
  ],
  "overall_readiness": 91.5
}`,
        required: true,
      },
      {
        method: 'POST',
        path: '/api/v1/simrs/{rs_id}/pharmacy',
        desc: 'Status stok obat dan ketersediaan farmasi',
        frequency: 'Setiap 2 jam',
        payload: `{
  "rs_id": "RSPPN-001",
  "pharmacy": {
    "total_items": 2847,
    "near_expiry": 23,
    "out_of_stock": 5,
    "critical_stock": 12,
    "stock_adequacy_pct": 94.2
  }
}`,
        required: false,
      },
    ],
  },
  {
    module: 'DSS & Analytics',
    icon: '🧠',
    color: '#8b5cf6',
    description: 'Data untuk Decision Support System dan laporan analitik',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/dss/{rs_id}/kpi',
        desc: 'Kirim data KPI harian (BOR, BTO, ALOS, TOI, GDR, NDR)',
        frequency: 'Setiap 1 jam',
        payload: `{
  "rs_id": "RSPPN-001",
  "period": "2026-03-27",
  "kpi": {
    "bor": 78.5,
    "bto": 4.2,
    "alos": 5.8,
    "toi": 1.2,
    "gdr": 2.1,
    "ndr": 0.8
  }
}`,
        required: true,
      },
      {
        method: 'GET',
        path: '/api/v1/dss/reports/{report_id}',
        desc: 'Ambil report DSS yang sudah di-generate (PDF/JSON)',
        frequency: 'On-demand',
        payload: null,
        required: false,
      },
    ],
  },
  {
    module: 'Emergency & Alerts',
    icon: '🚨',
    color: '#ef4444',
    description: 'Sistem peringatan darurat dan notifikasi kritis',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/alerts/{rs_id}',
        desc: 'Kirim alert darurat (pasien kritis, sensor offline, stok habis)',
        frequency: 'Real-time (event-driven)',
        payload: `{
  "rs_id": "RSPPN-001",
  "alert_type": "critical",
  "category": "patient_emergency",
  "title": "Pasien IGD Status Darurat",
  "detail": "Pratu Dimas Prabowo - SpO2 turun ke 88%, HR 125bpm",
  "entity_id": "RFID-P-001",
  "location": "IGD Lt.1 Bed-03",
  "timestamp": "2026-03-27T19:15:00+07:00",
  "priority": 1
}`,
        required: true,
      },
    ],
  },
  {
    module: 'Authentication',
    icon: '🔑',
    color: '#D4AF37',
    description: 'Autentikasi dan otorisasi akses API',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/token',
        desc: 'Request JWT access token menggunakan API Key RS',
        frequency: 'Token refresh setiap 1 jam',
        payload: `{
  "api_key": "RS-RSPPN-xxxx-xxxx-xxxx",
  "api_secret": "secret_hash_sha256",
  "grant_type": "client_credentials"
}
// Response:
{
  "access_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "hospital.write rfid.write simrs.write"
}`,
        required: true,
      },
      {
        method: 'POST',
        path: '/api/v1/auth/register',
        desc: 'Registrasi RS baru ke sistem IKHIS (one-time, by admin)',
        frequency: 'One-time',
        payload: `{
  "rs_id": "RSPPN-001",
  "rs_name": "RSPPN Panglima Besar Soedirman",
  "admin_email": "admin@rsppn.kemhan.go.id",
  "callback_url": "https://sim.rsppn.kemhan.go.id/webhook"
}`,
        required: true,
      },
    ],
  },
];

// ═══ WEBSOCKET CHANNELS ═══
export const wsChannels = [
  {
    channel: 'ws://ikhis.kemhan.go.id/ws/rfid/{rs_id}',
    label: 'RFID Real-time Tracking',
    icon: '📡',
    color: '#f59e0b',
    direction: 'RS → IKHIS',
    desc: 'Stream posisi entity RFID secara real-time. Setiap RS mengirim data posisi setiap 2-3 detik.',
    payload: `{
  "type": "rfid_update",
  "rs_id": "RSPPN-001",
  "entities": [
    { "tag_id": "RFID-P-001", "x": 45.2, "y": 78.3, "floor": "L1", "status": "aktif" }
  ]
}`,
  },
  {
    channel: 'ws://ikhis.kemhan.go.id/ws/bed-status/{rs_id}',
    label: 'Bed Occupancy Live',
    icon: '🛏️',
    color: '#3b82f6',
    direction: 'RS → IKHIS',
    desc: 'Update status bed per unit/bangsal secara real-time saat terjadi admisi atau discharge.',
    payload: `{
  "type": "bed_update",
  "rs_id": "RSPPN-001",
  "event": "admission",
  "unit": "ICU-01",
  "bed_id": "ICU-01-B05",
  "patient_id": "PAT-2847",
  "timestamp": "2026-03-27T19:20:00+07:00"
}`,
  },
  {
    channel: 'ws://ikhis.kemhan.go.id/ws/alerts/{rs_id}',
    label: 'Emergency Alert Stream',
    icon: '🚨',
    color: '#ef4444',
    direction: 'Bidirectional',
    desc: 'Channel darurat dua arah. RS mengirim alert, IKHIS mengirim acknowledgment dan instruksi.',
    payload: `{
  "type": "emergency_alert",
  "rs_id": "RSPPN-001",
  "severity": "critical",
  "alert_code": "PATIENT_CRITICAL",
  "message": "SpO2 drop patient RFID-P-001",
  "requires_ack": true
}`,
  },
  {
    channel: 'ws://ikhis.kemhan.go.id/ws/system-health',
    label: 'System Health Monitor',
    icon: '💚',
    color: '#10b981',
    direction: 'RS → IKHIS',
    desc: 'Heartbeat dan status koneksi setiap RS. Dikirim setiap 30 detik.',
    payload: `{
  "type": "heartbeat",
  "rs_id": "RSPPN-001",
  "uptime": 99.97,
  "cpu_usage": 23.4,
  "memory_usage": 45.2,
  "active_connections": 12,
  "last_sync": "2026-03-27T19:19:30+07:00"
}`,
  },
];

// ═══ INTEGRATION GUIDE ═══
export const integrationSteps = [
  {
    step: 1,
    title: 'Registrasi RS ke IKHIS',
    icon: '📋',
    details: [
      'Admin IKHIS mendaftarkan RS baru melalui endpoint /api/v1/auth/register',
      'RS mendapatkan API Key dan API Secret unik',
      'Konfigurasi callback URL untuk webhook notifikasi',
      'Aktivasi akun dan verifikasi koneksi',
    ],
  },
  {
    step: 2,
    title: 'Setup Infrastruktur RS',
    icon: '🏗️',
    details: [
      'Install HL7 FHIR Adapter pada server SIM RS',
      'Konfigurasi VPN tunnel ke Data Center regional terdekat (RS Type A)',
      'Setup SSL certificate untuk komunikasi HTTPS/WSS',
      'Konfigurasi firewall untuk whitelist IP IKHIS',
    ],
  },
  {
    step: 3,
    title: 'Konfigurasi SIM RS Adapter',
    icon: '⚙️',
    details: [
      'Mapping field database SIM RS ke format standar IKHIS (HL7 FHIR R4)',
      'Konfigurasi schedule pengiriman data periodik (5 menit, 15 menit, 1 jam)',
      'Setup WebSocket client untuk real-time data (RFID, bed status, alerts)',
      'Implementasi retry mechanism dan error handling',
    ],
  },
  {
    step: 4,
    title: 'Testing & Validasi',
    icon: '🧪',
    details: [
      'Kirim test payload ke staging environment IKHIS',
      'Validasi format data dan response code',
      'Load testing simulasi beban normal dan peak',
      'UAT (User Acceptance Testing) dengan tim RS dan IKHIS',
    ],
  },
  {
    step: 5,
    title: 'Go-Live & Monitoring',
    icon: '🚀',
    details: [
      'Migrasi ke production environment',
      'Aktivasi monitoring 24/7 via NOC Dashboard',
      'Setup alert threshold untuk koneksi putus > 5 menit',
      'Dokumentasi runbook untuk troubleshooting',
    ],
  },
];

// ═══ DATA STANDARDS ═══
export const dataStandards = [
  { label: 'Protokol Komunikasi', value: 'HTTPS (TLS 1.3) + WSS', icon: '🌐' },
  { label: 'Format Data', value: 'JSON (UTF-8)', icon: '📄' },
  { label: 'Standar Medis', value: 'HL7 FHIR R4', icon: '⚕️' },
  { label: 'Autentikasi', value: 'OAuth 2.0 + JWT + MFA', icon: '🔑' },
  { label: 'Enkripsi', value: 'AES-256-GCM, RSA-4096', icon: '🔐' },
  { label: 'Timezone', value: 'WIB (UTC+7) — ISO 8601', icon: '🕐' },
  { label: 'Rate Limit', value: '1000 req/menit per RS', icon: '⚡' },
  { label: 'Retry Policy', value: 'Exponential backoff, max 5x', icon: '🔄' },
  { label: 'Data Retention', value: '90 hari realtime, 5 tahun archive', icon: '💾' },
  { label: 'Versioning', value: 'Semantic (v1.x.x) pada URL path', icon: '📌' },
];

// ═══ RS REQUIREMENTS (What each RS must provide) ═══
export const rsRequirements = [
  {
    category: 'Infrastruktur',
    icon: '🏗️',
    items: [
      'Server lokal (min 8 vCPU, 32GB RAM, 500GB SSD)',
      'Koneksi internet dedicated min 100 Mbps',
      'VPN Gateway (IPSec) untuk koneksi ke Data Center',
      'UPS dan backup power untuk server 24/7',
      'Ruang server ber-AC dengan akses terbatas',
    ],
  },
  {
    category: 'Software',
    icon: '💻',
    items: [
      'SIM RS (Sistem Informasi Manajemen RS) yang sudah berjalan',
      'HL7 FHIR Adapter (disediakan oleh tim IKHIS)',
      'WebSocket Client Library',
      'SSL Certificate (Let\'s Encrypt atau CA trusted)',
      'Database connector (PostgreSQL/MySQL)',
    ],
  },
  {
    category: 'Data',
    icon: '📊',
    items: [
      'Data profil RS (alamat, direktur, tipe, akreditasi)',
      'Data real-time BOR, kapasitas bed per bangsal',
      'Data jumlah nakes aktif per shift',
      'Status alat kesehatan utama',
      'Data KPI harian (BOR, BTO, ALOS, TOI)',
    ],
  },
  {
    category: 'RFID (Jika applicable)',
    icon: '📡',
    items: [
      'RFID Reader/Sensor UHF 915 MHz',
      'RFID Tag untuk pasien, nakes, dan alat medis',
      'RFID Gateway/Controller terintegrasi LAN',
      'Middleware RFID untuk konversi data raw → JSON',
      'Layout gedung/lantai dalam format koordinat',
    ],
  },
  {
    category: 'SDM',
    icon: '👥',
    items: [
      'IT Admin RS (penanggung jawab teknis integrasi)',
      'Database Administrator SIM RS',
      'PIC Data Quality (validasi kelengkapan data)',
      'Helpdesk RS untuk koordinasi dengan tim IKHIS',
    ],
  },
];
