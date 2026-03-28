import { useState, useMemo, useRef, useEffect } from 'react';
import { hospitals, monthLabels, accreditationDistribution } from '../data/hospitalData';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Tooltip, Legend, Filler);

const forceColors = { AD: { main: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' }, AL: { main: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)' }, AU: { main: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' } };
const forceLabels = { AD: 'TNI AD', AL: 'TNI AL', AU: 'TNI AU' };
const forceIcons = { AD: '🟢', AL: '🔵', AU: '🟠' };
const typeOptions = ['Semua', 'Type A', 'Type B', 'Type C', 'Type D'];
const sortOptions = [
  { value: 'name', label: 'Nama RS' },
  { value: 'bor', label: 'BOR (%)' },
  { value: 'beds', label: 'Tempat Tidur' },
  { value: 'nakes', label: 'Tenaga Kesehatan' },
  { value: 'alkesReady', label: 'Kesiapan Alkes (%)' },
  { value: 'icu', label: 'ICU Beds' },
];

const chartBaseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 12 } },
    tooltip: { backgroundColor: 'rgba(8,15,30,0.95)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 10, cornerRadius: 8, titleFont: { family: 'Outfit', weight: 700, size: 12 }, bodyFont: { family: 'Inter', size: 11 } }
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.06)' } },
    y: { ticks: { color: '#64748b', font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.06)' } }
  }
};

export default function RSMonitoring() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('bor');
  const [sortDir, setSortDir] = useState('desc');
  const [filterForce, setFilterForce] = useState('all');
  const [filterType, setFilterType] = useState('Semua');
  const [selectedRS, setSelectedRS] = useState(null);
  const [activeChart, setActiveChart] = useState('bor'); // bor | beds | trend | distribution
  const detailRef = useRef(null);

  useEffect(() => {
    if (selectedRS && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedRS]);

  // ═══ FILTERED & SORTED DATA ═══
  const filtered = useMemo(() => {
    return [...hospitals]
      .filter(h => {
        if (filterForce !== 'all' && h.force !== filterForce) return false;
        if (filterType !== 'Semua' && h.type !== filterType) return false;
        if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        let va = a[sortBy], vb = b[sortBy];
        if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        return sortDir === 'asc' ? va - vb : vb - va;
      });
  }, [search, sortBy, sortDir, filterForce, filterType]);

  // ═══ COMPUTED KPIs ═══
  const kpis = useMemo(() => {
    const totalRS = filtered.length;
    const totalBeds = filtered.reduce((s, h) => s + h.beds, 0);
    const totalICU = filtered.reduce((s, h) => s + h.icu, 0);
    const totalNakes = filtered.reduce((s, h) => s + h.nakes, 0);
    const avgBOR = totalRS ? (filtered.reduce((s, h) => s + h.bor, 0) / totalRS).toFixed(1) : 0;
    const avgAlkes = totalRS ? (filtered.reduce((s, h) => s + h.alkesReady, 0) / totalRS).toFixed(1) : 0;
    const totalPasien = filtered.reduce((s, h) => s + h.pasienHarian, 0);
    const totalOperasi = filtered.reduce((s, h) => s + h.operasiPerBulan, 0);
    return { totalRS, totalBeds, totalICU, totalNakes, avgBOR, avgAlkes, totalPasien, totalOperasi };
  }, [filtered]);

  // ═══ CHART DATA ═══
  const borChartData = useMemo(() => ({
    labels: filtered.map(h => h.name.replace(/^RS\w+\s/, '').substring(0, 18)),
    datasets: [{
      label: 'BOR (%)',
      data: filtered.map(h => h.bor),
      backgroundColor: filtered.map(h => {
        if (h.bor > 85) return 'rgba(239,68,68,0.7)';
        if (h.bor > 75) return 'rgba(245,158,11,0.7)';
        return 'rgba(16,185,129,0.7)';
      }),
      borderColor: filtered.map(h => {
        if (h.bor > 85) return '#ef4444';
        if (h.bor > 75) return '#f59e0b';
        return '#10b981';
      }),
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.7,
    }]
  }), [filtered]);

  const bedsChartData = useMemo(() => ({
    labels: filtered.map(h => h.name.replace(/^RS\w+\s/, '').substring(0, 18)),
    datasets: [
      {
        label: 'Total Beds',
        data: filtered.map(h => h.beds),
        backgroundColor: 'rgba(59,130,246,0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.5,
      },
      {
        label: 'ICU Beds',
        data: filtered.map(h => h.icu),
        backgroundColor: 'rgba(239,68,68,0.6)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.5,
      }
    ]
  }), [filtered]);

  const trendChartData = useMemo(() => {
    // Average monthly BOR across filtered hospitals
    const avgByMonth = monthLabels.map((_, i) => {
      const vals = filtered.map(h => h.monthlyBOR[i]);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    });
    // Also show per-force if not filtered to single force
    const datasets = [{ label: 'Rata-rata BOR', data: avgByMonth, borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#D4AF37', borderWidth: 2 }];
    if (filterForce === 'all') {
      ['AD', 'AL', 'AU'].forEach(f => {
        const fHospitals = filtered.filter(h => h.force === f);
        if (fHospitals.length === 0) return;
        const avg = monthLabels.map((_, i) => {
          const vals = fHospitals.map(h => h.monthlyBOR[i]);
          return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
        });
        datasets.push({ label: forceLabels[f], data: avg, borderColor: forceColors[f].main, backgroundColor: 'transparent', tension: 0.4, pointRadius: 2, borderWidth: 1.5, borderDash: [4, 2] });
      });
    }
    return { labels: monthLabels, datasets };
  }, [filtered, filterForce]);

  const distributionData = useMemo(() => {
    const forceCounts = { AD: 0, AL: 0, AU: 0 };
    filtered.forEach(h => { forceCounts[h.force]++; });
    return {
      labels: Object.keys(forceCounts).map(k => forceLabels[k]),
      datasets: [{
        data: Object.values(forceCounts),
        backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(59,130,246,0.7)', 'rgba(249,115,22,0.7)'],
        borderColor: ['#10b981', '#3b82f6', '#f97316'],
        borderWidth: 2,
        hoverOffset: 6,
      }]
    };
  }, [filtered]);

  // ═══ DETAIL RADAR ═══
  const radarData = useMemo(() => {
    if (!selectedRS) return null;
    const maxBeds = Math.max(...hospitals.map(h => h.beds));
    const maxNakes = Math.max(...hospitals.map(h => h.nakes));
    const maxICU = Math.max(...hospitals.map(h => h.icu));
    return {
      labels: ['BOR', 'Kesiapan Alkes', 'Kapasitas Bed', 'Tenaga Medis', 'ICU'],
      datasets: [{
        label: selectedRS.name,
        data: [
          selectedRS.bor,
          selectedRS.alkesReady,
          (selectedRS.beds / maxBeds * 100).toFixed(0),
          (selectedRS.nakes / maxNakes * 100).toFixed(0),
          (selectedRS.icu / maxICU * 100).toFixed(0),
        ],
        backgroundColor: 'rgba(212,175,55,0.15)',
        borderColor: '#D4AF37',
        borderWidth: 2,
        pointBackgroundColor: '#D4AF37',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
      }]
    };
  }, [selectedRS]);

  const detailTrendData = useMemo(() => {
    if (!selectedRS) return null;
    return {
      labels: monthLabels,
      datasets: [{
        label: 'BOR Bulanan',
        data: selectedRS.monthlyBOR,
        borderColor: forceColors[selectedRS.force].main,
        backgroundColor: forceColors[selectedRS.force].bg,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: forceColors[selectedRS.force].main,
        borderWidth: 2,
      }]
    };
  }, [selectedRS]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => sortBy === col ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const getChartTitle = () => {
    switch (activeChart) {
      case 'bor': return 'BOR (%) per Rumah Sakit';
      case 'beds': return 'Kapasitas Tempat Tidur & ICU';
      case 'trend': return 'Trend BOR Bulanan (12 Bulan)';
      case 'distribution': return 'Distribusi RS per Angkatan';
      default: return '';
    }
  };

  return (
    <div className="page-container rsm-page">
      {/* ═══ HEADER ═══ */}
      <div className="page-header">
        <h1 className="page-title">🏥 RS Monitoring</h1>
        <p className="page-subtitle">Dashboard Monitoring Status Seluruh Rumah Sakit TNI (AD, AL, AU) se-Indonesia</p>
      </div>

      {/* ═══ KPI SUMMARY CARDS ═══ */}
      <div className="rsm-kpi-row">
        <div className="rsm-kpi-card" style={{ '--accent': '#D4AF37' }}>
          <div className="rsm-kpi-icon">🏥</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.totalRS}</span>
            <span className="rsm-kpi-label">Total Rumah Sakit</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': '#3b82f6' }}>
          <div className="rsm-kpi-icon">🛏️</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.totalBeds.toLocaleString()}</span>
            <span className="rsm-kpi-label">Total Tempat Tidur</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': kpis.avgBOR > 80 ? '#f59e0b' : '#10b981' }}>
          <div className="rsm-kpi-icon">📊</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.avgBOR}<small>%</small></span>
            <span className="rsm-kpi-label">Rata-rata BOR</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': '#8b5cf6' }}>
          <div className="rsm-kpi-icon">👨‍⚕️</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.totalNakes.toLocaleString()}</span>
            <span className="rsm-kpi-label">Tenaga Kesehatan</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': '#06b6d4' }}>
          <div className="rsm-kpi-icon">🫀</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.totalICU}</span>
            <span className="rsm-kpi-label">ICU Beds</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': kpis.avgAlkes < 85 ? '#ef4444' : '#10b981' }}>
          <div className="rsm-kpi-icon">🔬</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.avgAlkes}<small>%</small></span>
            <span className="rsm-kpi-label">Kesiapan Alkes</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': '#f59e0b' }}>
          <div className="rsm-kpi-icon">🩺</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.totalPasien.toLocaleString()}</span>
            <span className="rsm-kpi-label">Pasien / Hari</span>
          </div>
        </div>
        <div className="rsm-kpi-card" style={{ '--accent': '#ef4444' }}>
          <div className="rsm-kpi-icon">⚕️</div>
          <div className="rsm-kpi-info">
            <span className="rsm-kpi-value">{kpis.totalOperasi.toLocaleString()}</span>
            <span className="rsm-kpi-label">Operasi / Bulan</span>
          </div>
        </div>
      </div>

      {/* ═══ FILTER & SORT BAR ═══ */}
      <div className="rsm-filter-bar">
        <div className="rsm-filter-left">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Cari nama RS..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="rsm-filter-group">
            <label>Angkatan</label>
            <div className="rsm-force-btns">
              {['all', 'AD', 'AL', 'AU'].map(f => (
                <button key={f} className={`rsm-force-btn ${filterForce === f ? 'active' : ''} ${f !== 'all' ? f.toLowerCase() : ''}`} onClick={() => setFilterForce(f)}>
                  {f === 'all' ? '🌐 Semua' : `${forceIcons[f]} ${forceLabels[f]}`}
                </button>
              ))}
            </div>
          </div>
          <div className="rsm-filter-group">
            <label>Tipe RS</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="rsm-filter-right">
          <div className="rsm-filter-group">
            <label>Urutkan</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button className="rsm-sort-dir-btn" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} title={sortDir === 'asc' ? 'Ascending' : 'Descending'}>
            {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
          <div className="rsm-filter-count">
            <span className="fi-count">{filtered.length}</span> RS
          </div>
        </div>
      </div>

      {/* ═══ CHARTS SECTION ═══ */}
      <div className="rsm-charts-section">
        <div className="rsm-chart-tabs">
          {[
            { key: 'bor', icon: '📊', label: 'BOR per RS' },
            { key: 'beds', icon: '🛏️', label: 'Kapasitas Beds' },
            { key: 'trend', icon: '📈', label: 'Trend Bulanan' },
            { key: 'distribution', icon: '🍩', label: 'Distribusi' },
          ].map(tab => (
            <button key={tab.key} className={`rsm-chart-tab ${activeChart === tab.key ? 'active' : ''}`} onClick={() => setActiveChart(tab.key)}>
              <span className="rsm-tab-icon">{tab.icon}</span>
              <span className="rsm-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="rsm-chart-container">
          <div className="rsm-chart-header">
            <h3 className="rsm-chart-title">{getChartTitle()}</h3>
            <span className="rsm-chart-subtitle">Data diperbarui berdasarkan filter aktif</span>
          </div>
          <div className="rsm-chart-area" style={{ height: activeChart === 'distribution' ? 280 : 320 }}>
            {activeChart === 'bor' && (
              <Bar data={borChartData} options={{ ...chartBaseOptions, indexAxis: 'y', plugins: { ...chartBaseOptions.plugins, legend: { display: false } }, scales: { ...chartBaseOptions.scales, x: { ...chartBaseOptions.scales.x, title: { display: true, text: 'BOR (%)', color: '#64748b', font: { size: 10 } } } } }} />
            )}
            {activeChart === 'beds' && (
              <Bar data={bedsChartData} options={{ ...chartBaseOptions, scales: { ...chartBaseOptions.scales, y: { ...chartBaseOptions.scales.y, title: { display: true, text: 'Jumlah', color: '#64748b', font: { size: 10 } } } } }} />
            )}
            {activeChart === 'trend' && (
              <Line data={trendChartData} options={{ ...chartBaseOptions, scales: { ...chartBaseOptions.scales, y: { ...chartBaseOptions.scales.y, title: { display: true, text: 'BOR (%)', color: '#64748b', font: { size: 10 } }, min: 40, max: 100 } } }} />
            )}
            {activeChart === 'distribution' && (
              <div className="rsm-distribution-grid">
                <div className="rsm-doughnut-wrap">
                  <Doughnut data={distributionData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { ...chartBaseOptions.plugins, legend: { position: 'bottom', labels: { ...chartBaseOptions.plugins.legend.labels, padding: 16 } } } }} />
                </div>
                <div className="rsm-distribution-stats">
                  <h4>Ringkasan Distribusi</h4>
                  {['AD', 'AL', 'AU'].map(f => {
                    const count = filtered.filter(h => h.force === f).length;
                    const beds = filtered.filter(h => h.force === f).reduce((s, h) => s + h.beds, 0);
                    const nakes = filtered.filter(h => h.force === f).reduce((s, h) => s + h.nakes, 0);
                    return (
                      <div key={f} className="rsm-dist-row">
                        <span className="rsm-dist-icon">{forceIcons[f]}</span>
                        <div className="rsm-dist-info">
                          <span className="rsm-dist-name">{forceLabels[f]}</span>
                          <span className="rsm-dist-detail">{count} RS • {beds.toLocaleString()} beds • {nakes.toLocaleString()} nakes</span>
                        </div>
                        <span className="rsm-dist-count" style={{ color: forceColors[f].main }}>{count}</span>
                      </div>
                    );
                  })}
                  <div className="rsm-accred-section">
                    <h5>Akreditasi</h5>
                    {Object.entries(accreditationDistribution).map(([grade, count]) => (
                      <div key={grade} className="rsm-accred-row">
                        <span className="rsm-accred-label">{grade}</span>
                        <div className="rsm-accred-bar-track">
                          <div className="rsm-accred-bar-fill" style={{ width: `${(count / 17 * 100)}%`, background: grade === 'Paripurna' ? '#10b981' : grade === 'Utama' ? '#3b82f6' : '#f59e0b' }} />
                        </div>
                        <span className="rsm-accred-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ DATA TABLE ═══ */}
      <div className="rsm-table-section">
        <div className="rsm-section-header">
          <h3>📋 Data Rumah Sakit</h3>
          <span className="rsm-table-info">Klik header kolom untuk sort • Klik Detail untuk informasi lengkap</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th onClick={() => toggleSort('name')}>Nama RS<SortIcon col="name" /></th>
                <th onClick={() => toggleSort('type')}>Tipe<SortIcon col="type" /></th>
                <th onClick={() => toggleSort('force')}>Angkatan<SortIcon col="force" /></th>
                <th onClick={() => toggleSort('accreditation')}>Akreditasi<SortIcon col="accreditation" /></th>
                <th onClick={() => toggleSort('bor')}>BOR<SortIcon col="bor" /></th>
                <th onClick={() => toggleSort('nakes')}>Nakes<SortIcon col="nakes" /></th>
                <th onClick={() => toggleSort('beds')}>Beds<SortIcon col="beds" /></th>
                <th onClick={() => toggleSort('icu')}>ICU<SortIcon col="icu" /></th>
                <th onClick={() => toggleSort('alkesReady')}>Alkes<SortIcon col="alkesReady" /></th>
                <th onClick={() => toggleSort('pasienHarian')}>Pasien/Hari<SortIcon col="pasienHarian" /></th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, idx) => (
                <tr key={h.id} className={`table-row ${selectedRS?.id === h.id ? 'selected' : ''}`}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="cell-name">{h.name}</td>
                  <td><span className="type-badge">{h.type}</span></td>
                  <td><span className={`force-badge ${h.force.toLowerCase()}`}>{forceLabels[h.force]}</span></td>
                  <td><span className={`rsm-accred-badge ${h.accreditation.toLowerCase()}`}>{h.accreditation}</span></td>
                  <td>
                    <div className="rsm-bor-cell">
                      <span className={h.bor > 85 ? 'text-red' : h.bor > 75 ? 'text-yellow' : 'text-green'}>{h.bor}%</span>
                      <div className="rsm-mini-bar">
                        <div className="rsm-mini-bar-fill" style={{ width: `${h.bor}%`, background: h.bor > 85 ? '#ef4444' : h.bor > 75 ? '#f59e0b' : '#10b981' }} />
                      </div>
                    </div>
                  </td>
                  <td>{h.nakes}</td>
                  <td>{h.beds}</td>
                  <td>{h.icu}</td>
                  <td><span className={h.alkesReady < 80 ? 'text-red' : h.alkesReady < 85 ? 'text-yellow' : 'text-green'}>{h.alkesReady}%</span></td>
                  <td>{h.pasienHarian}</td>
                  <td><button className="btn-detail" onClick={() => setSelectedRS(selectedRS?.id === h.id ? null : h)}>{ selectedRS?.id === h.id ? 'Tutup' : 'Detail'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ DETAIL PANEL ═══ */}
      {selectedRS && (
        <div className="rsm-detail-panel" ref={detailRef}>
          <div className="rsm-detail-header">
            <div className="rsm-detail-title-area">
              <span className="rsm-detail-force-icon">{forceIcons[selectedRS.force]}</span>
              <div>
                <h2>{selectedRS.name}</h2>
                <span className="rsm-detail-sub">{selectedRS.type} • {forceLabels[selectedRS.force]} • {selectedRS.accreditation}</span>
              </div>
            </div>
            <button className="btn-close" onClick={() => setSelectedRS(null)}>✕</button>
          </div>

          <div className="rsm-detail-body">
            {/* Info Grid */}
            <div className="rsm-detail-info-grid">
              <div className="rsm-detail-info-card">
                <span className="rsm-di-icon">📍</span>
                <div><span className="d-label">Alamat</span><span className="d-value">{selectedRS.address}</span></div>
              </div>
              <div className="rsm-detail-info-card">
                <span className="rsm-di-icon">📞</span>
                <div><span className="d-label">Telepon</span><span className="d-value">{selectedRS.phone}</span></div>
              </div>
              <div className="rsm-detail-info-card">
                <span className="rsm-di-icon">👤</span>
                <div><span className="d-label">Direktur</span><span className="d-value">{selectedRS.director}</span></div>
              </div>
              <div className="rsm-detail-info-card">
                <span className="rsm-di-icon">🚑</span>
                <div><span className="d-label">IGD</span><span className="d-value">{selectedRS.emergency ? '✅ Aktif 24 Jam' : '❌ Tidak Aktif'}</span></div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="rsm-detail-metrics">
              {[
                { label: 'BOR', value: `${selectedRS.bor}%`, color: selectedRS.bor > 85 ? '#ef4444' : selectedRS.bor > 75 ? '#f59e0b' : '#10b981' },
                { label: 'Beds', value: selectedRS.beds, color: '#3b82f6' },
                { label: 'ICU', value: selectedRS.icu, color: '#ef4444' },
                { label: 'Nakes', value: selectedRS.nakes, color: '#8b5cf6' },
                { label: 'Alkes', value: `${selectedRS.alkesReady}%`, color: selectedRS.alkesReady < 80 ? '#ef4444' : '#10b981' },
                { label: 'Pasien/Hari', value: selectedRS.pasienHarian, color: '#f59e0b' },
                { label: 'Operasi/Bln', value: selectedRS.operasiPerBulan, color: '#06b6d4' },
              ].map(m => (
                <div key={m.label} className="rsm-dm-item" style={{ '--mc': m.color }}>
                  <span className="rsm-dm-value">{m.value}</span>
                  <span className="rsm-dm-label">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Specialties */}
            <div className="rsm-detail-specialties">
              <span className="d-label">Spesialisasi</span>
              <div className="rsm-spec-tags">
                {selectedRS.specialties.map(s => (
                  <span key={s} className="rsm-spec-tag">{s}</span>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="rsm-detail-charts">
              <div className="rsm-detail-chart-card">
                <h4>📈 Trend BOR 12 Bulan</h4>
                <div className="rsm-detail-chart-area">
                  {detailTrendData && <Line data={detailTrendData} options={{ ...chartBaseOptions, plugins: { ...chartBaseOptions.plugins, legend: { display: false } }, scales: { ...chartBaseOptions.scales, y: { ...chartBaseOptions.scales.y, min: 40, max: 100 } } }} />}
                </div>
              </div>
              <div className="rsm-detail-chart-card">
                <h4>🎯 Radar Kinerja</h4>
                <div className="rsm-detail-chart-area">
                  {radarData && <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { color: 'rgba(255,255,255,0.06)' }, grid: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#94a3b8', font: { size: 10, family: 'Inter' } }, ticks: { display: false }, min: 0, max: 100 } }, plugins: { ...chartBaseOptions.plugins, legend: { display: false } } }} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
