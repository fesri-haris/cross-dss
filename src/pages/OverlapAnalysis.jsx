import { useState, useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import pittiOverlapData, { pittiSummary } from '../data/pittiOverlap';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const SEVERITY_CONFIG = {
  CRITICAL: { label: 'Kritis', color: '#FF2E93', bg: 'rgba(255,46,147,0.15)', icon: '🚨' },
  HIGH: { label: 'Tinggi', color: '#FFB800', bg: 'rgba(255,184,0,0.15)', icon: '⚠️' },
  MEDIUM: { label: 'Sedang', color: '#00D4FF', bg: 'rgba(0,212,255,0.15)', icon: '🔶' },
  LOW: { label: 'Rendah', color: '#00FF88', bg: 'rgba(0,255,136,0.15)', icon: '✅' },
};

const STATUS_CONFIG = {
  'Belum Terselesaikan': { color: '#FF2E93', icon: '🔴' },
  'Sengketa Aktif': { color: '#FF2E93', icon: '🔥' },
  'Dalam Mediasi': { color: '#FFB800', icon: '🤝' },
  'Dalam Negosiasi': { color: '#FFB800', icon: '💬' },
  'Dalam Review': { color: '#00D4FF', icon: '🔍' },
  'Moratorium': { color: '#7B61FF', icon: '⏸️' },
  'Terselesaikan': { color: '#00FF88', icon: '✅' },
};

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

export default function OverlapAnalysis() {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [activeChart, setActiveChart] = useState('bar');

  // All conflicts from data
  const allConflicts = useMemo(() =>
    pittiOverlapData.features.map(f => f.properties), []);

  // Unique provinces and types for filters
  const provinces = useMemo(() => [...new Set(allConflicts.map(c => c.province))], [allConflicts]);
  const conflictTypes = useMemo(() => [...new Set(allConflicts.map(c => c.conflict_type))], [allConflicts]);

  // Filtered conflicts
  const filteredConflicts = useMemo(() => {
    return allConflicts.filter(c => {
      if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
      if (provinceFilter !== 'ALL' && c.province !== provinceFilter) return false;
      if (typeFilter !== 'ALL' && c.conflict_type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.overlap_id.toLowerCase().includes(q) ||
          (c.layer_a_company || '').toLowerCase().includes(q) ||
          (c.layer_b_company || '').toLowerCase().includes(q) ||
          c.province.toLowerCase().includes(q) ||
          (c.layer_a || '').toLowerCase().includes(q) ||
          (c.layer_b || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allConflicts, severityFilter, provinceFilter, typeFilter, searchQuery]);

  // KPI Cards
  const kpiCards = useMemo(() => {
    const sev = pittiSummary.perSeverity;
    return [
      { label: 'Total Tumpang Tindih', value: pittiSummary.totalOverlapNasional.toLocaleString('id-ID'), icon: '🗺️', sub: 'Nasional', color: '#FF2E93' },
      { label: 'Papua Selatan', value: pittiSummary.totalOverlapPapuaSelatan, icon: '📍', sub: fmtArea(pittiSummary.totalLuasOverlapPapua), color: '#00D4FF' },
      { label: 'Total Luas Overlap', value: fmtArea(pittiSummary.totalLuasOverlap), icon: '📐', sub: 'Seluruh Indonesia', color: '#7B61FF' },
      { label: 'Kritis', value: sev.critical.count.toLocaleString('id-ID'), icon: '🚨', sub: fmtArea(sev.critical.luasHa), color: '#FF2E93' },
      { label: 'Tinggi', value: sev.high.count.toLocaleString('id-ID'), icon: '⚠️', sub: fmtArea(sev.high.luasHa), color: '#FFB800' },
      { label: 'Sedang + Rendah', value: (sev.medium.count + sev.low.count).toLocaleString('id-ID'), icon: '🔶', sub: fmtArea(sev.medium.luasHa + sev.low.luasHa), color: '#00D4FF' },
    ];
  }, []);

  // Chart: Bar — per conflict type
  const barChartData = useMemo(() => ({
    labels: pittiSummary.perTipeKonflik.map(t => t.type),
    datasets: [{
      label: 'Jumlah Overlap',
      data: pittiSummary.perTipeKonflik.map(t => t.count),
      backgroundColor: [
        'rgba(255,46,147,0.7)',
        'rgba(255,107,53,0.7)',
        'rgba(0,212,255,0.7)',
        'rgba(255,215,0,0.7)',
        'rgba(123,97,255,0.7)',
        'rgba(0,255,136,0.7)',
      ],
      borderColor: ['#FF2E93', '#FF6B35', '#00D4FF', '#FFD700', '#7B61FF', '#00FF88'],
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.7,
    }],
  }), []);

  // Chart: Doughnut — severity distribution
  const doughnutChartData = useMemo(() => {
    const sev = pittiSummary.perSeverity;
    return {
      labels: ['Kritis', 'Tinggi', 'Sedang', 'Rendah'],
      datasets: [{
        data: [sev.critical.count, sev.high.count, sev.medium.count, sev.low.count],
        backgroundColor: ['rgba(255,46,147,0.8)', 'rgba(255,184,0,0.8)', 'rgba(0,212,255,0.8)', 'rgba(0,255,136,0.8)'],
        borderColor: ['#FF2E93', '#FFB800', '#00D4FF', '#00FF88'],
        borderWidth: 2,
        hoverOffset: 6,
      }],
    };
  }, []);

  // Chart: Line — trend new vs resolved
  const lineChartData = useMemo(() => ({
    labels: pittiSummary.trendBulanan.map(t => t.bulan),
    datasets: [
      {
        label: 'Konflik Baru',
        data: pittiSummary.trendBulanan.map(t => t.baru),
        borderColor: '#FF2E93',
        backgroundColor: 'rgba(255,46,147,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#FF2E93',
        borderWidth: 2,
      },
      {
        label: 'Terselesaikan',
        data: pittiSummary.trendBulanan.map(t => t.selesai),
        borderColor: '#00FF88',
        backgroundColor: 'rgba(0,255,136,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#00FF88',
        borderWidth: 2,
      },
    ],
  }), []);

  const clearFilters = () => {
    setSeverityFilter('ALL');
    setProvinceFilter('ALL');
    setTypeFilter('ALL');
    setSearchQuery('');
  };

  const activeFiltersCount = [severityFilter, provinceFilter, typeFilter].filter(f => f !== 'ALL').length + (searchQuery ? 1 : 0);

  return (
    <div className="page-container oa-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🔥 Analisis Tumpang Tindih — PITTI</h1>
        <p className="page-subtitle">Peta Indikatif Tumpang Tindih Informasi Geospasial Tematik — Konflik Spasial Nasional</p>
      </div>

      {/* KPI Cards */}
      <div className="oa-kpi-grid">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="oa-kpi-card" style={{ '--kpi-color': kpi.color }}>
            <div className="oa-kpi-icon">{kpi.icon}</div>
            <div className="oa-kpi-body">
              <span className="oa-kpi-value">{kpi.value}</span>
              <span className="oa-kpi-label">{kpi.label}</span>
              <span className="oa-kpi-sub">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="oa-charts-section">
        <div className="oa-chart-tabs">
          {[
            { key: 'bar', icon: '📊', label: 'Per Tipe Konflik' },
            { key: 'doughnut', icon: '🍩', label: 'Severity Distribution' },
            { key: 'line', icon: '📈', label: 'Tren Bulanan' },
          ].map(ct => (
            <button key={ct.key} className={`oa-chart-tab ${activeChart === ct.key ? 'active' : ''}`} onClick={() => setActiveChart(ct.key)}>
              <span>{ct.icon}</span> {ct.label}
            </button>
          ))}
        </div>
        <div className="oa-chart-body">
          {activeChart === 'bar' && (
            <div className="oa-chart-area">
              <Bar data={barChartData} options={{
                ...chartDefaults,
                indexAxis: 'y',
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
              }} />
            </div>
          )}
          {activeChart === 'doughnut' && (
            <div className="oa-chart-area oa-chart-doughnut">
              <Doughnut data={doughnutChartData} options={doughnutOpts} />
            </div>
          )}
          {activeChart === 'line' && (
            <div className="oa-chart-area">
              <Line data={lineChartData} options={{
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { position: 'top', labels: { ...chartDefaults.plugins.legend.labels } } },
              }} />
            </div>
          )}
        </div>

        {/* Severity breakdown side panel inside charts */}
        <div className="oa-severity-breakdown">
          <h4 className="oa-sb-title">Distribusi Severity</h4>
          {Object.entries(pittiSummary.perSeverity).map(([key, val]) => {
            const cfg = SEVERITY_CONFIG[key.toUpperCase()] || SEVERITY_CONFIG.LOW;
            const totalCount = Object.values(pittiSummary.perSeverity).reduce((s, v) => s + v.count, 0);
            const pct = ((val.count / totalCount) * 100).toFixed(1);
            return (
              <div key={key} className="oa-sb-row">
                <div className="oa-sb-row-header">
                  <span className="oa-sb-icon">{cfg.icon}</span>
                  <span className="oa-sb-label">{cfg.label}</span>
                  <span className="oa-sb-count" style={{ color: cfg.color }}>{val.count.toLocaleString('id-ID')}</span>
                </div>
                <div className="oa-sb-bar-track">
                  <div className="oa-sb-bar-fill" style={{ width: `${pct}%`, background: cfg.color }} />
                </div>
                <div className="oa-sb-row-footer">
                  <span>{fmtArea(val.luasHa)}</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="oa-filter-bar">
        <div className="oa-filter-group">
          <label>Severity:</label>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
            <option value="ALL">Semua</option>
            <option value="CRITICAL">🚨 Kritis</option>
            <option value="HIGH">⚠️ Tinggi</option>
            <option value="MEDIUM">🔶 Sedang</option>
            <option value="LOW">✅ Rendah</option>
          </select>
        </div>
        <div className="oa-filter-group">
          <label>Provinsi:</label>
          <select value={provinceFilter} onChange={e => setProvinceFilter(e.target.value)}>
            <option value="ALL">Semua Provinsi</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="oa-filter-group">
          <label>Tipe Konflik:</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="ALL">Semua Tipe</option>
            {conflictTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="oa-filter-group oa-search-group">
          <input
            type="text"
            placeholder="Cari ID, perusahaan, layer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="oa-search-input"
          />
          <span className="oa-search-icon">🔍</span>
        </div>
        {activeFiltersCount > 0 && (
          <button className="oa-clear-filters" onClick={clearFilters}>
            ✕ Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Main Content: Table + Detail Panel */}
      <div className="oa-main-content">
        {/* Conflict Table */}
        <div className={`oa-table-section ${selectedConflict ? 'with-panel' : ''}`}>
          <div className="oa-table-header">
            <h3 className="oa-table-title">🗂️ Daftar Konflik Spasial</h3>
            <span className="oa-table-count">{filteredConflicts.length} dari {allConflicts.length} konflik</span>
          </div>
          <div className="oa-table-wrap">
            <table className="oa-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Layer A</th>
                  <th>Layer B</th>
                  <th>Perusahaan A</th>
                  <th>Perusahaan B</th>
                  <th>Luas (Ha)</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Provinsi</th>
                </tr>
              </thead>
              <tbody>
                {filteredConflicts.map(conflict => {
                  const sevCfg = SEVERITY_CONFIG[conflict.severity] || SEVERITY_CONFIG.MEDIUM;
                  const statusCfg = STATUS_CONFIG[conflict.status] || { color: '#94a3b8', icon: '❔' };
                  const isSelected = selectedConflict?.overlap_id === conflict.overlap_id;
                  return (
                    <tr
                      key={conflict.overlap_id}
                      className={`oa-conflict-row ${isSelected ? 'selected' : ''} oa-severity-${conflict.severity.toLowerCase()}`}
                      onClick={() => setSelectedConflict(isSelected ? null : conflict)}
                    >
                      <td className="oa-td-mono">{conflict.overlap_id}</td>
                      <td className="oa-td-layer">{conflict.layer_a}</td>
                      <td className="oa-td-layer">{conflict.layer_b}</td>
                      <td className="oa-td-company">{conflict.layer_a_company || '-'}</td>
                      <td className="oa-td-company">{conflict.layer_b_company || '-'}</td>
                      <td className="oa-td-mono oa-td-area">{conflict.overlap_area_ha?.toLocaleString('id-ID')}</td>
                      <td>
                        <span
                          className={`oa-severity-badge ${conflict.severity === 'CRITICAL' ? 'oa-pulse' : ''}`}
                          style={{ '--sev-color': sevCfg.color, '--sev-bg': sevCfg.bg }}
                        >
                          {sevCfg.icon} {sevCfg.label}
                        </span>
                      </td>
                      <td>
                        <span className="oa-status-badge" style={{ color: statusCfg.color }}>
                          {statusCfg.icon} {conflict.status}
                        </span>
                      </td>
                      <td>{conflict.province}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredConflicts.length === 0 && (
              <div className="oa-no-data">Tidak ada konflik yang cocok dengan filter.</div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedConflict && (
          <div className="oa-detail-panel">
            <div className="oa-detail-header">
              <h3 className="oa-detail-title">Detail Konflik</h3>
              <button className="oa-detail-close" onClick={() => setSelectedConflict(null)}>✕</button>
            </div>

            <div className="oa-detail-id">
              <span className="oa-detail-id-label">ID:</span>
              <span className="oa-detail-id-value">{selectedConflict.overlap_id}</span>
            </div>

            <div className="oa-detail-severity-row">
              <span
                className={`oa-severity-badge large ${selectedConflict.severity === 'CRITICAL' ? 'oa-pulse' : ''}`}
                style={{
                  '--sev-color': SEVERITY_CONFIG[selectedConflict.severity]?.color,
                  '--sev-bg': SEVERITY_CONFIG[selectedConflict.severity]?.bg,
                }}
              >
                {SEVERITY_CONFIG[selectedConflict.severity]?.icon} {SEVERITY_CONFIG[selectedConflict.severity]?.label}
              </span>
              <span className="oa-detail-area">{selectedConflict.overlap_area_ha?.toLocaleString('id-ID')} Ha</span>
            </div>

            <div className="oa-detail-layers">
              <div className="oa-detail-layer-card layer-a">
                <span className="oa-dl-tag">Layer A</span>
                <span className="oa-dl-name">{selectedConflict.layer_a}</span>
                <span className="oa-dl-company">{selectedConflict.layer_a_company}</span>
                <span className="oa-dl-ref">{selectedConflict.layer_a_id}</span>
              </div>
              <div className="oa-detail-vs">VS</div>
              <div className="oa-detail-layer-card layer-b">
                <span className="oa-dl-tag">Layer B</span>
                <span className="oa-dl-name">{selectedConflict.layer_b}</span>
                <span className="oa-dl-company">{selectedConflict.layer_b_company}</span>
                <span className="oa-dl-ref">{selectedConflict.layer_b_id}</span>
              </div>
            </div>

            <div className="oa-detail-info-grid">
              <div className="oa-detail-info-item">
                <span className="oa-di-label">📍 Provinsi</span>
                <span className="oa-di-value">{selectedConflict.province}</span>
              </div>
              <div className="oa-detail-info-item">
                <span className="oa-di-label">🏘️ Kabupaten</span>
                <span className="oa-di-value">{selectedConflict.kabupaten || '-'}</span>
              </div>
              <div className="oa-detail-info-item">
                <span className="oa-di-label">🔀 Tipe Konflik</span>
                <span className="oa-di-value">{selectedConflict.conflict_type}</span>
              </div>
              <div className="oa-detail-info-item">
                <span className="oa-di-label">📊 Status</span>
                <span className="oa-di-value" style={{ color: STATUS_CONFIG[selectedConflict.status]?.color }}>
                  {STATUS_CONFIG[selectedConflict.status]?.icon} {selectedConflict.status}
                </span>
              </div>
              <div className="oa-detail-info-item">
                <span className="oa-di-label">📅 Dilaporkan</span>
                <span className="oa-di-value">{selectedConflict.reported_date || '-'}</span>
              </div>
              <div className="oa-detail-info-item">
                <span className="oa-di-label">📐 Luas Overlap</span>
                <span className="oa-di-value">{selectedConflict.overlap_area_ha?.toLocaleString('id-ID')} Ha</span>
              </div>
            </div>

            {selectedConflict.description && (
              <div className="oa-detail-desc">
                <span className="oa-dd-label">📝 Deskripsi</span>
                <p className="oa-dd-text">{selectedConflict.description}</p>
              </div>
            )}

            <div className="oa-detail-actions">
              <button className="oa-action-btn oa-action-primary">📋 Buat Laporan</button>
              <button className="oa-action-btn oa-action-secondary">🗺️ Lihat di Peta</button>
            </div>
          </div>
        )}
      </div>

      {/* Conflict Type Breakdown Cards */}
      <div className="oa-type-section">
        <h3 className="oa-section-title">🔀 Breakdown Per Tipe Konflik</h3>
        <div className="oa-type-grid">
          {pittiSummary.perTipeKonflik.map((tipe, i) => {
            const colors = ['#FF2E93', '#FF6B35', '#00D4FF', '#FFD700', '#7B61FF', '#00FF88'];
            const color = colors[i % colors.length];
            return (
              <div key={tipe.type} className="oa-type-card" style={{ '--type-color': color }}>
                <div className="oa-type-card-header">
                  <span className="oa-type-name">{tipe.type}</span>
                  <span className="oa-type-pct" style={{ color }}>{tipe.persen}%</span>
                </div>
                <div className="oa-type-stats">
                  <div className="oa-type-stat">
                    <span className="oa-ts-value">{tipe.count.toLocaleString('id-ID')}</span>
                    <span className="oa-ts-label">Kasus</span>
                  </div>
                  <div className="oa-type-stat">
                    <span className="oa-ts-value">{fmtArea(tipe.luasHa)}</span>
                    <span className="oa-ts-label">Luas</span>
                  </div>
                </div>
                <div className="oa-type-bar-track">
                  <div className="oa-type-bar-fill" style={{ width: `${tipe.persen}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trend Insight */}
      <div className="oa-trend-insight">
        <h3 className="oa-section-title">📈 Tren Penyelesaian Konflik</h3>
        <div className="oa-trend-cards">
          {pittiSummary.trendBulanan.map((t, i) => {
            const net = t.baru - t.selesai;
            const isPositive = net <= 0;
            return (
              <div key={i} className="oa-trend-card">
                <span className="oa-tc-month">{t.bulan}</span>
                <div className="oa-tc-stats">
                  <span className="oa-tc-new">+{t.baru} Baru</span>
                  <span className="oa-tc-resolved">-{t.selesai} Selesai</span>
                </div>
                <span className={`oa-tc-net ${isPositive ? 'positive' : 'negative'}`}>
                  Net: {net > 0 ? '+' : ''}{net}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="oa-footer-summary">
        <div className="oa-footer-item">
          <span className="oa-footer-label">Sumber Data:</span>
          <span className="oa-footer-value">OneMap BIG — PITTI</span>
        </div>
        <div className="oa-footer-item">
          <span className="oa-footer-label">Terakhir Diperbarui:</span>
          <span className="oa-footer-value">15 Mei 2026</span>
        </div>
        <div className="oa-footer-item">
          <span className="oa-footer-label">Cakupan:</span>
          <span className="oa-footer-value">Nasional (Fokus Papua Selatan)</span>
        </div>
      </div>
    </div>
  );
}
