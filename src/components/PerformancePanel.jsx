import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  RadialLinearScale, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import { monthlyTrends, rsppnParams, nationalAvgParams, nationalParams } from '../data/hospitalData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  RadialLinearScale, Filler, Tooltip, Legend
);

const radarLabels = ['BOR', 'ALOS', 'Bed TAT', 'BTO', 'NDR', 'GDR', 'IGD Response', 'Lab TAT', 'Bed Inf', 'TOI', 'Pasien Puas'];

const normalizeRadar = (params) => [
  params.bor,
  (1 - params.alos / 10) * 100,
  (1 - params.labTAT / 3) * 100,
  params.bto * 10,
  (1 - params.ndr / 5) * 100,
  (1 - params.gdr / 8) * 100,
  (1 - params.igdResponse / 15) * 100,
  (1 - (typeof params.labTAT === 'number' ? params.labTAT : 1.1) / 3) * 100,
  80,
  (1 - params.toi / 5) * 100,
  (params.pasienPuas / 10) * 100,
];

const kpiCards = [
  { key: 'bor', icon: '🛏️' },
  { key: 'alos', icon: '📅' },
  { key: 'toi', icon: '🔄' },
  { key: 'bto', icon: '🔃' },
  { key: 'ndr', icon: '📉' },
  { key: 'gdr', icon: '📊' },
  { key: 'igdResponse', icon: '🚑' },
  { key: 'assetReadiness', icon: '⚙️' },
  { key: 'farmasi', icon: '💊' },
  { key: 'staffRatio', icon: '👥' },
  { key: 'pasienPuas', icon: '😊' },
  { key: 'bedQueue', icon: '📋' },
  { key: 'labTAT', icon: '🔬' },
  { key: 'revenue', icon: '💰' },
  { key: 'secureLAN', icon: '🔒' },
];

const chartFont = { family: 'Inter', size: 9 };

export default function PerformancePanel() {
  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { ...chartFont, size: 10 }, boxWidth: 12, padding: 8 },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 18, 35, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: { ticks: { color: '#475569', font: chartFont }, grid: { color: 'rgba(30,41,59,0.5)' } },
      y: { ticks: { color: '#475569', font: chartFont }, grid: { color: 'rgba(30,41,59,0.5)' }, beginAtZero: true },
    },
    interaction: { mode: 'index', intersect: false },
  };

  const trendData = {
    labels: monthlyTrends.labels,
    datasets: [
      {
        label: 'BOR Nasional',
        data: monthlyTrends.bor,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#60a5fa',
        borderWidth: 2.5,
      },
      {
        label: 'Rata-rata',
        data: monthlyTrends.bor.map(() => 68),
        borderColor: '#ef4444',
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        borderWidth: 1.5,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { ...chartFont, size: 9 }, boxWidth: 10, padding: 8 },
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(30,41,59,0.5)' },
        grid: { color: 'rgba(30,41,59,0.4)' },
        pointLabels: { color: '#64748b', font: { ...chartFont, size: 8 } },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'RSPPN Soedirman',
        data: normalizeRadar(rsppnParams),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Rata-rata Nasional',
        data: normalizeRadar(nationalAvgParams),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.08)',
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="panel performance-panel">
      <div className="panel-header">
        <h2 className="panel-title">Performance Analysis</h2>
        <div className="panel-actions">
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
        </div>
      </div>
      <div className="performance-content">
        <div className="perf-charts-row">
          <div className="perf-chart-box">
            <h3 className="chart-title">
              TREN BOR & GDR BULANAN <span className="chart-subtitle">(Nasional Kemhan)</span>
            </h3>
            <div className="chart-wrapper trend-chart">
              <Line data={trendData} options={trendOptions} />
            </div>
          </div>
          <div className="perf-chart-box">
            <h3 className="chart-title">
              RADAR CHART 15 PARAMETER <span className="chart-subtitle">(RSPPN Soedirman vs Rata-rata Nasional)</span>
            </h3>
            <div className="chart-wrapper radar-chart">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>

        <div className="kpi-subtitle">15 Parameter Kinerja RS Kemhan</div>
        <div className="kpi-cards-grid">
          {kpiCards.map(({ key, icon }, index) => {
            const param = nationalParams[key];
            if (!param) return null;
            return (
              <div
                key={key}
                className={`kpi-card ${param.status}`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="kpi-icon">{icon}</div>
                <div className="kpi-label">{param.label}</div>
                <div className="kpi-value">
                  {param.value}<span className="kpi-unit">{param.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="kpi-legend-text">— RSPPN Soedirman vs Rata-rata Nasional</div>
      </div>
    </div>
  );
}
