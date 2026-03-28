import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { hospitals } from '../data/hospitalData';
import { hospitalImages } from '../data/hospitalImages';
import 'leaflet/dist/leaflet.css';

const forceIcons = { AD:'🪖', AL:'⚓', AU:'✈️' };
const statusColors = { normal:'#10b981', waspada:'#f59e0b', kritis:'#ef4444' };
const statusLabels = { normal:'Normal', waspada:'Waspada', kritis:'Kritis' };
const forceColors = { AD:'#10b981', AL:'#3b82f6', AU:'#f97316' };
const forceLabels = { AD:'TNI AD', AL:'TNI AL', AU:'TNI AU' };

const forceMarkerStyles = {
  AD: { fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 },
  AL: { fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 },
  AU: { fill: '#ffffff', stroke: '#1e293b', strokeWidth: 2 },
};

const createIcon = (h) => {
  const style = forceMarkerStyles[h.force] || forceMarkerStyles.AD;
  const size = h.type==='Type A'?20:h.type==='Type B'?16:h.type==='Type C'?13:10;
  const glow = style.fill === '#ffffff' ? 'rgba(30,41,59,0.4)' : `${style.fill}80`;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="map-marker-wrap" style="--mc:${style.fill}">
      <div class="map-marker-dot" style="width:${size}px;height:${size}px;background:${style.fill};border:${style.strokeWidth}px solid ${style.stroke};box-shadow:0 0 ${size}px ${glow}, 0 0 ${size*2}px ${glow}"></div>
      <div class="map-marker-ring" style="width:${size+10}px;height:${size+10}px;border:1.5px solid ${glow}"></div>
    </div>`,
    iconSize: [size+10, size+10], iconAnchor: [(size+10)/2, (size+10)/2],
  });
};

// ═══ IMAGE SLIDER COMPONENT ═══
function ImageSlider({ hospitalId }) {
  const [current, setCurrent] = useState(0);
  const data = hospitalImages[hospitalId];
  const images = data?.images || [];
  const captions = data?.captions || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const iv = setInterval(() => setCurrent(p => (p + 1) % images.length), 4000);
    return () => clearInterval(iv);
  }, [images.length]);

  // Reset to first slide when hospital changes
  useEffect(() => { setCurrent(0); }, [hospitalId]);

  if (!images.length) return null;

  return (
    <div className="popup-slider">
      <div className="popup-slider-track">
        {images.map((src, i) => (
          <div key={i} className={`popup-slide ${i === current ? 'active' : ''}`}>
            <img src={src} alt={captions[i] || `RS Photo ${i+1}`} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="popup-slide-caption">{captions[current] || ''}</div>
      <div className="popup-slider-dots">
        {images.map((_, i) => (
          <button key={i}
            className={`popup-dot ${i === current ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══ MAP CONTROLLER ═══
function MapCtrl({ mapRef }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

export default function DashboardGIS() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterForce, setFilterForce] = useState('all');
  const [searchRS, setSearchRS] = useState('');
  const [selectedRS, setSelectedRS] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  const filtered = hospitals.filter(h => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterStatus !== 'all' && h.status !== filterStatus) return false;
    if (filterForce !== 'all' && h.force !== filterForce) return false;
    if (searchRS && !h.name.toLowerCase().includes(searchRS.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'bor') return b.bor - a.bor;
    if (sortBy === 'beds') return b.beds - a.beds;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const counts = {
    all: hospitals.length,
    normal: hospitals.filter(h => h.status === 'normal').length,
    waspada: hospitals.filter(h => h.status === 'waspada').length,
    kritis: hospitals.filter(h => h.status === 'kritis').length,
    AD: hospitals.filter(h => h.force === 'AD').length,
    AL: hospitals.filter(h => h.force === 'AL').length,
    AU: hospitals.filter(h => h.force === 'AU').length,
  };
  const totalBeds = filtered.reduce((s, h) => s + h.beds, 0);
  const totalNakes = filtered.reduce((s, h) => s + h.nakes, 0);
  const totalICU = filtered.reduce((s, h) => s + h.icu, 0);
  const avgBOR = filtered.length > 0 ? Math.round(filtered.reduce((s, h) => s + h.bor, 0) / filtered.length) : 0;
  const fNormal = filtered.filter(h => h.status === 'normal').length;
  const fWaspada = filtered.filter(h => h.status === 'waspada').length;
  const fKritis = filtered.filter(h => h.status === 'kritis').length;

  // ═══ SMOOTH MAX ZOOM + POPUP OPEN ═══
  const flyTo = useCallback((h) => {
    setSelectedRS(h.id);
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Close any open popup first
    map.closePopup();

    // Smooth two-stage fly: first zoom out slightly for context, then zoom in to max
    const currentZoom = map.getZoom();
    const targetZoom = 18;
    const duration = currentZoom >= 15 ? 1.2 : 2;

    map.flyTo([h.lat, h.lng], targetZoom, {
      duration,
      easeLinearity: 0.35,
    });

    // Open popup after flyTo animation completes
    const openDelay = duration * 1000 + 200;
    setTimeout(() => {
      const marker = markerRefs.current[h.id];
      if (marker) {
        marker.openPopup();
      }
    }, openDelay);
  }, []);

  const resetView = () => {
    setSelectedRS(null);
    if (mapRef.current) {
      mapRef.current.closePopup();
      mapRef.current.flyTo([-2.5, 118], 5, { duration: 1.5 });
    }
  };

  return (
    <div className="page-container gis-page">
      <div className="page-header">
        <h1 className="page-title"><span className="title-icon">🗺️</span>GIS Monitoring Dashboard</h1>
        <p className="page-subtitle">Peta interaktif seluruh RS TNI se-Indonesia — real-time monitoring & tracking</p>
      </div>

      {/* KPI Summary */}
      <div className="gis-kpi-row">
        {[
          { icon:'🏥', val:filtered.length, label:'Total RS', color:'#3b82f6' },
          { icon:'🛏️', val:totalBeds.toLocaleString(), label:'Total Bed', color:'#06b6d4' },
          { icon:'👨‍⚕️', val:totalNakes.toLocaleString(), label:'Total Nakes', color:'#8b5cf6' },
          { icon:'🫀', val:totalICU, label:'ICU Beds', color:'#D4AF37' },
          { icon:'📊', val:`${avgBOR}%`, label:'Avg BOR', color:'#f59e0b' },
          { icon:'✅', val:fNormal, label:'Normal', color:'#10b981' },
          { icon:'⚠️', val:fWaspada, label:'Waspada', color:'#f59e0b' },
          { icon:'🔴', val:fKritis, label:'Kritis', color:'#ef4444' },
        ].map((c, i) => (
          <div key={i} className="gis-kpi-card" style={{ '--gkc':c.color, '--delay':`${i*0.05}s` }}>
            <span className="gis-kpi-icon">{c.icon}</span>
            <div className="gis-kpi-info">
              <span className="gis-kpi-val">{c.val}</span>
              <span className="gis-kpi-lbl">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="gis-filter-bar">
        <div className="gis-filter-left">
          <div className="gis-pill-group">
            <span className="gis-pill-label">Angkatan</span>
            {['all','AD','AL','AU'].map(f => (
              <button key={f} className={`gis-pill ${filterForce===f?'active':''}`}
                style={f!=='all'?{'--pill-active':forceColors[f]}:{}} onClick={()=>setFilterForce(f)}>
                {f==='all'?'🌐 Semua':`${forceIcons[f]} ${forceLabels[f]}`}
                <span className="gis-pill-count">{f==='all'?counts.all:counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="gis-pill-group">
            <span className="gis-pill-label">Status</span>
            {['all','normal','waspada','kritis'].map(f => (
              <button key={f} className={`gis-pill ${filterStatus===f?'active':''}`}
                style={f!=='all'?{'--pill-active':statusColors[f]}:{}} onClick={()=>setFilterStatus(f)}>
                {f==='all'?'📋 Semua':statusLabels[f]}
                <span className="gis-pill-count">{f==='all'?counts.all:counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="gis-pill-group">
            <span className="gis-pill-label">Tipe</span>
            {['all','Type A','Type B','Type C','Type D'].map(f => (
              <button key={f} className={`gis-pill ${filterType===f?'active':''}`} onClick={()=>setFilterType(f)}>
                {f==='all'?'🏥 Semua':f}
              </button>
            ))}
          </div>
        </div>
        <div className="gis-filter-right">
          <span className="gis-filter-count"><strong>{filtered.length}</strong> / {hospitals.length} RS</span>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="gis-layout">
        <div className="map-full-container">
          <MapContainer center={[-2.5,118]} zoom={5} className="leaflet-map-full" zoomControl={true} attributionControl={false} maxZoom={19}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png" maxZoom={19} />
            <MapCtrl mapRef={mapRef} />
            {filtered.map(h => (
              <Marker
                key={h.id}
                position={[h.lat,h.lng]}
                icon={createIcon(h)}
                ref={(ref) => { if (ref) markerRefs.current[h.id] = ref; }}
                eventHandlers={{
                  click: () => flyTo(h),
                }}
              >
                <Popup className="hospital-popup" maxWidth={420} minWidth={380} autoPan={true} autoPanPadding={[40, 40]}>
                  <div className="popup-content popup-enhanced">
                    {/* Photo Slider */}
                    <ImageSlider hospitalId={h.id} />

                    {/* Header */}
                    <div className="popup-header-row">
                      <span className="popup-force-icon">{forceIcons[h.force]}</span>
                      <div>
                        <h4>{h.name}</h4>
                        <div className="popup-type">{h.type} • TNI {h.force} • {h.accreditation}</div>
                      </div>
                    </div>
                    <div className="popup-status-row">Status: <span className={`status-tag ${h.status}`}>{h.status.toUpperCase()}</span></div>
                    <div className="popup-divider" />

                    {/* Info Rows */}
                    <div className="popup-stats">
                      <div className="popup-stat-row"><span>📍</span><span>{h.address}</span></div>
                      <div className="popup-stat-row"><span>📞</span><span>{h.phone}</span></div>
                      <div className="popup-stat-row"><span>👤</span><span>Direktur: {h.director}</span></div>
                    </div>

                    {/* Metrics */}
                    <div className="popup-metrics">
                      <div className="pm-item"><span className="pm-val">{h.bor}%</span><span className="pm-lbl">BOR</span></div>
                      <div className="pm-item"><span className="pm-val">{h.nakes}</span><span className="pm-lbl">Nakes</span></div>
                      <div className="pm-item"><span className="pm-val">{h.beds}</span><span className="pm-lbl">Beds</span></div>
                      <div className="pm-item"><span className="pm-val">{h.icu}</span><span className="pm-lbl">ICU</span></div>
                    </div>

                    {/* Footer */}
                    <div className="popup-footer">
                      <span>Alkes: <strong>{h.alkesReady}%</strong></span>
                      <span>IGD: <strong>{h.emergency?'✅ Aktif':'❌'}</strong></span>
                    </div>
                    <div className="popup-specialties">{h.specialties.join(' • ')}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="map-legend-overlay">
            <div className="legend-section">
              <span className="legend-title">Status RS</span>
              {['normal','waspada','kritis'].map(s => (
                <span key={s} className={`legend-row ${filterStatus===s?'active':''}`} onClick={()=>setFilterStatus(filterStatus===s?'all':s)} style={{cursor:'pointer'}}>
                  <span className={`legend-dot ${s}`} />{statusLabels[s]} ({counts[s]})
                </span>
              ))}
            </div>
            <div className="legend-section">
              <span className="legend-title">Angkatan</span>
              {['AD','AL','AU'].map(f => {
                const ms = forceMarkerStyles[f];
                return (
                  <span key={f} className={`legend-row ${filterForce===f?'active':''}`} onClick={()=>setFilterForce(filterForce===f?'all':f)} style={{cursor:'pointer'}}>
                    <span className="legend-dot" style={{background:ms.fill, border:`2px solid ${ms.stroke}`, boxShadow: f === 'AU' ? '0 0 4px rgba(30,41,59,0.4)' : `0 0 6px ${ms.fill}60`}} />{forceIcons[f]} {forceLabels[f]} ({counts[f]})
                  </span>
                );
              })}
            </div>
            <div className="legend-section">
              <span className="legend-title">Ukuran Marker</span>
              <span>⬤ Type A (Besar)</span>
              <span>● Type B (Sedang)</span>
              <span>• Type C/D (Kecil)</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="gis-sidebar">
          <div className="gis-sb-header">
            <span className="gis-sb-title">📋 Daftar RS ({filtered.length})</span>
            {selectedRS && <button className="gis-sb-reset" onClick={resetView}>↩️ Reset</button>}
          </div>
          <div className="gis-sb-search">
            <span>🔍</span>
            <input type="text" placeholder="Cari rumah sakit..." value={searchRS} onChange={e=>setSearchRS(e.target.value)} />
          </div>
          <div className="gis-sb-sort">
            <span className="gis-sb-sort-label">Urutkan:</span>
            {[['name','Nama'],['bor','BOR'],['beds','Bed'],['status','Status']].map(([k,l]) => (
              <button key={k} className={`gis-sb-sort-btn ${sortBy===k?'active':''}`} onClick={()=>setSortBy(k)}>{l}</button>
            ))}
          </div>
          <div className="rs-list-sidebar">
            {sorted.map(h => (
              <div key={h.id} className={`gis-rs-item ${selectedRS===h.id?'selected':''}`} onClick={() => flyTo(h)}>
                <span className="gis-rs-force">{forceIcons[h.force]}</span>
                <div className="gis-rs-info">
                  <span className="gis-rs-name">{h.name}</span>
                  <span className="gis-rs-meta">{h.type} • BOR {h.bor}% • {h.beds} beds</span>
                </div>
                <div className="gis-rs-right">
                  <span className={`gis-rs-status ${h.status}`} />
                  <span className="gis-rs-bor" style={{color:statusColors[h.status]}}>{h.bor}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
