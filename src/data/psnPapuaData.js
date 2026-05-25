// ============================================================
// PSN Papua Selatan Data — Cross-DSS
// Klaster Food Estate + POI + Wilayah Adat
// ============================================================

export const psnClusters = {
  type: 'FeatureCollection',
  name: 'PSN_Papua_Selatan_Clusters',
  features: [
    {
      type: 'Feature',
      properties: {
        cluster_id: 'PSN-PADI-001',
        cluster_name: 'Sentra Padi Wanam I',
        commodity_type: 'PADI',
        target_area_ha: 125000,
        realisasi_ha: 42000,
        progress_persen: 33.6,
        distrik: 'Wanam',
        kabupaten: 'Merauke',
        target_produksi_ton: 750000,
        realisasi_produksi_ton: 189000,
        irigasi_km: 450,
        status: 'Dalam Pengerjaan',
        pengelola: 'BGN - Kementan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.25, -8.05], [140.45, -8.05], [140.45, -8.18], [140.25, -8.18], [140.25, -8.05]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        cluster_id: 'PSN-PADI-002',
        cluster_name: 'Sentra Padi Wanam II',
        commodity_type: 'PADI',
        target_area_ha: 85000,
        realisasi_ha: 18500,
        progress_persen: 21.8,
        distrik: 'Wanam',
        kabupaten: 'Merauke',
        target_produksi_ton: 510000,
        realisasi_produksi_ton: 74000,
        irigasi_km: 280,
        status: 'Perencanaan',
        pengelola: 'BGN - Kementan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.15, -8.18], [140.35, -8.18], [140.35, -8.32], [140.15, -8.32], [140.15, -8.18]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        cluster_id: 'PSN-TEBU-001',
        cluster_name: 'Perkebunan Tebu Ilwayab',
        commodity_type: 'TEBU',
        target_area_ha: 60000,
        realisasi_ha: 28000,
        progress_persen: 46.7,
        distrik: 'Ilwayab',
        kabupaten: 'Merauke',
        target_produksi_ton: 4200000,
        realisasi_produksi_ton: 1680000,
        status: 'Dalam Pengerjaan',
        pengelola: 'PTPN II - Kementan',
        pabrik_gula: 'PG Merauke I (kapasitas 12.000 TCD)',
        bioetanol: 'E10 Target 2027',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.50, -8.00], [140.70, -8.00], [140.70, -8.15], [140.50, -8.15], [140.50, -8.00]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        cluster_id: 'PSN-TEBU-002',
        cluster_name: 'Perkebunan Tebu Animha',
        commodity_type: 'TEBU',
        target_area_ha: 40000,
        realisasi_ha: 12000,
        progress_persen: 30.0,
        distrik: 'Animha',
        kabupaten: 'Merauke',
        target_produksi_ton: 2800000,
        realisasi_produksi_ton: 720000,
        status: 'Perencanaan',
        pengelola: 'PTPN II - Kementan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.10, -8.25], [140.30, -8.25], [140.30, -8.40], [140.10, -8.40], [140.10, -8.25]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        cluster_id: 'PSN-SAPI-001',
        cluster_name: 'Ranch Sapi Terpadu Merauke',
        commodity_type: 'PETERNAKAN_SAPI',
        target_area_ha: 50000,
        realisasi_ha: 15000,
        progress_persen: 30.0,
        distrik: 'Kurik',
        kabupaten: 'Merauke',
        target_populasi: 500000,
        realisasi_populasi: 85000,
        status: 'Dalam Pengerjaan',
        pengelola: 'Kementan - BUMN Peternakan',
        infrastruktur: 'Feedlot, RPH Modern, Cold Storage',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.30, -8.35], [140.55, -8.35], [140.55, -8.50], [140.30, -8.50], [140.30, -8.35]]]
      }
    },
  ]
};

export const poiData = {
  type: 'FeatureCollection',
  name: 'POI_Papua_Selatan',
  features: [
    // === LOGISTIK ===
    { type: 'Feature', properties: { poi_id: 'POI-L-001', poi_name: 'Pelabuhan Laut Wanam', category: 'LOGISTIK', sub_category: 'Pelabuhan Laut', icon: '⚓', metadata: { kapasitas: '15.000 DWT', fungsi: 'Gerbang Logistik PSN', operasional: 'Aktif 24 Jam' }}, geometry: { type: 'Point', coordinates: [140.52, -8.25] }},
    { type: 'Feature', properties: { poi_id: 'POI-L-002', poi_name: 'Dermaga CPO Merauke', category: 'LOGISTIK', sub_category: 'Dermaga CPO', icon: '🚢', metadata: { kapasitas: '8.000 DWT', fungsi: 'Ekspor CPO', komoditas: 'Crude Palm Oil' }}, geometry: { type: 'Point', coordinates: [140.38, -8.48] }},
    { type: 'Feature', properties: { poi_id: 'POI-L-003', poi_name: 'Gudang Logistik Bulog Merauke', category: 'LOGISTIK', sub_category: 'Gudang Bulog', icon: '🏭', metadata: { kapasitas: '50.000 Ton', komoditas: 'Beras, Gula, Pupuk' }}, geometry: { type: 'Point', coordinates: [140.40, -8.49] }},
    { type: 'Feature', properties: { poi_id: 'POI-L-004', poi_name: 'Trans-Papua Merauke-Boven Digoel', category: 'LOGISTIK', sub_category: 'Jalur Trans-Papua', icon: '🛤️', metadata: { panjang_km: 420, status: 'Konstruksi 68%', target: '2027' }}, geometry: { type: 'Point', coordinates: [140.35, -7.50] }},
    // === PRODUKSI ===
    { type: 'Feature', properties: { poi_id: 'POI-P-001', poi_name: 'PKS Merauke Rayon Jaya', category: 'PRODUKSI', sub_category: 'Pabrik Kelapa Sawit', icon: '🏭', metadata: { kapasitas: '60 Ton TBS/Jam', produksi_cpo: '42.800 Ton/Tahun', pemilik: 'PT. Merauke Rayon Jaya' }}, geometry: { type: 'Point', coordinates: [140.28, -8.15] }},
    { type: 'Feature', properties: { poi_id: 'POI-P-002', poi_name: 'PKS Korindo Wanam', category: 'PRODUKSI', sub_category: 'Pabrik Kelapa Sawit', icon: '🏭', metadata: { kapasitas: '90 Ton TBS/Jam', produksi_cpo: '78.500 Ton/Tahun', pemilik: 'PT. Korindo Papua Plantations' }}, geometry: { type: 'Point', coordinates: [140.52, -8.20] }},
    { type: 'Feature', properties: { poi_id: 'POI-P-003', poi_name: 'Pabrik Gula Merauke I', category: 'PRODUKSI', sub_category: 'Pabrik Gula', icon: '🏗️', metadata: { kapasitas: '12.000 TCD', target_produksi: '840.000 Ton Gula/Tahun', status: 'Konstruksi 45%' }}, geometry: { type: 'Point', coordinates: [140.60, -8.08] }},
    { type: 'Feature', properties: { poi_id: 'POI-P-004', poi_name: 'RMU Modern Wanam', category: 'PRODUKSI', sub_category: 'Rice Milling Unit', icon: '🌾', metadata: { kapasitas: '100 Ton/Hari', teknologi: 'Full Automated Japanese Grade', status: 'Operasional' }}, geometry: { type: 'Point', coordinates: [140.35, -8.10] }},
    { type: 'Feature', properties: { poi_id: 'POI-P-005', poi_name: 'Bioetanol Plant Ilwayab', category: 'PRODUKSI', sub_category: 'Pabrik Bioetanol', icon: '⚡', metadata: { kapasitas: '200.000 Liter/Hari', bahan_baku: 'Tetes Tebu (Molasses)', target: 'E10 Program 2027' }}, geometry: { type: 'Point', coordinates: [140.55, -8.05] }},
    { type: 'Feature', properties: { poi_id: 'POI-P-006', poi_name: 'Feedlot & RPH Modern Kurik', category: 'PRODUKSI', sub_category: 'Feedlot & RPH', icon: '🐄', metadata: { kapasitas_feedlot: '50.000 Ekor', kapasitas_rph: '500 Ekor/Hari', cold_storage: '2.000 Ton' }}, geometry: { type: 'Point', coordinates: [140.42, -8.40] }},
    // === WILAYAH ADAT ===
    { type: 'Feature', properties: { poi_id: 'POI-A-001', poi_name: 'Kampung Adat Suku Marind (Wendu)', category: 'WILAYAH_ADAT', sub_category: 'Kampung Adat', icon: '🏘️', metadata: { suku: 'Suku Marind', marga: 'Marga Gebze, Marga Mahuze', populasi: 2800, hak_ulayat: 'Diakui BPN', komoditas_lokal: 'Sagu, Kelapa, Berburu' }}, geometry: { type: 'Point', coordinates: [140.45, -8.20] }},
    { type: 'Feature', properties: { poi_id: 'POI-A-002', poi_name: 'Situs Ritual Pesta Babi (Titik Temu Adat)', category: 'WILAYAH_ADAT', sub_category: 'Situs Pesta Babi', icon: '🐗', metadata: { suku: 'Suku Marind', deskripsi: 'Lokasi upacara tradisional pertukaran babi dan ritual kesuburan', status_perlindungan: 'Sensitif - Radius 500m Disamarkan', frekuensi: 'Tahunan (Musim Kemarau)' }}, geometry: { type: 'Point', coordinates: [140.48, -8.22] }},
    { type: 'Feature', properties: { poi_id: 'POI-A-003', poi_name: 'Hutan Sagu Lindung Komunal', category: 'WILAYAH_ADAT', sub_category: 'Hutan Larangan', icon: '🌴', metadata: { suku: 'Suku Marind & Yei', luas_ha: 15000, deskripsi: 'Rawa sagu komunal sebagai sumber pangan utama masyarakat adat', status: 'Dilindungi Hukum Adat' }}, geometry: { type: 'Point', coordinates: [140.38, -8.18] }},
    { type: 'Feature', properties: { poi_id: 'POI-A-004', poi_name: 'Kampung Adat Suku Yei (Toray)', category: 'WILAYAH_ADAT', sub_category: 'Kampung Adat', icon: '🏘️', metadata: { suku: 'Suku Yei', populasi: 1200, hak_ulayat: 'Dalam Proses Pengakuan', mata_pencaharian: 'Meramu Sagu, Berburu, Perikanan' }}, geometry: { type: 'Point', coordinates: [140.55, -8.30] }},
    { type: 'Feature', properties: { poi_id: 'POI-A-005', poi_name: 'Kampung Adat Suku Awyu (Boven Digoel)', category: 'WILAYAH_ADAT', sub_category: 'Kampung Adat', icon: '🏘️', metadata: { suku: 'Suku Awyu', populasi: 3500, hak_ulayat: 'Sengketa dengan IUP', mata_pencaharian: 'Hutan Ulayat, Perkebunan Campuran' }}, geometry: { type: 'Point', coordinates: [140.60, -6.92] }},
    { type: 'Feature', properties: { poi_id: 'POI-A-006', poi_name: 'Kampung Adat Suku Muyu (Mindiptanah)', category: 'WILAYAH_ADAT', sub_category: 'Kampung Adat', icon: '🏘️', metadata: { suku: 'Suku Muyu', populasi: 4200, hak_ulayat: 'Diakui', mata_pencaharian: 'Pertanian Subsisten, Perikanan Darat' }}, geometry: { type: 'Point', coordinates: [140.72, -6.50] }},
    // === INFRASTRUKTUR ===
    { type: 'Feature', properties: { poi_id: 'POI-I-001', poi_name: 'Bandara Mopah Merauke', category: 'INFRASTRUKTUR', sub_category: 'Bandara', icon: '✈️', metadata: { kelas: 'Kelas II', landasan: '2.500m x 45m', penerbangan: 'Garuda, Sriwijaya, Wings Air' }}, geometry: { type: 'Point', coordinates: [140.42, -8.52] }},
    { type: 'Feature', properties: { poi_id: 'POI-I-002', poi_name: 'PLTU Merauke 2x25MW', category: 'INFRASTRUKTUR', sub_category: 'Pembangkit Listrik', icon: '⚡', metadata: { kapasitas: '50 MW', bahan_bakar: 'Batubara', status: 'Operasional' }}, geometry: { type: 'Point', coordinates: [140.35, -8.50] }},
    { type: 'Feature', properties: { poi_id: 'POI-I-003', poi_name: 'Bendungan Irigasi Wanam', category: 'INFRASTRUKTUR', sub_category: 'Bendungan', icon: '🌊', metadata: { kapasitas: '120 Juta m³', fungsi: 'Irigasi Sawah & Tebu', status: 'Konstruksi 72%' }}, geometry: { type: 'Point', coordinates: [140.30, -8.08] }},
  ]
};

export const wilayahAdatPolygons = {
  type: 'FeatureCollection',
  name: 'Wilayah_Adat_Papua_Selatan',
  features: [
    {
      type: 'Feature',
      properties: { adat_id: 'ADAT-001', nama: 'Wilayah Ulayat Suku Marind', suku: 'Marind', luas_ha: 45000, status: 'Diakui BPN' },
      geometry: { type: 'Polygon', coordinates: [[[140.30, -8.10], [140.60, -8.10], [140.60, -8.30], [140.30, -8.30], [140.30, -8.10]]] }
    },
    {
      type: 'Feature',
      properties: { adat_id: 'ADAT-002', nama: 'Wilayah Ulayat Suku Yei', suku: 'Yei', luas_ha: 28000, status: 'Dalam Proses' },
      geometry: { type: 'Polygon', coordinates: [[[140.45, -8.25], [140.70, -8.25], [140.70, -8.45], [140.45, -8.45], [140.45, -8.25]]] }
    },
    {
      type: 'Feature',
      properties: { adat_id: 'ADAT-003', nama: 'Wilayah Ulayat Suku Awyu', suku: 'Awyu', luas_ha: 52000, status: 'Sengketa' },
      geometry: { type: 'Polygon', coordinates: [[[140.45, -6.75], [140.80, -6.75], [140.80, -7.05], [140.45, -7.05], [140.45, -6.75]]] }
    },
    {
      type: 'Feature',
      properties: { adat_id: 'ADAT-004', nama: 'Wilayah Ulayat Suku Muyu', suku: 'Muyu', luas_ha: 38000, status: 'Diakui' },
      geometry: { type: 'Polygon', coordinates: [[[140.55, -6.35], [140.85, -6.35], [140.85, -6.65], [140.55, -6.65], [140.55, -6.35]]] }
    },
  ]
};

export const psnSummary = {
  totalKlaster: 5,
  targetLuasTotal: 360000,
  realisasiTotal: 115500,
  progressTotal: 32.1,
  perKomoditas: {
    padi: { klaster: 2, targetHa: 210000, realisasiHa: 60500, targetTon: 1260000, realisasiTon: 263000 },
    tebu: { klaster: 2, targetHa: 100000, realisasiHa: 40000, targetTon: 7000000, realisasiTon: 2400000 },
    sapi: { klaster: 1, targetHa: 50000, realisasiHa: 15000, targetPopulasi: 500000, realisasiPopulasi: 85000 },
  },
  totalPOI: 19,
  perKategoriPOI: { LOGISTIK: 4, PRODUKSI: 6, WILAYAH_ADAT: 6, INFRASTRUKTUR: 3 },
  totalWilayahAdat: 4,
  sukuTerdampak: ['Marind', 'Yei', 'Awyu', 'Muyu'],
};

export default { psnClusters, poiData, wilayahAdatPolygons, psnSummary };
