import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import iupMinerbaData, { iupSummary } from '../data/iupMinerba';
import hguSawitData, { hguSummary } from '../data/hguSawit';
import pittiOverlapData, { pittiSummary } from '../data/pittiOverlap';
import { psnClusters, poiData, wilayahAdatPolygons, psnSummary } from '../data/psnPapuaData';
import { hotspotData, hotspotSummary } from '../data/hotspotData';
import { MAP_CONFIG, LAYER_DEFINITIONS } from '../data/layerConfig';

// ════════════════════════════════════════════════════════════
// BASEMAPS CONFIGURATION
// ════════════════════════════════════════════════════════════
const BASEMAPS = {
  dark: {
    id: 'dark',
    name: 'Dark Command',
    icon: '🌑',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    icon: '🛰️',
    style: {
      version: 8,
      sources: {
        'satellite-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 19,
        },
      },
      layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite-tiles' }],
    },
  },
  streets: {
    id: 'streets',
    name: 'Streets',
    icon: '🗺️',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
};

// ════════════════════════════════════════════════════════════
// LAYER CONFIG — local rendering setup
// ════════════════════════════════════════════════════════════
const LAYERS = [
  { id: 'iup-tambang', name: 'IUP Tambang', icon: '⛏️', color: '#4ECDC4', visible: true, category: 'perizinan' },
  { id: 'hgu-sawit', name: 'HGU Kelapa Sawit', icon: '🌴', color: '#FF6B35', visible: true, category: 'perizinan' },
  { id: 'pitti-overlap', name: 'PITTI Tumpang Tindih', icon: '⚠️', color: '#FF2E93', visible: true, category: 'analisis' },
  { id: 'psn-clusters', name: 'PSN Food Estate', icon: '🏗️', color: '#00FF88', visible: true, category: 'psn' },
  { id: 'wilayah-adat', name: 'Wilayah Adat', icon: '🏘️', color: '#FFD700', visible: true, category: 'sosial' },
  { id: 'hotspot-karhutla', name: 'Hotspot Karhutla', icon: '🔥', color: '#FF4444', visible: true, category: 'bencana' },
  { id: 'poi-markers', name: 'Point of Interest', icon: '📍', color: '#00D4FF', visible: true, category: 'infrastruktur' },
];

// ════════════════════════════════════════════════════════════
// KPI DATA
// ════════════════════════════════════════════════════════════
const KPI_CARDS = [
  { id: 'hgu', icon: '🌴', label: 'HGU Nasional', value: hguSummary.totalNasional.toLocaleString('id-ID'), color: '#FF6B35', sub: `${hguSummary.totalLuasNasional.toLocaleString('id-ID')} Ha` },
  { id: 'iup', icon: '⛏️', label: 'IUP Tambang', value: iupSummary.totalNasional.toLocaleString('id-ID'), color: '#4ECDC4', sub: `${iupSummary.totalLuasNasional.toLocaleString('id-ID')} Ha` },
  { id: 'overlap', icon: '⚠️', label: 'Overlap PSN', value: pittiSummary.totalLuasOverlapPapua.toLocaleString('id-ID') + ' Ha', color: '#FF2E93', sub: `${pittiSummary.totalOverlapPapuaSelatan} zona` },
  { id: 'hotspot', icon: '🔥', label: 'Hotspot Aktif', value: hotspotSummary.total24Jam.toString(), color: '#FF4444', sub: `${hotspotSummary.highConfidence} high conf` },
];

// ════════════════════════════════════════════════════════════
// HELPER — build popup HTML
// ════════════════════════════════════════════════════════════
function buildPopupHTML(layerType, props) {
  const wrap = (title, rows) => `
    <div class="gis-popup-inner">
      <div class="gis-popup-title">${title}</div>
      <div class="gis-popup-divider"></div>
      ${rows.map(([k, v]) => `<div class="gis-popup-row"><span class="gis-popup-key">${k}</span><span class="gis-popup-val">${v}</span></div>`).join('')}
    </div>`;

  switch (layerType) {
    case 'iup-tambang':
      return wrap(`⛏️ ${props.company_name || 'IUP Tambang'}`, [
        ['ID Izin', props.iup_id],
        ['SK Izin', props.permit_code],
        ['Komoditas', props.commodity],
        ['Status', props.status_stage],
        ['Provinsi', props.province],
        ['Kabupaten', props.kabupaten],
        ['Luas', `${(props.luas_ha || 0).toLocaleString('id-ID')} Ha`],
        ['Berlaku', `${props.tgl_terbit} s/d ${props.tgl_berakhir}`],
        ['Investasi', `USD ${(props.investasi_usd || 0).toLocaleString('en-US')}`],
        ['Pekerja', (props.pekerja || 0).toLocaleString('id-ID')],
      ]);
    case 'hgu-sawit':
      return wrap(`🌴 ${props.company_name || 'HGU Sawit'}`, [
        ['No HGU', props.nomor_hgu],
        ['Komoditas', props.komoditas],
        ['Luas', `${(props.luas_ha || 0).toLocaleString('id-ID')} Ha`],
        ['Provinsi', props.province],
        ['Kabupaten', props.kabupaten],
        ['Status', props.status],
        ['Sertifikasi', props.sertifikasi],
        ['Produksi CPO', `${(props.produksi_cpo_ton || 0).toLocaleString('id-ID')} Ton`],
        ['Berlaku', `${props.tgl_terbit} s/d ${props.tgl_berakhir}`],
      ]);
    case 'pitti-overlap':
      return wrap(`⚠️ ${props.conflict_type || 'Overlap'}`, [
        ['ID Overlap', props.overlap_id],
        ['Layer A', `${props.layer_a} — ${props.layer_a_company}`],
        ['Layer B', `${props.layer_b} — ${props.layer_b_company}`],
        ['Luas Overlap', `${(props.overlap_area_ha || 0).toLocaleString('id-ID')} Ha`],
        ['Severity', `<span class="gis-severity gis-severity--${(props.severity || '').toLowerCase()}">${props.severity}</span>`],
        ['Status', props.status],
        ['Kabupaten', props.kabupaten],
        ['Dilaporkan', props.reported_date],
        ['Deskripsi', props.description || '-'],
      ]);
    case 'psn-clusters':
      return wrap(`🏗️ ${props.cluster_name || 'PSN Cluster'}`, [
        ['ID Klaster', props.cluster_id],
        ['Komoditas', props.commodity_type],
        ['Target Luas', `${(props.target_area_ha || 0).toLocaleString('id-ID')} Ha`],
        ['Realisasi', `${(props.realisasi_ha || 0).toLocaleString('id-ID')} Ha (${props.progress_persen}%)`],
        ['Kabupaten', props.kabupaten],
        ['Distrik', props.distrik],
        ['Status', props.status],
        ['Pengelola', props.pengelola],
      ]);
    case 'wilayah-adat':
      return wrap(`🏘️ ${props.nama || 'Wilayah Adat'}`, [
        ['ID', props.adat_id],
        ['Suku', props.suku],
        ['Luas', `${(props.luas_ha || 0).toLocaleString('id-ID')} Ha`],
        ['Status', props.status],
      ]);
    case 'hotspot-karhutla':
      return wrap(`🔥 Hotspot ${props.id || ''}`, [
        ['Satelit', props.satellite],
        ['Confidence', props.confidence],
        ['Brightness', `${props.brightness} K`],
        ['FRP', `${props.frp} MW`],
        ['Tanggal', `${props.acq_date} ${props.acq_time}`],
        ['Provinsi', props.province],
        ['Kabupaten', props.kabupaten],
        ['Dalam Konsesi', props.dalam_konsesi ? `✅ ${props.nama_konsesi}` : '❌ Luar Konsesi'],
      ]);
    default:
      return `<div class="gis-popup-inner"><pre>${JSON.stringify(props, null, 2)}</pre></div>`;
  }
}

function buildPOIPopupHTML(props) {
  const meta = props.metadata || {};
  const metaRows = Object.entries(meta).map(([k, v]) => [k.replace(/_/g, ' ').toUpperCase(), v]);
  return `
    <div class="gis-popup-inner">
      <div class="gis-popup-title">${props.icon || '📍'} ${props.poi_name}</div>
      <div class="gis-popup-subtitle">${props.category} — ${props.sub_category}</div>
      <div class="gis-popup-divider"></div>
      ${metaRows.map(([k, v]) => `<div class="gis-popup-row"><span class="gis-popup-key">${k}</span><span class="gis-popup-val">${v}</span></div>`).join('')}
    </div>`;
}

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════
export default function DashboardGIS() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const animFrameRef = useRef(null);
  const hasFlewRef = useRef(false);

  // Layer visibility state
  const [layerVisibility, setLayerVisibility] = useState(() => {
    const init = {};
    LAYERS.forEach(l => { init[l.id] = l.visible; });
    return init;
  });

  const [activeBasemap, setActiveBasemap] = useState('dark');
  const [cursorCoords, setCursorCoords] = useState({ lng: 0, lat: 0 });
  const [mapZoom, setMapZoom] = useState(MAP_CONFIG.initialZoom);
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ─── Toggle Layer ───
  const toggleLayer = useCallback((layerId) => {
    setLayerVisibility(prev => {
      const next = { ...prev, [layerId]: !prev[layerId] };
      const map = mapRef.current;
      if (map && map.getLayer(layerId + '-fill')) {
        map.setLayoutProperty(layerId + '-fill', 'visibility', next[layerId] ? 'visible' : 'none');
      }
      if (map && map.getLayer(layerId + '-outline')) {
        map.setLayoutProperty(layerId + '-outline', 'visibility', next[layerId] ? 'visible' : 'none');
      }
      if (map && map.getLayer(layerId + '-circle')) {
        map.setLayoutProperty(layerId + '-circle', 'visibility', next[layerId] ? 'visible' : 'none');
      }
      if (map && map.getLayer(layerId + '-symbol')) {
        map.setLayoutProperty(layerId + '-symbol', 'visibility', next[layerId] ? 'visible' : 'none');
      }
      return next;
    });
  }, []);

  // ─── Fly to Papua ───
  const flyToPapua = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: MAP_CONFIG.papuaCenter,
      zoom: MAP_CONFIG.papuaZoom,
      pitch: MAP_CONFIG.papuaPitch,
      bearing: MAP_CONFIG.papuaBearing,
      duration: MAP_CONFIG.flyToDuration,
      essential: true,
    });
  }, []);

  // ─── Switch Basemap ───
  const switchBasemap = useCallback((basemapId) => {
    const map = mapRef.current;
    if (!map || basemapId === activeBasemap) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    setActiveBasemap(basemapId);

    const bm = BASEMAPS[basemapId];
    map.setStyle(bm.style);

    map.once('style.load', () => {
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);
      addAllSources(map);
      addAllLayers(map);
    });
  }, [activeBasemap]);

  // ─── Add Sources ───
  const addAllSources = useCallback((map) => {
    if (!map.getSource('iup-tambang')) {
      map.addSource('iup-tambang', { type: 'geojson', data: iupMinerbaData });
    }
    if (!map.getSource('hgu-sawit')) {
      map.addSource('hgu-sawit', { type: 'geojson', data: hguSawitData });
    }
    if (!map.getSource('pitti-overlap')) {
      map.addSource('pitti-overlap', { type: 'geojson', data: pittiOverlapData });
    }
    if (!map.getSource('psn-clusters')) {
      map.addSource('psn-clusters', { type: 'geojson', data: psnClusters });
    }
    if (!map.getSource('wilayah-adat')) {
      map.addSource('wilayah-adat', { type: 'geojson', data: wilayahAdatPolygons });
    }
    if (!map.getSource('hotspot-karhutla')) {
      map.addSource('hotspot-karhutla', { type: 'geojson', data: hotspotData });
    }
    if (!map.getSource('poi-markers')) {
      map.addSource('poi-markers', { type: 'geojson', data: poiData });
    }
  }, []);

  // ─── Add Layers ───
  const addAllLayers = useCallback((map) => {
    const vis = layerVisibility;

    // 1) Wilayah Adat (bottom)
    if (!map.getLayer('wilayah-adat-fill')) {
      map.addLayer({
        id: 'wilayah-adat-fill',
        type: 'fill',
        source: 'wilayah-adat',
        paint: { 'fill-color': '#FFD700', 'fill-opacity': 0.2 },
        layout: { visibility: vis['wilayah-adat'] ? 'visible' : 'none' },
      });
      map.addLayer({
        id: 'wilayah-adat-outline',
        type: 'line',
        source: 'wilayah-adat',
        paint: { 'line-color': '#FFD700', 'line-width': 1.5, 'line-dasharray': [4, 3] },
        layout: { visibility: vis['wilayah-adat'] ? 'visible' : 'none' },
      });
    }

    // 2) PSN Clusters
    if (!map.getLayer('psn-clusters-fill')) {
      map.addLayer({
        id: 'psn-clusters-fill',
        type: 'fill',
        source: 'psn-clusters',
        paint: { 'fill-color': '#00FF88', 'fill-opacity': 0.25 },
        layout: { visibility: vis['psn-clusters'] ? 'visible' : 'none' },
      });
      map.addLayer({
        id: 'psn-clusters-outline',
        type: 'line',
        source: 'psn-clusters',
        paint: { 'line-color': '#00FF88', 'line-width': 2 },
        layout: { visibility: vis['psn-clusters'] ? 'visible' : 'none' },
      });
    }

    // 3) HGU Sawit
    if (!map.getLayer('hgu-sawit-fill')) {
      map.addLayer({
        id: 'hgu-sawit-fill',
        type: 'fill',
        source: 'hgu-sawit',
        paint: { 'fill-color': '#FF6B35', 'fill-opacity': 0.35 },
        layout: { visibility: vis['hgu-sawit'] ? 'visible' : 'none' },
      });
      map.addLayer({
        id: 'hgu-sawit-outline',
        type: 'line',
        source: 'hgu-sawit',
        paint: { 'line-color': '#FF6B35', 'line-width': 1.5 },
        layout: { visibility: vis['hgu-sawit'] ? 'visible' : 'none' },
      });
    }

    // 4) IUP Tambang
    if (!map.getLayer('iup-tambang-fill')) {
      map.addLayer({
        id: 'iup-tambang-fill',
        type: 'fill',
        source: 'iup-tambang',
        paint: { 'fill-color': '#4ECDC4', 'fill-opacity': 0.35 },
        layout: { visibility: vis['iup-tambang'] ? 'visible' : 'none' },
      });
      map.addLayer({
        id: 'iup-tambang-outline',
        type: 'line',
        source: 'iup-tambang',
        paint: { 'line-color': '#4ECDC4', 'line-width': 1.5 },
        layout: { visibility: vis['iup-tambang'] ? 'visible' : 'none' },
      });
    }

    // 5) PITTI Overlap (top fill — high severity)
    if (!map.getLayer('pitti-overlap-fill')) {
      map.addLayer({
        id: 'pitti-overlap-fill',
        type: 'fill',
        source: 'pitti-overlap',
        paint: { 'fill-color': '#FF2E93', 'fill-opacity': 0.4 },
        layout: { visibility: vis['pitti-overlap'] ? 'visible' : 'none' },
      });
      map.addLayer({
        id: 'pitti-overlap-outline',
        type: 'line',
        source: 'pitti-overlap',
        paint: { 'line-color': '#FF2E93', 'line-width': 2, 'line-dasharray': [2, 2] },
        layout: { visibility: vis['pitti-overlap'] ? 'visible' : 'none' },
      });
    }

    // 6) Hotspot (circle)
    if (!map.getLayer('hotspot-karhutla-circle')) {
      map.addLayer({
        id: 'hotspot-karhutla-circle',
        type: 'circle',
        source: 'hotspot-karhutla',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 4,
            9, 8,
            14, 14,
          ],
          'circle-color': [
            'match', ['get', 'confidence'],
            'high', '#FF0000',
            'nominal', '#FF8800',
            '#FFCC00'
          ],
          'circle-opacity': 0.85,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1.5,
          'circle-blur': 0.3,
        },
        layout: { visibility: vis['hotspot-karhutla'] ? 'visible' : 'none' },
      });
    }

    // 7) POI Markers (circle + label)
    if (!map.getLayer('poi-markers-symbol')) {
      map.addLayer({
        id: 'poi-markers-symbol',
        type: 'circle',
        source: 'poi-markers',
        paint: {
          'circle-radius': 6,
          'circle-color': [
            'match', ['get', 'category'],
            'LOGISTIK', '#00D4FF',
            'PRODUKSI', '#7B61FF',
            'WILAYAH_ADAT', '#FFD700',
            'INFRASTRUKTUR', '#00FF88',
            '#AAAAAA'
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.9,
        },
        layout: { visibility: vis['poi-markers'] ? 'visible' : 'none' },
      });
    }
  }, [layerVisibility]);

  // ─── PITTI pulse animation ───
  const startPittiPulse = useCallback((map) => {
    let opacity = 0.4;
    let direction = -1;
    const animate = () => {
      if (!map || !map.getLayer('pitti-overlap-fill')) return;
      opacity += direction * 0.008;
      if (opacity <= 0.15) { opacity = 0.15; direction = 1; }
      if (opacity >= 0.5) { opacity = 0.5; direction = -1; }
      try {
        map.setPaintProperty('pitti-overlap-fill', 'fill-opacity', opacity);
      } catch (_) { return; }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // ─── Setup interactive click handlers ───
  const setupInteractions = useCallback((map) => {
    const popup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '380px',
      className: 'gis-maplibre-popup',
    });
    popupRef.current = popup;

    // Click layers
    const clickLayers = [
      'iup-tambang-fill', 'hgu-sawit-fill', 'pitti-overlap-fill',
      'psn-clusters-fill', 'wilayah-adat-fill', 'hotspot-karhutla-circle',
      'poi-markers-symbol',
    ];

    clickLayers.forEach(layerId => {
      map.on('click', layerId, (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const props = feat.properties;
        const baseId = layerId.replace(/-fill$/, '').replace(/-circle$/, '').replace(/-symbol$/, '');

        let html;
        if (baseId === 'poi-markers') {
          // Parse nested metadata if stringified
          const parsed = { ...props };
          if (typeof parsed.metadata === 'string') {
            try { parsed.metadata = JSON.parse(parsed.metadata); } catch (_) { parsed.metadata = {}; }
          }
          html = buildPOIPopupHTML(parsed);
        } else {
          html = buildPopupHTML(baseId, props);
        }

        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
      });

      // Cursor pointer
      map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = ''; });
    });
  }, []);

  // ════════════════════════════════════════════════════════════
  // MAP INITIALIZATION
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASEMAPS.dark.style,
      center: MAP_CONFIG.initialCenter,
      zoom: MAP_CONFIG.initialZoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 3,
    });

    mapRef.current = map;

    // Navigation controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 150, unit: 'metric' }), 'bottom-left');

    // Mouse move → coords
    map.on('mousemove', (e) => {
      setCursorCoords({ lng: e.lngLat.lng.toFixed(5), lat: e.lngLat.lat.toFixed(5) });
    });

    map.on('zoom', () => {
      setMapZoom(map.getZoom().toFixed(1));
    });

    map.on('load', () => {
      setMapLoaded(true);

      // Add sources
      addAllSources(map);

      // Add layers
      addAllLayers(map);

      // Start PITTI pulse
      startPittiPulse(map);

      // Setup click interactions
      setupInteractions(map);

      // Auto flyTo Papua after delay
      if (!hasFlewRef.current) {
        hasFlewRef.current = true;
        setTimeout(() => {
          map.flyTo({
            center: MAP_CONFIG.papuaCenter,
            zoom: MAP_CONFIG.papuaZoom,
            pitch: MAP_CONFIG.papuaPitch,
            bearing: MAP_CONFIG.papuaBearing,
            duration: MAP_CONFIG.flyToDuration,
            essential: true,
          });
        }, MAP_CONFIG.autoFlyDelay);
      }
    });

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (popupRef.current) popupRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Category groups for layer panel ───
  const layerCategories = useMemo(() => {
    const cats = {};
    LAYERS.forEach(l => {
      const cat = l.category;
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(l);
    });
    return cats;
  }, []);

  const categoryLabels = {
    perizinan: '📋 Perizinan',
    analisis: '🔍 Analisis',
    psn: '🏗️ PSN',
    sosial: '🤝 Sosial',
    bencana: '🚨 Bencana',
    infrastruktur: '🏢 Infrastruktur',
  };

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div className="gis-canvas">
      {/* ── MAP CONTAINER ── */}
      <div className="gis-map-container" ref={mapContainerRef} />

      {/* ── LOADING OVERLAY ── */}
      {!mapLoaded && (
        <div className="gis-loading-overlay">
          <div className="gis-loading-spinner" />
          <span className="gis-loading-text">Memuat Kanvas Spasial Nasional...</span>
        </div>
      )}

      {/* ── TOP BAR — TITLE ── */}
      <div className="gis-top-bar">
        <div className="gis-top-title">
          <span className="gis-top-icon">🛰️</span>
          <div>
            <h1 className="gis-top-h1">Cross-DSS — National Spatial Canvas</h1>
            <p className="gis-top-sub">Overlay Analisis HGU · IUP · PSN · PITTI · Wilayah Adat · Hotspot Karhutla</p>
          </div>
        </div>
        <div className="gis-top-status">
          <span className="gis-live-dot" />
          <span className="gis-live-label">LIVE</span>
          <span className="gis-top-timestamp">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* ── KPI CARDS (top-right) ── */}
      <div className="gis-kpi-panel">
        {KPI_CARDS.map((kpi, idx) => (
          <div key={kpi.id} className="gis-kpi-card-float" style={{ '--kpi-color': kpi.color, '--kpi-delay': `${idx * 0.1}s` }}>
            <span className="gis-kpi-icon-float">{kpi.icon}</span>
            <div className="gis-kpi-data">
              <span className="gis-kpi-value">{kpi.value}</span>
              <span className="gis-kpi-label">{kpi.label}</span>
              <span className="gis-kpi-sub">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── LAYER CONTROL PANEL (left) ── */}
      <div className={`gis-layer-control ${layerPanelOpen ? 'open' : 'collapsed'}`}>
        <button className="gis-layer-toggle" onClick={() => setLayerPanelOpen(p => !p)}>
          {layerPanelOpen ? '◀' : '▶'}
          {layerPanelOpen && <span className="gis-layer-toggle-label">Layer Control</span>}
        </button>

        {layerPanelOpen && (
          <div className="gis-layer-list">
            <div className="gis-layer-header">
              <span className="gis-layer-header-icon">🗂️</span>
              <span className="gis-layer-header-title">Layer Manager</span>
            </div>

            {Object.entries(layerCategories).map(([cat, layers]) => (
              <div key={cat} className="gis-layer-cat">
                <div className="gis-layer-cat-title">{categoryLabels[cat] || cat}</div>
                {layers.map(layer => (
                  <label key={layer.id} className="gis-layer-item">
                    <input
                      type="checkbox"
                      checked={layerVisibility[layer.id]}
                      onChange={() => toggleLayer(layer.id)}
                      className="gis-layer-checkbox"
                    />
                    <span className="gis-layer-swatch" style={{ background: layer.color }} />
                    <span className="gis-layer-icon">{layer.icon}</span>
                    <span className="gis-layer-name">{layer.name}</span>
                  </label>
                ))}
              </div>
            ))}

            {/* Basemap Switcher */}
            <div className="gis-layer-cat">
              <div className="gis-layer-cat-title">🗺️ Basemap</div>
              {Object.values(BASEMAPS).map(bm => (
                <button
                  key={bm.id}
                  className={`gis-basemap-btn ${activeBasemap === bm.id ? 'active' : ''}`}
                  onClick={() => switchBasemap(bm.id)}
                >
                  <span>{bm.icon}</span>
                  <span>{bm.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FOCUS BUTTON ── */}
      <button className="gis-focus-btn" onClick={flyToPapua}>
        <span className="gis-focus-icon">🎯</span>
        <span className="gis-focus-text">Fokus PSN Papua Selatan</span>
      </button>

      {/* ── LEGEND TOGGLE + PANEL ── */}
      <button className="gis-legend-toggle" onClick={() => setLegendOpen(p => !p)}>
        {legendOpen ? '✕' : '📊'} {legendOpen ? '' : 'Legend'}
      </button>

      {legendOpen && (
        <div className="gis-legend-panel">
          <div className="gis-legend-title">📊 Legenda Peta</div>
          <div className="gis-legend-divider" />

          <div className="gis-legend-section">
            <div className="gis-legend-section-title">Izin & Wilayah</div>
            {LAYERS.filter(l => l.id !== 'hotspot-karhutla' && l.id !== 'poi-markers').map(l => (
              <div key={l.id} className="gis-legend-row">
                <span className="gis-legend-swatch" style={{ background: l.color, opacity: layerVisibility[l.id] ? 1 : 0.3 }} />
                <span className="gis-legend-row-icon">{l.icon}</span>
                <span className="gis-legend-row-label">{l.name}</span>
              </div>
            ))}
          </div>

          <div className="gis-legend-divider" />

          <div className="gis-legend-section">
            <div className="gis-legend-section-title">Hotspot Confidence</div>
            {[
              { label: 'High', color: '#FF0000' },
              { label: 'Nominal', color: '#FF8800' },
              { label: 'Low', color: '#FFCC00' },
            ].map(h => (
              <div key={h.label} className="gis-legend-row">
                <span className="gis-legend-dot" style={{ background: h.color }} />
                <span className="gis-legend-row-label">{h.label}</span>
              </div>
            ))}
          </div>

          <div className="gis-legend-divider" />

          <div className="gis-legend-section">
            <div className="gis-legend-section-title">POI Kategori</div>
            {[
              { label: 'Logistik', color: '#00D4FF' },
              { label: 'Produksi', color: '#7B61FF' },
              { label: 'Wilayah Adat', color: '#FFD700' },
              { label: 'Infrastruktur', color: '#00FF88' },
            ].map(p => (
              <div key={p.label} className="gis-legend-row">
                <span className="gis-legend-dot" style={{ background: p.color }} />
                <span className="gis-legend-row-label">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="gis-legend-divider" />

          <div className="gis-legend-section">
            <div className="gis-legend-section-title">Severity Overlap</div>
            {[
              { label: 'CRITICAL', cls: 'critical' },
              { label: 'HIGH', cls: 'high' },
              { label: 'MEDIUM', cls: 'medium' },
            ].map(s => (
              <div key={s.cls} className="gis-legend-row">
                <span className={`gis-legend-badge gis-legend-badge--${s.cls}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COORDINATE BAR (bottom) ── */}
      <div className="gis-coord-bar">
        <span className="gis-coord-item">
          <span className="gis-coord-label">LNG</span>
          <span className="gis-coord-value">{cursorCoords.lng}</span>
        </span>
        <span className="gis-coord-sep">|</span>
        <span className="gis-coord-item">
          <span className="gis-coord-label">LAT</span>
          <span className="gis-coord-value">{cursorCoords.lat}</span>
        </span>
        <span className="gis-coord-sep">|</span>
        <span className="gis-coord-item">
          <span className="gis-coord-label">ZOOM</span>
          <span className="gis-coord-value">{mapZoom}</span>
        </span>
        <span className="gis-coord-sep">|</span>
        <span className="gis-coord-item">
          <span className="gis-coord-label">BASEMAP</span>
          <span className="gis-coord-value">{BASEMAPS[activeBasemap].name}</span>
        </span>
        <span className="gis-coord-sep">|</span>
        <span className="gis-coord-item">
          <span className="gis-coord-label">LAYERS</span>
          <span className="gis-coord-value">{Object.values(layerVisibility).filter(Boolean).length}/{LAYERS.length}</span>
        </span>
        <span className="gis-coord-powered">Cross-DSS v2.0 — Powered by MapLibre GL</span>
      </div>

      {/* ── QUICK STATS — bottom-left mini ── */}
      <div className="gis-quick-stats">
        <div className="gis-quick-stat">
          <span className="gis-quick-stat-val">{psnSummary.totalKlaster}</span>
          <span className="gis-quick-stat-lbl">Klaster PSN</span>
        </div>
        <div className="gis-quick-stat">
          <span className="gis-quick-stat-val">{psnSummary.progressTotal}%</span>
          <span className="gis-quick-stat-lbl">Progress</span>
        </div>
        <div className="gis-quick-stat">
          <span className="gis-quick-stat-val">{psnSummary.totalWilayahAdat}</span>
          <span className="gis-quick-stat-lbl">Wil. Adat</span>
        </div>
        <div className="gis-quick-stat">
          <span className="gis-quick-stat-val">{pittiSummary.totalOverlapNasional.toLocaleString('id-ID')}</span>
          <span className="gis-quick-stat-lbl">Overlap Nasional</span>
        </div>
      </div>
    </div>
  );
}
