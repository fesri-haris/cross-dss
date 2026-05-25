// ============================================================
// IUP Minerba GeoJSON Cache — Cross-DSS
// Data representatif IUP Tambang nasional (fokus Papua Selatan)
// Source: Geoportal ESDM / MOMI Minerba
// ============================================================

export const iupMinerbaData = {
  type: 'FeatureCollection',
  name: 'IUP_Tambang_Indonesia',
  lastUpdated: '2026-05-20T00:00:00Z',
  source: 'Geoportal ESDM Minerba',
  features: [
    // === PAPUA SELATAN (Focus Area) ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PS-001',
        company_name: 'PT. Papua Mineral Resources',
        permit_code: 'SK-545/ESDM/2023',
        commodity: 'Emas',
        status_stage: 'Operasi Produksi',
        province: 'Papua Selatan',
        kabupaten: 'Merauke',
        luas_ha: 12450,
        tgl_terbit: '2023-03-15',
        tgl_berakhir: '2043-03-14',
        investasi_usd: 85000000,
        pekerja: 1250,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.32, -8.05], [140.45, -8.05], [140.45, -8.15], [140.32, -8.15], [140.32, -8.05]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PS-002',
        company_name: 'PT. Digoel Mining Corp',
        permit_code: 'SK-612/ESDM/2022',
        commodity: 'Kuarsa',
        status_stage: 'Eksplorasi',
        province: 'Papua Selatan',
        kabupaten: 'Boven Digoel',
        luas_ha: 8700,
        tgl_terbit: '2022-07-10',
        tgl_berakhir: '2030-07-09',
        investasi_usd: 12000000,
        pekerja: 340,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.55, -6.85], [140.72, -6.85], [140.72, -6.98], [140.55, -6.98], [140.55, -6.85]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PS-003',
        company_name: 'PT. Tanah Papua Mining',
        permit_code: 'SK-289/ESDM/2024',
        commodity: 'Batubara',
        status_stage: 'Eksplorasi',
        province: 'Papua Selatan',
        kabupaten: 'Merauke',
        luas_ha: 15200,
        tgl_terbit: '2024-01-20',
        tgl_berakhir: '2032-01-19',
        investasi_usd: 28000000,
        pekerja: 180,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.18, -8.20], [140.38, -8.20], [140.38, -8.35], [140.18, -8.35], [140.18, -8.20]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PS-004',
        company_name: 'PT. Mappi Mineral Jaya',
        permit_code: 'SK-401/ESDM/2023',
        commodity: 'Nikel',
        status_stage: 'Operasi Produksi',
        province: 'Papua Selatan',
        kabupaten: 'Mappi',
        luas_ha: 9800,
        tgl_terbit: '2023-06-01',
        tgl_berakhir: '2043-05-31',
        investasi_usd: 65000000,
        pekerja: 890,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[139.75, -7.10], [139.92, -7.10], [139.92, -7.28], [139.75, -7.28], [139.75, -7.10]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PS-005',
        company_name: 'PT. Asmat Resources International',
        permit_code: 'SK-778/ESDM/2024',
        commodity: 'Besi',
        status_stage: 'Eksplorasi',
        province: 'Papua Selatan',
        kabupaten: 'Asmat',
        luas_ha: 6300,
        tgl_terbit: '2024-04-12',
        tgl_berakhir: '2032-04-11',
        investasi_usd: 18000000,
        pekerja: 120,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[138.85, -6.20], [139.02, -6.20], [139.02, -6.38], [138.85, -6.38], [138.85, -6.20]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PS-006',
        company_name: 'PT. Wanam Kuarsa Perdana',
        permit_code: 'SK-915/ESDM/2025',
        commodity: 'Kuarsa',
        status_stage: 'Eksplorasi',
        province: 'Papua Selatan',
        kabupaten: 'Merauke',
        luas_ha: 4200,
        tgl_terbit: '2025-02-01',
        tgl_berakhir: '2033-01-31',
        investasi_usd: 8500000,
        pekerja: 95,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.48, -8.08], [140.58, -8.08], [140.58, -8.18], [140.48, -8.18], [140.48, -8.08]]]
      }
    },
    // === KALIMANTAN TIMUR ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-KT-001',
        company_name: 'PT. Kaltim Prima Coal',
        permit_code: 'SK-112/ESDM/2021',
        commodity: 'Batubara',
        status_stage: 'Operasi Produksi',
        province: 'Kalimantan Timur',
        kabupaten: 'Kutai Kartanegara',
        luas_ha: 45000,
        tgl_terbit: '2021-01-01',
        tgl_berakhir: '2041-12-31',
        investasi_usd: 450000000,
        pekerja: 5200,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[116.8, 0.2], [117.1, 0.2], [117.1, -0.1], [116.8, -0.1], [116.8, 0.2]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-KT-002',
        company_name: 'PT. Berau Coal Energy',
        permit_code: 'SK-223/ESDM/2020',
        commodity: 'Batubara',
        status_stage: 'Operasi Produksi',
        province: 'Kalimantan Timur',
        kabupaten: 'Berau',
        luas_ha: 38500,
        tgl_terbit: '2020-06-15',
        tgl_berakhir: '2040-06-14',
        investasi_usd: 320000000,
        pekerja: 4800,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[117.2, 1.8], [117.5, 1.8], [117.5, 1.5], [117.2, 1.5], [117.2, 1.8]]]
      }
    },
    // === KALIMANTAN SELATAN ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-KS-001',
        company_name: 'PT. Adaro Energy Indonesia',
        permit_code: 'SK-034/ESDM/2019',
        commodity: 'Batubara',
        status_stage: 'Operasi Produksi',
        province: 'Kalimantan Selatan',
        kabupaten: 'Tabalong',
        luas_ha: 35800,
        tgl_terbit: '2019-03-01',
        tgl_berakhir: '2039-02-28',
        investasi_usd: 380000000,
        pekerja: 4500,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[115.3, -1.8], [115.6, -1.8], [115.6, -2.1], [115.3, -2.1], [115.3, -1.8]]]
      }
    },
    // === SUMATERA SELATAN ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-SS-001',
        company_name: 'PT. Bukit Asam Tbk',
        permit_code: 'SK-078/ESDM/2018',
        commodity: 'Batubara',
        status_stage: 'Operasi Produksi',
        province: 'Sumatera Selatan',
        kabupaten: 'Muara Enim',
        luas_ha: 25600,
        tgl_terbit: '2018-01-01',
        tgl_berakhir: '2038-12-31',
        investasi_usd: 290000000,
        pekerja: 3800,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[103.6, -3.6], [103.9, -3.6], [103.9, -3.9], [103.6, -3.9], [103.6, -3.6]]]
      }
    },
    // === SULAWESI TENGGARA ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-ST-001',
        company_name: 'PT. Vale Indonesia Tbk',
        permit_code: 'KK-267/ESDM/2014',
        commodity: 'Nikel',
        status_stage: 'Operasi Produksi',
        province: 'Sulawesi Tenggara',
        kabupaten: 'Konawe',
        luas_ha: 42000,
        tgl_terbit: '2014-07-01',
        tgl_berakhir: '2044-06-30',
        investasi_usd: 520000000,
        pekerja: 6100,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[121.8, -3.8], [122.1, -3.8], [122.1, -4.1], [121.8, -4.1], [121.8, -3.8]]]
      }
    },
    // === MALUKU UTARA ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-MU-001',
        company_name: 'PT. Halmahera Persada Lygend',
        permit_code: 'SK-445/ESDM/2022',
        commodity: 'Nikel',
        status_stage: 'Operasi Produksi',
        province: 'Maluku Utara',
        kabupaten: 'Halmahera Timur',
        luas_ha: 18900,
        tgl_terbit: '2022-03-10',
        tgl_berakhir: '2042-03-09',
        investasi_usd: 210000000,
        pekerja: 2900,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[128.5, 1.1], [128.8, 1.1], [128.8, 0.8], [128.5, 0.8], [128.5, 1.1]]]
      }
    },
    // === PAPUA (Province) ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-PA-001',
        company_name: 'PT. Freeport Indonesia',
        permit_code: 'IUPK-001/ESDM/2022',
        commodity: 'Emas',
        status_stage: 'Operasi Produksi',
        province: 'Papua Tengah',
        kabupaten: 'Mimika',
        luas_ha: 212950,
        tgl_terbit: '2022-12-21',
        tgl_berakhir: '2041-12-31',
        investasi_usd: 15000000000,
        pekerja: 28500,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[136.8, -4.0], [137.2, -4.0], [137.2, -4.4], [136.8, -4.4], [136.8, -4.0]]]
      }
    },
    // === KALIMANTAN TENGAH ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-KTG-001',
        company_name: 'PT. Borneo Indobara',
        permit_code: 'SK-891/ESDM/2021',
        commodity: 'Batubara',
        status_stage: 'Operasi Produksi',
        province: 'Kalimantan Tengah',
        kabupaten: 'Murung Raya',
        luas_ha: 28400,
        tgl_terbit: '2021-09-01',
        tgl_berakhir: '2041-08-31',
        investasi_usd: 180000000,
        pekerja: 2200,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[114.8, -0.5], [115.1, -0.5], [115.1, -0.8], [114.8, -0.8], [114.8, -0.5]]]
      }
    },
    // === SULAWESI TENGAH ===
    {
      type: 'Feature',
      properties: {
        iup_id: 'IUP-SLT-001',
        company_name: 'PT. Morowali Industrial Park',
        permit_code: 'SK-567/ESDM/2020',
        commodity: 'Nikel',
        status_stage: 'Operasi Produksi',
        province: 'Sulawesi Tengah',
        kabupaten: 'Morowali',
        luas_ha: 22500,
        tgl_terbit: '2020-04-15',
        tgl_berakhir: '2040-04-14',
        investasi_usd: 350000000,
        pekerja: 3400,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[121.6, -2.7], [121.9, -2.7], [121.9, -3.0], [121.6, -3.0], [121.6, -2.7]]]
      }
    },
  ]
};

// Summary statistics
export const iupSummary = {
  totalNasional: 8247,
  totalPapuaSelatan: 6,
  totalLuasNasional: 5248000,
  totalLuasPapuaSelatan: 56650,
  perKomoditas: {
    batubara: { count: 4832, luasHa: 3200000 },
    nikel: { count: 1245, luasHa: 890000 },
    emas: { count: 678, luasHa: 520000 },
    besi: { count: 445, luasHa: 310000 },
    kuarsa: { count: 312, luasHa: 180000 },
    tembaga: { count: 289, luasHa: 148000 },
    lainnya: { count: 446, luasHa: 0 },
  },
  perProvinsi: [
    { name: 'Kalimantan Timur', count: 1845, luasHa: 1250000 },
    { name: 'Kalimantan Selatan', count: 1120, luasHa: 780000 },
    { name: 'Sumatera Selatan', count: 890, luasHa: 540000 },
    { name: 'Kalimantan Tengah', count: 756, luasHa: 480000 },
    { name: 'Sulawesi Tenggara', count: 645, luasHa: 390000 },
    { name: 'Sulawesi Tengah', count: 534, luasHa: 310000 },
    { name: 'Maluku Utara', count: 423, luasHa: 250000 },
    { name: 'Papua Tengah', count: 312, luasHa: 420000 },
    { name: 'Papua Selatan', count: 6, luasHa: 56650 },
    { name: 'Lainnya', count: 1716, luasHa: 772350 },
  ],
  perStatus: {
    operasiProduksi: 4123,
    eksplorasi: 2856,
    konstruksi: 689,
    terminasi: 579,
  },
};

export default iupMinerbaData;
