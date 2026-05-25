// ============================================================
// Hotspot & IoT Sensor Data — Cross-DSS
// MODIS/VIIRS Karhutla + Peatland Water Table
// ============================================================

export const hotspotData = {
  type: 'FeatureCollection',
  name: 'Hotspot_Karhutla_MODIS_VIIRS',
  lastUpdated: '2026-05-25T03:00:00Z',
  source: 'NASA FIRMS (MODIS/VIIRS)',
  features: [
    { type: 'Feature', properties: { id: 'HS-001', satellite: 'VIIRS-SNPP', confidence: 'high', brightness: 342.5, frp: 28.4, acq_date: '2026-05-24', acq_time: '14:30', province: 'Papua Selatan', kabupaten: 'Merauke', dalam_konsesi: true, nama_konsesi: 'PT. Merauke Rayon Jaya' }, geometry: { type: 'Point', coordinates: [140.25, -8.12] }},
    { type: 'Feature', properties: { id: 'HS-002', satellite: 'MODIS-Terra', confidence: 'nominal', brightness: 318.2, frp: 15.8, acq_date: '2026-05-24', acq_time: '15:10', province: 'Papua Selatan', kabupaten: 'Merauke', dalam_konsesi: false, nama_konsesi: null }, geometry: { type: 'Point', coordinates: [140.32, -8.18] }},
    { type: 'Feature', properties: { id: 'HS-003', satellite: 'VIIRS-SNPP', confidence: 'high', brightness: 356.1, frp: 42.3, acq_date: '2026-05-24', acq_time: '14:45', province: 'Papua Selatan', kabupaten: 'Boven Digoel', dalam_konsesi: true, nama_konsesi: 'PT. Plasma Papua Sejahtera' }, geometry: { type: 'Point', coordinates: [140.65, -6.95] }},
    { type: 'Feature', properties: { id: 'HS-004', satellite: 'VIIRS-NOAA20', confidence: 'nominal', brightness: 310.8, frp: 12.1, acq_date: '2026-05-23', acq_time: '13:20', province: 'Papua Selatan', kabupaten: 'Merauke', dalam_konsesi: true, nama_konsesi: 'PT. Korindo Papua Plantations' }, geometry: { type: 'Point', coordinates: [140.48, -8.18] }},
    { type: 'Feature', properties: { id: 'HS-005', satellite: 'MODIS-Aqua', confidence: 'low', brightness: 305.4, frp: 8.9, acq_date: '2026-05-23', acq_time: '16:00', province: 'Papua Selatan', kabupaten: 'Mappi', dalam_konsesi: false, nama_konsesi: null }, geometry: { type: 'Point', coordinates: [139.70, -7.20] }},
    { type: 'Feature', properties: { id: 'HS-006', satellite: 'VIIRS-SNPP', confidence: 'high', brightness: 365.0, frp: 55.2, acq_date: '2026-05-25', acq_time: '02:30', province: 'Riau', kabupaten: 'Pelalawan', dalam_konsesi: true, nama_konsesi: 'PT. SMART Tbk' }, geometry: { type: 'Point', coordinates: [102.35, 0.25] }},
    { type: 'Feature', properties: { id: 'HS-007', satellite: 'VIIRS-SNPP', confidence: 'high', brightness: 348.7, frp: 31.6, acq_date: '2026-05-25', acq_time: '02:45', province: 'Kalimantan Tengah', kabupaten: 'Kotawaringin Timur', dalam_konsesi: true, nama_konsesi: 'PT. Sawit Sumbermas Sarana' }, geometry: { type: 'Point', coordinates: [112.95, -2.35] }},
    { type: 'Feature', properties: { id: 'HS-008', satellite: 'MODIS-Terra', confidence: 'nominal', brightness: 322.3, frp: 18.7, acq_date: '2026-05-24', acq_time: '14:15', province: 'Kalimantan Barat', kabupaten: 'Ketapang', dalam_konsesi: false }, geometry: { type: 'Point', coordinates: [110.15, -1.75] }},
  ]
};

export const peatlandSensors = [
  { sensor_id: 'PWT-MRK-001', location: 'Rawa Gambut Wanam Utara', lat: -8.08, lng: 140.30, province: 'Papua Selatan', kabupaten: 'Merauke', water_table_cm: -28, threshold_cm: -40, status: 'NORMAL', last_reading: '2026-05-25T04:00:00Z', trend: 'stable', history: [-25, -27, -26, -28, -30, -28, -26, -25, -27, -28, -29, -28] },
  { sensor_id: 'PWT-MRK-002', location: 'Rawa Gambut Wanam Selatan', lat: -8.22, lng: 140.35, province: 'Papua Selatan', kabupaten: 'Merauke', water_table_cm: -38, threshold_cm: -40, status: 'WARNING', last_reading: '2026-05-25T04:00:00Z', trend: 'decreasing', history: [-30, -32, -33, -35, -34, -36, -37, -38, -39, -38, -37, -38] },
  { sensor_id: 'PWT-MRK-003', location: 'Gambut Animha', lat: -8.15, lng: 140.22, province: 'Papua Selatan', kabupaten: 'Merauke', water_table_cm: -45, threshold_cm: -40, status: 'CRITICAL', last_reading: '2026-05-25T04:00:00Z', trend: 'decreasing', history: [-35, -36, -38, -40, -41, -42, -43, -44, -44, -45, -45, -45] },
  { sensor_id: 'PWT-MRK-004', location: 'Gambut Ilwayab Barat', lat: -8.05, lng: 140.55, province: 'Papua Selatan', kabupaten: 'Merauke', water_table_cm: -22, threshold_cm: -40, status: 'NORMAL', last_reading: '2026-05-25T04:00:00Z', trend: 'stable', history: [-20, -21, -22, -23, -22, -21, -20, -21, -22, -23, -22, -22] },
  { sensor_id: 'PWT-BDG-001', location: 'Rawa Gambut Boven Digoel', lat: -6.90, lng: 140.62, province: 'Papua Selatan', kabupaten: 'Boven Digoel', water_table_cm: -42, threshold_cm: -40, status: 'CRITICAL', last_reading: '2026-05-25T04:00:00Z', trend: 'decreasing', history: [-32, -34, -35, -37, -38, -39, -40, -41, -42, -42, -43, -42] },
  { sensor_id: 'PWT-RIA-001', location: 'Gambut Siak Riau', lat: 1.05, lng: 101.95, province: 'Riau', kabupaten: 'Siak', water_table_cm: -35, threshold_cm: -40, status: 'WARNING', last_reading: '2026-05-25T04:00:00Z', trend: 'decreasing', history: [-28, -29, -30, -31, -32, -33, -34, -35, -35, -34, -35, -35] },
];

export const hotspotSummary = {
  total24Jam: 8,
  totalDalamKonsesi: 5,
  totalDiluarKonsesi: 3,
  highConfidence: 4,
  sensorGambut: { total: 6, normal: 2, warning: 2, critical: 2 },
  perProvinsi: [
    { province: 'Papua Selatan', count: 5 },
    { province: 'Riau', count: 1 },
    { province: 'Kalimantan Tengah', count: 1 },
    { province: 'Kalimantan Barat', count: 1 },
  ],
  trendMingguan: [
    { minggu: 'Minggu 1', count: 12 },
    { minggu: 'Minggu 2', count: 18 },
    { minggu: 'Minggu 3', count: 8 },
    { minggu: 'Minggu 4', count: 5 },
  ],
};

export default { hotspotData, peatlandSensors, hotspotSummary };
