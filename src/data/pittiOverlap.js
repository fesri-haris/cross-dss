// ============================================================
// PITTI Overlap Data — Cross-DSS
// Peta Indikatif Tumpang Tindih Informasi Geospasial Tematik
// Source: OneMap BIG
// ============================================================

export const pittiOverlapData = {
  type: 'FeatureCollection',
  name: 'PITTI_Tumpang_Tindih',
  lastUpdated: '2026-05-15T00:00:00Z',
  source: 'OneMap BIG - PITTI',
  features: [
    // === OVERLAP: HGU Sawit vs IUP Tambang di Papua Selatan ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-PS-001',
        layer_a: 'HGU Kelapa Sawit',
        layer_a_company: 'PT. Berkat Cipta Abadi',
        layer_a_id: 'HGU-PS-002',
        layer_b: 'IUP Tambang Kuarsa',
        layer_b_company: 'PT. Wanam Kuarsa Perdana',
        layer_b_id: 'IUP-PS-006',
        overlap_area_ha: 1240,
        severity: 'CRITICAL',
        status: 'Belum Terselesaikan',
        province: 'Papua Selatan',
        kabupaten: 'Merauke',
        description: 'Tumpang tindih area HGU kelapa sawit aktif dengan IUP eksplorasi kuarsa di Distrik Wanam',
        reported_date: '2025-08-15',
        conflict_type: 'HGU vs IUP',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.48, -8.08], [140.55, -8.08], [140.55, -8.15], [140.48, -8.15], [140.48, -8.08]]]
      }
    },
    // === OVERLAP: HGU Sawit vs Wilayah Adat (Rawa Sagu) ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-PS-002',
        layer_a: 'HGU Kelapa Sawit',
        layer_a_company: 'PT. Korindo Papua Plantations',
        layer_a_id: 'HGU-PS-004',
        layer_b: 'Wilayah Adat Suku Marind',
        layer_b_company: 'Komunitas Adat Suku Marind',
        layer_b_id: 'ADAT-001',
        overlap_area_ha: 3800,
        severity: 'CRITICAL',
        status: 'Sengketa Aktif',
        province: 'Papua Selatan',
        kabupaten: 'Merauke',
        description: 'Area konsesi sawit memasuki kawasan rawa sagu komunal dan situs ritual adat Pesta Babi Suku Marind',
        reported_date: '2024-11-20',
        conflict_type: 'HGU vs Wilayah Adat',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.42, -8.15], [140.55, -8.15], [140.55, -8.25], [140.42, -8.25], [140.42, -8.15]]]
      }
    },
    // === OVERLAP: IUP Tambang vs PSN Food Estate ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-PS-003',
        layer_a: 'IUP Tambang Batubara',
        layer_a_company: 'PT. Tanah Papua Mining',
        layer_a_id: 'IUP-PS-003',
        layer_b: 'PSN Food Estate Sawah Baru',
        layer_b_company: 'Pemerintah RI (BGN)',
        layer_b_id: 'PSN-PADI-001',
        overlap_area_ha: 5200,
        severity: 'HIGH',
        status: 'Dalam Mediasi',
        province: 'Papua Selatan',
        kabupaten: 'Merauke',
        description: 'Wilayah eksplorasi batubara bersinggungan dengan rencana cetak sawah baru Food Estate Wanam',
        reported_date: '2025-03-10',
        conflict_type: 'IUP vs PSN',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.20, -8.22], [140.35, -8.22], [140.35, -8.32], [140.20, -8.32], [140.20, -8.22]]]
      }
    },
    // === OVERLAP: HGU Sawit vs Kawasan Hutan ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-PS-004',
        layer_a: 'HGU Kelapa Sawit',
        layer_a_company: 'PT. Plasma Papua Sejahtera',
        layer_a_id: 'HGU-PS-003',
        layer_b: 'Kawasan Hutan Lindung',
        layer_b_company: 'KLHK',
        layer_b_id: 'KH-BDG-012',
        overlap_area_ha: 2100,
        severity: 'HIGH',
        status: 'Moratorium',
        province: 'Papua Selatan',
        kabupaten: 'Boven Digoel',
        description: 'Perkebunan sawit meluas ke kawasan hutan lindung di Boven Digoel',
        reported_date: '2025-01-05',
        conflict_type: 'HGU vs Kawasan Hutan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.62, -6.92], [140.72, -6.92], [140.72, -7.02], [140.62, -7.02], [140.62, -6.92]]]
      }
    },
    // === OVERLAP: IUP Tambang vs Wilayah Adat Suku Awyu ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-PS-005',
        layer_a: 'IUP Tambang Kuarsa',
        layer_a_company: 'PT. Digoel Mining Corp',
        layer_a_id: 'IUP-PS-002',
        layer_b: 'Wilayah Adat Suku Awyu',
        layer_b_company: 'Komunitas Adat Suku Awyu',
        layer_b_id: 'ADAT-003',
        overlap_area_ha: 1850,
        severity: 'CRITICAL',
        status: 'Sengketa Aktif',
        province: 'Papua Selatan',
        kabupaten: 'Boven Digoel',
        description: 'Aktivitas eksplorasi kuarsa mengancam hutan ulayat dan sumber mata air Suku Awyu',
        reported_date: '2025-06-12',
        conflict_type: 'IUP vs Wilayah Adat',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.58, -6.88], [140.68, -6.88], [140.68, -6.95], [140.58, -6.95], [140.58, -6.88]]]
      }
    },
    // === OVERLAP Nasional: Riau ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-RI-001',
        layer_a: 'HGU Kelapa Sawit',
        layer_a_company: 'PT. SMART Tbk',
        layer_b: 'Kawasan Hutan Produksi Terbatas',
        layer_b_company: 'KLHK',
        overlap_area_ha: 4500,
        severity: 'HIGH',
        status: 'Dalam Review',
        province: 'Riau',
        kabupaten: 'Pelalawan',
        conflict_type: 'HGU vs Kawasan Hutan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[102.3, 0.3], [102.45, 0.3], [102.45, 0.15], [102.3, 0.15], [102.3, 0.3]]]
      }
    },
    // === OVERLAP Nasional: Kalimantan Barat ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-KB-001',
        layer_a: 'HGU Kelapa Sawit',
        layer_a_company: 'PT. Wilmar Nabati Indonesia',
        layer_b: 'IUP Tambang Bauksit',
        layer_b_company: 'PT. Aneka Tambang Kalbar',
        overlap_area_ha: 3200,
        severity: 'MEDIUM',
        status: 'Dalam Mediasi',
        province: 'Kalimantan Barat',
        kabupaten: 'Ketapang',
        conflict_type: 'HGU vs IUP',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[110.1, -1.7], [110.25, -1.7], [110.25, -1.85], [110.1, -1.85], [110.1, -1.7]]]
      }
    },
    // === OVERLAP Nasional: Kalimantan Timur ===
    {
      type: 'Feature',
      properties: {
        overlap_id: 'OVL-KT-001',
        layer_a: 'IUP Tambang Batubara',
        layer_a_company: 'PT. Kaltim Prima Coal',
        layer_b: 'PSN Ibu Kota Nusantara (IKN)',
        layer_b_company: 'Otorita IKN',
        overlap_area_ha: 8900,
        severity: 'CRITICAL',
        status: 'Dalam Negosiasi',
        province: 'Kalimantan Timur',
        kabupaten: 'Kutai Kartanegara',
        conflict_type: 'IUP vs PSN',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[116.85, 0.1], [117.0, 0.1], [117.0, -0.05], [116.85, -0.05], [116.85, 0.1]]]
      }
    },
  ]
};

export const pittiSummary = {
  totalOverlapNasional: 4256,
  totalOverlapPapuaSelatan: 5,
  totalLuasOverlap: 2840000,
  totalLuasOverlapPapua: 14190,
  perSeverity: {
    critical: { count: 1245, luasHa: 980000 },
    high: { count: 1567, luasHa: 890000 },
    medium: { count: 987, luasHa: 620000 },
    low: { count: 457, luasHa: 350000 },
  },
  perTipeKonflik: [
    { type: 'HGU vs Kawasan Hutan', count: 1850, luasHa: 1250000, persen: 43.4 },
    { type: 'HGU vs IUP', count: 890, luasHa: 620000, persen: 20.9 },
    { type: 'IUP vs Kawasan Hutan', count: 650, luasHa: 430000, persen: 15.3 },
    { type: 'HGU vs Wilayah Adat', count: 420, luasHa: 280000, persen: 9.9 },
    { type: 'IUP vs PSN', count: 245, luasHa: 150000, persen: 5.8 },
    { type: 'IUP vs Wilayah Adat', count: 201, luasHa: 110000, persen: 4.7 },
  ],
  trendBulanan: [
    { bulan: 'Des 2025', baru: 45, selesai: 12 },
    { bulan: 'Jan 2026', baru: 52, selesai: 18 },
    { bulan: 'Feb 2026', baru: 38, selesai: 22 },
    { bulan: 'Mar 2026', baru: 61, selesai: 15 },
    { bulan: 'Apr 2026', baru: 44, selesai: 28 },
    { bulan: 'Mei 2026', baru: 33, selesai: 31 },
  ],
};

export default pittiOverlapData;
