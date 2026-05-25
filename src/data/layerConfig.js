// ============================================================
// Layer Configuration — Cross-DSS WebGIS
// WMS/REST endpoints + offline fallback config
// ============================================================

export const MAP_CONFIG = {
  initialCenter: [118, -2.5],
  initialZoom: 4.5,
  papuaCenter: [140.4, -8.1],
  papuaZoom: 9,
  papuaBearing: 0,
  papuaPitch: 45,
  flyToDuration: 3000,
  autoFlyDelay: 2000,
};

export const BASEMAPS = {
  dark: {
    name: 'Dark Command',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  satellite: {
    name: 'Satellite',
    style: 'https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_key',
    fallbackTiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ],
  },
  terrain: {
    name: 'Terrain',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
};

export const WMS_SOURCES = {
  iupEsdm: {
    name: 'IUP Tambang (ESDM)',
    description: 'Izin Usaha Pertambangan dari Geoportal ESDM',
    wmsUrl: 'https://momi.minerba.esdm.go.id/gisserver/rest/services/Pusat/WIUP_Publish/MapServer/export',
    wmsParams: {
      bbox: '{bbox-epsg-3857}',
      bboxSR: 3857,
      imageSR: 3857,
      size: '256,256',
      format: 'png32',
      transparent: true,
      f: 'image',
    },
    restUrl: 'https://momi.minerba.esdm.go.id/gisserver/rest/services/Pusat/WIUP_Publish/MapServer',
    requiresAuth: true,
    layerColor: '#4ECDC4',
  },
  hguBig: {
    name: 'HGU Kelapa Sawit (BIG)',
    description: 'Hak Guna Usaha dari OneMap BIG',
    wmsUrl: 'https://geoservices.big.go.id/arcgis/services/PUBLIK/PERENCANAAN_RUANG/MapServer/WMSServer',
    wmsParams: {
      service: 'WMS',
      version: '1.3.0',
      request: 'GetMap',
      layers: '0',
      crs: 'EPSG:3857',
      format: 'image/png',
      transparent: true,
      width: 256,
      height: 256,
    },
    restUrl: 'https://geoservices.big.go.id/arcgis/rest/services/PUBLIK/PERENCANAAN_RUANG/MapServer',
    requiresAuth: false,
    layerColor: '#FF6B35',
  },
  pittiBig: {
    name: 'PITTI (BIG)',
    description: 'Peta Indikatif Tumpang Tindih Informasi Geospasial Tematik',
    wmsUrl: 'https://geoservices.big.go.id/arcgis/services/PUBLIK/PERENCANAAN_RUANG/MapServer/WMSServer',
    wmsParams: {
      service: 'WMS',
      version: '1.3.0',
      request: 'GetMap',
      layers: '100',
      crs: 'EPSG:3857',
      format: 'image/png',
      transparent: true,
      width: 256,
      height: 256,
    },
    restUrl: 'https://geoservices.big.go.id/arcgis/rest/services/PUBLIK/PERENCANAAN_RUANG/MapServer',
    layerId: 100,
    requiresAuth: false,
    layerColor: '#FF2E93',
  },
  kawasanHutan: {
    name: 'Kawasan Hutan (KLHK)',
    description: 'Batas kawasan hutan dari Kementerian LHK',
    wmsUrl: 'https://geoportal.menlhk.go.id/arcgis/services/PUBLIK/PIPPIB/MapServer/WMSServer',
    requiresAuth: true,
    layerColor: '#2ECC71',
  },
};

export const LAYER_DEFINITIONS = [
  {
    id: 'iup-tambang',
    name: 'IUP Tambang',
    icon: '⛏️',
    color: '#4ECDC4',
    source: 'iupEsdm',
    type: 'fill',
    visible: true,
    opacity: 0.6,
    category: 'perizinan',
  },
  {
    id: 'hgu-sawit',
    name: 'HGU Kelapa Sawit',
    icon: '🌴',
    color: '#FF6B35',
    source: 'hguBig',
    type: 'fill',
    visible: true,
    opacity: 0.6,
    category: 'perizinan',
  },
  {
    id: 'pitti-overlap',
    name: 'PITTI Tumpang Tindih',
    icon: '⚠️',
    color: '#FF2E93',
    source: 'pittiBig',
    type: 'fill',
    visible: false,
    opacity: 0.7,
    category: 'analisis',
  },
  {
    id: 'psn-clusters',
    name: 'PSN Food Estate',
    icon: '🏗️',
    color: '#00FF88',
    source: 'local',
    type: 'fill',
    visible: true,
    opacity: 0.5,
    category: 'psn',
  },
  {
    id: 'wilayah-adat',
    name: 'Wilayah Adat',
    icon: '🏘️',
    color: '#FFD700',
    source: 'local',
    type: 'fill',
    visible: true,
    opacity: 0.4,
    category: 'sosial',
  },
  {
    id: 'hotspot-karhutla',
    name: 'Hotspot Karhutla',
    icon: '🔥',
    color: '#FF4444',
    source: 'local',
    type: 'circle',
    visible: false,
    opacity: 0.8,
    category: 'bencana',
  },
  {
    id: 'poi-markers',
    name: 'Point of Interest',
    icon: '📍',
    color: '#00D4FF',
    source: 'local',
    type: 'symbol',
    visible: true,
    opacity: 1.0,
    category: 'infrastruktur',
  },
  {
    id: 'kawasan-hutan',
    name: 'Kawasan Hutan',
    icon: '🌳',
    color: '#2ECC71',
    source: 'kawasanHutan',
    type: 'fill',
    visible: false,
    opacity: 0.4,
    category: 'lingkungan',
  },
];

export const DEMO_MODE_CONFIG = {
  defaultMode: 'offline', // 'live' or 'offline'
  offlineDataPath: '/data/cache/',
  liveApiTimeout: 5000,
  retryAttempts: 3,
  cacheTTL: 3600000, // 1 hour
};

export default {
  MAP_CONFIG,
  BASEMAPS,
  WMS_SOURCES,
  LAYER_DEFINITIONS,
  DEMO_MODE_CONFIG,
};
