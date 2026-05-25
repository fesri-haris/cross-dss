import { useState, useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { iupSummary } from '../data/iupMinerba';
import iupMinerbaData from '../data/iupMinerba';
import hguSawitData, { hguSummary } from '../data/hguSawit';
import { psnClusters, poiData, psnSummary } from '../data/psnPapuaData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TABS = [
  { key: 'sawit', label: 'Kelapa Sawit', icon: '🌴', color: '#FF6B35' },
  { key: 'minerba', label: 'IUP Minerba', icon: '⛏️', color: '#4ECDC4' },
  { key: 'psn', label: 'PSN Food Estate', icon: '🌾', color: '#00FF88' },
];

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 12 } },
    tooltip: {
      backgroundColor: 'rgba(8,15,30,0.95)', titleColor: '#e2e8f0', bodyColor: '#94a3b8',
      borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 10, cornerRadius: 8,
      titleFont: { family: 'Outfit', weight: 700, size: 12 }, bodyFont: { family: 'Inter', size: 11 },
    },
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.06)' } },
    y: { ticks: { color: '#64748b', font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.06)' } },
  },
};

const doughnutOpts = {
  responsive: true, maintainAspectRatio: false, cutout: '62%',
  plugins: {
    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 10 } },
    tooltip: chartDefaults.plugins.tooltip,
  },
};

const lineOpts = {
  ...chartDefaults,
  plugins: { ...chartDefaults.plugins, legend: { position: 'top', labels: { ...chartDefaults.plugins.legend.labels } } },
};

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + ' Jt';
  if (n >= 1000) return (n / 1000).toFixed(1) + ' Rb';
  return n.toLocaleString('id-ID');
}

function fmtArea(ha) {
  if (ha >= 1000000) return (ha / 1000000).toFixed(2) + ' Jt Ha';
  if (ha >= 1000) return (ha / 1000).toFixed(1) + ' Rb Ha';
  return ha.toLocaleString('id-ID') + ' Ha';
}

// Sawit production trend mock
const sawitTrendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const sawitTrendData = [4100, 4250, 4400, 4550, 4320, 4180, 4500, 4650, 4800, 4920, 5050, 5180];
const sawitTrendNasional = [3800, 3950, 4100, 4200, 4050, 3900, 4150, 4300, 4500, 4600, 4700, 4850];

// Minerba production trend mock
const minerbaTrendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const minerbaTrendBatubara = [42, 44, 41, 46, 48, 45, 50, 52, 49, 53, 55, 54];
const minerbaTrendNikel = [12, 13, 12.5, 14, 14.5, 13.8, 15, 15.2, 14.8, 16, 16.5, 17];

// PSN production trend
const psnTrendLabels = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];
const psnPadiTrend = [38000, 52000, 78000, 125000, 189000, 263000];
const psnTebuTrend = [280000, 580000, 920000, 1350000, 1820000, 2400000];

const POI_CATEGORIES = {
  LOGISTIK: { icon: '🚢', color: '#00D4FF' },
  PRODUKSI: { icon: '🏭', color: '#FF6B35' },
  WILAYAH_ADAT: { icon: '🏘️', color: '#FFD700' },
  INFRASTRUKTUR: { icon: '🔧', color: '#7B61FF' },
};

export default function KomoditasMonitoring() {
  const [activeTab, setActiveTab] = useState('sawit');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChart, setActiveChart] = useState('bar');
  const [poiFilter, setPoiFilter] = useState('ALL');

  // === SAWIT DATA ===
  const sawitFeatures = useMemo(() => hguSawitData.features.map(f => f.properties), []);
  const filteredSawit = useMemo(() =>
    sawitFeatures.filter(p =>
      p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.kabupaten || '').toLowerCase().includes(searchQuery.toLowerCase())
    ), [sawitFeatures, searchQuery]);

  const sawitProvinsiChart = useMemo(() => ({
    labels: hguSummary.perProvinsi.slice(0, 8).map(p => p.name),
    datasets: [
      {
        label: 'Jumlah HGU',
        data: hguSummary.perProvinsi.slice(0, 8).map(p => p.count),
        backgroundColor: 'rgba(255,107,53,0.7)',
        borderColor: '#FF6B35',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
      },
    ],
  }), []);

  const sawitSertifikasiChart = useMemo(() => ({
    labels: ['RSPO', 'ISPO', 'Belum Sertifikasi'],
    datasets: [{
      data: [hguSummary.sertifikasi.rspo, hguSummary.sertifikasi.ispo, hguSummary.sertifikasi.belum],
      backgroundColor: ['rgba(0,212,255,0.8)', 'rgba(255,107,53,0.8)', 'rgba(255,46,147,0.6)'],
      borderColor: ['#00D4FF', '#FF6B35', '#FF2E93'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  }), []);

  const sawitTrendChart = useMemo(() => ({
    labels: sawitTrendLabels,
    datasets: [
      { label: 'Papua Selatan (Ribu Ton)', data: sawitTrendData, borderColor: '#FF6B35', backgroundColor: 'rgba(255,107,53,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#FF6B35', borderWidth: 2 },
      { label: 'Rata-rata Nasional (Ribu Ton)', data: sawitTrendNasional, borderColor: '#64748b', backgroundColor: 'rgba(100,116,139,0.05)', fill: true, tension: 0.4, pointRadius: 2, pointBackgroundColor: '#64748b', borderWidth: 1.5, borderDash: [4, 2] },
    ],
  }), []);

  // === MINERBA DATA ===
  const minerbaFeatures = useMemo(() => iupMinerbaData.features.map(f => f.properties), []);
  const filteredMinerba = useMemo(() =>
    minerbaFeatures.filter(p =>
      p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.commodity.toLowerCase().includes(searchQuery.toLowerCase())
    ), [minerbaFeatures, searchQuery]);

  const minerbaProvinsiChart = useMemo(() => ({
    labels: iupSummary.perProvinsi.slice(0, 8).map(p => p.name),
    datasets: [{
      label: 'Jumlah IUP',
      data: iupSummary.perProvinsi.slice(0, 8).map(p => p.count),
      backgroundColor: 'rgba(78,205,196,0.7)',
      borderColor: '#4ECDC4',
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.7,
    }],
  }), []);

  const minerbaKomoditasChart = useMemo(() => {
    const komod = iupSummary.perKomoditas;
    const keys = Object.keys(komod).filter(k => k !== 'lainnya');
    return {
      labels: keys.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
      datasets: [{
        data: keys.map(k => komod[k].count),
        backgroundColor: ['rgba(78,205,196,0.8)', 'rgba(123,97,255,0.8)', 'rgba(0,212,255,0.8)', 'rgba(255,184,0,0.8)', 'rgba(255,107,53,0.8)', 'rgba(0,255,136,0.8)'],
        borderColor: ['#4ECDC4', '#7B61FF', '#00D4FF', '#FFB800', '#FF6B35', '#00FF88'],
        borderWidth: 2,
        hoverOffset: 6,
      }],
    };
  }, []);

  const minerbaTrendChart = useMemo(() => ({
    labels: minerbaTrendLabels,
    datasets: [
      { label: 'Batubara (Jt Ton)', data: minerbaTrendBatubara, borderColor: '#4ECDC4', backgroundColor: 'rgba(78,205,196,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#4ECDC4', borderWidth: 2 },
      { label: 'Nikel (Jt Ton)', data: minerbaTrendNikel, borderColor: '#7B61FF', backgroundColor: 'rgba(123,97,255,0.05)', fill: true, tension: 0.4, pointRadius: 2, pointBackgroundColor: '#7B61FF', borderWidth: 1.5 },
    ],
  }), []);

  // === PSN DATA ===
  const psnClusterData = useMemo(() => psnClusters.features.map(f => f.properties), []);

  const psnProvinsiChart = useMemo(() => ({
    labels: psnClusterData.map(c => c.cluster_name.length > 20 ? c.cluster_name.slice(0, 18) + '…' : c.cluster_name),
    datasets: [
      {
        label: 'Target (Ha)',
        data: psnClusterData.map(c => c.target_area_ha),
        backgroundColor: 'rgba(0,255,136,0.3)',
        borderColor: '#00FF88',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8,
      },
      {
        label: 'Realisasi (Ha)',
        data: psnClusterData.map(c => c.realisasi_ha),
        backgroundColor: 'rgba(0,255,136,0.8)',
        borderColor: '#00FF88',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8,
      },
    ],
  }), [psnClusterData]);

  const psnKomoditasChart = useMemo(() => ({
    labels: ['Padi', 'Tebu', 'Peternakan'],
    datasets: [{
      data: [psnSummary.perKomoditas.padi.targetHa, psnSummary.perKomoditas.tebu.targetHa, psnSummary.perKomoditas.sapi.targetHa],
      backgroundColor: ['rgba(0,255,136,0.8)', 'rgba(255,184,0,0.8)', 'rgba(255,107,53,0.8)'],
      borderColor: ['#00FF88', '#FFB800', '#FF6B35'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  }), []);

  const psnTrendChart = useMemo(() => ({
    labels: psnTrendLabels,
    datasets: [
      { label: 'Padi (Ton)', data: psnPadiTrend, borderColor: '#00FF88', backgroundColor: 'rgba(0,255,136,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#00FF88', borderWidth: 2 },
      { label: 'Tebu (Ton)', data: psnTebuTrend, borderColor: '#FFB800', backgroundColor: 'rgba(255,184,0,0.05)', fill: true, tension: 0.4, pointRadius: 2, pointBackgroundColor: '#FFB800', borderWidth: 1.5 },
    ],
  }), []);

  // POI filtered
  const filteredPOI = useMemo(() => {
    const pois = poiData.features.map(f => f.properties);
    if (poiFilter === 'ALL') return pois;
    return pois.filter(p => p.category === poiFilter);
  }, [poiFilter]);

  // Current tab data
  const currentTab = TABS.find(t => t.key === activeTab);
  const tabColor = currentTab?.color || '#00D4FF';

  // Charts for current tab
  const barChartData = activeTab === 'sawit' ? sawitProvinsiChart : activeTab === 'minerba' ? minerbaProvinsiChart : psnProvinsiChart;
  const doughnutChartData = activeTab === 'sawit' ? sawitSertifikasiChart : activeTab === 'minerba' ? minerbaKomoditasChart : psnKomoditasChart;
  const lineChartData = activeTab === 'sawit' ? sawitTrendChart : activeTab === 'minerba' ? minerbaTrendChart : psnTrendChart;

  // KPI Cards
  const kpiCards = useMemo(() => {
    if (activeTab === 'sawit') return [
      { label: 'Total HGU Nasional', value: hguSummary.totalNasional.toLocaleString('id-ID'), icon: '📋', sub: 'Seluruh Indonesia' },
      { label: 'HGU Papua Selatan', value: hguSummary.totalPapuaSelatan, icon: '📍', sub: 'Fokus Area' },
      { label: 'Total Luas', value: fmtArea(hguSummary.totalLuasNasional), icon: '📐', sub: 'Lahan HGU Nasional' },
      { label: 'Produksi CPO', value: fmtNum(hguSummary.totalProduksiCPO) + ' Ton', icon: '🛢️', sub: 'Total Nasional' },
      { label: 'RSPO Certified', value: hguSummary.sertifikasi.rspo.toLocaleString('id-ID'), icon: '🏅', sub: `${((hguSummary.sertifikasi.rspo / hguSummary.totalNasional) * 100).toFixed(1)}% dari total` },
      { label: 'Tanaman Menghasilkan', value: hguSummary.klasifikasiUmur.tm.persen + '%', icon: '🌱', sub: `${hguSummary.klasifikasiUmur.tm.count.toLocaleString('id-ID')} unit` },
    ];
    if (activeTab === 'minerba') return [
      { label: 'Total IUP Nasional', value: iupSummary.totalNasional.toLocaleString('id-ID'), icon: '📋', sub: 'Seluruh Indonesia' },
      { label: 'IUP Papua Selatan', value: iupSummary.totalPapuaSelatan, icon: '📍', sub: 'Fokus Area' },
      { label: 'Total Luas', value: fmtArea(iupSummary.totalLuasNasional), icon: '📐', sub: 'Konsesi Nasional' },
      { label: 'Operasi Produksi', value: iupSummary.perStatus.operasiProduksi.toLocaleString('id-ID'), icon: '⚡', sub: `${((iupSummary.perStatus.operasiProduksi / iupSummary.totalNasional) * 100).toFixed(1)}% aktif` },
      { label: 'Eksplorasi', value: iupSummary.perStatus.eksplorasi.toLocaleString('id-ID'), icon: '🔍', sub: `${((iupSummary.perStatus.eksplorasi / iupSummary.totalNasional) * 100).toFixed(1)}% dari total` },
      { label: 'Pekerja Tambang', value: fmtNum(minerbaFeatures.reduce((s, f) => s + (f.pekerja || 0), 0)), icon: '👷', sub: 'Data sample' },
    ];
    return [
      { label: 'Total Klaster', value: psnSummary.totalKlaster, icon: '🏗️', sub: 'Papua Selatan' },
      { label: 'Target Luas', value: fmtArea(psnSummary.targetLuasTotal), icon: '🎯', sub: 'Total Food Estate' },
      { label: 'Realisasi Luas', value: fmtArea(psnSummary.realisasiTotal), icon: '✅', sub: `${psnSummary.progressTotal}% tercapai` },
      { label: 'Total POI', value: psnSummary.totalPOI, icon: '📌', sub: '4 Kategori' },
      { label: 'Wilayah Adat', value: psnSummary.totalWilayahAdat, icon: '🏘️', sub: psnSummary.sukuTerdampak.join(', ') },
      { label: 'Suku Terdampak', value: psnSummary.sukuTerdampak.length, icon: '👥', sub: 'Perlu Perhatian' },
    ];
  }, [activeTab, minerbaFeatures]);

  return (
    <div className="page-container km-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{currentTab?.icon} Monitoring Komoditas — {currentTab?.label}</h1>
        <p className="page-subtitle">Dashboard monitoring sumber daya alam nasional dengan fokus Papua Selatan</p>
      </div>

      {/* Tab Navigation */}
      <div className="km-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`km-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setSearchQuery(''); setActiveChart('bar'); }}
            style={{ '--tab-color': tab.color }}
          >
            <span className="km-tab-icon">{tab.icon}</span>
            <span className="km-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="km-kpi-grid">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="km-kpi-card" style={{ '--kpi-color': tabColor }}>
            <div className="km-kpi-icon">{kpi.icon}</div>
            <div className="km-kpi-body">
              <span className="km-kpi-value">{kpi.value}</span>
              <span className="km-kpi-label">{kpi.label}</span>
              <span className="km-kpi-sub">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="km-charts-section">
        <div className="km-chart-tabs">
          {[
            { key: 'bar', icon: '📊', label: 'Distribusi Provinsi' },
            { key: 'doughnut', icon: '🍩', label: activeTab === 'sawit' ? 'Sertifikasi' : activeTab === 'minerba' ? 'Komoditas' : 'Komposisi' },
            { key: 'line', icon: '📈', label: 'Tren Produksi' },
          ].map(ct => (
            <button key={ct.key} className={`km-chart-tab ${activeChart === ct.key ? 'active' : ''}`} onClick={() => setActiveChart(ct.key)} style={{ '--ct-color': tabColor }}>
              <span>{ct.icon}</span> {ct.label}
            </button>
          ))}
        </div>
        <div className="km-chart-body">
          {activeChart === 'bar' && (
            <div className="km-chart-area">
              <Bar data={barChartData} options={{
                ...chartDefaults,
                indexAxis: activeTab === 'psn' ? 'y' : 'x',
                plugins: { ...chartDefaults.plugins, legend: { position: 'top', labels: { ...chartDefaults.plugins.legend.labels } } },
              }} />
            </div>
          )}
          {activeChart === 'doughnut' && (
            <div className="km-chart-area km-chart-doughnut">
              <Doughnut data={doughnutChartData} options={doughnutOpts} />
            </div>
          )}
          {activeChart === 'line' && (
            <div className="km-chart-area">
              <Line data={lineChartData} options={lineOpts} />
            </div>
          )}
        </div>
      </div>

      {/* Data Table Section */}
      {activeTab !== 'psn' && (
        <div className="km-table-section">
          <div className="km-table-header">
            <h3 className="km-table-title">
              {activeTab === 'sawit' ? '🌴 Data HGU Kelapa Sawit' : '⛏️ Data IUP Minerba'}
            </h3>
            <div className="km-table-search">
              <input
                type="text"
                placeholder="Cari perusahaan, provinsi, komoditas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="km-search-input"
              />
              <span className="km-search-icon">🔍</span>
            </div>
          </div>

          <div className="km-table-wrap">
            <table className="km-table">
              <thead>
                <tr>
                  {activeTab === 'sawit' ? (
                    <>
                      <th>ID</th><th>Perusahaan</th><th>Provinsi</th><th>Kabupaten</th>
                      <th>Luas (Ha)</th><th>Sertifikasi</th><th>Produksi CPO (Ton)</th><th>Status</th>
                    </>
                  ) : (
                    <>
                      <th>ID</th><th>Perusahaan</th><th>Komoditas</th><th>Provinsi</th>
                      <th>Luas (Ha)</th><th>Status</th><th>Investasi (USD)</th><th>Pekerja</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'sawit' && filteredSawit.map(row => (
                  <tr key={row.hgu_id}>
                    <td className="km-td-mono">{row.hgu_id}</td>
                    <td>{row.company_name}</td>
                    <td>{row.province}</td>
                    <td>{row.kabupaten || '-'}</td>
                    <td className="km-td-mono">{row.luas_ha?.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`km-badge km-cert-${(row.sertifikasi || 'belum').toLowerCase()}`}>
                        {row.sertifikasi || 'N/A'}
                      </span>
                    </td>
                    <td className="km-td-mono">{row.produksi_cpo_ton?.toLocaleString('id-ID') || '-'}</td>
                    <td><span className={`km-badge km-status-${(row.status || '').toLowerCase()}`}>{row.status || '-'}</span></td>
                  </tr>
                ))}
                {activeTab === 'minerba' && filteredMinerba.map(row => (
                  <tr key={row.iup_id}>
                    <td className="km-td-mono">{row.iup_id}</td>
                    <td>{row.company_name}</td>
                    <td><span className="km-commodity-tag">{row.commodity}</span></td>
                    <td>{row.province}</td>
                    <td className="km-td-mono">{row.luas_ha?.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`km-badge km-stage-${row.status_stage === 'Operasi Produksi' ? 'produksi' : 'eksplorasi'}`}>
                        {row.status_stage}
                      </span>
                    </td>
                    <td className="km-td-mono">${(row.investasi_usd / 1000000).toFixed(0)}M</td>
                    <td className="km-td-mono">{row.pekerja?.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {((activeTab === 'sawit' && filteredSawit.length === 0) || (activeTab === 'minerba' && filteredMinerba.length === 0)) && (
              <div className="km-no-data">Tidak ada data yang cocok dengan pencarian.</div>
            )}
          </div>
        </div>
      )}

      {/* PSN Tab — Cluster Progress + POI Explorer */}
      {activeTab === 'psn' && (
        <>
          {/* PSN Cluster Progress */}
          <div className="km-psn-section">
            <h3 className="km-section-title">🏗️ Progress Realisasi Klaster PSN</h3>
            <div className="km-psn-grid">
              {psnClusterData.map(cluster => {
                const progress = cluster.progress_persen;
                const statusColor = progress >= 40 ? '#00FF88' : progress >= 25 ? '#FFB800' : '#FF2E93';
                return (
                  <div key={cluster.cluster_id} className="km-psn-card">
                    <div className="km-psn-card-header">
                      <span className="km-psn-name">{cluster.cluster_name}</span>
                      <span className="km-psn-status" style={{ color: statusColor }}>{cluster.status}</span>
                    </div>
                    <div className="km-psn-meta">
                      <span>📍 {cluster.distrik}, {cluster.kabupaten}</span>
                      <span>🏷️ {cluster.commodity_type}</span>
                      <span>🏢 {cluster.pengelola}</span>
                    </div>
                    <div className="km-psn-progress-section">
                      <div className="km-psn-progress-header">
                        <span>Luas Lahan</span>
                        <span className="km-psn-progress-pct" style={{ color: statusColor }}>{progress}%</span>
                      </div>
                      <div className="km-progress-bar-track">
                        <div className="km-progress-bar-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${statusColor}88, ${statusColor})` }} />
                      </div>
                      <div className="km-psn-progress-values">
                        <span>{cluster.realisasi_ha.toLocaleString('id-ID')} Ha</span>
                        <span>/ {cluster.target_area_ha.toLocaleString('id-ID')} Ha</span>
                      </div>
                    </div>
                    {cluster.target_produksi_ton && (
                      <div className="km-psn-progress-section">
                        <div className="km-psn-progress-header">
                          <span>Produksi</span>
                          <span className="km-psn-progress-pct" style={{ color: statusColor }}>
                            {((cluster.realisasi_produksi_ton / cluster.target_produksi_ton) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="km-progress-bar-track">
                          <div className="km-progress-bar-fill" style={{
                            width: `${(cluster.realisasi_produksi_ton / cluster.target_produksi_ton) * 100}%`,
                            background: `linear-gradient(90deg, #7B61FF88, #7B61FF)`,
                          }} />
                        </div>
                        <div className="km-psn-progress-values">
                          <span>{(cluster.realisasi_produksi_ton / 1000).toFixed(0)}K Ton</span>
                          <span>/ {(cluster.target_produksi_ton / 1000).toFixed(0)}K Ton</span>
                        </div>
                      </div>
                    )}
                    {cluster.target_populasi && (
                      <div className="km-psn-progress-section">
                        <div className="km-psn-progress-header">
                          <span>Populasi Sapi</span>
                          <span className="km-psn-progress-pct" style={{ color: statusColor }}>
                            {((cluster.realisasi_populasi / cluster.target_populasi) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="km-progress-bar-track">
                          <div className="km-progress-bar-fill" style={{
                            width: `${(cluster.realisasi_populasi / cluster.target_populasi) * 100}%`,
                            background: `linear-gradient(90deg, #FF6B3588, #FF6B35)`,
                          }} />
                        </div>
                        <div className="km-psn-progress-values">
                          <span>{(cluster.realisasi_populasi / 1000).toFixed(0)}K Ekor</span>
                          <span>/ {(cluster.target_populasi / 1000).toFixed(0)}K Ekor</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* POI Explorer */}
          <div className="km-poi-section">
            <div className="km-poi-header">
              <h3 className="km-section-title">📌 POI Explorer — Papua Selatan</h3>
              <div className="km-poi-filters">
                <button className={`km-poi-filter ${poiFilter === 'ALL' ? 'active' : ''}`} onClick={() => setPoiFilter('ALL')}>Semua ({poiData.features.length})</button>
                {Object.entries(POI_CATEGORIES).map(([key, cfg]) => (
                  <button key={key} className={`km-poi-filter ${poiFilter === key ? 'active' : ''}`}
                    onClick={() => setPoiFilter(key)} style={{ '--pf-color': cfg.color }}>
                    {cfg.icon} {key.replace('_', ' ')} ({psnSummary.perKategoriPOI[key]})
                  </button>
                ))}
              </div>
            </div>
            <div className="km-poi-grid">
              {filteredPOI.map(poi => {
                const catCfg = POI_CATEGORIES[poi.category] || { icon: '📍', color: '#94a3b8' };
                return (
                  <div key={poi.poi_id} className="km-poi-card" style={{ '--poi-color': catCfg.color }}>
                    <div className="km-poi-card-top">
                      <span className="km-poi-emoji">{poi.icon || catCfg.icon}</span>
                      <div className="km-poi-card-info">
                        <span className="km-poi-name">{poi.poi_name}</span>
                        <span className="km-poi-cat">{poi.sub_category}</span>
                      </div>
                    </div>
                    <div className="km-poi-meta-grid">
                      {poi.metadata && Object.entries(poi.metadata).map(([k, v]) => (
                        <div key={k} className="km-poi-meta-item">
                          <span className="km-poi-meta-key">{k.replace(/_/g, ' ')}</span>
                          <span className="km-poi-meta-val">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="km-poi-id">{poi.poi_id}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Footer Summary */}
      <div className="km-footer-summary">
        <div className="km-footer-item">
          <span className="km-footer-label">Sumber Data:</span>
          <span className="km-footer-value">
            {activeTab === 'sawit' ? 'OneMap BIG / Kementerian ATR-BPN' : activeTab === 'minerba' ? 'Geoportal ESDM Minerba' : 'BGN / Kementan'}
          </span>
        </div>
        <div className="km-footer-item">
          <span className="km-footer-label">Terakhir Diperbarui:</span>
          <span className="km-footer-value">20 Mei 2026</span>
        </div>
        <div className="km-footer-item">
          <span className="km-footer-label">Cakupan:</span>
          <span className="km-footer-value">Nasional (Fokus Papua Selatan)</span>
        </div>
      </div>
    </div>
  );
}
