import { useState, useMemo } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { crawledNews, newsCategories, sentimentSummary, sentimentMonthly, sentimentByCategory, topKeywords } from '../data/socialIncidentsData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
  { key: 'feed', label: 'Feed Berita', icon: '📰' },
  { key: 'sentiment', label: 'Analisis Sentimen', icon: '📊' },
  { key: 'conflict', label: 'Peta Konflik', icon: '🗺️' },
];

const SENTIMENT_COLORS = {
  positif: '#00FF88',
  negatif: '#FF2E93',
  netral: '#FFB800',
  mixed: '#7B61FF',
};

const SENTIMENT_LABELS = {
  positif: 'POSITIF',
  negatif: 'NEGATIF',
  netral: 'NETRAL',
  mixed: 'CAMPURAN',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getTensionLevel(avgScore) {
  if (avgScore <= -0.5) return { level: 'TINGGI', color: '#FF2E93', pct: 85 };
  if (avgScore <= -0.2) return { level: 'SEDANG', color: '#FFB800', pct: 55 };
  if (avgScore <= 0) return { level: 'RENDAH-SEDANG', color: '#FF6B35', pct: 40 };
  return { level: 'RENDAH', color: '#00FF88', pct: 20 };
}

export default function SocialSurveillance() {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedNews, setExpandedNews] = useState(null);
  const [sentimentFilter, setSentimentFilter] = useState('all');

  // Filtered news
  const filteredNews = useMemo(() => {
    let filtered = [...crawledNews];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(n => n.category === selectedCategory);
    }

    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(n => n.sentiment === sentimentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q) ||
        n.entities.keywords.some(k => k.toLowerCase().includes(q)) ||
        n.entities.tribes.some(t => t.toLowerCase().includes(q))
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchQuery, selectedCategory, sentimentFilter]);

  // Sentiment Doughnut
  const sentimentDoughnutData = useMemo(() => ({
    labels: ['Positif', 'Netral', 'Negatif'],
    datasets: [{
      data: [sentimentSummary.positif, sentimentSummary.netral, sentimentSummary.negatif],
      backgroundColor: [SENTIMENT_COLORS.positif + 'cc', SENTIMENT_COLORS.netral + 'cc', SENTIMENT_COLORS.negatif + 'cc'],
      borderColor: [SENTIMENT_COLORS.positif, SENTIMENT_COLORS.netral, SENTIMENT_COLORS.negatif],
      borderWidth: 2,
      hoverOffset: 8,
    }]
  }), []);

  // Monthly trend stacked line
  const monthlyTrendData = useMemo(() => ({
    labels: sentimentMonthly.map(m => m.bulan),
    datasets: [
      {
        label: 'Positif',
        data: sentimentMonthly.map(m => m.positif),
        borderColor: SENTIMENT_COLORS.positif,
        backgroundColor: SENTIMENT_COLORS.positif + '15',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: SENTIMENT_COLORS.positif,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        borderWidth: 2.5,
      },
      {
        label: 'Netral',
        data: sentimentMonthly.map(m => m.netral),
        borderColor: SENTIMENT_COLORS.netral,
        backgroundColor: SENTIMENT_COLORS.netral + '15',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: SENTIMENT_COLORS.netral,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        borderWidth: 2.5,
      },
      {
        label: 'Negatif',
        data: sentimentMonthly.map(m => m.negatif),
        borderColor: SENTIMENT_COLORS.negatif,
        backgroundColor: SENTIMENT_COLORS.negatif + '15',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: SENTIMENT_COLORS.negatif,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        borderWidth: 2.5,
      },
    ]
  }), []);

  // Sentiment by Category bar chart
  const categoryBarData = useMemo(() => {
    const cats = Object.keys(sentimentByCategory);
    const catLabels = cats.map(c => {
      const found = newsCategories.find(nc => nc.id === c);
      return found ? found.label : c;
    });
    return {
      labels: catLabels,
      datasets: [
        {
          label: 'Positif',
          data: cats.map(c => sentimentByCategory[c].positif),
          backgroundColor: SENTIMENT_COLORS.positif + '99',
          borderColor: SENTIMENT_COLORS.positif,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'Netral',
          data: cats.map(c => sentimentByCategory[c].netral),
          backgroundColor: SENTIMENT_COLORS.netral + '99',
          borderColor: SENTIMENT_COLORS.netral,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'Negatif',
          data: cats.map(c => sentimentByCategory[c].negatif),
          backgroundColor: SENTIMENT_COLORS.negatif + '99',
          borderColor: SENTIMENT_COLORS.negatif,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ]
    };
  }, []);

  // Tension index
  const tension = useMemo(() => getTensionLevel(sentimentSummary.avgScore), []);

  // Entity extraction summary
  const entitySummary = useMemo(() => {
    const tribes = {};
    const locations = {};
    crawledNews.forEach(n => {
      n.entities.tribes.forEach(t => { tribes[t] = (tribes[t] || 0) + 1; });
      if (n.location) {
        const loc = n.location.split(',')[0].trim();
        locations[loc] = (locations[loc] || 0) + 1;
      }
    });
    return {
      tribes: Object.entries(tribes).sort((a, b) => b[1] - a[1]),
      locations: Object.entries(locations).sort((a, b) => b[1] - a[1]),
    };
  }, []);

  return (
    <div className="page-container ss-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🔍 Social Surveillance — NLP News Crawling & Sentiment</h1>
        <p className="page-subtitle">Pemantauan berita, analisis sentimen NLP, dan pemetaan potensi konflik sosial di Papua Selatan</p>
      </div>

      {/* Tab Navigation */}
      <div className="ss-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`ss-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="ss-tab-icon">{tab.icon}</span>
            <span className="ss-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ============ FEED BERITA TAB ============ */}
      {activeTab === 'feed' && (
        <div className="ss-tab-content">
          {/* Search & Filter Bar */}
          <div className="ss-filter-bar">
            <div className="ss-search-wrap">
              <span className="ss-search-icon">🔍</span>
              <input
                type="text"
                className="ss-search-input"
                placeholder="Cari berita, suku, keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="ss-search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
            <div className="ss-sentiment-filter">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'positif', label: 'Positif' },
                { key: 'negatif', label: 'Negatif' },
                { key: 'netral', label: 'Netral' },
              ].map(f => (
                <button
                  key={f.key}
                  className={`ss-sent-btn ${sentimentFilter === f.key ? 'active' : ''}`}
                  onClick={() => setSentimentFilter(f.key)}
                  style={{ '--sent-color': SENTIMENT_COLORS[f.key] || '#00D4FF' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="ss-category-pills">
            {newsCategories.map(cat => (
              <button
                key={cat.id}
                className={`ss-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="ss-cat-pill-icon">{cat.icon}</span>
                <span className="ss-cat-pill-label">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="ss-results-info">
            <span className="ss-results-count">{filteredNews.length} berita ditemukan</span>
            {(searchQuery || selectedCategory !== 'all' || sentimentFilter !== 'all') && (
              <button className="ss-results-clear" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSentimentFilter('all'); }}>
                Reset Filter
              </button>
            )}
          </div>

          {/* News Cards */}
          <div className="ss-news-list">
            {filteredNews.map(news => {
              const isExpanded = expandedNews === news.id;
              return (
                <div
                  key={news.id}
                  className={`ss-news-card ${isExpanded ? 'expanded' : ''} ${news.sentimentLabel.includes('CRITICAL') ? 'critical' : ''}`}
                  onClick={() => setExpandedNews(isExpanded ? null : news.id)}
                >
                  <div className="ss-news-top">
                    <div className="ss-news-meta">
                      <span className="ss-news-source">{news.source}</span>
                      <span className="ss-news-date">{formatDate(news.date)}</span>
                    </div>
                    <span
                      className="ss-news-sentiment"
                      style={{ '--sent-color': SENTIMENT_COLORS[news.sentiment] }}
                    >
                      {SENTIMENT_LABELS[news.sentiment]}
                    </span>
                  </div>

                  <h3 className="ss-news-title">{news.title}</h3>
                  <p className="ss-news-summary">{news.summary}</p>

                  {/* Sentiment Score Bar */}
                  <div className="ss-news-score-bar">
                    <div className="ss-nsb-track">
                      <div className="ss-nsb-center" />
                      <div
                        className="ss-nsb-fill"
                        style={{
                          width: `${Math.abs(news.sentimentScore) * 50}%`,
                          left: news.sentimentScore >= 0 ? '50%' : `${50 - Math.abs(news.sentimentScore) * 50}%`,
                          background: SENTIMENT_COLORS[news.sentiment],
                        }}
                      />
                    </div>
                    <span className="ss-nsb-value" style={{ color: SENTIMENT_COLORS[news.sentiment] }}>
                      {news.sentimentScore > 0 ? '+' : ''}{news.sentimentScore.toFixed(3)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="ss-news-tags">
                    {news.entities.tribes.map(tribe => (
                      <span key={tribe} className="ss-tag tribe">{tribe}</span>
                    ))}
                    {news.entities.keywords.slice(0, 4).map(kw => (
                      <span key={kw} className="ss-tag keyword">{kw}</span>
                    ))}
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="ss-news-detail">
                      <div className="ss-news-detail-row">
                        <span className="ss-nd-label">📍 Lokasi:</span>
                        <span className="ss-nd-value">{news.location}</span>
                      </div>
                      <div className="ss-news-detail-row">
                        <span className="ss-nd-label">📌 Koordinat:</span>
                        <span className="ss-nd-value ss-coord">{news.coordinates[1].toFixed(4)}°S, {news.coordinates[0].toFixed(4)}°E</span>
                      </div>
                      <div className="ss-news-detail-row">
                        <span className="ss-nd-label">🏷️ Kategori:</span>
                        <span className="ss-nd-value">{newsCategories.find(c => c.id === news.category)?.label || news.category}</span>
                      </div>
                      <div className="ss-news-detail-row">
                        <span className="ss-nd-label">📊 Sentiment Label:</span>
                        <span className="ss-nd-value" style={{ color: SENTIMENT_COLORS[news.sentiment] }}>{news.sentimentLabel}</span>
                      </div>
                      <div className="ss-news-detail-row">
                        <span className="ss-nd-label">🔗 Sumber:</span>
                        <a className="ss-nd-link" href={news.sourceUrl} target="_blank" rel="noopener noreferrer">{news.sourceUrl}</a>
                      </div>
                      <div className="ss-news-all-tags">
                        <span className="ss-nd-label">🏷️ Semua Tags:</span>
                        <div className="ss-news-tags">
                          {news.tags.map(t => <span key={t} className="ss-tag tag">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ ANALISIS SENTIMEN TAB ============ */}
      {activeTab === 'sentiment' && (
        <div className="ss-tab-content">
          {/* KPI Cards */}
          <div className="ss-kpi-row">
            <div className="ss-kpi-card">
              <div className="ss-kpi-icon">📰</div>
              <div className="ss-kpi-content">
                <span className="ss-kpi-value">{sentimentSummary.total}</span>
                <span className="ss-kpi-label">Total Berita</span>
              </div>
            </div>
            <div className="ss-kpi-card positive">
              <div className="ss-kpi-icon">😊</div>
              <div className="ss-kpi-content">
                <span className="ss-kpi-value" style={{ color: SENTIMENT_COLORS.positif }}>{sentimentSummary.positif}</span>
                <span className="ss-kpi-label">Positif</span>
              </div>
            </div>
            <div className="ss-kpi-card negative">
              <div className="ss-kpi-icon">😠</div>
              <div className="ss-kpi-content">
                <span className="ss-kpi-value" style={{ color: SENTIMENT_COLORS.negatif }}>{sentimentSummary.negatif}</span>
                <span className="ss-kpi-label">Negatif</span>
              </div>
            </div>
            <div className="ss-kpi-card">
              <div className="ss-kpi-icon">📉</div>
              <div className="ss-kpi-content">
                <span className="ss-kpi-value" style={{ color: sentimentSummary.avgScore < 0 ? SENTIMENT_COLORS.negatif : SENTIMENT_COLORS.positif }}>
                  {sentimentSummary.avgScore > 0 ? '+' : ''}{sentimentSummary.avgScore.toFixed(2)}
                </span>
                <span className="ss-kpi-label">Skor Rata-rata</span>
              </div>
            </div>
          </div>

          <div className="ss-sentiment-grid">
            {/* Doughnut Chart */}
            <div className="ss-panel ss-doughnut-panel">
              <div className="ss-panel-header">
                <h3 className="ss-panel-title">📊 Distribusi Sentimen</h3>
              </div>
              <div className="ss-chart-area" style={{ height: 280 }}>
                <Doughnut data={sentimentDoughnutData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '60%',
                  plugins: { ...chartBase.plugins, legend: { position: 'bottom', labels: { ...chartBase.plugins.legend.labels, padding: 16 } } }
                }} />
              </div>
              <div className="ss-doughnut-stats">
                <div className="ss-ds-item">
                  <span className="ss-ds-dot" style={{ background: SENTIMENT_COLORS.positif }} />
                  <span className="ss-ds-label">Positif</span>
                  <span className="ss-ds-val">{sentimentSummary.positif}</span>
                  <span className="ss-ds-pct">{((sentimentSummary.positif / sentimentSummary.total) * 100).toFixed(0)}%</span>
                </div>
                <div className="ss-ds-item">
                  <span className="ss-ds-dot" style={{ background: SENTIMENT_COLORS.negatif }} />
                  <span className="ss-ds-label">Negatif</span>
                  <span className="ss-ds-val">{sentimentSummary.negatif}</span>
                  <span className="ss-ds-pct">{((sentimentSummary.negatif / sentimentSummary.total) * 100).toFixed(0)}%</span>
                </div>
                <div className="ss-ds-item">
                  <span className="ss-ds-dot" style={{ background: SENTIMENT_COLORS.netral }} />
                  <span className="ss-ds-label">Netral</span>
                  <span className="ss-ds-val">{sentimentSummary.netral}</span>
                  <span className="ss-ds-pct">{((sentimentSummary.netral / sentimentSummary.total) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Monthly Trend Line */}
            <div className="ss-panel ss-trend-panel">
              <div className="ss-panel-header">
                <h3 className="ss-panel-title">📈 Tren Sentimen Bulanan</h3>
                <span className="ss-panel-badge">6 bulan terakhir</span>
              </div>
              <div className="ss-chart-area" style={{ height: 320 }}>
                <Line data={monthlyTrendData} options={{
                  ...chartBase,
                  plugins: { ...chartBase.plugins, legend: { position: 'top', labels: { ...chartBase.plugins.legend.labels } } },
                  scales: {
                    ...chartBase.scales,
                    y: { ...chartBase.scales.y, beginAtZero: true, title: { display: true, text: 'Jumlah Berita', color: '#64748b', font: { size: 10 } } }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Category Bar Chart */}
          <div className="ss-panel ss-catbar-panel">
            <div className="ss-panel-header">
              <h3 className="ss-panel-title">📊 Sentimen per Kategori</h3>
            </div>
            <div className="ss-chart-area" style={{ height: 280 }}>
              <Bar data={categoryBarData} options={{
                ...chartBase,
                plugins: { ...chartBase.plugins, legend: { position: 'top', labels: { ...chartBase.plugins.legend.labels } } },
                scales: {
                  ...chartBase.scales,
                  x: { ...chartBase.scales.x, stacked: true },
                  y: { ...chartBase.scales.y, stacked: true, beginAtZero: true },
                }
              }} />
            </div>
          </div>

          {/* Keyword Cloud Grid */}
          <div className="ss-panel ss-keywords-panel">
            <div className="ss-panel-header">
              <h3 className="ss-panel-title">🏷️ Top Keywords — NLP Extraction</h3>
              <span className="ss-panel-badge">{topKeywords.length} keywords</span>
            </div>
            <div className="ss-keyword-grid">
              {topKeywords.map((kw, i) => {
                const maxCount = topKeywords[0].count;
                const size = 0.7 + (kw.count / maxCount) * 0.6;
                return (
                  <div
                    key={kw.keyword}
                    className="ss-keyword-badge"
                    style={{
                      '--kw-color': SENTIMENT_COLORS[kw.sentiment] || '#7B61FF',
                      fontSize: `${size}rem`,
                      opacity: 0.6 + (kw.count / maxCount) * 0.4,
                    }}
                  >
                    <span className="ss-kw-text">{kw.keyword}</span>
                    <span className="ss-kw-count">{kw.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ PETA KONFLIK TAB ============ */}
      {activeTab === 'conflict' && (
        <div className="ss-tab-content">
          <div className="ss-conflict-grid">
            {/* Static Conflict Map Visualization */}
            <div className="ss-panel ss-map-panel">
              <div className="ss-panel-header">
                <h3 className="ss-panel-title">🗺️ Peta Geocoded News — Papua Selatan</h3>
                <span className="ss-panel-badge">{crawledNews.length} lokasi</span>
              </div>
              <div className="ss-static-map">
                <div className="ss-map-grid">
                  {/* Map grid background lines */}
                  <div className="ss-map-gridlines">
                    {[...Array(8)].map((_, i) => <div key={`h${i}`} className="ss-map-gridline h" style={{ top: `${(i + 1) * 11}%` }} />)}
                    {[...Array(8)].map((_, i) => <div key={`v${i}`} className="ss-map-gridline v" style={{ left: `${(i + 1) * 11}%` }} />)}
                  </div>

                  {/* Plotted news points */}
                  {crawledNews.map(news => {
                    // Map coordinates to relative position within bounding box
                    const minLon = 139.5, maxLon = 141.0, minLat = -8.5, maxLat = -6.5;
                    const xPct = ((news.coordinates[0] - minLon) / (maxLon - minLon)) * 80 + 10;
                    const yPct = ((news.coordinates[1] - minLat) / (maxLat - minLat)) * 80 + 10;
                    return (
                      <div
                        key={news.id}
                        className={`ss-map-point ${news.sentiment}`}
                        style={{
                          left: `${xPct}%`,
                          top: `${yPct}%`,
                          '--point-color': SENTIMENT_COLORS[news.sentiment],
                        }}
                        title={`${news.title} (${news.sentiment})`}
                      >
                        <div className="ss-map-point-pulse" />
                        <div className="ss-map-point-dot" />
                        <div className="ss-map-point-label">{news.source.split(' ')[0]}</div>
                      </div>
                    );
                  })}

                  {/* Map legend */}
                  <div className="ss-map-legend">
                    <span className="ss-ml-title">Sentimen</span>
                    {Object.entries(SENTIMENT_COLORS).filter(([k]) => k !== 'mixed').map(([key, color]) => (
                      <div key={key} className="ss-ml-item">
                        <span className="ss-ml-dot" style={{ background: color }} />
                        <span className="ss-ml-label">{SENTIMENT_LABELS[key]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Map coordinates label */}
                  <div className="ss-map-coords-label top-left">6.5°S, 139.5°E</div>
                  <div className="ss-map-coords-label bottom-right">8.5°S, 141.0°E</div>
                  <div className="ss-map-region-label">PAPUA SELATAN</div>
                </div>
              </div>
            </div>

            {/* Social Tension Index Gauge */}
            <div className="ss-panel ss-tension-panel">
              <div className="ss-panel-header">
                <h3 className="ss-panel-title">🌡️ Indeks Tensi Sosial</h3>
              </div>
              <div className="ss-tension-gauge">
                <div className="ss-gauge-visual">
                  <div className="ss-gauge-track">
                    <div className="ss-gauge-fill" style={{ width: `${tension.pct}%`, background: `linear-gradient(90deg, #00FF88, ${tension.color})` }} />
                  </div>
                  <div className="ss-gauge-markers">
                    <span>RENDAH</span>
                    <span>SEDANG</span>
                    <span>TINGGI</span>
                  </div>
                </div>
                <div className="ss-tension-result">
                  <span className="ss-tension-level" style={{ color: tension.color }}>{tension.level}</span>
                  <span className="ss-tension-score">Skor: {sentimentSummary.avgScore.toFixed(2)}</span>
                </div>
                <div className="ss-tension-breakdown">
                  <div className="ss-tb-item">
                    <span className="ss-tb-label">Rasio Negatif</span>
                    <span className="ss-tb-val" style={{ color: SENTIMENT_COLORS.negatif }}>
                      {((sentimentSummary.negatif / sentimentSummary.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="ss-tb-item">
                    <span className="ss-tb-label">Berita Konflik Agraria</span>
                    <span className="ss-tb-val">{crawledNews.filter(n => n.category === 'konflik_agraria' || n.category === 'sengketa_ulayat').length}</span>
                  </div>
                  <div className="ss-tb-item">
                    <span className="ss-tb-label">Suku Terdampak</span>
                    <span className="ss-tb-val">{entitySummary.tribes.length}</span>
                  </div>
                  <div className="ss-tb-item">
                    <span className="ss-tb-label">Trend Bulanan</span>
                    <span className="ss-tb-val" style={{ color: SENTIMENT_COLORS.negatif }}>↑ Meningkat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Entity Extraction Panel */}
            <div className="ss-panel ss-entities-panel">
              <div className="ss-panel-header">
                <h3 className="ss-panel-title">🔬 Entity Extraction — NER Results</h3>
              </div>
              <div className="ss-entities-content">
                {/* Tribes */}
                <div className="ss-entity-section">
                  <h4 className="ss-entity-subtitle">🏘️ Suku / Marga Teridentifikasi</h4>
                  <div className="ss-entity-list">
                    {entitySummary.tribes.map(([name, count]) => (
                      <div key={name} className="ss-entity-row">
                        <span className="ss-entity-name">{name}</span>
                        <div className="ss-entity-bar-track">
                          <div className="ss-entity-bar-fill" style={{ width: `${(count / (entitySummary.tribes[0]?.[1] || 1)) * 100}%` }} />
                        </div>
                        <span className="ss-entity-count">{count} mention</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div className="ss-entity-section">
                  <h4 className="ss-entity-subtitle">📍 Lokasi Teridentifikasi</h4>
                  <div className="ss-entity-list">
                    {entitySummary.locations.map(([name, count]) => (
                      <div key={name} className="ss-entity-row">
                        <span className="ss-entity-name">{name}</span>
                        <div className="ss-entity-bar-track">
                          <div className="ss-entity-bar-fill location" style={{ width: `${(count / (entitySummary.locations[0]?.[1] || 1)) * 100}%` }} />
                        </div>
                        <span className="ss-entity-count">{count} berita</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geocoded News List */}
                <div className="ss-entity-section">
                  <h4 className="ss-entity-subtitle">📰 Berita Geocoded</h4>
                  <div className="ss-geocoded-list">
                    {crawledNews
                      .filter(n => n.sentiment === 'negatif')
                      .sort((a, b) => a.sentimentScore - b.sentimentScore)
                      .slice(0, 6)
                      .map(news => (
                        <div key={news.id} className="ss-geocoded-item">
                          <div className="ss-gi-dot" style={{ background: SENTIMENT_COLORS[news.sentiment] }} />
                          <div className="ss-gi-content">
                            <span className="ss-gi-title">{news.title.length > 60 ? news.title.slice(0, 60) + '...' : news.title}</span>
                            <div className="ss-gi-meta">
                              <span className="ss-gi-loc">{news.location}</span>
                              <span className="ss-gi-score" style={{ color: SENTIMENT_COLORS[news.sentiment] }}>
                                {news.sentimentScore.toFixed(3)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
