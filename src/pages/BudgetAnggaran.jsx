import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { hospitals } from '../data/hospitalData';
import {
  dailyBMHP, monthlyAccumulation, bluCalculations, budgetProjections, validityScores,
  getNationalTotals, bmhpCategories, paymentSources, shiftSchedule, budgetMonthLabels,
  bluCategoryLabels, projectionCategoryLabels, validityDimensionLabels,
} from '../data/budgetData';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const forceIcon = { AD: '🟢', AL: '🔵', AU: '🟠' };
const forceLabel = { AD: 'TNI AD', AL: 'TNI AL', AU: 'TNI AU' };

// Smart currency formatter — input value is in JUTA RUPIAH
// 1 Miliar = 1.000 Juta, 1 Triliun = 1.000.000 Juta
const fmtMoney = (v) => {
  if (v >= 1000000) return `Rp ${(v / 1000000).toFixed(2)} Triliun`;
  if (v >= 10000) return `Rp ${(v / 1000).toFixed(1)} Miliar`;
  if (v >= 1000) return `Rp ${(v / 1000).toFixed(2)} Miliar`;
  if (v >= 1) return `Rp ${v.toLocaleString('id-ID')} Juta`;
  return 'Rp 0';
};
// Smart auto-scale formatter for table cells — input value is in JUTA RUPIAH
const fmtJuta = (v) => {
  if (v >= 1000000) return `Rp ${(v / 1000000).toFixed(2)} T`;
  if (v >= 10000) return `Rp ${(v / 1000).toFixed(1)} M`;
  if (v >= 1000) return `Rp ${(v / 1000).toFixed(2)} M`;
  return `Rp ${v.toLocaleString('id-ID')} Jt`;
};

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

const cycleSteps = [
  { step: 1, title: 'Konsumsi Harian', desc: 'Data penggunaan BMHP tercatat real-time dari pasien BPJS, Asuransi, dan Mandiri (Shift 09:00 - 21:00).', icon: '🏥', color: '#3b82f6' },
  { step: 2, title: 'Akumulasi Bulanan', desc: 'Sistem Pusat mengakumulasi pengeluaran murni untuk BMHP bulanan secara transparan tanpa intervensi birokrasi daerah.', icon: '📊', color: '#10b981' },
  { step: 3, title: 'Perhitungan BLU', desc: 'Sistem mengkalkulasi otomatis 30% dari total pendapatan RS yang diwajibkan untuk pencairan anggaran operasional (BLU).', icon: '🧮', color: '#f59e0b' },
  { step: 4, title: 'Pengajuan Anggaran Pusat', desc: 'Berdasarkan data SIMRS yang valid, Kemhan memproyeksikan kebutuhan absolut tahun berikutnya, dengan tambahan surplus (+5%).', icon: '💰', color: '#8b5cf6' },
];

export default function BudgetAnggaran() {
  const [selectedRs, setSelectedRs] = useState(0); // 0 = Nasional
  const [activeSection, setActiveSection] = useState('overview');
  const [activeBluRs, setActiveBluRs] = useState(1);

  const national = useMemo(() => getNationalTotals(), []);

  const currentBMHP = useMemo(() => selectedRs === 0 ? null : dailyBMHP[selectedRs], [selectedRs]);
  const currentMonthly = useMemo(() => selectedRs === 0 ? null : monthlyAccumulation[selectedRs], [selectedRs]);
  const currentBLU = useMemo(() => bluCalculations[activeBluRs], [activeBluRs]);
  const currentProjection = useMemo(() => selectedRs === 0 ? null : budgetProjections[selectedRs], [selectedRs]);

  // ═══ CHART DATA ═══

  // Monthly accumulation chart (all RS stacked or single RS)
  const monthlyChartData = useMemo(() => {
    if (selectedRs === 0) {
      return {
        labels: budgetMonthLabels,
        datasets: paymentSources.map(ps => ({
          label: ps.label,
          data: budgetMonthLabels.map((_, i) =>
            hospitals.reduce((sum, h) => sum + monthlyAccumulation[h.id].breakdown[ps.key][i], 0)
          ),
          backgroundColor: ps.color + '99',
          borderColor: ps.color,
          borderWidth: 1,
          borderRadius: 4,
        })),
      };
    }
    const data = monthlyAccumulation[selectedRs];
    return {
      labels: budgetMonthLabels,
      datasets: paymentSources.map(ps => ({
        label: ps.label,
        data: data.breakdown[ps.key],
        backgroundColor: ps.color + '99',
        borderColor: ps.color,
        borderWidth: 1,
        borderRadius: 4,
      })),
    };
  }, [selectedRs]);

  // BLU doughnut
  const bluDoughnutData = useMemo(() => {
    const blu = currentBLU;
    const keys = Object.keys(blu.bluBreakdown);
    return {
      labels: keys.map(k => bluCategoryLabels[k].label),
      datasets: [{
        data: keys.map(k => blu.bluBreakdown[k]),
        backgroundColor: keys.map(k => bluCategoryLabels[k].color + 'cc'),
        borderColor: keys.map(k => bluCategoryLabels[k].color),
        borderWidth: 2,
        hoverOffset: 6,
      }],
    };
  }, [currentBLU]);

  // Budget projection comparison
  const projectionChartData = useMemo(() => {
    const topRS = hospitals.slice(0, 10);
    return {
      labels: topRS.map(h => h.name.replace(/^RSPPN |^RSPAD |^RSAD |^RSAL |^RSAU /, '').substring(0, 15)),
      datasets: [
        {
          label: 'Realisasi 2026',
          data: topRS.map(h => budgetProjections[h.id].realisasiTahunIni),
          backgroundColor: 'rgba(59,130,246,0.6)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
        },
        {
          label: 'Proyeksi 2027 (+5%)',
          data: topRS.map(h => budgetProjections[h.id].totalPengajuan),
          backgroundColor: 'rgba(212,175,55,0.6)',
          borderColor: '#D4AF37',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
        },
      ],
    };
  }, []);

  // Trend line national
  const trendChartData = useMemo(() => ({
    labels: budgetMonthLabels,
    datasets: [
      {
        label: 'Total Pengeluaran Nasional (Juta)',
        data: national.monthlyNasional,
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212,175,55,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#D4AF37',
        borderWidth: 2,
      },
    ],
  }), [national]);

  // Validity scores chart
  const validityChartData = useMemo(() => ({
    labels: hospitals.map(h => h.name.replace(/^RSPPN |^RSPAD |^RSAD |^RSAL |^RSAU /, '').substring(0, 15)),
    datasets: [{
      label: 'Skor Validitas (%)',
      data: hospitals.map(h => validityScores[h.id].overallScore),
      backgroundColor: hospitals.map(h => {
        const s = validityScores[h.id].overallScore;
        return s >= 85 ? 'rgba(16,185,129,0.7)' : s >= 70 ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.7)';
      }),
      borderColor: hospitals.map(h => {
        const s = validityScores[h.id].overallScore;
        return s >= 85 ? '#10b981' : s >= 70 ? '#f59e0b' : '#ef4444';
      }),
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.7,
    }],
  }), []);

  const sections = [
    { key: 'overview', icon: '🔄', label: 'Overview Siklus' },
    { key: 'harian', icon: '🏥', label: '1. Konsumsi Harian' },
    { key: 'bulanan', icon: '📊', label: '2. Akumulasi Bulanan' },
    { key: 'blu', icon: '🧮', label: '3. Perhitungan BLU' },
    { key: 'proyeksi', icon: '💰', label: '4. Pengajuan Anggaran' },
    { key: 'validitas', icon: '🔒', label: 'Validitas SIMRS' },
  ];

  return (
    <div className="page-container ba-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">💰 Korelasi Data Operasional & Alokasi Anggaran Kemhan</h1>
        <p className="page-subtitle">Executive Tactical Blueprint — Validitas Data SIMRS = Validitas Anggaran 2027</p>
      </div>

      {/* Section Tabs */}
      <div className="ba-section-tabs">
        {sections.map(s => (
          <button key={s.key} className={`ba-tab ${activeSection === s.key ? 'active' : ''}`} onClick={() => setActiveSection(s.key)}>
            <span className="ba-tab-icon">{s.icon}</span>
            <span className="ba-tab-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* RS Selector */}
      {activeSection !== 'overview' && activeSection !== 'blu' && activeSection !== 'validitas' && (
        <div className="ba-rs-selector">
          <label>🏥 Rumah Sakit</label>
          <select value={selectedRs} onChange={e => setSelectedRs(Number(e.target.value))}>
            <option value={0}>📊 Nasional (17 RS)</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{forceIcon[h.force]} {h.name} ({h.type})</option>
            ))}
          </select>
        </div>
      )}

      {/* ═══════════════ OVERVIEW SECTION ═══════════════ */}
      {activeSection === 'overview' && (
        <>
          {/* National KPI Cards */}
          <div className="ba-kpi-row">
            <div className="ba-kpi-card" style={{ '--kc': '#3b82f6' }}>
              <div className="ba-kpi-icon">🏥</div>
              <div className="ba-kpi-info">
                <span className="ba-kpi-value">{fmtJuta(national.totalBMHPHarian)}</span>
                <span className="ba-kpi-label">Konsumsi BMHP Harian</span>
                <span className="ba-kpi-sub">BPJS {Math.round(national.totalBMHPHarianBPJS / national.totalBMHPHarian * 100)}% • Asuransi {Math.round(national.totalBMHPHarianAsuransi / national.totalBMHPHarian * 100)}% • Mandiri {Math.round(national.totalBMHPHarianMandiri / national.totalBMHPHarian * 100)}%</span>
              </div>
            </div>
            <div className="ba-kpi-card" style={{ '--kc': '#10b981' }}>
              <div className="ba-kpi-icon">📊</div>
              <div className="ba-kpi-info">
                <span className="ba-kpi-value">{fmtMoney(national.totalAkumulasiTahunan)}</span>
                <span className="ba-kpi-label">Akumulasi Tahunan</span>
                <span className="ba-kpi-sub">17 RS • 12 Bulan</span>
              </div>
            </div>
            <div className="ba-kpi-card" style={{ '--kc': '#f59e0b' }}>
              <div className="ba-kpi-icon">🧮</div>
              <div className="ba-kpi-info">
                <span className="ba-kpi-value">{fmtMoney(national.totalBLU)}</span>
                <span className="ba-kpi-label">Alokasi BLU (30%)</span>
                <span className="ba-kpi-sub">Realisasi: {national.pctRealisasiBLU}%</span>
              </div>
            </div>
            <div className="ba-kpi-card" style={{ '--kc': '#8b5cf6' }}>
              <div className="ba-kpi-icon">💰</div>
              <div className="ba-kpi-info">
                <span className="ba-kpi-value">{fmtMoney(national.totalPengajuan2027)}</span>
                <span className="ba-kpi-label">Proyeksi Anggaran 2027</span>
                <span className="ba-kpi-sub">+{national.pertumbuhanNasional}% YoY</span>
              </div>
            </div>
            <div className="ba-kpi-card" style={{ '--kc': national.avgValiditas >= 80 ? '#10b981' : '#f59e0b' }}>
              <div className="ba-kpi-icon">🔒</div>
              <div className="ba-kpi-info">
                <span className="ba-kpi-value">{national.avgValiditas}%</span>
                <span className="ba-kpi-label">Validitas Data SIMRS</span>
                <span className="ba-kpi-sub">✅ {national.rsValidCount} Valid • ⚠️ {national.rsConditionalCount} Bersyarat • 🔴 {national.rsReviewCount} Review</span>
              </div>
            </div>
          </div>

          {/* Cycle Infographic */}
          <div className="ba-cycle-section">
            <div className="ba-cycle-header">
              <h3>🔄 Siklus Korelasi Data Operasional & Alokasi Anggaran</h3>
              <p>Proses end-to-end dari pencatatan harian hingga pengajuan anggaran pusat</p>
            </div>
            <div className="ba-cycle-grid">
              {cycleSteps.map(step => (
                <div key={step.step} className="ba-cycle-card" style={{ '--cc': step.color }}
                  onClick={() => setActiveSection(sections[step.step].key)}>
                  <div className="ba-cycle-step-num">{step.step}</div>
                  <div className="ba-cycle-icon">{step.icon}</div>
                  <h4 className="ba-cycle-title">{step.title}</h4>
                  <p className="ba-cycle-desc">{step.desc}</p>
                  <div className="ba-cycle-arrow">→</div>
                </div>
              ))}
              {/* Central Lock */}
              <div className="ba-cycle-center">
                <div className="ba-cycle-lock">🔒</div>
                <span className="ba-cycle-center-label">Validitas Data SIMRS<br />=<br />Validitas Anggaran 2027</span>
              </div>
            </div>
          </div>

          {/* National Trend Chart */}
          <div className="ba-chart-panel">
            <div className="ba-chart-header">
              <h3>📈 Trend Pengeluaran BMHP Nasional (12 Bulan)</h3>
            </div>
            <div className="ba-chart-area" style={{ height: 300 }}>
              <Line data={trendChartData} options={{ ...chartBase, plugins: { ...chartBase.plugins, legend: { display: false } } }} />
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ STEP 1: KONSUMSI HARIAN ═══════════════ */}
      {activeSection === 'harian' && (
        <>
          <div className="ba-step-header" style={{ '--sc': '#3b82f6' }}>
            <div className="ba-step-badge">STEP 1</div>
            <h2>🏥 Konsumsi Harian BMHP</h2>
            <p>Data penggunaan Bahan Medis Habis Pakai tercatat real-time dari pasien BPJS, Asuransi, dan Mandiri (Shift 09:00 - 21:00)</p>
          </div>

          {selectedRs === 0 ? (
            /* National view: Table of all 17 RS daily BMHP */
            <div className="ba-table-section">
              <div className="ba-section-title">
                <h3>📋 Konsumsi Harian BMHP — 17 RS Kemhan</h3>
                <span className="ba-data-note">Data dalam Juta Rupiah</span>
              </div>
              <div className="table-container">
                <table className="data-table ba-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36 }}>#</th>
                      <th>Rumah Sakit</th>
                      <th>Angkatan</th>
                      <th>Tipe</th>
                      <th style={{ textAlign: 'right' }}>🟢 BPJS</th>
                      <th style={{ textAlign: 'right' }}>🔵 Asuransi</th>
                      <th style={{ textAlign: 'right' }}>🟡 Mandiri</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                      <th>Proporsi BPJS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((h, idx) => {
                      const d = dailyBMHP[h.id];
                      const pctBPJS = ((d.totals.bpjs / d.totals.grand) * 100).toFixed(0);
                      return (
                        <tr key={h.id} className="table-row" onClick={() => setSelectedRs(h.id)} style={{ cursor: 'pointer' }}>
                          <td className="text-muted">{idx + 1}</td>
                          <td className="cell-name">{h.name}</td>
                          <td><span className={`force-badge ${h.force.toLowerCase()}`}>{forceLabel[h.force]}</span></td>
                          <td><span className="type-badge">{h.type}</span></td>
                          <td style={{ textAlign: 'right', color: '#10b981' }}>{fmtJuta(d.totals.bpjs)}</td>
                          <td style={{ textAlign: 'right', color: '#3b82f6' }}>{fmtJuta(d.totals.asuransi)}</td>
                          <td style={{ textAlign: 'right', color: '#f59e0b' }}>{fmtJuta(d.totals.mandiri)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: '#e2e8f0' }}>{fmtJuta(d.totals.grand)}</td>
                          <td>
                            <div className="ba-pct-bar">
                              <div className="ba-pct-fill" style={{ width: `${pctBPJS}%`, background: '#10b981' }} />
                              <span>{pctBPJS}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="ba-table-footer">
                      <td colSpan={4} style={{ fontWeight: 700, textAlign: 'right' }}>TOTAL NASIONAL</td>
                      <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 700 }}>{fmtJuta(national.totalBMHPHarianBPJS)}</td>
                      <td style={{ textAlign: 'right', color: '#3b82f6', fontWeight: 700 }}>{fmtJuta(national.totalBMHPHarianAsuransi)}</td>
                      <td style={{ textAlign: 'right', color: '#f59e0b', fontWeight: 700 }}>{fmtJuta(national.totalBMHPHarianMandiri)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#D4AF37', fontSize: '1.05em' }}>{fmtJuta(national.totalBMHPHarian)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            /* Single RS detail view */
            <>
              <div className="ba-detail-grid">
                {/* Shift cards */}
                <div className="ba-shift-section">
                  <h3>⏰ Breakdown per Shift</h3>
                  <div className="ba-shift-cards">
                    {shiftSchedule.map(s => {
                      const sData = currentBMHP.shifts[s.key];
                      const total = sData.bpjs + sData.asuransi + sData.mandiri;
                      return (
                        <div key={s.key} className="ba-shift-card">
                          <div className="ba-shift-header">
                            <span className="ba-shift-icon">{s.icon}</span>
                            <span className="ba-shift-name">{s.label}</span>
                            <span className="ba-shift-time">{s.time}</span>
                          </div>
                          <div className="ba-shift-total">{fmtJuta(total)}</div>
                          <div className="ba-shift-bars">
                            {paymentSources.map(ps => (
                              <div key={ps.key} className="ba-shift-bar-row">
                                <span className="ba-sb-label">{ps.icon} {ps.label}</span>
                                <div className="ba-sb-track">
                                  <div className="ba-sb-fill" style={{ width: `${(sData[ps.key] / total * 100)}%`, background: ps.color }} />
                                </div>
                                <span className="ba-sb-value">{fmtJuta(sData[ps.key])}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BMHP Category breakdown */}
                <div className="ba-category-section">
                  <h3>📦 Breakdown per Kategori BMHP</h3>
                  <div className="ba-category-list">
                    {bmhpCategories.map(cat => {
                      const item = currentBMHP.items[cat.key];
                      const total = item.bpjs + item.asuransi + item.mandiri;
                      return (
                        <div key={cat.key} className="ba-cat-row">
                          <div className="ba-cat-info">
                            <span className="ba-cat-icon">{cat.icon}</span>
                            <span className="ba-cat-name">{cat.label}</span>
                          </div>
                          <div className="ba-cat-values">
                            <span className="ba-cv" style={{ color: '#10b981' }}>{fmtJuta(item.bpjs)}</span>
                            <span className="ba-cv" style={{ color: '#3b82f6' }}>{fmtJuta(item.asuransi)}</span>
                            <span className="ba-cv" style={{ color: '#f59e0b' }}>{fmtJuta(item.mandiri)}</span>
                            <span className="ba-cv ba-cv-total">{fmtJuta(total)}</span>
                          </div>
                          <div className="ba-cat-bar">
                            <div className="ba-cat-bar-seg" style={{ width: `${item.bpjs / total * 100}%`, background: '#10b981' }} />
                            <div className="ba-cat-bar-seg" style={{ width: `${item.asuransi / total * 100}%`, background: '#3b82f6' }} />
                            <div className="ba-cat-bar-seg" style={{ width: `${item.mandiri / total * 100}%`, background: '#f59e0b' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="ba-summary-cards">
                {paymentSources.map(ps => (
                  <div key={ps.key} className="ba-summary-card" style={{ '--sc': ps.color }}>
                    <span className="ba-sum-icon">{ps.icon}</span>
                    <span className="ba-sum-label">{ps.label}</span>
                    <span className="ba-sum-value">{fmtJuta(currentBMHP.totals[ps.key])}</span>
                    <span className="ba-sum-pct">{((currentBMHP.totals[ps.key] / currentBMHP.totals.grand) * 100).toFixed(1)}%</span>
                  </div>
                ))}
                <div className="ba-summary-card ba-sum-grand" style={{ '--sc': '#D4AF37' }}>
                  <span className="ba-sum-icon">💰</span>
                  <span className="ba-sum-label">TOTAL HARIAN</span>
                  <span className="ba-sum-value">{fmtJuta(currentBMHP.totals.grand)}</span>
                  <span className="ba-sum-pct">100%</span>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ═══════════════ STEP 2: AKUMULASI BULANAN ═══════════════ */}
      {activeSection === 'bulanan' && (
        <>
          <div className="ba-step-header" style={{ '--sc': '#10b981' }}>
            <div className="ba-step-badge">STEP 2</div>
            <h2>📊 Akumulasi Bulanan</h2>
            <p>Sistem Pusat mengakumulasi pengeluaran murni untuk BMHP bulanan secara transparan tanpa intervensi birokrasi daerah</p>
          </div>

          {/* Monthly Chart */}
          <div className="ba-chart-panel">
            <div className="ba-chart-header">
              <h3>📈 Akumulasi Pengeluaran BMHP Bulanan {selectedRs === 0 ? '— Nasional (17 RS)' : `— ${hospitals.find(h => h.id === selectedRs)?.name}`}</h3>
              <span className="ba-chart-subtitle">(dalam Juta Rupiah, stacked per sumber pembayaran)</span>
            </div>
            <div className="ba-chart-area" style={{ height: 340 }}>
              <Bar data={monthlyChartData} options={{
                ...chartBase,
                plugins: { ...chartBase.plugins, legend: { position: 'top', labels: { ...chartBase.plugins.legend.labels, padding: 16 } } },
                scales: {
                  ...chartBase.scales,
                  x: { ...chartBase.scales.x, stacked: true },
                  y: { ...chartBase.scales.y, stacked: true, title: { display: true, text: 'Juta Rp', color: '#64748b', font: { size: 10 } } }
                }
              }} />
            </div>
          </div>

          {/* All RS Monthly Table */}
          <div className="ba-table-section">
            <div className="ba-section-title">
              <h3>📋 Rekapitulasi Akumulasi Tahunan — 17 RS</h3>
              <span className="ba-data-note">Dalam Juta Rupiah</span>
            </div>
            <div className="table-container">
              <table className="data-table ba-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>Rumah Sakit</th>
                    <th>Tipe</th>
                    <th style={{ textAlign: 'right' }}>Rata-rata/Bulan</th>
                    <th style={{ textAlign: 'right' }}>Total Tahunan</th>
                    <th>Trend 12 Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((h, idx) => {
                    const d = monthlyAccumulation[h.id];
                    const maxVal = Math.max(...d.monthly);
                    return (
                      <tr key={h.id} className="table-row" onClick={() => setSelectedRs(h.id)} style={{ cursor: 'pointer' }}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="cell-name">{forceIcon[h.force]} {h.name}</td>
                        <td><span className="type-badge">{h.type}</span></td>
                        <td style={{ textAlign: 'right' }}>{fmtJuta(d.avgMonthly)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#D4AF37' }}>{fmtJuta(d.totalYear)}</td>
                        <td>
                          <div className="ba-sparkline">
                            {d.monthly.map((v, i) => (
                              <div key={i} className="ba-spark-bar" style={{ height: `${(v / maxVal) * 100}%`, background: v === maxVal ? '#D4AF37' : 'rgba(59,130,246,0.5)' }} title={`${budgetMonthLabels[i]}: ${fmtJuta(v)}`} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="ba-table-footer">
                    <td colSpan={3} style={{ fontWeight: 700, textAlign: 'right' }}>TOTAL NASIONAL</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmtJuta(Math.round(national.totalAkumulasiTahunan / 12))}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#D4AF37', fontSize: '1.05em' }}>{fmtJuta(national.totalAkumulasiTahunan)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ STEP 3: PERHITUNGAN BLU ═══════════════ */}
      {activeSection === 'blu' && (
        <>
          <div className="ba-step-header" style={{ '--sc': '#f59e0b' }}>
            <div className="ba-step-badge">STEP 3</div>
            <h2>🧮 Perhitungan BLU</h2>
            <p>Sistem mengkalkulasi otomatis 30% dari total pendapatan RS yang diwajibkan untuk pencairan anggaran operasional (BLU)</p>
          </div>

          {/* RS Selector for BLU */}
          <div className="ba-rs-selector">
            <label>🏥 Pilih RS untuk Detail BLU</label>
            <select value={activeBluRs} onChange={e => setActiveBluRs(Number(e.target.value))}>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{forceIcon[h.force]} {h.name} ({h.type})</option>
              ))}
            </select>
          </div>

          {/* BLU Calculation Flow */}
          <div className="ba-blu-flow">
            <div className="ba-blu-card ba-blu-input">
              <span className="ba-blu-card-icon">🏦</span>
              <span className="ba-blu-card-label">Total Pendapatan</span>
              <span className="ba-blu-card-value">{fmtJuta(currentBLU.totalPendapatan)}</span>
              <span className="ba-blu-card-sub">Tahun 2026</span>
            </div>
            <div className="ba-blu-arrow">
              <span>×30%</span>
              <div className="ba-blu-arrow-line" />
            </div>
            <div className="ba-blu-card ba-blu-output">
              <span className="ba-blu-card-icon">🧮</span>
              <span className="ba-blu-card-label">Alokasi BLU</span>
              <span className="ba-blu-card-value">{fmtJuta(currentBLU.alokasBLU)}</span>
              <span className="ba-blu-card-sub">Wajib dialokasikan</span>
            </div>
            <div className="ba-blu-arrow">
              <span>Realisasi</span>
              <div className="ba-blu-arrow-line" />
            </div>
            <div className={`ba-blu-card ba-blu-result ${Number(currentBLU.pctRealisasi) >= 90 ? 'good' : 'warn'}`}>
              <span className="ba-blu-card-icon">{Number(currentBLU.pctRealisasi) >= 90 ? '✅' : '⚠️'}</span>
              <span className="ba-blu-card-label">Realisasi BLU</span>
              <span className="ba-blu-card-value">{fmtJuta(currentBLU.realisasiBLU)}</span>
              <span className="ba-blu-card-sub">{currentBLU.pctRealisasi}% terserap</span>
            </div>
          </div>

          {/* BLU Detail Grid */}
          <div className="ba-blu-detail-grid">
            {/* Doughnut */}
            <div className="ba-chart-panel">
              <div className="ba-chart-header">
                <h3>📊 Distribusi Alokasi BLU</h3>
              </div>
              <div className="ba-chart-area ba-doughnut-wrap" style={{ height: 280 }}>
                <Doughnut data={bluDoughnutData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '60%',
                  plugins: { ...chartBase.plugins, legend: { position: 'bottom', labels: { ...chartBase.plugins.legend.labels, padding: 14 } } }
                }} />
              </div>
            </div>

            {/* BLU Breakdown */}
            <div className="ba-blu-breakdown">
              <h3>📋 Detail Alokasi BLU — {hospitals.find(h => h.id === activeBluRs)?.name.replace(/^RSPPN |^RSPAD |^RSAD |^RSAL |^RSAU /, '')}</h3>
              <div className="ba-blu-items">
                {Object.entries(currentBLU.bluBreakdown).map(([key, val]) => {
                  const info = bluCategoryLabels[key];
                  const pct = ((val / currentBLU.alokasBLU) * 100).toFixed(1);
                  return (
                    <div key={key} className="ba-blu-item">
                      <div className="ba-blu-item-left">
                        <span className="ba-blu-item-icon" style={{ color: info.color }}>{info.icon}</span>
                        <span className="ba-blu-item-label">{info.label}</span>
                      </div>
                      <div className="ba-blu-item-right">
                        <div className="ba-blu-item-bar">
                          <div className="ba-blu-item-fill" style={{ width: `${pct}%`, background: info.color }} />
                        </div>
                        <span className="ba-blu-item-value">{fmtJuta(val)}</span>
                        <span className="ba-blu-item-pct">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="ba-blu-efficiency">
                <span>Rasio Efisiensi (Pengeluaran/Pendapatan):</span>
                <strong style={{ color: Number(currentBLU.rasioEfisiensi) < 35 ? '#10b981' : '#f59e0b' }}>{currentBLU.rasioEfisiensi}%</strong>
              </div>
            </div>
          </div>

          {/* All RS BLU Summary Table */}
          <div className="ba-table-section">
            <div className="ba-section-title">
              <h3>📋 Ringkasan BLU — Seluruh 17 RS</h3>
            </div>
            <div className="table-container">
              <table className="data-table ba-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>Rumah Sakit</th>
                    <th style={{ textAlign: 'right' }}>Pendapatan</th>
                    <th style={{ textAlign: 'right' }}>Alokasi BLU (30%)</th>
                    <th style={{ textAlign: 'right' }}>Realisasi</th>
                    <th>% Serap</th>
                    <th style={{ textAlign: 'right' }}>Sisa</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((h, idx) => {
                    const b = bluCalculations[h.id];
                    return (
                      <tr key={h.id} className="table-row" onClick={() => setActiveBluRs(h.id)} style={{ cursor: 'pointer' }}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="cell-name">{forceIcon[h.force]} {h.name}</td>
                        <td style={{ textAlign: 'right' }}>{fmtJuta(b.totalPendapatan)}</td>
                        <td style={{ textAlign: 'right', color: '#f59e0b' }}>{fmtJuta(b.alokasBLU)}</td>
                        <td style={{ textAlign: 'right', color: '#10b981' }}>{fmtJuta(b.realisasiBLU)}</td>
                        <td>
                          <div className="ba-pct-bar">
                            <div className="ba-pct-fill" style={{ width: `${b.pctRealisasi}%`, background: Number(b.pctRealisasi) >= 90 ? '#10b981' : '#f59e0b' }} />
                            <span>{b.pctRealisasi}%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', color: '#64748b' }}>{fmtJuta(b.sisaBLU)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="ba-table-footer">
                    <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>TOTAL</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmtJuta(national.totalPendapatan)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#f59e0b' }}>{fmtJuta(national.totalBLU)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{fmtJuta(national.totalRealisasiBLU)}</td>
                    <td><strong>{national.pctRealisasiBLU}%</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmtJuta(national.totalBLU - national.totalRealisasiBLU)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ STEP 4: PENGAJUAN ANGGARAN PUSAT ═══════════════ */}
      {activeSection === 'proyeksi' && (
        <>
          <div className="ba-step-header" style={{ '--sc': '#8b5cf6' }}>
            <div className="ba-step-badge">STEP 4</div>
            <h2>💰 Pengajuan Anggaran Pusat</h2>
            <p>Berdasarkan data SIMRS yang valid, Kemhan memproyeksikan kebutuhan absolut tahun berikutnya, menyuntikkan dana langsung dengan tambahan surplus (+5%)</p>
          </div>

          {/* Projection Chart */}
          <div className="ba-chart-panel">
            <div className="ba-chart-header">
              <h3>📊 Perbandingan Realisasi 2026 vs Proyeksi 2027</h3>
              <span className="ba-chart-subtitle">(Top 10 RS, dalam Juta Rupiah)</span>
            </div>
            <div className="ba-chart-area" style={{ height: 360 }}>
              <Bar data={projectionChartData} options={{
                ...chartBase, indexAxis: 'y',
                plugins: { ...chartBase.plugins, legend: { position: 'top', labels: { ...chartBase.plugins.legend.labels, padding: 16 } } },
                scales: { ...chartBase.scales, x: { ...chartBase.scales.x, title: { display: true, text: 'Juta Rp', color: '#64748b', font: { size: 10 } } } }
              }} />
            </div>
          </div>

          {/* Projection Detail for Selected RS */}
          {selectedRs !== 0 && currentProjection && (
            <div className="ba-projection-detail">
              <h3>📋 Detail Proyeksi — {hospitals.find(h => h.id === selectedRs)?.name}</h3>
              <div className="ba-proj-flow">
                <div className="ba-proj-step">
                  <span className="ba-proj-label">Realisasi 2026</span>
                  <span className="ba-proj-val">{fmtJuta(currentProjection.realisasiTahunIni)}</span>
                </div>
                <div className="ba-proj-arrow">+3% inflasi →</div>
                <div className="ba-proj-step">
                  <span className="ba-proj-label">Kebutuhan Absolut</span>
                  <span className="ba-proj-val">{fmtJuta(currentProjection.kebutuhanAbsolut)}</span>
                </div>
                <div className="ba-proj-arrow">+5% surplus →</div>
                <div className="ba-proj-step ba-proj-final">
                  <span className="ba-proj-label">Total Pengajuan 2027</span>
                  <span className="ba-proj-val">{fmtJuta(currentProjection.totalPengajuan)}</span>
                  <span className={`ba-proj-status ${currentProjection.statusPengajuan}`}>{currentProjection.statusPengajuan === 'approved' ? '✅ Approved' : '⏳ Under Review'}</span>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="ba-proj-categories">
                {Object.entries(currentProjection.proyeksiKategori).map(([key, val]) => {
                  const info = projectionCategoryLabels[key];
                  const pct = ((val / currentProjection.totalPengajuan) * 100).toFixed(0);
                  return (
                    <div key={key} className="ba-proj-cat-card" style={{ '--pc': info.color }}>
                      <span className="ba-proj-cat-icon">{info.icon}</span>
                      <span className="ba-proj-cat-label">{info.label}</span>
                      <span className="ba-proj-cat-value">{fmtJuta(val)}</span>
                      <span className="ba-proj-cat-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Historical comparison */}
              <div className="ba-proj-history">
                <h4>📈 Trend Anggaran Historis</h4>
                <div className="ba-proj-hist-bars">
                  {Object.entries(currentProjection.historis).map(([year, val]) => {
                    const maxVal = Math.max(...Object.values(currentProjection.historis));
                    return (
                      <div key={year} className={`ba-proj-hist-item ${year === '2027' ? 'projected' : ''}`}>
                        <span className="ba-proj-hist-year">{year}{year === '2027' ? ' *' : ''}</span>
                        <div className="ba-proj-hist-bar">
                          <div className="ba-proj-hist-fill" style={{ width: `${(val / maxVal) * 100}%`, background: year === '2027' ? '#D4AF37' : '#3b82f6' }} />
                        </div>
                        <span className="ba-proj-hist-val">{fmtJuta(val)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* All RS Projection Table */}
          <div className="ba-table-section">
            <div className="ba-section-title">
              <h3>📋 Pengajuan Anggaran 2027 — 17 RS Kemhan</h3>
              <span className="ba-data-note">* Termasuk surplus +5%</span>
            </div>
            <div className="table-container">
              <table className="data-table ba-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>Rumah Sakit</th>
                    <th style={{ textAlign: 'right' }}>Realisasi 2026</th>
                    <th style={{ textAlign: 'right' }}>Kebutuhan Absolut</th>
                    <th style={{ textAlign: 'right' }}>Surplus +5%</th>
                    <th style={{ textAlign: 'right' }}>Total Pengajuan 2027</th>
                    <th>Pertumbuhan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((h, idx) => {
                    const p = budgetProjections[h.id];
                    return (
                      <tr key={h.id} className="table-row" onClick={() => setSelectedRs(h.id)} style={{ cursor: 'pointer' }}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="cell-name">{forceIcon[h.force]} {h.name}</td>
                        <td style={{ textAlign: 'right' }}>{fmtJuta(p.realisasiTahunIni)}</td>
                        <td style={{ textAlign: 'right' }}>{fmtJuta(p.kebutuhanAbsolut)}</td>
                        <td style={{ textAlign: 'right', color: '#10b981' }}>+{fmtJuta(p.surplus5Pct)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#D4AF37' }}>{fmtJuta(p.totalPengajuan)}</td>
                        <td><span className="ba-growth-badge">+{p.pertumbuhanYoY}%</span></td>
                        <td><span className={`ba-status-badge ${p.statusPengajuan}`}>{p.statusPengajuan === 'approved' ? '✅ Approved' : '⏳ Review'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="ba-table-footer">
                    <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>TOTAL NASIONAL</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmtJuta(national.totalRealisasi2026)}</td>
                    <td colSpan={2}></td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#D4AF37', fontSize: '1.05em' }}>{fmtJuta(national.totalPengajuan2027)}</td>
                    <td><strong style={{ color: '#10b981' }}>+{national.pertumbuhanNasional}%</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ VALIDITAS DATA SIMRS ═══════════════ */}
      {activeSection === 'validitas' && (
        <>
          <div className="ba-step-header" style={{ '--sc': '#D4AF37' }}>
            <div className="ba-step-badge">🔒</div>
            <h2>🔒 Validitas Data SIMRS = Validitas Anggaran 2027</h2>
            <p>Skor validitas data setiap RS menentukan kelayakan pengajuan anggaran. Hanya RS dengan data valid yang anggarannya disetujui tanpa syarat.</p>
          </div>

          {/* Validity Overview Cards */}
          <div className="ba-validity-overview">
            <div className="ba-val-card ba-val-valid">
              <span className="ba-val-icon">✅</span>
              <span className="ba-val-count">{national.rsValidCount}</span>
              <span className="ba-val-label">RS Tervalidasi</span>
              <span className="ba-val-desc">Skor ≥ 85% — Anggaran disetujui penuh</span>
            </div>
            <div className="ba-val-card ba-val-conditional">
              <span className="ba-val-icon">⚠️</span>
              <span className="ba-val-count">{national.rsConditionalCount}</span>
              <span className="ba-val-label">RS Bersyarat</span>
              <span className="ba-val-desc">Skor 70-84% — Perlu perbaikan data</span>
            </div>
            <div className="ba-val-card ba-val-review">
              <span className="ba-val-icon">🔴</span>
              <span className="ba-val-count">{national.rsReviewCount}</span>
              <span className="ba-val-label">Perlu Review</span>
              <span className="ba-val-desc">Skor &lt; 70% — Anggaran ditahan</span>
            </div>
          </div>

          {/* Validity Bar Chart */}
          <div className="ba-chart-panel">
            <div className="ba-chart-header">
              <h3>📊 Skor Validitas Data SIMRS — 17 RS</h3>
              <span className="ba-chart-subtitle">🟢 ≥85% Valid • 🟡 70-84% Bersyarat • 🔴 &lt;70% Review</span>
            </div>
            <div className="ba-chart-area" style={{ height: 380 }}>
              <Bar data={validityChartData} options={{
                ...chartBase, indexAxis: 'y',
                plugins: { ...chartBase.plugins, legend: { display: false } },
                scales: { ...chartBase.scales, x: { ...chartBase.scales.x, min: 0, max: 100, title: { display: true, text: 'Skor Validitas (%)', color: '#64748b', font: { size: 10 } } } }
              }} />
            </div>
          </div>

          {/* Validity Detail Table */}
          <div className="ba-table-section">
            <div className="ba-section-title">
              <h3>📋 Detail Validitas per Dimensi — 17 RS</h3>
            </div>
            <div className="table-container">
              <table className="data-table ba-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>Rumah Sakit</th>
                    <th style={{ textAlign: 'center' }}>📋 Kelengkapan</th>
                    <th style={{ textAlign: 'center' }}>🔗 Konsistensi</th>
                    <th style={{ textAlign: 'center' }}>🕐 Keterkinian</th>
                    <th style={{ textAlign: 'center' }}>💰 Akurasi Keu.</th>
                    <th style={{ textAlign: 'center' }}>📝 Integritas RM</th>
                    <th style={{ textAlign: 'center' }}>Skor</th>
                    <th>Status</th>
                    <th>Sync Terakhir</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((h, idx) => {
                    const v = validityScores[h.id];
                    const dim = v.dimensions;
                    const cellColor = (val) => val >= 85 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444';
                    return (
                      <tr key={h.id} className="table-row">
                        <td className="text-muted">{idx + 1}</td>
                        <td className="cell-name">{forceIcon[h.force]} {h.name}</td>
                        <td style={{ textAlign: 'center', color: cellColor(dim.kelengkapanData) }}>{dim.kelengkapanData}%</td>
                        <td style={{ textAlign: 'center', color: cellColor(dim.konsistensiData) }}>{dim.konsistensiData}%</td>
                        <td style={{ textAlign: 'center', color: cellColor(dim.keterkinian) }}>{dim.keterkinian}%</td>
                        <td style={{ textAlign: 'center', color: cellColor(dim.akurasiKeuangan) }}>{dim.akurasiKeuangan}%</td>
                        <td style={{ textAlign: 'center', color: cellColor(dim.integritasRekamMedis) }}>{dim.integritasRekamMedis}%</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: cellColor(v.overallScore) }}>{v.overallScore}%</td>
                        <td><span className={`ba-validity-badge ${v.status}`}>{v.statusLabel}</span></td>
                        <td style={{ fontSize: '0.8em', color: '#64748b' }}>{new Date(v.lastSync).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
