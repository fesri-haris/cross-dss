import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { newsItems, recentReports, newsTrendData } from '../data/hospitalData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const reportButtons = [
  { label: 'Generate Kesiapan Operasional Triwulan', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { label: 'Generate Analisis Alkes Sudirman', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { label: 'Laporan Logistik Medik Nasional', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { label: 'Laporan Logistik Medik Nasional', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
];

export default function NewsReportsPanel() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 9 }, boxWidth: 10, padding: 8 },
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
      x: { ticks: { color: '#475569', font: { family: 'Inter', size: 8 } }, grid: { color: 'rgba(30,41,59,0.5)' } },
      y: { ticks: { color: '#475569', font: { family: 'Inter', size: 8 } }, grid: { color: 'rgba(30,41,59,0.5)' }, beginAtZero: true },
    },
  };

  const chartData = {
    labels: newsTrendData.labels,
    datasets: [
      {
        label: 'Crawler',
        data: newsTrendData.crawler,
        backgroundColor: 'rgba(59,130,246,0.65)',
        hoverBackgroundColor: 'rgba(59,130,246,0.9)',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Operasional',
        data: newsTrendData.operasional,
        backgroundColor: 'rgba(16,185,129,0.65)',
        hoverBackgroundColor: 'rgba(16,185,129,0.9)',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="panel news-panel">
      <div className="panel-header">
        <h2 className="panel-title">News Crawling & Reports</h2>
        <div className="panel-actions">
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
        </div>
      </div>
      <div className="news-content">
        <div className="news-top-row">
          <div className="news-chart-section">
            <h3 className="chart-title">BERITA KESEHATAN MILITER & KEMHAN</h3>
            <div className="chart-wrapper news-chart">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="crawler-feed-section">
            <h3 className="chart-title">CRAWLER FEED</h3>
            <div className="crawler-list">
              {newsItems.map(item => (
                <div key={item.id} className="crawler-item">
                  <div className="crawler-icon">{item.icon}</div>
                  <div className="crawler-text">
                    <div className="crawler-title">{item.title}</div>
                    <div className="crawler-detail">{item.detail}</div>
                  </div>
                  <div className="crawler-time">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="news-bottom-row">
          <div className="dss-section">
            <h3 className="chart-title">DSS REPORT GENERATOR</h3>
            <div className="dss-buttons">
              {reportButtons.map((btn, i) => (
                <button key={i} className="dss-btn">
                  <span style={{ position: 'relative', zIndex: 1 }}>{btn.label}</span>
                </button>
              ))}
            </div>
            <div className="recent-reports">
              <h4 className="recent-title">Recent Reports</h4>
              <div className="report-list">
                {recentReports.map((report, i) => (
                  <div key={i} className="report-item">
                    <span className="report-name">{report.title}</span>
                    <span className="report-time">{report.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
