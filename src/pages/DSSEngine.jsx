import { useState, useMemo } from 'react';
import { Bar, Doughnut, Radar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { ahpCriteria, ahpZoneScores, treeCountingResults, changeDetectionResults, yieldPredictions } from '../data/dssData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const chartBase = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 12 } },
    tooltip: { backgroundColor: 'rgba(8,15,30,0.95)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 10, cornerRadius: 8, titleFont: { family: 'Outfit', weight: 700, size: 12 }, bodyFont: { family: 'Inter', size: 11 } }
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.06)' } },
    y: { ticks: { color: '#64748b', font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { color: 'rgba(255,255,255,0.06)' } }
  }
};

const TABS = [
  { key: 'ahp', label: 'AHP Scoring', icon: '⚖️' },
  { key: 'tree', label: 'Tree Counting AI', icon: '🌳' },
  { key: 'change', label: 'Change Detection', icon: '🛰️' },
  { key: 'yield', label: 'Yield Prediction', icon: '📈' },
];

const RISK_COLORS = {
  KRITIS: '#FF2E93',
  TINGGI: '#FF6B35',
  SEDANG: '#FFB800',
  RENDAH: '#00FF88',
};

const RECOMMENDATION_COLORS = {
  'HENTIKAN & EVALUASI': '#FF2E93',
  'REVISI ZONASI': '#FF6B35',
  'LANJUTKAN DENGAN MITIGASI': '#FFB800',
  'LANJUTKAN': '#00FF88',
};

const SEVERITY_COLORS = {
  CRITICAL: '#FF2E93',
  HIGH: '#FF6B35',
  MEDIUM: '#FFB800',
  LOW: '#00D4FF',
  INFO: '#7B61FF',
};

const STATUS_COLORS = {
  'Investigasi': '#FFB800',
  'Terverifikasi': '#00D4FF',
  'Pelanggaran AMDAL': '#FF2E93',
  'Sesuai Rencana': '#00FF88',
};

const CLASSIFICATION_COLORS = {
  tbm: { color: '#00D4FF', label: 'TBM (Tanaman Belum Menghasilkan)' },
  tm_muda: { color: '#00FF88', label: 'TM Muda' },
  tm_dewasa: { color: '#FFB800', label: 'TM Dewasa' },
  replanting: { color: '#FF2E93', label: 'Replanting' },
};

function getSustainabilityColor(score) {
  if (score >= 0.7) return '#00FF88';
  if (score >= 0.5) return '#FFB800';
  if (score >= 0.3) return '#FF6B35';
  return '#FF2E93';
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + ' jt';
  if (num >= 1000) return (num / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '';
  return num.toString();
}

export default function DSSEngine() {
  const [activeTab, setActiveTab] = useState('ahp');
  const [weights, setWeights] = useState(() => {
    const w = {};
    ahpCriteria.forEach(c => { w[c.id] = c.weight; });
    return w;
  });
  const [expandedZone, setExpandedZone] = useState(null);
  const [selectedYieldTab, setSelectedYieldTab] = useState('kelapa_sawit');

  // Recalculate sustainability scores based on slider weights
  const computedZones = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const normalizedWeights = {};
    Object.keys(weights).forEach(k => { normalizedWeights[k] = weights[k] / totalWeight; });

    return ahpZoneScores.map(zone => {
      const sustainabilityScore = 1 - (
        normalizedWeights.eco_impact * zone.scores.eco_impact +
        normalizedWeights.customary_tenure * zone.scores.customary_tenure +
        normalizedWeights.overlap_index * zone.scores.overlap_index
      ) + normalizedWeights.economic_yield * zone.scores.economic_yield * 0.5;
      const clamped = Math.max(0, Math.min(1, sustainabilityScore));
      return { ...zone, computed_score: clamped };
    }).sort((a, b) => a.computed_score - b.computed_score);
  }, [weights]);

  // AHP Zone bar chart
  const zoneBarData = useMemo(() => ({
    labels: computedZones.map(z => z.zone_name.split('—')[0].trim()),
    datasets: [{
      label: 'Sustainability Score',
      data: computedZones.map(z => (z.computed_score * 100).toFixed(1)),
      backgroundColor: computedZones.map(z => getSustainabilityColor(z.computed_score) + '99'),
      borderColor: computedZones.map(z => getSustainabilityColor(z.computed_score)),
      borderWidth: 1,
      borderRadius: 6,
      barPercentage: 0.6,
    }]
  }), [computedZones]);

  // Tree counting doughnut for selected area
  const [selectedTree, setSelectedTree] = useState(0);
  const treeDoughnutData = useMemo(() => {
    const area = treeCountingResults[selectedTree];
    if (!area) return null;
    const cls = area.classification;
    return {
      labels: Object.keys(cls).map(k => CLASSIFICATION_COLORS[k].label),
      datasets: [{
        data: Object.keys(cls).map(k => cls[k].count),
        backgroundColor: Object.keys(cls).map(k => CLASSIFICATION_COLORS[k].color + 'cc'),
        borderColor: Object.keys(cls).map(k => CLASSIFICATION_COLORS[k].color),
        borderWidth: 2,
        hoverOffset: 8,
      }]
    };
  }, [selectedTree]);

  // Yield radar chart
  const yieldRadarData = useMemo(() => {
    const labels = ['Dampak Ekologis', 'Hak Ulayat', 'Hasil Ekonomi', 'Tumpang Tindih', 'Keberlanjutan'];
    const avgScores = ahpZoneScores.reduce((acc, z) => {
      acc[0] += z.scores.eco_impact;
      acc[1] += z.scores.customary_tenure;
      acc[2] += z.scores.economic_yield;
      acc[3] += z.scores.overlap_index;
      acc[4] += z.sustainability_score;
      return acc;
    }, [0, 0, 0, 0, 0]).map(v => ((v / ahpZoneScores.length) * 100).toFixed(1));

    return {
      labels,
      datasets: [{
        label: 'Rata-rata Zona',
        data: avgScores,
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0,212,255,0.1)',
        pointBackgroundColor: '#00D4FF',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 5,
        borderWidth: 2.5,
      }, {
        label: 'Target Ideal',
        data: [30, 30, 80, 20, 80],
        borderColor: '#00FF88',
        backgroundColor: 'rgba(0,255,136,0.05)',
        pointBackgroundColor: '#00FF88',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        borderWidth: 1.5,
        borderDash: [4, 2],
      }]
    };
  }, []);

  // Yield production bar chart
  const yieldBarData = useMemo(() => ({
    labels: ['CPO (Sawit)', 'Tebu', 'Padi'],
    datasets: [
      {
        label: 'Target (ton)',
        data: [
          yieldPredictions.kelapa_sawit.papua_selatan.predicted_ton,
          yieldPredictions.tebu.target_ton,
          yieldPredictions.padi.target_ton,
        ],
        backgroundColor: 'rgba(0,212,255,0.3)',
        borderColor: '#00D4FF',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.5,
      },
      {
        label: 'Realisasi (ton)',
        data: [
          yieldPredictions.kelapa_sawit.papua_selatan.current_ton,
          yieldPredictions.tebu.realisasi_ton,
          yieldPredictions.padi.realisasi_ton,
        ],
        backgroundColor: 'rgba(123,97,255,0.4)',
        borderColor: '#7B61FF',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.5,
      },
      {
        label: 'Prediksi 2027 (ton)',
        data: [
          yieldPredictions.kelapa_sawit.papua_selatan.predicted_ton,
          yieldPredictions.tebu.predicted_2027_ton,
          yieldPredictions.padi.predicted_2027_ton,
        ],
        backgroundColor: 'rgba(0,255,136,0.3)',
        borderColor: '#00FF88',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ]
  }), []);

  // Change detection timeline line chart
  const changeTimelineData = useMemo(() => {
    const sorted = [...changeDetectionResults].sort((a, b) => new Date(a.detected_date) - new Date(b.detected_date));
    return {
      labels: sorted.map(d => d.detected_date),
      datasets: [{
        label: 'Area Terdampak (Ha)',
        data: sorted.map(d => d.area_ha),
        borderColor: '#FF2E93',
        backgroundColor: 'rgba(255,46,147,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: sorted.map(d => SEVERITY_COLORS[d.severity] || '#7B61FF'),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      }]
    };
  }, []);

  const handleWeightChange = (id, val) => {
    setWeights(prev => ({ ...prev, [id]: parseFloat(val) }));
  };

  return (
    <div className="page-container dss-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🧠 DSS Engine — AI/ML Decision Support System</h1>
        <p className="page-subtitle">Analytic Hierarchy Process, Tree Counting AI, Change Detection Satelit, dan Prediksi Yield Komoditas</p>
      </div>

      {/* Tab Navigation */}
      <div className="dss-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`dss-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="dss-tab-icon">{tab.icon}</span>
            <span className="dss-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ============ AHP SCORING TAB ============ */}
      {activeTab === 'ahp' && (
        <div className="dss-tab-content">
          {/* Formula Display */}
          <div className="dss-formula-card">
            <div className="dss-formula-header">
              <span className="dss-formula-icon">∑</span>
              <span className="dss-formula-title">Sustainability Formula — Analytical Hierarchy Process</span>
            </div>
            <div className="dss-formula-body">
              <code className="dss-formula-code">
                S(z) = 1 − [w₁·Eco(z) + w₂·Tenure(z) + w₄·Overlap(z)] + w₃·Yield(z)·0.5
              </code>
              <p className="dss-formula-desc">
                Skor mendekati 1.0 = zona berkelanjutan, mendekati 0.0 = zona membutuhkan intervensi segera
              </p>
            </div>
          </div>

          <div className="dss-ahp-grid">
            {/* Weight Sliders */}
            <div className="dss-panel dss-weights-panel">
              <div className="dss-panel-header">
                <h3 className="dss-panel-title">⚙️ Bobot Kriteria AHP</h3>
                <span className="dss-panel-badge">Sesuaikan bobot</span>
              </div>
              <div className="dss-weights-list">
                {ahpCriteria.map(criterion => (
                  <div key={criterion.id} className="dss-weight-item">
                    <div className="dss-weight-top">
                      <span className="dss-weight-icon">{criterion.icon}</span>
                      <span className="dss-weight-name">{criterion.name}</span>
                      <span className="dss-weight-value">{(weights[criterion.id] * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.60"
                      step="0.01"
                      value={weights[criterion.id]}
                      onChange={e => handleWeightChange(criterion.id, e.target.value)}
                      className="dss-weight-slider"
                      style={{ '--slider-color': criterion.id === 'eco_impact' ? '#00FF88' : criterion.id === 'customary_tenure' ? '#FFD700' : criterion.id === 'economic_yield' ? '#00D4FF' : '#FF2E93' }}
                    />
                    <p className="dss-weight-desc">{criterion.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Scores Chart */}
            <div className="dss-panel dss-chart-panel">
              <div className="dss-panel-header">
                <h3 className="dss-panel-title">📊 Skor Keberlanjutan per Zona</h3>
                <span className="dss-panel-badge">{computedZones.length} zona</span>
              </div>
              <div className="dss-chart-area" style={{ height: 300 }}>
                <Bar data={zoneBarData} options={{
                  ...chartBase,
                  indexAxis: 'y',
                  plugins: { ...chartBase.plugins, legend: { display: false } },
                  scales: {
                    ...chartBase.scales,
                    x: { ...chartBase.scales.x, min: 0, max: 100, title: { display: true, text: 'Sustainability Score (%)', color: '#64748b', font: { size: 10 } } }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Zone Score Table & Recommendation Cards */}
          <div className="dss-zones-section">
            <div className="dss-panel-header">
              <h3 className="dss-panel-title">🗂️ Detail Zona Evaluasi & Rekomendasi</h3>
            </div>
            <div className="dss-zones-grid">
              {computedZones.map(zone => (
                <div
                  key={zone.zone_id}
                  className={`dss-zone-card ${expandedZone === zone.zone_id ? 'expanded' : ''}`}
                  onClick={() => setExpandedZone(expandedZone === zone.zone_id ? null : zone.zone_id)}
                >
                  <div className="dss-zone-top">
                    <div className="dss-zone-info">
                      <span className="dss-zone-id">{zone.zone_id}</span>
                      <h4 className="dss-zone-name">{zone.zone_name}</h4>
                      <span className="dss-zone-loc">{zone.kabupaten}, {zone.province}</span>
                    </div>
                    <div className="dss-zone-score-block">
                      <div className="dss-zone-score-ring" style={{ '--ring-color': getSustainabilityColor(zone.computed_score) }}>
                        <span className="dss-zone-score-val">{(zone.computed_score * 100).toFixed(0)}</span>
                      </div>
                      <span className="dss-zone-risk" style={{ color: RISK_COLORS[zone.risk_level] }}>
                        {zone.risk_level}
                      </span>
                    </div>
                  </div>

                  {/* Score bars for each criterion */}
                  <div className="dss-zone-scores">
                    {ahpCriteria.map(c => (
                      <div key={c.id} className="dss-zone-score-row">
                        <span className="dss-zs-label">{c.icon} {c.name}</span>
                        <div className="dss-zs-bar-track">
                          <div
                            className="dss-zs-bar-fill"
                            style={{
                              width: `${zone.scores[c.id] * 100}%`,
                              background: zone.scores[c.id] > 0.7 ? '#FF2E93' : zone.scores[c.id] > 0.5 ? '#FFB800' : '#00FF88'
                            }}
                          />
                        </div>
                        <span className="dss-zs-val">{(zone.scores[c.id] * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation Badge */}
                  <div className="dss-zone-rec">
                    <span
                      className="dss-rec-badge"
                      style={{ '--rec-color': RECOMMENDATION_COLORS[zone.recommendation] || '#FFB800' }}
                    >
                      {zone.recommendation}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {expandedZone === zone.zone_id && (
                    <div className="dss-zone-detail">
                      <p className="dss-zone-detail-text">{zone.recommendation_detail}</p>
                      <div className="dss-zone-detail-meta">
                        <span>📍 Sustainability Score Asli: <strong>{(zone.sustainability_score * 100).toFixed(0)}%</strong></span>
                        <span>📐 Score Terhitung: <strong>{(zone.computed_score * 100).toFixed(0)}%</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ TREE COUNTING TAB ============ */}
      {activeTab === 'tree' && (
        <div className="dss-tab-content">
          {/* Area Selector */}
          <div className="dss-tree-selector">
            {treeCountingResults.map((area, idx) => (
              <button
                key={area.area_id}
                className={`dss-tree-btn ${selectedTree === idx ? 'active' : ''}`}
                onClick={() => setSelectedTree(idx)}
              >
                <span className="dss-tree-btn-icon">🌴</span>
                <span className="dss-tree-btn-text">{area.area_name.split('—')[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className="dss-tree-grid">
            {/* Tree Stats Cards */}
            <div className="dss-tree-stats">
              {(() => {
                const area = treeCountingResults[selectedTree];
                return (
                  <>
                    <div className="dss-stat-card">
                      <div className="dss-stat-icon">🌳</div>
                      <div className="dss-stat-content">
                        <span className="dss-stat-value">{formatNumber(area.total_trees)}</span>
                        <span className="dss-stat-label">Total Pohon</span>
                      </div>
                    </div>
                    <div className="dss-stat-card">
                      <div className="dss-stat-icon">📐</div>
                      <div className="dss-stat-content">
                        <span className="dss-stat-value">{area.density_per_ha}</span>
                        <span className="dss-stat-label">Densitas /Ha</span>
                      </div>
                    </div>
                    <div className="dss-stat-card">
                      <div className="dss-stat-icon">💚</div>
                      <div className="dss-stat-content">
                        <span className="dss-stat-value" style={{ color: area.health_index >= 0.8 ? '#00FF88' : area.health_index >= 0.7 ? '#FFB800' : '#FF2E93' }}>
                          {(area.health_index * 100).toFixed(0)}%
                        </span>
                        <span className="dss-stat-label">Health Index</span>
                      </div>
                    </div>
                    <div className="dss-stat-card">
                      <div className="dss-stat-icon">📦</div>
                      <div className="dss-stat-content">
                        <span className="dss-stat-value">{formatNumber(area.estimated_yield_ton)} ton</span>
                        <span className="dss-stat-label">Est. Yield</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Classification Breakdown */}
            <div className="dss-panel dss-classification-panel">
              <div className="dss-panel-header">
                <h3 className="dss-panel-title">🔬 Klasifikasi Umur Tanaman</h3>
                <span className="dss-panel-badge">{treeCountingResults[selectedTree].area_name}</span>
              </div>
              <div className="dss-classification-list">
                {Object.keys(treeCountingResults[selectedTree].classification).map(key => {
                  const cls = treeCountingResults[selectedTree].classification[key];
                  const cfg = CLASSIFICATION_COLORS[key];
                  return (
                    <div key={key} className="dss-cls-row">
                      <div className="dss-cls-info">
                        <span className="dss-cls-dot" style={{ background: cfg.color }} />
                        <span className="dss-cls-name">{cfg.label}</span>
                      </div>
                      <div className="dss-cls-bar-section">
                        <div className="dss-cls-bar-track">
                          <div className="dss-cls-bar-fill" style={{ width: `${cls.persen}%`, background: cfg.color }} />
                        </div>
                        <span className="dss-cls-persen">{cls.persen}%</span>
                      </div>
                      <div className="dss-cls-meta">
                        <span className="dss-cls-count">{formatNumber(cls.count)} pohon</span>
                        <span className="dss-cls-age">Usia rata-rata: {cls.avgAge} tahun</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doughnut + Canopy */}
            <div className="dss-tree-visuals">
              <div className="dss-panel dss-doughnut-panel">
                <div className="dss-panel-header">
                  <h3 className="dss-panel-title">📊 Distribusi Klasifikasi</h3>
                </div>
                <div className="dss-chart-area" style={{ height: 260 }}>
                  {treeDoughnutData && (
                    <Doughnut data={treeDoughnutData} options={{
                      responsive: true, maintainAspectRatio: false, cutout: '55%',
                      plugins: { ...chartBase.plugins, legend: { position: 'bottom', labels: { ...chartBase.plugins.legend.labels, padding: 14 } } }
                    }} />
                  )}
                </div>
              </div>

              <div className="dss-panel dss-canopy-panel">
                <div className="dss-panel-header">
                  <h3 className="dss-panel-title">🌿 Canopy Coverage</h3>
                </div>
                <div className="dss-canopy-visual">
                  <div className="dss-canopy-ring" style={{ '--canopy-pct': `${treeCountingResults[selectedTree].canopy_coverage_persen}%`, '--canopy-color': treeCountingResults[selectedTree].canopy_coverage_persen >= 80 ? '#00FF88' : '#FFB800' }}>
                    <div className="dss-canopy-inner">
                      <span className="dss-canopy-val">{treeCountingResults[selectedTree].canopy_coverage_persen}%</span>
                      <span className="dss-canopy-label">Tutupan Kanopi</span>
                    </div>
                  </div>
                  <div className="dss-canopy-info">
                    <div className="dss-canopy-row">
                      <span>📅 Last Scan:</span>
                      <strong>{treeCountingResults[selectedTree].last_scan}</strong>
                    </div>
                    <div className="dss-canopy-row">
                      <span>🛰️ Metode:</span>
                      <strong>UAV + Sentinel-2</strong>
                    </div>
                    <div className="dss-canopy-row">
                      <span>🤖 Model:</span>
                      <strong>YOLOv8 Palm Detection</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Areas Summary Cards */}
            <div className="dss-tree-summary">
              <div className="dss-panel-header">
                <h3 className="dss-panel-title">📋 Ringkasan Semua Area</h3>
              </div>
              <div className="dss-tree-cards">
                {treeCountingResults.map((area, idx) => (
                  <div
                    key={area.area_id}
                    className={`dss-tree-card ${selectedTree === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedTree(idx)}
                  >
                    <h4 className="dss-tc-name">{area.area_name}</h4>
                    <div className="dss-tc-stats">
                      <div className="dss-tc-stat">
                        <span className="dss-tc-stat-val">{formatNumber(area.total_trees)}</span>
                        <span className="dss-tc-stat-lbl">Pohon</span>
                      </div>
                      <div className="dss-tc-stat">
                        <span className="dss-tc-stat-val">{area.density_per_ha}/ha</span>
                        <span className="dss-tc-stat-lbl">Densitas</span>
                      </div>
                      <div className="dss-tc-stat">
                        <span className="dss-tc-stat-val" style={{ color: area.health_index >= 0.8 ? '#00FF88' : '#FFB800' }}>{(area.health_index * 100).toFixed(0)}%</span>
                        <span className="dss-tc-stat-lbl">Kesehatan</span>
                      </div>
                    </div>
                    <div className="dss-tc-canopy-bar">
                      <div className="dss-tc-canopy-fill" style={{ width: `${area.canopy_coverage_persen}%` }} />
                      <span className="dss-tc-canopy-text">Kanopi {area.canopy_coverage_persen}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ CHANGE DETECTION TAB ============ */}
      {activeTab === 'change' && (
        <div className="dss-tab-content">
          {/* Summary KPIs */}
          <div className="dss-cd-kpis">
            <div className="dss-stat-card">
              <div className="dss-stat-icon">🛰️</div>
              <div className="dss-stat-content">
                <span className="dss-stat-value">{changeDetectionResults.length}</span>
                <span className="dss-stat-label">Total Deteksi</span>
              </div>
            </div>
            <div className="dss-stat-card" style={{ '--card-accent': '#FF2E93' }}>
              <div className="dss-stat-icon">🚨</div>
              <div className="dss-stat-content">
                <span className="dss-stat-value" style={{ color: '#FF2E93' }}>
                  {changeDetectionResults.filter(d => d.severity === 'CRITICAL').length}
                </span>
                <span className="dss-stat-label">Kritis</span>
              </div>
            </div>
            <div className="dss-stat-card">
              <div className="dss-stat-icon">📐</div>
              <div className="dss-stat-content">
                <span className="dss-stat-value">
                  {formatNumber(changeDetectionResults.reduce((a, d) => a + d.area_ha, 0))} Ha
                </span>
                <span className="dss-stat-label">Total Area</span>
              </div>
            </div>
            <div className="dss-stat-card">
              <div className="dss-stat-icon">⚠️</div>
              <div className="dss-stat-content">
                <span className="dss-stat-value" style={{ color: '#FFB800' }}>
                  {changeDetectionResults.filter(d => !d.within_permit || d.severity === 'CRITICAL').length}
                </span>
                <span className="dss-stat-label">Pelanggaran</span>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="dss-panel dss-cd-chart-panel">
            <div className="dss-panel-header">
              <h3 className="dss-panel-title">📈 Timeline Deteksi Perubahan</h3>
              <span className="dss-panel-badge">Sentinel-2 + Landsat-9 + PlanetScope</span>
            </div>
            <div className="dss-chart-area" style={{ height: 250 }}>
              <Line data={changeTimelineData} options={{
                ...chartBase,
                plugins: { ...chartBase.plugins, legend: { display: false } },
                scales: {
                  ...chartBase.scales,
                  y: { ...chartBase.scales.y, title: { display: true, text: 'Area (Ha)', color: '#64748b', font: { size: 10 } } }
                }
              }} />
            </div>
          </div>

          {/* Detection Timeline Cards */}
          <div className="dss-cd-timeline">
            <div className="dss-panel-header">
              <h3 className="dss-panel-title">🕐 Timeline Deteksi</h3>
            </div>
            <div className="dss-cd-list">
              {[...changeDetectionResults]
                .sort((a, b) => new Date(b.detected_date) - new Date(a.detected_date))
                .map(det => (
                  <div key={det.detection_id} className={`dss-cd-card ${det.severity === 'CRITICAL' ? 'critical' : ''}`}>
                    <div className="dss-cd-timeline-dot" style={{ background: SEVERITY_COLORS[det.severity] }} />
                    <div className="dss-cd-card-body">
                      <div className="dss-cd-card-top">
                        <div className="dss-cd-card-info">
                          <span className="dss-cd-id">{det.detection_id}</span>
                          <h4 className="dss-cd-location">{det.location}</h4>
                          <span className="dss-cd-date">{det.detected_date}</span>
                        </div>
                        <div className="dss-cd-badges">
                          <span className="dss-cd-severity" style={{ '--sev-color': SEVERITY_COLORS[det.severity] }}>
                            {det.severity}
                          </span>
                          <span className="dss-cd-status" style={{ '--status-color': STATUS_COLORS[det.status] || '#94a3b8' }}>
                            {det.status}
                          </span>
                        </div>
                      </div>
                      <div className="dss-cd-card-detail">
                        <div className="dss-cd-change">
                          <span className="dss-cd-before">{det.before_class}</span>
                          <span className="dss-cd-arrow">→</span>
                          <span className="dss-cd-after">{det.after_class}</span>
                        </div>
                        <div className="dss-cd-meta-row">
                          <span>📐 {det.area_ha} Ha</span>
                          <span>🎯 Confidence: {(det.confidence * 100).toFixed(0)}%</span>
                          <span>🛰️ {det.satellite}</span>
                          <span>{det.within_permit ? '✅ Dalam Izin' : '❌ Di Luar Izin'}</span>
                        </div>
                        <p className="dss-cd-notes">{det.notes}</p>
                      </div>
                      <div className="dss-cd-coords">
                        <span className="dss-cd-coord-label">📍</span>
                        <span className="dss-cd-coord-val">{det.coordinates[1].toFixed(4)}°S, {det.coordinates[0].toFixed(4)}°E</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ YIELD PREDICTION TAB ============ */}
      {activeTab === 'yield' && (
        <div className="dss-tab-content">
          {/* Commodity Tabs */}
          <div className="dss-yield-tabs">
            {[
              { key: 'kelapa_sawit', label: 'CPO (Kelapa Sawit)', icon: '🌴' },
              { key: 'tebu', label: 'Tebu / Gula', icon: '🍬' },
              { key: 'padi', label: 'Padi / Beras', icon: '🌾' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`dss-yield-tab ${selectedYieldTab === tab.key ? 'active' : ''}`}
                onClick={() => setSelectedYieldTab(tab.key)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="dss-yield-grid">
            {/* Prediction Cards per commodity */}
            {selectedYieldTab === 'kelapa_sawit' && (
              <div className="dss-yield-detail">
                <div className="dss-yield-kpi-row">
                  <div className="dss-yield-kpi">
                    <span className="dss-yk-label">Produksi Nasional</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.kelapa_sawit.nasional.current_ton)} ton</span>
                    <span className="dss-yk-sub">Target: {formatNumber(yieldPredictions.kelapa_sawit.nasional.predicted_ton)} ton</span>
                  </div>
                  <div className="dss-yield-kpi highlight">
                    <span className="dss-yk-label">Papua Selatan</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.kelapa_sawit.papua_selatan.current_ton)} ton</span>
                    <span className="dss-yk-sub">Prediksi: {formatNumber(yieldPredictions.kelapa_sawit.papua_selatan.predicted_ton)} ton</span>
                  </div>
                  <div className="dss-yield-kpi growth">
                    <span className="dss-yk-label">Pertumbuhan Papua</span>
                    <span className="dss-yk-value" style={{ color: '#00FF88' }}>+{yieldPredictions.kelapa_sawit.papua_selatan.growth_persen}%</span>
                    <span className="dss-yk-sub">vs Nasional: +{yieldPredictions.kelapa_sawit.nasional.growth_persen}%</span>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="dss-panel dss-risk-panel">
                  <div className="dss-panel-header">
                    <h3 className="dss-panel-title">⚠️ Faktor Risiko Produksi</h3>
                  </div>
                  <div className="dss-risk-list">
                    {yieldPredictions.kelapa_sawit.risk_factors.map((rf, i) => (
                      <div key={i} className={`dss-risk-item ${rf.impact_persen < 0 ? 'negative' : 'positive'}`}>
                        <div className="dss-risk-top">
                          <span className="dss-risk-name">{rf.factor}</span>
                          <span className="dss-risk-impact" style={{ color: rf.impact_persen < 0 ? '#FF2E93' : '#00FF88' }}>
                            {rf.impact_persen > 0 ? '+' : ''}{rf.impact_persen}%
                          </span>
                        </div>
                        <div className="dss-risk-bar-track">
                          <div
                            className="dss-risk-bar-fill"
                            style={{
                              width: `${Math.abs(rf.impact_persen) * 4}%`,
                              background: rf.impact_persen < 0 ? '#FF2E93' : '#00FF88',
                              marginLeft: rf.impact_persen < 0 ? 'auto' : '0',
                            }}
                          />
                        </div>
                        <p className="dss-risk-desc">{rf.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedYieldTab === 'tebu' && (
              <div className="dss-yield-detail">
                <div className="dss-yield-kpi-row">
                  <div className="dss-yield-kpi">
                    <span className="dss-yk-label">Target Tebu</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.tebu.target_ton)} ton</span>
                  </div>
                  <div className="dss-yield-kpi highlight">
                    <span className="dss-yk-label">Realisasi</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.tebu.realisasi_ton)} ton</span>
                    <span className="dss-yk-sub">{((yieldPredictions.tebu.realisasi_ton / yieldPredictions.tebu.target_ton) * 100).toFixed(1)}% dari target</span>
                  </div>
                  <div className="dss-yield-kpi">
                    <span className="dss-yk-label">Prediksi 2027</span>
                    <span className="dss-yk-value" style={{ color: '#00D4FF' }}>{formatNumber(yieldPredictions.tebu.predicted_2027_ton)} ton</span>
                  </div>
                  <div className="dss-yield-kpi growth">
                    <span className="dss-yk-label">Gula Kristal</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.tebu.gula_kristal_ton)} ton</span>
                  </div>
                </div>
                <div className="dss-yield-progress">
                  <div className="dss-yp-header">
                    <span>Realisasi vs Target</span>
                    <span>{((yieldPredictions.tebu.realisasi_ton / yieldPredictions.tebu.target_ton) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="dss-yp-bar-track">
                    <div className="dss-yp-bar-fill current" style={{ width: `${(yieldPredictions.tebu.realisasi_ton / yieldPredictions.tebu.target_ton) * 100}%` }} />
                    <div className="dss-yp-bar-fill predicted" style={{ width: `${(yieldPredictions.tebu.predicted_2027_ton / yieldPredictions.tebu.target_ton) * 100}%` }} />
                  </div>
                  <div className="dss-yp-legend">
                    <span className="dss-yp-legend-item"><span className="dss-yp-dot current" /> Realisasi</span>
                    <span className="dss-yp-legend-item"><span className="dss-yp-dot predicted" /> Prediksi 2027</span>
                  </div>
                </div>
              </div>
            )}

            {selectedYieldTab === 'padi' && (
              <div className="dss-yield-detail">
                <div className="dss-yield-kpi-row">
                  <div className="dss-yield-kpi">
                    <span className="dss-yk-label">Target Padi</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.padi.target_ton)} ton</span>
                  </div>
                  <div className="dss-yield-kpi highlight">
                    <span className="dss-yk-label">Realisasi</span>
                    <span className="dss-yk-value">{formatNumber(yieldPredictions.padi.realisasi_ton)} ton</span>
                    <span className="dss-yk-sub">{((yieldPredictions.padi.realisasi_ton / yieldPredictions.padi.target_ton) * 100).toFixed(1)}% dari target</span>
                  </div>
                  <div className="dss-yield-kpi">
                    <span className="dss-yk-label">Prediksi 2027</span>
                    <span className="dss-yk-value" style={{ color: '#00D4FF' }}>{formatNumber(yieldPredictions.padi.predicted_2027_ton)} ton</span>
                  </div>
                  <div className="dss-yield-kpi growth">
                    <span className="dss-yk-label">Surplus Beras</span>
                    <span className="dss-yk-value" style={{ color: '#00FF88' }}>{formatNumber(yieldPredictions.padi.surplus_beras_ton)} ton</span>
                  </div>
                </div>
                <div className="dss-yield-progress">
                  <div className="dss-yp-header">
                    <span>Realisasi vs Target</span>
                    <span>{((yieldPredictions.padi.realisasi_ton / yieldPredictions.padi.target_ton) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="dss-yp-bar-track">
                    <div className="dss-yp-bar-fill current" style={{ width: `${(yieldPredictions.padi.realisasi_ton / yieldPredictions.padi.target_ton) * 100}%` }} />
                    <div className="dss-yp-bar-fill predicted" style={{ width: `${(yieldPredictions.padi.predicted_2027_ton / yieldPredictions.padi.target_ton) * 100}%` }} />
                  </div>
                  <div className="dss-yp-legend">
                    <span className="dss-yp-legend-item"><span className="dss-yp-dot current" /> Realisasi</span>
                    <span className="dss-yp-legend-item"><span className="dss-yp-dot predicted" /> Prediksi 2027</span>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="dss-yield-charts">
              {/* Production Bar Chart */}
              <div className="dss-panel dss-yield-bar-panel">
                <div className="dss-panel-header">
                  <h3 className="dss-panel-title">📊 Produksi Komoditas</h3>
                </div>
                <div className="dss-chart-area" style={{ height: 280 }}>
                  <Bar data={yieldBarData} options={{
                    ...chartBase,
                    plugins: { ...chartBase.plugins, legend: { position: 'top', labels: { ...chartBase.plugins.legend.labels } } },
                    scales: {
                      ...chartBase.scales,
                      y: { ...chartBase.scales.y, title: { display: true, text: 'Ton', color: '#64748b', font: { size: 10 } } }
                    }
                  }} />
                </div>
              </div>

              {/* Sustainability Radar */}
              <div className="dss-panel dss-yield-radar-panel">
                <div className="dss-panel-header">
                  <h3 className="dss-panel-title">🎯 Radar Keberlanjutan</h3>
                </div>
                <div className="dss-chart-area" style={{ height: 280 }}>
                  <Radar data={yieldRadarData} options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      r: {
                        angleLines: { color: 'rgba(255,255,255,0.06)' },
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        pointLabels: { color: '#94a3b8', font: { size: 10, family: 'Inter' } },
                        ticks: { display: false },
                        min: 0, max: 100,
                      }
                    },
                    plugins: { ...chartBase.plugins, legend: { position: 'bottom', labels: { ...chartBase.plugins.legend.labels, padding: 16 } } }
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
