import { useState, useMemo, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { crawledNews, newsCategories, sentimentSummary, sentimentMonthly, sentimentByCategory, topKeywords, reportTemplates, timeRangeOptions, recentGeneratedReports, dssReportData } from '../data/newsData';
import { hospitals, ikuCategories } from '../data/hospitalData';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const sentColors = { positif:'#10b981', netral:'#f59e0b', negatif:'#ef4444' };
const sentIcons = { positif:'🟢', netral:'🟡', negatif:'🔴' };
const sentLabels = { positif:'Positif', netral:'Netral', negatif:'Negatif' };

const chartBase = {
  responsive:true, maintainAspectRatio:false,
  plugins:{
    legend:{labels:{color:'#94a3b8',font:{family:'Inter',size:10},boxWidth:10,padding:12}},
    tooltip:{backgroundColor:'rgba(8,15,30,0.95)',titleColor:'#e2e8f0',bodyColor:'#94a3b8',borderColor:'rgba(255,255,255,0.08)',borderWidth:1,padding:10,cornerRadius:8,titleFont:{family:'Outfit',weight:700,size:12},bodyFont:{family:'Inter',size:11}}
  },
  scales:{
    x:{ticks:{color:'#64748b',font:{size:9,family:'Inter'}},grid:{color:'rgba(255,255,255,0.04)'},border:{color:'rgba(255,255,255,0.06)'}},
    y:{ticks:{color:'#64748b',font:{size:9,family:'Inter'}},grid:{color:'rgba(255,255,255,0.04)'},border:{color:'rgba(255,255,255,0.06)'},beginAtZero:true}
  }
};

function generateReportContent(templates, range, dateFrom, dateTo) {
  const today = new Date();
  const rangeLabel = range === 'daily' ? 'Harian' : range === 'weekly' ? 'Mingguan' : range === 'monthly' ? 'Bulanan' : range === 'yearly' ? 'Tahunan' : `Custom: ${dateFrom} s/d ${dateTo}`;
  const dateStr = today.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
  const timeStr = today.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });

  // Get period-specific data
  const periodData = dssReportData[range] || dssReportData.monthly;

  return {
    title: `Laporan Eksekutif RS Kemhan — ${rangeLabel}`,
    generated: `${dateStr}, ${timeStr} WIB`,
    period: periodData.periodLabel || rangeLabel,
    periodRange: periodData.periodRange || rangeLabel,
    sections: templates.map(t => {
      const tmpl = reportTemplates.find(r => r.id === t);
      if (!tmpl) return null;
      const data = periodData[t] || { score:'-', status:'-', detail:'Data tidak tersedia untuk periode ini.', highlights: [], trend: '-' };
      return { ...tmpl, ...data };
    }).filter(Boolean),
  };
}

export default function NewsReports() {
  const [activeTab, setActiveTab] = useState('news');
  const [filterCat, setFilterCat] = useState('all');
  const [expandedNews, setExpandedNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // DSS state
  const [timeRange, setTimeRange] = useState('monthly');
  const [dateFrom, setDateFrom] = useState('2025-09-21');
  const [dateTo, setDateTo] = useState('2026-03-01');
  const [selectedTemplates, setSelectedTemplates] = useState(['kesiapan','iku15','logistik','bor','sdm','epidemiologi']);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const reportRef = useRef(null);

  const toggleTemplate = (id) => {
    setSelectedTemplates(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const filteredNews = useMemo(() => {
    let items = filterCat === 'all' ? crawledNews : crawledNews.filter(n => n.category === filterCat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)));
    }
    return items;
  }, [filterCat, searchQuery]);

  // Sentiment Charts
  const sentDoughnutData = useMemo(() => ({
    labels: ['Positif','Netral','Negatif'],
    datasets: [{ data:[sentimentSummary.positif, sentimentSummary.netral, sentimentSummary.negatif], backgroundColor:[sentColors.positif+'cc', sentColors.netral+'cc', sentColors.negatif+'cc'], borderColor:[sentColors.positif, sentColors.netral, sentColors.negatif], borderWidth:2, hoverOffset:6 }]
  }), []);

  const sentTrendData = useMemo(() => ({
    labels: sentimentMonthly.labels,
    datasets: [
      { label:'Positif', data:sentimentMonthly.positif, borderColor:sentColors.positif, backgroundColor:sentColors.positif+'15', fill:true, tension:0.4, pointRadius:4, pointBackgroundColor:sentColors.positif, borderWidth:2.5 },
      { label:'Netral', data:sentimentMonthly.netral, borderColor:sentColors.netral, backgroundColor:sentColors.netral+'10', fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:sentColors.netral, borderWidth:1.5 },
      { label:'Negatif', data:sentimentMonthly.negatif, borderColor:sentColors.negatif, backgroundColor:sentColors.negatif+'15', fill:true, tension:0.4, pointRadius:4, pointBackgroundColor:sentColors.negatif, borderWidth:2, borderDash:[4,2] },
    ]
  }), []);

  const sentCatBarData = useMemo(() => ({
    labels: sentimentByCategory.labels,
    datasets: [
      { label:'Positif', data:sentimentByCategory.positif, backgroundColor:sentColors.positif+'99', borderColor:sentColors.positif, borderWidth:1, borderRadius:4 },
      { label:'Netral', data:sentimentByCategory.netral, backgroundColor:sentColors.netral+'99', borderColor:sentColors.netral, borderWidth:1, borderRadius:4 },
      { label:'Negatif', data:sentimentByCategory.negatif, backgroundColor:sentColors.negatif+'99', borderColor:sentColors.negatif, borderWidth:1, borderRadius:4 },
    ]
  }), []);

  const reportContent = useMemo(() => generateReportContent(selectedTemplates, timeRange, dateFrom, dateTo), [selectedTemplates, timeRange, dateFrom, dateTo]);

  const handleGeneratePDF = async () => {
    setShowPreview(true);
    setGenerating(true);
    setTimeout(async () => {
      try {
        const { default: html2canvas } = await import('html2canvas');
        const { jsPDF } = await import('jspdf');
        const el = reportRef.current;
        if (!el) { setGenerating(false); return; }
        const canvas = await html2canvas(el, { scale:2, backgroundColor:'#0a1428', useCORS:true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p','mm','a4');
        const pW = pdf.internal.pageSize.getWidth();
        const pH = pdf.internal.pageSize.getHeight();
        const iW = pW - 20;
        const iH = (canvas.height * iW) / canvas.width;
        let yPos = 10;
        if (iH <= pH - 20) {
          pdf.addImage(imgData, 'PNG', 10, yPos, iW, iH);
        } else {
          let remaining = iH;
          let srcY = 0;
          while (remaining > 0) {
            const sliceH = Math.min(pH - 20, remaining);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = (sliceH / iH) * canvas.height;
            const ctx = sliceCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, srcY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
            pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 10, 10, iW, sliceH);
            remaining -= sliceH;
            srcY += sliceCanvas.height;
            if (remaining > 0) pdf.addPage();
          }
        }
        const periodSlug = timeRange === 'custom' ? `${dateFrom}_${dateTo}` : timeRange;
        pdf.save(`Laporan_RS_Kemhan_${periodSlug}_${new Date().toISOString().slice(0,10)}.pdf`);
      } catch (e) { console.error('PDF error:', e); }
      setGenerating(false);
    }, 500);
  };

  const tabs = [
    { key:'news', icon:'📰', label:'News Crawling' },
    { key:'sentiment', icon:'📊', label:'Sentiment Analysis' },
    { key:'dss', icon:'🎖️', label:'DSS Report Generator' },
  ];

  const sentKPIs = [
    { label:'Total Berita', value:sentimentSummary.total, icon:'📰', color:'#3b82f6' },
    { label:'Positif', value:`${((sentimentSummary.positif/sentimentSummary.total)*100).toFixed(0)}%`, icon:'🟢', color:sentColors.positif },
    { label:'Negatif', value:`${((sentimentSummary.negatif/sentimentSummary.total)*100).toFixed(0)}%`, icon:'🔴', color:sentColors.negatif },
    { label:'Trending', value:topKeywords[0]?.word || '-', icon:'🔥', color:'#f59e0b', isText:true },
  ];

  return (
    <div className="page-container nr-page">
      <div className="page-header">
        <h1 className="page-title">📰 News Crawling & Reports</h1>
        <p className="page-subtitle">Monitoring berita kesehatan militer, sentiment analysis, dan generator laporan otomatis DSS</p>
      </div>

      {/* Tab Navigation */}
      <div className="nr-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`nr-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            <span className="nr-tab-icon">{t.icon}</span>
            <span className="nr-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: NEWS CRAWLING ═══ */}
      {activeTab === 'news' && (
        <div className="nr-news-tab">
          <div className="nr-news-controls">
            <div className="nr-search">
              <span className="nr-search-icon">🔍</span>
              <input type="text" placeholder="Cari berita..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="nr-search-input" />
            </div>
            <div className="nr-cat-pills">
              {newsCategories.map(c => (
                <button key={c.key} className={`nr-cat-pill ${filterCat === c.key ? 'active' : ''}`} onClick={() => setFilterCat(c.key)} style={{ '--pill-color':c.color }}>
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="nr-stats-bar">
            <span className="nr-stats-item">📊 {filteredNews.length} berita</span>
            <span className="nr-stats-item">🟢 {filteredNews.filter(n=>n.sentiment==='positif').length} positif</span>
            <span className="nr-stats-item">🟡 {filteredNews.filter(n=>n.sentiment==='netral').length} netral</span>
            <span className="nr-stats-item">🔴 {filteredNews.filter(n=>n.sentiment==='negatif').length} negatif</span>
          </div>

          <div className="nr-news-grid">
            {filteredNews.map(n => {
              const expanded = expandedNews === n.id;
              return (
                <div key={n.id} className={`nr-news-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpandedNews(expanded ? null : n.id)}>
                  <div className="nr-nc-top">
                    <div className="nr-nc-icon-wrap">
                      <span className="nr-nc-icon">{n.icon}</span>
                      <span className={`nr-nc-sent ${n.sentiment}`}>{sentIcons[n.sentiment]}</span>
                    </div>
                    <div className="nr-nc-body">
                      <h4 className="nr-nc-title">{n.title}</h4>
                      <div className="nr-nc-meta">
                        <span className="nr-nc-source">{n.source}</span>
                        <span className="nr-nc-date">{n.date}</span>
                        <span className={`nr-nc-sent-badge ${n.sentiment}`}>{sentLabels[n.sentiment]}</span>
                      </div>
                    </div>
                  </div>
                  {expanded && (
                    <div className="nr-nc-expanded">
                      <p className="nr-nc-summary">{n.summary}</p>
                      <div className="nr-nc-tags">
                        {n.tags.map(t => <span key={t} className="nr-nc-tag">#{t}</span>)}
                      </div>
                      <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="nr-nc-link" onClick={e => e.stopPropagation()}>
                        🔗 Baca selengkapnya di {n.source} →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 2: SENTIMENT ANALYSIS ═══ */}
      {activeTab === 'sentiment' && (
        <div className="nr-sentiment-tab">
          <div className="nr-sent-kpis">
            {sentKPIs.map((k,i) => (
              <div key={i} className="nr-kpi-card" style={{ '--kpi-color':k.color }}>
                <span className="nr-kpi-icon">{k.icon}</span>
                <div className="nr-kpi-info">
                  <span className="nr-kpi-label">{k.label}</span>
                  <span className={`nr-kpi-value ${k.isText ? 'text' : ''}`}>{k.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="nr-sent-charts">
            <div className="nr-chart-card">
              <h3 className="nr-chart-title">Distribusi Sentimen</h3>
              <div className="nr-chart-area" style={{ height:280 }}>
                <Doughnut data={sentDoughnutData} options={{ responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{...chartBase.plugins, legend:{position:'bottom',labels:{...chartBase.plugins.legend.labels,padding:14}}} }} />
              </div>
            </div>

            <div className="nr-chart-card nr-chart-wide">
              <h3 className="nr-chart-title">Tren Sentimen 6 Bulan Terakhir</h3>
              <div className="nr-chart-area" style={{ height:280 }}>
                <Line data={sentTrendData} options={{...chartBase, plugins:{...chartBase.plugins, legend:{position:'top',labels:{...chartBase.plugins.legend.labels}}}}} />
              </div>
            </div>

            <div className="nr-chart-card nr-chart-full">
              <h3 className="nr-chart-title">Sentimen per Kategori Berita</h3>
              <div className="nr-chart-area" style={{ height:250 }}>
                <Bar data={sentCatBarData} options={{...chartBase, plugins:{...chartBase.plugins, legend:{position:'top',labels:{...chartBase.plugins.legend.labels}}}, scales:{...chartBase.scales, x:{...chartBase.scales.x, stacked:true}, y:{...chartBase.scales.y, stacked:true}}}} />
              </div>
            </div>
          </div>

          <div className="nr-keywords-section">
            <h3 className="nr-chart-title">🔑 Top Keywords</h3>
            <div className="nr-keywords-grid">
              {topKeywords.map((kw, i) => (
                <div key={i} className={`nr-keyword-card ${kw.sentiment}`} style={{ '--kw-size': Math.max(0.7, kw.count / 18) }}>
                  <span className="nr-kw-word">{kw.word}</span>
                  <span className="nr-kw-count">{kw.count} mentions</span>
                  <span className="nr-kw-sent">{sentIcons[kw.sentiment]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: DSS REPORT GENERATOR ═══ */}
      {activeTab === 'dss' && (
        <div className="nr-dss-tab">
          <div className="nr-dss-layout">
            {/* Config Panel */}
            <div className="nr-dss-config">
              <h3 className="nr-dss-section-title">⚙️ Konfigurasi Laporan</h3>

              {/* Time Range */}
              <div className="nr-dss-group">
                <label className="nr-dss-label">📅 Periode Laporan</label>
                <div className="nr-time-range-btns">
                  {timeRangeOptions.map(t => (
                    <button key={t.key} className={`nr-tr-btn ${timeRange === t.key ? 'active' : ''}`} onClick={() => { setTimeRange(t.key); setShowPreview(false); }}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
                {timeRange === 'custom' && (
                  <div className="nr-date-range">
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="nr-date-input" />
                    <span className="nr-date-sep">s/d</span>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="nr-date-input" />
                  </div>
                )}
              </div>

              {/* Report Types */}
              <div className="nr-dss-group">
                <label className="nr-dss-label">📋 Jenis Laporan</label>
                <div className="nr-report-types">
                  {reportTemplates.map(t => (
                    <div key={t.id} className={`nr-rt-card ${selectedTemplates.includes(t.id) ? 'selected' : ''}`} onClick={() => toggleTemplate(t.id)} style={{ '--rt-color':t.color }}>
                      <div className="nr-rt-check">{selectedTemplates.includes(t.id) ? '☑' : '☐'}</div>
                      <span className="nr-rt-icon">{t.icon}</span>
                      <div className="nr-rt-info">
                        <span className="nr-rt-label">{t.label}</span>
                        <span className="nr-rt-desc">{t.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="nr-dss-actions">
                <button className="nr-preview-btn" onClick={() => setShowPreview(true)} disabled={selectedTemplates.length === 0}>
                  👁️ Preview Laporan
                </button>
                <button className={`nr-generate-btn ${generating ? 'generating' : ''}`} onClick={handleGeneratePDF} disabled={selectedTemplates.length === 0 || generating}>
                  {generating ? '⏳ Generating PDF...' : '📥 Download PDF'}
                </button>
              </div>
            </div>

            {/* Preview / Recent Reports */}
            <div className="nr-dss-preview">
              {showPreview ? (
                <div className="nr-report-preview" ref={reportRef}>
                  <div className="nr-rp-header">
                    <div className="nr-rp-logo">🎖️ IKHI COMMAND CENTER</div>
                    <h2 className="nr-rp-title">{reportContent.title}</h2>
                    <div className="nr-rp-meta">
                      <span>📅 Generated: {reportContent.generated}</span>
                      <span>📊 Periode: {reportContent.periodRange}</span>
                      <span>📋 {reportContent.sections.length} modul laporan</span>
                    </div>
                  </div>

                  {reportContent.sections.map((s, i) => (
                    <div key={i} className="nr-rp-section" style={{ '--rps-color':s.color }}>
                      <div className="nr-rps-header">
                        <span className="nr-rps-icon">{s.icon}</span>
                        <h3 className="nr-rps-title">{s.label}</h3>
                        <div className="nr-rps-score">
                          <span className="nr-rps-val">{s.score}</span>
                          <span className="nr-rps-status">{s.status}</span>
                        </div>
                      </div>
                      {s.trend && (
                        <div className="nr-rps-trend">
                          <span className="nr-rps-trend-label">Tren:</span>
                          <span className={`nr-rps-trend-val ${s.trend?.startsWith('↑') ? 'up' : s.trend?.startsWith('↓') ? 'down' : ''}`}>{s.trend}</span>
                        </div>
                      )}
                      <p className="nr-rps-detail">{s.detail}</p>
                      {s.highlights && s.highlights.length > 0 && (
                        <div className="nr-rps-highlights">
                          <label>📌 Temuan Utama:</label>
                          <ul>
                            {s.highlights.map((h, hi) => <li key={hi}>{h}</li>)}
                          </ul>
                        </div>
                      )}
                      {s.rsComparison && s.rsComparison.length > 0 && (
                        <div className="nr-rps-comparison">
                          <label>🏥 Perbandingan RS:</label>
                          <div className="nr-rps-comp-grid">
                            {s.rsComparison.map((r, ri) => (
                              <div key={ri} className="nr-rps-comp-item">
                                <span className="nr-rps-comp-name">{r.rs}</span>
                                <div className="nr-rps-comp-bar">
                                  <div className="nr-rps-comp-fill" style={{ width: `${r.score}%`, background: r.score >= 85 ? '#10b981' : r.score >= 70 ? '#3b82f6' : r.score >= 60 ? '#f59e0b' : '#ef4444' }}></div>
                                </div>
                                <span className="nr-rps-comp-score">{r.score}</span>
                                <span className={`nr-rps-comp-status ${r.score >= 85 ? 'good' : r.score >= 70 ? 'ok' : r.score >= 60 ? 'warn' : 'bad'}`}>{r.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="nr-rp-footer">
                    <p>Laporan ini dihasilkan secara otomatis oleh IKHI Command Center — RS Kemhan Decision Support System.</p>
                    <p>Data bersumber dari RS Monitoring, Data Analysis 15 IKU, RFID Tracking, News Crawling & Sentiment Analysis.</p>
                    <p>Periode Laporan: {reportContent.periodRange} | Klasifikasi: RAHASIA — Untuk Kalangan Terbatas</p>
                    <p>© 2026 Kementerian Pertahanan Republik Indonesia.</p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="nr-dss-section-title">📁 Laporan Terbaru</h3>
                  <div className="nr-recent-reports">
                    {recentGeneratedReports.map(r => {
                      const tmpl = reportTemplates.find(t => t.id === r.type);
                      return (
                        <div key={r.id} className="nr-rr-card">
                          <span className="nr-rr-icon">{tmpl?.icon || '📄'}</span>
                          <div className="nr-rr-info">
                            <span className="nr-rr-title">{r.title}</span>
                            <div className="nr-rr-meta">
                              <span>{r.date}</span>
                              <span>{r.size}</span>
                            </div>
                          </div>
                          <button className="nr-rr-dl-btn" title="Download PDF">📥</button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
