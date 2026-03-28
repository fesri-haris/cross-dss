import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import { ikuCategories, ikuParams, rsppnIkuValues, nationalAvgIkuValues, ikuMonthlyTrend, hospitals, perRsIkuValues } from '../data/hospitalData';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, ArcElement, Filler, Tooltip, Legend);

const forceIcon = { AD:'🟢', AL:'🔵', AU:'🟠' };

const chartBase = {
  responsive:true, maintainAspectRatio:false,
  plugins:{
    legend:{labels:{color:'#94a3b8',font:{family:'Inter',size:10},boxWidth:10,padding:12}},
    tooltip:{backgroundColor:'rgba(8,15,30,0.95)',titleColor:'#e2e8f0',bodyColor:'#94a3b8',borderColor:'rgba(255,255,255,0.08)',borderWidth:1,padding:10,cornerRadius:8,titleFont:{family:'Outfit',weight:700,size:12},bodyFont:{family:'Inter',size:11}}
  },
  scales:{
    x:{ticks:{color:'#64748b',font:{size:9,family:'Inter'}},grid:{color:'rgba(255,255,255,0.04)'},border:{color:'rgba(255,255,255,0.06)'}},
    y:{ticks:{color:'#64748b',font:{size:9,family:'Inter'}},grid:{color:'rgba(255,255,255,0.04)'},border:{color:'rgba(255,255,255,0.06)'}}
  }
};

function normalizeForRadar(key, val) {
  const p = ikuParams[key];
  if (!p) return 50;
  if (p.higherBetter === true) {
    const max = { kepuasanPasien:10, rujukanBalik:100, pelatihan:100, emr:100, akreditasi:100, inovasi:100 };
    return Math.min(100, (val / (max[key] || 100)) * 100);
  }
  if (p.higherBetter === false) {
    const caps = { waktuTunggu:60, sentinel:2, infeksiNosokomial:8, readmisi30:12, alos:8, toi:5, rasioMedis:10, rasioBiaya:100 };
    const cap = caps[key] || 100;
    return Math.max(0, (1 - val / cap) * 100);
  }
  return Math.max(0, 100 - Math.abs(val - 72.5) * 3);
}

function getStatus(key, val) {
  const p = ikuParams[key];
  if (!p) return 'normal';
  if (key === 'bor') return (val >= 60 && val <= 85) ? 'normal' : 'warning';
  if (key === 'alos') return (val >= 3 && val <= 5) ? 'normal' : 'warning';
  if (key === 'toi') return (val >= 1 && val <= 3) ? 'normal' : 'warning';
  if (key === 'rasioMedis') return (val >= 4 && val <= 6) ? 'normal' : 'warning';
  if (p.higherBetter === true) return val >= p.idealNum ? 'normal' : val >= p.idealNum * 0.85 ? 'warning' : 'critical';
  if (p.higherBetter === false) return val <= p.idealNum ? 'normal' : val <= p.idealNum * 1.2 ? 'warning' : 'critical';
  return 'normal';
}

function getCatScore(catKey, vals) {
  const cat = ikuCategories.find(c => c.key === catKey);
  if (!cat) return 0;
  const scores = cat.params.map(k => normalizeForRadar(k, vals[k]));
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(0);
}

function generateNarrative(rsVals, benchVals, natVals, selectedCat, rsName, isRsppn) {
  const insights = [];
  const challenges = [];
  const recommendations = [];

  const params = selectedCat === 'all'
    ? Object.keys(ikuParams)
    : ikuCategories.find(c => c.key === selectedCat)?.params || [];

  params.forEach(key => {
    const p = ikuParams[key];
    const rv = rsVals[key];
    const nv = natVals[key];
    const bv = benchVals[key];
    if (!p) return;
    const st = getStatus(key, rv);
    const betterThanNat = p.higherBetter === true ? rv > nv : p.higherBetter === false ? rv < nv : Math.abs(rv - 72.5) < Math.abs(nv - 72.5);
    const betterThanBench = p.higherBetter === true ? rv >= bv : p.higherBetter === false ? rv <= bv : Math.abs(rv - 72.5) <= Math.abs(bv - 72.5);

    if (betterThanNat) {
      insights.push(`✅ **${p.fullName}**: ${rsName} (${rv}${p.unit}) mengungguli rata-rata nasional (${nv}${p.unit}). ${p.tujuan}.`);
    }
    if (!isRsppn && !betterThanBench) {
      const gap = p.higherBetter === true ? bv - rv : p.higherBetter === false ? rv - bv : Math.abs(rv - 72.5) - Math.abs(bv - 72.5);
      challenges.push(`📍 **${p.fullName}** — gap terhadap RSPPN benchmark: ${rsName} (${rv}${p.unit}) vs RSPPN (${bv}${p.unit}).`);
    }
    if (st === 'warning') {
      challenges.push(`⚠️ **${p.fullName}** (${rv}${p.unit}) mendekati batas ideal (${p.ideal}). Perlu monitoring ketat.`);
    }
    if (st === 'critical') {
      challenges.push(`🚨 **${p.fullName}** (${rv}${p.unit}) di bawah standar ideal (${p.ideal}). Tindakan korektif segera.`);
    }
    if (!betterThanNat) {
      recommendations.push(`📌 Tingkatkan **${p.label}** — target: ${p.ideal}. ${rsName} (${rv}${p.unit}) vs Nasional (${nv}${p.unit})${!isRsppn ? ` vs RSPPN (${bv}${p.unit})` : ''}.`);
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('📌 Pertahankan kinerja saat ini dan lakukan audit berkala setiap triwulan.');
    recommendations.push('📌 Perkuat sinergi dengan Kemenkes, BPOM, dan mitra internasional untuk transformasi RS bertaraf global.');
  }

  return { insights, challenges, recommendations };
}

function shortName(name) {
  return name.replace(/^RSPPN |^RSPAD |^RSAD |^RSAL |^RSAU /, '').replace('Panglima Besar ', 'PB ').replace('Tk.II ', '');
}

function fmtVal(key, val) {
  return key === 'rasioMedis' ? `1:${val}` : `${val}${ikuParams[key]?.unit || ''}`;
}

export default function DataAnalysis() {
  const [selectedRs, setSelectedRs] = useState(1);
  const [selectedCat, setSelectedCat] = useState('all');
  const [expandedParam, setExpandedParam] = useState(null);
  const [activeChart, setActiveChart] = useState('radar');
  const [trendParam, setTrendParam] = useState('kepuasanPasien');

  const selectedHospital = useMemo(() => hospitals.find(h => h.id === selectedRs) || hospitals[0], [selectedRs]);
  const activeVals = useMemo(() => perRsIkuValues[selectedRs] || rsppnIkuValues, [selectedRs]);
  const rsName = useMemo(() => shortName(selectedHospital.name), [selectedHospital]);
  const isRsppn = selectedRs === 1;

  const displayParams = useMemo(() => {
    if (selectedCat === 'all') return Object.keys(ikuParams);
    const cat = ikuCategories.find(c => c.key === selectedCat);
    return cat ? cat.params : [];
  }, [selectedCat]);

  // === CHARTS ===

  // Radar: 3-way when non-RSPPN, 2-way when RSPPN
  const radarData = useMemo(() => {
    const datasets = [
      { label: rsName, data:displayParams.map(k => normalizeForRadar(k, activeVals[k])), borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', pointBackgroundColor:'#3b82f6', pointBorderColor:'#fff', pointBorderWidth:1, pointRadius:4, borderWidth:2.5 },
    ];
    if (!isRsppn) {
      datasets.push({ label:'RSPPN (Benchmark)', data:displayParams.map(k => normalizeForRadar(k, rsppnIkuValues[k])), borderColor:'#D4AF37', backgroundColor:'rgba(212,175,55,0.06)', pointBackgroundColor:'#D4AF37', pointBorderColor:'#fff', pointBorderWidth:1, pointRadius:3, borderWidth:2 });
    }
    datasets.push({ label:'Rata-rata Nasional', data:displayParams.map(k => normalizeForRadar(k, nationalAvgIkuValues[k])), borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.04)', pointBackgroundColor:'#ef4444', pointBorderColor:'#fff', pointBorderWidth:1, pointRadius:3, borderWidth:1.5, borderDash:[4,2] });
    return { labels: displayParams.map(k => ikuParams[k].label), datasets };
  }, [displayParams, activeVals, rsName, isRsppn]);

  // Comparison bar: 3-way
  const compBarData = useMemo(() => {
    const datasets = [
      { label: rsName, data:displayParams.map(k => normalizeForRadar(k, activeVals[k])), backgroundColor:'rgba(59,130,246,0.7)', borderColor:'#3b82f6', borderWidth:1, borderRadius:4, barPercentage:0.7 },
    ];
    if (!isRsppn) {
      datasets.push({ label:'RSPPN (Benchmark)', data:displayParams.map(k => normalizeForRadar(k, rsppnIkuValues[k])), backgroundColor:'rgba(212,175,55,0.6)', borderColor:'#D4AF37', borderWidth:1, borderRadius:4, barPercentage:0.7 });
    }
    datasets.push({ label:'Rata-rata Nasional', data:displayParams.map(k => normalizeForRadar(k, nationalAvgIkuValues[k])), backgroundColor:'rgba(239,68,68,0.5)', borderColor:'#ef4444', borderWidth:1, borderRadius:4, barPercentage:0.7 });
    return { labels: displayParams.map(k => ikuParams[k].label), datasets };
  }, [displayParams, activeVals, rsName, isRsppn]);

  // Trend line
  const trendData = useMemo(() => {
    const rsppnTrend = ikuMonthlyTrend.rsppn[trendParam];
    const natTrend = ikuMonthlyTrend.nasional[trendParam];
    if (!rsppnTrend) return null;
    return {
      labels: ikuMonthlyTrend.labels,
      datasets: [
        { label:'RSPPN (Benchmark)', data:rsppnTrend, borderColor:'#D4AF37', backgroundColor:'rgba(212,175,55,0.08)', fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#D4AF37', borderWidth:2 },
        { label:'Rata-rata Nasional', data:natTrend, borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.05)', fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#ef4444', borderWidth:1.5, borderDash:[4,2] },
      ]
    };
  }, [trendParam]);

  // Doughnut: score per category for selected RS
  const catDoughnut = useMemo(() => {
    const scores = ikuCategories.map(c => Number(getCatScore(c.key, activeVals)));
    return {
      labels: ikuCategories.map(c => c.label),
      datasets: [{ data:scores, backgroundColor:ikuCategories.map(c => c.color + 'cc'), borderColor:ikuCategories.map(c => c.color), borderWidth:2, hoverOffset:6 }]
    };
  }, [activeVals]);

  const narrative = useMemo(() => generateNarrative(activeVals, rsppnIkuValues, nationalAvgIkuValues, selectedCat, rsName, isRsppn), [selectedCat, activeVals, rsName, isRsppn]);

  const trendOptions = Object.keys(ikuMonthlyTrend.rsppn).map(k => ({ value:k, label:ikuParams[k]?.fullName || k }));

  const overallScore = (ikuCategories.reduce((s, c) => s + Number(getCatScore(c.key, activeVals)), 0) / 5).toFixed(0);
  const benchScore = (ikuCategories.reduce((s, c) => s + Number(getCatScore(c.key, rsppnIkuValues)), 0) / 5).toFixed(0);
  const natScore = (ikuCategories.reduce((s, c) => s + Number(getCatScore(c.key, nationalAvgIkuValues)), 0) / 5).toFixed(0);

  return (
    <div className="page-container da-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">📊 Data Analysis — 15 Parameter Kinerja</h1>
        <p className="page-subtitle">Komparasi performa 15 IKU: {selectedHospital.name} {!isRsppn ? 'vs RSPPN (Benchmark) ' : ''}vs Rata-rata Nasional</p>
      </div>

      {/* RS Selector + Category Filter */}
      <div className="da-filter-row">
        <div className="da-rs-selector">
          <label>🏥 Rumah Sakit</label>
          <select value={selectedRs} onChange={e => setSelectedRs(Number(e.target.value))}>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{forceIcon[h.force] || ''} {h.name} ({h.type}){h.id === 1 ? ' ⭐ Benchmark' : ''}</option>
            ))}
          </select>
        </div>
        <div className="da-cat-btns">
          <button className={`da-cat-btn ${selectedCat === 'all' ? 'active' : ''}`} onClick={() => setSelectedCat('all')} style={{ '--cat-color':'#D4AF37' }}>
            <span className="da-cat-icon">📋</span><span className="da-cat-text">Semua (15)</span>
          </button>
          {ikuCategories.map(cat => (
            <button key={cat.key} className={`da-cat-btn ${selectedCat === cat.key ? 'active' : ''}`} onClick={() => setSelectedCat(cat.key)} style={{ '--cat-color':cat.color }}>
              <span className="da-cat-icon">{cat.icon}</span><span className="da-cat-text">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Score Cards: 3-way comparison */}
      <div className="da-score-row">
        {ikuCategories.map(cat => {
          const score = Number(getCatScore(cat.key, activeVals));
          const bScore = Number(getCatScore(cat.key, rsppnIkuValues));
          const nScore = Number(getCatScore(cat.key, nationalAvgIkuValues));
          const diffNat = score - nScore;
          const diffBench = isRsppn ? null : score - bScore;
          return (
            <div key={cat.key} className={`da-score-card ${selectedCat === cat.key ? 'selected' : ''}`} style={{ '--sc':cat.color }} onClick={() => setSelectedCat(selectedCat === cat.key ? 'all' : cat.key)}>
              <div className="da-sc-header">
                <span className="da-sc-icon">{cat.icon}</span>
                <span className={`da-sc-diff ${diffNat >= 0 ? 'positive' : 'negative'}`}>{diffNat >= 0 ? '+' : ''}{diffNat} vs Nas</span>
              </div>
              <div className="da-sc-score">{score}<small>/100</small></div>
              <div className="da-sc-label">{cat.label}</div>
              {/* 3-way comparison bars */}
              <div className="da-sc-bar-track">
                <div className="da-sc-bar-fill" style={{ width:`${score}%`, background:cat.color }} />
                {!isRsppn && <div className="da-sc-bar-marker gold" style={{ left:`${bScore}%` }} title={`RSPPN: ${bScore}`} />}
                <div className="da-sc-bar-marker red" style={{ left:`${nScore}%` }} title={`Nasional: ${nScore}`} />
              </div>
              <div className="da-sc-compare-row">
                {!isRsppn && <span className="da-sc-cmp bench">RSPPN: {bScore}</span>}
                <span className="da-sc-cmp nat">Nasional: {nScore}</span>
                {diffBench !== null && <span className={`da-sc-cmp ${diffBench >= 0 ? 'positive' : 'negative'}`}>{diffBench >= 0 ? '+' : ''}{diffBench} vs RSPPN</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Charts + Params */}
      <div className="da-main-grid">
        {/* Charts */}
        <div className="da-charts-panel">
          <div className="da-chart-tabs">
            {[
              { key:'radar', icon:'🎯', label:'Radar' },
              { key:'comparison', icon:'📊', label:'Perbandingan' },
              { key:'trend', icon:'📈', label:'Trend Bulanan' },
              { key:'distribution', icon:'🍩', label:'Skor Kategori' },
            ].map(tab => (
              <button key={tab.key} className={`da-ct ${activeChart === tab.key ? 'active' : ''}`} onClick={() => setActiveChart(tab.key)}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
          <div className="da-chart-body">
            {activeChart === 'radar' && (
              <div className="da-chart-area" style={{ height:360 }}>
                <Radar data={radarData} options={{
                  responsive:true, maintainAspectRatio:false,
                  scales:{ r:{ angleLines:{color:'rgba(255,255,255,0.06)'}, grid:{color:'rgba(255,255,255,0.06)'}, pointLabels:{color:'#94a3b8',font:{size:9,family:'Inter'}}, ticks:{display:false}, min:0, max:100 } },
                  plugins:{...chartBase.plugins, legend:{position:'bottom',labels:{...chartBase.plugins.legend.labels, padding:16}}}
                }} />
              </div>
            )}
            {activeChart === 'comparison' && (
              <div className="da-chart-area" style={{ height:360 }}>
                <Bar data={compBarData} options={{...chartBase, indexAxis:'y', plugins:{...chartBase.plugins,legend:{position:'top',labels:{...chartBase.plugins.legend.labels}}}, scales:{...chartBase.scales, x:{...chartBase.scales.x, title:{display:true,text:'Skor (0-100)',color:'#64748b',font:{size:10}}}}}} />
              </div>
            )}
            {activeChart === 'trend' && (
              <div className="da-chart-area" style={{ height:360 }}>
                <div className="da-trend-selector">
                  <label>Parameter:</label>
                  <select value={trendParam} onChange={e => setTrendParam(e.target.value)}>
                    {trendOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {trendData && <Line data={trendData} options={{...chartBase, plugins:{...chartBase.plugins,legend:{position:'top',labels:{...chartBase.plugins.legend.labels}}}}} />}
              </div>
            )}
            {activeChart === 'distribution' && (
              <div className="da-chart-area da-dist-layout" style={{ height:360 }}>
                <div className="da-doughnut-wrap">
                  <Doughnut data={catDoughnut} options={{ responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{...chartBase.plugins, legend:{position:'bottom',labels:{...chartBase.plugins.legend.labels,padding:14}}} }} />
                </div>
                <div className="da-dist-scores">
                  {ikuCategories.map(cat => {
                    const s = getCatScore(cat.key, activeVals);
                    const bs = getCatScore(cat.key, rsppnIkuValues);
                    return (
                      <div key={cat.key} className="da-ds-row">
                        <span className="da-ds-dot" style={{ background:cat.color }} />
                        <span className="da-ds-name">{cat.label}</span>
                        <span className="da-ds-score" style={{ color:cat.color }}>{s}</span>
                        {!isRsppn && <span className="da-ds-bench">RSPPN: {bs}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 15 Parameter Cards — 3-way comparison */}
        <div className="da-params-panel">
          <div className="da-params-header">
            <h3>15 Indikator Kinerja Utama</h3>
            <span className="da-params-count">{displayParams.length} parameter</span>
          </div>
          <div className="da-params-list">
            {displayParams.map(key => {
              const p = ikuParams[key];
              const rv = activeVals[key];
              const bv = rsppnIkuValues[key];
              const nv = nationalAvgIkuValues[key];
              const st = getStatus(key, rv);
              const expanded = expandedParam === key;
              const catInfo = ikuCategories.find(c => c.key === p.category);
              const maxVal = Math.max(rv, bv, nv) * 1.2 || 1;
              return (
                <div key={key} className={`da-param-card ${st} ${expanded ? 'expanded' : ''}`} onClick={() => setExpandedParam(expanded ? null : key)} style={{ '--param-color':catInfo?.color || '#D4AF37' }}>
                  <div className="da-pc-top">
                    <div className="da-pc-left">
                      <span className="da-pc-no">{p.no}</span>
                      <span className="da-pc-icon">{p.icon}</span>
                      <div className="da-pc-info">
                        <span className="da-pc-label">{p.label}</span>
                        <span className="da-pc-full">{p.fullName}</span>
                      </div>
                    </div>
                    <div className="da-pc-right">
                      <div className="da-pc-values-3">
                        <span className={`da-pc-val-main ${st}`}>{fmtVal(key, rv)}</span>
                        {!isRsppn && <span className="da-pc-val-bench" title="RSPPN">🏅 {fmtVal(key, bv)}</span>}
                        <span className="da-pc-val-nat" title="Nasional">📊 {fmtVal(key, nv)}</span>
                      </div>
                      <span className={`da-pc-status ${st}`}>{st === 'normal' ? '✅' : st === 'warning' ? '⚠️' : '🚨'}</span>
                    </div>
                  </div>
                  {/* 3-way comparison bars */}
                  <div className="da-pc-bars">
                    <div className="da-pc-bar-row">
                      <span className="da-pc-bar-label">{rsName.length > 7 ? rsName.slice(0, 7) : rsName}</span>
                      <div className="da-pc-bar-track"><div className="da-pc-bar-fill selected" style={{ width:`${(rv / maxVal * 100)}%` }} /></div>
                    </div>
                    {!isRsppn && (
                      <div className="da-pc-bar-row">
                        <span className="da-pc-bar-label">RSPPN</span>
                        <div className="da-pc-bar-track"><div className="da-pc-bar-fill rsppn" style={{ width:`${(bv / maxVal * 100)}%` }} /></div>
                      </div>
                    )}
                    <div className="da-pc-bar-row">
                      <span className="da-pc-bar-label">Nasional</span>
                      <div className="da-pc-bar-track"><div className="da-pc-bar-fill nasional" style={{ width:`${(nv / maxVal * 100)}%` }} /></div>
                    </div>
                  </div>
                  {expanded && (
                    <div className="da-pc-expanded">
                      <p className="da-pc-desc">{p.description}</p>
                      <div className="da-pc-meta">
                        <span className="da-pc-ideal">🎯 Ideal: <strong>{p.ideal}</strong></span>
                        <span className="da-pc-tujuan">📎 {p.tujuan}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="da-narrative-section">
        <h3 className="da-narrative-title">🔎 Analisis Performa {selectedCat === 'all' ? '15 Parameter' : ikuCategories.find(c => c.key === selectedCat)?.label} — {rsName}</h3>

        {narrative.insights.length > 0 && (
          <div className="da-narr-block">
            <h4 className="da-narr-subtitle positive">✅ Keunggulan {rsName}</h4>
            <div className="da-narr-items">
              {narrative.insights.slice(0, 5).map((item, i) => <p key={i} className="da-narr-item" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
            </div>
          </div>
        )}

        {narrative.challenges.length > 0 && (
          <div className="da-narr-block">
            <h4 className="da-narr-subtitle warning">⚠️ Tantangan & Gap terhadap Benchmark</h4>
            <div className="da-narr-items">
              {narrative.challenges.slice(0, 8).map((item, i) => <p key={i} className="da-narr-item" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
            </div>
          </div>
        )}

        <div className="da-narr-block">
          <h4 className="da-narr-subtitle info">📌 Rekomendasi Strategis</h4>
          <div className="da-narr-items">
            {narrative.recommendations.slice(0, 5).map((item, i) => <p key={i} className="da-narr-item" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
          </div>
        </div>

        <div className="da-narr-block da-narr-footer">
          <h4 className="da-narr-subtitle">🎖️ Ringkasan Eksekutif</h4>
          <p className="da-narr-summary">
            {selectedHospital.name}: Skor <strong>{overallScore}/100</strong>
            {!isRsppn ? <> vs RSPPN Benchmark: <strong>{benchScore}/100</strong></> : null} vs Nasional: <strong>{natScore}/100</strong>.
            {Number(overallScore) >= Number(benchScore)
              ? ' Kinerja setara atau di atas benchmark RSPPN.'
              : ` Gap ${benchScore - overallScore} poin terhadap benchmark. Prioritas: ${Number(getCatScore('sdmKeuangan', activeVals)) < 50 ? 'penguatan SDM & efisiensi biaya, ' : ''}${Number(getCatScore('tataKelola', activeVals)) < 60 ? 'digitalisasi E-MR & inovasi layanan, ' : ''}monitoring real-time via Command Center.`}
          </p>
        </div>
      </div>
    </div>
  );
}
